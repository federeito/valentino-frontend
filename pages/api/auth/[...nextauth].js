import NextAuth from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import FacebookProvider from 'next-auth/providers/facebook'

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code"
        }
      }
    }),
    FacebookProvider({
      clientId: process.env.FACEBOOK_ID,
      clientSecret: process.env.FACEBOOK_SECRET,
    }),
  ],
  
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  
  callbacks: {
    async signIn({ user, account, profile, isNewUser }) {
      // Send notification email for new Google or Facebook signups
      if ((account.provider === 'google' || account.provider === 'facebook')) {
        try {
          // Always send notification (you can add isNewUser check if your setup supports it)
          const response = await fetch(`${process.env.NEXTAUTH_URL}/api/notify-signup`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              name: user.name,
              email: user.email,
              provider: account.provider
            })
          });
          
          if (!response.ok) {
            console.error('Failed to send signup notification');
          }
        } catch (error) {
          console.error('Error sending signup notification:', error);
          // Don't block the sign-in even if email fails
        }
      }
      return true;
    },
    
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id
        token.provider = account?.provider
      }
      if (account) {
        token.accessToken = account.access_token
      }
      return token
    },
    
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id
        session.user.provider = token.provider
      }
      return session
    },
  },
  
  secret: process.env.NEXTAUTH_SECRET,
};

export default NextAuth(authOptions);