import { ProductListItem } from '@/lib/actions/product';
import Card from './Card';

interface ProductCardProps {
  product: ProductListItem;
}

export default function ProductCardNew({ product }: ProductCardProps) {
  const mainVariant = product.variants[0];
  const currentPrice = mainVariant?.salePrice || product.minPrice;
  const hasDiscount = product.hasDiscount;
  
  // Get available colors for this product
  const availableColors = product.variants
    .map(variant => ({ 
      name: variant.colorName, 
      hex: variant.colorHex,
      slug: variant.colorSlug 
    }))
    .filter((color, index, self) => 
      index === self.findIndex(c => c.slug === color.slug)
    );

  const meta = `${product.genderLabel}'s ${product.categoryName}`;
  
  let badge = null;
  if (hasDiscount) {
    badge = { text: 'Sale' };
  }

  // Show available colors if more than one
  const colorDisplay = availableColors.length > 1 
    ? `${availableColors.length} color${availableColors.length !== 1 ? 's' : ''}`
    : '';

  const description = colorDisplay || product.description || undefined;

  return (
    <Card
      title={product.name}
      description={description}
      imageSrc={product.primaryImage || product.images[0] || undefined}
      imageAlt={product.name}
      price={currentPrice}
      badge={badge}
      meta={meta}
      href={`/products/${product.id}`}
    />
  );
}
