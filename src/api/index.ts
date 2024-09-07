import axios from 'axios';
import { API_URL } from '@/utils/constants';
import { useInfiniteQuery, InfiniteData } from '@tanstack/react-query';

import type { Advertisment } from '../../types';

type PageParam = {
  start: number;
  limit: number;
};
const pageParamDefault: PageParam = { start: 0, limit: 10 };

const getAdvertisments = async (pageParam: PageParam = pageParamDefault) => {
  const response = await axios.get<Advertisment[]>(
    `${API_URL}/advertisements`,
    {
      params: pageParam,
    },
  );
  return response.data;
};

export const useGetAdvertisment = (limit: number) => {
  return useInfiniteQuery<
    Advertisment[],
    unknown,
    InfiniteData<Advertisment[]>,
    unknown[],
    number
  >({
    queryKey: ['advertisments', limit],
    queryFn: ({ pageParam }) =>
      getAdvertisments({ start: pageParam, limit: limit }),
    initialPageParam: 0,

    getNextPageParam: (lastPage, allPages, lastPageParam, allPageParams) => {
      console.log('123', lastPageParam);
      return lastPageParam + 10;
    },
  });
};
