import { MockProduct } from '@/lib/data/mockProducts';
import { ParsedFilters } from '@/lib/utils/query';

export function filterProducts(products: MockProduct[], filters: ParsedFilters): MockProduct[] {
  return products.filter((product) => {
    // Gender filter
    if (filters.gender.length > 0 && !filters.gender.includes(product.genderSlug)) {
      return false;
    }

    // Color filter - check if any variant has the selected color
    if (filters.color.length > 0) {
      const hasMatchingColor = product.variants.some(variant => 
        filters.color.includes(variant.colorSlug)
      );
      if (!hasMatchingColor) {
        return false;
      }
    }

    // Size filter - check if any variant has the selected size
    if (filters.size.length > 0) {
      const hasMatchingSize = product.variants.some(variant => 
        filters.size.includes(variant.sizeSlug)
      );
      if (!hasMatchingSize) {
        return false;
      }
    }

    // Price range filter
    if (filters.priceRange) {
      const [min, max] = filters.priceRange.split('-').map(Number);
      const productPrice = product.variants[0]?.salePrice || product.minPrice;
      
      if (productPrice < min || productPrice > max) {
        return false;
      }
    }

    return true;
  });
}

export function sortProducts(products: MockProduct[], sortBy: string): MockProduct[] {
  const sorted = [...products];
  
  switch (sortBy) {
    case 'price_asc':
      return sorted.sort((a, b) => {
        const priceA = a.variants[0]?.salePrice || a.minPrice;
        const priceB = b.variants[0]?.salePrice || b.minPrice;
        return priceA - priceB;
      });
      
    case 'price_desc':
      return sorted.sort((a, b) => {
        const priceA = a.variants[0]?.salePrice || a.minPrice;
        const priceB = b.variants[0]?.salePrice || b.minPrice;
        return priceB - priceA;
      });
      
    case 'newest':
      return sorted.sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      
    case 'featured':
    default:
      // Keep original order for featured
      return sorted;
  }
}

export function getActiveFilterLabels(filters: ParsedFilters): { type: string; label: string; value: string }[] {
  const labels: { type: string; label: string; value: string }[] = [];
  
  // Gender labels
  filters.gender.forEach(gender => {
    const genderLabel = gender.charAt(0).toUpperCase() + gender.slice(1);
    labels.push({ type: 'gender', label: genderLabel, value: gender });
  });
  
  // Color labels
  filters.color.forEach(color => {
    const colorLabel = color.charAt(0).toUpperCase() + color.slice(1);
    labels.push({ type: 'color', label: colorLabel, value: color });
  });
  
  // Size labels
  filters.size.forEach(size => {
    labels.push({ type: 'size', label: `Size ${size.replace('-', '.')}`, value: size });
  });
  
  // Price range label
  if (filters.priceRange) {
    const [min, max] = filters.priceRange.split('-');
    const label = max === '999' ? `Over $${min}` : `$${min} - $${max}`;
    labels.push({ type: 'priceRange', label, value: filters.priceRange });
  }
  
  return labels;
}
