import { useTaskContext } from "@/contexts/TaskContext";
import TaskCard from "./TaskCard";
import { ViewMode } from "@/types";

interface TaskGridProps {
  viewMode: ViewMode;
}

export default function TaskGrid({ viewMode }: TaskGridProps) {
  const { tasks, isTasksLoading, selectedCategory, categories } = useTaskContext();
  
  if (isTasksLoading) {
    return (
      <div className="flex-1 overflow-auto p-4 bg-slate-50">
        <div className="animate-pulse">
          <div className="h-6 bg-slate-200 w-32 mb-3 rounded"></div>
          <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4`}>
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="bg-white rounded-lg h-44 shadow-sm"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }
  
  // 選択されたカテゴリの名前を取得
  const getCategoryName = () => {
    if (selectedCategory === null) return "すべてのタスク";
    if (selectedCategory === -1) return "カテゴリなしのタスク";
    
    const category = categories.find(c => c.id === selectedCategory);
    return category ? `${category.name}のタスク` : "タスク";
  };
  
  return (
    <div className="flex-1 overflow-auto p-4 bg-slate-50">
      <h2 className="text-sm font-medium text-slate-500 uppercase tracking-wider mb-3">{getCategoryName()}</h2>
      
      {tasks.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12">
          <span className="material-icons text-4xl text-slate-300 mb-2">assignment</span>
          <p className="text-slate-500">タスクがありません</p>
          <p className="text-sm text-slate-400 mt-1">右下の+ボタンでタスクを追加できます</p>
        </div>
      ) : (
        <div className={`grid grid-cols-1 ${
          viewMode === 'grid' 
            ? 'md:grid-cols-2 lg:grid-cols-3' 
            : 'md:grid-cols-1 lg:grid-cols-1'
        } gap-4`}>
          {tasks.map(task => (
            <TaskCard key={task.id} task={task} />
          ))}
        </div>
      )}
    </div>
  );
}
