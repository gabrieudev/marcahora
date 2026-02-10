import { expo } from "@better-auth/expo";
import { db } from "@marcahora/db";
import * as schema from "@marcahora/db/schema/schema";
import { env } from "@marcahora/env/server";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { sendTemplateEmail } from "@marcahora/email";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: {
      user: schema.users,
      session: schema.session,
      account: schema.account,
    },
  }),
  trustedOrigins: [
    env.CORS_ORIGIN,
    "mybettertapp://",
    ...(env.NODE_ENV === "development"
      ? [
          "exp://",
          "exp://**",
          "exp://192.168.*.*:*/**",
          "http://localhost:8081",
        ]
      : []),
  ],
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
  },
  emailVerification: {
    sendVerificationEmail: async ({ user, url }) => {
      await sendTemplateEmail("verification", {
        to: user.email,
        data: {
          email: user.email,
          url,
        },
      });
    },
    sendOnSignUp: true,
  },
  advanced: {
    defaultCookieAttributes: {
      sameSite: "none",
      secure: true,
      httpOnly: true,
    },
  },
  user: {
    additionalFields: {
      lastSigninAt: {
        type: "string",
        required: false,
      },
      status: {
        type: "string",
        required: false,
      },
      profile: {
        type: "json",
        required: false,
      },
    },
  },
  plugins: [expo()],
});
