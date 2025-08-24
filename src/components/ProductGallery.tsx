'use client';

import { Check, ChevronLeft, ChevronRight, ImageOff } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useState } from 'react';

interface ColorVariant {
  id: string;
  name: string;
  hex: string;
  slug: string;
  image: string;
}

interface ProductGalleryProps {
  images: string[];
  variants: ColorVariant[];
  productName: string;
}

export default function ProductGallery({ images, variants, productName }: ProductGalleryProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedVariantId, setSelectedVariantId] = useState(variants[0]?.id || '');
  const [imageErrors, setImageErrors] = useState<Set<string>>(new Set());

  // Filter valid images (exclude broken ones)
  const validImages = images.filter(img => !imageErrors.has(img));
  const hasValidImages = validImages.length > 0;

  const handleImageError = (imageSrc: string) => {
    setImageErrors(prev => new Set(prev).add(imageSrc));
  };

  const handleVariantSelect = (variantId: string, variantImage: string) => {
    setSelectedVariantId(variantId);
    // Switch to the variant's specific image if it exists in the gallery
    if (validImages.includes(variantImage)) {
      const imageIndex = validImages.indexOf(variantImage);
      setSelectedImageIndex(imageIndex);
    } else {
      // If the variant image isn't in the current gallery, set to first image
      setSelectedImageIndex(0);
    }
  };

  // Reset selected image index if it's out of bounds after filtering invalid images
  useEffect(() => {
    if (selectedImageIndex >= validImages.length && validImages.length > 0) {
      setSelectedImageIndex(0);
    }
  }, [validImages.length, selectedImageIndex]);

  return (
    <div className="flex flex-col sm:flex-row gap-4">
      {/* Left Thumbnail Column - Hidden on mobile */}
      {hasValidImages && validImages.length > 1 && (
        <div className="hidden sm:flex flex-col gap-3 w-20 shrink-0">
          {validImages.map((image, index) => (
            <button
              key={image}
              onClick={() => setSelectedImageIndex(index)}
              className={`relative w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors focus:outline-none focus:ring-2 focus:ring-dark-900 focus:ring-offset-2 ${
                selectedImageIndex === index 
                  ? 'border-dark-900' 
                  : 'border-light-300 hover:border-dark-500'
              }`}
              role="tab"
              aria-selected={selectedImageIndex === index}
              tabIndex={selectedImageIndex === index ? 0 : -1}
            >
              <Image
                src={image}
                alt={`${productName} - Thumbnail ${index + 1}`}
                fill
                className="object-contain"
                onError={() => handleImageError(image)}
                sizes="80px"
              />
            </button>
          ))}
        </div>
      )}

      {/* Main Image */}
      <div className="flex-1">
        <div className="relative aspect-square bg-light-200 rounded-lg overflow-hidden">
          {hasValidImages ? (
            <>
              <Image
                src={validImages[selectedImageIndex]}
                alt={`${productName} - View ${selectedImageIndex + 1}`}
                fill
                className="object-contain"
                priority
                onError={() => handleImageError(validImages[selectedImageIndex])}
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 40vw"
              />
              
              {/* Navigation Arrows */}
              {validImages.length > 1 && (
                <>
                  <button
                    onClick={() => setSelectedImageIndex(prev => 
                      prev === 0 ? validImages.length - 1 : prev - 1
                    )}
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-light-100/80 hover:bg-light-100 rounded-full flex items-center justify-center transition-colors focus:outline-none focus:ring-2 focus:ring-dark-900 focus:ring-offset-2"
                    aria-label="Previous image"
                  >
                    <ChevronLeft className="w-5 h-5 text-dark-900" />
                  </button>
                  
                  <button
                    onClick={() => setSelectedImageIndex(prev => 
                      prev === validImages.length - 1 ? 0 : prev + 1
                    )}
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-light-100/80 hover:bg-light-100 rounded-full flex items-center justify-center transition-colors focus:outline-none focus:ring-2 focus:ring-dark-900 focus:ring-offset-2"
                    aria-label="Next image"
                  >
                    <ChevronRight className="w-5 h-5 text-dark-900" />
                  </button>
                </>
              )}
            </>
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-dark-500 bg-light-200">
              <ImageOff className="w-16 h-16 mb-4 text-dark-400" />
              <p className="text-body text-dark-500">No images available</p>
            </div>
          )}
        </div>

        {/* Mobile Horizontal Thumbnails - Only shown on mobile */}
        {hasValidImages && validImages.length > 1 && (
          <div className="mt-4 sm:hidden">
            <div className="flex gap-3 overflow-x-auto pb-2" style={{ scrollSnapType: 'x mandatory' }}>
              {validImages.map((image, index) => (
                <button
                  key={image}
                  onClick={() => setSelectedImageIndex(index)}
                  className={`relative flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-colors focus:outline-none focus:ring-2 focus:ring-dark-900 focus:ring-offset-2 ${
                    selectedImageIndex === index 
                      ? 'border-dark-900' 
                      : 'border-light-300 hover:border-dark-500'
                  }`}
                  style={{ scrollSnapAlign: 'start' }}
                  role="tab"
                  aria-selected={selectedImageIndex === index}
                  tabIndex={selectedImageIndex === index ? 0 : -1}
                >
                  <Image
                    src={image}
                    alt={`${productName} - Thumbnail ${index + 1}`}
                    fill
                    className="object-contain"
                    onError={() => handleImageError(image)}
                    sizes="64px"
                  />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Color Variants - moved under main image */}
        {variants.length > 1 && (
          <div className="mt-6 space-y-3">
            <h3 className="text-body-medium text-dark-900">Color Options</h3>
            <div className="flex gap-3">
              {variants.map((variant) => (
                <button
                  key={variant.id}
                  onClick={() => handleVariantSelect(variant.id, variant.image)}
                  className={`relative w-12 h-12 rounded-full border-2 transition-colors focus:outline-none focus:ring-2 focus:ring-dark-900 focus:ring-offset-2 ${
                    selectedVariantId === variant.id
                      ? 'border-dark-900'
                      : 'border-light-300 hover:border-dark-500'
                  }`}
                  style={{ backgroundColor: variant.hex }}
                  title={variant.name}
                  aria-label={`Select ${variant.name} color`}
                >
                  {selectedVariantId === variant.id && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Check className="w-4 h-4 text-white drop-shadow-sm" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
