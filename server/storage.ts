import { InsertCategory, Category, InsertTask, Task, TaskFilters, SortOption, categories, tasks } from "@shared/schema";
import { db } from "./db";
import { eq, and, or, like, desc, asc, isNull, sql } from "drizzle-orm";

// ストレージインターフェース
export interface IStorage {
  // カテゴリ操作
  getAllCategories(): Promise<Category[]>;
  getCategoryById(id: number): Promise<Category | undefined>;
  createCategory(category: InsertCategory): Promise<Category>;
  updateCategory(id: number, category: Partial<InsertCategory>): Promise<Category | undefined>;
  deleteCategory(id: number): Promise<boolean>;
  
  // タスク操作
  getAllTasks(filters?: TaskFilters, sortBy?: SortOption): Promise<Task[]>;
  getTaskById(id: number): Promise<Task | undefined>;
  createTask(task: InsertTask): Promise<Task>;
  updateTask(id: number, task: Partial<InsertTask>): Promise<Task | undefined>;
  deleteTask(id: number): Promise<boolean>;
  getTaskCountByCategory(categoryId: number): Promise<number>;
}

// メモリストレージ実装
export class MemStorage implements IStorage {
  private categories: Map<number, Category>;
  private tasks: Map<number, Task>;
  private categoryIdCounter: number;
  private taskIdCounter: number;

  constructor() {
    this.categories = new Map();
    this.tasks = new Map();
    this.categoryIdCounter = 1;
    this.taskIdCounter = 1;
    
    // デフォルトカテゴリの追加
    this.initializeDefaultCategories();
    // サンプルタスクの追加
    this.initializeSampleTasks();
  }

  // カテゴリ関連メソッド
  async getAllCategories(): Promise<Category[]> {
    return Array.from(this.categories.values());
  }

  async getCategoryById(id: number): Promise<Category | undefined> {
    return this.categories.get(id);
  }

  async createCategory(categoryData: InsertCategory): Promise<Category> {
    const id = this.categoryIdCounter++;
    const category: Category = { id, ...categoryData };
    this.categories.set(id, category);
    return category;
  }

  async updateCategory(id: number, categoryData: Partial<InsertCategory>): Promise<Category | undefined> {
    const category = this.categories.get(id);
    if (!category) return undefined;

    const updatedCategory = { ...category, ...categoryData };
    this.categories.set(id, updatedCategory);
    return updatedCategory;
  }

  async deleteCategory(id: number): Promise<boolean> {
    if (!this.categories.has(id)) return false;
    
    // カテゴリに属するタスクのカテゴリIDをnullに設定
    const tasks = Array.from(this.tasks.values()).filter(task => task.categoryId === id);
    tasks.forEach(task => {
      const updatedTask = { ...task, categoryId: null };
      this.tasks.set(task.id, updatedTask);
    });
    
    return this.categories.delete(id);
  }

