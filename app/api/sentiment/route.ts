import { auth } from '@/auth'
import { 
  Configuration, 
  OpenAIApi,
  ChatCompletionRequestMessage
} from 'openai-edge'
import { codeBlock, oneLine } from 'common-tags'

export const runtime = 'edge'

const openaiKey = process.env.OPENAI_API_KEY
if (!openaiKey) throw new Error(`Expected env var OPENAI_API_KEY`)
const configuration = new Configuration({apiKey: openaiKey})
const openai = new OpenAIApi(configuration)


const openAiAPIcall = async (prompt: string): Promise<string> => {

  const chatMessage : ChatCompletionRequestMessage = {
    role: 'user',
    content: prompt,
  }

  const response = await openai.createChatCompletion({
    model: 'gpt-3.5-turbo',
    messages: [chatMessage],
    temperature: 0.7,
  })

  if (! response.ok) {
    const error = await response.json()
    console.log('openAiAPIcall: Failed to generate completion', error)
    throw new Error('openAiAPIcall: Failed to generate completion')
  }

  return (await response.json()).choices[0].message.content
}

export async function POST(req: Request) {

  const userId = (await auth())?.user.id

  if (!userId) {
    return new Response('Unauthorized', {
      status: 401
    })
  }

  const json = await req.json()
  const { comment } = json

  const prompt = codeBlock`
    ${oneLine`
      I want you to determine if the following student's comment is negative.
      Format your response as either 'Yes' if it's negative. Or 'No' if it positve.
    `}
    This is the student's comment:
    ${comment}
  `

  const response = (await openAiAPIcall(prompt)).toLowerCase()

  console.log('sentiment analysis response: ', comment, response)

  const isNegative = response == 'yes'

  return new Response(
    JSON.stringify( {isNegative, comment} ),
    {
      status: 200,
      headers: {
        'content-type': 'application/json',
        'cache-control': 'public, s-maxage=10, stale-while-revalidate=60',
      },
    }
  )
}