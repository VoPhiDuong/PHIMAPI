import React, { useState, useEffect } from 'react';
import { Container, Typography, Box } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import axios from 'axios';

import HeroSlider from '../components/HeroSlider';
import MovieSlider from '../components/MovieSlider';
import LoadingIndicator from '../components/LoadingIndicator';
import ErrorDisplay from '../components/ErrorDisplay';

const Home = () => {
  const [featuredMovies, setFeaturedMovies] = useState([]);
  const [newMovies, setNewMovies] = useState([]);
  const [seriesMovies, setSeriesMovies] = useState([]);
  const [singleMovies, setSingleMovies] = useState([]);
  const [animationMovies, setAnimationMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Lấy phim mới cập nhật cho slider chính
        const featuredResponse = await axios.get('https://phimapi.com/danh-sach/phim-moi-cap-nhat-v3?page=1');
        
        // Lấy phim mới cập nhật
        const newMoviesResponse = await axios.get('https://phimapi.com/danh-sach/phim-moi-cap-nhat-v2?page=1');
        
        // Lấy phim bộ
        const seriesResponse = await axios.get(
          'https://phimapi.com/v1/api/danh-sach/phim-bo?page=1&sort_field=modified.time&sort_type=desc&limit=12'
        );
        
        // Lấy phim lẻ
        const singleResponse = await axios.get(
          'https://phimapi.com/v1/api/danh-sach/phim-le?page=1&sort_field=modified.time&sort_type=desc&limit=12'
        );
        
        // Lấy phim hoạt hình
        const animationResponse = await axios.get(
          'https://phimapi.com/v1/api/danh-sach/hoat-hinh?page=1&sort_field=modified.time&sort_type=desc&limit=12'
        );

        // Cập nhật state với dữ liệu từ API
        if (featuredResponse.data && featuredResponse.data.items) {
          setFeaturedMovies(featuredResponse.data.items.slice(0, 5));
        }

        if (newMoviesResponse.data && newMoviesResponse.data.items) {
          setNewMovies(newMoviesResponse.data.items);
        }

        if (seriesResponse.data && seriesResponse.data.data && seriesResponse.data.data.items) {
          setSeriesMovies(seriesResponse.data.data.items);
        }

        if (singleResponse.data && singleResponse.data.data && singleResponse.data.data.items) {
          setSingleMovies(singleResponse.data.data.items);
        }

        if (animationResponse.data && animationResponse.data.data && animationResponse.data.data.items) {
          setAnimationMovies(animationResponse.data.data.items);
        }

        setLoading(false);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Đã xảy ra lỗi khi tải dữ liệu. Vui lòng thử lại sau.');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <LoadingIndicator message="Đang tải dữ liệu phim..." />;
  }

  if (error) {
    return <ErrorDisplay message={error} onRetry={() => window.location.reload()} />;
  }

  return (
    <Box sx={{ pb: 8 }}>
      {/* Hero Slider */}
      <HeroSlider movies={featuredMovies} />

      {/* Featured Content Section */}
      <Box sx={{ 
        background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
        py: 6,
        mt: 4
      }}>
        <Container maxWidth="xl">
          <Typography 
            variant="h4" 
            sx={{ 
              mb: 4, 
              textAlign: 'center',
              background: 'linear-gradient(45deg, #ff6b6b, #4ecdc4)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontWeight: 'bold'
            }}
          >
            🎬 Phim Hay Cả Rổ
          </Typography>
          
          {/* Phim mới cập nhật */}
          <MovieSlider
            title="🔥 Phim Mới Cập Nhật"
            movies={newMovies}
            viewMoreLink="/danh-sach/phim-moi-cap-nhat"
          />

          {/* Quick Tags Section - Moved here */}
          <Box sx={{ 
            my: 6,
            p: 4,
            borderRadius: 3,
            background: 'linear-gradient(135deg, #2c3e50 0%, #34495e 100%)',
            textAlign: 'center'
          }}>
            <Typography 
              variant="h5" 
              sx={{ 
                mb: 1,
                color: 'white',
                fontWeight: 'bold'
              }}
            >
              Bạn đang quan tâm gì?
            </Typography>
            <Box sx={{ 
              display: 'grid',
              gridTemplateColumns: {
                xs: 'repeat(2, 1fr)',
                sm: 'repeat(3, 1fr)',
                md: 'repeat(6, 1fr)'
              },
              gap: 2,
              mt: 3
            }}>
              {[
                 { title: 'Khoa Học Viễn Tưởng', subtitle: 'Xem chủ đề >', link: '/the-loai/khoa-hoc-vien-tuong', color: '#e74c3c' },
                 { title: 'Phim Mới Cập Nhật', subtitle: 'Xem chủ đề >', link: '/danh-sach/phim-moi-cap-nhat', color: '#9b59b6' },
                 { title: 'Phim Hay', subtitle: 'Xem chủ đề >', link: '/tim-kiem?q=phim+hay', color: '#2ecc71' },
                 { title: 'Phim Lẻ', subtitle: 'Xem chủ đề >', link: '/danh-sach/phim-le', color: '#f39c12' },
                 { title: 'Kinh Dị', subtitle: 'Xem chủ đề >', link: '/the-loai/kinh-di', color: '#e67e22' },
                 { title: 'Cổ Trang', subtitle: 'Xem chủ đề >', link: '/the-loai/co-trang', color: '#c0392b' }
               ].map((item, index) => (
                <Box
                  key={index}
                  component={RouterLink}
                  to={item.link}
                  sx={{
                    background: item.color,
                    borderRadius: 2,
                    p: 2,
                    textDecoration: 'none',
                    color: 'white',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-3px)',
                      boxShadow: '0 8px 25px rgba(0,0,0,0.3)',
                      filter: 'brightness(1.1)'
                    }
                  }}
                >
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      fontWeight: 'bold',
                      fontSize: { xs: '0.9rem', sm: '1rem' },
                      mb: 0.5
                    }}
                  >
                    {item.title}
                  </Typography>
                  <Typography 
                    variant="caption" 
                    sx={{ 
                      fontSize: '0.75rem',
                      opacity: 0.9
                    }}
                  >
                    {item.subtitle}
                  </Typography>
                </Box>
              ))}
            </Box>
           </Box>
        </Container>
      </Box>

      <Container maxWidth="xl">
        {/* Trending Section */}
        <Box sx={{ my: 6 }}>
          <Typography 
            variant="h5" 
            sx={{ 
              mb: 3,
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              color: '#ff6b6b',
              fontWeight: 'bold'
            }}
          >
            📺 Phim Bộ Đang Hot
          </Typography>
          <MovieSlider
            title=""
            movies={seriesMovies}
            viewMoreLink="/danh-sach/phim-bo"
          />
        </Box>

        {/* Cinema Section */}
        <Box sx={{ 
          my: 6,
          p: 4,
          borderRadius: 3,
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <Box sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.3)',
            zIndex: 1
          }} />
          <Box sx={{ position: 'relative', zIndex: 2 }}>
            <Typography 
              variant="h5" 
              sx={{ 
                mb: 3,
                color: 'white',
                fontWeight: 'bold',
                textShadow: '2px 2px 4px rgba(0,0,0,0.5)'
              }}
            >
              🎭 Phim Lẻ Chất Lượng Cao
            </Typography>
            <MovieSlider
              title=""
              movies={singleMovies}
              viewMoreLink="/danh-sach/phim-le"
            />
          </Box>
        </Box>

        {/* Animation Section */}
        <Box sx={{ my: 6 }}>
          <Typography 
            variant="h5" 
            sx={{ 
              mb: 3,
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              color: '#4ecdc4',
              fontWeight: 'bold'
            }}
          >
            🎨 Phim Hoạt Hình Hay Nhất
          </Typography>
          <MovieSlider
            title=""
            movies={animationMovies}
            viewMoreLink="/danh-sach/hoat-hinh"
          />
        </Box>


      </Container>
    </Box>
  );
};

export default Home;