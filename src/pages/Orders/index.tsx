import { useEffect, useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  MenuItem,
  Select,
  SelectChangeEvent,
  CardMedia,
} from '@mui/material';
import { Link, useSearchParams } from 'react-router-dom';
import { useGetAllOrders, usePatchOrder } from '@/api/orders';
import { OrderStatus, OrderStatusLabel, DeliveryWayLabel, Values } from '../../../types';

import { formatPrice } from '@/utils/formatPrice';
import { Loader } from '@/components/common/loader';
import { Error } from '@/components/common/error';
import { ExpandMore, ExpandLess } from '@mui/icons-material';
import NothingFound from '@/components/NothingFound';
import CreateOrderModal from './components/createOrderModal';

const OrdersPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const params = Object.fromEntries([...searchParams]);

  const [currentPage, setCurrentPage] = useState(parseInt(params._page) || 1);
  const [completedOrders, setCompletedOrders] = useState<string[]>([]);

  const [statusFilter, setStatusFilter] = useState<Values | 'all'>('all');
  const [sortBy, setSortBy] = useState<'total' | ''>('');
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);

  const { mutate: patchOrder, isPending } = usePatchOrder();
  const { data, isLoading, error, isFetching, refetch } = useGetAllOrders(
    currentPage,
    statusFilter !== 'all' ? statusFilter : undefined,
    sortBy
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const handleCompleteOrder = (orderId: string) => {
    patchOrder(
      { id: orderId, updatedData: { status: OrderStatus.Received } },
      {
        onSuccess: () => {
          setCompletedOrders((prev) => [...prev, orderId]);
          refetch();
        },
      }
    );
  };
  const handleStatusChange = (event: SelectChangeEvent<string>) => {
    const value = event.target.value as unknown as Values;
    setStatusFilter(value);
  };

  const handleSortChange = (event: SelectChangeEvent<string>) => {
    setSortBy(event.target.value as 'total' | '');
  };

  const toggleExpandOrder = (orderId: string) => {
    setExpandedOrderId(expandedOrderId === orderId ? null : orderId);
  };

  const handlePageChange = (index: number): void => {
    setCurrentPage(index + 1);
    window.scrollTo(0, 0);
  };

  useEffect(() => {
    const newParams: Record<string, string> = {
      _page: currentPage.toString(),
      _per_page: '10',
    };
    if (typeof statusFilter !== 'undefined') newParams.statusFilter = statusFilter.toString();
    if (sortBy) newParams.sortBy = sortBy.toString();

    setSearchParams(newParams, { replace: true });
  }, [currentPage, statusFilter, sortBy, setSearchParams]);
  const paginationButtons = new Array(data?.pages ?? 0).fill(1);
  return (
    <>
      <Box sx={{ padding: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4 }}>
          <Select
            value={statusFilter?.toString()}
            onChange={handleStatusChange}
            displayEmpty
          >
            <MenuItem value="all">Все статусы</MenuItem>
            <MenuItem value={OrderStatus.Created}>Создан</MenuItem>
            <MenuItem value={OrderStatus.Paid}>Оплачен</MenuItem>
            <MenuItem value={OrderStatus.Transport}>В пути</MenuItem>
            <MenuItem value={OrderStatus.DeliveredToThePoint}>Доставлен</MenuItem>
            <MenuItem value={OrderStatus.Received}>Получен</MenuItem>
            <MenuItem value={OrderStatus.Archived}>Архивирован</MenuItem>
            <MenuItem value={OrderStatus.Refund}>Возврат</MenuItem>
          </Select>
          <Select
            value={sortBy}
            onChange={handleSortChange}
            displayEmpty
          >
            <MenuItem value="">Без сортировки</MenuItem>
            <MenuItem value="-total">Сортировать по убыванию суммы</MenuItem>
            <MenuItem value="total">Сортировать по возрастанию суммы</MenuItem>
          </Select>
          <Button
            variant="contained"
            color="primary"
            onClick={() => setIsModalOpen(true)}
          >
            Создать заказ (тестовая функция)
          </Button>
        </Box>
        {error && <Error error={error as Error} />}
        {isLoading || isFetching ? (
          <Loader />
        ) : data?.data && data.data.length === 0 ? (
          <NothingFound />
        ) : (
          <>
            {data?.data.map((order) => (
              <Card
                key={order.id}
                sx={{ marginBottom: 2 }}
              >
                <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '20px' }}>
                  <Typography
                    variant="h4"
                    sx={{ alignSelf: 'center', mb: 2 }}
                  >
                    Заказ № {order.id}
                  </Typography>
                  <Typography>Дата создания: {new Date(order.createdAt).toLocaleString()}</Typography>
                  {order.finishedAt && (
                    <Typography>Дата завершения: {new Date(order.finishedAt).toLocaleString()}</Typography>
                  )}
                  <Typography>Статус: {OrderStatusLabel[order.status]}</Typography>
                  <Typography>Количество товаров: {order.items.length}</Typography>
                  <Typography>Стоимость: {formatPrice(order.total)}</Typography>
                  <Typography>Способ доставки: {DeliveryWayLabel[order.deliveryWay]}</Typography>

                  <Button
                    variant="contained"
                    onClick={() => toggleExpandOrder(order.id)}
                  >
                    {expandedOrderId === order.id ? 'Скрыть товары' : 'Показать все товары'}
                    {expandedOrderId === order.id ? <ExpandLess /> : <ExpandMore />}
                  </Button>

                  {expandedOrderId === order.id && (
                    <Box sx={{ marginTop: 2 }}>
                      {order.items.map((item) => (
                        <Link
                          key={item.id}
                          to={`/advertisment/${item.id}`}
                          style={{ textDecoration: 'none', width: '100%' }}
                        >
                          <Card
                            key={item.id}
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
                            <CardContent>
                              <Typography>Название: {item.name}</Typography>
                              {item.imageUrl && (
                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start' }}>
                                  <CardMedia
                                    component="img"
                                    image={item.imageUrl}
                                    alt={item.name}
                                    sx={{
                                      objectFit: 'cover',
                                      width: '200px',
                                      height: '100%',
                                      maxHeight: '400px',
                                      alignItems: 'center',
                                    }}
                                  />
                                </Box>
                              )}
                              <Typography>Количество: {item.count}</Typography>
                              <Typography>Цена: {formatPrice(item.price * item.count)}</Typography>
                            </CardContent>
                          </Card>
                        </Link>
                      ))}
                    </Box>
                  )}

                  {order.status !== OrderStatus.Received &&
                    order.status !== OrderStatus.Archived &&
                    order.status !== OrderStatus.Refund && (
                      <Button
                        variant="contained"
                        color="success"
                        sx={{ marginTop: 2 }}
                        disabled={isPending || completedOrders.includes(order.id)}
                        onClick={() => handleCompleteOrder(order.id)}
                      >
                        {isPending && completedOrders.includes(order.id) ? 'Закрываем заказ...' : 'Завершить заказ'}
                      </Button>
                    )}
                </CardContent>
              </Card>
            ))}

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
          </>
        )}
      </Box>
      <CreateOrderModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
};

export default OrdersPage;
