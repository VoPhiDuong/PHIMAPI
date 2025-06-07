import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import Slider from 'react-slick';
import {
  Box,
  Typography,
  useTheme,
  useMediaQuery,
  Button,
} from '@mui/material';
import { ChevronLeft, ChevronRight } from '@mui/icons-material';
import MovieCard from './MovieCard';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const CustomPrevArrow = ({ onClick }) => (
  <Box
    onClick={onClick}
    sx={{
      position: 'absolute',
      left: -25,
      top: '50%',
      transform: 'translateY(-50%)',
      zIndex: 2,
      width: 40,
      height: 40,
      borderRadius: '50%',
      backgroundColor: '#1a1a2e',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer',
      boxShadow: '0 4px 12px rgba(0,0,0,0.25)',
      transition: 'all 0.3s ease',
      '&:hover': {
        backgroundColor: '#ff6b35',
        transform: 'translateY(-50%) scale(1.1)',
      },
    }}
  >
    <ChevronLeft sx={{ color: '#ffffff', fontSize: 24 }} />
  </Box>
);

const CustomNextArrow = ({ onClick }) => (
  <Box
    onClick={onClick}
    sx={{
      position: 'absolute',
      right: -25,
      top: '50%',
      transform: 'translateY(-50%)',
      zIndex: 2,
      width: 40,
      height: 40,
      borderRadius: '50%',
      backgroundColor: '#1a1a2e',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer',
      boxShadow: '0 4px 12px rgba(0,0,0,0.25)',
      transition: 'all 0.3s ease',
      '&:hover': {
        backgroundColor: '#ff6b35',
        transform: 'translateY(-50%) scale(1.1)',
      },
    }}
  >
    <ChevronRight sx={{ color: '#ffffff', fontSize: 24 }} />
  </Box>
);

const MovieSlider = ({ title, movies, viewMoreLink = null }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));

  const settings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: isMobile ? 2 : isTablet ? 3 : 6,
    slidesToScroll: isMobile ? 2 : isTablet ? 3 : 4,
    prevArrow: <CustomPrevArrow />,
    nextArrow: <CustomNextArrow />,
    responsive: [
      {
        breakpoint: 1200,
        settings: {
          slidesToShow: 5,
          slidesToScroll: 3,
        },
      },
      {
        breakpoint: 900,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 2,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 2,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
    ],
  };

  if (!movies || movies.length === 0) {
    return null;
  }

  return (
    <Box sx={{ mb: 6 }}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 3,
        }}
      >
        <Typography
          variant="h4"
          component="h2"
          sx={{
            fontWeight: '700',
            color: '#ffffff',
            fontSize: { xs: '1.5rem', md: '2rem' },
            position: 'relative',
            '&::before': {
              content: '""',
              position: 'absolute',
              left: 0,
              bottom: -8,
              width: 60,
              height: 4,
              backgroundColor: '#ff6b35',
              borderRadius: '2px',
            },
          }}
        >
          🔥 {title}
        </Typography>
        {viewMoreLink && (
          <Button
            component={RouterLink}
            to={viewMoreLink}
            variant="outlined"
            sx={{
              borderColor: '#ff6b35',
              color: '#ff6b35',
              borderRadius: '8px',
              px: 3,
              py: 1,
              fontSize: '0.9rem',
              fontWeight: '600',
              textTransform: 'none',
              '&:hover': {
                borderColor: '#e55a2b',
                color: '#e55a2b',
                background: 'rgba(255, 107, 53, 0.1)',
              },
              transition: 'all 0.3s ease',
            }}
          >
            Xem thêm →
          </Button>
        )}
      </Box>
      <Box sx={{ position: 'relative', px: 3 }}>
        <Slider {...settings}>
          {movies.map((movie, index) => (
            <Box key={index} sx={{ px: 1 }}>
              <MovieCard movie={movie} />
            </Box>
          ))}
        </Slider>
      </Box>
    </Box>
  );
};

export default MovieSlider;