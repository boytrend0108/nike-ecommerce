export interface MockProduct {
  id: string;
  name: string;
  description: string;
  categoryId: string;
  categoryName: string;
  genderId: string;
  genderSlug: string;
  genderLabel: string;
  brandId: string;
  brandName: string;
  isPublished: boolean;
  createdAt: string;
  variants: MockVariant[];
  images: string[];
  minPrice: number;
  maxPrice: number;
  hasDiscount: boolean;
}

export interface MockVariant {
  id: string;
  productId: string;
  sku: string;
  price: number;
  salePrice?: number;
  colorId: string;
  colorName: string;
  colorSlug: string;
  colorHex: string;
  sizeId: string;
  sizeName: string;
  sizeSlug: string;
  inStock: number;
  weight: number;
}

export const mockProducts: MockProduct[] = [
  {
    id: "1",
    name: "Nike Air Force 1 Mid '07",
    description: "The radiance lives on in the Nike Air Force 1 Mid '07, the basketball original that puts a fresh spin on what you know best.",
    categoryId: "cat-1",
    categoryName: "Basketball",
    genderId: "gen-1",
    genderSlug: "men",
    genderLabel: "Men",
    brandId: "brand-1",
    brandName: "Nike",
    isPublished: true,
    createdAt: "2024-01-15T00:00:00Z",
    images: ["/shoes/shoe-1.jpg", "/shoes/shoe-2.webp", "/shoes/shoe-3.webp"],
    minPrice: 98.30,
    maxPrice: 98.30,
    hasDiscount: false,
    variants: [
      {
        id: "var-1-1",
        productId: "1",
        sku: "AF1-MID-WHT-8",
        price: 98.30,
        colorId: "col-1",
        colorName: "White",
        colorSlug: "white",
        colorHex: "#FFFFFF",
        sizeId: "size-1",
        sizeName: "8",
        sizeSlug: "8",
        inStock: 15,
        weight: 1.2
      },
      {
        id: "var-1-2",
        productId: "1",
        sku: "AF1-MID-WHT-9",
        price: 98.30,
        colorId: "col-1",
        colorName: "White",
        colorSlug: "white",
        colorHex: "#FFFFFF",
        sizeId: "size-2",
        sizeName: "9",
        sizeSlug: "9",
        inStock: 12,
        weight: 1.2
      },
      {
        id: "var-1-3",
        productId: "1",
        sku: "AF1-MID-BLK-8",
        price: 98.30,
        colorId: "col-2",
        colorName: "Black",
        colorSlug: "black",
        colorHex: "#000000",
        sizeId: "size-1",
        sizeName: "8",
        sizeSlug: "8",
        inStock: 10,
        weight: 1.2
      },
      {
        id: "var-1-4",
        productId: "1",
        sku: "AF1-MID-BLK-9",
        price: 98.30,
        colorId: "col-2",
        colorName: "Black",
        colorSlug: "black",
        colorHex: "#000000",
        sizeId: "size-2",
        sizeName: "9",
        sizeSlug: "9",
        inStock: 8,
        weight: 1.2
      },
      {
        id: "var-1-5",
        productId: "1",
        sku: "AF1-MID-RED-8",
        price: 98.30,
        colorId: "col-3",
        colorName: "Red",
        colorSlug: "red",
        colorHex: "#DC2626",
        sizeId: "size-1",
        sizeName: "8",
        sizeSlug: "8",
        inStock: 5,
        weight: 1.2
      },
      {
        id: "var-1-6",
        productId: "1",
        sku: "AF1-MID-RED-9",
        price: 98.30,
        colorId: "col-3",
        colorName: "Red",
        colorSlug: "red",
        colorHex: "#DC2626",
        sizeId: "size-2",
        sizeName: "9",
        sizeSlug: "9",
        inStock: 3,
        weight: 1.2
      },
      {
        id: "var-1-7",
        productId: "1",
        sku: "AF1-MID-WHT-10",
        price: 98.30,
        colorId: "col-1",
        colorName: "White",
        colorSlug: "white",
        colorHex: "#FFFFFF",
        sizeId: "size-3",
        sizeName: "10",
        sizeSlug: "10",
        inStock: 7,
        weight: 1.2
      },
      {
        id: "var-1-8",
        productId: "1",
        sku: "AF1-MID-WHT-11",
        price: 98.30,
        colorId: "col-1",
        colorName: "White",
        colorSlug: "white",
        colorHex: "#FFFFFF",
        sizeId: "size-4",
        sizeName: "11",
        sizeSlug: "11",
        inStock: 0,
        weight: 1.2
      }
    ]
  },
  {
    id: "2",
    name: "Nike Court Vision Low Next Nature",
    description: "Made with at least 20% recycled content by weight, the Court Vision Low Next Nature features crisp overlays and classic basketball styling.",
    categoryId: "cat-1",
    categoryName: "Basketball",
    genderId: "gen-1",
    genderSlug: "men",
    genderLabel: "Men",
    brandId: "brand-1",
    brandName: "Nike",
    isPublished: true,
    createdAt: "2024-01-10T00:00:00Z",
    images: ["/shoes/shoe-2.webp"],
    minPrice: 86.30,
    maxPrice: 86.30,
    hasDiscount: true,
    variants: [
      {
        id: "var-2-1",
        productId: "2",
        sku: "CV-LOW-BLK-8",
        price: 86.30,
        salePrice: 69.04,
        colorId: "col-2",
        colorName: "Black",
        colorSlug: "black",
        colorHex: "#000000",
        sizeId: "size-1",
        sizeName: "8",
        sizeSlug: "8",
        inStock: 8,
        weight: 1.1
      }
    ]
  },
  {
    id: "3",
    name: "Nike Air Force 1 PLT.AFRM",
    description: "Created for the hardwood but taken to the streets, the '80s b-ball icon returns with classic details and throwback hoops flair.",
    categoryId: "cat-1",
    categoryName: "Basketball",
    genderId: "gen-1",
    genderSlug: "men",
    genderLabel: "Men",
    brandId: "brand-1",
    brandName: "Nike",
    isPublished: true,
    createdAt: "2024-01-08T00:00:00Z",
    images: ["/shoes/shoe-3.webp"],
    minPrice: 98.30,
    maxPrice: 98.30,
    hasDiscount: false,
    variants: [
      {
        id: "var-3-1",
        productId: "3",
        sku: "AF1-PLT-GRN-9",
        price: 98.30,
        colorId: "col-3",
        colorName: "Green",
        colorSlug: "green",
        colorHex: "#00A86B",
        sizeId: "size-2",
        sizeName: "9",
        sizeSlug: "9",
        inStock: 5,
        weight: 1.2
      }
    ]
  },
  {
    id: "4",
    name: "Nike Dunk Low Retro",
    description: "Created for the hardwood but taken to the streets, the basketball icon returns with perfectly aged overlays and original university colors.",
    categoryId: "cat-1",
    categoryName: "Basketball",
    genderId: "gen-1",
    genderSlug: "men",
    genderLabel: "Men",
    brandId: "brand-1",
    brandName: "Nike",
    isPublished: true,
    createdAt: "2024-01-05T00:00:00Z",
    images: ["/shoes/shoe-4.webp"],
    minPrice: 98.30,
    maxPrice: 98.30,
    hasDiscount: false,
    variants: [
      {
        id: "var-4-1",
        productId: "4",
        sku: "DL-RETRO-YEL-10",
        price: 98.30,
        colorId: "col-4",
        colorName: "Yellow",
        colorSlug: "yellow",
        colorHex: "#FFD700",
        sizeId: "size-3",
        sizeName: "10",
        sizeSlug: "10",
        inStock: 7,
        weight: 1.0
      }
    ]
  },
  {
    id: "5",
    name: "Nike Air Max SYSTM",
    description: "The Nike Air Max SYSTM combines classic running style with the comfort of Max Air cushioning for all-day wear.",
    categoryId: "cat-2",
    categoryName: "Running",
    genderId: "gen-1",
    genderSlug: "men",
    genderLabel: "Men",
    brandId: "brand-1",
    brandName: "Nike",
    isPublished: true,
    createdAt: "2024-01-03T00:00:00Z",
    images: ["/shoes/shoe-5.avif"],
    minPrice: 86.30,
    maxPrice: 86.30,
    hasDiscount: true,
    variants: [
      {
        id: "var-5-1",
        productId: "5",
        sku: "AM-SYSTM-RED-9",
        price: 86.30,
        salePrice: 69.04,
        colorId: "col-5",
        colorName: "Red",
        colorSlug: "red",
        colorHex: "#FF0000",
        sizeId: "size-2",
        sizeName: "9",
        sizeSlug: "9",
        inStock: 10,
        weight: 1.3
      }
    ]
  },
  {
    id: "6",
    name: "Nike Dunk Low Retro SE",
    description: "Created for the hardwood but taken to the streets, this special edition brings fresh color combinations to the iconic silhouette.",
    categoryId: "cat-1",
    categoryName: "Basketball",
    genderId: "gen-1",
    genderSlug: "men",
    genderLabel: "Men",
    brandId: "brand-1",
    brandName: "Nike",
    isPublished: true,
    createdAt: "2024-01-01T00:00:00Z",
    images: ["/shoes/shoe-6.avif"],
    minPrice: 98.30,
    maxPrice: 98.30,
    hasDiscount: false,
    variants: [
      {
        id: "var-6-1",
        productId: "6",
        sku: "DL-SE-BEI-8.5",
        price: 98.30,
        colorId: "col-6",
        colorName: "Beige",
        colorSlug: "beige",
        colorHex: "#F5F5DC",
        sizeId: "size-4",
        sizeName: "8.5",
        sizeSlug: "8-5",
        inStock: 6,
        weight: 1.0
      }
    ]
  },
  {
    id: "7",
    name: "Nike Air Max 90 SE",
    description: "Nothing as fly, nothing as comfortable, nothing as proven. The Nike Air Max 90 stays true to its OG running roots with the iconic Waffle outsole.",
    categoryId: "cat-2",
    categoryName: "Running",
    genderId: "gen-1",
    genderSlug: "men",
    genderLabel: "Men",
    brandId: "brand-1",
    brandName: "Nike",
    isPublished: true,
    createdAt: "2023-12-28T00:00:00Z",
    images: ["/shoes/shoe-7.avif"],
    minPrice: 86.30,
    maxPrice: 86.30,
    hasDiscount: false,
    variants: [
      {
        id: "var-7-1",
        productId: "7",
        sku: "AM90-SE-ORG-9",
        price: 86.30,
        colorId: "col-7",
        colorName: "Orange",
        colorSlug: "orange",
        colorHex: "#FFA500",
        sizeId: "size-2",
        sizeName: "9",
        sizeSlug: "9",
        inStock: 9,
        weight: 1.4
      }
    ]
  },
  {
    id: "8",
    name: "Nike Legend Essential 3 Next Nature",
    description: "Flexible and supportive, the Nike Legend Essential 3 Next Nature helps keep you stable during your workout.",
    categoryId: "cat-3",
    categoryName: "Training",
    genderId: "gen-1",
    genderSlug: "men",
    genderLabel: "Men",
    brandId: "brand-1",
    brandName: "Nike",
    isPublished: true,
    createdAt: "2023-12-25T00:00:00Z",
    images: ["/shoes/shoe-8.avif"],
    minPrice: 98.30,
    maxPrice: 98.30,
    hasDiscount: false,
    variants: [
      {
        id: "var-8-1",
        productId: "8",
        sku: "LE3-NN-BLU-10",
        price: 98.30,
        colorId: "col-8",
        colorName: "Blue",
        colorSlug: "blue",
        colorHex: "#0000FF",
        sizeId: "size-3",
        sizeName: "10",
        sizeSlug: "10",
        inStock: 11,
        weight: 1.1
      }
    ]
  },
  {
    id: "9",
    name: "Nike SB Zoom Janoski OG+",
    description: "The Nike SB Zoom Janoski OG+ updates the iconic design with enhanced comfort and improved board feel.",
    categoryId: "cat-4",
    categoryName: "Skateboarding",
    genderId: "gen-1",
    genderSlug: "men",
    genderLabel: "Men",
    brandId: "brand-1",
    brandName: "Nike",
    isPublished: true,
    createdAt: "2023-12-22T00:00:00Z",
    images: ["/shoes/shoe-9.avif"],
    minPrice: 98.30,
    maxPrice: 98.30,
    hasDiscount: false,
    variants: [
      {
        id: "var-9-1",
        productId: "9",
        sku: "SB-JAN-TAN-9",
        price: 98.30,
        colorId: "col-9",
        colorName: "Tan",
        colorSlug: "tan",
        colorHex: "#D2B48C",
        sizeId: "size-2",
        sizeName: "9",
        sizeSlug: "9",
        inStock: 4,
        weight: 0.9
      }
    ]
  },
  {
    id: "10",
    name: "Jordan Series ES",
    description: "Simple, clean and comfortable, the Jordan Series ES brings Jordan style to your everyday wardrobe.",
    categoryId: "cat-5",
    categoryName: "Lifestyle",
    genderId: "gen-1",
    genderSlug: "men",
    genderLabel: "Men",
    brandId: "brand-2",
    brandName: "Jordan",
    isPublished: true,
    createdAt: "2023-12-20T00:00:00Z",
    images: ["/shoes/shoe-10.avif"],
    minPrice: 86.30,
    maxPrice: 86.30,
    hasDiscount: true,
    variants: [
      {
        id: "var-10-1",
        productId: "10",
        sku: "JS-ES-GRN-8",
        price: 86.30,
        salePrice: 69.04,
        colorId: "col-10",
        colorName: "Olive",
        colorSlug: "olive",
        colorHex: "#808000",
        sizeId: "size-1",
        sizeName: "8",
        sizeSlug: "8",
        inStock: 13,
        weight: 1.2
      }
    ]
  },
  {
    id: "11",
    name: "Nike Blazer Low '77 Jumbo",
    description: "The Nike Blazer Low '77 Jumbo brings a lifted look to the vintage basketball design with an oversized Swoosh.",
    categoryId: "cat-5",
    categoryName: "Lifestyle",
    genderId: "gen-2",
    genderSlug: "women",
    genderLabel: "Women",
    brandId: "brand-1",
    brandName: "Nike",
    isPublished: true,
    createdAt: "2023-12-18T00:00:00Z",
    images: ["/shoes/shoe-11.avif"],
    minPrice: 98.30,
    maxPrice: 98.30,
    hasDiscount: false,
    variants: [
      {
        id: "var-11-1",
        productId: "11",
        sku: "BL-JUM-WHT-7",
        price: 98.30,
        colorId: "col-1",
        colorName: "White",
        colorSlug: "white",
        colorHex: "#FFFFFF",
        sizeId: "size-5",
        sizeName: "7",
        sizeSlug: "7",
        inStock: 8,
        weight: 1.0
      }
    ]
  },
  {
    id: "12",
    name: "Nike Air Force 1 PLT.AFRM",
    description: "Created for the hardwood but taken to the streets, this women's version features platform styling for added height.",
    categoryId: "cat-1",
    categoryName: "Basketball",
    genderId: "gen-2",
    genderSlug: "women",
    genderLabel: "Women",
    brandId: "brand-1",
    brandName: "Nike",
    isPublished: true,
    createdAt: "2023-12-15T00:00:00Z",
    images: ["/shoes/shoe-12.avif"],
    minPrice: 98.30,
    maxPrice: 98.30,
    hasDiscount: false,
    variants: [
      {
        id: "var-12-1",
        productId: "12",
        sku: "AF1-PLT-PNK-8",
        price: 98.30,
        colorId: "col-11",
        colorName: "Pink",
        colorSlug: "pink",
        colorHex: "#FFC0CB",
        sizeId: "size-1",
        sizeName: "8",
        sizeSlug: "8",
        inStock: 6,
        weight: 1.3
      }
    ]
  },
  {
    id: "13",
    name: "Nike Air Max 270",
    description: "The Nike Air Max 270 delivers visible cushioning under every step with the largest Max Air unit yet.",
    categoryId: "cat-2",
    categoryName: "Running",
    genderId: "gen-2",
    genderSlug: "women",
    genderLabel: "Women",
    brandId: "brand-1",
    brandName: "Nike",
    isPublished: true,
    createdAt: "2023-12-12T00:00:00Z",
    images: ["/shoes/shoe-13.avif"],
    minPrice: 110.00,
    maxPrice: 110.00,
    hasDiscount: true,
    variants: [
      {
        id: "var-13-1",
        productId: "13",
        sku: "AM270-WHT-7",
        price: 110.00,
        salePrice: 88.00,
        colorId: "col-1",
        colorName: "White",
        colorSlug: "white",
        colorHex: "#FFFFFF",
        sizeId: "size-5",
        sizeName: "7",
        sizeSlug: "7",
        inStock: 12,
        weight: 1.1
      }
    ]
  },
  {
    id: "14",
    name: "Nike Dunk Low",
    description: "Created for the hardwood but taken to the streets, the basketball icon returns with crisp overlays and classic team colors.",
    categoryId: "cat-1",
    categoryName: "Basketball",
    genderId: "gen-2",
    genderSlug: "women",
    genderLabel: "Women",
    brandId: "brand-1",
    brandName: "Nike",
    isPublished: true,
    createdAt: "2023-12-10T00:00:00Z",
    images: ["/shoes/shoe-14.avif"],
    minPrice: 90.00,
    maxPrice: 90.00,
    hasDiscount: false,
    variants: [
      {
        id: "var-14-1",
        productId: "14",
        sku: "DL-PUR-6.5",
        price: 90.00,
        colorId: "col-12",
        colorName: "Purple",
        colorSlug: "purple",
        colorHex: "#800080",
        sizeId: "size-6",
        sizeName: "6.5",
        sizeSlug: "6-5",
        inStock: 8,
        weight: 1.0
      }
    ]
  },
  {
    id: "15",
    name: "Nike Air Force 1 Low",
    description: "The radiance lives on in the Nike Air Force 1 Low, the basketball original that puts a fresh spin on what you know best.",
    categoryId: "cat-1",
    categoryName: "Basketball",
    genderId: "gen-3",
    genderSlug: "kids",
    genderLabel: "Kids",
    brandId: "brand-1",
    brandName: "Nike",
    isPublished: true,
    createdAt: "2023-12-08T00:00:00Z",
    images: ["/shoes/shoe-15.avif"],
    minPrice: 65.00,
    maxPrice: 65.00,
    hasDiscount: false,
    variants: [
      {
        id: "var-15-1",
        productId: "15",
        sku: "AF1-KID-WHT-3Y",
        price: 65.00,
        colorId: "col-1",
        colorName: "White",
        colorSlug: "white",
        colorHex: "#FFFFFF",
        sizeId: "size-7",
        sizeName: "3Y",
        sizeSlug: "3y",
        inStock: 15,
        weight: 0.8
      }
    ]
  }
];

