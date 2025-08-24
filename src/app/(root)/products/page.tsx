import ActiveFilters from '@/components/ActiveFilters';
import Filters from '@/components/Filters';
import ProductCardNew from '@/components/ProductCardNew';
import Sort from '@/components/Sort';
import { getAllProducts } from '@/lib/actions/product';
import { parseFilterParams } from '@/lib/utils/query';
import { Suspense } from 'react';

interface ProductsPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

async function ProductsPageContent({ searchParams }: ProductsPageProps) {
  const resolvedSearchParams = await searchParams;
  const urlSearchParams = new URLSearchParams();
  
  // Convert the resolved search params to URLSearchParams
  Object.entries(resolvedSearchParams).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      value.forEach(v => urlSearchParams.append(key, v));
    } else if (value) {
      urlSearchParams.set(key, value);
    }
  });

  // Parse filters for getAllProducts
  const params = parseFilterParams(urlSearchParams);
  
  // Fetch products from database
  const result = await getAllProducts(params);
  
  // For now, we'll use empty active filters since we need to implement filter parsing
  const activeFilters: Array<{ type: string; value: string; label: string }> = [];
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="lg:flex lg:gap-8">
        {/* Desktop Filters Sidebar - Only on desktop */}
        <div className="hidden lg:block">
          <Filters />
        </div>
        
        {/* Main Content */}
        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex flex-col gap-4 mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <h1 className="text-heading-2 text-dark-900">
                Products ({result.totalCount})
              </h1>
              <div className="flex items-center gap-3">
                {/* Mobile Filter Button */}
                <div className="lg:hidden">
                  <Filters />
                </div>
                <Sort />
              </div>
            </div>
            
            {/* Active Filters */}
            {activeFilters.length > 0 && (
              <ActiveFilters filters={activeFilters} />
            )}
          </div>
          
          {/* Products Grid */}
          {result.products.length > 0 ? (
            <div className="grid grid-cols-1 gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {result.products.map((product) => (
                <ProductCardNew key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="mx-auto max-w-md">
                <h3 className="text-heading-3 text-dark-900 mb-2">
                  No products found
                </h3>
                <p className="text-body text-dark-700 mb-6">
                  Try adjusting your filters or search terms to find what you&apos;re looking for.
                </p>
              </div>
            </div>
          )}
          
          {/* Pagination */}
          {result.products.length > 0 && (
            <div className="mt-12 flex justify-center">
              <div className="text-caption text-dark-700">
                Showing {((result.currentPage - 1) * 20) + 1} to {Math.min(result.currentPage * 20, result.totalCount)} of {result.totalCount} products
                {result.totalPages > 1 && (
                  <span className="ml-2">
                    (Page {result.currentPage} of {result.totalPages})
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ProductsPage({ searchParams }: ProductsPageProps) {
  return (
    <Suspense fallback={<div className="flex justify-center items-center h-64">Loading...</div>}>
      <ProductsPageContent searchParams={searchParams} />
    </Suspense>
  );
}
