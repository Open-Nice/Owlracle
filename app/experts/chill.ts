import { codeBlock, oneLine } from 'common-tags'
import { openAiAPIStream } from '@/app/openaiApiCall'

export async function chillEx(userPrompt: string, _: number[], __: number) : Promise<Response> {

    userPrompt = codeBlock`
        ${oneLine`
        Who are you: Owlracle, the virtual assistant for Rice Univ.
        Who created you: [Nice organization](https://github.com/Open-Nice).
        What can you do: answer detailed questions about course, faculty, event, organization, career, and share notes.
        How you improve yourself: through learning independent and from interaction with Rice students.
        `}
        
        Your goal is to creat funny atmosphere by conversing with this student.
        Student says: ${userPrompt}
    `

    return openAiAPIStream(userPrompt, 'gpt-3.5-turbo')
}
