import NextAuth from "next-auth";
import { authOptions } from "./configs/auth";

export const { handlers, signIn, signOut, auth } = NextAuth(authOptions);
