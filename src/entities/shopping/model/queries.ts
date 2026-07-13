import * as crypto from 'expo-crypto';
import type { SQLiteDatabase } from 'expo-sqlite';

import type { ShoppingItem, ShoppingTrip, TripStatus } from './types';

function uuid() {
  return crypto.randomUUID();
}

// ─── Trips ───

export async function getTrips(db: SQLiteDatabase): Promise<ShoppingTrip[]> {
  return db.getAllAsync<ShoppingTrip>(
    'SELECT * FROM shopping_trips ORDER BY created_at DESC'
  );
}

export async function getActiveTrips(db: SQLiteDatabase): Promise<ShoppingTrip[]> {
  return db.getAllAsync<ShoppingTrip>(
    "SELECT * FROM shopping_trips WHERE status != 'completed' ORDER BY created_at DESC"
  );
}

export async function getCompletedTrips(db: SQLiteDatabase): Promise<ShoppingTrip[]> {
  return db.getAllAsync<ShoppingTrip>(
    "SELECT * FROM shopping_trips WHERE status = 'completed' ORDER BY completed_at DESC"
  );
}

export async function getTripById(db: SQLiteDatabase, id: string): Promise<ShoppingTrip | null> {
  return db.getFirstAsync<ShoppingTrip>('SELECT * FROM shopping_trips WHERE id = $id', { $id: id });
}

export async function createTrip(
  db: SQLiteDatabase,
  data: { title: string; budget?: number }
): Promise<string> {
  const id = uuid();
  await db.runAsync(
    'INSERT INTO shopping_trips (id, title, budget) VALUES ($id, $title, $budget)',
    { $id: id, $title: data.title, $budget: data.budget ?? null }
  );
  return id;
}

export async function updateTripTitle(
  db: SQLiteDatabase,
  id: string,
  title: string
): Promise<void> {
  await db.runAsync(
    'UPDATE shopping_trips SET title = $title WHERE id = $id',
    { $id: id, $title: title }
  );
}

export async function updateTripBudget(
  db: SQLiteDatabase,
  id: string,
  budget: number | null
): Promise<void> {
  await db.runAsync(
    'UPDATE shopping_trips SET budget = $budget WHERE id = $id',
    { $id: id, $budget: budget }
  );
}

export async function updateTripStatus(
  db: SQLiteDatabase,
  id: string,
  status: TripStatus
): Promise<void> {
  const completedAt = status === 'completed' ? new Date().toISOString() : null;
  await db.runAsync(
    'UPDATE shopping_trips SET status = $status, completed_at = $completedAt WHERE id = $id',
    { $id: id, $status: status, $completedAt: completedAt }
  );
}

export async function updateTripSpent(
  db: SQLiteDatabase,
  id: string,
  totalSpent: number
): Promise<void> {
  await db.runAsync(
    'UPDATE shopping_trips SET total_spent = $spent WHERE id = $id',
    { $id: id, $spent: totalSpent }
  );
}

export async function deleteTrip(db: SQLiteDatabase, id: string): Promise<void> {
  await db.runAsync('DELETE FROM shopping_trips WHERE id = $id', { $id: id });
}

// ─── Items ───

export async function getItemsByTrip(db: SQLiteDatabase, tripId: string): Promise<ShoppingItem[]> {
  return db.getAllAsync<ShoppingItem>(
    'SELECT * FROM shopping_items WHERE trip_id = $tripId ORDER BY created_at ASC',
    { $tripId: tripId }
  );
}

export async function createItem(
  db: SQLiteDatabase,
  data: {
    trip_id: string;
    name: string;
    quantity?: number;
    unit?: string;
    category_id?: string;
    note?: string;
  }
): Promise<string> {
  const id = uuid();
  await db.runAsync(
    `INSERT INTO shopping_items (id, trip_id, name, quantity, unit, category_id, note)
     VALUES ($id, $tripId, $name, $qty, $unit, $catId, $note)`,
    {
      $id: id,
      $tripId: data.trip_id,
      $name: data.name,
      $qty: data.quantity ?? 1,
      $unit: data.unit ?? '개',
      $catId: data.category_id ?? null,
      $note: data.note ?? null,
    }
  );
  return id;
}

export async function toggleItem(db: SQLiteDatabase, id: string): Promise<void> {
  await db.runAsync(
    'UPDATE shopping_items SET checked = CASE WHEN checked = 0 THEN 1 ELSE 0 END WHERE id = $id',
    { $id: id }
  );
}

export async function updateItem(
  db: SQLiteDatabase,
  id: string,
  data: { name?: string; quantity?: number; unit?: string; note?: string }
): Promise<void> {
  const fields: string[] = [];
  const params: Record<string, string | number | null> = { $id: id };
  if (data.name !== undefined) { fields.push('name = $name'); params.$name = data.name; }
  if (data.quantity !== undefined) { fields.push('quantity = $qty'); params.$qty = data.quantity; }
  if (data.unit !== undefined) { fields.push('unit = $unit'); params.$unit = data.unit; }
  if (data.note !== undefined) { fields.push('note = $note'); params.$note = data.note; }
  if (fields.length === 0) return;
  await db.runAsync(`UPDATE shopping_items SET ${fields.join(', ')} WHERE id = $id`, params);
}

export async function updateItemPrice(
  db: SQLiteDatabase,
  id: string,
  price: number
): Promise<void> {
  await db.runAsync(
    'UPDATE shopping_items SET price = $price WHERE id = $id',
    { $id: id, $price: price }
  );
}

export async function deleteItem(db: SQLiteDatabase, id: string): Promise<void> {
  await db.runAsync('DELETE FROM shopping_items WHERE id = $id', { $id: id });
}

export async function duplicateTrip(
  db: SQLiteDatabase,
  sourceTripId: string,
  newTitle: string
): Promise<string> {
  const tripId = uuid();
  await db.runAsync(
    'INSERT INTO shopping_trips (id, title) VALUES ($id, $title)',
    { $id: tripId, $title: newTitle }
  );

  const items = await getItemsByTrip(db, sourceTripId);
  const stmt = await db.prepareAsync(
    `INSERT INTO shopping_items (id, trip_id, name, quantity, unit, category_id, note)
     VALUES ($id, $tripId, $name, $qty, $unit, $catId, $note)`
  );
  try {
    for (const item of items) {
      await stmt.executeAsync({
        $id: uuid(),
        $tripId: tripId,
        $name: item.name,
        $qty: item.quantity,
        $unit: item.unit,
        $catId: item.category_id,
        $note: item.note,
      });
    }
  } finally {
    await stmt.finalizeAsync();
  }

  return tripId;
}

export async function getItemCountByTrip(
  db: SQLiteDatabase,
  tripId: string
): Promise<number> {
  const result = await db.getFirstAsync<{ count: number }>(
    'SELECT COUNT(*) as count FROM shopping_items WHERE trip_id = $tripId',
    { $tripId: tripId }
  );
  return result?.count ?? 0;
}
