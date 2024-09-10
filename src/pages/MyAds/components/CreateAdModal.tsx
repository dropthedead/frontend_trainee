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
          p: { xs: 2, sm: 4, lg: 0 },
          boxShadow: 24,
          borderRadius: '8px',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            px: 2,
            pt: 2,
          }}
        >
          <Typography variant="h5">Создать новое объявление</Typography>
          <IconButton
            aria-label="close"
            onClick={handleClose}
            sx={{
              position: 'relative',
            }}
          >
            <Close />
          </IconButton>
        </Box>
        <AdForm onSubmit={onSubmit} isPending={isPending} />
      </Box>
    </Modal>
  );
};

export default CreateAdModal;
