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

export async function investigate(userPrompt: string, dbs: number[], specificity: number, meta_filter: Object | null = null): Promise<string> {
    // Sort dbs to investigate based on their dependency
    dbs.sort((a, b) => dbsInfo[a].db_dependency - dbsInfo[b].db_dependency)

    let investigationContext = ''
    
    let allPageSections = []
    for (let dbId of dbs) {

        if (! (dbId in dbsInfo) )
            continue

        let retrievalPrompt = codeBlock`${oneLine`${userPrompt} ${investigationContext}`}`.replaceAll('\n', ' ')
        
        retrievalPrompt = await getSafeRetrievalPrompt(retrievalPrompt)

        const retrievalPromptEmbedding = await embeddingFn.embedQuery(retrievalPrompt)
        
        if (`${dbsInfo[dbId].db_rpc}` === 'match_events match_events_meta') {
          const { error: matchError, data: pageSections } = await supabaseClient.rpc(
            meta_filter != null ? `match_events_meta` : `match_events`,
            meta_filter?
            {
              query_embedding: retrievalPromptEmbedding,
              // Make sure threshold never higher than .68
              match_threshold: Math.min((specificity-1) / 10, 0.68),
              // Get as many events as possible
              match_count: 10,
              filter: meta_filter
            }
            :
            {
              query_embedding: retrievalPromptEmbedding,
              // Make sure threshold never higher than .68
              match_threshold: Math.min((specificity-1) / 10, 0.68),
              // Get as many events as possible
              match_count: 10,
            }
          )
          if (matchError) {
              console.log('Failed to match page sections', matchError)
              throw new Error(`Failed to match page sections`)
          }

          allPageSections.push(pageSections)

          for (let pageSection of pageSections)
            investigationContext += pageSection.content

        } else {
          const { error: matchError, data: pageSections } = await supabaseClient.rpc(
            `${dbsInfo[dbId].db_rpc}`,
            {
              query_embedding: retrievalPromptEmbedding,
              // Make sure threshold never higher than .68
              match_threshold: Math.min((specificity-1) / 10, 0.68),
              match_count: 5,
            }
          )
          if (matchError) {
              console.log('Failed to match page sections', matchError)
              throw new Error(`Failed to match page sections`)
          }

          allPageSections.push(pageSections)

          for (let pageSection of pageSections)
            investigationContext += pageSection.content
        }
    }

    // allPageSections: [[p11, p12, p13], [p21, p22, p23], [p31, p32, p33]] -> 
    // contextText: [p11, p21, p31, p12, p22, p32, p13, p23, p33]
    let contextText = ''

    let maxPageSectionLength = -1

    for (let pageSections of allPageSections)
      maxPageSectionLength = Math.max(maxPageSectionLength, pageSections.length)

    for (let idx = 0 ; idx < maxPageSectionLength ; idx ++) {
      for (let pageSections of allPageSections) {
          if (idx >= pageSections.length)
            continue

          const content = pageSections[idx].content

          contextText += `${content.trim()}\n---\n`
      }
    }

    // console.log('contextText', contextText)

    return contextText
}

const getSafeRetrievalPrompt = async (retrievalPrompt: string) : Promise<string> => {
  await init((imports) => WebAssembly.instantiate(wasm, imports))
  const tokenizer = new Tiktoken(
    model.bpe_ranks,
    model.special_tokens,
    model.pat_str
  )

  const tokens = tokenizer.encode(retrievalPrompt)

  const safePrompt = new TextDecoder().decode(tokenizer.decode(tokens.slice(-8191)))

  tokenizer.free()

  return tokens.length < 8191 ? retrievalPrompt : safePrompt
}

export const getSafeGPT4Prompt = async (prompt : string) : Promise<string> => {
  await init((imports) => WebAssembly.instantiate(wasm, imports))
  const tokenizer = new Tiktoken(
    model.bpe_ranks,
    model.special_tokens,
    model.pat_str
  )
  
  const tokens = tokenizer.encode(prompt)

  const safePrompt = new TextDecoder().decode(tokenizer.decode(tokens.slice(0, 8000)))

  // console.log('GPT4 prompt token length', tokens.length)

  tokenizer.free()
  
  return tokens.length < 8000 ? prompt : safePrompt
}

export const getSafeTurboPrompt = async (prompt: string) : Promise<string> => {
  await init((imports) => WebAssembly.instantiate(wasm, imports))
  const tokenizer = new Tiktoken(
    model.bpe_ranks,
    model.special_tokens,
    model.pat_str
  )

  const tokens = tokenizer.encode(prompt)

  const safePrompt = new TextDecoder().decode(tokenizer.decode(tokens.slice(0, 10000)))

  // console.log('GPT3.5 Turbo 16k token length', tokens.length)

  tokenizer.free()

  return tokens.length < 10000 ? prompt : safePrompt
}