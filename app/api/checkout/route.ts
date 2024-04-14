import { getUserEmail, getUserUuid } from "@/services/user";
import { insertOrder, updateOrderSession } from "@/models/order";
import { respData, respErr } from "@/utils/resp";

import { Order } from "@/types/order";
import Stripe from "stripe";
import { findUserByUuid } from "@/models/user";
import { genOrderNo } from "@/utils/order";

export const maxDuration = 120;

export async function POST(req: Request) {
  try {
    const { credits, currency, amount, plan } = await req.json();
    if (!credits || !amount || !plan || !currency) {
      return respErr("invalid params");
    }

    if (!["monthly", "one-time"].includes(plan)) {
      return respErr("invalid plan");
    }

    const user_uuid = await getUserUuid();
    if (!user_uuid) {
      return respErr("no auth");
    }

    let user_email = await getUserEmail();
    if (!user_email) {
      const user = await findUserByUuid(user_uuid);
      if (user) {
        user_email = user.email;
      }
    }
    if (!user_email) {
      return respErr("invalid user");
    }

    const order_no = genOrderNo();

    const currentDate = new Date();
    const oneMonthLater = new Date(currentDate);
    oneMonthLater.setMonth(currentDate.getMonth() + 1);

    const created_at = currentDate.toISOString();
    const expired_at = oneMonthLater.toISOString();

    const order: Order = {
      order_no: order_no,
      created_at: created_at,
      user_uuid: user_uuid,
      user_email: user_email,
      amount: amount,
      plan: plan,
      expired_at: expired_at,
      order_status: 1,
      credits: credits,
      currency: currency,
    };
    insertOrder(order);
    console.log("create new order: ", order);

    const stripe = new Stripe(process.env.STRIPE_PRIVATE_KEY || "");

    let options: Stripe.Checkout.SessionCreateParams = {
      customer_email: user_email,
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: currency,
            product_data: {
              name: "Buy Credits",
            },
            unit_amount: amount,
            recurring:
              plan === "monthly"
                ? {
                    interval: "month",
                  }
                : undefined,
          },
          quantity: 1,
        },
      ],
      allow_promotion_codes: false,
      metadata: {
        project: "melodisco",
        pay_scene: "buy-credits",
        order_no: order_no.toString(),
        user_email: user_email,
        credits: credits,
      },
      mode: plan === "monthly" ? "subscription" : "payment",
      success_url: `${process.env.NEXT_PUBLIC_WEB_BASE_URL}/pay-success/{CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_WEB_BASE_URL}/pricing`,
    };

    if (currency === "cny") {
      options.payment_method_types = ["wechat_pay", "card"];
      options.payment_method_options = {
        wechat_pay: {
          client: "web",
        },
      };
    }

    const session = await stripe.checkout.sessions.create(options);

    const stripe_session_id = session.id;
    updateOrderSession(order_no, stripe_session_id);
    console.log("update order session: ", order_no, stripe_session_id);

    return respData({
      public_key: process.env.STRIPE_PUBLIC_KEY,
      order_no: order_no,
      session_id: stripe_session_id,
    });
  } catch (e) {
    console.log("checkout failed: ", e);
    return respErr("checkout failed");
  }
}
