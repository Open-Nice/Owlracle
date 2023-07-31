import prisma from '@/lib/prisma'
import { auth } from '@/auth'

export const runtime = 'edge'

export async function GET(req: Request) {
  // console.log("req:", req)
  // const json = await req.json()
  // const { cField, cNum } = json
  const userId = (await auth())?.user.id

  if (!userId) {
    return new Response('Unauthorized', {
      status: 401
    })
  }

  // const catalog = await prisma.courseCatalog.findUnique({
  //   where: {
  //       cField_cNum: {
  //         cNum: cNum,
  //         cField: cField
  //       }
  //   }
  // })
  const catalog = await prisma.courseCatalog.findUnique({
    where: {
        cField_cNum: {
          cNum: '140',
          cField: 'COMP'
        }
    }
  })
  console.log({ catalog })

  return new Response(
    JSON.stringify(catalog),
    {
      status: 200,
      headers: {
        'content-type': 'application/json',
        'cache-control': 'public, s-maxage=10, stale-while-revalidate=60',
      },
    }
  )
}