// ─── İlan Kategorileri ───────────────────────────────────────────────────────
export type CategorySlug =
  | 'emlak'
  | 'vasita'
  | 'ikinci-el'
  | 'elektronik'
  | 'ev-yasam'
  | 'giyim'
  | 'spor'
  | 'hizmetler'
  | 'diger';

export interface Category {
  id: string;
  slug: CategorySlug;
  label: string;
  icon: string;         // @expo/vector-icons icon adı
  iconFamily: string;   // 'Ionicons' | 'MaterialIcons' vb.
  color: string;
  subcategories?: SubCategory[];
}

export interface SubCategory {
  id: string;
  label: string;
  parentSlug: CategorySlug;
}

// ─── İlan ────────────────────────────────────────────────────────────────────
export type ListingCondition = 'new' | 'like-new' | 'good' | 'fair' | 'poor';
export type ListingStatus = 'active' | 'sold' | 'pending' | 'inactive';
export type PriceType = 'fixed' | 'negotiable' | 'free' | 'swap';

export interface ListingImage {
  id: string;
  uri: string;
  order: number;
}

export interface Location {
  city: string;
  district: string;
  neighborhood?: string;
  lat?: number;
  lng?: number;
}

export interface Listing {
  id: string;
  title: string;
  description: string;
  price: number;
  priceType: PriceType;
  currency: 'TRY' | 'USD' | 'EUR';
  condition: ListingCondition;
  status: ListingStatus;
  categorySlug: CategorySlug;
  subcategoryId?: string;
  images: ListingImage[];
  location: Location;
  userId: string;
  viewCount: number;
  favoriteCount: number;
  createdAt: string;  // ISO string
  updatedAt: string;
  tags?: string[];
  // Algoritma skoru — sıralama için
  relevanceScore?: number;
}

// ─── Kullanıcı ────────────────────────────────────────────────────────────────
export interface User {
  id: string;
  name: string;
  username?: string;
  email: string;
  phone?: string;
  avatarUri?: string;
  bio?: string;
  location?: Location;
  isVerified: boolean;
  rating: number;
  reviewCount: number;
  listingCount: number;
  createdAt: string;
  isPro?: boolean;
}

// ─── Mesaj ────────────────────────────────────────────────────────────────────
export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  text?: string;
  imageUri?: string;
  createdAt: string;
  isRead: boolean;
}

export interface Conversation {
  id: string;
  listingId: string;
  listing?: Pick<Listing, 'id' | 'title' | 'images' | 'price'>;
  participants: string[];
  lastMessage?: Message;
  updatedAt: string;
  unreadCount: number;
}

// ─── Filtre & Arama ───────────────────────────────────────────────────────────
export type SortOption = 'newest' | 'oldest' | 'price-asc' | 'price-desc' | 'most-viewed' | 'relevance';

export interface SearchFilters {
  query?: string;
  categorySlug?: CategorySlug;
  subcategoryId?: string;
  minPrice?: number;
  maxPrice?: number;
  condition?: ListingCondition[];
  priceType?: PriceType[];
  city?: string;
  district?: string;
  sortBy: SortOption;
}

// ─── Navigation ───────────────────────────────────────────────────────────────
export type RootStackParamList = {
  '(tabs)': undefined;
  '(auth)/login': undefined;
  '(auth)/register': undefined;
  'listing/[id]': { id: string };
  'listing/create': undefined;
  'listing/edit': { id: string };
  'profile/[id]': { id: string };
  'search': { filters?: Partial<SearchFilters> };
};
