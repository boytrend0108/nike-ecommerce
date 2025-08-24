import { MockProduct } from '@/lib/data/mockProducts';
import Image from 'next/image';
import Link from 'next/link';

interface ProductCardProps {
  product: MockProduct;
}

export default function ProductCard({ product }: ProductCardProps) {
  const mainVariant = product.variants[0];
  const currentPrice = mainVariant?.salePrice || product.minPrice;
  const originalPrice = mainVariant?.salePrice ? mainVariant.price : null;
  const hasDiscount = Boolean(mainVariant?.salePrice);
  
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

  return (
    <Link
      href={`/products/${product.id}`}
      className="group block overflow-hidden rounded-xl bg-light-100 shadow-sm ring-1 ring-light-300 hover:shadow-md transition"
    >
      {/* Product Image */}
      <div className="relative bg-light-200">
        {product.images[0] ? (
          <Image
            src={product.images[0]}
            alt={product.name}
            width={800}
            height={600}
            className="h-60 w-full object-contain sm:h-72 group-hover:scale-105 transition-transform duration-300"
            priority={false}
          />
        ) : (
          <div className="h-60 w-full sm:h-72 flex items-center justify-center text-dark-500">
            No image
          </div>
        )}

        {/* Discount Badge */}
        {hasDiscount && (
          <span className="absolute left-3 top-3 rounded-full bg-red px-3 py-1 text-footnote text-light-100 shadow">
            Sale
          </span>
        )}

        {/* Best Seller Badge (for featured items) */}
        {product.id === "1" && (
          <span className="absolute left-3 top-3 rounded-full bg-orange px-3 py-1 text-footnote text-light-100 shadow">
            Best Seller
          </span>
        )}
      </div>

      {/* Product Info */}
      <div className="p-4 sm:p-5">
        <div className="flex items-start justify-between gap-4">
          <h3 className="text-heading-3 text-dark-900 line-clamp-2 group-hover:text-dark-700 transition-colors">
            {product.name}
          </h3>
          <div className="shrink-0 text-right">
            <div className="text-body-medium text-dark-900">
              ${currentPrice.toFixed(2)}
            </div>
            {originalPrice && (
              <div className="text-caption text-dark-500 line-through">
                ${originalPrice.toFixed(2)}
              </div>
            )}
          </div>
        </div>

        {/* Category and Gender */}
        <p className="mt-1 text-caption text-dark-700">
          {product.genderLabel}&apos;s {product.categoryName}
        </p>

        {/* Colors */}
        {availableColors.length > 1 && (
          <div className="mt-3 flex items-center gap-2">
            <span className="text-caption text-dark-700">
              {availableColors.length} color{availableColors.length !== 1 ? 's' : ''}
            </span>
            <div className="flex gap-1">
              {availableColors.slice(0, 4).map((color) => (
                <div
                  key={color.slug}
                  className="h-4 w-4 rounded-full border border-light-400 shadow-sm"
                  style={{ backgroundColor: color.hex }}
                  title={color.name}
                />
              ))}
              {availableColors.length > 4 && (
                <span className="text-caption text-dark-500">
                  +{availableColors.length - 4}
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    </Link>
  );
}
