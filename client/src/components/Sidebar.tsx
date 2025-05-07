import { useTaskContext } from "@/contexts/TaskContext";
import CategoryList from "./CategoryList";
import FilterList from "./FilterList";

export default function Sidebar() {
  const { isSidebarOpen, setSidebarOpen, setCategoryModalOpen } = useTaskContext();
  
  return (
    <>
      {/* Desktop Sidebar */}
      <div className="bg-white border-r border-slate-200 w-full md:w-64 lg:w-72 flex-shrink-0 hidden md:flex md:flex-col shadow-sm">
        <SidebarContent onAddCategory={() => setCategoryModalOpen(true)} />
      </div>
      
      {/* Mobile Sidebar (Overlay) */}
      {isSidebarOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-slate-600 bg-opacity-75 transition-opacity"
            onClick={() => setSidebarOpen(false)}
          ></div>
          
          {/* Sidebar */}
          <div className="fixed inset-y-0 left-0 flex flex-col w-full max-w-xs bg-white shadow-xl">
            <div className="p-4 flex items-center justify-between border-b border-slate-100">
              <h1 className="text-xl font-bold text-primary-600 flex items-center">
                <span className="material-icons mr-2">checklist</span>
                TODO App
              </h1>
              <button
                className="text-slate-500 hover:text-slate-700"
                onClick={() => setSidebarOpen(false)}
              >
                <span className="material-icons">close</span>
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto">
              <SidebarContent onAddCategory={() => {
                setCategoryModalOpen(true);
                setSidebarOpen(false);
              }} />
            </div>
          </div>
        </div>
      )}
    </>
  );
}

interface SidebarContentProps {
  onAddCategory: () => void;
}

function SidebarContent({ onAddCategory }: SidebarContentProps) {
  return (
    <>
      <div className="p-4 flex items-center justify-between border-b border-slate-100">
        <h1 className="text-xl font-bold text-primary-600 flex items-center">
          <span className="material-icons mr-2">checklist</span>
          TODO App
        </h1>
      </div>
      
      {/* Categories section */}
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-medium text-slate-500 uppercase tracking-wider">カテゴリ</h2>
          <button
            onClick={onAddCategory}
            className="text-primary-600 hover:text-primary-800 text-sm font-medium"
          >
            <span className="material-icons text-sm">add</span>
            追加
          </button>
        </div>
        
        <CategoryList />
      </div>
      
      {/* Filters section */}
      <div className="p-4 border-t border-slate-100">
        <h2 className="text-sm font-medium text-slate-500 uppercase tracking-wider mb-4">フィルター</h2>
        <FilterList />
      </div>
    </>
  );
}
