// @ts-expect-error
import wasm from "@dqbd/tiktoken/lite/tiktoken_bg.wasm?module"
import model from "@dqbd/tiktoken/encoders/cl100k_base.json"
import { init, Tiktoken } from "@dqbd/tiktoken/lite/init"

import { supabaseClient } from '@/app/supaClient'
import { codeBlock, oneLine } from 'common-tags'
import { OpenAIEmbeddings } from "langchain/embeddings/openai"

import { dbsInfo } from '@/app/knowledge/knowledge'

export const config = { runtime: "edge" }

const embeddingFn = new OpenAIEmbeddings()

const getSafeRetrievalPrompt = (retrievalPrompt: string, tokenizer: Tiktoken) : string => {
  const tokens = tokenizer.encode(retrievalPrompt)

  return tokens.length < 8191 ? retrievalPrompt : new TextDecoder().decode(tokenizer.decode(tokens.slice(-8191)))
}

export async function investigate(userPrompt: string, dbs: number[], specificity: number): Promise<string> {
    // Sort dbs to investigate based on their dependency
    dbs.sort((a, b) => dbsInfo[a].db_dependency - dbsInfo[b].db_dependency)

    await init((imports) => WebAssembly.instantiate(wasm, imports))
    const tokenizer = new Tiktoken(
      model.bpe_ranks,
      model.special_tokens,
      model.pat_str
    )

    let investigationContext = ''
    
    let allPageSections = []
    for (let dbId of dbs) {

        if (! (dbId in dbsInfo) )
            continue

        let retrievalPrompt = codeBlock`${oneLine`${userPrompt} ${investigationContext}`}`.replaceAll('\n', ' ')
        
        retrievalPrompt = getSafeRetrievalPrompt(retrievalPrompt, tokenizer)

        const retrievalPromptEmbedding = await embeddingFn.embedQuery(retrievalPrompt)
        
        const { error: matchError, data: pageSections } = await supabaseClient.rpc(
          `${dbsInfo[dbId].db_rpc}`,
          {
            query_embedding: retrievalPromptEmbedding,
            match_threshold: 0.3,
            match_count: specificity === 1 ? 2 : 5,
          }
        )
        if (matchError) {
            console.log('Failed to match page sections', matchError)
            throw new Error(`Failed to match page sections`)
        }

        // console.log('db_rpc', `${dbsInfo[dbId].db_rpc}`)

        // console.log('retrievalPrompt', retrievalPrompt)

        // console.log('pageSections', pageSections)

        // console.log('\n\n\n')

        allPageSections.push(pageSections)

        for (let pageSection of pageSections)
          investigationContext += pageSection.content
    }

    // allPageSections: [[p11, p12, p13], [p21, p22, p23], [p31, p32, p33]] -> 
    // contextText: [p11, p21, p31, p12, p22, p32, p13, p23, p33]
    let tokenCount = 0
    let contextText = ''

    let maxPageSectionLength = -1

    for (let pageSections of allPageSections)
      maxPageSectionLength = Math.max(maxPageSectionLength, pageSections.length)

    for (let idx = 0 ; idx < maxPageSectionLength ; idx ++) {
      for (let pageSections of allPageSections) {
          if (idx >= pageSections.length)
            continue

          const content = pageSections[idx].content
          const numTokens = tokenizer.encode(content).length

          // if (tokenCount + numTokens >= 3900)
            // continue

          contextText += `${content.trim()}\n---\n`
          tokenCount += numTokens
      }
    }

    tokenizer.free()

    // console.log('contextText', contextText)

    return contextText
}


export const getSafeTurboPrompt = async (prompt: string) : Promise<string> => {
  await init((imports) => WebAssembly.instantiate(wasm, imports))
  const tokenizer = new Tiktoken(
    model.bpe_ranks,
    model.special_tokens,
    model.pat_str
  )

  const tokens = tokenizer.encode(prompt)

  // console.log('token length', tokens.length)

  return tokens.length < 10000 ? prompt : new TextDecoder().decode(tokenizer.decode(tokens.slice(0, 10000)))
}