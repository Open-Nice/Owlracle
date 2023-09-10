import { kv } from '@vercel/kv'
import { Message, OpenAIStream, StreamingTextResponse } from 'ai'
import { codeBlock, oneLine } from 'common-tags'
import { auth } from '@/auth'
import { nanoid } from '@/lib/utils'
import { openAiAPIcall, openAiAPIStream } from '@/app/openaiApiCall'
import { getSafeGPT4Prompt } from '@/app/knowledge/investigate'

import { dbsInfo } from '@/app/knowledge/knowledge'
import { expertsInfo } from '@/app/experts/expert'

export const runtime = 'edge'

export async function POST(req: Request) {
  const json = await req.json()
  const { messages } = json
  const userId = (await auth())?.user.id

  if (!userId) {
    return new Response('Unauthorized', {
      status: 401
    })
  }

  // Contexual memory for the previous conversation
  const chatHistory: Message[]  = messages.slice(-3, -1)
  let memory = ''
  memory += `${chatHistory.map(entry => `${entry.role}: "${entry.content}"`).join('\n')}`

  let userPrompt = messages[messages.length - 1].content
  const eAk = await whichEaK(userPrompt, memory)

  const expert = eAk.match(/E: (\d+)/)
  const dbs = eAk.match(/K: \[(.*?)\]/)
  const specificity = eAk.match(/S: (\d+)/)

  if (!(expert && dbs && specificity))
      throw new Error('whichEaK returns an anomaly string.')

  const expertId: number = parseInt(expert[1])
  const dbIds: number[] = dbs[1].split(',').map(Number)
  const specScaler: number = parseInt(specificity[1])

  if ( chatHistory.length > 0 ) {
    userPrompt += `
      Here are the past conversation between you and user:
      ${memory}
    `
  }

  const answer = await consultExpert(expertId, dbIds, specScaler, userPrompt)

  const stream = OpenAIStream(answer, {
    async onCompletion(completion) {
      const title = json.messages[0].content.substring(0, 100)
      const id = json.id ?? nanoid()
      const createdAt = Date.now()
      const path = `/chat/${id}`
      const payload = {
        id,
        title,
        userId,
        createdAt,
        path,
        messages: [
          ...messages,
          {
            content: completion,
            role: 'assistant'
          }
        ]
      }
      await kv.hmset(`chat:${id}`, payload)
      await kv.zadd(`user:chat:${userId}`, {
        score: createdAt,
        member: `chat:${id}`
      })
    }
  })

  return new StreamingTextResponse(stream)
}

const consultExpert = async (expert: number, dbs: number[], specScaler: number, userPrompt: string) : Promise<Response> => {
  console.log('expertId', expert)
  console.log('dbIds', dbs)
  console.log('specificity', specScaler)
  console.log('userPrompt', userPrompt)

  if (expertsInfo[expert] && expertsInfo[expert].expert_function)
    return expertsInfo[expert].expert_function!(userPrompt, dbs, specScaler)

  return openAiAPIStream('say "Sorry I cannot solve this problem currently. I have noted it down on my things to learn."', 'gpt-3.5-turbo')
}


const whichEaK = async (userPrompt: string, memory: string) : Promise<string> => {

  let prompt = codeBlock`
    ${oneLine`
    You are in command of a group of experts from rice university and knowledge database. The experts and database are decoupled.
    The student asked a question. To answer the question, you job is to come up with
    1. only ONE single expert.
    2. all knowledge databases you think would be important. This could be zero.
    3. On the scale of 1 to 10 how specific is the student's question? 1 being not specific and 10 being very specific.

    Here are the experts' numeric id and what they can do:
    ${Object.entries(expertsInfo)
      .map(([key, { expert_name, expert_description }]) => `${key}. ${expert_name}: "${expert_description}"`)
      .join('\n  ')
    }

    Here are the knowledge databases' numeric id and what they contain:
    ${Object.entries(dbsInfo)
      .map(([key, { db_name, db_description }]) => `${key}. ${db_name}: ${db_description}`)
      .join('\n  ')}
    `}

    Format your answer as:
    E: one single expert id (1-10)
    K: [db_id1, db_id2, ...] (1-12)
    S: a scalar (1-10)

    This is the student prompt:
    ${userPrompt}
    ${
      memory != '' 
      ?
      `This is the history conversation between you and student in case you need: ${memory}`:''
    }
  `

  prompt = await getSafeGPT4Prompt(prompt)

  return openAiAPIcall(prompt, 'gpt-4')
}