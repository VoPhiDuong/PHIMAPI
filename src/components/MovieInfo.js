import React, { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Typography,
  Chip,
  Button,
  Grid,
  Card,
  CardContent,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Rating,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  Paper,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  PlayArrow as PlayIcon,
  Favorite as FavoriteIcon,
  FavoriteBorder as FavoriteOutlineIcon,
  Share as ShareIcon,
  Download as DownloadIcon,
  Star as StarIcon,
  AccessTime as TimeIcon,
  DateRange as DateIcon,
  Visibility as ViewIcon,
  Language as LanguageIcon,
  Hd as HdIcon,
  Add as AddIcon,
  Remove as RemoveIcon,
  AccessTime,
  Category,
  Public,
  CalendarMonth,
  Language,
  LocalMovies,
  Star,
} from '@mui/icons-material';
import { formatViews, formatDuration, convertToSlug } from '../utils/utils';

const MovieInfo = ({ movie }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  if (!movie) return null;

  // Xử lý khi không có poster
  const posterUrl = movie.poster_url && movie.poster_url.startsWith('http')
    ? movie.poster_url
    : movie.poster_url
      ? `https://img.phimapi.com/${movie.poster_url}`
      : 'https://via.placeholder.com/300x450?text=No+Image';

  // Xử lý rating từ TMDB nếu có
  const rating = movie.tmdb && movie.tmdb.vote_average ? movie.tmdb.vote_average / 2 : 0;

  return (
    <Paper
      elevation={3}
      sx={{
        p: { xs: 2, md: 4 },
        borderRadius: 2,
        mb: 4,
        backgroundColor: 'background.paper',
      }}
    >
      <Grid container spacing={4}>
        {/* Poster */}
        <Grid item xs={12} sm={4} md={3}>
          <Box
            sx={{
              width: '100%',
              borderRadius: 2,
              overflow: 'hidden',
              boxShadow: '0 5px 15px rgba(0,0,0,0.3)',
              position: 'relative',
              paddingTop: '150%', // 2:3 aspect ratio
            }}
          >
            <Box
              component="img"
              src={posterUrl}
              alt={movie.name}
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
            />
          </Box>

          {/* Thông tin ngắn gọn cho mobile */}
          {isMobile && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="h5" component="h1" sx={{ fontWeight: 'bold', mb: 1 }}>
                {movie.name}
              </Typography>
              {movie.origin_name && (
                <Typography variant="body1" sx={{ mb: 2, fontStyle: 'italic', opacity: 0.8 }}>
                  {movie.origin_name}
                </Typography>
              )}
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                {movie.year && (
                  <Chip
                    label={movie.year}
                    size="small"
                    color="primary"
                    sx={{ fontWeight: 'bold' }}
                  />
                )}
                {movie.quality && (
                  <Chip
                    label={movie.quality}
                    size="small"
                    color="secondary"
                    sx={{ fontWeight: 'bold' }}
                  />
                )}
                {movie.episode_current && (
                  <Chip
                    label={movie.episode_current}
                    size="small"
                    color="info"
                    sx={{ fontWeight: 'bold' }}
                  />
                )}
                {movie.lang && (
                  <Chip
                    label={movie.lang}
                    size="small"
                    color="default"
                    sx={{ fontWeight: 'bold' }}
                  />
                )}
              </Box>
            </Box>
          )}
        </Grid>

        {/* Thông tin chi tiết */}
        <Grid item xs={12} sm={8} md={9}>
          {/* Tiêu đề và thông tin cơ bản */}
          {!isMobile && (
            <>
              <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', mb: 1 }}>
                {movie.name}
              </Typography>
              {movie.origin_name && (
                <Typography variant="h6" sx={{ mb: 2, fontStyle: 'italic', opacity: 0.8 }}>
                  {movie.origin_name}
                </Typography>
              )}
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 3 }}>
                {movie.year && (
                  <Chip
                    label={movie.year}
                    size="small"
                    color="primary"
                    sx={{ fontWeight: 'bold' }}
                  />
                )}
                {movie.quality && (
                  <Chip
                    label={movie.quality}
                    size="small"
                    color="secondary"
                    sx={{ fontWeight: 'bold' }}
                  />
                )}
                {movie.episode_current && (
                  <Chip
                    label={movie.episode_current}
                    size="small"
                    color="info"
                    sx={{ fontWeight: 'bold' }}
                  />
                )}
                {movie.lang && (
                  <Chip
                    label={movie.lang}
                    size="small"
                    color="default"
                    sx={{ fontWeight: 'bold' }}
                  />
                )}
              </Box>
            </>
          )}

          {/* Rating */}
          {rating > 0 && (
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <Rating
                value={rating}
                precision={0.5}
                readOnly
                sx={{ mr: 1 }}
              />
              <Typography variant="body2">
                {rating.toFixed(1)}/5 ({movie.tmdb?.vote_count || 0} đánh giá)
              </Typography>
            </Box>
          )}

          {/* Thông tin chi tiết */}
          <List dense={isMobile}>
            {movie.time && (
              <ListItem disableGutters>
                <ListItemIcon sx={{ minWidth: 40 }}>
                  <AccessTime fontSize="small" />
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Typography variant="body1">
                      <strong>Thời lượng:</strong> {movie.time}
                    </Typography>
                  }
                />
              </ListItem>
            )}

            {movie.category && movie.category.length > 0 && (
              <ListItem disableGutters>
                <ListItemIcon sx={{ minWidth: 40 }}>
                  <Category fontSize="small" />
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Typography variant="body1">
                      <strong>Thể loại:</strong>{' '}
                      {movie.category.map((cat, index) => (
                        <React.Fragment key={cat.id || cat.slug || index}>
                          <Button
                            component={RouterLink}
                            to={`/the-loai/${convertToSlug(cat.name)}`}
                            color="primary"
                            sx={{ p: 0, minWidth: 'auto', textTransform: 'none', fontWeight: 'normal' }}
                          >
                            {cat.name}
                          </Button>
                          {index < movie.category.length - 1 ? ', ' : ''}
                        </React.Fragment>
                      ))}
                    </Typography>
                  }
                />
              </ListItem>
            )}

            {movie.country && movie.country.length > 0 && (
              <ListItem disableGutters>
                <ListItemIcon sx={{ minWidth: 40 }}>
                  <Public fontSize="small" />
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Typography variant="body1">
                      <strong>Quốc gia:</strong>{' '}
                      {movie.country.map((country, index) => (
                        <React.Fragment key={country.id || country.slug || index}>
                          <Button
                            component={RouterLink}
                            to={`/quoc-gia/${convertToSlug(country.name)}`}
                            color="primary"
                            sx={{ p: 0, minWidth: 'auto', textTransform: 'none', fontWeight: 'normal' }}
                          >
                            {country.name}
                          </Button>
                          {index < movie.country.length - 1 ? ', ' : ''}
                        </React.Fragment>
                      ))}
                    </Typography>
                  }
                />
              </ListItem>
            )}

            {movie.year && (
              <ListItem disableGutters>
                <ListItemIcon sx={{ minWidth: 40 }}>
                  <CalendarMonth fontSize="small" />
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Typography variant="body1">
                      <strong>Năm phát hành:</strong>{' '}
                      <Button
                        component={RouterLink}
                        to={`/nam/${movie.year}`}
                        color="primary"
                        sx={{ p: 0, minWidth: 'auto', textTransform: 'none', fontWeight: 'normal' }}
                      >
                        {movie.year}
                      </Button>
                    </Typography>
                  }
                />
              </ListItem>
            )}

            {movie.lang && (
              <ListItem disableGutters>
                <ListItemIcon sx={{ minWidth: 40 }}>
                  <Language fontSize="small" />
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Typography variant="body1">
                      <strong>Ngôn ngữ:</strong> {movie.lang}
                    </Typography>
                  }
                />
              </ListItem>
            )}

            {movie.director && movie.director.length > 0 && (
              <ListItem disableGutters>
                <ListItemIcon sx={{ minWidth: 40 }}>
                  <LocalMovies fontSize="small" />
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Typography variant="body1">
                      <strong>Đạo diễn:</strong> {movie.director.join(', ')}
                    </Typography>
                  }
                />
              </ListItem>
            )}

            {movie.actor && movie.actor.length > 0 && (
              <ListItem disableGutters>
                <ListItemIcon sx={{ minWidth: 40 }}>
                  <Star fontSize="small" />
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Typography variant="body1">
                      <strong>Diễn viên:</strong> {movie.actor.join(', ')}
                    </Typography>
                  }
                />
              </ListItem>
            )}
          </List>

          <Divider sx={{ my: 3 }} />

          {/* Nội dung phim */}
          <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
            Nội dung phim
          </Typography>
          {movie.content ? (
            <Typography variant="body1" sx={{ whiteSpace: 'pre-line' }}>
              {movie.content}
            </Typography>
          ) : (
            <Typography variant="body1" sx={{ fontStyle: 'italic', opacity: 0.7 }}>
              Chưa có nội dung cho phim này.
            </Typography>
          )}
        </Grid>
      </Grid>
    </Paper>
  );
};

export default MovieInfo;