import { useTaskContext } from "@/contexts/TaskContext";
import CategoryList from "./CategoryList";
import FilterList from "./FilterList";

export default function Sidebar() {
  const { isSidebarOpen, setSidebarOpen, setCategoryModalOpen, setTaskModalOpen } = useTaskContext();
  
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
            <div className="p-4 border-b border-slate-100">
              <div className="flex justify-end">
                <button
                  className="text-slate-500 hover:text-slate-700"
                  onClick={() => setSidebarOpen(false)}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                </button>
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4">
              {/* Categories section */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-sm font-medium text-slate-500 uppercase tracking-wider">カテゴリ</h2>
                  <button
                    onClick={() => {
                      setCategoryModalOpen(true);
                      setSidebarOpen(false);
                    }}
                    className="text-primary-600 hover:text-primary-800 text-sm font-medium"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                    追加
                  </button>
                </div>
                
                <CategoryList />
              </div>
              
              {/* Filters section */}
              <div className="border-t border-slate-100 pt-4">
                <h2 className="text-sm font-medium text-slate-500 uppercase tracking-wider mb-4">フィルター</h2>
                <FilterList />
              </div>
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
  const { setTaskModalOpen } = useTaskContext();
  return (
    <>

      
      {/* Categories section */}
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-medium text-slate-500 uppercase tracking-wider">カテゴリ</h2>
          <button
            onClick={onAddCategory}
            className="text-primary-600 hover:text-primary-800 text-sm font-medium"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
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
