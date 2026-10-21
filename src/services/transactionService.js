import { getSupabaseClient } from "./supabaseClient";

function getMonthRange(month) {
  const [year, monthNumber] = month.split("-").map(Number);
  const nextMonth = new Date(Date.UTC(year, monthNumber, 1));

  return {
    from: `${month}-01`,
    to: nextMonth.toISOString().slice(0, 10),
  };
}

export async function listTransactions(month) {
  const supabase = getSupabaseClient();
  const { from, to } = getMonthRange(month);
  const { data, error } = await supabase
    .from("finance_transactions")
    .select("id, kind, amount, category, description, occurred_on, created_at")
    .gte("occurred_on", from)
    .lt("occurred_on", to)
    .order("occurred_on", { ascending: false })
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
}

export async function createTransaction(transaction) {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from("finance_transactions")
    .insert(transaction)
    .select("id, kind, amount, category, description, occurred_on, created_at")
    .single();

  if (error) throw error;
  return data;
}

export async function updateTransaction(id, transaction) {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from("finance_transactions")
    .update(transaction)
    .eq("id", id)
    .select("id, kind, amount, category, description, occurred_on, created_at")
    .single();

  if (error) throw error;
  return data;
}

export async function deleteTransaction(id) {
  const supabase = getSupabaseClient();
  const { error } = await supabase
    .from("finance_transactions")
    .delete()
    .eq("id", id);

  if (error) throw error;
}
