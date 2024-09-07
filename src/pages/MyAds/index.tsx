import {
  Box,
  CircularProgress,
  Typography,
  Card,
  CardContent,
  CardMedia,
} from '@mui/material';
import { useGetAdvertisment } from '@/api';
import { Advertisment } from '../../../types';
import { useState } from 'react';

const MyAds = () => {
  const [limit, setLimit] = useState(10);
  const { data, error, isLoading } = useGetAdvertisment(limit);
  console.log(data);

  if (isLoading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        <Typography variant="h6" color="error">
          Error: {error.message}
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Your Advertisements
      </Typography>
      {data?.pages[0].map((ad: Advertisment) => (
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
      ))}
    </Box>
  );
};

export default MyAds;
