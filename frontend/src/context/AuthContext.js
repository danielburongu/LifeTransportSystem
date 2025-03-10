import React, { createContext, useState, useEffect, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const [isInitialLoad, setIsInitialLoad] = useState(true); // Track first load

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        // Only redirect to dashboard on initial load from specific routes
        if (isInitialLoad) {
          const currentPath = location.pathname;
          const dashboardRoute = getDashboardRoute(parsedUser.role);
          if (
            currentPath === "/" ||
            currentPath === "/login" ||
            currentPath === "/register"
          ) {
            console.log("Initial load redirect to:", dashboardRoute);
            navigate(dashboardRoute, { replace: true });
          }
          setIsInitialLoad(false); // Mark initial load complete
        }
      } catch (error) {
        console.error("Error parsing stored user:", error);
        localStorage.removeItem("user");
      }
    }
    setLoading(false);
  }, [navigate, location, isInitialLoad]); // Include isInitialLoad

  const login = (userData, token) => {
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("token", token);
    setUser(userData);
    const dashboardRoute = getDashboardRoute(userData.role);
    console.log("Login redirect to:", dashboardRoute);
    navigate(dashboardRoute, { replace: true }); // Redirect on login
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
    return <div>Loading...</div>;
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

export default AuthProvider;