import { sql } from 'drizzle-orm';
import { db } from '../src/lib/db';

async function dropProductTables() {
  try {
    console.log('🗑️  Starting to drop product-related tables...');
    console.log('⚠️  This will remove all product data but keep auth tables intact.');

    // Drop tables in correct order (child tables first due to foreign key constraints)
    const tablesToDrop = [
      'product_variants',
      'product_images', 
      'products_to_collections',
      'cart_items',
      'order_items',
      'reviews',
      'products',
      'brands',
      'categories',
      'collections',
      'coupons',
      'genders',
      'colors',
      'sizes',
      'wishlists',
      'carts',
      'orders',
      'payments'
    ];

    for (const tableName of tablesToDrop) {
      try {
        console.log(`🗑️  Dropping table: ${tableName}`);
        await db.execute(sql.raw(`DROP TABLE IF EXISTS "${tableName}" CASCADE`));
        console.log(`✅ Dropped table: ${tableName}`);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        console.log(`⚠️  Table ${tableName} might not exist or already dropped: ${errorMessage}`);
      }
    }

    console.log('✅ All product-related tables have been dropped!');
    console.log('🔒 Auth tables (user, session, account, verification, guest) remain intact.');

  } catch (error) {
    console.error('❌ Error dropping tables:', error);
    process.exit(1);
  }
}

// Run the drop function
dropProductTables()
  .then(() => {
    console.log('🎉 Drop tables process finished!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Drop tables process failed:', error);
    process.exit(1);
  });