// Filter options derived from mock data
export const mockFilters = {
  genders: [
    { id: "gen-1", label: "Men", slug: "men" },
    { id: "gen-2", label: "Women", slug: "women" },
    { id: "gen-3", label: "Kids", slug: "kids" }
  ],
  colors: [
    { id: "col-1", name: "White", slug: "white", hexCode: "#FFFFFF" },
    { id: "col-2", name: "Black", slug: "black", hexCode: "#000000" },
    { id: "col-3", name: "Green", slug: "green", hexCode: "#00A86B" },
    { id: "col-4", name: "Yellow", slug: "yellow", hexCode: "#FFD700" },
    { id: "col-5", name: "Red", slug: "red", hexCode: "#FF0000" },
    { id: "col-6", name: "Beige", slug: "beige", hexCode: "#F5F5DC" },
    { id: "col-7", name: "Orange", slug: "orange", hexCode: "#FFA500" },
    { id: "col-8", name: "Blue", slug: "blue", hexCode: "#0000FF" },
    { id: "col-9", name: "Tan", slug: "tan", hexCode: "#D2B48C" },
    { id: "col-10", name: "Olive", slug: "olive", hexCode: "#808000" },
    { id: "col-11", name: "Pink", slug: "pink", hexCode: "#FFC0CB" },
    { id: "col-12", name: "Purple", slug: "purple", hexCode: "#800080" }
  ],
  sizes: [
    { id: "size-5", name: "7", slug: "7", sortOrder: 0 },
    { id: "size-1", name: "8", slug: "8", sortOrder: 1 },
    { id: "size-4", name: "8.5", slug: "8-5", sortOrder: 2 },
    { id: "size-2", name: "9", slug: "9", sortOrder: 3 },
    { id: "size-3", name: "10", slug: "10", sortOrder: 4 },
    { id: "size-6", name: "6.5", slug: "6-5", sortOrder: -1 },
    { id: "size-7", name: "3Y", slug: "3y", sortOrder: -2 }
  ],
  priceRanges: [
    { label: "Under $50", value: "0-50" },
    { label: "$50 - $100", value: "50-100" },
    { label: "$100 - $150", value: "100-150" },
    { label: "Over $150", value: "150-999" }
  ]
};

export const sortOptions = [
  { label: "Featured", value: "featured" },
  { label: "Newest", value: "newest" },
  { label: "Price: Low to High", value: "price_asc" },
  { label: "Price: High to Low", value: "price_desc" }
];
