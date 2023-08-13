import { codeBlock, oneLine } from 'common-tags'
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import GPT3Tokenizer from 'gpt3-tokenizer'
import { dbIdRpcMap } from '@/app/experts/course'
import { supabaseClient } from '@/app/supaClient'
import { openAiAPIStream } from '@/app/openaiApiCall'

export const runtime = 'edge'

const embeddingFn = new OpenAIEmbeddings()

export async function programEx(userPrompt: string, dbs: number[]) : Promise<Response> {
    
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
                match_count: Math.floor(3),
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

    return openAiAPIStream(userPrompt, 'gpt-3.5-turbo')
}