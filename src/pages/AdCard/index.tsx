import { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
} from '@mui/material';
import { useParams } from 'react-router-dom';
import { useGetAdvertisment, usePatchAdvertisment } from '@/api';
import { Favorite, Visibility } from '@mui/icons-material';
import AdForm from '@/components/AdForm';

import type { NewAdvertisment } from '@/api';

const Advertisment = () => {
  const { id } = useParams<{ id: string }>();
  const { data, isLoading, isError, refetch } = useGetAdvertisment(id || '');
  const { mutate: patchAdvertisment } = usePatchAdvertisment(id || '');
  const [isEditing, setIsEditing] = useState(false);

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const onSubmit = (formData: NewAdvertisment) => {
    patchAdvertisment(formData);
    refetch();
    setIsEditing(false);
  };

  if (isLoading) return <Typography>Loading...</Typography>;
  if (isError) return <Typography>Error loading advertisement.</Typography>;

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%',
        padding: 4,
      }}
    >
      <Card sx={{ width: '100%', maxWidth: '100%' }}>
        {isEditing ? (
          <AdForm
            defaultValues={{
              name: data?.name || '',
              description: data?.description || '',
              price: data?.price || 0,
              imageUrl: data?.imageUrl || '',
            }}
            onSubmit={onSubmit}
            onReset={() => setIsEditing(false)}
          />
        ) : (
          <>
            <CardContent
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingBottom: '16px',
              }}
            >
              <Typography variant="h5" component="div">
                {data?.name}
              </Typography>
              <Typography variant="h6" component="div">
                ₽{data?.price}
              </Typography>
            </CardContent>
            {data?.imageUrl ? (
              <CardMedia
                component="img"
                image={data?.imageUrl}
                alt={data?.name}
                sx={{
                  objectFit: 'contain',
                  width: '100%',
                  height: '100%',
                  maxHeight: '800px',
                  marginBottom: 2,
                }}
              />
            ) : (
              <Typography variant="h5" color="text.primary">
                Изображение отсутствует!
              </Typography>
            )}

            <CardContent>
              <Typography variant="h5" color="text.primary" gutterBottom>
                Описание:
              </Typography>
              <Typography variant="body1" color="text.secondary">
                {data?.description}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', marginTop: 2 }}>
                <Favorite color="error" sx={{ marginRight: 1 }} />
                <Typography variant="body2" sx={{ marginRight: 2 }}>
                  {data?.likes}
                </Typography>
                <Visibility color="action" sx={{ marginRight: 1 }} />
                <Typography variant="body2">{data?.views}</Typography>
              </Box>
            </CardContent>
            <CardContent sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button
                variant="contained"
                color="secondary"
                onClick={() => console.log('udalenie')}
                sx={{ marginRight: '8px' }}
              >
                Удалить Объявление
              </Button>
              <Button variant="contained" onClick={handleEditToggle}>
                {isEditing ? 'Сохранить' : 'Редактировать'}
              </Button>
            </CardContent>
          </>
        )}
      </Card>
    </Box>
  );
};

export default Advertisment;
