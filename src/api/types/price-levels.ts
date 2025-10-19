export type Target = {
  id: string;
};

export type PriceLevelsSearch = {
  name?: string | null;
  nextPageToken?: string | null;
  targets?: Target[];
};

export const PricingStrategy = {
  DEFAULT: 'DEFAULT',
  MENU_SPECIFIC_PRICE: 'MENU_SPECIFIC_PRICE',
  TIME_SPECIFIC_PRICE: 'TIME_SPECIFIC_PRICE',
  OPEN_PRICE: 'OPEN_PRICE',
  SIZE_PRICE: 'SIZE_PRICE',
} as const;
type PricingStrategy = (typeof PricingStrategy)[keyof typeof PricingStrategy];

export type PriceLevelVersion = {
  basePrice: string;
  maxPrice: string;
  minPrice: string;
  multiLocationId: string;
  name: string;
  owner: Target[];
  pricingStrategy: PricingStrategy;
  target: Target;
  versionId: string;
};

export type PriceLevelSearchResults = {
  data: PriceLevelVersion[];
  nextPageToken: string;
};

export type PriceLevelUpdate = {
  basePrice: string;
};
