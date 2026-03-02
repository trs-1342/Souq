import { Category } from '../types';

export const CATEGORIES: Category[] = [
  { id: '1', slug: 'emlak', label: 'Emlak', icon: 'home', iconFamily: 'Ionicons', color: '#4A9EFF',
    subcategories: [
      { id: '1-1', label: 'Satılık Daire', parentSlug: 'emlak' },
      { id: '1-2', label: 'Kiralık Daire', parentSlug: 'emlak' },
      { id: '1-3', label: 'Satılık Villa', parentSlug: 'emlak' },
      { id: '1-4', label: 'Satılık Arsa', parentSlug: 'emlak' },
      { id: '1-5', label: 'İşyeri / Ofis', parentSlug: 'emlak' },
    ],
  },
  { id: '2', slug: 'vasita', label: 'Vasıta', icon: 'car', iconFamily: 'Ionicons', color: '#FF9F43',
    subcategories: [
      { id: '2-1', label: 'Otomobil', parentSlug: 'vasita' },
      { id: '2-2', label: 'Motosiklet', parentSlug: 'vasita' },
      { id: '2-3', label: 'Kamyonet', parentSlug: 'vasita' },
      { id: '2-4', label: 'Tekne', parentSlug: 'vasita' },
    ],
  },
  { id: '3', slug: 'elektronik', label: 'Elektronik', icon: 'phone-portrait', iconFamily: 'Ionicons', color: '#2ED573',
    subcategories: [
      { id: '3-1', label: 'Telefon', parentSlug: 'elektronik' },
      { id: '3-2', label: 'Bilgisayar', parentSlug: 'elektronik' },
      { id: '3-3', label: 'Tablet', parentSlug: 'elektronik' },
      { id: '3-4', label: 'Beyaz Eşya', parentSlug: 'elektronik' },
      { id: '3-5', label: 'TV & Ses', parentSlug: 'elektronik' },
    ],
  },
  { id: '4', slug: 'ikinci-el', label: 'İkinci El', icon: 'swap-horizontal', iconFamily: 'Ionicons', color: '#A29BFE',
    subcategories: [
      { id: '4-1', label: 'Kitap & Hobi', parentSlug: 'ikinci-el' },
      { id: '4-2', label: 'Oyun & Konsol', parentSlug: 'ikinci-el' },
      { id: '4-3', label: 'Koleksiyon', parentSlug: 'ikinci-el' },
    ],
  },
  { id: '5', slug: 'ev-yasam', label: 'Ev & Yaşam', icon: 'bed', iconFamily: 'Ionicons', color: '#FD79A8',
    subcategories: [
      { id: '5-1', label: 'Mobilya', parentSlug: 'ev-yasam' },
      { id: '5-2', label: 'Dekorasyon', parentSlug: 'ev-yasam' },
      { id: '5-3', label: 'Mutfak', parentSlug: 'ev-yasam' },
    ],
  },
  { id: '6', slug: 'giyim', label: 'Giyim', icon: 'shirt', iconFamily: 'Ionicons', color: '#FDCB6E' },
  { id: '7', slug: 'spor', label: 'Spor', icon: 'fitness', iconFamily: 'Ionicons', color: '#55EFC4' },
  { id: '8', slug: 'hizmetler', label: 'Hizmetler', icon: 'briefcase', iconFamily: 'Ionicons', color: '#74B9FF' },
  { id: '9', slug: 'diger', label: 'Diğer', icon: 'grid', iconFamily: 'Ionicons', color: '#636E72' },
];

export const getCategoryBySlug = (slug: string) => CATEGORIES.find(c => c.slug === slug);
