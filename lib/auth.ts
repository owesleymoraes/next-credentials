import bcrypt from "bcrypt";
import { db as prisma } from "@/lib/db";
import { NextAuthOptions } from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import GithubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma as any),
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_CLIENTID!,
      clientSecret: process.env.GITHUBSECRET!,
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "text", placeholder: "jsmith" },
        password: { label: "Password", type: "password" },
        name: { label: "Name", type: "text", placeholder: "Jonh Smith" },
      },
      async authorize(credentials, req): Promise<any> {
        console.log("Authorize method", credentials);

        if (!credentials?.email || !credentials?.password) {
          throw new Error("Dados de login necessários");
        }
        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email,
          },
        });

        if (!user || !user.hashedPassword) {
          throw new Error("Usuários não registrado através de credenciais ");
        }

        const matchPassword = await bcrypt.compare(
          credentials.password,
          credentials.password
        );

        if (!matchPassword) {
          throw new Error("Senha incorreta");
        }

        return user;
      },
    }),
  ],

  session: {
    strategy: "jwt",
  },
  secret: process.env.SECRET,
  debug: process.env.NODE_ENV === "development",
  pages: {
    signIn: "/login",
  },
};
