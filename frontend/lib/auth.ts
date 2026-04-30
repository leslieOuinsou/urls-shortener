import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

const config = {
    trustHost: true,
    providers: [
        CredentialsProvider({
            name: "credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) return null;

                const user = await prisma.user.findUnique({
                    where: { email: credentials.email as string },
                });

                if (!user) return null;

                const passwordMatch = await bcrypt.compare(
                    credentials.password as string,
                    user.password
                );

                if (!passwordMatch) return null;

                return { id: String(user.id), email: user.email, name: user.name };
            },
        }),
    ],
    session: { strategy: "jwt" as const },
    pages: {
        signIn: "/login",
    },
};

const { handlers, signIn, signOut, auth } = NextAuth(config);

export { handlers, signIn, signOut, auth };