import { useTaskContext } from "@/contexts/TaskContext";

export function Header() {
  const { setSidebarOpen, searchTerm, setSearchTerm } = useTaskContext();
  
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };
  
  return (
    <div className="md:hidden bg-white border-b border-slate-200 p-4 flex items-center justify-between">
      <h1 className="text-xl font-bold text-primary-600 flex items-center">
        <span className="material-icons mr-2">checklist</span>
        TODO App
      </h1>
      <button 
        id="mobileMenuBtn" 
        className="text-slate-500 hover:text-slate-700"
        onClick={() => setSidebarOpen(true)}
      >
        <span className="material-icons">menu</span>
      </button>
    </div>
  );
}
