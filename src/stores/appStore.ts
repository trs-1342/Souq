import { create } from 'zustand';
import { Listing, SearchFilters, User } from '../types';
import { MOCK_LISTINGS, sortListings } from '../utils/mockData';

export interface UserRating {
  fromUserId: string;
  toUserId: string;
  score: number; // 1-5
  comment: string;
  createdAt: string;
}

interface AppState {
  // ── Auth ──
  currentUser: User | null;
  isAuthenticated: boolean;
  allUsers: (User & { password: string })[];
  login: (email: string, password: string) => { success: boolean; error?: string };
  register: (name: string, email: string, password: string) => { success: boolean; error?: string };
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
  getUserById: (id: string) => User | undefined;

  // ── Listings ──
  listings: Listing[];
  addListing: (listing: Listing) => void;
  updateListing: (id: string, updates: Partial<Listing>) => void;
  deleteListing: (id: string) => void;

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

  // ── User Ratings ──
  ratings: UserRating[];
  addRating: (toUserId: string, score: number, comment: string) => void;
  getUserRatings: (userId: string) => UserRating[];
  getUserAverageRating: (userId: string) => number;
  hasRated: (toUserId: string) => boolean;

  // ── Blocked Users ──
  blockedUsers: string[];
  blockUser: (userId: string) => void;
  unblockUser: (userId: string) => void;
  isBlocked: (userId: string) => boolean;

  isLoading: boolean;
  setLoading: (v: boolean) => void;
}

function generateUsername(name: string, existingUsernames: string[]): string {
  const base = name.toLowerCase()
    .replace(/ğ/g, 'g').replace(/ü/g, 'u').replace(/ş/g, 's')
    .replace(/ı/g, 'i').replace(/ö/g, 'o').replace(/ç/g, 'c')
    .replace(/[^a-z0-9]/g, '').slice(0, 16);
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
    phone: '+90 532 111 2233', isVerified: true, rating: 4.8, reviewCount: 47, listingCount: 12,
    createdAt: '2023-03-15T10:00:00Z',
  },
  {
    id: 'u2', name: 'Selin Kaya', username: 'selinkaya', email: 'selin@souq.com', password: '123456',
    isVerified: false, rating: 4.2, reviewCount: 8, listingCount: 3,
    createdAt: '2024-01-20T10:00:00Z',
  },
];

const defaultFilters: SearchFilters = { sortBy: 'newest' };

