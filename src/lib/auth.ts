import NextAuth from 'next-auth'
import { PrismaAdapter } from '@auth/prisma-adapter'
import Credentials from 'next-auth/providers/credentials'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: 'jwt' },
  
  providers: [
    // Email + password para el registro normal
    Credentials({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Contraseña', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null
        
        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string }
        })
        
        if (!user || !user.passwordHash) return null
        
        const valid = await bcrypt.compare(
          credentials.password as string,
          user.passwordHash
        )
        
        if (!valid) return null
        
        return {
          id: user.id,
          email: user.email,
          name: user.name,
          plan: user.plan
        }
      }
    }),

    // Meta OAuth — se agrega en Sprint 1
    // Instalá: npm install @auth/core
    // FacebookInstagram({
    //   clientId: process.env.META_CLIENT_ID!,
    //   clientSecret: process.env.META_CLIENT_SECRET!,
    // }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.plan = (user as any).plan
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).plan = token.plan
        ;(session.user as any).id = token.sub
      }
      return session
    }
  },

  pages: {
    signIn: '/login',
    error: '/login',
  }
})
