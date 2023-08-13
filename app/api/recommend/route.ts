import { auth } from '@/auth'
import { supabaseClient } from '@/app/supaClient'

export const runtime = 'edge'

async function getQuestions() {
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