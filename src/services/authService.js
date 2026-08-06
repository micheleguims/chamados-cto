import { supabase } from "./supabaseClient";

export async function signIn(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw error;

  return data;
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();

  if (error) throw error;
}

export async function getCurrentUser() {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error) throw error;

  return user;
}

export async function getCurrentProfile() {
  const user = await getCurrentUser();

  if (!user) {
    return null;
  }

  const { data, error } = await supabase
    .from("profiles")
    .select("id, email, nome, role, ativo, created_at, cre, school_code")
    .eq("id", user.id)
    .single();

  if (error) throw error;

  return {
    id: data.id,
    email: data.email,
    nome: data.nome,
    username: data.nome || data.email,
    name: data.nome || data.email,
    role: data.role,
    ativo: data.ativo,
    createdAt: data.created_at,
    cre: data.cre || "",
    schoolCode: data.school_code || "",
  };
}