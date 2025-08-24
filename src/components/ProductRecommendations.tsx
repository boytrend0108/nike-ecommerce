import { getRecommendedProducts } from '@/lib/actions/product';
import Card from './Card';

interface ProductRecommendationsProps {
  productId: string;
}

export default async function ProductRecommendations({ productId }: ProductRecommendationsProps) {
  const recommendedProducts = await getRecommendedProducts(productId);

  if (recommendedProducts.length === 0) {
    return null;
  }

  return (
    <div className="mt-16">
      <h2 className="text-heading-3 text-dark-900 mb-8">You Might Also Like</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {recommendedProducts.map((product) => {
          const hasDiscount = !!product.salePrice;
          const displayPrice = hasDiscount ? product.salePrice! : product.price;
          
          return (
            <Card
              key={product.id}
              title={product.title}
              imageSrc={product.mainImage}
              imageAlt={product.title}
              price={displayPrice}
              badge={hasDiscount ? { text: "Sale" } : null}
              meta={`${product.gender}'s ${product.category}`}
              href={`/products/${product.id}`}
            />
          );
        })}
      </div>
    </div>
  );
}
