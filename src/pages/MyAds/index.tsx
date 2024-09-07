import {
  Box,
  CircularProgress,
  Typography,
  Card,
  CardContent,
  CardMedia,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { useGetAdvertisment } from '@/api';
import { Advertisment } from '../../../types';
import { useState } from 'react';
import { Loader } from '@/components/common/loader';
import { Error } from '@/components/common/error';

const MyAds = () => {
  const [limit, setLimit] = useState(10);

  const {
    data,
    error,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isFetching,
    refetch,
  } = useGetAdvertisment(limit);

  if (isLoading || isFetching) {
    return <Loader />;
  }

  if (error) {
    return <Error error={error as Error} />;
  }

  const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    const newLimit = parseInt(event.target.value as string, 10);
    setLimit(newLimit);
    refetch();
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Мои Объявления
      </Typography>
      <FormControl fullWidth>
        <InputLabel id="demo-simple-select-label">Age</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={limit}
          label="Кол-во объявлений на странице"
          onChange={handleChange}
        >
          <MenuItem value={5}>5</MenuItem>
          <MenuItem value={10}>10</MenuItem>
          <MenuItem value={50}>50</MenuItem>
        </Select>
      </FormControl>
      {data?.pages.map((page) =>
        page.map((ad: Advertisment) => (
          <Card key={ad.id} sx={{ maxWidth: 345, marginBottom: 2 }}>
            {ad.imageUrl && (
              <CardMedia
                component="img"
                height="140"
                image={ad.imageUrl}
                alt={ad.name}
              />
            )}
            <CardContent>
              <Typography gutterBottom variant="h5" component="div">
                {ad.name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {ad.description}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Price: {ad.price}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Views: {ad.views}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Likes: {ad.likes}
              </Typography>
            </CardContent>
          </Card>
        )),
      )}
      <Box textAlign="center" mt={2}>
        {isFetchingNextPage ? (
          <CircularProgress />
        ) : (
          hasNextPage && (
            <Button onClick={() => fetchNextPage()}>Загрузить больше</Button>
          )
        )}
      </Box>
    </Box>
  );
};

export default MyAds;
