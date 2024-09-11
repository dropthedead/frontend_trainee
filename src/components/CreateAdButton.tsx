import { useState } from 'react';
import { Button } from '@mui/material';
import CreateAdModal from '@/components/CreateAdModal';

const CreateAdButton = () => {
  const [isOpenModal, setIsOpenModal] = useState(false);

  const handleOpen = () => setIsOpenModal(true);
  const handleClose = () => setIsOpenModal(false);

  return (
    <>
      <Button
        onClick={handleOpen}
        variant="contained"
        color="primary"
      >
        Добавить объявление
      </Button>
      <CreateAdModal
        isOpen={isOpenModal}
        handleClose={handleClose}
      />
    </>
  );
};

export default CreateAdButton;
