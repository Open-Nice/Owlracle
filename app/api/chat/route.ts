import { kv } from '@vercel/kv'
import { OpenAIStream, StreamingTextResponse } from 'ai'
import { codeBlock, oneLine } from 'common-tags'
import { auth } from '@/auth'
import { nanoid } from '@/lib/utils'
import { openAiAPIcall, openAiAPIStream } from '@/app/openaiApiCall'


import { chillEx } from '@/app/experts/chill'
// import { courseEx } from '@/app/experts/course'
// import { clubEx } from '@/app/experts/club'
// import { eventEx } from '@/app/experts/event'
// import { facultyEx } from '@/app/experts/faculty'
// import { careerEx } from '@/app/experts/career'
// import { academicPlanEx } from '@/app/experts/academicPlan'
// import { programEx } from '@/app/experts/program'
import { BaseEx } from '@/app/experts/base'

// import { noteEx } from '@/app/experts/note'


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

  const userPrompt = messages[messages.length-1].content

  const eAk = await whichEaK(userPrompt)

  const expert = eAk.match(/E: (\d+)/)
  const dbs = eAk.match(/K: \[(.*?)\]/)
  const spc = eAk.match(/S: (\d+)/)

  if (!(expert && dbs))
      throw new Error('whichEaK returns an anomaly string.')

  const expertId: number = parseInt(expert[1])
  //If spcScale is null, that default is 3
  const spcScale = (spc && Math.max(3, Math.min(7, parseInt(spc[1])))) ?? 3;
  const dbIds: number[] = dbs[1].split(',').map(Number)
  const answer = await consultExpert(expertId, dbIds, userPrompt, spcScale/10)

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

const consultExpert = async (expert: number, dbs: number[], userPrompt: string, spcScale: number) : Promise<Response> => {
  console.log('expertId', expert)
  console.log('dbIds', dbs)
  console.log('spcScale',spcScale)

  const expertIdFnMap : {[key: number] : string } = {
    // 1: chillEx,
    // 2: , 
    3: `You are a course expert to Rice Univ. student.`,
    4: `You are an event expert for Rice Univ. students.`,
    5: `You are a club and organization expert for Rice Univ. students.`,
    6: `You are a faculty expert for Rice Univ. students.`,
    // // 7: ,
    8: `You are a career expert for Rice Univ. students.`,
    9: `You are an academic plan expert for Rice Univ. students.`,
    10: `You are a program recommender to Rice Univ. student.`
  }

  if (expert in expertIdFnMap)
    return BaseEx(userPrompt, dbs, expertIdFnMap[expert], spcScale)
  else if (expert == 1)
    return chillEx(userPrompt, dbs)

  return openAiAPIStream('say "Sorry I cannot solve this problem currently. I have noted it down on my things to learn."', 'gpt-3.5-turbo')
}


const whichEaK = async (userPrompt: string) : Promise<string> => {

  const prompt = codeBlock`
    ${oneLine`
    You are in command of a group of experts from rice university and knowledge database. The experts and databases are decoupled.
    The user asked a question To answer the question, you job is to come up with
    1. only ONE single expert.
    2. all knowledge databases you think would be important. This could be zero.
    3. On a scale of 1 to 10 how specific is the student's question? 1 being not specific and 10 being very specific.

    Here are the experts' numeric id and what they can do:
    1. Everyday conversation expert: "good at normal conversation and doesn't accept any knowledge database."
    2. Confusion/ambiguity expert: "Sometimes user asked something or used a term we don't understand. I can ask user what he meant."
    3. Course expert: "answer questions or recommend courses."
    4. Event expert: "answer questions or recommend recent school events."
    5. Club expert: "answer questions or recommend school clubs."
    6. Faculty expert: "answer questions or recommend faculty."
    7. Notes expert: "answer requests that ask for lecture notes."
    8. Career expert: "answer questions or recommend resources for career in industry or PHD."
    9. Academic planner: "help students plan their major, e.g. what courses to take in each semester."
    10. Resource recommender: "Recommend programs inside Rice Univeristy ot help students."

    Here are the knowledge databases' numeric id and what they contain:
    1. Courses: course name, credit hour, department, description, grade_mode.
    2. Course open status: which courses open in the upcoming semester.
    3. Course evaluation comments: students' comments on course and instructor.
    4. Course evaluation scores: students' scores on course and instructor e.g. course workload, quality and difficulty.
    5. Faculties: faculty research background.
    6. Notes: urls that points to lecture notes.
    7. Events: recent school events.
    8. Clubs: school clubs and their description.
    9. Career: industry and PHD career resources for each different majors.
    10. Academic resources: rice internal resources to support each major.
    11. Course roadmap: what coureses to take for each semester for different majors.
    12. Program resources: unique programs to boost student growth, such as leadership development.
    13. Major requirements: what courses are needed to complete a specific major degree.
    `}

    Format your answer as:
    E: one single expert id (1-9)
    K: [db_id1, db_id2, ...] (1-12)
    S: a scalar (1-10)

    This is the user prompt:
    ${userPrompt}
  `

  return openAiAPIcall(prompt, 'gpt-4')
}