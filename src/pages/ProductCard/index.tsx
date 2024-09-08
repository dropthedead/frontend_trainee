import { Typography } from '@mui/material';
import { useParams } from 'react-router-dom';

const Advertisment = () => {
  const { id } = useParams();
  console.log(id);
  return (
    <div>
      <Typography variant="body1">This is the Advertisment page.</Typography>
    </div>
  );
};

export default Advertisment;