  // タスク関連メソッド
  async getAllTasks(filters?: TaskFilters, sortBy: SortOption = 'createdAt'): Promise<Task[]> {
    let filteredTasks = Array.from(this.tasks.values());
    
    // フィルタリング
    if (filters) {
      if (filters.isCompleted !== undefined) {
        filteredTasks = filteredTasks.filter(task => task.isCompleted === filters.isCompleted);
      }
      
      if (filters.priority !== undefined) {
        filteredTasks = filteredTasks.filter(task => task.priority === filters.priority);
      }
      
      if (filters.categoryId !== undefined) {
        filteredTasks = filteredTasks.filter(task => task.categoryId === filters.categoryId);
      }
      
      if (filters.searchTerm) {
        const searchLower = filters.searchTerm.toLowerCase();
        filteredTasks = filteredTasks.filter(task => 
          task.title.toLowerCase().includes(searchLower) || 
          (task.description && task.description.toLowerCase().includes(searchLower))
        );
      }
    }
    
    // ソート
    switch (sortBy) {
      case 'dueDate':
        filteredTasks.sort((a, b) => {
          if (!a.dueDate) return 1;
          if (!b.dueDate) return -1;
          return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
        });
        break;
      case 'priority':
        filteredTasks.sort((a, b) => b.priority - a.priority);
        break;
      case 'title':
        filteredTasks.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'createdAt':
      default:
        filteredTasks.sort((a, b) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        break;
    }
    
    return filteredTasks;
  }

  async getTaskById(id: number): Promise<Task | undefined> {
    return this.tasks.get(id);
  }

  async createTask(taskData: InsertTask): Promise<Task> {
    const id = this.taskIdCounter++;
    const now = new Date();
    const task: Task = {
      id,
      ...taskData,
      createdAt: now,
      updatedAt: now
    };
    this.tasks.set(id, task);
    return task;
  }

  async updateTask(id: number, taskData: Partial<InsertTask>): Promise<Task | undefined> {
    const task = this.tasks.get(id);
    if (!task) return undefined;

    const updatedTask = { 
      ...task, 
      ...taskData,
      updatedAt: new Date()
    };
    this.tasks.set(id, updatedTask);
    return updatedTask;
  }

  async deleteTask(id: number): Promise<boolean> {
    return this.tasks.delete(id);
  }

  async getTaskCountByCategory(categoryId: number): Promise<number> {
    return Array.from(this.tasks.values()).filter(task => task.categoryId === categoryId).length;
  }

  // 初期データ設定
  private initializeDefaultCategories() {
    const defaultCategories: InsertCategory[] = [
      { name: '仕事', color: 'blue' },
      { name: '個人', color: 'green' },
      { name: '買い物', color: 'amber' },
      { name: '学習', color: 'purple' }
    ];
    
    defaultCategories.forEach(category => {
      this.createCategory(category);
    });
  }

  private initializeSampleTasks() {
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const nextWeek = new Date(now);
    nextWeek.setDate(nextWeek.getDate() + 7);
    
    const sampleTasks: InsertTask[] = [
      {
        title: 'プレゼン資料作成',
        description: 'クライアントミーティング用のプレゼンテーション資料を作成する',
        isCompleted: false,
        dueDate: tomorrow,
        priority: 3, // 高
        categoryId: 1 // 仕事
      },
      {
        title: '買い物リスト',
        description: '夕食の材料を購入する：野菜、肉、調味料',
        isCompleted: false,
        dueDate: now,
        priority: 2, // 中
        categoryId: 3 // 買い物
      },
      {
        title: '読書',
        description: '新しい本を30ページ読む',
        isCompleted: false,
        dueDate: nextWeek,
        priority: 1, // 低
        categoryId: 2 // 個人
      },
      {
        title: 'メール返信',
        description: '重要な顧客からのメールに返信する',
        isCompleted: true,
        dueDate: now,
        priority: 3, // 高
        categoryId: 1 // 仕事
      },
      {
        title: 'プログラミング学習',
        description: 'React.jsのチュートリアルを完了させる',
        isCompleted: false,
        dueDate: new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000), // 3日後
        priority: 2, // 中
        categoryId: 4 // 学習
      },
      {
        title: '請求書送付',
        description: '先月の作業分の請求書を顧客に送付する',
        isCompleted: false,
        dueDate: now,
        priority: 3, // 高
        categoryId: 1 // 仕事
      }
    ];
    
    sampleTasks.forEach(task => {
      this.createTask(task);
    });
  }
}

// データベースストレージ実装
export class DatabaseStorage implements IStorage {
  // カテゴリ関連メソッド
  async getAllCategories(): Promise<Category[]> {
    const result = await db.select().from(categories);
    
    // カテゴリごとのタスク数を取得してマップを作成
    const categoryCounts = await Promise.all(
      result.map(async (category) => {
        const count = await this.getTaskCountByCategory(category.id);
        return { ...category, taskCount: count };
      })
    );
    
    return categoryCounts;
  }

  async getCategoryById(id: number): Promise<Category | undefined> {
    const [category] = await db.select().from(categories).where(eq(categories.id, id));
    return category;
  }

  async createCategory(categoryData: InsertCategory): Promise<Category> {
    const [category] = await db.insert(categories).values(categoryData).returning();
    return category;
  }

  async updateCategory(id: number, categoryData: Partial<InsertCategory>): Promise<Category | undefined> {
    const [updatedCategory] = await db
      .update(categories)
      .set(categoryData)
      .where(eq(categories.id, id))
      .returning();
    
    return updatedCategory;
  }

  async deleteCategory(id: number): Promise<boolean> {
    // まず、このカテゴリに関連するすべてのタスクのカテゴリIDをnullに設定
    await db
      .update(tasks)
      .set({ categoryId: null })
      .where(eq(tasks.categoryId, id));
    
    // カテゴリを削除
    const result = await db
      .delete(categories)
      .where(eq(categories.id, id))
      .returning({ id: categories.id });
    
    return result.length > 0;
  }

