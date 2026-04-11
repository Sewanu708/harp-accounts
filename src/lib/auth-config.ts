/* eslint-disable @typescript-eslint/no-explicit-any */
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { authClient } from "./api-client";

export const authOptions = {
  secret: "oops",
  // Configure one or more authentication providers
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
    CredentialsProvider({
      // The name to display on the sign in form (e.g. "Sign in with...")
      name: "Credentials",
      // `credentials` is used to generate a form on the sign in page.
      // You can specify which fields should be submitted, by adding keys to the `credentials` object.
      // e.g. domain, username, password, 2FA token, etc.
      // You can pass any HTML attribute to the <input> tag through the object.
      credentials: {
        email: {
          label: "Email",
          type: "text",
          placeholder: "Enter email",
        },
        password: {
          label: "Password",
          type: "password",
          placeholder: "Enter Password",
        },
      },

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      async authorize(credentials: any, req: any) {
        // console.log({ credentials });
        const { email, password, product } = credentials;
        // console.log(process.env.NEXT_PUBLIC_URL + "/api/login");
        const res = await authClient.login(
          { email, password },
          { "x-harp-product": product },
        );
        console.log(res, "ppppp");

        const user = await res.data;
        if (user) {
          return user;
        } else return null;
      },
    }),
    // ...add more providers here
  ],
  callbacks: {
    async jwt({ token, trigger, user, session, newSession }: any) {
      // console.log({ token, user })
      // console.log({ trigger, token, session, newSession, update: true });
      if (trigger === "update") {
        // Note, that `session` can be any arbitrary object, remember to validate it!
        // console.log({ trigger, token, session, newSession, update: true });
        user = session.user;
        token.account = user;
      }
      return { ...token, ...user };
    },
    async session({ session, trigger, token, user, newSession }: any) {
      // Send properties to the client, like an access_token from a provider.
      // console.log({ session, token, user })
      // if (token.error) {
      //   session.error = token.error
      // }
      // console.log({
      //   trigger,
      //   token,
      //   session,
      //   newSession,
      //   user,
      //   session_: true,
      // });
      if (trigger === "update") {
        // Note, that `session` can be any arbitrary object, remember to validate it!
        console.log({ token, session, newSession, user, session_: true });
      }
      session.user = token.account;
      session.token = token.token;

      return session;
    },
    async signIn({ account, profile }: any) {
      console.log({ account, profile })
      if (account.provider === "google") {
        return profile.email_verified && profile.email.endsWith("@example.com")
      }
      return true // Do different verification for other providers that don't have `email_verified`
    },
  },
  // },
  pages: {
    signIn: "/auth/login",
  },
};
