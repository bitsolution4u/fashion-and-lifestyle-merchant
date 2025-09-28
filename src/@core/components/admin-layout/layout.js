'use client';
import * as React from 'react';
import { styled, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import MuiDrawer from '@mui/material/Drawer';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import AppBar from './app-bar';
import LeftSideBar from './left-side-drawer';
import Image from 'next/image';
import logoImage from '../../../assets/img/No Tension-06.png';
import { useEffect } from 'react';
import { IconButton } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material';
import { ToastContainer } from 'react-toastify';
import DashboardCustomizeIcon from '@mui/icons-material/DashboardCustomize';

const drawerWidth = 270;

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    // duration: theme.transitions.duration.leavingScreen,
    duration: 0,
  }),
  overflowX: 'hidden',
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up('sm')]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: 'nowrap',
  boxSizing: 'border-box',
  ...(open && {
    ...openedMixin(theme),
    '& .MuiDrawer-paper': openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    '& .MuiDrawer-paper': closedMixin(theme),
  }),
}));

export default function MainLayout({ children }) {
  //  certral place for setting all grocery related data
  const dispatch = useDispatch();
  const router = useRouter();

  const theme = useTheme();
  const [open, setOpen] = React.useState(true);
  const [sideBarPosition, setSideBarPosition] = React.useState(true);
  const [sidebarShow, setSidebarShow] = React.useState(false);
  const [startWidth, setStartWidth] = React.useState(
    typeof window !== 'undefined' ? window.innerWidth : 0
  );
  const [width, setWidth] = React.useState(
    typeof window !== 'undefined' ? window.innerWidth : 0
  );

  const widthFunc = React.useCallback(() => {
    setWidth(window.innerWidth);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setOpen(false);
      widthFunc();
    };
    if (startWidth > 960) {
      if (width < 960 && open) {
        setSideBarPosition(true);
      } else {
        setSideBarPosition(false);
      }
    }

    if (width < 960) {
      setSidebarShow(true);
    } else {
      setSidebarShow(false);
    }
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [width, open, widthFunc]);

  const handleDrawerOpen = () => {
    setOpen((prev) => !prev);
  };

  const themeBreak = createTheme({
    // Define your breakpoints here
    breakpoints: {
      values: {
        xs: 0,
        sm: 600,
        md: 960,
        lg: 1280,
        xl: 1920,
      },
    },
    palette: {
      primary: {
        main: '#7367F0',
      },
    },
  });
  const bigLayoutStyle = {
    gridTemplateColumns: `${
      open && !sideBarPosition ? '272px' : `${sidebarShow ? '0' : '69px'}`
    } 1fr`,
  };
  const smallLayoutStyle = {
    gridTemplateColumns: '1fr',
    marginLeft: `${sidebarShow ? '0' : '54px'}`,
  };

  return (
    <ThemeProvider theme={themeBreak}>
      <Box
        sx={{
          display: 'grid',
          background: '#f8f7fa',
          ...(!sideBarPosition ? bigLayoutStyle : smallLayoutStyle),
        }}
      >
        <CssBaseline />

        <Drawer
          variant="permanent"
          open={open}
          sx={{
            position: `${sideBarPosition ? 'fixed' : 'inherit'}`,
            zIndex: 5,
            width: { md: 'inherit', xs: 0 },
          }}
          PaperProps={{
            sx: {
              display: `${
                sidebarShow ? (!open ? 'none' : 'block') : 'block'
              }  `,
              backgroundColor: '#101618',
            },
          }}
        >
          <Box
            sx={{
              minHeight: '62px',
              display: 'flex',
              justifyContent: `${open ? 'space-between' : 'center'}`,
            }}
          >
            {open ? (
              <Image
                src={logoImage}
                alt="logo"
                width={220}
                height={62}
                className="object-contain"
              />
            ) : (
              ''
            )}

            <IconButton
              color="inherit"
              aria-label="open drawer"
              onClick={handleDrawerOpen}
              edge="start"
              sx={{
                padding: 1,
                color: '#fff',
                // display: `${open ? 'block' : 'none'}`,
              }}
            >
              <DashboardCustomizeIcon
                sx={{
                  width: `${open ? '1em' : '.8em'}`,
                  height: `${open ? '1em' : '.8em'}`,
                }}
              />
            </IconButton>
          </Box>
          <Divider sx={{ borderColor: '#cbcbcb1f' }} />
          <LeftSideBar open={open} />
          <Divider sx={{ borderColor: '#cbcbcb1f' }} />
        </Drawer>
        <Box
          sx={{
            flexGrow: 1,
            px: '12px',
            mt: 12,
            background: '#f8f7fa',
            minHeight: '100vh',
            overflow: 'hidden',
            maxWidth: '100%',
          }}
        >
          <AppBar
            open={open}
            sideBarPosition={sideBarPosition}
            handleDrawerOpen={handleDrawerOpen}
            drawerWidth={drawerWidth}
            appWidth={width}
            sidebarShow={sidebarShow}
          />
          {children}
        </Box>
      </Box>
      <ToastContainer />
    </ThemeProvider>
  );
}

//   return (
//     <ThemeProvider theme={themeBreak}>
//       <Box sx={{ display: 'flex', background: '#f8f7fa' }}>
//         <CssBaseline />
//         <AppBar
//           open={open}
//           handleDrawerOpen={handleDrawerOpen}
//           drawerWidth={drawerWidth}
//         />
//         <Drawer
//           variant="permanent"
//           open={open}
//           sx={{
//             position: `${sideBarPosition ? 'fixed' : 'inherit'}`,
//             zIndex: 2,
//           }}
//           className="drawer-main-section"
//           PaperProps={{
//             sx: {
//               backgroundColor: '#101618',
//             },
//           }}
//         >
//           <Box
//             sx={{
//               minHeight: '62px',
//               display: 'flex',
//               justifyContent: 'space-between',
//             }}
//           >
//             {open ? (
//               <Image
//                 src={logoImage}
//                 alt="logo"
//                 width={220}
//                 height={62}
//                 className="object-contain"
//               />
//             ) : (
//               ''
//             )}

//             <IconButton
//               color="inherit"
//               aria-label="open drawer"
//               onClick={handleDrawerOpen}
//               edge="start"
//               sx={{
//                 padding: 1,
//                 color: '#fff',
//                 display: `${open ? 'block' : 'none'}`,
//               }}
//             >
//               <BiCircle />
//             </IconButton>
//           </Box>
//           <Divider sx={{ borderColor: '#cbcbcb1f' }} />
//           <LeftSideBar
//             open={open}
//             activeModule={activeModule}
//             activeSubModule={activeSubModule}
//             handleActiveModule={handleActiveModule}
//             handleActiveSubModule={handleActiveSubModule}
//             handleActiveInnerSubModule={handleActiveInnerSubModule}
//             activeInnerSubModule={activeInnerSubModule}
//           />
//           <Divider sx={{ borderColor: '#cbcbcb1f' }} />
//         </Drawer>
//         <Box
//           sx={{
//             flexGrow: 1,
//             p: 3,
//             mt: 8,
//             background: '#f8f7fa',
//             minHeight: '100vh',
//           }}
//         >
//           {children}
//         </Box>
//       </Box>
//     </ThemeProvider>
//   );
// }