export const useAppStore = create<AppState>((set, get) => ({
  // ── Auth ──
  currentUser: null,
  isAuthenticated: false,
  allUsers: INITIAL_USERS,

  login: (email, password) => {
    const users = get().allUsers;
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);
    if (!user) return { success: false, error: 'E-posta veya şifre hatalı.' };
    const { password: _, ...safeUser } = user;
    set({ currentUser: safeUser, isAuthenticated: true });
    return { success: true };
  },

  register: (name, email, password) => {
    const users = get().allUsers;
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
    set(s => ({
      allUsers: [...s.allUsers, newUser],
      currentUser: { ...newUser, password: undefined } as any,
      isAuthenticated: true,
    }));
    return { success: true };
  },

  logout: () => set({ currentUser: null, isAuthenticated: false, favorites: [], blockedUsers: [] }),

  updateUser: (updates) => set(s => ({
    currentUser: s.currentUser ? { ...s.currentUser, ...updates } : null,
    allUsers: s.allUsers.map(u => u.id === s.currentUser?.id ? { ...u, ...updates } : u),
  })),

  getUserById: (id) => {
    const user = get().allUsers.find(u => u.id === id);
    if (!user) return undefined;
    const { password: _, ...safe } = user as any;
    return safe;
  },

  // ── Listings ──
  listings: MOCK_LISTINGS,

  addListing: (listing) => set(s => ({
    listings: [listing, ...s.listings],
    currentUser: s.currentUser ? { ...s.currentUser, listingCount: (s.currentUser.listingCount ?? 0) + 1 } : null,
  })),

  updateListing: (id, updates) => set(s => ({
    listings: s.listings.map(l => l.id === id ? { ...l, ...updates, updatedAt: new Date().toISOString() } : l),
  })),

  deleteListing: (id) => set(s => ({
    listings: s.listings.filter(l => l.id !== id),
    currentUser: s.currentUser ? { ...s.currentUser, listingCount: Math.max(0, (s.currentUser.listingCount ?? 1) - 1) } : null,
  })),

  // ── Favorites ──
  favorites: [],
  toggleFavorite: (id) => set(s => ({
    favorites: s.favorites.includes(id) ? s.favorites.filter(f => f !== id) : [...s.favorites, id],
  })),
  isFavorite: (id) => get().favorites.includes(id),
  getFavoriteListings: () => {
    const { listings, favorites } = get();
    return listings.filter(l => favorites.includes(l.id) && l.status !== 'archived');
  },

  // ── Filters ──
  filters: defaultFilters,
  setFilters: (partial) => set(s => ({ filters: { ...s.filters, ...partial } })),
  resetFilters: () => set({ filters: defaultFilters }),
  getFilteredListings: () => {
    const { listings, filters } = get();
    let result = listings.filter(l => l.status === 'active');
    if (filters.query) {
      const q = filters.query.toLowerCase();
      result = result.filter(l => l.title.toLowerCase().includes(q) || l.description.toLowerCase().includes(q));
    }
    if (filters.categorySlug) result = result.filter(l => l.categorySlug === filters.categorySlug);
    if (filters.minPrice !== undefined) result = result.filter(l => l.price >= filters.minPrice!);
    if (filters.maxPrice !== undefined) result = result.filter(l => l.price <= filters.maxPrice!);
    if (filters.condition?.length) result = result.filter(l => filters.condition!.includes(l.condition));
    if (filters.city) result = result.filter(l => l.location.city.toLowerCase() === filters.city!.toLowerCase());
    return sortListings(result, filters.sortBy);
  },

  // ── Ratings ──
  ratings: [],
  addRating: (toUserId, score, comment) => {
    const { currentUser, ratings } = get();
    if (!currentUser) return;
    const newRating: UserRating = {
      fromUserId: currentUser.id, toUserId, score, comment,
      createdAt: new Date().toISOString(),
    };
    const updatedRatings = [...ratings.filter(r => !(r.fromUserId === currentUser.id && r.toUserId === toUserId)), newRating];
    const userRatings = updatedRatings.filter(r => r.toUserId === toUserId);
    const avg = userRatings.reduce((s, r) => s + r.score, 0) / userRatings.length;
    set(s => ({
      ratings: updatedRatings,
      allUsers: s.allUsers.map(u => u.id === toUserId ? { ...u, rating: Math.round(avg * 10) / 10, reviewCount: userRatings.length } : u),
    }));
  },
  getUserRatings: (userId) => get().ratings.filter(r => r.toUserId === userId),
  getUserAverageRating: (userId) => {
    const r = get().ratings.filter(r => r.toUserId === userId);
    return r.length ? r.reduce((s, x) => s + x.score, 0) / r.length : 0;
  },
  hasRated: (toUserId) => {
    const { currentUser, ratings } = get();
    return !!currentUser && ratings.some(r => r.fromUserId === currentUser.id && r.toUserId === toUserId);
  },

  // ── Blocked ──
  blockedUsers: [],
  blockUser: (userId) => set(s => ({ blockedUsers: [...s.blockedUsers.filter(id => id !== userId), userId] })),
  unblockUser: (userId) => set(s => ({ blockedUsers: s.blockedUsers.filter(id => id !== userId) })),
  isBlocked: (userId) => get().blockedUsers.includes(userId),

  isLoading: false,
  setLoading: (v) => set({ isLoading: v }),
}));
