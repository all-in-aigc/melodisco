import NextAuth from "next-auth";
import { authOptions } from "@/configs/auth";

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
