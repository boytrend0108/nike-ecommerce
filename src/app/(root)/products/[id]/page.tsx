import Breadcrumbs from '@/components/Breadcrumbs';
import CollapsibleSection from '@/components/CollapsibleSection';
import { RecommendationsSkeleton, ReviewsSkeleton } from '@/components/LoadingSkeletons';
import ProductGallery from '@/components/ProductGallery';
import ProductRecommendations from '@/components/ProductRecommendations';
import ProductReviews from '@/components/ProductReviews';
import SizePicker from '@/components/SizePicker';
import { getProduct } from '@/lib/actions/product';
import { Heart, ShoppingBag, Star } from 'lucide-react';
import { Metadata } from 'next';
import { Suspense } from 'react';

interface ProductPageProps {
  params: Promise<{ id: string }>;
}

// Metadata generation
export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { id } = await params;
  const product = await getProduct(id);

  if (!product) {
    return {
      title: 'Product Not Found',
      description: 'The requested product could not be found.',
    };
  }

  return {
    title: `${product.name} - ${product.genderLabel}'s ${product.categoryName} | Nike`,
    description: product.description || product.name,
    openGraph: {
      title: product.name,
      description: product.description || product.name,
      images: product.images.slice(0, 3).map(img => ({
        url: img,
        alt: product.name,
      })),
      type: 'website',
    },
    other: {
      'product:price:amount': product.minPrice.toString(),
      'product:price:currency': 'USD',
    },
  };
}

// Helper function to get unique variants by color
function getColorVariants(product: NonNullable<Awaited<ReturnType<typeof getProduct>>>) {
  const colorMap = new Map();
  product.allVariants.forEach((variant) => {
    if (!colorMap.has(variant.colorId)) {
      // Find images for this variant or use primary image
      const variantImages = product.allImages.filter(img => img.variantId === variant.id);
      const variantImage = variantImages.find(img => img.isPrimary)?.url ||
        variantImages[0]?.url ||
        product.primaryImage ||
        product.images[0];

      colorMap.set(variant.colorId, {
        id: variant.colorId,
        name: variant.colorName,
        hex: variant.colorHex,
        slug: variant.colorSlug,
        image: variantImage
      });
    }
  });
  return Array.from(colorMap.values());
}

// Helper function to get available sizes
function getAvailableSizes(product: NonNullable<Awaited<ReturnType<typeof getProduct>>>) {
  const sizeMap = new Map();
  product.allVariants.forEach(variant => {
    if (!sizeMap.has(variant.sizeId)) {
      sizeMap.set(variant.sizeId, {
        id: variant.sizeId,
        name: variant.sizeName,
        inStock: variant.inStock > 0
      });
    } else {
      // Update stock status if any variant of this size is in stock
      const existing = sizeMap.get(variant.sizeId);
      existing.inStock = existing.inStock || variant.inStock > 0;
    }
  });
  return Array.from(sizeMap.values());
}

// Helper function to calculate discount
function calculateDiscount(price: number, salePrice?: number) {
  if (!salePrice) return null;
  const discount = Math.round(((price - salePrice) / price) * 100);
  return discount;
}

