import express, { type Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertCategorySchema, insertTaskSchema, taskCreateSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // APIルートの設定
  const apiRouter = express.Router();
  
  // カテゴリAPIエンドポイント
  apiRouter.get("/categories", async (_req, res) => {
    try {
      const categories = await storage.getAllCategories();
      
      // カテゴリごとのタスク数を取得
      const categoriesWithCount = await Promise.all(
        categories.map(async (category) => {
          const count = await storage.getTaskCountByCategory(category.id);
          return { ...category, taskCount: count };
        })
      );
      
      res.json(categoriesWithCount);
    } catch (error) {
      res.status(500).json({ message: "カテゴリの取得に失敗しました" });
    }
  });
  
  apiRouter.get("/categories/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const category = await storage.getCategoryById(id);
      
      if (!category) {
        return res.status(404).json({ message: "カテゴリが見つかりません" });
      }
      
      res.json(category);
    } catch (error) {
      res.status(500).json({ message: "カテゴリの取得に失敗しました" });
    }
  });
  
  apiRouter.post("/categories", async (req, res) => {
    try {
      const validatedData = insertCategorySchema.parse(req.body);
      const newCategory = await storage.createCategory(validatedData);
      res.status(201).json(newCategory);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "入力データが不正です", errors: error.errors });
      }
      res.status(500).json({ message: "カテゴリの作成に失敗しました" });
    }
  });
  
  apiRouter.put("/categories/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const validatedData = insertCategorySchema.partial().parse(req.body);
      
      const updatedCategory = await storage.updateCategory(id, validatedData);
      
      if (!updatedCategory) {
        return res.status(404).json({ message: "カテゴリが見つかりません" });
      }
      
      res.json(updatedCategory);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "入力データが不正です", errors: error.errors });
      }
      res.status(500).json({ message: "カテゴリの更新に失敗しました" });
    }
  });
  
  apiRouter.delete("/categories/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteCategory(id);
      
      if (!success) {
        return res.status(404).json({ message: "カテゴリが見つかりません" });
      }
      
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "カテゴリの削除に失敗しました" });
    }
  });
  
  // タスクAPIエンドポイント
  apiRouter.get("/tasks", async (req, res) => {
    try {
      const filters = {
        isCompleted: req.query.isCompleted === 'true' ? true : 
                    req.query.isCompleted === 'false' ? false : undefined,
        priority: req.query.priority ? parseInt(req.query.priority as string) : undefined,
        categoryId: req.query.categoryId ? parseInt(req.query.categoryId as string) : undefined,
        searchTerm: req.query.search as string | undefined
      };
      
      const sortBy = req.query.sortBy as string || 'dueDate';
      
      const tasks = await storage.getAllTasks(filters, sortBy as any);
      res.json(tasks);
    } catch (error) {
      res.status(500).json({ message: "タスクの取得に失敗しました" });
    }
  });
  
  apiRouter.get("/tasks/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const task = await storage.getTaskById(id);
      
      if (!task) {
        return res.status(404).json({ message: "タスクが見つかりません" });
      }
      
      res.json(task);
    } catch (error) {
      res.status(500).json({ message: "タスクの取得に失敗しました" });
    }
  });
  
  apiRouter.post("/tasks", async (req, res) => {
    try {
      // リクエストデータをログに出力（デバッグ用）
      console.log("タスク作成リクエスト:", req.body);
      
      // 新しいカスタムスキーマでバリデーション
      const validatedData = taskCreateSchema.parse(req.body);
      
      // validatedDataをログに出力（デバッグ用）
      console.log("バリデーション後のタスクデータ:", validatedData);
      
      const newTask = await storage.createTask(validatedData);
      res.status(201).json(newTask);
    } catch (error) {
      if (error instanceof z.ZodError) {
        console.error("Zodバリデーションエラー:", JSON.stringify(error.errors, null, 2));
      // リクエストボディをログに出力
      console.error("リクエストボディ:", JSON.stringify(req.body, null, 2));
        return res.status(400).json({ 
          message: "入力データが不正です", 
          errors: error.errors,
          detail: "日付などの入力形式を確認してください" 
        });
      }
      console.error("タスク作成エラー:", error);
      res.status(500).json({ message: "タスクの作成に失敗しました" });
    }
  });
  
  apiRouter.put("/tasks/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const validatedData = taskCreateSchema.partial().parse(req.body);
      
      const updatedTask = await storage.updateTask(id, validatedData);
      
      if (!updatedTask) {
        return res.status(404).json({ message: "タスクが見つかりません" });
      }
      
      res.json(updatedTask);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "入力データが不正です", errors: error.errors });
      }
      res.status(500).json({ message: "タスクの更新に失敗しました" });
    }
  });
  
  apiRouter.delete("/tasks/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteTask(id);
      
      if (!success) {
        return res.status(404).json({ message: "タスクが見つかりません" });
      }
      
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "タスクの削除に失敗しました" });
    }
  });
  
  // /api プレフィックスを付けてルーターをマウント
  app.use("/api", apiRouter);

  const httpServer = createServer(app);
  return httpServer;
}
