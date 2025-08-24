import { GetAllProductsParams } from '@/lib/actions/product';
import { ReadonlyURLSearchParams } from 'next/navigation';
import queryString from 'query-string';

export interface FilterState {
  search?: string;
  category?: string[];
  brand?: string[];
  gender?: string[];
  color?: string[];
  size?: string[];
  priceRange?: string | null;
  sort?: string;
  page?: string;
}

export interface ParsedFilters {
  search?: string;
  category: string[];
  brand: string[];
  gender: string[];
  color: string[];
  size: string[];
  priceRange: string | null;
  sort: string;
  page: number;
}

/**
 * Parse URL search params into filter state
 */
export function parseFilters(searchParams: ReadonlyURLSearchParams | URLSearchParams): ParsedFilters {
  const params = Object.fromEntries(searchParams.entries());
  
  return {
    search: params.search || undefined,
    category: Array.isArray(params.category) ? params.category : params.category ? [params.category] : [],
    brand: Array.isArray(params.brand) ? params.brand : params.brand ? [params.brand] : [],
    gender: Array.isArray(params.gender) ? params.gender : params.gender ? [params.gender] : [],
    color: Array.isArray(params.color) ? params.color : params.color ? [params.color] : [],
    size: Array.isArray(params.size) ? params.size : params.size ? [params.size] : [],
    priceRange: params.priceRange || null,
    sort: params.sort || 'latest',
    page: parseInt(params.page || '1', 10),
  };
}

/**
 * Parse filter parameters into getAllProducts params
 */
export function parseFilterParams(searchParams: ReadonlyURLSearchParams | URLSearchParams): GetAllProductsParams {
  const filters = parseFilters(searchParams);
  const priceRange = parsePriceRange(filters.priceRange);
  
  return {
    search: filters.search,
    categoryIds: filters.category.length > 0 ? filters.category : undefined,
    brandIds: filters.brand.length > 0 ? filters.brand : undefined,
    genderIds: filters.gender.length > 0 ? filters.gender : undefined,
    colorIds: filters.color.length > 0 ? filters.color : undefined,
    sizeIds: filters.size.length > 0 ? filters.size : undefined,
    priceMin: priceRange?.min,
    priceMax: priceRange?.max,
    sortBy: mapSortParam(filters.sort),
    page: filters.page,
    limit: 20, // Default limit
  };
}

/**
 * Map sort parameter to valid sort values
 */
function mapSortParam(sort: string): GetAllProductsParams['sortBy'] {
  switch (sort) {
    case 'price_low':
    case 'price_asc':
      return 'price_asc';
    case 'price_high':
    case 'price_desc':
      return 'price_desc';
    case 'newest':
    case 'latest':
      return 'latest';
    case 'oldest':
      return 'oldest';
    case 'name_asc':
    case 'alphabetical':
      return 'name_asc';
    case 'name_desc':
      return 'name_desc';
    default:
      return 'latest';
  }
}

/**
 * Convert filter state to URL search string
 */
export function stringifyFilters(filters: Partial<FilterState>): string {
  // Remove empty arrays and null/undefined values
  const cleanFilters = Object.entries(filters).reduce((acc, [key, value]) => {
    if (Array.isArray(value) && value.length > 0) {
      acc[key] = value;
    } else if (typeof value === 'string' && value.trim() !== '') {
      acc[key] = value;
    }
    return acc;
  }, {} as Record<string, string | string[]>);

  return queryString.stringify(cleanFilters, {
    arrayFormat: 'comma',
    skipEmptyString: true,
    skipNull: true,
  });
}

/**
 * Add a filter value to existing filters
 */
export function addFilter(
  currentFilters: ParsedFilters,
  filterType: keyof Pick<ParsedFilters, 'gender' | 'color' | 'size'>,
  value: string
): Partial<FilterState> {
  const newFilters = { ...currentFilters };
  
  if (!newFilters[filterType].includes(value)) {
    newFilters[filterType] = [...newFilters[filterType], value];
  }
  
  return {
    gender: newFilters.gender,
    color: newFilters.color,
    size: newFilters.size,
    priceRange: newFilters.priceRange,
    sort: newFilters.sort,
    page: '1', // Reset to first page when filtering
  };
}

/**
 * Remove a filter value from existing filters
 */
export function removeFilter(
  currentFilters: ParsedFilters,
  filterType: keyof Pick<ParsedFilters, 'gender' | 'color' | 'size'>,
  value: string
): Partial<FilterState> {
  const newFilters = { ...currentFilters };
  newFilters[filterType] = newFilters[filterType].filter(item => item !== value);
  
  return {
    gender: newFilters.gender,
    color: newFilters.color,
    size: newFilters.size,
    priceRange: newFilters.priceRange,
    sort: newFilters.sort,
    page: '1', // Reset to first page when filtering
  };
}

/**
 * Update sort and reset page
 */
export function updateSort(currentFilters: ParsedFilters, sort: string): Partial<FilterState> {
  return {
    gender: currentFilters.gender,
    color: currentFilters.color,
    size: currentFilters.size,
    priceRange: currentFilters.priceRange,
    sort,
    page: '1', // Reset to first page when sorting
  };
}

/**
 * Update price range filter
 */
export function updatePriceRange(currentFilters: ParsedFilters, priceRange: string | null): Partial<FilterState> {
  return {
    gender: currentFilters.gender,
    color: currentFilters.color,
    size: currentFilters.size,
    priceRange,
    sort: currentFilters.sort,
    page: '1', // Reset to first page when filtering
  };
}

/**
 * Clear all filters
 */
export function clearAllFilters(): Partial<FilterState> {
  return {
    sort: 'featured',
    page: '1',
  };
}

/**
 * Get price range bounds from string
 */
export function parsePriceRange(priceRange: string | null): { min: number; max: number } | null {
  if (!priceRange) return null;
  
  const [min, max] = priceRange.split('-').map(Number);
  if (isNaN(min) || isNaN(max)) return null;
  
  return { min, max };
}
