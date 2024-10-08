import { enablePromise, openDatabase, SQLiteDatabase } from 'react-native-sqlite-storage';
import { Product } from '../models/Product';

const tableName = 'product';

enablePromise(true);

export const getDBConnection = async () => {
  return openDatabase({ name: 'foodanalyzer.db', location: 'default' });
};

export const createTable = async (db: SQLiteDatabase) => {
  // create table if not exists
  const query = `
    CREATE TABLE IF NOT EXISTS ${tableName}(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        brand TEXT NOT NULL,
        nova INTEGER NOT NULL,
        diabetes_impact TEXT NOT NULL,
        date TEXT NOT NULL
    );`;
  await db.executeSql(query);
};

export const getProducts = async (db: SQLiteDatabase): Promise<Product[]> => {
  try {
    const products: Product[] = [];
    const results = await db.executeSql(`SELECT rowid as id, name, brand, nova, diabetes_impact, date FROM ${tableName}`);
    results.forEach(result => {
      for (let index = 0; index < result.rows.length; index++) {
        products.push(result.rows.item(index))
      }
    });
    return products;
  } catch (error) {
    console.error(error);
    throw Error('Failed to get products !!!');
  }
};

export const saveTodoItems = async (db: SQLiteDatabase, products: Product[]) => {
  const insertQuery =
    `INSERT OR REPLACE INTO ${tableName}(name, brand, nova, diabetes_impact, date) values` +
    products.map(i => `('${i.name}', '${i.brand}', ${i.nova}, '${i.diabetes_impact}', '${i.date}')`).join(',');
  return db.executeSql(insertQuery);
};

export const deleteTodoItem = async (db: SQLiteDatabase, id: number) => {
  const deleteQuery = `DELETE from ${tableName} where id = ${id}`;
  await db.executeSql(deleteQuery);
};

export const deleteTable = async (db: SQLiteDatabase) => {
  const query = `drop table ${tableName}`;
  await db.executeSql(query);
};