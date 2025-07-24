import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

const handler = NextAuth({
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
          };
        }

        return null;
      }
    })
  ],
  session: {
    strategy: 'jwt',
    maxAge: 24 * 60 * 60, // 24 hours
  },
  pages: {
    signIn: '/login',
    error: '/login',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.username = user.username;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.username = token.username;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET || 'fallback-secret-for-development',
});

export { handler as GET, handler as POST }; 