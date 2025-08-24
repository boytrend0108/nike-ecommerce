'use server';

import { mockProducts } from '@/lib/data/mockProducts';
import { db } from '@/lib/db';
import {
  brands,
  categories,
  colors,
  genders,
  productImages,
  products as productsTable,
  productVariants,
  reviews,
  user
} from '@/lib/db/schema';
import { sizes } from '@/lib/db/schema/filters/sizes';
import { and, asc, count, desc, eq, inArray, like, or, sql } from 'drizzle-orm';
import { z } from 'zod';

// Types for the product actions
export interface ProductListItem {
  id: string;
  name: string;
  description: string | null;
  categoryId: string;
  categoryName: string;
  genderId: string;
  genderLabel: string;
  brandId: string;
  brandName: string;
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
  minPrice: number;
  maxPrice: number;
  hasDiscount: boolean;
  primaryImage: string | null;
  images: string[];
  variants: ProductVariantSummary[];
}

export interface ProductVariantSummary {
  id: string;
  price: number;
  salePrice: number | null;
  colorId: string;
  colorName: string;
  colorSlug: string;
  colorHex: string;
  sizeId: string;
  sizeName: string;
  sizeSlug: string;
  inStock: number;
}

export interface ProductDetail extends ProductListItem {
  allVariants: ProductVariantDetail[];
  allImages: ProductImageDetail[];
}

export interface ProductVariantDetail {
  id: string;
  sku: string;
  price: number;
  salePrice: number | null;
  colorId: string;
  colorName: string;
  colorSlug: string;
  colorHex: string;
  sizeId: string;
  sizeName: string;
  sizeSlug: string;
  inStock: number;
  weight: number;
  dimensions: Record<string, unknown> | null;
}

export interface ProductImageDetail {
  id: string;
  url: string;
  sortOrder: number;
  isPrimary: boolean;
  variantId: string | null;
}

export interface GetAllProductsParams {
  search?: string;
  categoryIds?: string[];
  brandIds?: string[];
  genderIds?: string[];
  colorIds?: string[];
  sizeIds?: string[];
  priceMin?: number;
  priceMax?: number;
  sortBy?: 'price_asc' | 'price_desc' | 'latest' | 'oldest' | 'name_asc' | 'name_desc';
  page?: number;
  limit?: number;
}

export interface GetAllProductsResult {
  products: ProductListItem[];
  totalCount: number;
  totalPages: number;
}

// Review types for server actions
export interface ReviewItem {
  id: string;
  author: string;
  rating: number;
  title?: string;
  content: string;
  createdAt: string;
}

// Recommended product type for server actions
export interface RecommendedProduct {
  id: string;
  title: string;
  price: number;
  salePrice?: number;
  mainImage: string;
  category: string;
  brand: string;
  gender: string;
}

// Schema for validation
const GetAllProductsParamsSchema = z.object({
  search: z.string().optional(),
  categoryIds: z.array(z.string()).optional(), // Accept any string (slug or UUID)
  brandIds: z.array(z.string()).optional(), // Accept any string (slug or UUID)
  genderIds: z.array(z.string()).optional(), // Accept any string (slug or UUID)
  colorIds: z.array(z.string()).optional(), // Accept any string (slug or UUID)
  sizeIds: z.array(z.string()).optional(), // Accept any string (slug or UUID)
  priceMin: z.number().min(0).optional(),
  priceMax: z.number().min(0).optional(),
  sortBy: z.enum(['price_asc', 'price_desc', 'latest', 'oldest', 'name_asc', 'name_desc']).optional(),
  page: z.number().min(1).optional(),
  limit: z.number().min(1).max(100).optional(),
});

/**
 * Fallback function to get product from mock data
 */
