import { auth } from '@/auth'
import { type Message } from 'ai'
import { codeBlock, oneLine } from 'common-tags'
import { openAiAPIcall } from '@/app/openaiApiCall'
import { dbsInfo } from '@/app/knowledge/knowledge'

export const runtime = 'edge'

export async function POST(req: Request) {
    const userId = (await auth())?.user.id

    if (!userId) {
      return new Response('Unauthorized', {
        status: 401
      })
    }

    const json = await req.json()
    const { messages }: { messages: Message[] } = json
    const message_str = messages.map((message, _) => message.content).join(',')

    const prompt = codeBlock`
      Student Question: ${message_str}

      ${oneLine`
        You are a creative question recommender.
        Your job is to list exactly 3 relevant, simple, and concise questions regarding the message provided above that involve data from the following databases.
        Each question should be no more than 15 words.
        Make sure that the questions are diverse so that user WANTS to ask them all.
        Here are the knowledge databases and what they contain:
        ${Object.entries(dbsInfo)
          .map(([key, { db_name, db_description }]) => `${key}. ${db_name}: ${db_description}`)
          .join('\n  ')}
      `}
      
      Format your answer exactly as this:
      1. Question 1
      2. Question 2
      3. Question 3
    `

    // console.log(prompt)
    
    // Set a high temperature for creativity
    const questions = await openAiAPIcall(prompt, 'gpt-3.5-turbo', 0.9)

    const regex = /\d+\.\s*(.*)/g

    let matches
    let questionList: string[] = []

    while ((matches = regex.exec(questions)) !== null)
      questionList.push(matches[1])

    // console.log(questionList)

    return new Response(
        JSON.stringify( { questionList } ),
        {
          status: 200,
          headers: {
            'content-type': 'application/json',
            'cache-control': 'public, s-maxage=10, stale-while-revalidate=60',
          },
        }
      )
}