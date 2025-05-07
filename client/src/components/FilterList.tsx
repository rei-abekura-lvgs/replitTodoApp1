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
        className={`flex items-center w-full px-3 py-2 text-left rounded-md hover:bg-slate-100 ${
          filters.dueDateToday ? 'bg-primary-50 text-primary-700' : 'text-slate-700'
        }`}
        onClick={handleTodayDueClick}
      >
        <span className="material-icons text-sm mr-2">today</span>
        <span>今日期限</span>
      </button>
      
      <button 
        className={`flex items-center w-full px-3 py-2 text-left rounded-md hover:bg-slate-100 ${
          filters.priority === 3 ? 'bg-primary-50 text-primary-700' : 'text-slate-700'
        }`}
        onClick={handleHighPriorityClick}
      >
        <span className="material-icons text-sm mr-2">priority_high</span>
        <span>高優先度</span>
      </button>
      
      <button 
        className={`flex items-center w-full px-3 py-2 text-left rounded-md hover:bg-slate-100 ${
          filters.isCompleted === true ? 'bg-primary-50 text-primary-700' : 'text-slate-700'
        }`}
        onClick={handleCompletedClick}
      >
        <span className="material-icons text-sm mr-2">check_circle</span>
        <span>完了済み</span>
      </button>
    </div>
  );
}
