import React, { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import Slider from 'react-slick';
import {
  Box,
  Typography,
  Button,
  Rating,
  useTheme,
  useMediaQuery,
  Chip,
} from '@mui/material';
import { PlayArrow, Info } from '@mui/icons-material';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const HeroSlider = ({ movies }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 6000,
    pauseOnHover: true,
    beforeChange: (current, next) => setCurrentSlide(next),
    dotsClass: 'slick-dots custom-dots',
    customPaging: (i) => (
      <Box
        sx={{
          width: 10,
          height: 10,
          borderRadius: '50%',
          backgroundColor: i === currentSlide ? '#ff6b35' : 'rgba(255, 255, 255, 0.4)',
          transition: 'all 0.3s ease',
          cursor: 'pointer',
        }}
      />
    ),
  };

  if (!movies || movies.length === 0) {
    return null;
  }

  return (
    <Box sx={{ position: 'relative', mb: 4 }}>
      <Slider {...settings}>
        {movies.map((movie, index) => (
          <Box key={index} sx={{ position: 'relative' }}>
            <Box
              component="img"
              src={`https://img.phimapi.com/${movie.poster_url}`}
              alt={movie.name}
              sx={{
                width: '100%',
                height: { xs: '300px', sm: '400px', md: '500px', lg: '600px' },
                objectFit: 'cover',
                borderRadius: '16px',
                filter: 'brightness(0.8)'
              }}
            />
            {/* Dark overlay */}
            <Box
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'linear-gradient(45deg, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 50%, rgba(0,0,0,0.8) 100%)',
                borderRadius: '16px',
              }}
            />
            {/* Content overlay */}
            <Box
              sx={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                background: 'linear-gradient(transparent, rgba(0,0,0,0.9))',
                color: 'white',
                p: { xs: 3, md: 5 },
                borderRadius: '0 0 16px 16px',
              }}
            >
              <Typography
                variant="h3"
                component="h1"
                sx={{
                  fontWeight: '700',
                  mb: 2,
                  fontSize: { xs: '1.8rem', sm: '2.5rem', md: '3rem' },
                  textShadow: '2px 2px 4px rgba(0,0,0,0.8)',
                  color: '#ffffff',
                }}
              >
                {movie.name}
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  mb: 3,
                  opacity: 0.9,
                  fontSize: { xs: '1rem', md: '1.2rem' },
                  color: '#b0b0b0',
                  fontWeight: 400
                }}
              >
                {movie.origin_name} • {movie.year}
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <Button
                   variant="contained"
                   size="large"
                   component={RouterLink}
                   to={`/phim/${movie.slug}`}
                  sx={{
                    background: '#ff6b35',
                    borderRadius: '8px',
                    px: 4,
                    py: 1.5,
                    fontSize: { xs: '1rem', md: '1.1rem' },
                    fontWeight: '600',
                    textTransform: 'none',
                    boxShadow: '0 4px 15px rgba(255, 107, 53, 0.4)',
                    '&:hover': {
                      background: '#e55a2b',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 6px 20px rgba(255, 107, 53, 0.6)'
                    },
                    transition: 'all 0.3s ease'
                  }}
                >
                  🎬 Xem Ngay
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  sx={{
                    borderColor: '#ffffff',
                    color: '#ffffff',
                    borderRadius: '8px',
                    px: 3,
                    py: 1.5,
                    fontSize: { xs: '1rem', md: '1.1rem' },
                    fontWeight: '600',
                    textTransform: 'none',
                    '&:hover': {
                      borderColor: '#ff6b35',
                      color: '#ff6b35',
                      background: 'rgba(255, 107, 53, 0.1)'
                    },
                    transition: 'all 0.3s ease'
                  }}
                >
                  ℹ️ Chi Tiết
                </Button>
              </Box>
            </Box>
          </Box>
        ))}
      </Slider>
    </Box>
  );
};

export default HeroSlider;