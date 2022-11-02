/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-param-reassign */
/* eslint-disable prefer-arrow/prefer-arrow-functions */
import NextAuth from 'next-auth'
import GitHubProvider from 'next-auth/providers/github'
import { env } from '../../../env/server'

export default NextAuth({
  providers: [
    GitHubProvider({
      clientId:
        // process.env.NODE_ENV === 'production' ? env.GITHUB_ID : env.GITHUB_ID_DEV!,
        env.GITHUB_ID,
      clientSecret: env.GITHUB_SECRET,
      // process.env.NODE_ENV === 'production'
      //   ? env.GITHUB_SECRET
      //   : env.GITHUB_SECRET_DEV,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async jwt({ token, account }) {
      // Persist the OAuth access_token to the token right after signin
      if (account) {
        token.accessToken = account.access_token
      }
      return token
    },
    async session(sesh) {
      const { session, user, token } = sesh
      // Send properties to the client, like an access_token from a provider.
      session.accessToken = token.accessToken
      return session
    },
    async signIn({ user, account, profile, email, credentials }) {
      const isAllowedToSignIn = env.ALLOWED_EMAILS?.split(',').includes(user?.email as string)
      if (isAllowedToSignIn) {
        return true
      }
      // Return false to display a default error message
      return false
      // Or you can return a URL to redirect to:
      // return '/unauthorized'
    },
  },
})
