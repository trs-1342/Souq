import { Listing, User } from '../types';

export const MOCK_USERS: User[] = [
  { id: 'u1', name: 'Ahmet Yılmaz', email: 'ahmet@souq.com', phone: '+90 532 111 2233', isVerified: true, rating: 4.8, reviewCount: 47, listingCount: 12, createdAt: '2023-03-15T10:00:00Z' },
  { id: 'u2', name: 'Selin Kaya', email: 'selin@souq.com', isVerified: false, rating: 4.2, reviewCount: 8, listingCount: 3, createdAt: '2024-01-20T10:00:00Z' },
];

export const MOCK_LISTINGS: Listing[] = [
  // {
  //   id: 'l1', title: 'iPhone 15 Pro Max 256GB Doğal Titanyum',
  //   description: 'Kutusunda, faturalı, sıfır gibi. Hiç kılıfsız kullanmadım. Kaşıntı çizik yok. Acil satılık.',
  //   price: 58000, priceType: 'negotiable', currency: 'TRY', condition: 'like-new', status: 'active',
  //   categorySlug: 'elektronik', subcategoryId: '3-1',
  //   images: [
  //     { id: 'i1', uri: 'https://picsum.photos/seed/iphone/600/600', order: 0 },
  //     { id: 'i2', uri: 'https://picsum.photos/seed/iphone2/600/600', order: 1 },
  //   ],
  //   location: { city: 'İstanbul', district: 'Kadıköy' },
  //   userId: 'u1', viewCount: 342, favoriteCount: 28,
  //   createdAt: '2025-02-20T08:00:00Z', updatedAt: '2025-02-20T08:00:00Z',
  //   tags: ['iphone', 'apple', 'telefon'], relevanceScore: 0.95,
  // },
  // {
  //   id: 'l2', title: '2+1 Kiralık Daire — Merkezi Konum',
  //   description: 'Ebeveyn banyolu, eşyalı, güneş alan. Metroya 5 dakika. Yeni bina.',
  //   price: 22000, priceType: 'fixed', currency: 'TRY', condition: 'good', status: 'active',
  //   categorySlug: 'emlak', subcategoryId: '1-2',
  //   images: [{ id: 'i3', uri: 'https://picsum.photos/seed/daire/600/600', order: 0 }],
  //   location: { city: 'Ankara', district: 'Çankaya' },
  //   userId: 'u2', viewCount: 891, favoriteCount: 63,
  //   createdAt: '2025-02-18T12:00:00Z', updatedAt: '2025-02-18T12:00:00Z',
  //   relevanceScore: 0.88,
  // },
  // {
  //   id: 'l3', title: 'Volkswagen Golf 1.5 TSI Highline 2022',
  //   description: '42.000 km. Sunroof, navigasyon, geri görüş kamerası. Boyasız, hasarsız. Servis bakımlı.',
  //   price: 1250000, priceType: 'negotiable', currency: 'TRY', condition: 'like-new', status: 'active',
  //   categorySlug: 'vasita', subcategoryId: '2-1',
  //   images: [
  //     { id: 'i4', uri: 'https://picsum.photos/seed/golf/600/600', order: 0 },
  //     { id: 'i5', uri: 'https://picsum.photos/seed/golf2/600/600', order: 1 },
  //   ],
  //   location: { city: 'İzmir', district: 'Bornova' },
  //   userId: 'u1', viewCount: 1204, favoriteCount: 97,
  //   createdAt: '2025-02-15T09:00:00Z', updatedAt: '2025-02-15T09:00:00Z',
  //   relevanceScore: 0.91,
  // },
  // {
  //   id: 'l4', title: 'MacBook Air M3 — 16GB / 512GB Gece Yarısı',
  //   description: 'Nisan 2024 alım. Apple Care+ var (2026 sonuna kadar). Kutusunda tüm aksesuarlar mevcut.',
  //   price: 52000, priceType: 'fixed', currency: 'TRY', condition: 'new', status: 'active',
  //   categorySlug: 'elektronik', subcategoryId: '3-2',
  //   images: [{ id: 'i7', uri: 'https://picsum.photos/seed/macbook/600/600', order: 0 }],
  //   location: { city: 'İstanbul', district: 'Beşiktaş' },
  //   userId: 'u2', viewCount: 567, favoriteCount: 41,
  //   createdAt: '2025-02-22T14:00:00Z', updatedAt: '2025-02-22T14:00:00Z',
  //   relevanceScore: 0.87,
  // },
  // {
  //   id: 'l5', title: 'Vintage Chesterfield Koltuk Takımı',
  //   description: '3+2+1 gerçek deri, cognac rengi. Restorasyon yapıldı. Sağlam, dekoratif.',
  //   price: 35000, priceType: 'negotiable', currency: 'TRY', condition: 'good', status: 'active',
  //   categorySlug: 'ev-yasam', subcategoryId: '5-1',
  //   images: [{ id: 'i8', uri: 'https://picsum.photos/seed/koltuk/600/600', order: 0 }],
  //   location: { city: 'İstanbul', district: 'Üsküdar' },
  //   userId: 'u1', viewCount: 203, favoriteCount: 19,
  //   createdAt: '2025-02-19T16:00:00Z', updatedAt: '2025-02-19T16:00:00Z',
  //   relevanceScore: 0.72,
  // },
];

export function sortListings(listings: Listing[], sortBy: string): Listing[] {
  return [...listings].sort((a, b) => {
    switch (sortBy) {
      case 'newest': return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      case 'oldest': return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      case 'price-asc': return a.price - b.price;
      case 'price-desc': return b.price - a.price;
      case 'most-viewed': return b.viewCount - a.viewCount;
      case 'relevance':
      default: return (b.relevanceScore ?? 0) - (a.relevanceScore ?? 0);
    }
  });
}
