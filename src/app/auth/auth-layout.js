import { Box, createTheme, ThemeProvider } from '@mui/material';
import React from 'react';

const AuthLayout = ({ children }) => {
  const themeColor = createTheme({
    // Define your breakpoints here
    palette: {
      primary: {
        main: '#7367F0',
      },
    },
  });
  return (
    <ThemeProvider theme={themeColor}>
      {/* <div>{children}</div> */}
    </ThemeProvider>
  );
};

export default AuthLayout;
