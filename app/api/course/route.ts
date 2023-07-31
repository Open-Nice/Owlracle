import prisma from '@/lib/prisma'
import { auth } from '@/auth'

export const runtime = 'edge'

type Course = {
  cField: string
  cNum: string
}

export async function POST(req: Request) {
  const json = await req.json()
  const { courses }: { courses: Course[] } = json
  console.log('courses', courses)

  const userId = (await auth())?.user.id

  if (!userId) {
    return new Response('Unauthorized', {
      status: 401
    })
  }

  if (!prisma) {
    throw new Error("Prisma is not initialized")
  }

  const catalog = await prisma!.courseCatalog.findMany({
    where: {
      OR: courses.map((course) => ({
        cNum: course.cNum,
        cField: course.cField,
      })),
    },
  })
  // console.log({ catalog })

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