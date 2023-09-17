import { codeBlock, oneLine } from 'common-tags'
import { openAiAPIStream } from '@/app/openaiApiCall'
import { investigate , getSafeTurboPrompt } from '@/app/knowledge/investigate'
import { promptPrinciple } from '@/app/experts/expert'

export const runtime = 'edge'

export async function clubEx(userPrompt: string, dbs: number[], specificity: number, memory: string) : Promise<Response> {
    
    const contextText = await investigate(userPrompt, dbs, specificity)

    // console.log(contextText)

    userPrompt = codeBlock`
        Student question: ${userPrompt}

        ${memory !== '' ? `Here are the past conversation between you and user in case you need: ${memory}`
        :
        ''
        }

        ${oneLine`
        You are a club and organization expert for Rice Univ. students.
        Answer question above using context below concisely and accurately.
        In your answer:
        1. Present clubs bundled in categories: e.g. academics, entertianment, social, sports, etc. Show the category first coupled with emojis you see fit.
        2. Only include urls that appeared in the context for each relavent club.
        3. Only include relevant clubs from context. No need to cover all faculties.
        4. ${promptPrinciple['Ask what you do not know']}
        `}
        
        Context:
        ${contextText}
        Answer in markdown:
    `

    userPrompt = await getSafeTurboPrompt(userPrompt)

    return openAiAPIStream(userPrompt, 'gpt-3.5-turbo-16k')
}