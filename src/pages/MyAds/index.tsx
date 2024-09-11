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
  Divider,
} from '@mui/material';
import { useGetAllAdvertisments } from '@/api/advertisments';
import { useEffect, useState } from 'react';
import { Loader } from '@/components/common/loader';
import { Error } from '@/components/common/error';
import { Link, useSearchParams } from 'react-router-dom';
import SearchAds from './components/SearchAds';
import { Favorite, Visibility } from '@mui/icons-material';
import { formatPrice } from '@/utils/formatPrice';
import FilterAds from './components/FilterAds';
import CreateAdButton from '@/components/CreateAdButton';
import { useQueryClient } from '@tanstack/react-query';
import NothingFound from '@/components/NothingFound';
import { adCard } from '@/router/paths';

const MyAds = () => {
  const queryClient = useQueryClient();
  const [searchParams, setSearchParams] = useSearchParams();
  const params = Object.fromEntries([...searchParams]);

  const storedPerPage = localStorage.getItem('perPage');
  const initialPerPage = storedPerPage ? parseInt(storedPerPage, 10) : parseInt(params._per_page) || 10;
  const [perPage, setPerPage] = useState(initialPerPage);
  const [currentPage, setCurrentPage] = useState(parseInt(params._page) || 1);
  const [views, setViews] = useState<number | undefined>(params.views ? parseInt(params.views) : undefined);
  const [likes, setLikes] = useState<number | undefined>(params.likes ? parseInt(params.likes) : undefined);
  const [price, setPrice] = useState<number | undefined>(params.price ? parseInt(params.price) : undefined);

  const { data, error, isLoading, isFetching, refetch } = useGetAllAdvertisments(
    perPage,
    currentPage,
    views,
    likes,
    price
  );

  const handleChange = (event: SelectChangeEvent<number>) => {
    const newPerPage = parseInt(event.target.value as string, 10);
    setCurrentPage(1);
    setPerPage(newPerPage);
    localStorage.setItem('perPage', newPerPage.toString());
    refetch();
  };

  const handlePageChange = (index: number): void => {
    setCurrentPage(index + 1);
    window.scrollTo(0, 0);
  };

  const handleFilterClick = (filterData: { views?: number; likes?: number; price?: number }) => {
    setViews(filterData.views);
    setLikes(filterData.likes);
    setPrice(filterData.price);
    setCurrentPage(1);
    refetch();
  };

  const handleResetFilters = () => {
    setViews(undefined);
    setLikes(undefined);
    setPrice(undefined);
    refetch();
  };

  useEffect(() => {
    const newParams: Record<string, string> = {
      _page: currentPage.toString(),
      _per_page: perPage.toString(),
    };
    if (views) newParams.views = views.toString();
    if (likes) newParams.likes = likes.toString();
    if (price) newParams.price = price.toString();
    setSearchParams(newParams, { replace: true });
  }, [currentPage, perPage, views, likes, price, setSearchParams]);

  useEffect(() => {
    return () => {
      queryClient.cancelQueries({ queryKey: ['advertisments'] });
    };
  }, [queryClient]);

  const paginationButtons = new Array(data?.pages ?? 0).fill(1);

  return (
    <>
      {error && <Error error={error as Error} />}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'end',
            alignItems: 'center',
            gap: '10%',
          }}
        >
          <Box>
            <Typography
              variant="h3"
              gutterBottom
              textAlign={'center'}
              margin={'20px'}
            >
              Мои Объявления
            </Typography>
          </Box>
          <FormControl
            sx={{ width: '300px' }}
            color="secondary"
          >
            <InputLabel id="ads_perPage">Кол-во объявлений на странице</InputLabel>
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
        </Box>
        <FilterAds
          onFilter={handleFilterClick}
          onReset={handleResetFilters}
          initialValues={{ views, likes, price }}
        />
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center' }}>
            <SearchAds />
          </Box>

          <Box sx={{ marginLeft: '20px' }}>
            <CreateAdButton />
          </Box>
        </Box>

        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            width: '100%',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          {isLoading || isFetching ? (
            <Loader />
          ) : data?.data && data.data.length === 0 ? (
            <NothingFound />
          ) : (
            data?.data.map((ad) => (
              <>
                <Link
                  key={ad.id}
                  to={`${adCard}${ad.id}`}
                  style={{ textDecoration: 'none', width: '100%' }}
                >
                  <Card
                    sx={{
                      width: '100%',
                      marginBottom: 2,
                      position: 'relative',
                      overflow: 'hidden',
                      '&:before': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.05) 0%, rgba(0, 0, 0, 0.3) 100%)',
                        opacity: 0,
                        transition: 'opacity 0.4s ease',
                        zIndex: 1,
                      },
                      '&:hover:before': {
                        opacity: 1,
                      },
                    }}
                  >
                    <Box
                      sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        width: '100%',
                      }}
                    >
                      <Typography
                        gutterBottom
                        variant="h4"
                        component="div"
                        textAlign="center"
                        mt={4}
                      >
                        {ad.name}
                      </Typography>
                      <Box
                        sx={{
                          width: '80%',
                          maxWidth: 800,
                          marginY: 2,
                        }}
                      >
                        <Divider
                          variant="middle"
                          sx={{ width: '100%' }}
                        />
                      </Box>
                    </Box>
                    {ad.imageUrl && (
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <CardMedia
                          component="img"
                          image={ad.imageUrl}
                          alt={ad.name}
                          sx={{
                            objectFit: 'cover',
                            width: '400px',
                            height: '100%',
                            maxHeight: '400px',
                            alignItems: 'center',
                          }}
                        />
                      </Box>
                    )}
                    <CardContent>
                      <Typography
                        variant="h5"
                        color="text.primary"
                        gutterBottom
                      >
                        Описание:
                      </Typography>
                      <Typography
                        variant="h5"
                        color="text.secondary"
                        sx={{
                          wordWrap: 'break-word',
                          overflowWrap: 'break-word',
                          width: '100%',
                          whiteSpace: 'normal',
                        }}
                      >
                        {ad.description
                          ? ad.description.length > 300
                            ? `${ad.description.slice(0, 300)}...`
                            : ad.description
                          : ''}
                      </Typography>
                      <Typography
                        variant="h5"
                        color="text.secondary"
                        textAlign={'right'}
                        fontWeight={600}
                      >
                        {formatPrice(ad.price)}
                      </Typography>
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'end',
                          marginTop: 2,
                        }}
                      >
                        <Visibility
                          color="action"
                          sx={{ marginRight: 1 }}
                        />
                        <Typography
                          variant="h6"
                          color="text.secondary"
                        >
                          {ad.views}
                        </Typography>
                      </Box>
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'end',
                          marginTop: 2,
                        }}
                      >
                        <Favorite
                          color="error"
                          sx={{ marginRight: 1 }}
                        />
                        <Typography
                          variant="h6"
                          color="text.secondary"
                        >
                          {ad.likes}
                        </Typography>
                      </Box>
                    </CardContent>
                  </Card>
                </Link>
              </>
            ))
          )}
        </Box>
        {data?.pages || data?.data.length === 0 ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 0, mb: 3, gap: '5px' }}>
            {paginationButtons.map((_, index) => (
              <Button
                key={index}
                variant={index + 1 === currentPage ? 'contained' : 'outlined'}
                onClick={() => handlePageChange(index)}
              >
                {index + 1}
              </Button>
            ))}
          </Box>
        ) : null}
      </Box>
    </>
  );
};

export default MyAds;
