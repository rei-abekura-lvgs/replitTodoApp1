import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "@shared/schema";

// WebSocketをNeonデータベースに設定
neonConfig.webSocketConstructor = ws;

// 環境変数からデータベースURLを取得
if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

// データベース接続プールを作成
export const pool = new Pool({ connectionString: process.env.DATABASE_URL });

// Drizzle ORMのインスタンスを作成
export const db = drizzle({ client: pool, schema });