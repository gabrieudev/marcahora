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
      verification: schema.verification,
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
      const verificationUrl = url.replace(
        /callbackURL=[^&]+/,
        `callbackURL=${encodeURIComponent(`${env.CORS_ORIGIN}/auth/signin`)}`,
      );

      await sendTemplateEmail("verification", {
        to: user.email,
        data: {
          email: user.email,
          url: verificationUrl,
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
  baseURL: env.BETTER_AUTH_URL,
  socialProviders: {
    google: {
      clientId: env.GOOGLE_CLIENT_ID as string,
      clientSecret: env.GOOGLE_CLIENT_SECRET as string,
    },
    github: {
      clientId: env.GITHUB_CLIENT_ID as string,
      clientSecret: env.GITHUB_CLIENT_SECRET as string,
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
