import { Link } from 'react-router-dom';
import { AppBar, Toolbar, Button, IconButton, Box } from '@mui/material';
import { Brightness4, Brightness7 } from '@mui/icons-material';
import { home, orders } from '@/router/paths';
interface NavbarProps {
  toggleTheme: () => void;
  isDarkMode: boolean;
}

const Navbar = ({ toggleTheme, isDarkMode }: NavbarProps) => {
  return (
    <AppBar position="sticky">
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Box>
          <Button color="inherit" component={Link} to={`${home}`}>
            Мои Объявления
          </Button>
          <Button color="inherit" component={Link} to={`${orders}`}>
            Заказы
          </Button>
        </Box>
        <Box>
          <IconButton color="inherit" onClick={toggleTheme}>
            {isDarkMode ? <Brightness7 /> : <Brightness4 />}
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
