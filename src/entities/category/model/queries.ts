import type { SQLiteDatabase } from 'expo-sqlite';

import type { Category } from './types';

export async function getCategories(db: SQLiteDatabase): Promise<Category[]> {
  return db.getAllAsync<Category>('SELECT * FROM categories ORDER BY sort_order ASC');
}
