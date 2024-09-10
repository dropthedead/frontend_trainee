import * as yup from 'yup';

export const adSchema = yup.object().shape({
  name: yup
    .string()
    .required('Название обязательно')
    .max(20, 'Название не должно превышать 20 символов'),
  description: yup
    .string()
    .required('Описание обязательно')
    .max(300, 'Описание не должно превышать 300 символов'),
  price: yup
    .number()
    .typeError('Стоимость должна быть числом')
    .required('Стоимость обязательна')
    .min(0, 'Стоимость не может быть отрицательной')
    .test(
      'len',
      'Стоимость не должна превышать 7 символов',
      (val) => String(val).length <= 7,
    ),
  imageUrl: yup
    .string()
    .url('Неверный формат URL')
    .required('URL картинки обязателен'),
});
