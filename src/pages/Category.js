import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { Container, Typography, Box } from '@mui/material';
import axios from 'axios';

import MovieGrid from '../components/MovieGrid';
import FilterBar from '../components/FilterBar';
import Pagination from '../components/Pagination';
import LoadingIndicator from '../components/LoadingIndicator';
import ErrorDisplay from '../components/ErrorDisplay';

const Category = () => {
  const { slug } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  
  // Decode slug để xử lý ký tự đặc biệt
  const decodedSlug = decodeURIComponent(slug);
  
  const [movies, setMovies] = useState([]);
  const [categoryInfo, setCategoryInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalPages, setTotalPages] = useState(1);
  
  // Lấy các tham số từ URL
  const page = parseInt(searchParams.get('page')) || 1;
  const sortField = searchParams.get('sort_field') || 'modified.time';
  const sortType = searchParams.get('sort_type') || 'desc';
  const sortLang = searchParams.get('sort_lang') || '';
  const country = searchParams.get('country') || '';
  const year = searchParams.get('year') || '';
  const limit = parseInt(searchParams.get('limit')) || 24;

  // Lấy thông tin thể loại và danh sách phim
  useEffect(() => {
    const fetchCategoryMovies = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Lấy thông tin thể loại
        const categoriesResponse = await axios.get('https://phimapi.com/the-loai');
        if (categoriesResponse.data) {
          const foundCategory = categoriesResponse.data.find(cat => cat.slug === decodedSlug);
          if (foundCategory) {
            setCategoryInfo(foundCategory);
          }
        }
        
        // Xây dựng URL với các tham số lọc
        let url = `https://phimapi.com/v1/api/the-loai/${decodedSlug}?page=${page}&sort_field=${sortField}&sort_type=${sortType}`;
        
        if (sortLang) url += `&sort_lang=${sortLang}`;
        if (country) url += `&country=${country}`;
        if (year) url += `&year=${year}`;
        if (limit) url += `&limit=${limit}`;
        
        const response = await axios.get(url);

        if (response.data && response.data.data) {
          setMovies(response.data.data.items || []);
          setTotalPages(response.data.data.pagination?.totalPages || 1);
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching category movies:', err);
        setError('Đã xảy ra lỗi khi tải danh sách phim. Vui lòng thử lại sau.');
        setLoading(false);
      }
    };

    fetchCategoryMovies();
  }, [decodedSlug, page, sortField, sortType, sortLang, country, year, limit]);

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
    if (filters.country) newSearchParams.set('country', filters.country);
    if (filters.year) newSearchParams.set('year', filters.year);
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
        {categoryInfo ? `Thể loại: ${categoryInfo.name}` : `Thể loại: ${slug}`}
      </Typography>
      
      {/* Thanh lọc */}
      <FilterBar
        initialFilters={{
          sortField,
          sortType,
          sortLang,
          country,
          year,
          limit
        }}
        onFilterChange={handleFilterChange}
        hideCategory={true} // Ẩn bộ lọc thể loại vì đã chọn thể loại rồi
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
          Không tìm thấy phim nào thuộc thể loại này.
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

export default Category;