// app/api/razorpay/create-order/route.ts
import { NextResponse } from "next/server";
import Razorpay from "razorpay";
import { createClient } from "@/lib/supabase/server";

const PREMIUM_PRICE_PAISE = 99900; // ₹999.00

export async function POST() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Sign in required." }, { status: 401 });
  }

  const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID!,
    key_secret: process.env.RAZORPAY_KEY_SECRET!,
  });

  try {
    const order = await razorpay.orders.create({
      amount: PREMIUM_PRICE_PAISE,
      currency: "INR",
      notes: { user_id: user.id },
    });

    // Record a pending purchase row so the webhook has something to match against.
    await supabase.from("purchases").insert({
      user_id: user.id,
      amount: PREMIUM_PRICE_PAISE,
      currency: "INR",
      razorpay_order_id: order.id,
      status: "pending",
    });

    return NextResponse.json({
      orderId: order.id,
      amount: PREMIUM_PRICE_PAISE,
      currency: "INR",
      keyId: process.env.RAZORPAY_KEY_ID,
    });
  } catch (err) {
    console.error("Razorpay order creation failed", err);
    return NextResponse.json({ error: "Could not create order." }, { status: 500 });
  }
}
