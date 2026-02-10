import { createElement } from "react";
import { reactRenderer } from "../renderers/react-renderer";
import { VerificationEmail } from "../templates/verification-email";
import type { EmailTemplate } from "../types";

export const templates = {
  verification: {
    subject: "Verifique seu e-mail",
    render: (data) =>
      reactRenderer(createElement(VerificationEmail, { ...data })),
  },
} satisfies Record<string, EmailTemplate<any>>;