function getProductFromMockData(productId: string): ProductDetail | null {
  const mockProduct = mockProducts.find(p => p.id === productId);
  
  if (!mockProduct) {
    return null;
  }

  // Convert mock product to ProductDetail format
  const variantSummaries: ProductVariantSummary[] = mockProduct.variants.map(variant => ({
    id: variant.id,
    price: variant.price,
    salePrice: variant.salePrice || null,
    colorId: variant.colorId,
    colorName: variant.colorName,
    colorSlug: variant.colorSlug,
    colorHex: variant.colorHex,
    sizeId: variant.sizeId,
    sizeName: variant.sizeName,
    sizeSlug: variant.sizeSlug,
    inStock: variant.inStock,
  }));

  const variantDetails: ProductVariantDetail[] = mockProduct.variants.map(variant => ({
    id: variant.id,
    sku: variant.sku,
    price: variant.price,
    salePrice: variant.salePrice || null,
    colorId: variant.colorId,
    colorName: variant.colorName,
    colorSlug: variant.colorSlug,
    colorHex: variant.colorHex,
    sizeId: variant.sizeId,
    sizeName: variant.sizeName,
    sizeSlug: variant.sizeSlug,
    inStock: variant.inStock,
    weight: variant.weight,
    dimensions: null,
  }));

  const imageDetails: ProductImageDetail[] = mockProduct.images.map((url, index) => ({
    id: `img-${index}`,
    url,
    sortOrder: index,
    isPrimary: index === 0,
    variantId: null,
  }));

  return {
    id: mockProduct.id,
    name: mockProduct.name,
    description: mockProduct.description,
    categoryId: mockProduct.categoryId,
    categoryName: mockProduct.categoryName,
    genderId: mockProduct.genderId,
    genderLabel: mockProduct.genderLabel,
    brandId: mockProduct.brandId,
    brandName: mockProduct.brandName,
    isPublished: mockProduct.isPublished,
    createdAt: new Date(mockProduct.createdAt),
    updatedAt: new Date(mockProduct.createdAt),
    minPrice: mockProduct.minPrice,
    maxPrice: mockProduct.maxPrice,
    hasDiscount: mockProduct.hasDiscount,
    primaryImage: mockProduct.images[0] || null,
    images: mockProduct.images,
    variants: variantSummaries,
    allVariants: variantDetails,
    allImages: imageDetails,
  };
}

/**
 * Get all products with filtering, sorting, and pagination
 */
