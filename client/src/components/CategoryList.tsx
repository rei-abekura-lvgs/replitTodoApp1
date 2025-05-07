import { useTaskContext } from "@/contexts/TaskContext";
import { CATEGORY_COLORS } from "@/types";

export default function CategoryList() {
  const { 
    categories, 
    isCategoriesLoading, 
    selectedCategory, 
    setSelectedCategory,
    tasks
  } = useTaskContext();
  
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
    <div className="space-y-1" data-bind="categories">
      <button 
        className={`flex items-center w-full px-3 py-2 text-left rounded-md ${
          selectedCategory === null 
            ? 'bg-primary-50 text-primary-700' 
            : 'hover:bg-slate-100 text-slate-700'
        }`}
        onClick={() => handleCategoryClick(null)}
      >
        <span className="material-icons text-sm mr-2">radio_button_unchecked</span>
        <span className="flex-1">すべて</span>
        <span className="text-xs px-2 py-0.5 rounded-full bg-primary-100 text-primary-800">{totalTaskCount}</span>
      </button>
      
      {categories.map(category => (
        <button 
          key={category.id}
          className={`flex items-center w-full px-3 py-2 text-left rounded-md ${
            selectedCategory === category.id 
              ? 'bg-primary-50 text-primary-700' 
              : 'hover:bg-slate-100 text-slate-700'
          }`}
          onClick={() => handleCategoryClick(category.id)}
        >
          <span className={`material-icons text-sm mr-2 ${CATEGORY_COLORS[category.color].split(' ')[0]}`}>circle</span>
          <span className="flex-1">{category.name}</span>
          <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">{category.taskCount}</span>
        </button>
      ))}
      
      {/* カテゴリーなしの表示（必要に応じて） */}
      {uncategorizedTaskCount > 0 && (
        <button 
          className={`flex items-center w-full px-3 py-2 text-left rounded-md ${
            selectedCategory === -1 
              ? 'bg-primary-50 text-primary-700' 
              : 'hover:bg-slate-100 text-slate-700'
          }`}
          onClick={() => handleCategoryClick(-1)}
        >
          <span className="material-icons text-sm mr-2 text-slate-400">help_outline</span>
          <span className="flex-1">カテゴリなし</span>
          <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">{uncategorizedTaskCount}</span>
        </button>
      )}
    </div>
  );
}
