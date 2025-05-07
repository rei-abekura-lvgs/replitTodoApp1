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
// タスク挿入スキーマ - 最もシンプルなアプローチでまず試してみる
export const insertTaskSchema = createInsertSchema(tasks).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// ネイティブなZodスキーマをカスタマイズ
export const taskCreateSchema = z.object({
  title: z.string().min(1, { message: "タイトルは必須です" }),
  description: z.string().optional().default(""),
  isCompleted: z.boolean().default(false),
  dueDate: z.string().nullable().optional().transform((val) => {
    // 空文字やnullやundefinedの場合はnullを返す
    if (!val) return null;
    
    try {
      // ISO形式の文字列として処理
      const date = new Date(val);
      // 有効な日付かどうかチェック
      if (isNaN(date.getTime())) return null;
      return date;
    } catch (e) {
      // 無効な形式の場合はnullを返す
      return null;
    }
  }),
  priority: z.number().int().min(1).max(3).default(2),
  categoryId: z.number().int().positive().nullable().optional(),
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
