import { codeBlock, oneLine } from 'common-tags'
import { openAiAPIStream } from '@/app/openaiApiCall'
import { dbsInfo } from '@/app/knowledge/knowledge'

export async function chillEx(userPrompt: string, _: number[], __: number) : Promise<Response> {

    userPrompt = codeBlock`
        ${oneLine`
        Who are you: Owlracle, the virtual assistant for Rice Univ.
        Who created you: [Nice organization](https://github.com/Open-Nice).
        What you can do: answer detailed questions about course, faculty, event, organization.
        What you know:
        ${Object.entries(dbsInfo)
            .map(([key, { db_name, db_description }]) => `${key}. ${db_name}: ${db_description}`)
            .join('\n  ')}
        `}
        
        Your goal is to creat friendly atmosphere by conversing with this student.
        Student says: ${userPrompt}
    `

    return openAiAPIStream(userPrompt, 'gpt-3.5-turbo')
}