export async function getAllProducts(params: GetAllProductsParams = {}): Promise<GetAllProductsResult> {
  // Validate input parameters
  const validatedParams = GetAllProductsParamsSchema.parse(params);
  
  const {
    search,
    categoryIds,
    brandIds,
    genderIds,
    colorIds,
    sizeIds,
    priceMin,
    priceMax,
    sortBy = 'latest',
    page = 1,
    limit = 20
  } = validatedParams;

  const offset = (page - 1) * limit;

  try {
    // Convert slugs to UUIDs if necessary
    let resolvedCategoryIds: string[] | undefined;
    let resolvedBrandIds: string[] | undefined;
    let resolvedGenderIds: string[] | undefined;
    let resolvedColorIds: string[] | undefined;
    let resolvedSizeIds: string[] | undefined;

    if (categoryIds && categoryIds.length > 0) {
      // Check if they're UUIDs or slugs
      const isUUIDs = categoryIds.every(id => /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id));
      if (isUUIDs) {
        resolvedCategoryIds = categoryIds;
      } else {
        // Convert slugs to UUIDs
        const categoryResults = await db
          .select({ id: categories.id })
          .from(categories)
          .where(inArray(categories.slug, categoryIds));
        resolvedCategoryIds = categoryResults.map(c => c.id);
      }
    }

    if (brandIds && brandIds.length > 0) {
      const isUUIDs = brandIds.every(id => /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id));
      if (isUUIDs) {
        resolvedBrandIds = brandIds;
      } else {
        const brandResults = await db
          .select({ id: brands.id })
          .from(brands)
          .where(inArray(brands.slug, brandIds));
        resolvedBrandIds = brandResults.map(b => b.id);
      }
    }

    if (genderIds && genderIds.length > 0) {
      const isUUIDs = genderIds.every(id => /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id));
      if (isUUIDs) {
        resolvedGenderIds = genderIds;
      } else {
        const genderResults = await db
          .select({ id: genders.id })
          .from(genders)
          .where(inArray(genders.slug, genderIds));
        resolvedGenderIds = genderResults.map(g => g.id);
      }
    }

    if (colorIds && colorIds.length > 0) {
      const isUUIDs = colorIds.every(id => /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id));
      if (isUUIDs) {
        resolvedColorIds = colorIds;
      } else {
        const colorResults = await db
          .select({ id: colors.id })
          .from(colors)
          .where(inArray(colors.slug, colorIds));
        resolvedColorIds = colorResults.map(c => c.id);
      }
    }

    if (sizeIds && sizeIds.length > 0) {
      const isUUIDs = sizeIds.every(id => /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id));
      if (isUUIDs) {
        resolvedSizeIds = sizeIds;
      } else {
        const sizeResults = await db
          .select({ id: sizes.id })
          .from(sizes)
          .where(inArray(sizes.slug, sizeIds));
        resolvedSizeIds = sizeResults.map(s => s.id);
      }
    }
    // Build the base query with all necessary joins
    let baseQuery = db
      .select({
        id: productsTable.id,
        name: productsTable.name,
        description: productsTable.description,
        categoryId: productsTable.categoryId,
        categoryName: categories.name,
        genderId: productsTable.genderId,
        genderLabel: genders.label,
        brandId: productsTable.brandId,
        brandName: brands.name,
        isPublished: productsTable.isPublished,
        createdAt: productsTable.createdAt,
        updatedAt: productsTable.updatedAt,
        minPrice: sql<number>`COALESCE(MIN(CASE WHEN ${productVariants.salePrice} IS NOT NULL THEN ${productVariants.salePrice} ELSE ${productVariants.price} END), 0)`,
        maxPrice: sql<number>`COALESCE(MAX(CASE WHEN ${productVariants.salePrice} IS NOT NULL THEN ${productVariants.salePrice} ELSE ${productVariants.price} END), 0)`,
        hasDiscount: sql<boolean>`COUNT(CASE WHEN ${productVariants.salePrice} IS NOT NULL THEN 1 END) > 0`,
        primaryImage: sql<string | null>`(
          SELECT ${productImages.url} 
          FROM ${productImages} 
          WHERE ${productImages.productId} = ${productsTable.id} 
          AND ${productImages.isPrimary} = true 
          LIMIT 1
        )`,
      })
      .from(productsTable)
      .innerJoin(categories, eq(productsTable.categoryId, categories.id))
      .innerJoin(genders, eq(productsTable.genderId, genders.id))
      .innerJoin(brands, eq(productsTable.brandId, brands.id))
      .innerJoin(productVariants, eq(productsTable.id, productVariants.productId))
      .where(eq(productsTable.isPublished, true))
      .groupBy(
        productsTable.id,
        productsTable.name,
        productsTable.description,
        productsTable.categoryId,
        categories.name,
        productsTable.genderId,
        genders.label,
        productsTable.brandId,
        brands.name,
        productsTable.isPublished,
        productsTable.createdAt,
        productsTable.updatedAt
      );

    // Apply filters
    const conditions = [eq(productsTable.isPublished, true)];

    if (search) {
      conditions.push(
        or(
          like(productsTable.name, `%${search}%`),
          like(productsTable.description, `%${search}%`),
          like(brands.name, `%${search}%`),
          like(categories.name, `%${search}%`)
        )!
      );
    }

    if (resolvedCategoryIds && resolvedCategoryIds.length > 0) {
      conditions.push(inArray(productsTable.categoryId, resolvedCategoryIds));
    }

    if (resolvedBrandIds && resolvedBrandIds.length > 0) {
      conditions.push(inArray(productsTable.brandId, resolvedBrandIds));
    }

    if (resolvedGenderIds && resolvedGenderIds.length > 0) {
      conditions.push(inArray(productsTable.genderId, resolvedGenderIds));
    }

    if (resolvedColorIds && resolvedColorIds.length > 0) {
      conditions.push(
        sql`${productsTable.id} IN (
          SELECT DISTINCT pv.product_id 
          FROM ${productVariants} pv 
          WHERE ${inArray(productVariants.colorId, resolvedColorIds)}
        )`
      );
    }

    if (resolvedSizeIds && resolvedSizeIds.length > 0) {
      conditions.push(
        sql`${productsTable.id} IN (
          SELECT DISTINCT pv.product_id 
          FROM ${productVariants} pv 
          WHERE ${inArray(productVariants.sizeId, resolvedSizeIds)}
        )`
      );
    }

    if (priceMin !== undefined || priceMax !== undefined) {
      let priceCondition;
      if (priceMin !== undefined && priceMax !== undefined) {
        priceCondition = sql`${productsTable.id} IN (
          SELECT DISTINCT pv.product_id 
          FROM ${productVariants} pv 
          WHERE COALESCE(pv.sale_price, pv.price) >= ${priceMin}
            AND COALESCE(pv.sale_price, pv.price) <= ${priceMax}
        )`;
      } else if (priceMin !== undefined) {
        priceCondition = sql`${productsTable.id} IN (
          SELECT DISTINCT pv.product_id 
          FROM ${productVariants} pv 
          WHERE COALESCE(pv.sale_price, pv.price) >= ${priceMin}
        )`;
      } else if (priceMax !== undefined) {
        priceCondition = sql`${productsTable.id} IN (
          SELECT DISTINCT pv.product_id 
          FROM ${productVariants} pv 
          WHERE COALESCE(pv.sale_price, pv.price) <= ${priceMax}
        )`;
      }
      if (priceCondition) {
        conditions.push(priceCondition);
      }
    }

    if (conditions.length > 0) {
      baseQuery = baseQuery.where(and(...conditions));
    }

    // Apply sorting
    switch (sortBy) {
      case 'price_asc':
        baseQuery = baseQuery.orderBy(sql`COALESCE(MIN(CASE WHEN ${productVariants.salePrice} IS NOT NULL THEN ${productVariants.salePrice} ELSE ${productVariants.price} END), 0) ASC`);
        break;
      case 'price_desc':
        baseQuery = baseQuery.orderBy(sql`COALESCE(MIN(CASE WHEN ${productVariants.salePrice} IS NOT NULL THEN ${productVariants.salePrice} ELSE ${productVariants.price} END), 0) DESC`);
        break;
      case 'latest':
        baseQuery = baseQuery.orderBy(desc(productsTable.createdAt));
        break;
      case 'oldest':
        baseQuery = baseQuery.orderBy(asc(productsTable.createdAt));
        break;
      case 'name_asc':
        baseQuery = baseQuery.orderBy(asc(productsTable.name));
        break;
      case 'name_desc':
        baseQuery = baseQuery.orderBy(desc(productsTable.name));
        break;
      default:
        baseQuery = baseQuery.orderBy(desc(productsTable.createdAt));
    }

    // Get paginated results
    const paginatedResults = await baseQuery.limit(limit).offset(offset);

    // Get total count for pagination
    const countQuery = db
      .select({ count: count() })
      .from(productsTable)
      .innerJoin(categories, eq(productsTable.categoryId, categories.id))
      .innerJoin(genders, eq(productsTable.genderId, genders.id))
      .innerJoin(brands, eq(productsTable.brandId, brands.id))
      .innerJoin(productVariants, eq(productsTable.id, productVariants.productId));

    if (conditions.length > 0) {
      countQuery.where(and(...conditions));
    }

    const [{ count: totalCount }] = await countQuery;

    // For each product, get additional images and variant summaries
    const productIds = paginatedResults.map(p => p.id);
    
    // Get all images for these products
    const allImages = productIds.length > 0 ? await db
      .select({
        productId: productImages.productId,
        url: productImages.url,
        sortOrder: productImages.sortOrder,
        isPrimary: productImages.isPrimary,
      })
      .from(productImages)
      .where(inArray(productImages.productId, productIds))
      .orderBy(productImages.sortOrder) : [];

    // Get variant summaries for these products
    const allVariants = productIds.length > 0 ? await db
      .select({
        productId: productVariants.productId,
        id: productVariants.id,
        price: productVariants.price,
        salePrice: productVariants.salePrice,
        colorId: productVariants.colorId,
        colorName: colors.name,
        colorSlug: colors.slug,
        colorHex: colors.hexCode,
        sizeId: productVariants.sizeId,
        sizeName: sizes.name,
        sizeSlug: sizes.slug,
        inStock: productVariants.inStock,
      })
      .from(productVariants)
      .innerJoin(colors, eq(productVariants.colorId, colors.id))
      .innerJoin(sizes, eq(productVariants.sizeId, sizes.id))
      .where(inArray(productVariants.productId, productIds)) : [];

    // Group images by product
    const imagesByProduct = allImages.reduce((acc, image) => {
      if (!acc[image.productId]) acc[image.productId] = [];
      acc[image.productId].push(image.url);
      return acc;
    }, {} as Record<string, string[]>);

    // Group variants by product
    const variantsByProduct = allVariants.reduce((acc, variant) => {
      if (!acc[variant.productId]) acc[variant.productId] = [];
      acc[variant.productId].push({
        id: variant.id,
        price: Number(variant.price),
        salePrice: variant.salePrice ? Number(variant.salePrice) : null,
        colorId: variant.colorId,
        colorName: variant.colorName,
        colorSlug: variant.colorSlug,
        colorHex: variant.colorHex,
        sizeId: variant.sizeId,
        sizeName: variant.sizeName,
        sizeSlug: variant.sizeSlug,
        inStock: variant.inStock,
      });
      return acc;
    }, {} as Record<string, ProductVariantSummary[]>);

    // Build final product list
    const products: ProductListItem[] = paginatedResults.map(product => ({
      id: product.id,
      name: product.name,
      description: product.description,
      categoryId: product.categoryId,
      categoryName: product.categoryName,
      genderId: product.genderId,
      genderLabel: product.genderLabel,
      brandId: product.brandId,
      brandName: product.brandName,
      isPublished: product.isPublished,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
      minPrice: Number(product.minPrice),
      maxPrice: Number(product.maxPrice),
      hasDiscount: product.hasDiscount,
      primaryImage: product.primaryImage,
      images: imagesByProduct[product.id] || [],
      variants: variantsByProduct[product.id] || [],
    }));

    const totalPages = Math.ceil(totalCount / limit);

    return {
      products,
      totalCount,
      totalPages,
      currentPage: page,
    };
  } catch (error) {
    console.error('Error fetching products:', error);
    throw new Error('Failed to fetch products');
  }
}

