import { useTaskContext } from "@/contexts/TaskContext";

export function Header() {
  const { setSidebarOpen, searchTerm, setSearchTerm, setTaskModalOpen } = useTaskContext();
  
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };
  
  return (
    <div className="bg-white border-b border-slate-200 p-4 flex items-center justify-between">
      {/* モバイル用のハンバーガーメニュー - 左配置 */}
      <div className="md:hidden">
        <button 
          id="mobileMenuBtn" 
          className="text-slate-600 hover:text-slate-800"
          onClick={() => setSidebarOpen(true)}
          aria-label="メニューを開く"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
        </button>
      </div>
      
      {/* 常に表示するロゴ/タイトル - モバイルでは中央寄せ、PCでは左寄せ */}
      <h1 className="text-xl font-bold text-primary-600 flex items-center md:ml-0 mx-auto md:mx-0">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2"><path d="M8 2v4"></path><path d="M16 2v4"></path><rect width="18" height="18" x="3" y="4" rx="2"></rect><path d="M3 10h18"></path><path d="m9 16 2 2 4-4"></path></svg>
        TODO App
      </h1>
      
      {/* PC用のタスク追加ボタン - 右配置 */}
      <div className="flex items-center">
        <div className="hidden md:block">
          <button 
            className="flex items-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium shadow-sm transition-colors"
            onClick={() => setTaskModalOpen(true)}
            aria-label="タスクを追加"
            style={{
              background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
            タスク追加
          </button>
        </div>
        
        {/* モバイルでは空の要素を配置して左右対称に */}
        <div className="md:hidden w-6"></div>
      </div>
    </div>
  );
}
