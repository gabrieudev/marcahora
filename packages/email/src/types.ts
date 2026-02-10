export type EmailPayload<T = unknown> = {
  to: string;
  data: T;
};

export type EmailRenderer<T = unknown> = (data: T) => string;

export type EmailTemplate<T = unknown> = {
  subject: string | ((data: T) => string);
  render: EmailRenderer<T>;
};
