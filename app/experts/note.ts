import { codeBlock, oneLine } from 'common-tags'
import { openAiAPIStream } from '@/app/openaiApiCall'
import { investigate , getSafeTurboPrompt } from '@/app/knowledge/investigate'
import { substitute } from '@/app/experts/course'

export const runtime = 'edge'

export async function noteEx(userPrompt: string, dbs: number[], specificity: number) : Promise<Response> {
    
    // Convert unrecognized tokens 'COMP 140' -> 'computational thinking'
    userPrompt = await substitute(userPrompt)

    const contextText = await investigate(userPrompt, dbs, specificity)

    // console.log(contextText)

    userPrompt = codeBlock`
        Student question: ${userPrompt}

        ${oneLine`
        Your goal is to give notes resources to Rice Univ. students based on their request.
        Answer student's question above about Rice Univ. events using context below concisely and accurately.
        Include in your answer all relevant information from context.
        At the end of your response, mention some aspect of the info you gave and ask if student's interested in learning more about it.
        If you are unsure about your answer, say 
        "Sorry, I don't know how to help with that. I have kept in mind to learn this next time we meet."
        `}
        
        Context:
        ${contextText}
        Answer in markdown:
    `

    userPrompt = await getSafeTurboPrompt(userPrompt)

    return openAiAPIStream(userPrompt, 'gpt-3.5-turbo-16k')
}