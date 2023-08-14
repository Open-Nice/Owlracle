import { codeBlock, oneLine } from 'common-tags'
import { OpenAIEmbeddings } from 'langchain/embeddings/openai'
import GPT3Tokenizer from 'gpt3-tokenizer'
import { supabaseClient } from '@/app/supaClient'
import { openAiAPIStream } from '@/app/openaiApiCall'
import { substitute } from './expertTools'

export const runtime = 'edge'

const embeddingFn = new OpenAIEmbeddings()

export const dbIdRpcMap: { [key: number]: string } = {
  1: 'match_courses', // Course basic info
  2: 'match_open_courses', // Course open status
  3: 'match_eval_comments', // Course evaluation comments
  4: 'match_eval_scores', // Course evaluation scores
  5: 'match_faculties', // Faculties
  // 6: '', // Notes
  7: 'match_events', // Events
  8: 'match_organizations', // Clubs
  9: 'match_careers', // Career
  10: 'match_academic_resources', // Academic resources
  11: 'match_course_roadmap', // Course roadmap
  12: 'match_program_resources' // Program resources
  // 13: '' // Major requirement
}

export async function BaseEx(
  userPrompt: string,
  dbs: number[],
  expertPrompt: string
): Promise<Response> {
  userPrompt = await substitute(userPrompt)
  console.log(userPrompt)
  // Create embedding for prompt
  const embed = await embeddingFn.embedQuery(userPrompt.replaceAll('\n', ' '))

  // Retrieve contexts
  let combinedPageSections = []
  for (let dbId of dbs) {
    if (dbId in dbIdRpcMap) {
      const { error: matchError, data: pageSections } =
        await supabaseClient.rpc(`${dbIdRpcMap[dbId]}`, {
          query_embedding: embed,
          match_threshold: 0.78,
          match_count: 3
        })
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

  for (let pageSection of combinedPageSections) {
    const content = pageSection.content
    const encoded = tokenizer.encode(content)
    tokenCount += encoded.text.length

    if (tokenCount >= 4000) break

    contextText += `${content.trim()}\n---\n`
  }

  userPrompt = codeBlock`
        Student question: ${userPrompt}

        ${oneLine`
        ${expertPrompt}
        Answer above question using context below concisely and accurately.
        In your answer:
        1. Format your answer in chunks for readability.
        2. Use detailed reasoning in your answer to provide the best possible guidance.
        3. Include all relevant sources from context.
        4. Include url that appeared in the context for each relevant reference.
        5. At the end of your answer, mention some aspect of the courses you gave and ask if the student's interested in learning more about it.
        6. If you are unsure how to answer, say 
        "Sorry, I don't know how to help with that. I have kept in mind to learn this next time we meet."
        `}
        
        Context:
        ${contextText}
        Answer in markdown:
    `

  return openAiAPIStream(userPrompt, 'gpt-3.5-turbo')
}
