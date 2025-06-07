import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

import theme from './theme/theme';
import { AppProvider } from './context/AppContext';
import MainLayout from './layouts/MainLayout';

// Pages
import Home from './pages/Home';
import MovieDetail from './pages/MovieDetail';
import MovieList from './pages/MovieList';
import Category from './pages/Category';
import Country from './pages/Country';
import Year from './pages/Year';
import Search from './pages/Search';
import NotFound from './pages/NotFound';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppProvider>
        <Routes>
            <Route path="/" element={<MainLayout />}>
              <Route index element={<Home />} />
              <Route path="phim/:slug" element={<MovieDetail />} />
              <Route path="danh-sach/:type" element={<MovieList />} />
              <Route path="phim-le" element={<MovieList />} />
              <Route path="phim-bo" element={<MovieList />} />
              <Route path="phim-hay" element={<MovieList />} />
              <Route path="the-loai/:slug" element={<Category />} />
              <Route path="quoc-gia/:slug" element={<Country />} />
              <Route path="nam/:year" element={<Year />} />
              <Route path="tim-kiem" element={<Search />} />
              <Route path="search" element={<Search />} />
              <Route path="*" element={<NotFound />} />
            </Route>
        </Routes>
      </AppProvider>
    </ThemeProvider>
  );
}

export default App;