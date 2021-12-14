import NextAuth from 'next-auth'
import GitHubProvider from 'next-auth/providers/github'

export default NextAuth({
  providers: [
    GitHubProvider({
      clientId: process.env.NODE_ENV ? process.env.GITHUB_ID : process.env.GITHUB_ID_DEV,
      clientSecret: process.env.NODE_ENV
        ? process.env.GITHUB_SECRET
        : process.env.GITHUB_SECRET_DEV,
    }),
  ],
})
