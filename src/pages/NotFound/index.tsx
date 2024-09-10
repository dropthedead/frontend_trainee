import { Box, Typography, useTheme } from '@mui/material';

const NotFound = () => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '90vh',
        backgroundColor: theme.palette.background.default,
        color: theme.palette.text.primary,
      }}
    >
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: theme.palette.error.main }}>
        404 Not Found
      </Typography>
      <Typography variant="body1" align="center" sx={{ maxWidth: '500px', marginTop: theme.spacing(2) }}>
        Страница, которую вы ищете, не существует. Вернитесь обратно или попробуйте снова&#128519;
      </Typography>
    </Box>
  );
};

export default NotFound;
