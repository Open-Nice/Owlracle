import { 
  Configuration, 
  OpenAIApi,
  ChatCompletionRequestMessage
} from 'openai-edge'

export const runtime = 'edge'

const openaiKey = process.env.OPENAI_API_KEY
if (!openaiKey) throw new Error(`Expected env var OPENAI_API_KEY`)
const configuration = new Configuration({apiKey: openaiKey})
const openai = new OpenAIApi(configuration)

export const openAiAPIcall = async (prompt: string, model: string, temperature: number = 0.7): Promise<string> => {

    const chatMessage : ChatCompletionRequestMessage = {
      role: 'user',
      content: prompt,
    }
  
    const response = await openai.createChatCompletion({
      model: model,
      messages: [chatMessage],
      temperature: temperature,
    })
  
    if (! response.ok) {
      const error = await response.json()
      console.log('openAiAPIcall: Failed to generate completion', error)
      throw new Error('openAiAPIcall: Failed to generate completion')
    }
    
    return (await response.json()).choices[0].message.content
}

export const openAiAPIStream = async (prompt: string, model: string): Promise<Response> => {

    const chatMessage : ChatCompletionRequestMessage = {
      role: 'user',
      content: prompt,
    }
  
    const response = await openai.createChatCompletion({
      model: model,
      messages: [chatMessage],
      temperature: 0.7,
      stream: true
    })
  
    if (! response.ok) {
      const error = await response.json()
      console.log('openAiAPIStream: Failed to generate completion', error)
      throw new Error('openAiAPIStream: Failed to generate completion')
    }
    
    return response
}
