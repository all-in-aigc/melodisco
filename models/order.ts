import { Order } from "@/types/order";
import { getSupabaseClient } from "./db";

export async function insertOrder(order: Order) {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase.from("orders").insert([
    {
      order_no: order.order_no,
      created_at: order.created_at,
      user_uuid: order.user_uuid,
      user_email: order.user_email,
      amount: order.amount,
      plan: order.plan,
      expired_at: order.expired_at,
      order_status: order.order_status,
      credits: order.credits,
      currency: order.currency,
    },
  ]);

  if (error) throw error;
  return data;
}

export async function findOrderByOrderNo(
  order_no: number
): Promise<Order | undefined> {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .eq("order_no", order_no)
    .single();

  if (error) throw error;
  return data ? formatOrder(data) : undefined;
}

export async function updateOrderStatus(
  order_no: string,
  order_status: number,
  paied_at: string
) {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from("orders")
    .update({ order_status, paied_at })
    .eq("order_no", order_no);

  if (error) throw error;
  return data;
}

export async function updateOrderSession(
  order_no: string,
  stripe_session_id: string
) {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from("orders")
    .update({ stripe_session_id })
    .eq("order_no", order_no);

  if (error) throw error;
  return data;
}

export async function getUserOrders(
  user_uuid: string
): Promise<Order[] | undefined> {
  const supabase = getSupabaseClient();
  const now = new Date().toISOString();
  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .eq("user_uuid", user_uuid)
    .eq("order_status", 2)
    .gte("expired_at", now);

  if (error) throw error;
  return data ? data.map(formatOrder) : undefined;
}

function formatOrder(row: any): Order {
  const order: Order = {
    order_no: row.order_no,
    created_at: row.created_at,
    user_uuid: row.user_uuid,
    user_email: row.user_email,
    amount: row.amount,
    plan: row.plan,
    expired_at: row.expired_at,
    order_status: row.order_status,
    paied_at: row.paied_at,
    stripe_session_id: row.stripe_session_id,
    credits: row.credits,
    currency: row.currency,
  };

  return order;
}
