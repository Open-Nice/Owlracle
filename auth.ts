import NextAuth, { type DefaultSession } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'

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
    async signIn({ profile }) {
      // console.log('profile:')
      // console.log(profile)

      // Email needs to be verified and ends with rice.edu
      if (! (profile?.email_verified && profile?.email?.endsWith("@rice.edu")) ) {
        return false
      }

      return true
    },
    async jwt({ token, user, account, profile }) {
      // console.log('token') // always not null
      // console.log(token)

      // console.log('profile') // not null first time
      // console.log(profile)
      
      // console.log('user') // not null first time
      // console.log(user)

      // console.log('account') // not null first time
      // console.log(account)

      if (profile) {
        // ab123@rice.edu, token.id = 'ab123'
        token.id = profile.email?.split('@')[0]
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
