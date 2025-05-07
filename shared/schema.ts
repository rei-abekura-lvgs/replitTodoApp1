import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// ユーザーテーブル（必要に応じて）
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

// カテゴリテーブル
export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  color: text("color").notNull(),
});

// タスクテーブル
export const tasks = pgTable("tasks", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  isCompleted: boolean("is_completed").notNull().default(false),
  dueDate: timestamp("due_date"),
  priority: integer("priority").notNull().default(1), // 1: 低, 2: 中, 3: 高
  categoryId: integer("category_id"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// Zodスキーマ定義
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertCategorySchema = createInsertSchema(categories);
// カスタムの日付スキーマを作成
const dateStringSchema = z.string().refine(
  (val) => {
    try {
      const date = new Date(val);
      return !isNaN(date.getTime());
    } catch (e) {
      return false;
    }
  },
  { message: "無効な日付文字列です" }
);

// 日付を処理するためのカスタム型変換
const dateTransformer = z.preprocess((val) => {
  // nullまたはundefinedの場合、そのまま返す
  if (val === null || val === undefined) {
    return null;
  }
  
  // すでにDate型の場合
  if (val instanceof Date) {
    return isNaN(val.getTime()) ? null : val;
  }
  
  // 文字列の場合
  if (typeof val === 'string') {
    try {
      const date = new Date(val);
      return isNaN(date.getTime()) ? null : date;
    } catch (e) {
      return null;
    }
  }
  
  return null;
}, z.date().nullable());

// タスク挿入スキーマ
export const insertTaskSchema = createInsertSchema(tasks, {
  dueDate: () => dateTransformer,
}).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// タイプ定義
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertCategory = z.infer<typeof insertCategorySchema>;
export type Category = typeof categories.$inferSelect;

export type InsertTask = z.infer<typeof insertTaskSchema>;
export type Task = typeof tasks.$inferSelect;

// APIリクエスト用の型
export type TaskFilters = {
  isCompleted?: boolean;
  priority?: number;
  categoryId?: number;
  searchTerm?: string;
  dueDateToday?: boolean;
};

export type SortOption = 'dueDate' | 'priority' | 'title' | 'createdAt';
