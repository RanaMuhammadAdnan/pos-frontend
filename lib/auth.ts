import CredentialsProvider from 'next-auth/providers/credentials';

import { AuthOptions } from 'next-auth';

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) {
          return null;
        }

        // Simple hardcoded authentication for demo
        if (credentials.username === 'admin' && credentials.password === 'admin@123') {
          return {
            id: '1',
            name: 'Admin User',
            email: 'admin@example.com',
            username: 'admin',
            accessToken: 'demo-token',
          };
        }

        return null;
      }
    })
  ],
  session: {
    strategy: 'jwt' as const,
    maxAge: 24 * 60 * 60, // 24 hours
  },
  pages: {
    signIn: '/login',
    error: '/login',
  },
  callbacks: {
    async jwt({ token, user }: any) {
      if (user) {
        token.username = user.username;
        token.accessToken = user.accessToken;
      }
      return token;
    },
    async session({ session, token }: any) {
      if (token) {
        session.user.username = token.username;
        (session as any).accessToken = token.accessToken;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET || 'fallback-secret-for-development',
}; 