// Not Found Component
function ProductNotFound() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="text-center space-y-4">
        <h1 className="text-heading-1 text-dark-900">Product Not Found</h1>
        <p className="text-body text-dark-700 max-w-md mx-auto">
          Sorry, the product you&apos;re looking for doesn&apos;t exist or has been removed.
        </p>
        <a
          href="/products"
          className="inline-block bg-dark-900 text-light-100 py-3 px-6 rounded-full text-body-medium hover:bg-dark-700 transition-colors"
        >
          Browse All Products
        </a>
      </div>
    </div>
  );
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params;
  
  // Get the product from backend
  const product = await getProduct(id);
  
  if (!product) {
    return <ProductNotFound />;
  }

  const colorVariants = getColorVariants(product);
  const availableSizes = getAvailableSizes(product);
  
  // Get pricing info
  const hasDiscount = product.hasDiscount;
  const displayPrice = hasDiscount ? product.minPrice : product.maxPrice;
  const originalPrice = hasDiscount ? product.maxPrice : undefined;
  const discount = originalPrice ? calculateDiscount(originalPrice, displayPrice) : null;

  return (
    <div className="container mx-auto px-4 py-4 sm:py-8">
      {/* Breadcrumbs */}
      <Breadcrumbs 
        items={[
          { label: 'Products', href: '/products' },
          { label: product.categoryName, href: `/products?category=${product.categoryId}` },
          { label: product.name }
        ]} 
      />
      
      <div className="flex flex-col lg:grid lg:grid-cols-2 gap-6 lg:gap-12">
        {/* Product Gallery */}
        <div className="order-1 lg:sticky lg:top-8 lg:self-start">
          {product.images.length > 0 ? (
            <ProductGallery 
              images={product.images}
              variants={colorVariants}
              productName={product.name}
            />
          ) : (
            <div className="bg-light-200 aspect-square rounded-lg flex items-center justify-center">
              <p className="text-dark-500">No images available</p>
            </div>
          )}
        </div>

        {/* Product Information */}
        <div className="order-2 space-y-6">
          {/* Product Title & Category */}
          <div>
            <p className="text-caption text-dark-700 mb-2">{product.genderLabel}&apos;s {product.categoryName}</p>
            <h1 className="text-heading-2 sm:text-heading-2 text-dark-900 mb-4">{product.name}</h1>
            
            {/* Rating Placeholder */}
            <div className="flex items-center gap-2 mb-4">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-dark-900 text-dark-900" />
                ))}
              </div>
              <span className="text-body text-dark-700">(Loading...)</span>
            </div>

            {/* Price */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-6">
              <span className="text-heading-3 text-dark-900">
                ${displayPrice}
              </span>
              {hasDiscount && originalPrice && (
                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                  <span className="text-body text-dark-500 line-through">
                    ${originalPrice}
                  </span>
                  {discount && (
                    <span className="text-body-medium text-green">
                      Extra {discount}% off w/ code SPORT
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Color Selection */}
          {colorVariants.length > 1 && (
            <div>
              <h3 className="text-body-medium text-dark-900 mb-3">Select Color</h3>
              <div className="flex gap-2">
                {colorVariants.map((color) => (
                  <button
                    key={color.id}
                    className="w-12 h-12 rounded-full border-2 border-light-300 hover:border-dark-900 transition-colors"
                    style={{ backgroundColor: color.hex }}
                    title={color.name}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Size Selection */}
          <SizePicker sizes={availableSizes} />

          {/* Action Buttons */}
          <div className="space-y-3">
            <button className="w-full bg-dark-900 text-light-100 py-4 px-6 rounded-full text-body-medium hover:bg-dark-700 transition-colors flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-dark-900 focus:ring-offset-2">
              <ShoppingBag className="w-5 h-5" />
              Add to Bag
            </button>
            <button className="w-full border border-dark-900 text-dark-900 py-4 px-6 rounded-full text-body-medium hover:bg-light-200 transition-colors flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-dark-900 focus:ring-offset-2">
              <Heart className="w-5 h-5" />
              Favorite
            </button>
          </div>

          {/* Product Description */}
          {product.description && (
            <div className="space-y-4">
              <p className="text-body text-dark-700">{product.description}</p>
            </div>
          )}

          {/* Collapsible Sections */}
          <div className="space-y-2">
            <CollapsibleSection 
              title="Product Details" 
              defaultOpen={true}
            >
              <div className="space-y-2 text-body text-dark-700">
                <p>{product.description || 'No detailed description available.'}</p>
                <p>• Brand: {product.brandName}</p>
                <p>• Category: {product.categoryName}</p>
                <p>• Gender: {product.genderLabel}</p>
              </div>
            </CollapsibleSection>

            <CollapsibleSection title="Shipping & Returns">
              <div className="space-y-2 text-body text-dark-700">
                <p>Free standard shipping on orders $50+</p>
                <p>Free 60-day returns for Nike Members</p>
                <p>Estimated delivery: 3-7 business days</p>
              </div>
            </CollapsibleSection>

            <CollapsibleSection title="Reviews">
              <Suspense fallback={<ReviewsSkeleton />}>
                <ProductReviews productId={product.id} />
              </Suspense>
            </CollapsibleSection>
          </div>
        </div>
      </div>

      {/* You Might Also Like Section */}
      <Suspense fallback={<RecommendationsSkeleton />}>
        <ProductRecommendations productId={product.id} />
      </Suspense>
    </div>
  );
}
