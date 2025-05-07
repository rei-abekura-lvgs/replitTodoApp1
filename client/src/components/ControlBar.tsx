import { useTaskContext } from "@/contexts/TaskContext";
import { ViewMode } from "@/types";

interface ControlBarProps {
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
}

export default function ControlBar({ viewMode, setViewMode }: ControlBarProps) {
  const { 
    filters, 
    setFilters, 
    sortBy, 
    setSortBy,
    searchTerm,
    setSearchTerm
  } = useTaskContext();
  
  return (
    <>
      <div className="w-full md:w-auto">
        <div className="relative">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span className="material-icons text-slate-400">search</span>
          </span>
          <input
            type="text"
            placeholder="タスクを検索..."
            className="block w-full pl-10 pr-3 py-2 rounded-md border-slate-300 border shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      
      <div className="flex flex-wrap gap-2 w-full md:w-auto">
        <select
          className="block w-full md:w-auto px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 text-sm"
          value={filters.isCompleted === undefined ? "" : filters.isCompleted ? "completed" : "incomplete"}
          onChange={(e) => {
            if (e.target.value === "") {
              setFilters({ ...filters, isCompleted: undefined });
            } else {
              setFilters({ ...filters, isCompleted: e.target.value === "completed" });
            }
          }}
        >
          <option value="">すべての状態</option>
          <option value="incomplete">未完了</option>
          <option value="completed">完了済み</option>
        </select>
        
        <select
          className="block w-full md:w-auto px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 text-sm"
          value={filters.priority === undefined ? "" : filters.priority}
          onChange={(e) => {
            if (e.target.value === "") {
              setFilters({ ...filters, priority: undefined });
            } else {
              setFilters({ ...filters, priority: parseInt(e.target.value) });
            }
          }}
        >
          <option value="">すべての優先度</option>
          <option value="3">高</option>
          <option value="2">中</option>
          <option value="1">低</option>
        </select>
        
        <select
          className="block w-full md:w-auto px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 text-sm"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as any)}
        >
          <option value="dueDate">期限順</option>
          <option value="priority">優先度順</option>
          <option value="title">名前順</option>
          <option value="createdAt">作成日順</option>
        </select>
        
        <div className="hidden md:flex items-center border border-slate-300 rounded-md overflow-hidden">
          <button 
            className={`p-2 ${viewMode === 'grid' ? 'bg-primary-600 text-white' : 'bg-white text-slate-700 hover:bg-slate-100'}`}
            title="グリッド表示"
            onClick={() => setViewMode('grid')}
          >
            <span className="material-icons text-sm">grid_view</span>
          </button>
          <button 
            className={`p-2 ${viewMode === 'list' ? 'bg-primary-600 text-white' : 'bg-white text-slate-700 hover:bg-slate-100'}`}
            title="リスト表示"
            onClick={() => setViewMode('list')}
          >
            <span className="material-icons text-sm">view_list</span>
          </button>
        </div>
      </div>
    </>
  );
}
