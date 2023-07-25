import { kv } from '@vercel/kv'
import { createClient } from "@supabase/supabase-js";
import { codeBlock, oneLine } from 'common-tags'
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { OpenAIStream, StreamingTextResponse } from 'ai'
import { 
  Configuration, 
  OpenAIApi,
  ChatCompletionRequestMessage
} from 'openai-edge'
import GPT3Tokenizer from 'gpt3-tokenizer'
import { auth } from '@/auth'
import { nanoid } from '@/lib/utils'

export const runtime = 'edge'

const openaiKey = process.env.OPENAI_API_KEY
if (!openaiKey) throw new Error(`Expected env var OPENAI_API_KEY`)
const configuration = new Configuration({apiKey: openaiKey})
const openai = new OpenAIApi(configuration)
const embeddingFn = new OpenAIEmbeddings();

const supabaseUrl = process.env.SUPABASE_URL
if (!supabaseUrl) throw new Error(`Expected env var SUPABASE_URL`)

const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY
if (!supabaseServiceKey) throw new Error(`Expected env var SUPABASE_SERVICE_KEY`)


export async function POST(req: Request) {
  const json = await req.json()
  const { messages, previewToken } = json
  const userId = (await auth())?.user.id

  if (!userId) {
    return new Response('Unauthorized', {
      status: 401
    })
  }

  if (previewToken) {
    configuration.apiKey = previewToken
  }

  // Get user query
  const query = messages[messages.length-1].content
  console.log("query:", query);
  const sanitizedQuery = query.trim()

  // Create embedding from query
  const queryEmbedding = await embeddingFn.embedQuery(sanitizedQuery.replaceAll('\n', ' '));
  // console.log("queryEmbedding:", queryEmbedding);

  // Connect to vector DB
  const supabaseClient = createClient(supabaseUrl!, supabaseServiceKey!)

  // Similarity search
  const { error: matchError, data: pageSections } = await supabaseClient.rpc(
    'match_faculties',
    {
      query_embedding: queryEmbedding,
      // match_threshold: 0.78,
      match_count: 10,
      // min_content_length: 50,
    }
  )
  if (matchError) {
    console.log('Failed to match page sections', matchError)
    throw new Error(`Failed to match page sections`)
  } else {
    console.log('Retreival successful:', pageSections)
  }

  // Similarity search using langchain: Maybe implement this later ?
  // const vectorStore = new SupabaseVectorStore(
  //                                   embeddingFn,
  //                                   {
  //                                     client: supabaseClient,
  //                                     tableName: 'courses',
  //                                     queryName: 'match_documents'
  //                                   })
  // const pageSections = await vectorStore.similaritySearch(sanitizedQuery, 1);
  // console.log(pageSections)

  // Generate contexts
  const tokenizer = new GPT3Tokenizer({ type: 'gpt3' })
  let tokenCount = 0
  let contextText = ''

  for (let i = 0; i < pageSections.length; i++) {
    const pageSection = pageSections[i]
    const content = pageSection.content
    const encoded = tokenizer.encode(content)
    tokenCount += encoded.text.length

    if (tokenCount >= 1500) {
      break
    }

    contextText += `${content.trim()}\n---\n`
  }
  console.log('tokenCount:', tokenCount)

  const prompt = codeBlock`
    ${oneLine`
    Use the context below, answer the following question accurately.
    Include in your answer as many relevant professors mentioned below as possible.
    Along with the professor, provide the professor' urls from the below information.
    If you are unsure and the answer is not explicitly written in the documentation, say
    "Sorry, I don't know how to help with that."`}

    Context sections:
    ${contextText}

    Question: """
    ${sanitizedQuery}
    """

    Answer as markdown (including related code snippets if available):
  `
  console.log('prompt:', prompt)

  const chatMessage : ChatCompletionRequestMessage = {
    role: 'user',
    content: prompt,
  }

  const response = await openai.createChatCompletion({
    model: 'gpt-3.5-turbo',
    messages: [chatMessage],
    max_tokens: 512,
    temperature: 0.7,
    stream: true,
  })

  if (!response.ok) {
    const error = await response.json()
    console.log('Failed to generate completion', error)
    throw new Error('Failed to generate completion')
  }

  const stream = OpenAIStream(response, {
    async onCompletion(completion) {
      const title = json.messages[0].content.substring(0, 100)
      const id = json.id ?? nanoid()
      const createdAt = Date.now()
      const path = `/chat/${id}`
      const payload = {
        id,
        title,
        userId,
        createdAt,
        path,
        messages: [
          ...messages,
          {
            content: completion,
            role: 'assistant'
          }
        ]
      }
      await kv.hmset(`chat:${id}`, payload)
      await kv.zadd(`user:chat:${userId}`, {
        score: createdAt,
        member: `chat:${id}`
      })
    }
  })

  return new StreamingTextResponse(stream)


  
  // const res = await openai.createChatCompletion({
  //   model: 'gpt-3.5-turbo',
  //   messages,
  //   temperature: 0.7,
  //   stream: true
  // })

  // const stream = OpenAIStream(res, {
  //   async onCompletion(completion) {
  //     const title = json.messages[0].content.substring(0, 100)
  //     const id = json.id ?? nanoid()
  //     const createdAt = Date.now()
  //     const path = `/chat/${id}`
  //     const payload = {
  //       id,
  //       title,
  //       userId,
  //       createdAt,
  //       path,
  //       messages: [
  //         ...messages,
  //         {
  //           content: completion,
  //           role: 'assistant'
  //         }
  //       ]
  //     }
  //     await kv.hmset(`chat:${id}`, payload)
  //     await kv.zadd(`user:chat:${userId}`, {
  //       score: createdAt,
  //       member: `chat:${id}`
  //     })
  //   }
  // })

  // return new StreamingTextResponse(stream)
}
