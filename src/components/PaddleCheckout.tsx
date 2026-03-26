"use client";

import { useEffect, useState, useCallback } from "react";
import {
  initializePaddle,
  type Paddle,
} from "@paddle/paddle-js";
import {
  PADDLE_CLIENT_TOKEN,
  PADDLE_ENV,
} from "@/lib/paddle";

export function usePaddleCheckout() {
  const [paddle, setPaddle] = useState<Paddle | null>(null);

  useEffect(() => {
    if (!PADDLE_CLIENT_TOKEN) return;

    initializePaddle({
      environment: PADDLE_ENV,
      token: PADDLE_CLIENT_TOKEN,
    }).then((instance) => {
      if (instance) setPaddle(instance);
    });
  }, []);

  const openCheckout = useCallback(
    (priceId: string) => {
      if (!paddle) {
        console.warn("Paddle is not initialized yet");
        return;
      }
      paddle.Checkout.open({
        items: [{ priceId, quantity: 1 }],
      });
    },
    [paddle]
  );

  return { paddle, openCheckout };
}
