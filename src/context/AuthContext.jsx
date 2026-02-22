import { createContext, useContext, useMemo, useState } from "react";

const AuthContext = createContext(null);

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  const isAuthenticated = user !== null;

  const isAdmin = () => user?.role === "admin";

  function login(username, password, role = "regular") {
    const safeRole = role === "admin" ? "admin" : "regular";

    const mockToken = `mock_jwt_${Date.now()}`;
    const userData = { username, role: safeRole, token: mockToken };

    setUser(userData);
    localStorage.setItem("authToken", mockToken);
    localStorage.setItem("authUser", JSON.stringify(userData));

    return userData;
  }

  function logout() {
    setUser(null);
    localStorage.removeItem("authToken");
    localStorage.removeItem("authUser");
  }

  function hasRole(role) {
    return user?.role === role;
  }

    const value = useMemo(
        () => ({ user, isAuthenticated, isAdmin, login, logout, hasRole }),
        [user, isAuthenticated]
    );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}