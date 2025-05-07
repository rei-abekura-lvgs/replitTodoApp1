import { useTaskContext } from "@/contexts/TaskContext";
import { CATEGORY_COLORS } from "@/types";
import { useState } from "react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

export default function CategoryList() {
  const { 
    categories, 
    isCategoriesLoading, 
    selectedCategory, 
    setSelectedCategory,
    tasks,
    deleteCategory
  } = useTaskContext();
  
  // 削除対象のカテゴリIDを管理するstate
  const [categoryToDelete, setCategoryToDelete] = useState<number | null>(null);
  
  // カテゴリーなしのタスク数をカウント
  const uncategorizedTaskCount = tasks.filter(task => task.categoryId === null || task.categoryId === undefined).length;
  
  // 全タスク数
  const totalTaskCount = tasks.length;
  
  const handleCategoryClick = (categoryId: number | null) => {
    if (categoryId === selectedCategory) {
      setSelectedCategory(null);
    } else {
      setSelectedCategory(categoryId);
    }
  };
  
  // 削除を実行する関数
  const handleDeleteCategory = async () => {
    if (categoryToDelete) {
      await deleteCategory(categoryToDelete);
      setCategoryToDelete(null); // 削除後にstateをリセット
    }
  };
  
  if (isCategoriesLoading) {
    return (
      <div className="space-y-1 animate-pulse">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="h-10 bg-slate-100 rounded-md"></div>
        ))}
      </div>
    );
  }

  return (
    <>
      {/* 削除確認ダイアログ */}
      <AlertDialog open={categoryToDelete !== null} onOpenChange={(open) => !open && setCategoryToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>カテゴリを削除しますか？</AlertDialogTitle>
            <AlertDialogDescription>
              このカテゴリを削除すると、このカテゴリに属するタスクはカテゴリなしになります。この操作は元に戻せません。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>キャンセル</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteCategory} className="bg-red-500 hover:bg-red-600 text-white">
              削除
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
      <div className="space-y-1" data-bind="categories">
        <button 
          className={`flex items-center w-full px-3 py-3 text-left rounded-md transition-all ${
            selectedCategory === null 
              ? 'selected-item' 
              : 'hover:bg-slate-100 text-slate-700'
          }`}
          onClick={() => handleCategoryClick(null)}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2"><circle cx="12" cy="12" r="10"></circle></svg>
          <span className="flex-1">すべて</span>
          <span className="text-xs px-2 py-0.5 rounded-full bg-primary-100 text-primary-800">{totalTaskCount}</span>
        </button>
        
        {categories.map(category => (
          <div key={category.id} className="relative group">
            <button 
              className={`flex items-center w-full px-3 py-3 text-left rounded-md transition-all ${
                selectedCategory === category.id 
                  ? 'selected-item' 
                  : 'hover:bg-slate-100 text-slate-700'
              }`}
              onClick={() => handleCategoryClick(category.id)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`mr-2 ${CATEGORY_COLORS[category.color].split(' ')[0]}`}><circle cx="12" cy="12" r="10"></circle></svg>
              <span className="flex-1">{category.name}</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">{category.taskCount}</span>
              <span 
                className="ml-2 text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation(); // 親のボタンのクリックイベントを停止
                  setCategoryToDelete(category.id);
                }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path></svg>
              </span>
            </button>
          </div>
        ))}
        
        {/* カテゴリーなしの表示（必要に応じて） */}
        {uncategorizedTaskCount > 0 && (
          <button 
            className={`flex items-center w-full px-3 py-3 text-left rounded-md transition-all ${
              selectedCategory === -1 
                ? 'selected-item' 
                : 'hover:bg-slate-100 text-slate-700'
            }`}
            onClick={() => handleCategoryClick(-1)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 text-slate-400"><circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><path d="M12 17h.01"></path></svg>
            <span className="flex-1">カテゴリなし</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">{uncategorizedTaskCount}</span>
          </button>
        )}
      </div>
    </>
  );
}