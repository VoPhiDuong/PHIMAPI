import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Container, Typography, Box } from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';

import MovieGrid from '../components/MovieGrid';
import FilterBar from '../components/FilterBar';
import Pagination from '../components/Pagination';
import LoadingIndicator from '../components/LoadingIndicator';
import ErrorDisplay from '../components/ErrorDisplay';

import { listApi } from '../services/api';
import { DEFAULT_MOVIE_LIMIT } from '../constants/constants';

const Search = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalPages, setTotalPages] = useState(1);
  
  // Lấy các tham số từ URL
  const keyword = searchParams.get('q') || searchParams.get('keyword') || '';
  const page = parseInt(searchParams.get('page')) || 1;
  const sortField = searchParams.get('sort_field') || 'modified.time';
  const sortType = searchParams.get('sort_type') || 'desc';
  const language = searchParams.get('language') || '';
  const category = searchParams.get('category') || '';
  const country = searchParams.get('country') || '';
  const year = searchParams.get('year') || '';
  const limit = parseInt(searchParams.get('limit')) || DEFAULT_MOVIE_LIMIT;

  // Lấy kết quả tìm kiếm từ API
  useEffect(() => {
    const fetchSearchResults = async () => {
      if (!keyword) {
        setMovies([]);
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        setError(null);
        
        const response = await listApi.searchMovies({
          keyword,
          page,
          sort_field: sortField,
          sort_type: sortType,
          language,
          category,
          country,
          year,
          limit
        });

        console.log('Search API response:', response.data);
        
        // Xử lý response từ API
        const responseData = response.data?.data || response.data || {};
        const items = responseData.items || responseData.data || [];
        const pagination = responseData.params || responseData.pagination || {};
        
        setMovies(items);
        setTotalPages(pagination.pagination?.totalPages || Math.ceil((pagination.pagination?.totalItems || 0) / limit) || 1);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching search results:', err);
        setError('Đã xảy ra lỗi khi tìm kiếm phim. Vui lòng thử lại sau.');
        setLoading(false);
      }
    };

    fetchSearchResults();
  }, [keyword, page, sortField, sortType, language, category, country, year, limit]);

  // Xử lý khi thay đổi trang
  const handlePageChange = (value) => {
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set('page', value.toString());
    setSearchParams(newSearchParams);
    
    // Cuộn lên đầu trang
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Xử lý khi thay đổi bộ lọc
  const handleFilterChange = (filters) => {
    const newSearchParams = new URLSearchParams();
    
    // Giữ từ khóa tìm kiếm
    newSearchParams.set('keyword', keyword);
    
    // Đặt lại trang về 1 khi thay đổi bộ lọc
    newSearchParams.set('page', '1');
    
    // Thêm các tham số lọc vào URL
    if (filters.sort_field) newSearchParams.set('sort_field', filters.sort_field);
    if (filters.sort_type) newSearchParams.set('sort_type', filters.sort_type);
    if (filters.sort_lang) newSearchParams.set('language', filters.sort_lang);
    if (filters.category) newSearchParams.set('category', filters.category);
    if (filters.country) newSearchParams.set('country', filters.country);
    if (filters.year) newSearchParams.set('year', filters.year);
    if (filters.limit) newSearchParams.set('limit', filters.limit.toString());
    
    setSearchParams(newSearchParams);
  };

  // Xử lý thử lại khi có lỗi
  const handleRetry = () => {
    window.location.reload();
  };

  return (
    <Container maxWidth="xl">
      <Box sx={{ pt: 2, pb: 4 }}>
        <Typography 
          variant="h4" 
          component="h1" 
          sx={{ 
            mb: 3, 
            fontWeight: 'bold',
            display: 'flex',
            alignItems: 'center',
            gap: 1
          }}
        >
          <SearchIcon fontSize="large" />
          {keyword ? `Kết quả tìm kiếm: "${keyword}"` : 'Tìm kiếm phim'}
        </Typography>

        <FilterBar 
          onFilterChange={handleFilterChange}
          initialFilters={{
            sort_field: sortField,
            sort_type: sortType,
            sort_lang: language,
            category: category,
            country: country,
            year: year
          }}
        />

        {loading ? (
          <LoadingIndicator message="Đang tải kết quả tìm kiếm..." />
        ) : error ? (
          <ErrorDisplay message={error} onRetry={handleRetry} />
        ) : movies.length > 0 ? (
          <>
            <MovieGrid 
              movies={movies} 
              totalPages={totalPages} 
              currentPage={page} 
              onPageChange={handlePageChange} 
            />
            
            {totalPages > 1 && (
              <Pagination 
                currentPage={page} 
                totalPages={totalPages} 
                onPageChange={handlePageChange} 
              />
            )}
          </>
        ) : (
          <Box sx={{ textAlign: 'center', py: 5 }}>
            <Typography variant="h6">
              Không tìm thấy phim nào phù hợp với từ khóa "{keyword}".
            </Typography>
          </Box>
        )}      
      </Box>
    </Container>
  );
};

export default Search;