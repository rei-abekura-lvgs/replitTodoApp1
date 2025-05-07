import { format, isPast, isToday, isTomorrow } from "date-fns";
import { ja } from "date-fns/locale";
import { useState } from "react";
import { useTaskContext } from "@/contexts/TaskContext";
import { Task } from "@shared/schema";
import { CATEGORY_COLORS, PRIORITY_COLORS, PRIORITY_LABELS } from "@/types";
import DeleteConfirmModal from "./DeleteConfirmModal";

interface TaskCardProps {
  task: Task;
}

export default function TaskCard({ task }: TaskCardProps) {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  
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
  
  // 削除確認モーダルを開く
  const handleDeleteClick = () => {
    setIsDeleteModalOpen(true);
  };
  
  // 削除を確定
  const confirmDelete = () => {
    deleteTask(task.id);
    setIsDeleteModalOpen(false);
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
    <>
      <div className={`task-card bg-white rounded-lg shadow-sm ${borderColorClass} hover:shadow-md transition-shadow duration-200 ${task.isCompleted ? 'opacity-75' : 'border-l-4'}`}>
        <div className="p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center">
              <button 
                className={`mr-2 ${task.isCompleted ? 'text-primary-600' : 'text-slate-400 hover:text-primary-600'}`}
                onClick={handleToggleComplete}
              >
                {task.isCompleted ? (
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle></svg>
                )}
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
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
              </button>
              <button 
                className="p-1 text-slate-400 hover:text-red-600 rounded-full hover:bg-slate-100" 
                title="削除"
                onClick={handleDeleteClick}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path></svg>
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
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
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

      {/* 削除確認モーダル */}
      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        task={task}
      />
    </>
  );
}
