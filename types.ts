/* eslint-disable @typescript-eslint/no-unused-vars */
export type Advertisment = {
  /* Уникальный идентификатор. */
  id: string;
  /* Название. */
  name: string;
  /* Описание. */
  description?: string;
  /* Цена. */
  price: number;
  /* Дата и время создания. */
  createdAt: string;
  /* Количество просмотров. */
  views: number;
  /* Количество лайков. */
  likes: number;
  /* Ссылка на изображение. */
  imageUrl?: string;
};

export const OrderStatus = {
  Created: 0,
  Paid: 1,
  Transport: 2,
  DeliveredToThePoint: 3,
  Received: 4,
  Archived: 5,
  Refund: 6,
} as const;

export type OrderItem = Advertisment & { count: number };

export type Order = {
  /* Уникальный идентификатор. */
  id: string;
  /* Статус. */
  status: (typeof OrderStatus)[keyof typeof OrderStatus];
  /* Дата и время создания. */
  createdAt: string;
  /* Дата и время завершения. */
  finishedAt?: string;
  /* Товары в заказе. */
  items: Array<OrderItem>;
  /* Способ доставки(Почта, СДЭК...) */
  deliveryWay: string;
  /* Сумма заказа */
  total: number;
};

type Image = {
  /* Уникальный идентификатор. */
  id: number;
  /* Ссылка. */
  url: string;
  /* Название. */
  name: string;
};

export type OrderStatusKeys = keyof typeof OrderStatus;
export type OrderStatusValues = (typeof OrderStatus)[OrderStatusKeys];

export const DeliveryWayLabel: Record<string, string> = {
  mail: 'Почта',
  sdek: 'СДЭК',
  courier: 'Курьер',
};

export type FormValues = {
  id: string;
  status: OrderStatusValues;
  deliveryWay: keyof typeof DeliveryWayLabel;
  items: { id: string; name: string; price: number; count: number }[];
  total: number;
};

type Keys = keyof typeof OrderStatus;
export type Values = (typeof OrderStatus)[Keys];
export const OrderStatusLabel: Record<Values, string> = {
  0: 'Создан',
  1: 'Оплачен',
  2: 'В пути',
  3: 'Доставлен',
  4: 'Получен',
  5: 'Архивирован',
  6: 'Возврат средств',
};
