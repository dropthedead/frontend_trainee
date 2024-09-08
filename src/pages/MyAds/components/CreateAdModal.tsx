import {
  Box,
  Button,
  IconButton,
  Modal,
  TextField,
  Typography,
} from '@mui/material';
import { Close } from '@mui/icons-material'; // Импорт иконки Close
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useCreateAdvertisment } from '@/api';

import type { NewAdvertisment } from '@/api';
import { useNavigate } from 'react-router-dom';
const adSchema = yup.object().shape({
  name: yup
    .string()
    .required('Название обязательно')
    .max(20, 'Название не должно превышать 20 символов'),
  description: yup
    .string()
    .required('Описание обязательно')
    .max(300, 'Описание не должно превышать 300 символов'),
  price: yup
    .number()
    .typeError('Стоимость должна быть числом')
    .required('Стоимость обязательна')
    .test(
      'len',
      'Стоимость не должна превышать 7 символов',
      (val) => String(val).length <= 7,
    ),
  imageUrl: yup
    .string()
    .url('Неверный формат URL')
    .required('URL картинки обязателен'),
});

const CreateAdModal = ({
  isOpen,
  handleClose,
}: {
  isOpen: boolean;
  handleClose: () => void;
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<NewAdvertisment>({
    resolver: yupResolver(adSchema),
    mode: 'onChange',
  });

  const { mutate, isPending } = useCreateAdvertisment();
  const navigate = useNavigate();
  const onSubmit = (data: NewAdvertisment) => {
    mutate(data, {
      onSuccess: (newData) => {
        reset();
        handleClose();
        navigate(`/advertisment/${newData.id}}`);
      },
      onError: (error) => {
        console.error('Ошибка при создании объявления:', error.message);
      },
    });
  };

  const handleReset = () => {
    reset();
  };

  return (
    <Modal open={isOpen} onClose={handleClose}>
      <Box
        sx={{
          position: 'relative',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: { xs: '100%', sm: 450 },
          height: { xs: '100%', sm: 'auto' },
          bgcolor: 'background.paper',
          p: { xs: 2, sm: 4 },
          boxShadow: 24,
          borderRadius: '8px',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{
            position: 'absolute',
            right: 16,
            top: 16,
          }}
        >
          <Close />
        </IconButton>

        <Box sx={{ flex: 1, overflowY: 'auto', p: 1 }}>
          <Typography variant="h6" mb={2}>
            Создать новое объявление
          </Typography>
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
              label="URL картинки"
              {...register('imageUrl')}
              error={!!errors.imageUrl}
              helperText={errors.imageUrl?.message}
              margin="normal"
            />
          </form>
        </Box>

        <Box
          sx={{
            mt: 2,
            p: 2,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: 2,
            borderTop: '1px solid #ddd',
          }}
        >
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={isPending}
            onClick={handleSubmit(onSubmit)}
          >
            {isPending ? 'Создание...' : 'Создать'}
          </Button>
          <Button
            type="button"
            variant="outlined"
            color="secondary"
            onClick={handleReset}
          >
            Сбросить все поля
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default CreateAdModal;
