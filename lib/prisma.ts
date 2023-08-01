import { PrismaClient } from "@prisma/client/edge"

// PrismaClient is attached to the `global` object in development to prevent
// exhausting your database connection limit.
//
// Learn more: 
// https://pris.ly/d/help/next-js-best-practices

declare global {
  var prisma: PrismaClient | undefined
}

let prisma: PrismaClient

if (process.env.VERCEL_ENV === 'production') {
  prisma = new PrismaClient()
} else {
  if (!global.prisma) {
    global.prisma = new PrismaClient()
  }
  prisma = global.prisma
}


export default prisma!