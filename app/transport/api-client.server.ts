import { createClient as createSupabaseClient } from "@supabase/supabase-js";

export function createClient() {
  console.log(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

  return createSupabaseClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_KEY!
  );
}
