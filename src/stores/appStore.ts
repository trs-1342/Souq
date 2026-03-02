import { create } from 'zustand';
import { Listing, SearchFilters, User } from '../types';
import { MOCK_LISTINGS, sortListings } from '../utils/mockData';

interface AppState {
  // ── Auth ──
  currentUser: User | null;
  isAuthenticated: boolean;
  allUsers: User[];
  login: (email: string, password: string) => { success: boolean; error?: string };
  register: (name: string, email: string, password: string) => { success: boolean; error?: string };
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;

  // ── Listings ──
  listings: Listing[];
  addListing: (listing: Listing) => void;

  // ── Favorites ──
  favorites: string[];
  toggleFavorite: (id: string) => void;
  isFavorite: (id: string) => boolean;
  getFavoriteListings: () => Listing[];

  // ── Filters ──
  filters: SearchFilters;
  setFilters: (f: Partial<SearchFilters>) => void;
  resetFilters: () => void;
  getFilteredListings: () => Listing[];

  // ── Draft ──
  draftListing: Partial<Listing> | null;
  setDraft: (d: Partial<Listing> | null) => void;

  isLoading: boolean;
  setLoading: (v: boolean) => void;
}

// Username üretici
function generateUsername(name: string, existingUsernames: string[]): string {
  const base = name
    .toLowerCase()
    .replace(/ğ/g, 'g').replace(/ü/g, 'u').replace(/ş/g, 's')
    .replace(/ı/g, 'i').replace(/ö/g, 'o').replace(/ç/g, 'c')
    .replace(/[^a-z0-9]/g, '')
    .slice(0, 16);
  let username = base;
  let attempt = 0;
  while (existingUsernames.includes(username)) {
    attempt++;
    username = `${base}${Math.floor(10 + Math.random() * 90)}`;
    if (attempt > 20) username = `${base}${Date.now().toString().slice(-4)}`;
  }
  return username;
}

const INITIAL_USERS: (User & { password: string })[] = [
  {
    id: 'u1', name: 'Ahmet Yılmaz', username: 'ahmetyilmaz', email: 'ahmet@souq.com', password: '123456',
    phone: '+90 532 111 2233', isVerified: true, rating: 4.8,
    reviewCount: 47, listingCount: 12, createdAt: '2023-03-15T10:00:00Z',
  },
];

const defaultFilters: SearchFilters = { sortBy: 'newest' };

export const useAppStore = create<AppState>((set, get) => ({
  // ── Auth ──
  currentUser: null,
  isAuthenticated: false,
  allUsers: INITIAL_USERS,

  login: (email, password) => {
    const users = get().allUsers as (User & { password: string })[];
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);
    if (!user) return { success: false, error: 'E-posta veya şifre hatalı.' };
    const { password: _, ...safeUser } = user;
    set({ currentUser: safeUser, isAuthenticated: true });
    return { success: true };
  },

  register: (name, email, password) => {
    const users = get().allUsers as (User & { password: string })[];
    if (users.find(u => u.email.toLowerCase() === email.toLowerCase())) {
      return { success: false, error: 'Bu e-posta zaten kayıtlı.' };
    }
    const existingUsernames = users.map(u => u.username ?? '').filter(Boolean);
    const username = generateUsername(name, existingUsernames);
    const newUser: User & { password: string } = {
      id: `u_${Date.now()}`, name, username, email, password,
      isVerified: false, rating: 0, reviewCount: 0, listingCount: 0,
      createdAt: new Date().toISOString(),
    };
    set((s) => ({
      allUsers: [...(s.allUsers as any[]), newUser],
      currentUser: { ...newUser, password: undefined } as any,
      isAuthenticated: true,
    }));
    return { success: true };
  },

  logout: () => set({ currentUser: null, isAuthenticated: false, favorites: [] }),

  updateUser: (updates) => set((s) => ({
    currentUser: s.currentUser ? { ...s.currentUser, ...updates } : null,
  })),

  // ── Listings ──
  listings: MOCK_LISTINGS,
  addListing: (listing) => set((s) => ({ listings: [listing, ...s.listings] })),

  // ── Favorites ──
  favorites: [],
  toggleFavorite: (id) => set((s) => ({
    favorites: s.favorites.includes(id)
      ? s.favorites.filter(f => f !== id)
      : [...s.favorites, id],
  })),
  isFavorite: (id) => get().favorites.includes(id),
  getFavoriteListings: () => {
    const { listings, favorites } = get();
    return listings.filter(l => favorites.includes(l.id));
  },

  // ── Filters ──
  filters: defaultFilters,
  setFilters: (partial) => set((s) => ({ filters: { ...s.filters, ...partial } })),
  resetFilters: () => set({ filters: defaultFilters }),
  getFilteredListings: () => {
    const { listings, filters } = get();
    let result = [...listings];
    if (filters.query) {
      const q = filters.query.toLowerCase();
      result = result.filter(l =>
        l.title.toLowerCase().includes(q) ||
        l.description.toLowerCase().includes(q) ||
        l.tags?.some(t => t.toLowerCase().includes(q))
      );
    }
    if (filters.categorySlug) result = result.filter(l => l.categorySlug === filters.categorySlug);
    if (filters.minPrice !== undefined) result = result.filter(l => l.price >= filters.minPrice!);
    if (filters.maxPrice !== undefined) result = result.filter(l => l.price <= filters.maxPrice!);
    if (filters.condition?.length) result = result.filter(l => filters.condition!.includes(l.condition));
    if (filters.city) result = result.filter(l => l.location.city.toLowerCase() === filters.city!.toLowerCase());
    return sortListings(result, filters.sortBy);
  },

  // ── Draft ──
  draftListing: null,
  setDraft: (d) => set({ draftListing: d }),

  isLoading: false,
  setLoading: (v) => set({ isLoading: v }),
}));
