import "next-auth";

declare module "next-auth" {
  interface JWT {
    user?: {
      uuid?: string;
      nickname?: string;
      avatar_url?: string;
      created_at?: string;
    };
  }

  interface Session {
    user: {
      uuid?: string;
      nickname?: string;
      avatar_url?: string;
      created_at?: string;
    } & DefaultSession["user"];
  }
}
