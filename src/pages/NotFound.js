import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Typography, Box, Button } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import SearchIcon from '@mui/icons-material/Search';

const NotFound = () => {
  return (
    <Container maxWidth="md">
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '70vh',
          textAlign: 'center',
          py: 8
        }}
      >
        <Typography variant="h1" component="h1" sx={{ mb: 2, fontSize: { xs: '4rem', md: '6rem' } }}>
          404
        </Typography>
        
        <Typography variant="h4" component="h2" sx={{ mb: 4 }}>
          Không tìm thấy trang
        </Typography>
        
        <Typography variant="body1" sx={{ mb: 6, maxWidth: '600px' }}>
          Trang bạn đang tìm kiếm có thể đã bị xóa, đổi tên hoặc tạm thời không khả dụng.
          Vui lòng kiểm tra lại đường dẫn hoặc thử một trong các tùy chọn dưới đây.
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: 'center' }}>
          <Button
            variant="contained"
            color="primary"
            component={Link}
            to="/"
            startIcon={<HomeIcon />}
            size="large"
          >
            Trang chủ
          </Button>
          
          <Button
            variant="outlined"
            color="primary"
            component={Link}
            to="/tim-kiem"
            startIcon={<SearchIcon />}
            size="large"
          >
            Tìm kiếm phim
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default NotFound;