/**
 * Get a single product by ID with full details
 * Falls back to mock data if the ID is not a UUID or if database query fails
 */
export async function getProduct(productId: string): Promise<ProductDetail | null> {
  // First check if it's a valid UUID
  const productIdSchema = z.string().uuid();
  const isValidUUID = productIdSchema.safeParse(productId).success;

  // If not a valid UUID, try to get from mock data
  if (!isValidUUID) {
    return getProductFromMockData(productId);
  }

  try {
    // Get basic product info
    const [productResult] = await db
      .select({
        id: productsTable.id,
        name: productsTable.name,
        description: productsTable.description,
        categoryId: productsTable.categoryId,
        categoryName: categories.name,
        genderId: productsTable.genderId,
        genderLabel: genders.label,
        brandId: productsTable.brandId,
        brandName: brands.name,
        isPublished: productsTable.isPublished,
        createdAt: productsTable.createdAt,
        updatedAt: productsTable.updatedAt,
      })
      .from(productsTable)
      .innerJoin(categories, eq(productsTable.categoryId, categories.id))
      .innerJoin(genders, eq(productsTable.genderId, genders.id))
      .innerJoin(brands, eq(productsTable.brandId, brands.id))
      .where(and(
        eq(productsTable.id, productId),
        eq(productsTable.isPublished, true)
      ));

    if (!productResult) {
      return null;
    }

    // Get all variants with full details
    const allVariants = await db
      .select({
        id: productVariants.id,
        sku: productVariants.sku,
        price: productVariants.price,
        salePrice: productVariants.salePrice,
        colorId: productVariants.colorId,
        colorName: colors.name,
        colorSlug: colors.slug,
        colorHex: colors.hexCode,
        sizeId: productVariants.sizeId,
        sizeName: sizes.name,
        sizeSlug: sizes.slug,
        inStock: productVariants.inStock,
        weight: productVariants.weight,
        dimensions: productVariants.dimensions,
      })
      .from(productVariants)
      .innerJoin(colors, eq(productVariants.colorId, colors.id))
      .innerJoin(sizes, eq(productVariants.sizeId, sizes.id))
      .where(eq(productVariants.productId, productId));

    // Get all images
    const allImages = await db
      .select({
        id: productImages.id,
        url: productImages.url,
        sortOrder: productImages.sortOrder,
        isPrimary: productImages.isPrimary,
        variantId: productImages.variantId,
      })
      .from(productImages)
      .where(eq(productImages.productId, productId))
      .orderBy(productImages.sortOrder);

    // Calculate price ranges and discounts
    const prices = allVariants.map(v => Number(v.salePrice || v.price));
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    const hasDiscount = allVariants.some(v => v.salePrice !== null);
    const primaryImage = allImages.find(img => img.isPrimary)?.url || null;

    // Build variant summaries for compatibility
    const variantSummaries: ProductVariantSummary[] = allVariants.map(variant => ({
      id: variant.id,
      price: Number(variant.price),
      salePrice: variant.salePrice ? Number(variant.salePrice) : null,
      colorId: variant.colorId,
      colorName: variant.colorName,
      colorSlug: variant.colorSlug,
      colorHex: variant.colorHex,
      sizeId: variant.sizeId,
      sizeName: variant.sizeName,
      sizeSlug: variant.sizeSlug,
      inStock: variant.inStock,
    }));

    // Build detailed variant info
    const variantDetails: ProductVariantDetail[] = allVariants.map(variant => ({
      id: variant.id,
      sku: variant.sku,
      price: Number(variant.price),
      salePrice: variant.salePrice ? Number(variant.salePrice) : null,
      colorId: variant.colorId,
      colorName: variant.colorName,
      colorSlug: variant.colorSlug,
      colorHex: variant.colorHex,
      sizeId: variant.sizeId,
      sizeName: variant.sizeName,
      sizeSlug: variant.sizeSlug,
      inStock: variant.inStock,
      weight: variant.weight,
      dimensions: variant.dimensions as Record<string, unknown> | null,
    }));

    // Build detailed image info
    const imageDetails: ProductImageDetail[] = allImages.map(image => ({
      id: image.id,
      url: image.url,
      sortOrder: image.sortOrder,
      isPrimary: image.isPrimary,
      variantId: image.variantId,
    }));

    const productDetail: ProductDetail = {
      id: productResult.id,
      name: productResult.name,
      description: productResult.description,
      categoryId: productResult.categoryId,
      categoryName: productResult.categoryName,
      genderId: productResult.genderId,
      genderLabel: productResult.genderLabel,
      brandId: productResult.brandId,
      brandName: productResult.brandName,
      isPublished: productResult.isPublished,
      createdAt: productResult.createdAt,
      updatedAt: productResult.updatedAt,
      minPrice,
      maxPrice,
      hasDiscount,
      primaryImage,
      images: allImages.map(img => img.url),
      variants: variantSummaries,
      allVariants: variantDetails,
      allImages: imageDetails,
    };

    return productDetail;
  } catch (error) {
    console.error('Error fetching product from database:', error);
    // Fall back to mock data if database fails
    return getProductFromMockData(productId);
  }
}

