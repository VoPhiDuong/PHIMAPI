import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { Container, Typography, Box } from '@mui/material';
import axios from 'axios';

import MovieGrid from '../components/MovieGrid';
import FilterBar from '../components/FilterBar';
import Pagination from '../components/Pagination';
import LoadingIndicator from '../components/LoadingIndicator';
import ErrorDisplay from '../components/ErrorDisplay';

const Year = () => {
  const { year } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalPages, setTotalPages] = useState(1);
  
  // Lấy các tham số từ URL
  const page = parseInt(searchParams.get('page')) || 1;
  const sortField = searchParams.get('sort_field') || 'modified.time';
  const sortType = searchParams.get('sort_type') || 'desc';
  const sortLang = searchParams.get('sort_lang') || '';
  const category = searchParams.get('category') || '';
  const country = searchParams.get('country') || '';
  const limit = parseInt(searchParams.get('limit')) || 24;

  // Lấy danh sách phim theo năm
  useEffect(() => {
    const fetchYearMovies = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Xây dựng URL với các tham số lọc
        let url = `https://phimapi.com/v1/api/nam/${year}?page=${page}&sort_field=${sortField}&sort_type=${sortType}`;
        
        if (sortLang) url += `&sort_lang=${sortLang}`;
        if (category) url += `&category=${category}`;
        if (country) url += `&country=${country}`;
        if (limit) url += `&limit=${limit}`;
        
        const response = await axios.get(url);

        if (response.data && response.data.data) {
          setMovies(response.data.data.items || []);
          setTotalPages(response.data.data.pagination?.totalPages || 1);
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching year movies:', err);
        setError('Đã xảy ra lỗi khi tải danh sách phim. Vui lòng thử lại sau.');
        setLoading(false);
      }
    };

    fetchYearMovies();
  }, [year, page, sortField, sortType, sortLang, category, country, limit]);

  // Xử lý khi thay đổi trang
  const handlePageChange = (event, value) => {
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set('page', value);
    setSearchParams(newSearchParams);
    
    // Cuộn lên đầu trang
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Xử lý khi thay đổi bộ lọc
  const handleFilterChange = (filters) => {
    const newSearchParams = new URLSearchParams();
    
    // Đặt lại trang về 1 khi thay đổi bộ lọc
    newSearchParams.set('page', '1');
    
    // Thêm các tham số lọc vào URL
    if (filters.sortField) newSearchParams.set('sort_field', filters.sortField);
    if (filters.sortType) newSearchParams.set('sort_type', filters.sortType);
    if (filters.sortLang) newSearchParams.set('sort_lang', filters.sortLang);
    if (filters.category) newSearchParams.set('category', filters.category);
    if (filters.country) newSearchParams.set('country', filters.country);
    if (filters.limit) newSearchParams.set('limit', filters.limit);
    
    setSearchParams(newSearchParams);
  };

  if (loading && page === 1) {
    return <LoadingIndicator message="Đang tải danh sách phim..." />;
  }

  if (error) {
    return <ErrorDisplay message={error} onRetry={() => window.location.reload()} />;
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Phim năm {year}
      </Typography>
      
      {/* Thanh lọc */}
      <FilterBar
        initialFilters={{
          sortField,
          sortType,
          sortLang,
          category,
          country,
          limit
        }}
        onFilterChange={handleFilterChange}
        hideYear={true} // Ẩn bộ lọc năm vì đã chọn năm rồi
      />
      
      {/* Danh sách phim */}
      {loading ? (
        <Box sx={{ my: 4, display: 'flex', justifyContent: 'center' }}>
          <LoadingIndicator message="Đang tải..." />
        </Box>
      ) : movies.length > 0 ? (
        <MovieGrid movies={movies} />
      ) : (
        <Typography variant="body1" sx={{ my: 4, textAlign: 'center' }}>
          Không tìm thấy phim nào thuộc năm {year}.
        </Typography>
      )}
      
      {/* Phân trang */}
      {totalPages > 1 && (
        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
          <Pagination
            count={totalPages}
            page={page}
            onChange={handlePageChange}
          />
        </Box>
      )}
    </Container>
  );
};

export default Year;