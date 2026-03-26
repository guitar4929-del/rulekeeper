import { NextRequest } from "next/server";
import crypto from "crypto";

const WEBHOOK_SECRET = process.env.PADDLE_WEBHOOK_SECRET ?? "";

/**
 * Paddle webhook signature verification.
 * See: https://developer.paddle.com/webhooks/signature-verification
 */
function verifySignature(
  rawBody: string,
  signature: string | null,
  secret: string
): boolean {
  if (!signature || !secret) return false;

  // Parse the Paddle-Signature header
  // Format: ts=<timestamp>;h1=<hash>
  const parts = Object.fromEntries(
    signature.split(";").map((part) => {
      const [key, ...rest] = part.split("=");
      return [key, rest.join("=")];
    })
  );

  const ts = parts["ts"];
  const h1 = parts["h1"];
  if (!ts || !h1) return false;

  const payload = `${ts}:${rawBody}`;
  const expectedHash = crypto
    .createHmac("sha256", secret)
    .update(payload)
    .digest("hex");

  return crypto.timingSafeEqual(
    Buffer.from(h1, "hex"),
    Buffer.from(expectedHash, "hex")
  );
}

export async function POST(request: NextRequest) {
  try {
    const rawBody = await request.text();
    const signature = request.headers.get("paddle-signature");

    // Verify webhook signature (skip if secret not configured)
    if (WEBHOOK_SECRET && !verifySignature(rawBody, signature, WEBHOOK_SECRET)) {
      console.error("[Paddle Webhook] Invalid signature");
      return new Response("Invalid signature", { status: 401 });
    }

    const event = JSON.parse(rawBody);
    const eventType: string = event.event_type ?? "";

    console.log(`[Paddle Webhook] Received: ${eventType}`);

    switch (eventType) {
      case "subscription.created":
        // TODO: Create or update user subscription record
        console.log(
          "[Paddle Webhook] Subscription created:",
          event.data?.id
        );
        break;

      case "subscription.updated":
        // TODO: Update subscription status / plan
        console.log(
          "[Paddle Webhook] Subscription updated:",
          event.data?.id
        );
        break;

      case "subscription.canceled":
        // TODO: Mark subscription as canceled
        console.log(
          "[Paddle Webhook] Subscription canceled:",
          event.data?.id
        );
        break;

      default:
        console.log(`[Paddle Webhook] Unhandled event: ${eventType}`);
    }

    return Response.json({ received: true });
  } catch (error) {
    console.error("[Paddle Webhook] Error processing webhook:", error);
    return new Response("Webhook processing error", { status: 500 });
  }
}
