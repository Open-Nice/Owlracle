import prisma from '@/lib/prisma'
import { auth } from '@/auth'
import {type Course} from '@/app/api/course/route'

export const runtime = 'edge'

export async function POST(req: Request) {

  const userId = (await auth())?.user.id

  if (!userId) {
    return new Response('Unauthorized', {
      status: 401
    })
  }

  const json = await req.json()
  const { course }: { course: Course } = json
  console.log('courses', course)

  const comments = await prisma.courseComments.findMany({
    where: {
      cField: course.cField,
      cNum: course.cNum,
    },
    select: {
      crn: true,
      year: true,
      semester: true,
      comments: true,
      instructor: true,
      instructor_comments: true,
    },
  })

  const scores = await prisma.courseScores.findMany({
    where: {
      cField: course.cField,
      cNum: course.cNum,
    },
    select: {
      crn: true,
      year: true,
      semester: true,
      workload: true,
      instructor: true,
      assignment: true,
      challenge: true,
      expectedPF: true,
      expected_grade: true,
      instructor_evaluations: true,
      organization: true,
      overall_quality: true,
      why_take_this_course: true,
    },
  })
  // console.log({ comments, scores })


  return new Response(
    JSON.stringify( {comments, scores} ),
    {
      status: 200,
      headers: {
        'content-type': 'application/json',
        'cache-control': 'public, s-maxage=10, stale-while-revalidate=60',
      },
    }
  )
}