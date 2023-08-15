import { codeBlock, oneLine } from 'common-tags'
import { openAiAPIStream } from '@/app/openaiApiCall'
import { investigate , getSafeTurboPrompt } from '@/app/knowledge/investigate'

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
        2. Include all relevant resources from context. For each one, give a concise description.
        3. Include url that appeared in the context for each relavent resource.
        5. At the end of your answer, mention some aspect of the programs you gave and ask if the student's interested in learning more about it.
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