import { supabase } from "./supabaseClient";

export async function getOccurrenceTemplates() {
  const { data, error } = await supabase
    .from("occurrence_templates")
    .select("*")
    .eq("active", true)
    .order("service_type")
    .order("occurrence_name");

  if (error) throw error;

  return data || [];
}