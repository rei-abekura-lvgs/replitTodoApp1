import { format, isPast, isToday, isTomorrow } from "date-fns";
import { ja } from "date-fns/locale";
import { useTaskContext } from "@/contexts/TaskContext";
import { Task } from "@shared/schema";
import { CATEGORY_COLORS, PRIORITY_COLORS, PRIORITY_LABELS } from "@/types";

interface TaskCardProps {
  task: Task;
}

export default function TaskCard({ task }: TaskCardProps) {
  const { 
    toggleTaskCompletion, 
    setSelectedTask, 
    setTaskModalOpen, 
    deleteTask,
    categories
  } = useTaskContext();
  
  // タスクの編集を開始
  const handleEdit = () => {
    setSelectedTask(task);
    setTaskModalOpen(true);
  };
  
  // タスクの削除を確認
  const handleDelete = () => {
    if (window.confirm("このタスクを削除してもよろしいですか？")) {
      deleteTask(task.id);
    }
  };
  
  // タスクの完了状態を切り替え
  const handleToggleComplete = () => {
    toggleTaskCompletion(task.id, !task.isCompleted);
  };
  
  // 期限表示の整形
  const formatDueDate = (date: Date | null | undefined) => {
    if (!date) return "期限なし";
    
    const dateObj = new Date(date);
    
    if (isToday(dateObj)) {
      return "今日 " + format(dateObj, "HH:mm", { locale: ja });
    } else if (isTomorrow(dateObj)) {
      return "明日 " + format(dateObj, "HH:mm", { locale: ja });
    } else if (isPast(dateObj)) {
      return format(dateObj, "MM/dd HH:mm", { locale: ja }) + " (期限切れ)";
    } else {
      return format(dateObj, "MM/dd HH:mm", { locale: ja });
    }
  };
  
  // カテゴリー名とカラーの取得
  const getCategory = () => {
    if (!task.categoryId) return null;
    
    const category = categories.find(c => c.id === task.categoryId);
    if (!category) return null;
    
    return {
      name: category.name,
      color: category.color
    };
  };
  
  const category = getCategory();
  const priorityInfo = PRIORITY_LABELS[task.priority as keyof typeof PRIORITY_LABELS];
  const borderColorClass = task.isCompleted ? '' : PRIORITY_COLORS[task.priority as keyof typeof PRIORITY_COLORS] || '';
  
  return (
    <div className={`task-card bg-white rounded-lg shadow-sm ${borderColorClass} hover:shadow-md transition-shadow duration-200 ${task.isCompleted ? 'opacity-75' : 'border-l-4'}`}>
      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center">
            <button 
              className={`mr-2 ${task.isCompleted ? 'text-primary-600' : 'text-slate-400 hover:text-primary-600'}`}
              onClick={handleToggleComplete}
            >
              <span className="material-icons">
                {task.isCompleted ? 'check_circle' : 'radio_button_unchecked'}
              </span>
            </button>
            <span className={`font-medium ${task.isCompleted ? 'text-slate-600 line-through' : 'text-slate-800'}`}>
              {task.title}
            </span>
          </div>
          <div className="task-actions flex items-center space-x-1">
            <button 
              className="p-1 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100" 
              title="編集"
              onClick={handleEdit}
            >
              <span className="material-icons text-sm">edit</span>
            </button>
            <button 
              className="p-1 text-slate-400 hover:text-red-600 rounded-full hover:bg-slate-100" 
              title="削除"
              onClick={handleDelete}
            >
              <span className="material-icons text-sm">delete</span>
            </button>
          </div>
        </div>
        
        {task.description && (
          <p className={`text-sm mb-3 ${task.isCompleted ? 'text-slate-500 line-through' : 'text-slate-600'}`}>
            {task.description}
          </p>
        )}
        
        <div className="flex flex-wrap items-center justify-between text-xs">
          <div className="flex items-center text-slate-500 mb-1">
            <span className="material-icons text-xs mr-1">schedule</span>
            <span>
              {task.isCompleted 
                ? '完了' 
                : task.dueDate 
                  ? formatDueDate(task.dueDate) 
                  : '期限なし'
              }
            </span>
          </div>
          
          <div className="flex items-center">
            <span className={`px-2 py-0.5 rounded-full ${
              task.isCompleted 
                ? 'bg-slate-100 text-slate-600' 
                : `bg-${priorityInfo.color}-100 text-${priorityInfo.color}-800`
            } font-medium`}>
              {task.isCompleted ? '完了' : priorityInfo.name}
            </span>
            
            {category && (
              <span className={`ml-2 px-2 py-0.5 rounded-full ${
                CATEGORY_COLORS[category.color]
              } font-medium`}>
                {category.name}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
