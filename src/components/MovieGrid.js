import React from 'react';
import { Grid, Box, Typography, Pagination } from '@mui/material';
import MovieCard from './MovieCard';

const MovieGrid = ({ title, movies, totalPages = 1, currentPage = 1, onPageChange }) => {
  if (!movies || movies.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 5 }}>
        <Typography variant="h6">Không tìm thấy phim nào</Typography>
      </Box>
    );
  }

  const handlePageChange = (event, value) => {
    if (onPageChange) {
      onPageChange(value);
      // Scroll to top when changing page
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <Box sx={{ mb: 4 }}>
      {title && (
        <Typography
          variant="h5"
          component="h2"
          sx={{
            mb: 3,
            fontWeight: 'bold',
            display: 'flex',
            alignItems: 'center',
            '&::before': {
              content: '""',
              width: 4,
              height: 24,
              backgroundColor: 'primary.main',
              display: 'inline-block',
              marginRight: 1,
              borderRadius: 1,
            },
          }}
        >
          {title}
        </Typography>
      )}

      <Grid container spacing={2}>
        {movies.map((movie) => (
          <Grid item key={movie._id} xs={6} sm={4} md={3} lg={2.4} xl={2}>
            <MovieCard movie={movie} />
          </Grid>
        ))}
      </Grid>

      {totalPages > 1 && (
        <Box sx={{ mt: 4 }}>
          <Pagination
            totalPages={totalPages}
            currentPage={currentPage}
            onChange={handlePageChange}
            totalItems={movies.length > 0 ? (totalPages * movies.length) : 0}
            itemsPerPage={movies.length}
          />
        </Box>
      )}
    </Box>
  );
};

export default MovieGrid;