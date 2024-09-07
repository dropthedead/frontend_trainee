import { Link } from 'react-router-dom';
import { AppBar, Toolbar, Button } from '@mui/material';

const Navbar = () => {
  return (
    <AppBar position="static">
      <Toolbar>
        <Button color="inherit" component={Link} to="/myads">
          Мои Объявления
        </Button>
        <Button color="inherit" component={Link} to="/advertisment">
          Advertisment
        </Button>
        <Button color="inherit" component={Link} to="/orders">
          Заказы
        </Button>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
