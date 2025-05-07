import { useTaskContext } from "@/contexts/TaskContext";

export default function FilterList() {
  const { filters, setFilters } = useTaskContext();
  
  const handleTodayDueClick = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // フィルターが既に今日の期限のみになっている場合はリセット
    if (filters.dueDateToday) {
      setFilters({ ...filters, dueDateToday: undefined });
    } else {
      setFilters({ ...filters, dueDateToday: true });
    }
  };
  
  const handleHighPriorityClick = () => {
    // フィルターが既に高優先度のみになっている場合はリセット
    if (filters.priority === 3) {
      setFilters({ ...filters, priority: undefined });
    } else {
      setFilters({ ...filters, priority: 3 });
    }
  };
  
  const handleCompletedClick = () => {
    // フィルターが既に完了済みのみになっている場合はリセット
    if (filters.isCompleted === true) {
      setFilters({ ...filters, isCompleted: undefined });
    } else {
      setFilters({ ...filters, isCompleted: true });
    }
  };
  
  return (
    <div className="space-y-1">
      <button 
        className={`flex items-center w-full px-3 py-3 text-left rounded-md hover:bg-slate-100 transition-all ${
          filters.dueDateToday ? 'selected-item' : 'text-slate-700'
        }`}
        onClick={handleTodayDueClick}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
        <span>今日期限</span>
      </button>
      
      <button 
        className={`flex items-center w-full px-3 py-3 text-left rounded-md hover:bg-slate-100 transition-all ${
          filters.priority === 3 ? 'selected-item' : 'text-slate-700'
        }`}
        onClick={handleHighPriorityClick}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2"><path d="m8.5 14.5 5-5"></path><circle cx="10" cy="13" r="8"></circle></svg>
        <span>高優先度</span>
      </button>
      
      <button 
        className={`flex items-center w-full px-3 py-3 text-left rounded-md hover:bg-slate-100 transition-all ${
          filters.isCompleted === true ? 'selected-item' : 'text-slate-700'
        }`}
        onClick={handleCompletedClick}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
        <span>完了済み</span>
      </button>
    </div>
  );
}