/**
 * Get dummy reviews for mock data
 */
function getDummyReviews(): ReviewItem[] {
  return [
    {
      id: '1',
      author: 'Sarah M.',
      rating: 5,
      content: 'Absolutely love these! The comfort and style are unmatched. Perfect for daily wear and workouts.',
      createdAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
    },
    {
      id: '2',
      author: 'Mike R.',
      rating: 4,
      content: 'Great quality shoes. The fit is true to size and they look amazing. Only minor complaint is they take a bit to break in.',
      createdAt: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
    },
    {
      id: '3',
      author: 'Jessica L.',
      rating: 5,
      content: 'These exceeded my expectations! Very comfortable and stylish. I get compliments every time I wear them.',
      createdAt: new Date(Date.now() - 259200000).toISOString(), // 3 days ago
    },
  ];
}

/**
 * Get product reviews by product ID
 * Returns approved reviews sorted by newest first
 */
export async function getProductReviews(productId: string): Promise<ReviewItem[]> {
  try {
    const productIdSchema = z.string().uuid();
    const isValidUUID = productIdSchema.safeParse(productId).success;
    
    // If not a valid UUID, return dummy reviews
    if (!isValidUUID) {
      return getDummyReviews();
    }

    const reviewsResult = await db
      .select({
        id: reviews.id,
        rating: reviews.rating,
        comment: reviews.comment,
        createdAt: reviews.createdAt,
        authorName: user.name,
        authorEmail: user.email,
      })
      .from(reviews)
      .innerJoin(user, eq(reviews.userId, user.id))
      .where(eq(reviews.productId, productId))
      .orderBy(desc(reviews.createdAt))
      .limit(10);

    return reviewsResult.map(review => ({
      id: review.id,
      author: review.authorName || review.authorEmail.split('@')[0] || 'Anonymous',
      rating: review.rating,
      content: review.comment || '',
      createdAt: review.createdAt.toISOString(),
    }));
  } catch (error) {
    console.error('Error fetching product reviews:', error);
    // Return dummy reviews if no data exists or error occurs
    return getDummyReviews();
  }
}

