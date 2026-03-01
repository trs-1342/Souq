# Souq

Modern bir ikinci el & ilan uygulaması. Bilinen uygulamaların alternatifi, daha akıllı algoritmalar ve modern tasarımla.

## 🚀 Kurulum

```bash
# Bağımlılıkları yükle
npm install

# Geliştirme sunucusunu başlat
npx expo start

# Android emülatörde aç
npx expo start --android

# iOS simülatörde aç
npx expo start --ios
```

## 📁 Proje Yapısı

```
pazaryeri/
├── app/                        # Expo Router sayfaları
│   ├── _layout.tsx             # Root layout (Stack Navigator)
│   ├── (tabs)/                 # Tab navigation
│   │   ├── _layout.tsx         # Tab bar yapılandırması
│   │   ├── index.tsx           # Anasayfa
│   │   ├── search.tsx          # Arama
│   │   ├── post.tsx            # İlan Ver (6 adımlı form)
│   │   ├── messages.tsx        # Mesajlar
│   │   └── profile.tsx         # Profil & Ayarlar
│   ├── (auth)/                 # Auth sayfaları (yakında)
│   └── listing/                # İlan detay (yakında)
│
└── src/
    ├── constants/
    │   ├── theme.ts            # Renkler, tipografi, spacing
    │   └── categories.ts       # Kategori tanımlamaları
    ├── types/
    │   └── index.ts            # TypeScript tipleri
    ├── stores/
    │   └── appStore.ts         # Zustand global state
    ├── utils/
    │   ├── mockData.ts         # Local geliştirme verisi
    │   └── format.ts           # Fiyat, tarih formatları
    └── components/
        ├── listing/
        │   └── ListingCard.tsx  # İlan kartı komponenti
        └── common/
            ├── SearchBar.tsx    # Arama çubuğu
            └── CategoryPills.tsx # Kategori seçici
```

## 🎨 Tasarım Sistemi

- **Tema**: Koyu (Dark Mode varsayıla)
- **Ana Renk**: `#FF4757` (Canlı kırmızı)
- **Başarı**: `#2ED573` (Yeşil — fiyat, onay)
- **Arka Plan**: `#0A0A0F` (Derin koyu)
- **Tipografi**: System font → `Syne` (display) + `DM Sans` (body) eklenecek

## 📦 Kullanılan Kütüphaneler

| Kütüphane | Amaç |
|---|---|
| `expo-router` | File-based routing |
| `zustand` | Global state management |
| `@expo/vector-icons` | İkon seti (Ionicons) |
| `expo-image-picker` | Fotoğraf seçme |
| `expo-location` | Konum erişimi |
| `react-native-reanimated` | Animasyonlar |
| `react-native-safe-area-context` | Safe area |
