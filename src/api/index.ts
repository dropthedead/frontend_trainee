import axios from 'axios';
import { API_URL } from '@/utils/constants';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import type { Advertisment } from '../../types';

type PageParam = {
  _page: number;
  _per_page: number;
  _views?: number;
  _likes?: number;
  _price?: number;
};

export type NewAdvertisment = Required<
  Pick<Advertisment, 'imageUrl' | 'description' | 'price' | 'name'>
>;

type AdvertismentFeed = {
  data: Advertisment[];
  next: number;
  pages: number;
};

const getAllAdsForSearch = async (): Promise<Advertisment[]> => {
  const response = await axios.get<Advertisment[]>(`${API_URL}/advertisements`);
  return response.data;
};

export const useGetAllAdsForSearch = () => {
  return useQuery({
    queryKey: ['allAds'],
    queryFn: getAllAdsForSearch,
    staleTime: 5 * 60 * 1000,
  });
};

const getAllAdvertisments = async (pageParam: PageParam) => {
  const response = await axios.get<AdvertismentFeed>(
    `${API_URL}/advertisements`,
    {
      params: pageParam,
    },
  );
  return response.data;
};
export const useGetAllAdvertisments = (
  perPage: number,
  currentPage: number,
  views?: number,
  likes?: number,
  price?: number,
) => {
  return useQuery({
    queryKey: ['advertisments', perPage, currentPage, views, likes, price],
    queryFn: () =>
      getAllAdvertisments({
        _page: currentPage,
        _per_page: perPage,
        ...(views && { views_gte: views }),
        ...(likes && { likes_gte: likes }),
        ...(price && { price_gte: price }),
      }),
  });
};
const createAdvertisment = async (newAd: NewAdvertisment) => {
  const response = await axios.post(`${API_URL}/advertisements`, {
    ...newAd,
    createdAt: new Date().toISOString(),
    views: 0,
    likes: 0,
  });
  return response.data;
};

export const useCreateAdvertisment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (newAdData: NewAdvertisment) =>
      toast.promise(createAdvertisment(newAdData), {
        pending: 'Создаем объявление...',
        success: 'Объявление успешно создано!',
        error: 'Ошибка при создании объявления!',
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['advertisments'] });
    },
  });
};

const getAdvertisment = async (id: string) => {
  const response = await axios.get<Advertisment>(
    `${API_URL}/advertisements/${id}`,
  );
  return response.data;
};

export const useGetAdvertisment = (id: string) => {
  return useQuery<Advertisment, unknown>({
    queryKey: ['advertisments', id],
    queryFn: () => getAdvertisment(id),
    enabled: !!id,
  });
};

const patchAdvertisment = async (
  id: string,
  updatedData: Partial<Advertisment>,
) => {
  const response = await axios.patch(
    `${API_URL}/advertisements/${id}`,
    updatedData,
  );
  return response.data;
};

export const usePatchAdvertisment = (id: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (updatedData: Partial<Advertisment>) =>
      toast.promise(patchAdvertisment(id, updatedData), {
        pending: 'Обновляем объявление...',
        success: 'Объявление успешно обновлено!',
        error: 'Ошибка при обновлении объявления!',
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['advertisments', id] });
    },
  });
};

const deleteAdvertisment = async (id: string) => {
  const response = await axios.delete(`${API_URL}/advertisements/${id}`);
  return response.data;
};

export const useDeleteAdvertisment = (id: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) =>
      toast.promise(deleteAdvertisment(id), {
        pending: 'Удаляем объявление...',
        success: 'Объявление успешно удалено!',
        error: 'Ошибка при удалении объявления!',
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['advertisments', id] });
    },
  });
};
