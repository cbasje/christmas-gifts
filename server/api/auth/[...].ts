import { NuxtAuthHandler } from "#auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
// import CredentialsProvider from "next-auth/providers/credentials";
import Credentials from "@auth/core/providers/credentials";
import prisma from "~~/lib/prisma";

export default NuxtAuthHandler({
    secret: "fake-value",
    adapter: PrismaAdapter(prisma),
    providers: [
        Credentials({
            // The name to display on the sign in form (e.g. "Sign in with...")
            name: "Credentials",
            // `credentials` is used to generate a form on the sign in page.
            // You can specify which fields should be submitted, by adding keys to the `credentials` object.
            // e.g. domain, username, password, 2FA token, etc.
            // You can pass any HTML attribute to the <input> tag through the object.
            credentials: {
                // username: { label: "Username" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials, req) {
                // Add logic here to look up the user from the credentials supplied
                const user = await prisma.user.findFirst({
                    where: {
                        password: credentials?.password,
                    },
                    select: {
                        id: true,
                        groups: true,
                    },
                });

                if (user) {
                    // Any object returned will be saved in `user` property of the JWT
                    return user;
                } else {
                    // If you return null then an error will be displayed advising the user to check their details.
                    return null;

                    // You can also Reject this callback with an Error thus the user will be sent to the error page with the error message as a query parameter
                }
            },
        }),
    ],
});
