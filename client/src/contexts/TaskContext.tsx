import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Category, Task, SortOption, TaskFilters } from "@shared/schema";

// タスク送信時のカスタム型（日付文字列を許可）
type TaskWithStringDate = Omit<Task, "dueDate"> & {
  dueDate?: string | Date | null;
};

// コンテキストの型定義
interface TaskContextType {
  // タスク関連
  tasks: Task[];
  isTasksLoading: boolean;
  selectedTask: Task | null;
  setSelectedTask: (task: Task | null) => void;
  fetchTasks: (filters?: TaskFilters, sortBy?: SortOption) => Promise<void>;
  createTask: (task: Omit<TaskWithStringDate, "id" | "createdAt" | "updatedAt">) => Promise<void>;
  updateTask: (id: number, task: Partial<TaskWithStringDate>) => Promise<void>;
  deleteTask: (id: number) => Promise<void>;
  toggleTaskCompletion: (id: number, isCompleted: boolean) => Promise<void>;
  
  // カテゴリ関連
  categories: (Category & { taskCount: number })[];
  isCategoriesLoading: boolean;
  selectedCategory: number | null;
  setSelectedCategory: (categoryId: number | null) => void;
  fetchCategories: () => Promise<void>;
  createCategory: (category: Omit<Category, "id">) => Promise<void>;
  updateCategory: (id: number, category: Partial<Category>) => Promise<void>;
  deleteCategory: (id: number) => Promise<void>;
  
  // フィルターとソート関連
  filters: TaskFilters;
  setFilters: (filters: TaskFilters) => void;
  sortBy: SortOption;
  setSortBy: (sortBy: SortOption) => void;
  searchTerm: string;
  setSearchTerm: (searchTerm: string) => void;
  
  // モーダル関連
  isTaskModalOpen: boolean;
  setTaskModalOpen: (isOpen: boolean) => void;
  isCategoryModalOpen: boolean;
  setCategoryModalOpen: (isOpen: boolean) => void;
  
  // モバイルサイドバー
  isSidebarOpen: boolean;
  setSidebarOpen: (isOpen: boolean) => void;
}

// デフォルト値の作成
const defaultContextValue: TaskContextType = {
  tasks: [],
  isTasksLoading: false,
  selectedTask: null,
  setSelectedTask: () => {},
  fetchTasks: async () => {},
  createTask: async () => {},
  updateTask: async () => {},
  deleteTask: async () => {},
  toggleTaskCompletion: async () => {},
  
  categories: [],
  isCategoriesLoading: false,
  selectedCategory: null,
  setSelectedCategory: () => {},
  fetchCategories: async () => {},
  createCategory: async () => {},
  updateCategory: async () => {},
  deleteCategory: async () => {},
  
  filters: {},
  setFilters: () => {},
  sortBy: 'dueDate',
  setSortBy: () => {},
  searchTerm: '',
  setSearchTerm: () => {},
  
  isTaskModalOpen: false,
  setTaskModalOpen: () => {},
  isCategoryModalOpen: false,
  setCategoryModalOpen: () => {},
  
  isSidebarOpen: false,
  setSidebarOpen: () => {}
};

// コンテキストの作成
const TaskContext = createContext<TaskContextType>(defaultContextValue);

