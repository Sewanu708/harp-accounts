/* eslint-disable @typescript-eslint/no-unused-vars */
import NextAuth from "next-auth";

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: {
      token: string; // Example: Add a custom 'id' property
        } & DefaultSession["user"];
  }
}