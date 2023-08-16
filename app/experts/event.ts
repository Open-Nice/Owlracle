import { codeBlock, oneLine } from 'common-tags'
import { openAiAPIStream } from '@/app/openaiApiCall'
import { investigate , getSafeTurboPrompt } from '@/app/knowledge/investigate'

export const runtime = 'edge'

export async function eventEx(userPrompt: string, dbs: number[], specificity: number) : Promise<Response> {
    
    const contextText = await investigate(userPrompt, dbs, specificity)

    // console.log(contextText)

    userPrompt = codeBlock`
        Student question: ${userPrompt}

        ${oneLine`
        You are a club and organization expert for Rice Univ. students.
        Answer question above using context below concisely and accurately.
        In your answer:
        1. Present clubs bundled in categories: e.g. academics, entertianment, social, sports, etc. Show the category first coupled with emojis you see fit.
        2. Only include urls that appeared in the context for each relavent club.
        3. Include all relevant clubs from context. For each one, give a concise description.
        4. At the end of your answer, mention some aspect of the clubs you gave and ask if the student's interested in learning more about it.
        5. If you are unsure how to answer, say 
        "Sorry, I don't know how to help with that. I have kept in mind to learn this next time we meet."
        `}
        
        Context:
        ${contextText}
        Answer in markdown:
    `

    userPrompt = await getSafeTurboPrompt(userPrompt)

    return openAiAPIStream(userPrompt, 'gpt-3.5-turbo-16k')
}