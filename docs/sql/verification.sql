SELECT count(*) AS products_count FROM products;
SELECT count(*) AS variants_count FROM product_variants;
SELECT count(*) AS images_count FROM product_images;

SELECT column_name
FROM information_schema.columns
WHERE table_name='products'
  AND column_name IN ('category_id', 'gender_id', 'brand_id', 'is_published', 'default_variant_id');

SELECT p.name, v.sku, v.price, v.sale_price, i.url
FROM products p
JOIN product_variants v ON v.product_id = p.id
LEFT JOIN product_images i ON i.variant_id = v.id
LIMIT 10;
