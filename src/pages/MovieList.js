import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams, useNavigate, useLocation } from 'react-router-dom';
import { Container, Typography, Box } from '@mui/material';
import axios from 'axios';

import MovieGrid from '../components/MovieGrid';
import FilterBar from '../components/FilterBar';
import Pagination from '../components/Pagination';
import LoadingIndicator from '../components/LoadingIndicator';
import ErrorDisplay from '../components/ErrorDisplay';

const MovieList = () => {
  const { type } = useParams();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  
  // Xác định type từ pathname nếu không có trong params
  const currentType = type || location.pathname.replace('/', '');
  
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [title, setTitle] = useState('');
  
  // Lấy các tham số từ URL
  const page = parseInt(searchParams.get('page')) || 1;
  const sortField = searchParams.get('sort_field') || 'modified.time';
  const sortType = searchParams.get('sort_type') || 'desc';
  const sortLang = searchParams.get('sort_lang') || '';
  const category = searchParams.get('category') || '';
  const country = searchParams.get('country') || '';
  const year = searchParams.get('year') || '';
  const limit = parseInt(searchParams.get('limit')) || 24;

  // Xác định tiêu đề và URL API dựa trên loại danh sách
  useEffect(() => {
    let pageTitle = '';
    
    switch (currentType) {
      case 'phim-moi-cap-nhat':
        pageTitle = 'Phim mới cập nhật';
        break;
      case 'phim-bo':
        pageTitle = 'Phim bộ';
        break;
      case 'phim-le':
        pageTitle = 'Phim lẻ';
        break;
      case 'phim-hay':
        pageTitle = 'Phim hay';
        break;
      case 'hoat-hinh':
        pageTitle = 'Phim hoạt hình';
        break;
      case 'tv-shows':
        pageTitle = 'TV Shows';
        break;
      case 'phim-vietsub':
        pageTitle = 'Phim Vietsub';
        break;
      case 'phim-thuyet-minh':
        pageTitle = 'Phim thuyết minh';
        break;
      case 'phim-long-tieng':
        pageTitle = 'Phim lồng tiếng';
        break;
      default:
        pageTitle = 'Danh sách phim';
    }
    
    setTitle(pageTitle);
  }, [currentType]);

  // Lấy danh sách phim từ API
  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Chuẩn bị tham số cho API
        const params = {
          page,
          sort_field: sortField,
          sort_type: sortType,
          limit
        };
        
        if (sortLang) params.sort_lang = sortLang;
        if (category) params.category = category;
        if (country) params.country = country;
        if (year) params.year = year;
        
        let response;
        
        // Sử dụng API đã được cải tiến
        if (currentType === 'phim-moi-cap-nhat') {
          response = await axios.get(`https://phimapi.com/danh-sach/phim-moi-cap-nhat-v2`, { params });
        } else if (currentType === 'phim-hay') {
          // Sử dụng endpoint phim-moi-cap-nhat-v2 cho phim hay với sắp xếp theo rating
          response = await axios.get(`https://phimapi.com/danh-sach/phim-moi-cap-nhat-v2`, { params });
        } else {
          // Sử dụng API cho các loại phim khác
          response = await axios.get(`https://phimapi.com/v1/api/danh-sach/${currentType}`, { params });
        }

        if (response.data) {
          // Xử lý cho endpoint phim-moi-cap-nhat-v2 (trả về trực tiếp)
          if (currentType === 'phim-moi-cap-nhat' || currentType === 'phim-hay') {
            let movieList = response.data.items || [];
            let apiTotalItems = response.data.pagination?.totalItems || 0;
            let apiTotalPages = response.data.pagination?.totalPages || 1;
            
            console.log('API Response for', currentType, '- Total Pages:', apiTotalPages, 'Total Items:', apiTotalItems, 'Current Page:', page, 'Limit:', limit);
            
            // Lọc phim hay dựa trên rating cao
            if (currentType === 'phim-hay') {
              movieList = movieList.filter(movie => {
                const rating = movie.tmdb?.vote_average || movie.imdb?.rating || 0;
                return rating >= 7.0;
              }).sort((a, b) => {
                const ratingA = a.tmdb?.vote_average || a.imdb?.rating || 0;
                const ratingB = b.tmdb?.vote_average || b.imdb?.rating || 0;
                return ratingB - ratingA;
              });
              
              // Cập nhật tổng số trang và tổng số phim dựa trên số lượng phim sau khi lọc
              // Ước tính tổng số phim hay (khoảng 30% tổng số phim có rating cao)
              const filteredTotalItems = Math.min(apiTotalItems, movieList.length * 5);
              const calculatedTotalPages = Math.max(1, Math.ceil(filteredTotalItems / limit));
              
              console.log('Filtered for phim-hay - Calculated Total Pages:', calculatedTotalPages, 'Filtered Total Items:', filteredTotalItems);
              setTotalPages(calculatedTotalPages);
              setTotalItems(filteredTotalItems > 0 ? filteredTotalItems : 0);
            } else {
              // Đảm bảo sử dụng đúng giá trị từ API
              const finalTotalPages = Math.max(1, apiTotalPages);
              const finalTotalItems = Math.max(0, apiTotalItems);
              
              console.log('Setting pagination - Final Total Pages:', finalTotalPages, 'Final Total Items:', finalTotalItems);
              setTotalPages(finalTotalPages);
              setTotalItems(finalTotalItems);
            }
            
            setMovies(movieList);
          } else {
            // Xử lý cho các endpoint v1/api (trả về trong data.data)
            if (response.data.data) {
              const items = response.data.data.items || [];
              const apiTotalPages = response.data.data.pagination?.totalPages || 1;
              const apiTotalItems = response.data.data.pagination?.totalItems || items.length * apiTotalPages;
              
              console.log('API Response - Total Pages:', apiTotalPages, 'Total Items:', apiTotalItems);
              
              setMovies(items);
              setTotalPages(Math.max(1, apiTotalPages));
              setTotalItems(apiTotalItems > 0 ? apiTotalItems : 0);
            }
          }
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching movies:', err);
        setError('Đã xảy ra lỗi khi tải danh sách phim. Vui lòng thử lại sau.');
        setLoading(false);
      }
    };

    fetchMovies();
  }, [currentType, page, sortField, sortType, sortLang, category, country, year, limit]);

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
        {title}
      </Typography>
      
      {/* Thanh lọc */}
      <FilterBar
        initialFilters={{
          sortField,
          sortType,
          sortLang,
          category,
          country,
          year,
          limit
        }}
        onFilterChange={handleFilterChange}
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
          Không tìm thấy phim nào phù hợp với bộ lọc.
        </Typography>
      )}
      
      {/* Phân trang */}
      {totalPages > 1 && movies.length > 0 && (
        <Box sx={{ mt: 4 }}>
          <Pagination
            totalPages={totalPages}
            currentPage={page}
            onChange={handlePageChange}
            totalItems={totalItems}
            itemsPerPage={limit}
          />
        </Box>
      )}
    </Container>
  );
};

export default MovieList;