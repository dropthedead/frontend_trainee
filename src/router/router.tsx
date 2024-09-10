import { createBrowserRouter, Navigate, RouteObject } from 'react-router-dom';
import App from '@/App';
import MyAds from '@/pages/MyAds';
import Advertisment from '@/pages/AdCard';
import Orders from '@/pages/Orders';
import NotFound from '@/pages/NotFound';
import { home, myAds, adCard, orders } from '@/router/paths';

const routes: RouteObject[] = [
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: `${home}`,
        element: <Navigate to="/myads" replace />,
      },
      {
        path: `${myAds}`,
        element: <MyAds />,
      },
      {
        path: `${adCard}:id`,
        element: <Advertisment />,
      },
      {
        path: `${orders}`,
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
