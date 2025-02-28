import React, { createContext, useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";

export const AuthContext = createContext();

// export for AuthProvider
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // loading state
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        // Redirect if already logged in
        navigate(getDashboardRoute(parsedUser.role), { replace: true });
      } catch (error) {
        console.error("Error parsing stored user:", error);
        localStorage.removeItem("user");
      }
    }
    setLoading(false);
  }, [navigate]);

  const login = (userData, token) => {
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("token", token); // Stores the token
    setUser(userData);
    navigate(getDashboardRoute(userData.role), { replace: true });
  };

  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
    navigate("/", { replace: true });
  };

  const getDashboardRoute = (role) => {
    switch (role) {
      case "police":
        return "/police";
      case "hospital_staff":
        return "/hospital";
      case "ambulance_driver":
        return "/driver";
      case "patient":
        return "/patient";
      default:
        return "/";
    }
  };

  if (loading) {
    return <div>Loading...</div>; // loading indicator
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

export default AuthProvider;