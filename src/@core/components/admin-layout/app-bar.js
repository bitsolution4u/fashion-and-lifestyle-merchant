'use client';
import { Box, IconButton, Toolbar, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import MuiAppBar from '@mui/material/AppBar';
import { styled } from '@mui/material/styles';
import UserDropdown from './app-component/UserDropdown';
import MenuIcon from '@mui/icons-material/Menu';


const AppBar = ({ handleDrawerOpen, drawerWidth, open }) => {
  const [scrolled, setScrolled] = useState(false);
  const AppBar = styled(MuiAppBar, {
    shouldForwardProp: (prop) => prop !== 'open',
  })(({ theme, open }) => ({
    zIndex: theme.zIndex.drawer + 1,
    boxShadow: '-1px 1px 3px 2px #c9c9c940;',
    top: `${scrolled ? '' : '20px'}`,
    marginRight: '1em',
    width: `calc(100% - ${100}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    ...(open && {
      marginLeft: drawerWidth,
      width: `calc(100% - ${drawerWidth + 50}px)`,
      transition: theme.transitions.create(['width', 'margin'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
      boxShadow: '-1px 1px 3px 2px #c9c9c940;',
      marginRight: '2em',
    }),
  }));

  // scroll check to adjust top bar

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY >= 70) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const settings = {
    appBar: 'fixed',
    appBarBlur: true,
    contentWidth: 'boxed',
    direction: 'ltr',
    footer: 'static',
    lastLayout: 'vertical',
    layout: 'vertical',
    mode: 'semi-dark',
    navCollapsed: true,
    navHidden: false,
    skin: 'default',
    themeColor: 'primary',
    toastPosition: 'top-right',
    verticalNavToggleType: 'accordion',
  };


  return (
    <AppBar position="fixed" open={open} sx={{ backgroundColor: '#fff'}}>
      <Toolbar>
         <Box sx={{ display: open ? 'none' : 'flex' }}>
          <IconButton
            color="inherit"
            onClick={handleDrawerOpen}
            edge="start"
            sx={{ color: '#333', '&:hover': { backgroundColor: 'rgba(0,0,0,0.05)' } }}
          >
            <MenuIcon fontSize="medium" />
          </IconButton>
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'center', width: '60%' }}>
          <div class="flex items-center space-x-4 p-4 rounded-lg neo-shadow"></div>
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'right', width: '40%' }}>
          <UserDropdown settings={settings} />
        </Box>
      </Toolbar>
    </AppBar>
    

  );
};

export default AppBar;
