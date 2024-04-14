import { genUniSeq, getIsoTimestr } from "@/utils";

import { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { OAuth2Client } from "google-auth-library";
import { Provider } from "next-auth/providers/index";
import { User } from "@/types/user";
import { saveUser } from "@/services/user";

let providers: Provider[] = [
  CredentialsProvider({
    id: "google-one-tap",
    name: "google-one-tap",

    credentials: {
      credential: { type: "text" },
    },

    async authorize(credentials, req) {
      const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
      if (!googleClientId) {
        console.log("invalid google auth config");
        return null;
      }

      const token = credentials!.credential;

      const client = new OAuth2Client(googleClientId);
      const ticket = await client.verifyIdToken({
        idToken: token,
        audience: googleClientId,
      });

      const payload = ticket.getPayload();
      if (!payload) {
        console.log("invalid payload from token");
        return null;
      }

      const {
        email,
        sub,
        given_name,
        family_name,
        email_verified,
        picture: image,
      } = payload;
      if (!email) {
        console.log("invalid email in payload");
        return null;
      }

      const user = {
        id: sub,
        name: [given_name, family_name].join(" "),
        email,
        image,
        emailVerified: email_verified ? new Date() : null,
      };

      return user;
    },
  }),
];

if (
  process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID &&
  process.env.GOOGLE_CLIENT_SECRET
) {
  providers.push(
    GoogleProvider({
      clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    })
  );
}

export const authOptions: AuthOptions = {
  providers,
  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
      const isAllowedToSignIn = true;
      if (isAllowedToSignIn) {
        return true;
      } else {
        // Return false to display a default error message
        return false;
        // Or you can return a URL to redirect to:
        // return '/unauthorized'
      }
    },
    async redirect({ url, baseUrl }) {
      // Allows relative callback URLs
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      // Allows callback URLs on the same origin
      else if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
    },
    async session({ session, token, user }) {
      if (token && token.user && token.user) {
        session.user = token.user;
      }
      return session;
    },
    async jwt({ token, user, account }) {
      // Persist the OAuth access_token and or the user id to the token right after signin
      if (user && user.email && account) {
        const dbUser: User = {
          uuid: genUniSeq(),
          email: user.email,
          nickname: user.name || "",
          avatar_url: user.image || "",
          signin_type: account.type,
          signin_provider: account.provider,
          signin_openid: account.providerAccountId,
          created_at: getIsoTimestr(),
          signin_ip: "",
        };
        await saveUser(dbUser);

        console.log("save user", dbUser);
        token.user = {
          uuid: dbUser.uuid,
          nickname: dbUser.nickname,
          email: dbUser.email,
          avatar_url: dbUser.avatar_url,
          created_at: dbUser.created_at,
        };
      }
      return token;
    },
  },
};
