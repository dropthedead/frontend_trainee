import { useState, useEffect } from 'react';
import { Box, Modal, IconButton, Typography, Button, TextField, MenuItem, Select } from '@mui/material';
import { Close } from '@mui/icons-material';
import { useCreateOrder } from '@/api/orders';
import { useGetAllAdsForSearch } from '@/api/advertisments';
import { useForm, SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { OrderStatus, DeliveryWayLabel, FormValues } from '../../../../types';
import { orderValidationSchema } from '@/utils/orderValidationSchema';

const CreateOrderModal = ({ open, onClose }: { open: boolean; onClose: () => void }) => {
  const { data: adsData } = useGetAllAdsForSearch();
  const { mutate: createOrder, isPending } = useCreateOrder();

  const {
    handleSubmit,
    setValue,
    register,
    formState: { errors },
    watch,
  } = useForm<FormValues>({
    resolver: yupResolver(orderValidationSchema),
    defaultValues: {
      id: '',
      status: OrderStatus.Created,
      deliveryWay: 'mail',
      items: [],
      total: 0,
    },
    mode: 'onChange',
  });

  const [selectedAds, setSelectedAds] = useState<FormValues['items']>([]);
  const [isAddingAd, setIsAddingAd] = useState(false);

  useEffect(() => {
    setValue('items', selectedAds);
    const updatedTotal = selectedAds.reduce((sum, item) => sum + item.price * item.count, 0);
    setValue('total', updatedTotal);
  }, [selectedAds, setValue]);

  const onSubmit: SubmitHandler<FormValues> = (data) => {
    const orderData = {
      ...data,
      createdAt: new Date().toISOString(),
    };

    createOrder(orderData, {
      onSuccess: () => {
        onClose();
      },
    });
  };

  const handleAddAd = (adId: string) => {
    const ad = adsData?.find((ad) => ad.id === adId);
    if (ad) {
      const newItem = { ...ad, count: 1 };
      setSelectedAds((prev) => [...prev, newItem]);
      setIsAddingAd(false);
    }
  };

  const handleAdCountChange = (index: number, count: number) => {
    const updatedItems = [...watch('items')];
    if (updatedItems[index]) {
      updatedItems[index].count = count > 0 ? count : 1;
      setSelectedAds(updatedItems);
    }
  };

  const handleRemoveAd = (index: number) => {
    const updatedItems = [...watch('items')];
    updatedItems.splice(index, 1);
    setSelectedAds(updatedItems);
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
    >
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
          <Typography variant="h5">Создать новый заказ</Typography>
          <IconButton
            aria-label="close"
            onClick={onClose}
          >
            <Close />
          </IconButton>
        </Box>

        <Box
          component="form"
          onSubmit={handleSubmit(onSubmit)}
          sx={{ padding: '20px' }}
        >
          <TextField
            fullWidth
            label="ID заказа"
            {...register('id')}
            error={!!errors.id}
            helperText={errors.id?.message}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Статус заказа"
            select
            {...register('status')}
            error={!!errors.status}
            helperText={errors.status?.message}
            margin="normal"
            defaultValue={OrderStatus.Created}
          >
            {Object.entries(OrderStatus).map(([key, value]) => (
              <MenuItem
                key={key}
                value={value}
              >
                {key}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            fullWidth
            label="Способ доставки"
            select
            {...register('deliveryWay')}
            error={!!errors.deliveryWay}
            helperText={errors.deliveryWay?.message}
            margin="normal"
            defaultValue="mail"
          >
            {Object.entries(DeliveryWayLabel).map(([key, label]) => (
              <MenuItem
                key={key}
                value={key}
              >
                {label}
              </MenuItem>
            ))}
          </TextField>

          <Button
            onClick={() => setIsAddingAd(true)}
            variant="contained"
            color="primary"
          >
            Добавить объявление
          </Button>

          {isAddingAd && (
            <Box sx={{ mt: 2 }}>
              <Select
                fullWidth
                onChange={(e) => handleAddAd(e.target.value)}
                displayEmpty
                defaultValue=""
              >
                <MenuItem
                  value=""
                  disabled
                >
                  Выберите объявление
                </MenuItem>
                {adsData?.map((ad) => (
                  <MenuItem
                    key={ad.id}
                    value={ad.id}
                  >
                    {ad.name}
                  </MenuItem>
                ))}
              </Select>
            </Box>
          )}

          {watch('items').map((item, index) => (
            <Box
              key={index}
              sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 2 }}
            >
              <TextField
                fullWidth
                label={`Название объявления ${index + 1}`}
                value={item.name}
                disabled
              />
              <TextField
                fullWidth
                label={`Цена объявления ${index + 1}`}
                type="number"
                value={item.price}
                disabled
              />
              <TextField
                fullWidth
                label={`Количество ${index + 1}`}
                type="number"
                value={item.count}
                onChange={(e) => handleAdCountChange(index, Number(e.target.value))}
              />
              <Button
                variant="outlined"
                color="error"
                onClick={() => handleRemoveAd(index)}
              >
                Удалить
              </Button>
            </Box>
          ))}

          <TextField
            fullWidth
            label="Итоговая сумма"
            type="number"
            value={watch('total')}
            disabled
            sx={{ mt: 2 }}
          />

          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 2 }}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={isPending}
            >
              {isPending ? 'Создание...' : 'Создать заказ'}
            </Button>
            <Button
              type="button"
              variant="contained"
              color="secondary"
              onClick={onClose}
            >
              Отмена
            </Button>
          </Box>
        </Box>
      </Box>
    </Modal>
  );
};

export default CreateOrderModal;