/**
 * Get recommended products based on the current product
 * Returns products from the same category/brand/gender
 */
export async function getRecommendedProducts(productId: string): Promise<RecommendedProduct[]> {
  try {
    const productIdSchema = z.string().uuid();
    const isValidUUID = productIdSchema.safeParse(productId).success;
    
    // If not a valid UUID, return empty array
    if (!isValidUUID) {
      return [];
    }

    // First get the current product's details
    const currentProduct = await db
      .select({
        categoryId: productsTable.categoryId,
        brandId: productsTable.brandId,
        genderId: productsTable.genderId,
      })
      .from(productsTable)
      .where(eq(productsTable.id, productId))
      .limit(1);

    if (!currentProduct[0]) {
      return [];
    }

    const { categoryId, brandId, genderId } = currentProduct[0];

    // Get recommended products from same category, brand, or gender
    const recommendedResult = await db
      .select({
        id: productsTable.id,
        name: productsTable.name,
        categoryName: categories.name,
        brandName: brands.name,
        genderLabel: genders.label,
      })
      .from(productsTable)
      .innerJoin(categories, eq(productsTable.categoryId, categories.id))
      .innerJoin(brands, eq(productsTable.brandId, brands.id))
      .innerJoin(genders, eq(productsTable.genderId, genders.id))
      .where(
        and(
          eq(productsTable.isPublished, true),
          or(
            eq(productsTable.categoryId, categoryId),
            eq(productsTable.brandId, brandId),
            eq(productsTable.genderId, genderId)
          ),
          // Exclude current product
          sql`${productsTable.id} != ${productId}`
        )
      )
      .limit(6);

    // For each recommended product, get pricing and primary image
    const recommendedProducts: RecommendedProduct[] = [];

    for (const product of recommendedResult) {
      // Get the first variant for pricing
      const variant = await db
        .select({
          price: productVariants.price,
          salePrice: productVariants.salePrice,
        })
        .from(productVariants)
        .where(eq(productVariants.productId, product.id))
        .limit(1);

      // Get primary image or first image
      const image = await db
        .select({
          url: productImages.url,
        })
        .from(productImages)
        .where(eq(productImages.productId, product.id))
        .orderBy(
          sql`CASE WHEN ${productImages.isPrimary} = true THEN 0 ELSE 1 END`,
          productImages.sortOrder
        )
        .limit(1);

      if (variant[0] && image[0]) {
        recommendedProducts.push({
          id: product.id,
          title: product.name,
          price: Number(variant[0].price),
          salePrice: variant[0].salePrice ? Number(variant[0].salePrice) : undefined,
          mainImage: image[0].url,
          category: product.categoryName,
          brand: product.brandName,
          gender: product.genderLabel,
        });
      }
    }

    return recommendedProducts.slice(0, 4); // Limit to 4 products
  } catch (error) {
    console.error('Error fetching recommended products:', error);
    return [];
  }
}
