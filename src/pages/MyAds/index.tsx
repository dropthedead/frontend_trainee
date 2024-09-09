import {
  Box,
  Typography,
  Card,
  CardContent,
  CardMedia,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
} from '@mui/material';
import { useGetAllAdvertisments } from '@/api';
import { useEffect, useState } from 'react';
import { Loader } from '@/components/common/loader';
import { Error } from '@/components/common/error';
import CreateAdModal from './components/CreateAdModal';
import { Link, useSearchParams } from 'react-router-dom';

const MyAds = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const params = Object.fromEntries([...searchParams]);

  const [perPage, setPerPage] = useState(parseInt(params._per_page) || 10);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(parseInt(params._page) || 1);

  const { data, error, isLoading, fetchNextPage, isFetching, refetch } =
    useGetAllAdvertisments(perPage);

  const handleChange = (event: SelectChangeEvent<number>) => {
    const newPerPage = parseInt(event.target.value as string, 10);
    setCurrentPage(1);
    setPerPage(newPerPage);
    refetch();
  };

  const handlePageChange = (index: number): void => {
    setCurrentPage(index + 1);
    fetchNextPage();
    window.scrollTo(0, 0);
  };
  useEffect(() => {
    setSearchParams(
      {
        _page: currentPage.toString(),
        _per_page: perPage.toString(),
      },
      { replace: true },
    );
  }, [currentPage, perPage, setSearchParams]);
  const paginationButtons = new Array(data?.pages[0].pages ?? 0).fill(1);

  return (
    <>
      {error && <Error error={error as Error} />}
      {isLoading || isFetching ? (
        <Loader />
      ) : (
        <Box>
          <Typography variant="h4" gutterBottom>
            Мои Объявления
          </Typography>
          <FormControl fullWidth>
            <InputLabel id="ads_perPage">
              Кол-во объявлений на странице
            </InputLabel>
            <Select
              labelId="ads_limit"
              id="ads_limit"
              value={perPage}
              label="Кол-во объявлений на странице"
              onChange={handleChange}
            >
              <MenuItem value={5}>5</MenuItem>
              <MenuItem value={10}>10</MenuItem>
              <MenuItem value={50}>50</MenuItem>
            </Select>
          </FormControl>
          <Button
            onClick={() => setIsOpenModal(true)}
            variant="contained"
            color="primary"
            sx={{ mt: 2 }}
          >
            Добавить объявление
          </Button>
          {data?.pages[currentPage - 1]?.data.map((ad) => (
            <Link key={ad.id} to={`/advertisment/${ad.id}`}>
              <Card sx={{ maxWidth: 345, marginBottom: 2 }}>
                {ad.imageUrl && (
                  <CardMedia
                    component="img"
                    image={ad.imageUrl}
                    alt={ad.name}
                    sx={{
                      objectFit: 'cover',
                      width: '100%',
                      height: '200px',
                    }}
                  />
                )}
                <CardContent>
                  <Typography gutterBottom variant="h5" component="div">
                    {ad.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {ad.description}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Price: {ad.price}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Views: {ad.views}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Likes: {ad.likes}
                  </Typography>
                </CardContent>
              </Card>
            </Link>
          ))}

          <Box textAlign="center" mt={2}>
            {paginationButtons.map((_, index) => (
              <Button
                key={index}
                onClick={() => handlePageChange(index)}
                variant={index + 1 === currentPage ? 'contained' : 'outlined'}
                sx={{ margin: 1 }}
              >
                {index + 1}
              </Button>
            ))}
          </Box>
        </Box>
      )}
      <CreateAdModal
        isOpen={isOpenModal}
        handleClose={() => setIsOpenModal(false)}
      />
    </>
  );
};

export default MyAds;
