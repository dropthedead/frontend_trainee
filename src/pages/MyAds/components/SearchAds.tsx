import { useState } from 'react';
import {
  Box,
  TextField,
  List,
  ListItem,
  Backdrop,
  Typography,
  InputAdornment,
  IconButton,
} from '@mui/material';
import { Link } from 'react-router-dom';
import { useGetAllAdsForSearch } from '@/api';
import type { Advertisment } from '../../../../types';
import { useDebounce } from 'use-debounce';
import SearchIcon from '@mui/icons-material/Search';

const SearchAds = () => {
  const { data, isLoading, error } = useGetAllAdsForSearch();
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery] = useDebounce(searchQuery, 300);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading ads</div>;

  const filteredAds =
    debouncedQuery.length >= 3
      ? data?.filter((ad: Advertisment) =>
          ad.name.toLowerCase().includes(debouncedQuery.toLowerCase()),
        )
      : [];

  const showResults = debouncedQuery.length >= 3;

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        position: 'relative',
      }}
    >
      <Backdrop
        open={showResults}
        sx={{ zIndex: 1 }}
        onClick={() => setSearchQuery('')}
      />
      <Box
        sx={{
          width: '100%',
          zIndex: 2,
          position: 'relative',
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
          <TextField
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="Поиск объявления"
            variant="outlined"
            color="secondary"
            fullWidth
            sx={{
              maxWidth: 600,
              borderRadius: '20px',
              '& .MuiOutlinedInput-root': {
                borderRadius: '20px',
              },
            }}
            slotProps={{
              input: {
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton edge="end" sx={{ pointerEvents: 'none' }}>
                      <SearchIcon />
                    </IconButton>
                  </InputAdornment>
                ),
              },
            }}
            autoComplete="off"
          />
        </Box>

        {showResults && (
          <Box
            sx={{
              position: 'absolute',
              top: '60px',
              left: '50%', // Центрируем по горизонтали
              transform: 'translateX(-50%)', // Смещаем элемент на 50% его ширины влево
              zIndex: 3,
              bgcolor: 'white',
              borderRadius: '10px',
              boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
              overflowY: 'auto',
              maxHeight: '50vh',
              width: '100%',
              maxWidth: 600, // Максимальная ширина поля с результатами
            }}
          >
            <List sx={{ padding: 0 }}>
              {filteredAds?.map((ad: Advertisment) => (
                <ListItem
                  key={ad.id}
                  sx={{
                    borderBottom: '1px solid #e0e0e0',
                    '&:hover': {
                      backgroundColor: '#f5f5f5', // Простой ховер
                    },
                  }}
                >
                  <Link
                    to={`/advertisment/${ad.id}`}
                    style={{ width: '100%', textDecoration: 'none' }}
                  >
                    <Typography
                      variant="body1"
                      sx={{ padding: '8px 16px', color: 'black' }}
                    >
                      {ad.name}
                    </Typography>
                  </Link>
                </ListItem>
              ))}
            </List>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default SearchAds;
