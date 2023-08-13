import { codeBlock, oneLine } from 'common-tags'
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import GPT3Tokenizer from 'gpt3-tokenizer'
import { dbIdRpcMap } from '@/app/experts/course'
import { supabaseClient } from '@/app/supaClient'
import { openAiAPIcall, openAiAPIStream } from '@/app/openaiApiCall'

export const runtime = 'edge'

const embeddingFn = new OpenAIEmbeddings()

export async function noteEx(userPrompt: string, dbs: number[]) : Promise<Response> {
    
    // Create embedding for prompt
    const embed = await embeddingFn.embedQuery(userPrompt.replaceAll('\n', ' '))

    // Retrieve contexts
    let combinedPageSections = []
    for (let dbId of dbs) {

        if (dbId in dbIdRpcMap) {
            const { error: matchError, data: pageSections } = await supabaseClient.rpc(
                `${dbIdRpcMap[dbId]}`,
                {
                query_embedding: embed,
                match_threshold: 0.78,
                match_count: Math.floor(5),
                }
            )
            if (matchError) {
                console.log('Failed to match page sections', matchError)
                throw new Error(`Failed to match page sections`)
            }
            combinedPageSections.push(...pageSections)
        }
    }


    const tokenizer = new GPT3Tokenizer({ type: 'gpt3' })
    let tokenCount = 0
    let contextText = ''

    for(let pageSection of combinedPageSections) {
      const content = pageSection.content
      const encoded = tokenizer.encode(content)
      tokenCount += encoded.text.length

      if (tokenCount >= 4000)
        break

      contextText += `${content.trim()}\n---\n`
    }

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

    return openAiAPIStream(userPrompt, 'gpt-3.5-turbo')
}