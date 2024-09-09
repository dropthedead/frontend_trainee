import { Box, TextField, Button, CardMedia, Typography } from '@mui/material';
import { useForm, SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { adSchema } from '@/utils/adValidationScheme';
import { useState, useEffect } from 'react';

import type { NewAdvertisment } from '@/api';

interface AdFormProps {
  defaultValues?: NewAdvertisment;
  onSubmit: SubmitHandler<NewAdvertisment>;
  isPending?: boolean;
  onReset?: () => void;
}

const AdForm: React.FC<AdFormProps> = ({
  defaultValues,
  onSubmit,
  isPending,
  onReset,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<NewAdvertisment>({
    resolver: yupResolver(adSchema),
    defaultValues,
    mode: 'onChange',
  });

  const watchImageUrl = watch('imageUrl');
  const [previewUrl, setPreviewUrl] = useState<string | undefined>(
    defaultValues?.imageUrl,
  );

  useEffect(() => {
    if (!errors.imageUrl && watchImageUrl) {
      setPreviewUrl(watchImageUrl);
    } else {
      setPreviewUrl(undefined);
    }
  }, [watchImageUrl, errors.imageUrl]);

  const handleReset = () => {
    reset(defaultValues);
    setPreviewUrl(defaultValues?.imageUrl);
    if (onReset) {
      onReset();
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <TextField
        fullWidth
        label="Название"
        {...register('name')}
        error={!!errors.name}
        helperText={errors.name?.message}
        margin="normal"
      />
      <TextField
        fullWidth
        label="Описание"
        multiline
        minRows={3}
        {...register('description')}
        error={!!errors.description}
        helperText={errors.description?.message}
        margin="normal"
      />
      <TextField
        fullWidth
        label="Стоимость"
        type="number"
        {...register('price')}
        error={!!errors.price}
        helperText={errors.price?.message}
        margin="normal"
      />
      <TextField
        fullWidth
        label="Ссылка на изображение"
        {...register('imageUrl')}
        error={!!errors.imageUrl}
        helperText={errors.imageUrl?.message}
        margin="normal"
        onFocus={(e) => e.target.select()}
      />

      {previewUrl ? (
        <Box sx={{ textAlign: 'center', mt: 2 }}>
          <Typography variant="subtitle1">Предпросмотр изображения:</Typography>
          <CardMedia
            component="img"
            image={previewUrl}
            alt="Предпросмотр"
            sx={{
              objectFit: 'contain',
              width: '100%',
              height: '100%',
              maxHeight: 400,
              mt: 2,
            }}
          />
        </Box>
      ) : (
        <Typography
          variant="subtitle2"
          color="textSecondary"
          align="center"
          mt={2}
        >
          Нет изображения для предпросмотра
        </Typography>
      )}

      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 2 }}>
        <Button
          type="submit"
          variant="contained"
          color="primary"
          disabled={isPending}
        >
          {isPending ? 'Сохранение...' : 'Сохранить'}
        </Button>
        <Button type="button" variant="outlined" onClick={handleReset}>
          Сбросить
        </Button>
      </Box>
    </form>
  );
};

export default AdForm;
