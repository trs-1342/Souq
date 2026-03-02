export interface City {
  name: string;
  districts: string[];
}

export const CITIES: City[] = [
  { name: 'Adana', districts: ['Seyhan', 'Çukurova', 'Sarıçam', 'Yüreğir', 'Ceyhan', 'Kozan'] },
  { name: 'Ankara', districts: ['Çankaya', 'Keçiören', 'Mamak', 'Yenimahalle', 'Altındağ', 'Etimesgut', 'Sincan', 'Pursaklar', 'Gölbaşı', 'Polatlı'] },
  { name: 'Antalya', districts: ['Muratpaşa', 'Konyaaltı', 'Kepez', 'Aksu', 'Döşemealtı', 'Alanya', 'Manavgat', 'Serik', 'Kaş', 'Kemer'] },
  { name: 'Bursa', districts: ['Osmangazi', 'Nilüfer', 'Yıldırım', 'Gemlik', 'İnegöl', 'Mudanya', 'Mustafakemalpaşa'] },
  { name: 'Diyarbakır', districts: ['Bağlar', 'Kayapınar', 'Sur', 'Yenişehir', 'Ergani', 'Bismil'] },
  { name: 'Eskişehir', districts: ['Odunpazarı', 'Tepebaşı', 'Sivrihisar'] },
  { name: 'Gaziantep', districts: ['Şahinbey', 'Şehitkamil', 'Nizip', 'İslahiye', 'Nurdağı'] },
  { name: 'İstanbul', districts: ['Adalar', 'Arnavutköy', 'Ataşehir', 'Avcılar', 'Bağcılar', 'Bahçelievler', 'Bakırköy', 'Başakşehir', 'Bayrampaşa', 'Beşiktaş', 'Beykoz', 'Beylikdüzü', 'Beyoğlu', 'Büyükçekmece', 'Çatalca', 'Çekmeköy', 'Esenler', 'Esenyurt', 'Eyüpsultan', 'Fatih', 'Gaziosmanpaşa', 'Güngören', 'Kadıköy', 'Kağıthane', 'Kartal', 'Küçükçekmece', 'Maltepe', 'Pendik', 'Sancaktepe', 'Sarıyer', 'Silivri', 'Sultanbeyli', 'Sultangazi', 'Şile', 'Şişli', 'Tuzla', 'Ümraniye', 'Üsküdar', 'Zeytinburnu'] },
  { name: 'İzmir', districts: ['Aliağa', 'Balçova', 'Bayındır', 'Bayraklı', 'Bergama', 'Bornova', 'Buca', 'Çeşme', 'Çiğli', 'Foça', 'Gaziemir', 'Güzelbahçe', 'Karabağlar', 'Karaburun', 'Karşıyaka', 'Kemalpaşa', 'Kınık', 'Kiraz', 'Konak', 'Menderes', 'Menemen', 'Narlıdere', 'Ödemiş', 'Selçuk', 'Tire', 'Torbalı', 'Urla'] },
  { name: 'Kayseri', districts: ['Kocasinan', 'Melikgazi', 'Talas', 'Develi', 'İncesu'] },
  { name: 'Kocaeli', districts: ['İzmit', 'Gebze', 'Darıca', 'Körfez', 'Derince', 'Gölcük', 'Başiskele', 'Çayırova', 'Dilovası', 'Kandıra', 'Karamürsel', 'Kartepe'] },
  { name: 'Konya', districts: ['Selçuklu', 'Karatay', 'Meram', 'Ereğli', 'Akşehir', 'Beyşehir'] },
  { name: 'Malatya', districts: ['Battalgazi', 'Yeşilyurt', 'Akçadağ', 'Darende'] },
  { name: 'Mersin', districts: ['Akdeniz', 'Mezitli', 'Toroslar', 'Yenişehir', 'Tarsus', 'Erdemli', 'Silifke', 'Anamur'] },
  { name: 'Muğla', districts: ['Bodrum', 'Dalaman', 'Datça', 'Fethiye', 'Köyceğiz', 'Marmaris', 'Menteşe', 'Milas', 'Ortaca', 'Seydikemer', 'Ula', 'Yatağan'] },
  { name: 'Sakarya', districts: ['Adapazarı', 'Arifiye', 'Erenler', 'Serdivan', 'Hendek', 'Karasu'] },
  { name: 'Samsun', districts: ['Atakum', 'Canik', 'İlkadım', 'Tekkeköy', 'Bafra', 'Çarşamba', 'Terme'] },
  { name: 'Trabzon', districts: ['Ortahisar', 'Akçaabat', 'Araklı', 'Of', 'Vakfıkebir', 'Yomra'] },
];

export const CITY_NAMES = CITIES.map(c => c.name);

export const getDistricts = (cityName: string): string[] => {
  return CITIES.find(c => c.name === cityName)?.districts ?? [];
};

export const searchCities = (query: string): string[] => {
  if (!query) return CITY_NAMES;
  const q = query.toLowerCase();
  return CITY_NAMES.filter(c => c.toLowerCase().includes(q));
};

export const searchDistricts = (cityName: string, query: string): string[] => {
  const districts = getDistricts(cityName);
  if (!query) return districts;
  const q = query.toLowerCase();
  return districts.filter(d => d.toLowerCase().includes(q));
};
