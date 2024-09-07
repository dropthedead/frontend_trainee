import { Outlet } from 'react-router-dom';
import { Container } from '@mui/material';
import Navbar from '@/components/navbar';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();
const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <Navbar />
      <Container maxWidth="lg">
        <Outlet />
      </Container>
    </QueryClientProvider>
  );
};

export default App;
