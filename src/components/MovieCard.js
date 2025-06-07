import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  Chip,
  Rating,
  IconButton,
} from '@mui/material';
import { PlayArrow } from '@mui/icons-material';

const MovieCard = ({ movie }) => {
  // Xử lý khi không có poster
  const posterUrl = movie.poster_url && movie.poster_url.startsWith('http')
    ? movie.poster_url
    : movie.poster_url
      ? `https://img.phimapi.com/${movie.poster_url}`
      : 'https://via.placeholder.com/300x450?text=No+Image';

  // Xử lý rating từ TMDB nếu có
  const rating = movie.tmdb && movie.tmdb.vote_average ? movie.tmdb.vote_average / 2 : 0;

  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: '12px',
        overflow: 'hidden',
        transition: 'all 0.3s ease',
        background: '#1a1a2e',
        border: 'none',
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
        '&:hover': {
          transform: 'translateY(-8px)',
          boxShadow: '0 12px 24px rgba(0,0,0,0.25)',
          '& .movie-poster': {
            transform: 'scale(1.05)'
          },
          '& .play-overlay': {
            opacity: 1
          }
        },
      }}
    >
      <Box sx={{ position: 'relative', overflow: 'hidden' }}>
        <CardMedia
          component="img"
          height="280"
          image={posterUrl}
          alt={movie.name}
          className="movie-poster"
          sx={{
            objectFit: 'cover',
            transition: 'transform 0.3s ease',
          }}
        />
        
        {/* Quality badge */}
        {movie.quality && (
          <Chip
            label={movie.quality}
            size="small"
            sx={{
              position: 'absolute',
              top: 8,
              left: 8,
              fontWeight: 'bold',
              fontSize: '0.7rem',
              background: '#ff6b35',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              height: '20px'
            }}
          />
        )}
        
        {/* Episode badge */}
        {movie.episode_current && (
          <Chip
            label={movie.episode_current}
            size="small"
            sx={{
              position: 'absolute',
              top: 8,
              right: 8,
              fontWeight: 'bold',
              fontSize: '0.7rem',
              background: '#4ecdc4',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              height: '20px'
            }}
          />
        )}
        
        {/* Play overlay */}
        <Box
          className="play-overlay"
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            opacity: 0,
            transition: 'opacity 0.3s ease',
          }}
        >
          <IconButton
             component={RouterLink}
             to={`/phim/${movie.slug}`}
             sx={{
               color: 'white',
               background: '#ff6b35',
               width: 50,
               height: 50,
               '&:hover': {
                 background: '#e55a2b',
                 transform: 'scale(1.1)'
               },
               transition: 'all 0.3s ease'
             }}
           >
             <PlayArrow sx={{ fontSize: 28 }} />
           </IconButton>
        </Box>
      </Box>
      
      <CardContent sx={{ flexGrow: 1, p: 2, background: '#1a1a2e' }}>
        <Typography
          variant="h6"
          component={RouterLink}
          to={`/phim/${movie.slug}`}
          sx={{
            fontWeight: '600',
            fontSize: '0.95rem',
            lineHeight: 1.3,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            textDecoration: 'none',
            color: '#ffffff',
            mb: 1,
            '&:hover': {
              color: '#ff6b35',
            },
            transition: 'color 0.3s ease'
          }}
        >
          {movie.name}
        </Typography>
        
        {movie.origin_name && (
          <Typography
            variant="body2"
            sx={{
              fontSize: '0.8rem',
              mb: 1.5,
              display: '-webkit-box',
              WebkitLineClamp: 1,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              color: '#b0b0b0'
            }}
          >
            {movie.origin_name}
          </Typography>
        )}
        
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          mt: 'auto'
        }}>
          {movie.year && (
            <Typography 
              variant="body2" 
              sx={{
                color: '#ff6b35',
                fontWeight: '600',
                fontSize: '0.8rem'
              }}
            >
              {movie.year}
            </Typography>
          )}
          
          {/* Rating */}
          {rating > 0 && (
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Rating
                value={rating}
                precision={0.5}
                readOnly
                size="small"
                sx={{ 
                  mr: 0.5,
                  '& .MuiRating-iconFilled': {
                    color: '#ffd700'
                  },
                  '& .MuiRating-icon': {
                    fontSize: '1rem'
                  }
                }}
              />
              <Typography 
                variant="caption" 
                sx={{
                  color: '#ffd700',
                  fontWeight: '600',
                  fontSize: '0.75rem'
                }}
              >
                {rating.toFixed(1)}
              </Typography>
            </Box>
          )}
        </Box>
      </CardContent>
    </Card>
  );
};

export default MovieCard;