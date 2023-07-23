import NextAuth, { type DefaultSession } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import { connectDB } from '@/db/db'
import User from '@/db/user'

declare module 'next-auth' {
  interface Session {
    user: {
      /** The user's id. */
      id: string
    } & DefaultSession['user']
  }
}

export const {
  handlers: { GET, POST },
  auth,
  CSRF_experimental // will be removed in future
} = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET
    })
  ],
  callbacks: {
    async session({ session }) {
      return session
    },
    async signIn({ profile }) {
      console.log(profile)
      try {
        console.log('connecting to mongodb in auth')
        await connectDB()

        const userExist = await User.findOne({email: profile?.email})

        if (! userExist) {
          const user = await User.create({
            email: profile?.email,
            name: profile?.name,
            image: profile?.picture
          })
        }

        return true

      } catch (error) {
        console.log(`encounter error in auth: ${error}`)
        return false
      }

    },
    async jwt({ token, profile }) {
      if (profile) {
        token.id = profile.id
        token.image = profile.picture
      }
      return token
    },
    authorized({ auth }) {
      return !!auth?.user // this ensures there is a logged in user for -every- request
    }
  },
  pages: {
    signIn: '/sign-in' // overrides the next-auth default signin page https://authjs.dev/guides/basics/pages
  }
})
