import type { Environments } from "@paddle/paddle-js";

export const PADDLE_CLIENT_TOKEN =
  process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN ?? "";

export const PADDLE_ENV: Environments =
  (process.env.NEXT_PUBLIC_PADDLE_ENV as Environments) ?? "sandbox";

export const PADDLE_STANDARD_PRICE_ID =
  process.env.NEXT_PUBLIC_PADDLE_STANDARD_PRICE_ID ?? "";

export const PADDLE_PRO_PRICE_ID =
  process.env.NEXT_PUBLIC_PADDLE_PRO_PRICE_ID ?? "";
