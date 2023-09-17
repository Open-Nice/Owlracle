import { codeBlock, oneLine } from 'common-tags'
import { openAiAPIStream } from '@/app/openaiApiCall'
import { investigate , getSafeTurboPrompt } from '@/app/knowledge/investigate'
import { promptPrinciple } from '@/app/experts/expert'

export const runtime = 'edge'

export async function careerEx(userPrompt: string, dbs: number[], specificity: number, memory: string) : Promise<Response> {
    
    const contextText = await investigate(userPrompt, dbs, specificity)

    // console.log(contextText)

    userPrompt = codeBlock`
        Student question: ${userPrompt}

        ${memory !== '' ? `Here are the past conversation between you and user in case you need: ${memory}`
        :
        ''
        }

        ${oneLine`
        You are a career expert for Rice Univ. students.
        Answer question above using context below concisely and accurately.
        In your answer:
        1. Format your answer in chunks for readability.
        2. Only include urls that appeared in the context for each relavent resource.
        3. Include all relevant resources from context. For each one, give a concise description.
        4. At the end of your answer, mention some aspect of the career advice you gave and ask if the student's interested in learning more about it.
        5. ${promptPrinciple['Ask what you do not know']}
        `}
        
        Context:
        ${contextText}
        Answer in markdown:
    `

    userPrompt = await getSafeTurboPrompt(userPrompt)

    return openAiAPIStream(userPrompt, 'gpt-3.5-turbo-16k')
}