import { Link } from 'react-router-dom';
import { AppBar, Toolbar, Button, IconButton } from '@mui/material';
import { Brightness4, Brightness7 } from '@mui/icons-material';

interface NavbarProps {
  toggleTheme: () => void;
  isDarkMode: boolean;
}

const Navbar = ({ toggleTheme, isDarkMode }: NavbarProps) => {
  return (
    <AppBar position="sticky">
      <Toolbar>
        <Button color="inherit" component={Link} to="/myads">
          Мои Объявления
        </Button>
        <Button color="inherit" component={Link} to="/orders">
          Заказы
        </Button>
        <IconButton color="inherit" onClick={toggleTheme}>
          {isDarkMode ? <Brightness7 /> : <Brightness4 />}
        </IconButton>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
