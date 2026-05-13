import { createContext, useContext, useEffect, useState } from "react";

import { api, tokenStore } from "../services/api";


const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(Boolean(tokenStore.getAccess()));

  useEffect(() => {
    async function loadUser() {
      if (!tokenStore.getAccess()) {
        setLoading(false);
        return;
      }
      try {
        const { data } = await api.get("/auth/me/");
        setUser(data);
      } catch {
        tokenStore.clear();
      } finally {
        setLoading(false);
      }
    }
    loadUser();
  }, []);

  const login = async (credentials) => {
    const { data } = await api.post("/auth/login/", credentials);
    tokenStore.set(data);
    const profile = await api.get("/auth/me/");
    setUser(profile.data);
  };

  const register = async (payload) => {
    await api.post("/auth/register/", payload);
    await login({ email: payload.email, password: payload.password });
  };

  const logout = async () => {
    const refresh = tokenStore.getRefresh();
    try {
      if (refresh) await api.post("/auth/logout/", { refresh });
    } finally {
      tokenStore.clear();
      setUser(null);
    }
  };

  const updateProfile = async (payload) => {
    const { data } = await api.patch("/auth/me/", payload);
    setUser(data);
    return data;
  };

  const value = { user, loading, isAuthenticated: Boolean(user), login, register, logout, updateProfile };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}
