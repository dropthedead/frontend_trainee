import { Box, Modal, IconButton, Typography } from '@mui/material';
import { Close } from '@mui/icons-material';
import { useCreateAdvertisment } from '@/api';
import { useNavigate } from 'react-router-dom';
import AdForm from '@/components/AdForm';

import type { NewAdvertisment } from '@/api';

const CreateAdModal = ({
  isOpen,
  handleClose,
}: {
  isOpen: boolean;
  handleClose: () => void;
}) => {
  const { mutate, isPending } = useCreateAdvertisment();
  const navigate = useNavigate();

  const onSubmit = (data: NewAdvertisment) => {
    mutate(data, {
      onSuccess: (newData) => {
        handleClose();
        navigate(`/advertisment/${newData.id}`);
      },
      onError: (error) => {
        console.error('Ошибка при создании объявления:', error.message);
      },
    });
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

        <Typography variant="h6" mb={2}>
          Создать новое объявление
        </Typography>

        <AdForm onSubmit={onSubmit} isPending={isPending} />
      </Box>
    </Modal>
  );
};

export default CreateAdModal;
