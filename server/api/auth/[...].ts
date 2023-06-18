import { NuxtAuthHandler } from "#auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import CredentialsProvider from "next-auth/providers/credentials";
import { useUserStore } from "~/stores/user";
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
                token.id = user ? user.id || "" : "";
                token.groups = user ? (user as any).groups || "" : "";
            }
            return Promise.resolve(token);
        },
        // Callback whenever session is checked, see https://next-auth.js.org/configuration/callbacks#session-callback
        session: async ({ session, token }) => {
            (session as any).uid = token.id;
            (session as any).groups = token.groups;
            return Promise.resolve(session);
        },
    },
    // adapter: PrismaAdapter(prisma),
    providers: [
        // @ts-expect-error You need to use .default here for it to work during SSR. May be fixed via Vite at some point
        CredentialsProvider.default({
            id: "password",
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
            async authorize(credentials: { password?: string }) {
                // Add logic here to look up the user from the credentials supplied
                const user = await prisma.user.findFirst({
                    where: {
                        password: credentials?.password,
                    },
                });
                console.log("🚀 ---------------------------🚀");
                console.log("🚀 ~ authorize ~ user:", user);
                console.log("🚀 ---------------------------🚀");

                return user;
            },
        }),
        // CredentialsProvider.default({
        //     id: "password",
        //     // The name to display on the sign in form (e.g. 'Sign in with...')
        //     name: "Credentials",
        //     // The credentials is used to generate a suitable form on the sign in page.
        //     // You can specify whatever fields you are expecting to be submitted.
        //     // e.g. domain, username, password, 2FA token, etc.
        //     // You can pass any HTML attribute to the <input> tag through the object.
        //     credentials: {
        //         username: {
        //             label: "Username",
        //             type: "text",
        //             placeholder: "(hint: jsmith)",
        //         },
        //         password: {
        //             label: "Password",
        //             type: "password",
        //             placeholder: "(hint: hunter2)",
        //         },
        //     },
        //     authorize(credentials: any) {
        //         // You need to provide your own logic here that takes the credentials
        //         // submitted and returns either a object representing a user or value
        //         // that is false/null if the credentials are invalid.
        //         // NOTE: THE BELOW LOGIC IS NOT SAFE OR PROPER FOR AUTHENTICATION!
        //         const user = {
        //             id: "1",
        //             name: "J Smith",
        //             username: "jsmith",
        //             password: "hunter2",
        //         };
        //         if (
        //             credentials?.username === user.username &&
        //             credentials?.password === user.password
        //         ) {
        //             // Any object returned will be saved in `user` property of the JWT
        //             return user;
        //         } else {
        //             // eslint-disable-next-line no-console
        //             console.error(
        //                 "Warning: Malicious login attempt registered, bad credentials provided"
        //             );
        //             // If you return null then an error will be displayed advising the user to check their details.
        //             return null;
        //             // You can also Reject this callback with an Error thus the user will be sent to the error page with the error message as a query parameter
        //         }
        //     },
        // }),
    ],
});
