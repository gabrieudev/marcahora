import { sendEmail } from "../provider/resend";
import type { EmailPayload } from "../types";
import { templates } from "./tempĺates";

export async function sendTemplateEmail<T extends keyof typeof templates>(
  template: T,
  payload: EmailPayload<Parameters<(typeof templates)[T]["render"]>[0]>,
) {
  const tpl = templates[template];

  const subject =
    typeof tpl.subject === "function"
      ? (
          tpl.subject as (
            data: Parameters<(typeof templates)[T]["render"]>[0],
          ) => string
        )(payload.data)
      : tpl.subject;

  await sendEmail({
    to: payload.to,
    subject,
    html: tpl.render(payload.data),
  });
}
