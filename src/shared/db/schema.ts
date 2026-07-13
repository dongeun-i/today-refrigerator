import type { SQLiteDatabase } from 'expo-sqlite';

export async function initializeDatabase(db: SQLiteDatabase) {
  await db.execAsync(`
    PRAGMA journal_mode = WAL;
    PRAGMA foreign_keys = ON;

    CREATE TABLE IF NOT EXISTS categories (
      id TEXT PRIMARY KEY NOT NULL,
      name TEXT NOT NULL,
      icon TEXT NOT NULL,
      default_storage TEXT,
      sort_order INTEGER NOT NULL DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS shopping_trips (
      id TEXT PRIMARY KEY NOT NULL,
      title TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'planned',
      budget INTEGER,
      total_spent INTEGER,
      created_at TEXT NOT NULL DEFAULT (datetime('now', 'localtime')),
      completed_at TEXT
    );

    CREATE TABLE IF NOT EXISTS shopping_items (
      id TEXT PRIMARY KEY NOT NULL,
      trip_id TEXT NOT NULL,
      category_id TEXT,
      name TEXT NOT NULL,
      quantity INTEGER NOT NULL DEFAULT 1,
      unit TEXT NOT NULL DEFAULT '개',
      note TEXT,
      checked INTEGER NOT NULL DEFAULT 0,
      price INTEGER,
      created_at TEXT NOT NULL DEFAULT (datetime('now', 'localtime')),
      FOREIGN KEY (trip_id) REFERENCES shopping_trips(id) ON DELETE CASCADE,
      FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
    );

    CREATE TABLE IF NOT EXISTS receipts (
      id TEXT PRIMARY KEY NOT NULL,
      trip_id TEXT NOT NULL,
      image_uri TEXT,
      store_name TEXT,
      total_amount INTEGER,
      purchased_at TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now', 'localtime')),
      FOREIGN KEY (trip_id) REFERENCES shopping_trips(id) ON DELETE CASCADE
    );
  `);

  await migrate(db);
  await seedCategories(db);
}

async function migrate(db: SQLiteDatabase) {
  // shopping_items에 price 컬럼 추가 (v2)
  const columns = await db.getAllAsync<{ name: string }>(
    "PRAGMA table_info('shopping_items')"
  );
  const hasPrice = columns.some((c) => c.name === 'price');
  if (!hasPrice) {
    await db.execAsync('ALTER TABLE shopping_items ADD COLUMN price INTEGER');
  }
}

async function seedCategories(db: SQLiteDatabase) {
  const existing = await db.getFirstAsync<{ count: number }>(
    'SELECT COUNT(*) as count FROM categories'
  );
  if (existing && existing.count > 0) return;

  const categories = [
    { id: 'vegetable', name: '채소', icon: 'LeafyGreen', default_storage: '냉장', sort_order: 1 },
    { id: 'fruit', name: '과일', icon: 'Apple', default_storage: '냉장', sort_order: 2 },
    { id: 'meat', name: '정육', icon: 'Beef', default_storage: '냉장', sort_order: 3 },
    { id: 'seafood', name: '수산/해산물', icon: 'Fish', default_storage: '냉장', sort_order: 4 },
    { id: 'dairy', name: '유제품/계란', icon: 'Milk', default_storage: '냉장', sort_order: 5 },
    { id: 'bean', name: '두부/콩류', icon: 'Bean', default_storage: '냉장', sort_order: 6 },
    { id: 'frozen', name: '냉동식품', icon: 'Snowflake', default_storage: '냉동', sort_order: 7 },
    { id: 'grain', name: '쌀/잡곡', icon: 'Wheat', default_storage: '실온', sort_order: 8 },
    { id: 'noodle', name: '면/파스타', icon: 'Soup', default_storage: '실온', sort_order: 9 },
    { id: 'bakery', name: '빵/베이커리', icon: 'Croissant', default_storage: '실온', sort_order: 10 },
    { id: 'seasoning', name: '양념/조미료', icon: 'Drumstick', default_storage: '실온', sort_order: 11 },
    { id: 'sauce', name: '소스/오일', icon: 'Droplet', default_storage: '실온', sort_order: 12 },
    { id: 'canned', name: '통조림/캔', icon: 'Package', default_storage: '실온', sort_order: 13 },
    { id: 'beverage', name: '음료', icon: 'CupSoda', default_storage: '실온', sort_order: 14 },
    { id: 'alcohol', name: '주류', icon: 'Wine', default_storage: '냉장', sort_order: 15 },
    { id: 'coffee', name: '커피/차', icon: 'Coffee', default_storage: '실온', sort_order: 16 },
    { id: 'snack', name: '과자/간식', icon: 'Cookie', default_storage: '실온', sort_order: 17 },
    { id: 'health', name: '건강식품/보충제', icon: 'Pill', default_storage: '실온', sort_order: 18 },
    { id: 'deli', name: '반찬/델리', icon: 'Salad', default_storage: '냉장', sort_order: 19 },
    { id: 'household', name: '생활용품', icon: 'SprayCan', default_storage: null, sort_order: 20 },
    { id: 'kitchen', name: '주방용품', icon: 'SoapDispenserDroplet', default_storage: null, sort_order: 21 },
    { id: 'pet', name: '반려동물', icon: 'PawPrint', default_storage: null, sort_order: 22 },
    { id: 'baby', name: '유아용품', icon: 'Baby', default_storage: null, sort_order: 23 },
    { id: 'etc', name: '기타', icon: 'Box', default_storage: null, sort_order: 24 },
  ];

  const stmt = await db.prepareAsync(
    'INSERT INTO categories (id, name, icon, default_storage, sort_order) VALUES ($id, $name, $icon, $storage, $order)'
  );
  try {
    for (const cat of categories) {
      await stmt.executeAsync({
        $id: cat.id,
        $name: cat.name,
        $icon: cat.icon,
        $storage: cat.default_storage,
        $order: cat.sort_order,
      });
    }
  } finally {
    await stmt.finalizeAsync();
  }
}
