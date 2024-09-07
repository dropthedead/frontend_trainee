import { Box, Typography } from '@mui/material';

type ErrorProps = {
  error: { message: string }; // Обновляем тип для кастомной ошибки
};

export const Error = ({ error }: ErrorProps) => {
  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      height="100vh"
    >
      <Typography variant="h6" color="error">
        Error: {error.message}
      </Typography>
    </Box>
  );
};
