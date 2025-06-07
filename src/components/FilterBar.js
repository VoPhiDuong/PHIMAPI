import React, { useState, useEffect } from 'react';
import {
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Grid,
  Paper,
  Typography,
  useTheme,
  useMediaQuery,
  IconButton,
  Collapse,
} from '@mui/material';
import { FilterList, ExpandMore, ExpandLess } from '@mui/icons-material';
import axios from 'axios';

const FilterBar = ({ onFilterChange, initialFilters = {}, hideCategory, hideCountry, hideYear }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [expanded, setExpanded] = useState(!isMobile);

  // Chuẩn hóa initialFilters để chấp nhận cả camelCase và snake_case
  const normalizedInitialFilters = {
    sort_field: initialFilters.sort_field || initialFilters.sortField || 'modified.time',
    sort_type: initialFilters.sort_type || initialFilters.sortType || 'desc',
    sort_lang: initialFilters.sort_lang || initialFilters.sortLang || '',
    category: initialFilters.category || '',
    country: initialFilters.country || '',
    year: initialFilters.year || '',
    limit: parseInt(initialFilters.limit || initialFilters.limit) || 24,
  };

  const [filters, setFilters] = useState(normalizedInitialFilters);

  const [categories, setCategories] = useState([]);
  const [countries, setCountries] = useState([]);
  const [years, setYears] = useState([]);

  // Tạo danh sách năm từ 1970 đến năm hiện tại
  useEffect(() => {
    const currentYear = new Date().getFullYear();
    const yearList = [];
    for (let year = currentYear; year >= 1970; year--) {
      yearList.push(year);
    }
    setYears(yearList);
  }, []);

  // Lấy danh sách thể loại
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('https://phimapi.com/the-loai');
        if (response.data && Array.isArray(response.data)) {
          setCategories(response.data);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, []);

  // Lấy danh sách quốc gia
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await axios.get('https://phimapi.com/quoc-gia');
        if (response.data && Array.isArray(response.data)) {
          setCountries(response.data);
        }
      } catch (error) {
        console.error('Error fetching countries:', error);
      }
    };

    fetchCountries();
  }, []);

  const handleFilterChange = (event) => {
    const { name, value } = event.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = () => {
    // Chuyển đổi filters từ snake_case sang camelCase để phù hợp với cách sử dụng trong các trang
    const camelCaseFilters = {
      sortField: filters.sort_field,
      sortType: filters.sort_type,
      sortLang: filters.sort_lang,
      category: filters.category,
      country: filters.country,
      year: filters.year,
      limit: filters.limit,
    };
    
    onFilterChange(camelCaseFilters);
  };

  const handleReset = () => {
    const resetFilters = {
      sort_field: 'modified.time',
      sort_type: 'desc',
      sort_lang: '',
      category: '',
      country: '',
      year: '',
      limit: 24,
    };
    setFilters(resetFilters);
    
    // Chuyển đổi resetFilters từ snake_case sang camelCase
    const camelCaseResetFilters = {
      sortField: resetFilters.sort_field,
      sortType: resetFilters.sort_type,
      sortLang: resetFilters.sort_lang,
      category: resetFilters.category,
      country: resetFilters.country,
      year: resetFilters.year,
      limit: resetFilters.limit,
    };
    
    onFilterChange(camelCaseResetFilters);
  };

  const toggleExpanded = () => {
    setExpanded(!expanded);
  };

  return (
    <Paper
      elevation={3}
      sx={{
        p: 2,
        mb: 4,
        borderRadius: 2,
        backgroundColor: 'background.paper',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h6" component="h2" sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center' }}>
          <FilterList sx={{ mr: 1 }} /> Bộ lọc phim
        </Typography>
        {isMobile && (
          <IconButton onClick={toggleExpanded} size="small">
            {expanded ? <ExpandLess /> : <ExpandMore />}
          </IconButton>
        )}
      </Box>

      <Collapse in={expanded}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={4} lg={2}>
            <FormControl fullWidth size="small">
              <InputLabel>Sắp xếp theo</InputLabel>
              <Select
                name="sort_field"
                value={filters.sort_field}
                label="Sắp xếp theo"
                onChange={handleFilterChange}
              >
                <MenuItem value="modified.time">Thời gian cập nhật</MenuItem>
                <MenuItem value="_id">ID phim</MenuItem>
                <MenuItem value="year">Năm phát hành</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6} md={4} lg={2}>
            <FormControl fullWidth size="small">
              <InputLabel>Thứ tự</InputLabel>
              <Select
                name="sort_type"
                value={filters.sort_type}
                label="Thứ tự"
                onChange={handleFilterChange}
              >
                <MenuItem value="desc">Giảm dần</MenuItem>
                <MenuItem value="asc">Tăng dần</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6} md={4} lg={2}>
            <FormControl fullWidth size="small">
              <InputLabel>Ngôn ngữ</InputLabel>
              <Select
                name="sort_lang"
                value={filters.sort_lang}
                label="Ngôn ngữ"
                onChange={handleFilterChange}
              >
                <MenuItem value="">Tất cả</MenuItem>
                <MenuItem value="vietsub">Vietsub</MenuItem>
                <MenuItem value="thuyet-minh">Thuyết minh</MenuItem>
                <MenuItem value="long-tieng">Lồng tiếng</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} sm={6} md={4} lg={2}>
            <FormControl fullWidth size="small">
              <InputLabel>Số phim/trang</InputLabel>
              <Select
                name="limit"
                value={filters.limit}
                label="Số phim/trang"
                onChange={handleFilterChange}
              >
                <MenuItem value={12}>12 phim</MenuItem>
                <MenuItem value={24}>24 phim</MenuItem>
                <MenuItem value={36}>36 phim</MenuItem>
                <MenuItem value={48}>48 phim</MenuItem>
                <MenuItem value={60}>60 phim</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          {!hideCategory && (
            <Grid item xs={12} sm={6} md={4} lg={2}>
              <FormControl fullWidth size="small">
                <InputLabel>Thể loại</InputLabel>
                <Select
                  name="category"
                  value={filters.category}
                  label="Thể loại"
                  onChange={handleFilterChange}
                >
                  <MenuItem value="">Tất cả</MenuItem>
                  {categories.map((category) => (
                    <MenuItem key={category.slug} value={category.slug}>
                      {category.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          )}

          {!hideCountry && (
            <Grid item xs={12} sm={6} md={4} lg={2}>
              <FormControl fullWidth size="small">
                <InputLabel>Quốc gia</InputLabel>
                <Select
                  name="country"
                  value={filters.country}
                  label="Quốc gia"
                  onChange={handleFilterChange}
                >
                  <MenuItem value="">Tất cả</MenuItem>
                  {countries.map((country) => (
                    <MenuItem key={country.slug} value={country.slug}>
                      {country.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          )}

          {!hideYear && (
            <Grid item xs={12} sm={6} md={4} lg={2}>
              <FormControl fullWidth size="small">
                <InputLabel>Năm</InputLabel>
                <Select
                  name="year"
                  value={filters.year}
                  label="Năm"
                  onChange={handleFilterChange}
                >
                  <MenuItem value="">Tất cả</MenuItem>
                  {years.map((year) => (
                    <MenuItem key={year} value={year}>
                      {year}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          )}
        </Grid>

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2, gap: 1 }}>
          <Button
            variant="outlined"
            color="inherit"
            onClick={handleReset}
            size="small"
          >
            Đặt lại
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmit}
            size="small"
          >
            Áp dụng
          </Button>
        </Box>
      </Collapse>
    </Paper>
  );
};

export default FilterBar;