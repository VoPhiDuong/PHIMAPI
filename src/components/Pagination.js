import React from 'react';
import { Pagination as MuiPagination, Box, useTheme, useMediaQuery, Typography, Stack, Button } from '@mui/material';
import { NavigateBefore, NavigateNext, FirstPage, LastPage } from '@mui/icons-material';

const Pagination = ({ currentPage, totalPages, onPageChange, onChange, sx, totalItems, itemsPerPage = 24 }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));

  // Xác định số lượng nút phân trang hiển thị dựa trên kích thước màn hình
  const siblingCount = isMobile ? 0 : isTablet ? 1 : 2;
  const boundaryCount = isMobile ? 1 : 2;

  if (totalPages <= 1) return null;

  // Sử dụng onChange nếu được cung cấp, nếu không thì sử dụng onPageChange
  const handleChange = (_, page) => {
    if (onChange) {
      onChange(_, page);
    } else if (onPageChange) {
      onPageChange(page);
    }
  };

  // Tính toán phạm vi hiển thị phim hiện tại
  const startItem = totalItems > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0;
  const endItem = totalItems > 0 ? Math.min(currentPage * itemsPerPage, totalItems) : 0;

  // Xử lý nút chuyển trang trước và sau
  const handlePrevPage = () => {
    if (currentPage > 1) {
      handleChange(null, currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      handleChange(null, currentPage + 1);
    }
  };

  const handleFirstPage = () => {
    handleChange(null, 1);
  };

  const handleLastPage = () => {
    handleChange(null, totalPages);
  };

  return (
    <Box
      sx={{
        my: 4,
        ...sx,
      }}
    >
      {/* Hiển thị thông tin về phạm vi phim và tổng số trang */}
      {totalItems > 0 && startItem > 0 && endItem > 0 && (
        <Typography 
          variant="body2" 
          align="center" 
          sx={{ mb: 2, color: 'text.secondary' }}
        >
          Hiển thị {startItem}-{endItem} trong tổng số {totalItems} phim
        </Typography>
      )}

      {/* Nút phân trang */}
      <Stack 
        direction="row" 
        spacing={1} 
        justifyContent="center"
        alignItems="center"
      >
        {/* Nút trang đầu và trang trước */}
        {!isMobile && (
          <Button 
            variant="outlined" 
            color="primary" 
            size="small"
            onClick={handleFirstPage}
            disabled={currentPage === 1}
            sx={{ minWidth: 40, p: 0.5 }}
          >
            <FirstPage fontSize="small" />
          </Button>
        )}
        
        <Button 
          variant="outlined" 
          color="primary" 
          size="small"
          onClick={handlePrevPage}
          disabled={currentPage === 1}
          sx={{ minWidth: 40, p: 0.5 }}
        >
          <NavigateBefore fontSize="small" />
        </Button>

        {/* Phân trang chính */}
        <MuiPagination
          count={totalPages}
          page={currentPage}
          onChange={handleChange}
          color="primary"
          size={isMobile ? 'small' : 'medium'}
          siblingCount={siblingCount}
          boundaryCount={boundaryCount}
          hidePrevButton
          hideNextButton
          sx={{
            '& .MuiPaginationItem-root': {
              color: 'text.primary',
              fontWeight: 'medium',
            },
            '& .MuiPaginationItem-page.Mui-selected': {
              backgroundColor: 'primary.main',
              color: 'white',
              fontWeight: 'bold',
              '&:hover': {
                backgroundColor: 'primary.dark',
              },
            },
          }}
        />

        {/* Nút trang sau và trang cuối */}
        <Button 
          variant="outlined" 
          color="primary" 
          size="small"
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
          sx={{ minWidth: 40, p: 0.5 }}
        >
          <NavigateNext fontSize="small" />
        </Button>
        
        {!isMobile && (
          <Button 
            variant="outlined" 
            color="primary" 
            size="small"
            onClick={handleLastPage}
            disabled={currentPage === totalPages}
            sx={{ minWidth: 40, p: 0.5 }}
          >
            <LastPage fontSize="small" />
          </Button>
        )}
      </Stack>

      {/* Hiển thị thông tin trang hiện tại */}
      {totalPages > 0 && currentPage > 0 && (
        <Typography 
          variant="body2" 
          align="center" 
          sx={{ mt: 1, color: 'text.secondary', fontWeight: 'medium' }}
        >
          Trang {currentPage} / {totalPages}
        </Typography>
      )}
    </Box>
  );
};

export default Pagination;