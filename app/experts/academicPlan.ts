import { codeBlock, oneLine } from 'common-tags'
import { openAiAPIStream } from '@/app/openaiApiCall'
import { investigate , getSafeTurboPrompt } from '@/app/knowledge/investigate'
import { substitute } from '@/app/experts/course'
import { promptPrinciple } from '@/app/experts/expert'

export const runtime = 'edge'

export async function academicPlanEx(userPrompt: string, dbs: number[], specificity: number, memory: string) : Promise<Response> {
    
    // Convert unrecognized tokens 'COMP 140' -> 'computational thinking'
    userPrompt = await substitute(userPrompt)

    const contextText = await investigate(userPrompt, dbs, specificity)

    // console.log(contextText)

    userPrompt = codeBlock`
        Student question: ${userPrompt}

        ${memory !== '' ? `Here are the past conversation between you and user in case you need: ${memory}`
        :
        ''
        }

        ${oneLine`
        You are an academic plan expert for Rice Univ. students.
        Answer question above using context below concisely and accurately.
        In your answer:
        1. Format your answer in chunks for readability.
        2. Use detailed reasoning in your answer to provide the best possible guidance.
        3. Only include urls that appeared in the context for each relavent reference.
        4. Include all relevant sources from context.
        5. ${promptPrinciple['Ask what you do not know']}
        `}
        
        Context:
        ${contextText}
        Answer in markdown:
    `

    userPrompt = await getSafeTurboPrompt(userPrompt)

    return openAiAPIStream(userPrompt, 'gpt-3.5-turbo-16k')
}