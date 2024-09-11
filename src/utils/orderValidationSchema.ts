import * as yup from 'yup';
import { OrderStatusValues, DeliveryWayLabel, OrderStatus } from '../../types';
export const orderValidationSchema = yup.object().shape({
  id: yup.string().required('ID заказа обязателен'),
  status: yup.mixed<OrderStatusValues>().oneOf(Object.values(OrderStatus)).required('Статус заказа обязателен'),
  deliveryWay: yup
    .mixed<keyof typeof DeliveryWayLabel>()
    .oneOf(Object.keys(DeliveryWayLabel))
    .required('Способ доставки обязателен'),
  items: yup
    .array()
    .of(
      yup.object().shape({
        id: yup.string().required('ID объявления обязателен'),
        name: yup.string().required('Название объявления обязательно'),
        price: yup.number().required('Цена обязательна').min(0, 'Цена не может быть отрицательной'),
        count: yup.number().required('Количество обязательно').min(1, 'Минимум 1 штука'),
      })
    )
    .min(1, 'Необходимо добавить хотя бы одно объявление')
    .required('Необходимо добавить хотя бы одно объявление'),
  total: yup.number().required('Итоговая сумма обязательна').min(0, 'Сумма не может быть отрицательной'),
});
