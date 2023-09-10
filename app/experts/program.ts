import { codeBlock, oneLine } from 'common-tags'
import { openAiAPIStream } from '@/app/openaiApiCall'
import { investigate , getSafeTurboPrompt } from '@/app/knowledge/investigate'
import { promptPrinciple } from '@/app/experts/expert'

export const runtime = 'edge'

export async function programEx(userPrompt: string, dbs: number[], specificity: number) : Promise<Response> {
    
    const contextText = await investigate(userPrompt, dbs, specificity)

    // console.log(contextText)

    userPrompt = codeBlock`
        Student question: ${userPrompt}

        ${oneLine`
        You are a program recommender to Rice Univ. student.
        Answer above question using context below concisely and accurately.
        In your answer:
        1. Format your answer in chunks for readability.
        2. Include all urls that appeared in the context for each relavent resource.
        3. Include all relevant resources from context. For each one, give a concise description.
        4. ${promptPrinciple['Ask what you do not know']}
        `}
        
        Context:
        ${contextText}
        Answer in markdown:
    `
    
    userPrompt = await getSafeTurboPrompt(userPrompt)

    return openAiAPIStream(userPrompt, 'gpt-3.5-turbo-16k')
}