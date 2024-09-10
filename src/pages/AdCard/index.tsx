import { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import {
  useDeleteAdvertisment,
  useGetAdvertisment,
  usePatchAdvertisment,
} from '@/api';
import { Favorite, Visibility } from '@mui/icons-material';
import AdForm from '@/components/AdForm';

import type { NewAdvertisment } from '@/api';
import { formatPrice } from '@/utils/formatPrice';
import { Loader } from '@/components/common/loader';

const Advertisment = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data, isLoading, refetch } = useGetAdvertisment(id || '');

  const [isEditing, setIsEditing] = useState(false);

  const { mutate: patchAdvertisment, isPending } = usePatchAdvertisment(
    id || '',
  );
  const { mutate: deleteAdvertisment } = useDeleteAdvertisment(id || '');

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handleDeleteAd = (id: string) => {
    deleteAdvertisment(id, {
      onSuccess: () => {
        navigate('/');
      },
    });
  };
  const onSubmit = (formData: NewAdvertisment) => {
    patchAdvertisment(formData, {
      onSuccess: () => {
        setIsEditing(false);
        refetch();
      },
    });
  };

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100%',
            width: '100%',
            padding: 4,
          }}
        >
          <Card sx={{ width: '100%', maxWidth: '100%' }}>
            {isEditing ? (
              <AdForm
                isPending={isPending}
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
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      position: 'relative',
                      width: '100%',
                      paddingX: 2,
                      boxSizing: 'border-box',
                    }}
                  >
                    <Typography
                      variant="h4"
                      component="div"
                      sx={{
                        position: 'absolute',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        textAlign: 'center',
                        width: '100%',
                      }}
                    >
                      {data?.name}
                    </Typography>
                    <Box
                      sx={{
                        marginLeft: 'auto',
                      }}
                    >
                      <Typography variant="h4" component="div">
                        {formatPrice(data?.price ?? 0)}
                      </Typography>
                    </Box>
                  </Box>
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
                  <Typography
                    variant="h5"
                    color="text.primary"
                    textAlign="center"
                    sx={{ p: 2 }}
                  >
                    Изображение отсутствует!
                  </Typography>
                )}

                <CardContent>
                  <Typography variant="h4" color="text.primary" gutterBottom>
                    Описание:
                  </Typography>
                  <Typography
                    variant="h6"
                    color="text.secondary"
                    sx={{
                      wordWrap: 'break-word',
                      overflowWrap: 'break-word',
                      width: '100%',
                      whiteSpace: 'normal',
                    }}
                  >
                    {data?.description}
                  </Typography>
                  <Box
                    sx={{ display: 'flex', alignItems: 'center', marginTop: 2 }}
                  >
                    <Favorite color="error" sx={{ marginRight: 1 }} />
                    <Typography variant="h5" sx={{ marginRight: 2 }}>
                      {data?.likes}
                    </Typography>
                    <Visibility color="action" sx={{ marginRight: 1 }} />
                    <Typography variant="h5">{data?.views}</Typography>
                  </Box>
                </CardContent>
                <CardContent
                  sx={{ display: 'flex', justifyContent: 'flex-end' }}
                >
                  <Button
                    variant="contained"
                    color="warning"
                    onClick={() => handleDeleteAd(id || '')}
                    sx={{ marginRight: '8px' }}
                  >
                    Удалить Объявление
                  </Button>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleEditToggle}
                  >
                    {isEditing ? 'Сохранить' : 'Редактировать'}
                  </Button>
                </CardContent>
              </>
            )}
          </Card>
        </Box>
      )}
    </>
  );
};

export default Advertisment;
