import { createClient } from "@supabase/supabase-js"
import { auth } from '@/auth'

export const runtime = 'edge'

const supabaseUrl = process.env.SUPABASE_URL
if (!supabaseUrl) throw new Error(`Expected env var SUPABASE_URL`)
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY
if (!supabaseServiceKey) throw new Error(`Expected env var SUPABASE_SERVICE_KEY`)

// This function can be inserted into the POST function in api/chat/route.ts as the basic
// workflow to avoid multiple connections to the database. 
async function getQuestions() {
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

    let res = await supabaseClient
        .from("random_faqs")
        .select("content")
        .limit(3)

    const randomeQ = res['data']?.map(x => x['content'])
    
    // console.log("randomeQ: ", randomeQ)

    return randomeQ
}

export async function POST(req: Request) {
    const userId = (await auth())?.user.id

    if (!userId) {
      return new Response('Unauthorized', {
        status: 401
      })
    }
    const questions = await getQuestions()

    // console.log(questions)

    return new Response(
        JSON.stringify( {questions} ),
        {
          status: 200,
          headers: {
            'content-type': 'application/json',
            'cache-control': 'public, s-maxage=10, stale-while-revalidate=60',
          },
        }
      )
}