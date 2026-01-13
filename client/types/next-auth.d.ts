import NextAuth, { DefaultSession, DefaultUser } from "next-auth";
import { JWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user?: CustomUser;
  }

  interface User extends CustomUser {}
}

declare module "next-auth/jwt" {
  interface JWT {
    user?: CustomUser;
  }
}

export interface CustomUser extends DefaultUser {
  id?: string | null;
  provider?: string | null;
  token?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
}
