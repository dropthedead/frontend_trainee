import axios from 'axios';
import { API_URL } from '@/utils/constants';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Order } from '../../types';

type OrderFeed = {
  data: Order[];
  next: number;
  pages: number;
};

type PageParam = {
  _page: number;
  status?: number;
  sortBy?: string;
};

const getAllOrders = async (pageParam: PageParam) => {
  const response = await axios.get<OrderFeed>(`${API_URL}/orders`, {
    params: { ...pageParam, _per_page: 10 },
  });
  return response.data;
};

export const useGetAllOrders = (currentPage: number, status?: number, sortBy?: string) => {
  return useQuery({
    queryKey: ['orders', currentPage, status, sortBy],
    queryFn: () =>
      getAllOrders({
        _page: currentPage,
        ...(typeof status !== 'undefined' && { status }),
        ...(sortBy && { _sort: sortBy }),
      }),
  });
};

const patchOrder = async (id: string, updatedData: Partial<Order>) => {
  const response = await axios.patch(`${API_URL}/orders/${id}`, updatedData);
  return response.data;
};

export const usePatchOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, updatedData }: { id: string; updatedData: Partial<Order> }) =>
      toast.promise(patchOrder(id, updatedData), {
        pending: 'Обновляем заказ...',
        success: 'Заказ успешно обновлён!',
        error: 'Ошибка при обновлении заказа!',
      }),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['orders', id] });
    },
  });
};

export interface NewOrder {
  id: string;
  status: number;
  deliveryWay: string;
  total: number;
  items: { id: string; name: string; price: number; count: number }[];
}

const createOrder = async (order: NewOrder) => {
  const response = await axios.post<NewOrder>(`${API_URL}/orders`, order);
  return response.data;
};

export const useCreateOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (order: NewOrder) =>
      toast.promise(createOrder(order), {
        pending: 'Создаем заказ...',
        success: 'Заказ успешно создан!',
        error: 'Ошибка при создании заказа!',
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
  });
};