// コンテキストプロバイダー
export function TaskProvider({ children }: { children: ReactNode }) {
  const { toast } = useToast();
  
  // タスク関連の状態
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isTasksLoading, setIsTasksLoading] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  
  // カテゴリ関連の状態
  const [categories, setCategories] = useState<(Category & { taskCount: number })[]>([]);
  const [isCategoriesLoading, setIsCategoriesLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  
  // フィルターとソート関連の状態
  const [filters, setFilters] = useState<TaskFilters>({});
  const [sortBy, setSortBy] = useState<SortOption>('dueDate');
  const [searchTerm, setSearchTerm] = useState('');
  
  // モーダル関連の状態
  const [isTaskModalOpen, setTaskModalOpen] = useState(false);
  const [isCategoryModalOpen, setCategoryModalOpen] = useState(false);
  
  // モバイルサイドバーの状態
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  
  // タスク取得関数
  const fetchTasks = async (filterParams?: TaskFilters, sortOption?: SortOption) => {
    try {
      setIsTasksLoading(true);
      
      // フィルターパラメータの準備
      const activeFilters = { ...filters, ...filterParams };
      if (selectedCategory) {
        activeFilters.categoryId = selectedCategory;
      }
      if (searchTerm) {
        activeFilters.searchTerm = searchTerm;
      }
      
      // クエリパラメータの構築
      const queryParams = new URLSearchParams();
      if (activeFilters.isCompleted !== undefined) {
        queryParams.append('isCompleted', activeFilters.isCompleted.toString());
      }
      if (activeFilters.priority !== undefined) {
        queryParams.append('priority', activeFilters.priority.toString());
      }
      if (activeFilters.categoryId !== undefined) {
        queryParams.append('categoryId', activeFilters.categoryId.toString());
      }
      if (activeFilters.searchTerm) {
        queryParams.append('search', activeFilters.searchTerm);
      }
      
      queryParams.append('sortBy', sortOption || sortBy);
      
      const response = await apiRequest('GET', `/api/tasks?${queryParams.toString()}`);
      const data = await response.json();
      setTasks(data);
    } catch (error) {
      toast({
        title: "エラー",
        description: "タスクの取得に失敗しました",
        variant: "destructive",
      });
      console.error(error);
    } finally {
      setIsTasksLoading(false);
    }
  };
  
  // タスク作成関数
  const createTask = async (task: Omit<TaskWithStringDate, "id" | "createdAt" | "updatedAt">) => {
    try {
      // サーバーに送信する前に日付が正しく処理されているか確認
      const processedTask = {
        ...task,
        // 日付は文字列か日付オブジェクトとして送信可能
        dueDate: task.dueDate ? task.dueDate : null
      };
      
      const response = await apiRequest('POST', '/api/tasks', processedTask);
      const newTask = await response.json();
      
      // タスク一覧を更新
      await fetchTasks();
      // カテゴリカウントを更新
      await fetchCategories();
      
      toast({
        title: "成功",
        description: "タスクを作成しました",
      });
      
      return newTask;
    } catch (error: any) {
      // API エラーをより詳細に取得
      let errorMessage = "タスクの作成に失敗しました";
      
      if (error.message && typeof error.message === 'string') {
        // エラーメッセージが存在する場合は表示
        errorMessage = error.message;
      } else if (error.errors && Array.isArray(error.errors)) {
        // Zod バリデーションエラーの場合
        errorMessage = error.errors.map((e: any) => e.message).join(", ");
      }
      
      toast({
        title: "エラー",
        description: errorMessage,
        variant: "destructive",
      });
      console.error("タスク作成エラー:", error);
      // エラーを再スローして呼び出し元でもキャッチできるようにする
      throw error;
    }
  };
  
  // タスク更新関数
  const updateTask = async (id: number, task: Partial<TaskWithStringDate>) => {
    try {
      const response = await apiRequest('PUT', `/api/tasks/${id}`, task);
      const updatedTask = await response.json();
      
      // タスク一覧を更新
      await fetchTasks();
      // カテゴリが変更された場合、カテゴリカウントも更新
      if (task.categoryId !== undefined) {
        await fetchCategories();
      }
      
      toast({
        title: "成功",
        description: "タスクを更新しました",
      });
      
      return updatedTask;
    } catch (error) {
      toast({
        title: "エラー",
        description: "タスクの更新に失敗しました",
        variant: "destructive",
      });
      console.error(error);
    }
  };
  
  // タスク削除関数
  const deleteTask = async (id: number) => {
    try {
      await apiRequest('DELETE', `/api/tasks/${id}`);
      
      // タスク一覧を更新
      await fetchTasks();
      // カテゴリカウントを更新
      await fetchCategories();
      
      toast({
        title: "成功",
        description: "タスクを削除しました",
      });
    } catch (error) {
      toast({
        title: "エラー",
        description: "タスクの削除に失敗しました",
        variant: "destructive",
      });
      console.error(error);
    }
  };
  
  // タスク完了状態切り替え関数
  const toggleTaskCompletion = async (id: number, isCompleted: boolean) => {
    await updateTask(id, { isCompleted });
  };
  
  // カテゴリ取得関数
  const fetchCategories = async () => {
    try {
      setIsCategoriesLoading(true);
      const response = await apiRequest('GET', '/api/categories');
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      toast({
        title: "エラー",
        description: "カテゴリの取得に失敗しました",
        variant: "destructive",
      });
      console.error(error);
    } finally {
      setIsCategoriesLoading(false);
    }
  };
  
  // カテゴリ作成関数
  const createCategory = async (category: Omit<Category, "id">) => {
    try {
      const response = await apiRequest('POST', '/api/categories', category);
      const newCategory = await response.json();
      
      // カテゴリ一覧を更新
      await fetchCategories();
      
      toast({
        title: "成功",
        description: "カテゴリを作成しました",
      });
      
      return newCategory;
    } catch (error) {
      toast({
        title: "エラー",
        description: "カテゴリの作成に失敗しました",
        variant: "destructive",
      });
      console.error(error);
    }
  };
  
  // カテゴリ更新関数
  const updateCategory = async (id: number, category: Partial<Category>) => {
    try {
      const response = await apiRequest('PUT', `/api/categories/${id}`, category);
      const updatedCategory = await response.json();
      
      // カテゴリ一覧を更新
      await fetchCategories();
      
      toast({
        title: "成功",
        description: "カテゴリを更新しました",
      });
      
      return updatedCategory;
    } catch (error) {
      toast({
        title: "エラー",
        description: "カテゴリの更新に失敗しました",
        variant: "destructive",
      });
      console.error(error);
    }
  };
  
  // カテゴリ削除関数
  const deleteCategory = async (id: number) => {
    try {
      await apiRequest('DELETE', `/api/categories/${id}`);
      
      // カテゴリ一覧を更新
      await fetchCategories();
      // 現在選択中のカテゴリが削除された場合、選択を解除
      if (selectedCategory === id) {
        setSelectedCategory(null);
      }
      // タスク一覧を更新（カテゴリが削除されると、そのカテゴリのタスクのカテゴリIDがnullになる）
      await fetchTasks();
      
      toast({
        title: "成功",
        description: "カテゴリを削除しました",
      });
    } catch (error) {
      toast({
        title: "エラー",
        description: "カテゴリの削除に失敗しました",
        variant: "destructive",
      });
      console.error(error);
    }
  };
  
  // 初期データ読み込み
  useEffect(() => {
    fetchCategories();
    fetchTasks();
  }, []);
  
  // フィルターやソート、検索条件が変更されたらタスクを再取得
  useEffect(() => {
    fetchTasks();
  }, [filters, sortBy, selectedCategory, searchTerm]);
  
  // コンテキストの値
  const value = {
    // タスク関連
    tasks,
    isTasksLoading,
    selectedTask,
    setSelectedTask,
    fetchTasks,
    createTask,
    updateTask,
    deleteTask,
    toggleTaskCompletion,
    
    // カテゴリ関連
    categories,
    isCategoriesLoading,
    selectedCategory,
    setSelectedCategory,
    fetchCategories,
    createCategory,
    updateCategory,
    deleteCategory,
    
    // フィルターとソート関連
    filters,
    setFilters,
    sortBy,
    setSortBy,
    searchTerm,
    setSearchTerm,
    
    // モーダル関連
    isTaskModalOpen,
    setTaskModalOpen,
    isCategoryModalOpen,
    setCategoryModalOpen,
    
    // モバイルサイドバー
    isSidebarOpen,
    setSidebarOpen
  };

  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>;
}

// カスタムフックの作成
export function useTaskContext() {
  const context = useContext(TaskContext);
  if (context === undefined) {
    throw new Error("useTaskContext must be used within a TaskProvider");
  }
  return context;
}
