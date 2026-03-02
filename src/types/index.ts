export type CategorySlug = 'emlak' | 'vasita' | 'ikinci-el' | 'elektronik' | 'ev-yasam' | 'giyim' | 'spor' | 'hizmetler' | 'diger';
export type ListingCondition = 'new' | 'like-new' | 'good' | 'fair' | 'poor';
export type ListingStatus = 'active' | 'sold' | 'out-of-stock' | 'archived' | 'inactive';
export type PriceType = 'fixed' | 'negotiable' | 'free' | 'swap';

export interface ListingImage { id: string; uri: string; order: number; }
export interface Location { city: string; district: string; neighborhood?: string; lat?: number; lng?: number; }

// Kategori bazlı ek alanlar
export interface CategoryFields {
  // Emlak
  squareMeters?: number;
  roomCount?: string; // '1+0', '1+1', '2+1' vs.
  floorCount?: number;
  floor?: number;
  hasElevator?: boolean;
  hasParking?: boolean;
  buildingAge?: number;
  heatingType?: string;
  // Vasıta
  brand?: string;
  vehicleModel?: string;
  year?: number;
  mileage?: number;
  fuelType?: string;
  gearType?: string;
  bodyType?: string;
  engineSize?: string;
  // Elektronik / Genel
  storageCapacity?: string;
  color?: string;
  warrantyStatus?: string;
  // Giyim
  size?: string;
  gender?: string;
  // Spor
  sportType?: string;
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
  createdAt: string;
  updatedAt: string;
  tags?: string[];
  relevanceScore?: number;
  categoryFields?: CategoryFields;
}

export interface Category {
  id: string; slug: CategorySlug; label: string;
  icon: string; iconFamily: string; color: string;
  subcategories?: SubCategory[];
}
export interface SubCategory { id: string; label: string; parentSlug: CategorySlug; }

export interface User {
  id: string; name: string; username?: string; email: string;
  phone?: string; avatarUri?: string; bio?: string;
  location?: Location; isVerified: boolean;
  rating: number; reviewCount: number; listingCount: number;
  createdAt: string; isPro?: boolean;
}

export interface Message { id: string; conversationId: string; senderId: string; text?: string; imageUri?: string; createdAt: string; isRead: boolean; }
export interface Conversation { id: string; listingId: string; listing?: Pick<Listing, 'id' | 'title' | 'images' | 'price'>; participants: string[]; lastMessage?: Message; updatedAt: string; unreadCount: number; }

export type SortOption = 'newest' | 'oldest' | 'price-asc' | 'price-desc' | 'most-viewed' | 'relevance';
export interface SearchFilters {
  query?: string; categorySlug?: CategorySlug; subcategoryId?: string;
  minPrice?: number; maxPrice?: number; condition?: ListingCondition[];
  priceType?: PriceType[]; city?: string; district?: string; sortBy: SortOption;
}
