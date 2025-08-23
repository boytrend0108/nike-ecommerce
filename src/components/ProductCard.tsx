import Image from 'next/image';
import { Product } from '@/lib/db/schema';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="relative h-64 bg-gray-100">
        {product.imageUrl ? (
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            className="object-contain p-4"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400">
            No Image
          </div>
        )}
      </div>
      
      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-500 font-medium">{product.brand}</span>
          <span className="text-sm text-gray-500">{product.category}</span>
        </div>
        
        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
          {product.name}
        </h3>
        
        {product.description && (
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
            {product.description}
          </p>
        )}
        
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            {product.color && (
              <span className="text-sm text-gray-500">Color: {product.color}</span>
            )}
            {product.size && (
              <span className="text-sm text-gray-500">Size: {product.size}</span>
            )}
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-xl font-bold text-gray-900">
              ${product.price}
            </span>
            {product.originalPrice && product.originalPrice !== product.price && (
              <span className="text-sm text-gray-500 line-through">
                ${product.originalPrice}
              </span>
            )}
          </div>
          
          <div className="text-sm text-gray-500">
            Stock: {product.stock}
          </div>
        </div>
        
        <button className="w-full mt-4 bg-black text-white py-2 px-4 rounded-md hover:bg-gray-800 transition-colors duration-200">
          Add to Cart
        </button>
      </div>
    </div>
  );
}