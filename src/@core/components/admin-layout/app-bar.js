"use client";
import { Box, IconButton, Toolbar, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import MuiAppBar from "@mui/material/AppBar";
import { styled } from "@mui/material/styles";
import UserDropdown from "./app-component/UserDropdown";
import MenuIcon from "@mui/icons-material/Menu";
import { useSelector } from "react-redux";
import StorefrontIcon from "@mui/icons-material/Storefront";
import LocationOnIcon from "@mui/icons-material/LocationOn";

const AppBarComponent = ({ handleDrawerOpen, drawerWidth, open }) => {
  const [scrolled, setScrolled] = useState(false);

  // Redux: Get logged-in user data
  const userData = useSelector((state) => state.user.loginUserInfo);

  // Styled AppBar
  const AppBar = styled(MuiAppBar, {
    shouldForwardProp: (prop) => prop !== "open",
  })(({ theme, open }) => ({
    zIndex: theme.zIndex.drawer + 1,
    boxShadow: "-1px 1px 3px 2px #c9c9c940;",
    top: `${scrolled ? "" : "20px"}`,
    marginRight: "1em",
    width: `calc(100% - 100px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    ...(open && {
      marginLeft: drawerWidth,
      width: `calc(100% - ${drawerWidth + 50}px)`,
      transition: theme.transitions.create(["width", "margin"], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
      boxShadow: "-1px 1px 3px 2px #c9c9c940;",
      marginRight: "2em",
    }),
  }));

  // Scroll detection for top spacing
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY >= 70);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const settings = {
    appBar: "fixed",
    appBarBlur: true,
    contentWidth: "boxed",
    direction: "ltr",
    footer: "static",
    lastLayout: "vertical",
    layout: "vertical",
    mode: "semi-dark",
    navCollapsed: true,
    navHidden: false,
    skin: "default",
    themeColor: "primary",
    toastPosition: "top-right",
    verticalNavToggleType: "accordion",
  };

  return (
    <AppBar
      position="fixed"
      open={open}
      sx={{
        backgroundColor: "rgba(255, 255, 255, 0.95)",
        backdropFilter: "blur(8px)",
        boxShadow: "0 4px 10px rgba(0,0,0,0.08)",
        py: { xs: 0.5, sm: 1 },
      }}
    >
      <Toolbar sx={{ px: { xs: 1, sm: 3 } }}>
        {/* Drawer Icon */}
        <Box sx={{ display: open ? "none" : "flex" }}>
          <IconButton
            color="inherit"
            onClick={handleDrawerOpen}
            edge="start"
            sx={{
              color: "#333",
              "&:hover": { backgroundColor: "rgba(0,0,0,0.05)" },
            }}
          >
            <MenuIcon fontSize="medium" />
          </IconButton>
        </Box>

        {/* Shop Info with Icons */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "flex-start",
            width: { xs: "100%", sm: "60%" },
            textAlign: "left",
            px: 2,
            py: 1,
            backgroundColor: "#f9f9f9",
            borderRadius: "12px",
            boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
            transition: "all 0.3s ease",
            "&:hover": { boxShadow: "0 4px 12px rgba(0,0,0,0.1)" },
          }}
        >
          {/* Shop Name */}
          <Box sx={{ display: "flex", alignItems: "center", mb: 0.5 }}>
            <StorefrontIcon sx={{ mr: 1, color: "#1976d2" }} fontSize="small" />
            <Typography
              variant="subtitle1"
              sx={{
                fontWeight: "600",
                color: "#111",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {userData?.shopName || "Shop Name"}
            </Typography>
          </Box>

          {/* Shop Address */}
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <LocationOnIcon sx={{ mr: 1, color: "#f50057" }} fontSize="small" />
            <Typography
              variant="body2"
              sx={{
                color: "#555",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {userData?.shopAddress || "Shop Address"}
            </Typography>
          </Box>
        </Box>

        {/* User Dropdown */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            width: { xs: "100%", sm: "40%" },
            ml: 2,
          }}
        >
          <UserDropdown settings={settings} />
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default AppBarComponent;
