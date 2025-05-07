import { useTaskContext } from "@/contexts/TaskContext";

interface MobileNavBarProps {
  onAddTask: () => void;
}

export default function MobileNavBar({ onAddTask }: MobileNavBarProps) {
  const { setSidebarOpen } = useTaskContext();
  
  return (
    <div className="md:hidden bg-white border-t border-slate-200 fixed bottom-0 left-0 right-0 flex justify-around z-10">
      <button className="py-3 px-5 text-primary-600">
        <span className="material-icons">dashboard</span>
      </button>
      <button 
        className="py-3 px-5 text-slate-500 hover:text-slate-700"
        onClick={() => setSidebarOpen(true)}
      >
        <span className="material-icons">category</span>
      </button>
      <div className="py-1 flex items-center justify-center">
        <button 
          className="bg-primary-600 text-white rounded-full p-3 shadow hover:bg-primary-700"
          onClick={onAddTask}
          aria-label="タスクを追加"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
        </button>
      </div>
      <button className="py-3 px-5 text-slate-500 hover:text-slate-700">
        <span className="material-icons">filter_list</span>
      </button>
      <button className="py-3 px-5 text-slate-500 hover:text-slate-700">
        <span className="material-icons">settings</span>
      </button>
    </div>
  );
}
