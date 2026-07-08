// Eurostar station data with coordinates for map display
// Coordinates are approximate center points for each station

export interface StationWithCoords {
  uic: string;
  shortCode: string;
  name: string;
  lat: number;
  lng: number;
  country: string;
}

export const EUROSTAR_STATIONS: StationWithCoords[] = [
  // UK
  { uic: "7015400", shortCode: "GBSPX", name: "London St Pancras", lat: 51.5317, lng: -0.1262, country: "GB" },
  { uic: "7015440", shortCode: "GBEBB", name: "Ebbsfleet International", lat: 51.4431, lng: 0.3209, country: "GB" },
  { uic: "7015480", shortCode: "GBASH", name: "Ashford International", lat: 51.1437, lng: 0.8768, country: "GB" },

  // France
  { uic: "8727100", shortCode: "FRPNO", name: "Paris Gare du Nord", lat: 48.8809, lng: 2.3553, country: "FR" },
  { uic: "8718206", shortCode: "FRLIL", name: "Lille Europe", lat: 50.6389, lng: 3.0757, country: "FR" },
  { uic: "8718201", shortCode: "FRCFK", name: "Calais-Fréthun", lat: 50.9215, lng: 1.8103, country: "FR" },
  { uic: "8739370", shortCode: "FRDJU", name: "Paris Massy", lat: 48.7253, lng: 2.2613, country: "FR" },
  { uic: "8739100", shortCode: "FRPMO", name: "Paris Montparnasse", lat: 48.8414, lng: 2.3190, country: "FR" },
  { uic: "8772319", shortCode: "FRLPD", name: "Lyon Part-Dieu", lat: 45.7606, lng: 4.8600, country: "FR" },
  { uic: "8776290", shortCode: "FRJDQ", name: "Lyon St Exupery TGV", lat: 45.7197, lng: 5.0775, country: "FR" },
  { uic: "8775800", shortCode: "FRAVJ", name: "Avignon TGV", lat: 43.9217, lng: 4.7863, country: "FR" },
  { uic: "8775625", shortCode: "FRMAR", name: "Marseille St Charles", lat: 43.3026, lng: 5.3803, country: "FR" },
  { uic: "8717192", shortCode: "FREAH", name: "Champagne-Ardenne TGV", lat: 49.2114, lng: 3.9912, country: "FR" },
  { uic: "8717100", shortCode: "FRRHE", name: "Reims Station", lat: 49.2580, lng: 3.9919, country: "FR" },

  // Belgium
  { uic: "8800004", shortCode: "BEBRM", name: "Brussels-Midi/Zuid", lat: 50.8356, lng: 4.3362, country: "BE" },

  // Netherlands
  { uic: "8400058", shortCode: "NLAMS", name: "Amsterdam Centraal", lat: 52.3791, lng: 4.9003, country: "NL" },
  { uic: "8400530", shortCode: "NLRTD", name: "Rotterdam Centraal", lat: 51.9244, lng: 4.4699, country: "NL" },

  // Germany
  { uic: "8000085", shortCode: "DEKCN", name: "Köln Hbf", lat: 50.9433, lng: 6.9586, country: "DE" },
  { uic: "8010316", shortCode: "DEDUI", name: "Duisburg", lat: 51.4316, lng: 6.7742, country: "DE" },
  { uic: "8008094", shortCode: "DEBEC", name: "Duesseldorf Hbf", lat: 51.2199, lng: 6.7936, country: "DE" },
  { uic: "8000152", shortCode: "DEESS", name: "Essen Hbf", lat: 51.4513, lng: 7.0141, country: "DE" },
  { uic: "8000098", shortCode: "DEDTM", name: "Dortmund Hbf", lat: 51.5173, lng: 7.4593, country: "DE" },
];

export function getStationByUic(uic: string): StationWithCoords | undefined {
  return EUROSTAR_STATIONS.find((s) => s.uic === uic);
}

export function getStationsByCountry(country: string): StationWithCoords[] {
  return EUROSTAR_STATIONS.filter((s) => s.country === country);
}
