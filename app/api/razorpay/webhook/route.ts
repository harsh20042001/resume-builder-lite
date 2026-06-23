// app/api/razorpay/webhook/route.ts
//
// This is the source of truth for unlocking premium — never rely solely on
// the client-side payment success callback, since the user could close the
// tab or the network could drop before that fires. Configure this URL in
// the Razorpay dashboard under Settings → Webhooks, subscribed to the
// "payment.captured" event.

import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { createServiceRoleClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  const rawBody = await req.text();
  const signature = req.headers.get("x-razorpay-signature") ?? "";

  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_WEBHOOK_SECRET!)
    .update(rawBody)
    .digest("hex");

  if (expectedSignature !== signature) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const event = JSON.parse(rawBody);

  if (event.event === "payment.captured") {
    const payment = event.payload.payment.entity;
    const orderId = payment.order_id as string;
    const paymentId = payment.id as string;

    const supabase = createServiceRoleClient();

    // Find the pending purchase row by order id, mark it successful.
    const { data: purchase } = await supabase
      .from("purchases")
      .update({ status: "success", razorpay_payment_id: paymentId })
      .eq("razorpay_order_id", orderId)
      .select("user_id")
      .single();

    if (purchase?.user_id) {
      await supabase
        .from("users")
        .update({ is_premium: true })
        .eq("id", purchase.user_id);
    }
  }

  return NextResponse.json({ received: true });
}
