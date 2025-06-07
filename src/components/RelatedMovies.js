import React from 'react';
import { Box, Typography, Grid, Paper } from '@mui/material';
import MovieCard from './MovieCard';

const RelatedMovies = ({ movies, title = 'Phim liên quan' }) => {
  if (!movies || movies.length === 0) return null;

  return (
    <Paper
      elevation={3}
      sx={{
        p: { xs: 2, md: 3 },
        borderRadius: 2,
        mb: 4,
        backgroundColor: 'background.paper',
      }}
    >
      <Typography variant="h5" component="h2" sx={{ fontWeight: 'bold', mb: 3 }}>
        {title}
      </Typography>

      <Grid container spacing={2}>
        {movies.map((movie) => (
          <Grid item xs={6} sm={4} md={3} lg={2} key={movie._id}>
            <MovieCard movie={movie} />
          </Grid>
        ))}
      </Grid>
    </Paper>
  );
};

export default RelatedMovies;