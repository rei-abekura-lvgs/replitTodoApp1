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
        >
          <span className="material-icons">add</span>
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
