import { Typography } from '@mui/material';

const NothingFound = () => {
  return (
    <Typography
      variant="h5"
      color="text.secondary"
      textAlign="center"
      marginTop="20px"
    >
      По выбранным фильтрам ничего не найдено! Попробуйте сбросить фильтры и/или изменить параметры фильтрации!&#128519;
    </Typography>
  );
};
export default NothingFound;
