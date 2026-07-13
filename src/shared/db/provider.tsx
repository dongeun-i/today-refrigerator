import { type PropsWithChildren, createContext, useContext, useEffect, useState } from 'react';
import { openDatabaseAsync, type SQLiteDatabase } from 'expo-sqlite';

import { initializeDatabase } from './schema';

const DB_NAME = 'today-refrigerator.db';

const DatabaseContext = createContext<SQLiteDatabase | null>(null);

export function DatabaseProvider({ children }: PropsWithChildren) {
  const [db, setDb] = useState<SQLiteDatabase | null>(null);

  useEffect(() => {
    let database: SQLiteDatabase;
    (async () => {
      database = await openDatabaseAsync(DB_NAME);
      await initializeDatabase(database);
      setDb(database);
    })();

    return () => {
      database?.closeAsync();
    };
  }, []);

  if (!db) return null;

  return <DatabaseContext.Provider value={db}>{children}</DatabaseContext.Provider>;
}

export function useDatabase() {
  const db = useContext(DatabaseContext);
  if (!db) throw new Error('useDatabase must be used within DatabaseProvider');
  return db;
}
