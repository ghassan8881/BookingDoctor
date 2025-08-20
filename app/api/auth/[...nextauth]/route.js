import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { connectToDatabase } from "../../../../lib/db";
import { compare } from "bcryptjs";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          const pool = await connectToDatabase();

          const result = await pool
            .request()
            .input("email", credentials.email)
            .query(
              "SELECT UserID, Email, PasswordHash, Role FROM [dbo].[User] WHERE Email = @email"
            );

          if (!result.recordset?.length) {
            console.log("No user found for email:", credentials.email);
            throw new Error("Invalid email or password");
          }

          const user = result.recordset[0];

          if (!user.PasswordHash) {
            console.error("User record missing password field:", user);
            throw new Error("Account configuration error");
          }

          const isValid = await compare(
            credentials.password,
            user.PasswordHash
          );

          if (!isValid) {
            console.log("Invalid password attempt for:", credentials.email);
            throw new Error("Invalid email or password");
          }

          return {
            id: user.UserID.toString(),
            email: user.Email,
            role: user.Role || "user",
          };
        } catch (error) {
          console.error("Authentication error:", {
            email: credentials?.email,
            error: error.message,
          });
          throw new Error("Authentication failed. Please try again.");
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.UserID;
        token.role = user.Role;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id;
      session.user.role = token.role;
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
