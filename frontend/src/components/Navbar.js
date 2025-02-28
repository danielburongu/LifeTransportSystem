import React, { useContext, useState } from "react";
import { AppBar, Toolbar, Typography, Button, IconButton, Menu, MenuItem, Box } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import MenuIcon from "@mui/icons-material/Menu";
import LogoutIcon from "@mui/icons-material/ExitToApp";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { motion } from "framer-motion";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();

  const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  const handleLogout = () => {
    logout();
    navigate("/");
    handleMenuClose();
  };

  return (
    <AppBar
      position="fixed"
      elevation={3}
      className="w-full m-0 p-0"
      sx={{
        backgroundColor: "#00695C",
        borderBottom: "2px solid #D32F2F",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)",
        width: "100vw",
        left: 0,
        right: 0,
      }}
    >
      <Toolbar
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          maxWidth: "1400px",
          width: "100%",
          mx: "auto",
          px: { xs: 3, md: 6 },
          py: 1,
        }}
      >
        {/* Logo / Brand */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <Typography
            variant="h6"
            component={Link}
            to="/"
            sx={{
              fontFamily: "'font-poppins', sans-serif",
              fontWeight: 700,
              fontSize: { xs: "1.5rem", md: "2rem" },
              textDecoration: "none",
              display: "flex",
              alignItems: "center",
              color: "#FFFFFF",
              cursor: "pointer",
            }}
          >
            <span style={{ color: "#FFFFFF" }}>Life</span>
            <span style={{ color: "#FFFFFF", marginLeft: "0.25rem" }}>Transport</span>
          </Typography>
        </motion.div>

        {/* Desktop Navigation */}
        <Box sx={{ display: { xs: "none", md: "flex" }, alignItems: "center", gap: 4 }}>
          {user ? (
            <>
              <Typography
                variant="body1"
                sx={{
                  fontFamily: "'font-poppins', sans-serif",
                  color: "#FFFFFF",
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                }}
              >
                <AccountCircleIcon sx={{ color: "#D32F2F" }} /> {user.name} (
                {user.role.replace("_", " ")})
              </Typography>
              {["patient", "police", "hospital_staff", "ambulance_driver"].includes(user.role) && (
                <Button
                  component={Link}
                  to={`/${user.role}`}
                  variant="contained"
                  sx={{
                    backgroundColor: "#D32F2F",
                    color: "#FFFFFF",
                    "&:hover": { backgroundColor: "#C62828" },
                    textTransform: "none",
                    borderRadius: "8px",
                    padding: "0.75rem 1.5rem",
                    fontFamily: "'font-poppins', sans-serif",
                    fontWeight: 600,
                  }}
                >
                  Dashboard
                </Button>
              )}
              <Button
                onClick={handleLogout}
                startIcon={<LogoutIcon />}
                variant="outlined"
                sx={{
                  borderColor: "#FFFFFF",
                  color: "#FFFFFF",
                  "&:hover": { borderColor: "#D32F2F", bgcolor: "#D32F2F" },
                  textTransform: "none",
                  borderRadius: "8px",
                  padding: "0.75rem 1.5rem",
                  fontFamily: "'font-poppins', sans-serif",
                  fontWeight: 600,
                }}
              >
                Logout
              </Button>
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
                  padding: "0.75rem 1.5rem",
                  fontFamily: "'font-poppins', sans-serif",
                  fontWeight: 600,
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
                  padding: "0.75rem 1.5rem",
                  fontFamily: "'font-poppins', sans-serif",
                  fontWeight: 600,
                }}
              >
                Register
              </Button>
            </>
          )}
        </Box>

        {/* Mobile Navigation */}
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
              },
            }}
          >
            {user ? (
              <>
                <MenuItem
                  disabled
                  sx={{
                    fontFamily: "'font-poppins', sans-serif",
                    color: "#FFFFFF",
                    "&.Mui-disabled": { opacity: 0.7 },
                  }}
                >
                  <AccountCircleIcon sx={{ mr: 1, color: "#D32F2F" }} /> {user.name} ({user.role})
                </MenuItem>
                {["patient", "police", "hospital_staff", "ambulance_driver"].includes(user.role) && (
                  <MenuItem
                    onClick={handleMenuClose}
                    component={Link}
                    to={`/${user.role}`}
                    sx={{
                      fontFamily: "'font-poppins', sans-serif",
                      color: "#FFFFFF",
                      "&:hover": { bgcolor: "#D32F2F" },
                    }}
                  >
                    Dashboard
                  </MenuItem>
                )}
                <MenuItem
                  onClick={handleLogout}
                  sx={{
                    fontFamily: "'font-poppins', sans-serif",
                    color: "#FFFFFF",
                    "&:hover": { bgcolor: "#D32F2F" },
                  }}
                >
                  <LogoutIcon sx={{ mr: 1 }} /> Logout
                </MenuItem>
              </>
            ) : (
              <>
                <MenuItem
                  onClick={handleMenuClose}
                  component={Link}
                  to="/login"
                  sx={{
                    fontFamily: "'font-poppins', sans-serif",
                    color: "#FFFFFF",
                    "&:hover": { bgcolor: "#D32F2F" },
                  }}
                >
                  Login
                </MenuItem>
                <MenuItem
                  onClick={handleMenuClose}
                  component={Link}
                  to="/register"
                  sx={{
                    fontFamily: "'font-poppins', sans-serif",
                    color: "#FFFFFF",
                    "&:hover": { bgcolor: "#D32F2F" },
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