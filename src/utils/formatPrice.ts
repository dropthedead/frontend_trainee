export function formatPrice(price: number): string {
  return new Intl.NumberFormat('ru-RU').format(price) + '₽';
}
