// ==========================================
// USE AUTH
// ==========================================
//
// Hook responsável por:
//
// - Login
// - Logout
// - Sessão
// - Perfil do usuário
// - Permissões
//
// Origem:
//
// LoginView
// App.jsx
//
// Futuro:
//
// Integração:
//
// - Supabase Auth
// - Azure AD
// - Microsoft 365
//
// ==========================================

import { useEffect, useState } from "react";
import { supabase } from "../services/supabaseClient";
import { getCurrentProfile } from "../services/authService";

export function useAuth() {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loadingAuth, setLoadingAuth] = useState(true);

  async function loadAuthData() {
    setLoadingAuth(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    setUser(user);

    if (user) {
      const profileData = await getCurrentProfile();
      setProfile(profileData);
    } else {
      setProfile(null);
    }

    setLoadingAuth(false);
  }

  useEffect(() => {
    loadAuthData();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(() => {
      loadAuthData();
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return {
    user,
    profile,
    loadingAuth,
    isAuthenticated: !!user,
    role: profile?.role ?? null,
    isActive: profile?.ativo === true,
  };
}