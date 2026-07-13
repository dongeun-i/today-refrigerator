import * as crypto from 'expo-crypto';
import type { SQLiteDatabase } from 'expo-sqlite';

import type { Receipt } from './types';

function uuid() {
  return crypto.randomUUID();
}

export async function getReceiptsByTrip(db: SQLiteDatabase, tripId: string): Promise<Receipt[]> {
  return db.getAllAsync<Receipt>(
    'SELECT * FROM receipts WHERE trip_id = $tripId ORDER BY created_at DESC',
    { $tripId: tripId }
  );
}

export async function createReceipt(
  db: SQLiteDatabase,
  data: {
    trip_id: string;
    image_uri?: string;
    store_name?: string;
    total_amount?: number;
    purchased_at?: string;
  }
): Promise<string> {
  const id = uuid();
  await db.runAsync(
    `INSERT INTO receipts (id, trip_id, image_uri, store_name, total_amount, purchased_at)
     VALUES ($id, $tripId, $uri, $store, $amount, $date)`,
    {
      $id: id,
      $tripId: data.trip_id,
      $uri: data.image_uri ?? null,
      $store: data.store_name ?? null,
      $amount: data.total_amount ?? null,
      $date: data.purchased_at ?? null,
    }
  );
  return id;
}
