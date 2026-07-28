import { supabase } from "./supabaseClient";

export async function getSchools() {
  const { data, error } =
    await supabase
      .from("schools")
      .select("*")
      .eq("active", true)
      .order("name");

  if (error) throw error;

  return data || [];
}