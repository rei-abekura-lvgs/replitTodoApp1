import { Task, Category } from '@shared/schema';

// デモ用のタスクデータ
export const demoTasks: Task[] = [
  {
    id: 1,
    title: 'メール返信',
    description: '重要な顧客からのメールに返信する',
    isCompleted: false,
    dueDate: new Date('2025-05-15'),
    priority: 2,
    categoryId: 1,
    createdAt: new Date('2025-05-01'),
    updatedAt: new Date('2025-05-01')
  },
  {
    id: 2,
    title: '会議の準備',
    description: 'プレゼン資料を作成する',
    isCompleted: false,
    dueDate: new Date('2025-05-20'),
    priority: 3,
    categoryId: 1,
    createdAt: new Date('2025-05-02'),
    updatedAt: new Date('2025-05-02')
  },
  {
    id: 3,
    title: '買い物リスト作成',
    description: '週末の買い物リストを作成する',
    isCompleted: true,
    dueDate: new Date('2025-05-10'),
    priority: 1,
    categoryId: 2,
    createdAt: new Date('2025-05-03'),
    updatedAt: new Date('2025-05-03')
  }
];

// デモ用のカテゴリデータ
export const demoCategories: (Category & { taskCount: number })[] = [
  {
    id: 1,
    name: '仕事',
    color: 'blue',
    taskCount: 2
  },
  {
    id: 2,
    name: '個人',
    color: 'green',
    taskCount: 1
  },
  {
    id: 3,
    name: '勉強',
    color: 'purple',
    taskCount: 0
  }
];