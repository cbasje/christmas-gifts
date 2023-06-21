import { NuxtAuthHandler } from "#auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { User } from "~/lib/types";
import prisma from "~~/lib/prisma";

const config = useRuntimeConfig();

export default NuxtAuthHandler({
    secret: config.secret,
    pages: {
        // Change the default behavior to use `/login` as the path for the sign-in page
        signIn: "/login",
    },
    callbacks: {
        // Callback when the JWT is created / updated, see https://next-auth.js.org/configuration/callbacks#jwt-callback
        jwt: async ({ token, user }) => {
            const isSignIn = user ? true : false;
            if (isSignIn) {
                token.id = user ? (user as User).id || "" : "";
                token.groups = user ? (user as User).groups || "" : "";
            }
            return Promise.resolve(token);
        },
        // Callback whenever session is checked, see https://next-auth.js.org/configuration/callbacks#session-callback
        session: async ({ session, token }) => {
            (session as any).user.id = token.id;
            (session as any).user.groups = token.groups;
            return Promise.resolve(session);
        },
    },
    // adapter: PrismaAdapter(prisma),
    providers: [
        // @ts-expect-error You need to use .default here for it to work during SSR. May be fixed via Vite at some point
        CredentialsProvider.default({
            id: "password",
            name: "Credentials",
            credentials: {
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials: { password?: string }) {
                // Add logic here to look up the user from the credentials supplied
                const user = await prisma.user.findFirst({
                    where: {
                        password: credentials?.password,
                    },
                });

                return user;
            },
        }),
    ],
});
