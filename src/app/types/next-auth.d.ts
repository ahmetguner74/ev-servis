import NextAuth, { DefaultSession } from "next-auth";
import { JWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: "USER" | "PROVIDER" | "ADMIN";
    } & DefaultSession["user"];
  }

  interface User {
    id: string;
    role: "USER" | "PROVIDER" | "ADMIN";
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role: "USER" | "PROVIDER" | "ADMIN";
  }
} 