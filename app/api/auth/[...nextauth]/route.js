import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

// إعدادات NextAuth
const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (
          credentials.email === "test@example.com" &&
          credentials.password === "123456"
        ) {
          return { id: "1", name: "Test User", email: "test@example.com" };
        }
        return null;
      },
    }),
  ],
  pages: {
    signIn: "/login",
    error: "/login",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
};

// يجب تصدير دوال باسم HTTP methods
export async function GET(req) {
  return await NextAuth(req, authOptions);
}

export async function POST(req) {
  return await NextAuth(req, authOptions);
}
