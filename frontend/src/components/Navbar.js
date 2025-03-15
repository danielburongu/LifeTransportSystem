import React, { useContext, useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Box,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import MenuIcon from "@mui/icons-material/Menu";
import LogoutIcon from "@mui/icons-material/ExitToApp";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { motion } from "framer-motion";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const [anchorEl, setAnchorEl] = useState(null);
  const [userMenuAnchorEl, setUserMenuAnchorEl] = useState(null);
  const navigate = useNavigate();

  const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  const handleUserMenuOpen = (event) => setUserMenuAnchorEl(event.currentTarget);
  const handleUserMenuClose = () => setUserMenuAnchorEl(null);

  const handleLogout = () => {
    logout();
    navigate("/"); // Navigate to home on logout
    handleUserMenuClose();
    handleMenuClose();
  };

  const handleHomeNavigation = () => {
    console.log("Navigating to Home: /");
    navigate("/"); // Explicit navigation to home
    handleMenuClose();
    handleUserMenuClose();
  };

  const navLinks = [
    { text: "Home", path: "/" },
    { text: "About Us", path: "/about-us" },
    { text: "Contact", path: "/contact" },
    { text: "Services", path: "/services" },
    { text: "Privacy Policy", path: "/privacy-policy" },
  ];

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

  return (
    <AppBar
      position="fixed"
      elevation={3}
      sx={{
        backgroundColor: "#00695C",
        borderBottom: "2px solid #D32F2F",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)",
        width: "100%",
        left: 0,
        right: 0,
      }}
    >
      <Toolbar
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          width: "100%",
          mx: "auto", 
          px: { xs: 2, sm: 3, md: 6 },
          py: 1,
        }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <Typography
            variant="h6"
            component={Link}
            to="/"
            onClick={handleHomeNavigation}
            sx={{
              fontFamily: "'Poppins', sans-serif",
              fontWeight: 700,
              fontSize: { xs: "1.25rem", sm: "1.5rem", md: "2rem" },
              textDecoration: "none",
              display: "flex",
              alignItems: "center",
              color: "#FFFFFF",
              cursor: "pointer",
            }}
          >
            <span style={{ color: "#FFFFFF" }}>LIFE</span>
            <span style={{ color: "#FFFFFF", marginLeft: "0.25rem" }}>Transport</span>
          </Typography>
        </motion.div>

        {/* Center Navigation Links */}
        <Box
          sx={{
            display: { xs: "none", md: "flex" },
            flexGrow: 1,
            justifyContent: "center",
            gap: { md: 2, lg: 3, xl: 4 },
          }}
        >
          {navLinks.map((link, index) => (
            <Button
              key={index}
              component={Link}
              to={link.path}
              onClick={link.path === "/" ? handleHomeNavigation : () => console.log(`Navigating to ${link.path}`)}
              sx={{
                color: "#FFFFFF",
                "&:hover": { color: "#FFCA28" },
                textTransform: "none",
                fontFamily: "'Poppins', sans-serif",
                fontWeight: 600,
                fontSize: { md: "0.9rem", lg: "1rem", xl: "1.1rem" },
              }}
            >
              {link.text}
            </Button>
          ))}
        </Box>

        {/* User Section */}
        <Box
          sx={{
            display: { xs: "none", md: "flex" },
            alignItems: "center",
            gap: { md: 1, lg: 2 },
          }}
        >
          {user ? (
            <>
              <Button
                onClick={handleUserMenuOpen}
                sx={{
                  color: "#FFFFFF",
                  textTransform: "none",
                  fontFamily: "'Poppins', sans-serif",
                  fontWeight: 600,
                  fontSize: { md: "0.9rem", lg: "1rem", xl: "1.1rem" },
                  "&:hover": { color: "#FFCA28" },
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                }}
              >
                <AccountCircleIcon sx={{ color: "#D32F2F" }} />
                {user.name}
              </Button>
              <Menu
                anchorEl={userMenuAnchorEl}
                open={Boolean(userMenuAnchorEl)}
                onClose={handleUserMenuClose}
                PaperProps={{
                  sx: {
                    bgcolor: "#00695C",
                    color: "#FFFFFF",
                    border: "1px solid #D32F2F",
                    mt: 1,
                    maxHeight: "80vh",
                    overflowY: "auto",
                    width: "200px",
                  },
                }}
              >
                {navLinks.map((link, index) => (
                  <MenuItem
                    key={index}
                    component={Link}
                    to={link.path}
                    onClick={link.path === "/" ? handleHomeNavigation : () => {
                      console.log(`Dropdown navigating to ${link.path}`);
                      handleUserMenuClose();
                    }}
                    sx={{
                      fontFamily: "'Poppins', sans-serif",
                      color: "#FFFFFF",
                      "&:hover": { bgcolor: "#FFCA28", color: "#00695C" },
                      py: 1.5,
                    }}
                  >
                    {link.text}
                  </MenuItem>
                ))}
                <Box sx={{ borderBottom: "1px solid #FFFFFF", my: 1 }} />
                <MenuItem
                  disabled
                  sx={{
                    fontFamily: "'Poppins', sans-serif",
                    color: "#FFFFFF",
                    "&.Mui-disabled": { opacity: 0.7 },
                    py: 1.5,
                  }}
                >
                  Role: {user.role.replace("_", " ")}
                </MenuItem>
                {["patient", "police", "hospital_staff", "ambulance_driver"].includes(
                  user.role
                ) && (
                  <MenuItem
                    component={Link}
                    to={getDashboardRoute(user.role)}
                    onClick={() => {
                      console.log(`Navigating to dashboard: ${getDashboardRoute(user.role)}`);
                      handleUserMenuClose();
                    }}
                    sx={{
                      fontFamily: "'Poppins', sans-serif",
                      color: "#FFFFFF",
                      "&:hover": { bgcolor: "#FFCA28", color: "#00695C" },
                      py: 1.5,
                    }}
                  >
                    Dashboard
                  </MenuItem>
                )}
                <MenuItem
                  onClick={handleLogout}
                  sx={{
                    fontFamily: "'Poppins', sans-serif",
                    color: "#FFFFFF",
                    "&:hover": { bgcolor: "#FFCA28", color: "#00695C" },
                    py: 1.5,
                  }}
                >
                  <LogoutIcon sx={{ mr: 1 }} /> Logout
                </MenuItem>
              </Menu>
            </>
          ) : (
            <>
              <Button
                component={Link}
                to="/login"
                variant="contained"
                sx={{
                  backgroundColor: "#D32F2F",
                  color: "#FFFFFF",
                  "&:hover": { backgroundColor: "#C62828" },
                  textTransform: "none",
                  borderRadius: "8px",
                  padding: { md: "0.5rem 1rem", lg: "0.75rem 1.5rem" },
                  fontFamily: "'Poppins', sans-serif",
                  fontWeight: 600,
                  fontSize: { md: "0.9rem", lg: "1rem", xl: "1.1rem" },
                }}
              >
                Login
              </Button>
              <Button
                component={Link}
                to="/register"
                variant="contained"
                sx={{
                  backgroundColor: "#D32F2F",
                  color: "#FFFFFF",
                  "&:hover": { backgroundColor: "#C62828" },
                  textTransform: "none",
                  borderRadius: "8px",
                  padding: { md: "0.5rem 1rem", lg: "0.75rem 1.5rem" },
                  fontFamily: "'Poppins', sans-serif",
                  fontWeight: 600,
                  fontSize: { md: "0.9rem", lg: "1rem", xl: "1.1rem" },
                }}
              >
                Register
              </Button>
            </>
          )}
        </Box>

        {/* Mobile Menu */}
        <Box sx={{ display: { xs: "block", md: "none" } }}>
          <IconButton onClick={handleMenuOpen} sx={{ color: "#FFFFFF" }}>
            <MenuIcon />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            PaperProps={{
              sx: {
                bgcolor: "#00695C",
                color: "#FFFFFF",
                border: "1px solid #D32F2F",
                mt: 1,
                maxHeight: "80vh",
                overflowY: "auto",
                width: "200px",
              },
            }}
          >
            {navLinks.map((link, index) => (
              <MenuItem
                key={index}
                component={Link}
                to={link.path}
                onClick={link.path === "/" ? handleHomeNavigation : () => {
                  console.log(`Mobile navigating to ${link.path}`);
                  handleMenuClose();
                }}
                sx={{
                  fontFamily: "'Poppins', sans-serif",
                  color: "#FFFFFF",
                  "&:hover": { bgcolor: "#FFCA28", color: "#00695C" },
                  py: 1.5,
                }}
              >
                {link.text}
              </MenuItem>
            ))}
            <Box sx={{ borderBottom: "1px solid #FFFFFF", my: 1 }} />
            {user ? (
              <>
                <MenuItem
                  disabled
                  sx={{
                    fontFamily: "'Poppins', sans-serif",
                    color: "#FFFFFF",
                    "&.Mui-disabled": { opacity: 0.7 },
                    py: 1.5,
                  }}
                >
                  <AccountCircleIcon sx={{ mr: 1, color: "#D32F2F" }} />{" "}
                  {user.name} ({user.role})
                </MenuItem>
                {["patient", "police", "hospital_staff", "ambulance_driver"].includes(
                  user.role
                ) && (
                  <MenuItem
                    component={Link}
                    to={getDashboardRoute(user.role)}
                    onClick={() => {
                      console.log(`Mobile navigating to dashboard: ${getDashboardRoute(user.role)}`);
                      handleMenuClose();
                    }}
                    sx={{
                      fontFamily: "'Poppins', sans-serif",
                      color: "#FFFFFF",
                      "&:hover": { bgcolor: "#FFCA28", color: "#00695C" },
                      py: 1.5,
                    }}
                  >
                    Dashboard
                  </MenuItem>
                )}
                <MenuItem
                  onClick={handleLogout}
                  sx={{
                    fontFamily: "'Poppins', sans-serif",
                    color: "#FFFFFF",
                    "&:hover": { bgcolor: "#FFCA28", color: "#00695C" },
                    py: 1.5,
                  }}
                >
                  <LogoutIcon sx={{ mr: 1 }} /> Logout
                </MenuItem>
              </>
            ) : (
              <>
                <MenuItem
                  component={Link}
                  to="/login"
                  onClick={handleMenuClose}
                  sx={{
                    fontFamily: "'Poppins', sans-serif",
                    color: "#FFFFFF",
                    "&:hover": { bgcolor: "#FFCA28", color: "#00695C" },
                    py: 1.5,
                  }}
                >
                  Login
                </MenuItem>
                <MenuItem
                  component={Link}
                  to="/register"
                  onClick={handleMenuClose}
                  sx={{
                    fontFamily: "'Poppins', sans-serif",
                    color: "#FFFFFF",
                    "&:hover": { bgcolor: "#FFCA28", color: "#00695C" },
                    py: 1.5,
                  }}
                >
                  Register
                </MenuItem>
              </>
            )}
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;