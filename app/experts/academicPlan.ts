import { codeBlock, oneLine } from 'common-tags'
import { openAiAPIStream } from '@/app/openaiApiCall'
import { investigate , getSafeTurboPrompt } from '@/app/knowledge/investigate'
import { substitute } from '@/app/experts/course'

export const runtime = 'edge'

export async function academicPlanEx(userPrompt: string, dbs: number[], specificity: number) : Promise<Response> {
    
    // Convert unrecognized tokens 'COMP 140' -> 'computational thinking'
    userPrompt = await substitute(userPrompt)

    const contextText = await investigate(userPrompt, dbs, specificity)

    // console.log(contextText)

    userPrompt = codeBlock`
        Student question: ${userPrompt}

        ${oneLine`
        You are an academic plan expert for Rice Univ. students.
        Answer question above using context below concisely and accurately.
        In your answer:
        1. Format your answer in chunks for readability.
        2. Use detailed reasoning in your answer to provide the best possible guidance.
        3. Only include urls that appeared in the context for each relavent reference.
        4. Include all relevant sources from context.
        5. At the end of your answer, mention some aspect of the plan you gave and ask if the student's interested in learning more about it.
        6. If you are unsure how to answer, say 
        "Sorry, I don't know how to help with that. I have kept in mind to learn this next time we meet."
        `}
        
        Context:
        ${contextText}
        Answer in markdown:
    `

    userPrompt = await getSafeTurboPrompt(userPrompt)

    return openAiAPIStream(userPrompt, 'gpt-3.5-turbo-16k')
}