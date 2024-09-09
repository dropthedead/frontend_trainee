import axios from 'axios';
import { API_URL } from '@/utils/constants';
import {
  useInfiniteQuery,
  InfiniteData,
  useMutation,
  useQueryClient,
  useQuery,
} from '@tanstack/react-query';

import type { Advertisment } from '../../types';

type PageParam = {
  _page: number;
  _per_page: number;
};

export type NewAdvertisment = Required<
  Pick<Advertisment, 'imageUrl' | 'description' | 'price' | 'name'>
>;

type AdvertismentFeed = {
  data: Advertisment[];
  next: number;
  pages: number;
};

const pageParamDefault: PageParam = { _page: 1, _per_page: 10 };

const getAllAdvertisments = async (pageParam: PageParam = pageParamDefault) => {
  const response = await axios.get<AdvertismentFeed>(
    `${API_URL}/advertisements`,
    {
      params: pageParam,
    },
  );
  return response.data;
};

export const useGetAllAdvertisments = (perPage: number) => {
  return useInfiniteQuery<
    AdvertismentFeed,
    unknown,
    InfiniteData<AdvertismentFeed>,
    unknown[],
    number
  >({
    queryKey: ['advertisments', perPage],
    queryFn: ({ pageParam }) =>
      getAllAdvertisments({ _page: pageParam, _per_page: perPage }),
    initialPageParam: 1,

    getNextPageParam: (lastPage) => {
      return lastPage.next;
    },
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
    mutationFn: createAdvertisment,
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
      patchAdvertisment(id, updatedData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['advertisments', id] });
    },
  });
};
