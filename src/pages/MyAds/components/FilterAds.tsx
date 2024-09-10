import { Box, TextField, Button } from '@mui/material';
import { useForm } from 'react-hook-form';

interface FilterFormInputs {
  views?: number;
  likes?: number;
  price?: number;
}

interface FilterProps {
  onFilter: (data: FilterFormInputs) => void;
  onReset: () => void;
  initialValues: FilterFormInputs;
}

const FilterAds: React.FC<FilterProps> = ({ onFilter, onReset, initialValues }) => {
  const { register, handleSubmit, reset, setValue } = useForm<FilterFormInputs>({
    defaultValues: initialValues,
  });

  const handleResetFilters = () => {
    reset();
    onReset();
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    const numberValue = Number(value);
    if (numberValue < 0) {
      setValue(name as keyof FilterFormInputs, undefined);
    }
  };

  return (
    <Box sx={{ dispaly: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Box
        component="form"
        onSubmit={handleSubmit(onFilter)}
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          gap: '20px',
          marginBottom: '20px',
        }}
      >
        <TextField
          label="Минимум просмотров"
          type="number"
          fullWidth
          {...register('views')}
          onChange={handleInputChange}
        />
        <TextField label="Минимум лайков" type="number" fullWidth {...register('likes')} onChange={handleInputChange} />
        <TextField
          label="Минимальная цена"
          type="number"
          fullWidth
          {...register('price')}
          onChange={handleInputChange}
        />
        <Box sx={{ display: 'flex', gap: '10px', alignItems: 'baseline' }}>
          <Button type="submit" size="medium" variant="contained" fullWidth color="primary" sx={{ p: 2 }}>
            Отфильтровать
          </Button>
          <Button
            type="button"
            size="medium"
            variant="contained"
            color="secondary"
            onClick={handleResetFilters}
            fullWidth={true}
            sx={{ p: 2 }}
          >
            Сбросить
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default FilterAds;
