import { Listing } from '../types';

export function formatPrice(amount: number, currency: 'TRY' | 'USD' | 'EUR' = 'TRY'): string {
  return new Intl.NumberFormat('tr-TR', { style: 'currency', currency, maximumFractionDigits: 0 }).format(amount);
}

export function formatPriceShort(amount: number): string {
  if (amount >= 1_000_000) return `${(amount / 1_000_000).toFixed(1)}M ₺`;
  if (amount >= 1_000) return `${(amount / 1_000).toFixed(0)}K ₺`;
  return `${amount} ₺`;
}

export function formatRelativeTime(isoDate: string): string {
  const diff = Date.now() - new Date(isoDate).getTime();
  const min = Math.floor(diff / 60000);
  const hour = Math.floor(min / 60);
  const day = Math.floor(hour / 24);
  if (min < 1) return 'Az önce';
  if (min < 60) return `${min} dk önce`;
  if (hour < 24) return `${hour} saat önce`;
  if (day < 7) return `${day} gün önce`;
  return new Date(isoDate).toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' });
}

export const conditionLabels: Record<Listing['condition'], string> = {
  new: 'Sıfır', 'like-new': 'Sıfır Gibi', good: 'İyi', fair: 'Orta', poor: 'Kötü',
};

export const priceTypeLabels: Record<Listing['priceType'], string> = {
  fixed: 'Sabit Fiyat', negotiable: 'Pazarlık', free: 'Ücretsiz', swap: 'Takas',
};

export function truncate(str: string, max: number): string {
  return str.length <= max ? str : str.slice(0, max).trimEnd() + '…';
}
