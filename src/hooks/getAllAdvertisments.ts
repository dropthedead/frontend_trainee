import { useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from '@/utils/constants';

import type { Advertisment } from '../../types';

const useAdvertisements = () => {
  const [advertisements, setAdvertisements] = useState<Advertisment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchAdvertisements = async () => {
      try {
        const response = await axios.get<Advertisment[]>(
          `${API_URL}/advertisements`,
        );
        setAdvertisements(response.data);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchAdvertisements();
  }, []);

  return { advertisements, loading, error };
};

export default useAdvertisements;
