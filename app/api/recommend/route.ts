import { auth } from '@/auth';
import { createClient } from '@supabase/supabase-js';
import { type Message } from 'ai';
import { NextRequest } from 'next/server';
import {
  ChatCompletionRequestMessage,
  Configuration,
  OpenAIApi
} from 'openai-edge';

export const runtime = 'edge';

const supabaseUrl = process.env.SUPABASE_URL;
if (!supabaseUrl) throw new Error(`Expected env var SUPABASE_URL`);
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;
if (!supabaseServiceKey)
  throw new Error(`Expected env var SUPABASE_SERVICE_KEY`);
const openaiKey = process.env.OPENAI_API_KEY;
if (!openaiKey) throw new Error(`Expected env var OPENAI_API_KEY`);
const configuration = new Configuration({ apiKey: openaiKey });
const openai = new OpenAIApi(configuration);

// This function can be inserted into the POST function in api/chat/route.ts as the basic
// workflow to avoid multiple connections to the database.
async function getQuestions() {
  // Connect to vector DB
  const supabaseClient = createClient(supabaseUrl!, supabaseServiceKey!, {
    auth: {
      persistSession: false,
      autoRefreshToken: false
    }
  });

  let res = await supabaseClient.from('random_faqs').select('content').limit(3);

  const randomeQ = res['data']?.map(x => x['content']);

  // console.log("randomeQ: ", randomeQ)

  return randomeQ;
}

const openAiAPIcall = async (message: string): Promise<string> => {
  const prompt = `
  Given the user message: 
  ${message}

  ${`
    Can you list 3 relevant questions regarding the message provided? 
    Please make sure that the questions are diverse so that people WANT to ask them all.
  `}
`;

  const chatMessage: ChatCompletionRequestMessage = {
    role: 'user',
    content: prompt
  };

  // const contextMessage : ChatCompletionRequestMessage = {
  //   role: 'system',
  //   content: prompt,
  // }

  const response = await openai.createChatCompletion({
    model: 'gpt-3.5-turbo',
    messages: [chatMessage],
    temperature: 1
  });

  if (!response.ok) {
    const error = await response.json();
    console.log('openAiAPIcall: Failed to generate completion', error);
    throw new Error('openAiAPIcall: Failed to generate completion');
  }

  return (await response.json()).choices[0].message.content;
};

export async function POST(req: NextRequest) {
  const userId = (await auth())?.user.id;
  if (!userId) {
    return new Response('Unauthorized', {
      status: 401
    });
  }

  const json = await req.json();
  const { messages }: { messages: Message[] } = json;
  // process.stdout.write(JSON.stringify(messages));

  // const questions = await getQuestions()
  const message_str = messages.map((i, _) => i.content).join(',');
  const questions = await openAiAPIcall(message_str);

  messages.map((i, _) => console.log(i.content));
  console.log(questions);

  return new Response(JSON.stringify({ questions }), {
    status: 200,
    headers: {
      'content-type': 'application/json',
      'cache-control': 'public, s-maxage=10, stale-while-revalidate=60'
    }
  });
}