  // タスク関連メソッド
  async getAllTasks(filters?: TaskFilters, sortBy: SortOption = 'createdAt'): Promise<Task[]> {
    let query = db.select().from(tasks);
    
    // フィルター条件の適用
    if (filters) {
      const conditions = [];
      
      if (filters.isCompleted !== undefined) {
        conditions.push(eq(tasks.isCompleted, filters.isCompleted));
      }
      
      if (filters.priority !== undefined) {
        conditions.push(eq(tasks.priority, filters.priority));
      }
      
      if (filters.categoryId !== undefined) {
        conditions.push(eq(tasks.categoryId, filters.categoryId));
      }
      
      if (filters.searchTerm) {
        conditions.push(
          or(
            like(tasks.title, `%${filters.searchTerm}%`),
            like(tasks.description, `%${filters.searchTerm}%`)
          )
        );
      }
      
      if (filters.dueDateToday) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        
        conditions.push(
          and(
            sql`${tasks.dueDate} >= ${today.toISOString()}`,
            sql`${tasks.dueDate} < ${tomorrow.toISOString()}`
          )
        );
      }
      
      if (conditions.length > 0) {
        query = query.where(and(...conditions));
      }
    }
    
    // ソート条件の適用
    switch (sortBy) {
      case 'dueDate':
        query = query.orderBy(asc(tasks.dueDate));
        break;
      case 'priority':
        query = query.orderBy(desc(tasks.priority));
        break;
      case 'title':
        query = query.orderBy(asc(tasks.title));
        break;
      case 'createdAt':
      default:
        query = query.orderBy(desc(tasks.createdAt));
        break;
    }
    
    const result = await query;
    return result;
  }

  async getTaskById(id: number): Promise<Task | undefined> {
    const [task] = await db.select().from(tasks).where(eq(tasks.id, id));
    return task;
  }

  async createTask(taskData: InsertTask): Promise<Task> {
    const [task] = await db.insert(tasks).values(taskData).returning();
    return task;
  }

  async updateTask(id: number, taskData: Partial<InsertTask>): Promise<Task | undefined> {
    const [updatedTask] = await db
      .update(tasks)
      .set({ ...taskData, updatedAt: new Date() })
      .where(eq(tasks.id, id))
      .returning();
    
    return updatedTask;
  }

  async deleteTask(id: number): Promise<boolean> {
    const result = await db
      .delete(tasks)
      .where(eq(tasks.id, id))
      .returning({ id: tasks.id });
    
    return result.length > 0;
  }

  async getTaskCountByCategory(categoryId: number): Promise<number> {
    const result = await db
      .select({ count: sql`count(*)` })
      .from(tasks)
      .where(eq(tasks.categoryId, categoryId));
    
    return Number(result[0].count);
  }
}

// サンプルデータ投入用の関数
async function initializeDatabase() {
  // デフォルトカテゴリの追加（テーブルが空の場合のみ）
  const existingCategories = await db.select().from(categories);
  
  if (existingCategories.length === 0) {
    const defaultCategories = [
      { name: '仕事', color: 'blue' },
      { name: '個人', color: 'green' },
      { name: '買い物', color: 'amber' },
      { name: '学習', color: 'purple' }
    ];
    
    await db.insert(categories).values(defaultCategories);
  }
  
  // サンプルタスクの追加（テーブルが空の場合のみ）
  const existingTasks = await db.select().from(tasks);
  
  if (existingTasks.length === 0) {
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const nextWeek = new Date(now);
    nextWeek.setDate(nextWeek.getDate() + 7);
    
    const sampleTasks = [
      {
        title: 'プレゼン資料作成',
        description: 'クライアントミーティング用のプレゼンテーション資料を作成する',
        isCompleted: false,
        dueDate: tomorrow,
        priority: 3, // 高
        categoryId: 1 // 仕事
      },
      {
        title: '買い物リスト',
        description: '夕食の材料を購入する：野菜、肉、調味料',
        isCompleted: false,
        dueDate: now,
        priority: 2, // 中
        categoryId: 3 // 買い物
      },
      {
        title: '読書',
        description: '新しい本を30ページ読む',
        isCompleted: false,
        dueDate: nextWeek,
        priority: 1, // 低
        categoryId: 2 // 個人
      },
      {
        title: 'メール返信',
        description: '重要な顧客からのメールに返信する',
        isCompleted: true,
        dueDate: now,
        priority: 3, // 高
        categoryId: 1 // 仕事
      },
      {
        title: 'プログラミング学習',
        description: 'React.jsのチュートリアルを完了させる',
        isCompleted: false,
        dueDate: new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000), // 3日後
        priority: 2, // 中
        categoryId: 4 // 学習
      },
      {
        title: '請求書送付',
        description: '先月の作業分の請求書を顧客に送付する',
        isCompleted: false,
        dueDate: now,
        priority: 3, // 高
        categoryId: 1 // 仕事
      }
    ];
    
    await db.insert(tasks).values(sampleTasks);
  }
}

// アプリケーション起動時にデータベースを初期化
initializeDatabase().catch(console.error);

// DatabaseStorageを利用
export const storage = new DatabaseStorage();
