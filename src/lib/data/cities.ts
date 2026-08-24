export const MOROCCO_CITIES = [
  'Casablanca', 'Rabat', 'Marrakech', 'Fès', 'Tanger', 'Agadir', 'Meknès',
  'Oujda', 'Kénitra', 'Tétouan', 'Safi', 'El Jadida', 'Beni Mellal', 'Nador',
  'Taza', 'Settat', 'Berrechid', 'Khouribga', 'Mohammedia', 'Essaouira',
  'Ouarzazate', 'Dakhla', 'Laâyoune', 'Errachidia', 'Al Hoceima', 'Larache',
  'Ksar El Kebir', 'Guercif', 'Tiznit', 'Tan-Tan', 'Sidi Kacem', 'Sidi Slimane',
];

export function isValidCity(city: string): boolean {
  return MOROCCO_CITIES.includes(city);
}
