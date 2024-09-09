import { createBrowserRouter, Navigate, RouteObject } from 'react-router-dom';
import App from '@/App';
import MyAds from '@/pages/MyAds';
import Advertisment from '@/pages/AdCard';
import Orders from '@/pages/Orders';
import NotFound from '@/pages/NotFound';

const routes: RouteObject[] = [
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: '/',
        element: <Navigate to="/myads" replace />,
      },
      {
        path: '/myads',
        element: <MyAds />,
      },
      {
        path: '/advertisment/:id',
        element: <Advertisment />,
      },
      {
        path: '/orders',
        element: <Orders />,
      },
      {
        path: '*',
        element: <NotFound />,
      },
    ],
  },
];

export const router = createBrowserRouter(routes);
