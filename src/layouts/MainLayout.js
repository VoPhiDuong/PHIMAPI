import React from 'react';
import { Outlet } from 'react-router-dom';
import { Box, Container, CssBaseline } from '@mui/material';

// Components
import Header from '../components/Header';
import Footer from '../components/Footer';
import ScrollToTop from '../components/ScrollToTop';

const MainLayout = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        bgcolor: 'background.default',
      }}
    >
      <CssBaseline />
      <Header />
      <Box component="main" sx={{ flexGrow: 1, py: { xs: 2, sm: 3 }, mt: { xs: 8, sm: 9 } }}>
        <Container 
          maxWidth="xl"
          sx={{
            px: { xs: 1, sm: 2, md: 3 },
            maxWidth: { xs: '100%', sm: 'xl' }
          }}
        >
          <Outlet />
        </Container>
      </Box>
      <Footer />
      <ScrollToTop />
    </Box>
  );
};

export default MainLayout;