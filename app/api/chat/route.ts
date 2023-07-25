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


const getBetterQuery = async (messages: ChatCompletionRequestMessage[]): Promise<string> => {
  if (messages.length == 1)
      return messages[0].content!

  const query = messages[messages.length-1].content
  const sanitizedQuery = query!.trim()

  const message_str: string = messages
    .slice(messages.length < 5 ? 0 : -5, -1)
    .map(conv => `${conv['role']}: ${conv['content']}`)
    .join('\n')
  
  const prompt = codeBlock`
    I have the following conversation history between user and LLM:
    ${message_str}

    ${oneLine`
      Based on this conversation history,
      I want you to make the following user
      prompt more complete by removing refereces.
      For example, if user asks "What is his
      name?" Then you should figure out what
      does "his" refer to and give me the more
      complete version of user prompt."
      Don't leave any reference in your eventual answer.
    `}

    This is the user prompt:
    ${sanitizedQuery}
  `

  const chatMessage : ChatCompletionRequestMessage = {
    role: 'user',
    content: prompt,
  }

  const response = await openai.createChatCompletion({
    model: 'gpt-3.5-turbo',
    messages: [chatMessage],
    temperature: 0.7,
  })

  if (!response.ok) {
    const error = await response.json()
    console.log('getBetterQuery: Failed to generate completion', error)
    throw new Error('getBetterQuery: Failed to generate completion')
  }
  
  const result = await response.json()

  return result.choices[0].message.content
}

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

  // Make query better for vectorDB: reference free
  const betterQuery = await getBetterQuery(messages)
  console.log("Better query:", betterQuery)

  // Create embedding from query
  const queryEmbedding = await embeddingFn.embedQuery(betterQuery.replaceAll('\n', ' '));

  // Connect to vector DB
  const supabaseClient = createClient(
    supabaseUrl!, 
    supabaseServiceKey!,
    {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    })

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
    // console.log('Retreival successful:', pageSections)
  }

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
  // console.log('tokenCount:', tokenCount)

  const prompt = codeBlock`
    Context sections:
    ${contextText}

    ${oneLine`
      Use the above information, answer the following question accurately.
      Include in your answer as many relevant professors mentioned above as possible.
      Along with the professor, provide the professors' urls from the above information.
      If you are unsure and the answer is not explicitly written in the documentation, say
      "Sorry, I don't know how to help with that." Try to make your response concise and
      informative. Try to summarize the information you are given instead of completely copying.
    `}

    Question: """
    ${betterQuery}
    """

    Answer as markdown. Provide professor's title, websites, email, description, description if available:
  `
  // console.log('prompt:', prompt)

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
}
