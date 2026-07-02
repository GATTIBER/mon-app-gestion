import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

export const { handlers, signIn, signOut, auth } = NextAuth({
  trustHost: true,
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Mot de passe", type: "password" },
      },
      authorize: async (credentials) => {
        const email = credentials?.email;
        const password = credentials?.password;

        if (typeof email !== "string" || typeof password !== "string") {
          return null;
        }

        const adminEmail = process.env.ADMIN_EMAIL;
        const adminPasswordHash = process.env.ADMIN_PASSWORD_HASH;

        if (!adminEmail || !adminPasswordHash) {
          throw new Error(
            "ADMIN_EMAIL et ADMIN_PASSWORD_HASH doivent être définis dans .env.local"
          );
        }

        if (email.toLowerCase() !== adminEmail.toLowerCase()) {
          return null;
        }

        const isValidPassword = await bcrypt.compare(
          password,
          adminPasswordHash
        );

        if (!isValidPassword) {
          return null;
        }

        return { id: "admin", email: adminEmail };
      },
    }),
  ],
});
