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
// タスク挿入スキーマ
export const insertTaskSchema = createInsertSchema(tasks).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
}).superRefine((data, ctx) => {
  // dueDate の値がある場合の変換と検証
  if (data.dueDate !== undefined && data.dueDate !== null) {
    // 文字列の場合は Date に変換
    if (typeof data.dueDate === 'string') {
      try {
        const parsedDate = new Date(data.dueDate);
        // 有効な日付かどうかチェック
        if (isNaN(parsedDate.getTime())) {
          ctx.addIssue({
            code: z.ZodIssueCode.invalid_date,
            message: "無効な日付形式です",
          });
          data.dueDate = null;
        } else {
          data.dueDate = parsedDate;
        }
      } catch (error) {
        ctx.addIssue({
          code: z.ZodIssueCode.invalid_date,
          message: "日付の変換中にエラーが発生しました",
        });
        data.dueDate = null;
      }
    }
    // Date オブジェクトでない場合 (文字列の変換が失敗した場合も含む)
    else if (!(data.dueDate instanceof Date)) {
      ctx.addIssue({
        code: z.ZodIssueCode.invalid_type,
        expected: "date",
        received: typeof data.dueDate,
        message: "日付型が必要です",
      });
      data.dueDate = null;
    }
  }
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
