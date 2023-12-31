import { codeBlock, oneLine } from 'common-tags'
import { openAiAPIStream } from '@/app/openaiApiCall'
import { investigate , getSafeTurboPrompt } from '@/app/knowledge/investigate'
import { substitute } from '@/app/experts/course'
import { promptPrinciple } from '@/app/experts/expert'

export const runtime = 'edge'

export async function facultyEx(userPrompt: string, dbs: number[], specificity: number, memory: string) : Promise<Response> {
    
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
        You are a faculty expert for Rice Univ. students.
        Answer question above using context below concisely and accurately.
        In your answer:
        1. Present faculties in different categories based on their research background similarity and differences. Show the category first.
        2. Only include urls that appeared in the context for each relavent faculty.
        3. Only include relevant faculties from context. No need to cover all faculties.
        4. Give a concise description for each professor especially what is special about him/her.
        5. ${promptPrinciple['Ask what you do not know']}
        `}
        
        Context:
        ${contextText}
        Answer in markdown:
    `

    userPrompt = await getSafeTurboPrompt(userPrompt)

    return openAiAPIStream(userPrompt, 'gpt-3.5-turbo-16k')
}