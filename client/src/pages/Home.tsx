import { useState } from "react";
import AppLayout from "@/components/AppLayout";
import Sidebar from "@/components/Sidebar";
import { Header } from "@/components/Header";
import ControlBar from "@/components/ControlBar";
import ProgressBar from "@/components/ProgressBar";
import TaskGrid from "@/components/TaskGrid";
import TaskModal from "@/components/TaskModal";
import CategoryModal from "@/components/CategoryModal";
import MobileNavBar from "@/components/MobileNavBar";
import { useTaskContext } from "@/contexts/TaskContext";
import { ViewMode } from "@/types";

export default function Home() {
  const { 
    isTaskModalOpen, 
    setTaskModalOpen, 
    isCategoryModalOpen, 
    setCategoryModalOpen,
    tasks
  } = useTaskContext();

  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  
  // 完了タスクの数を計算
  const completedTasksCount = tasks.filter(task => task.isCompleted).length;
  const totalTasksCount = tasks.length;
  
  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-slate-50 text-slate-800">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        
        <div className="bg-white p-4 border-b border-slate-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <ControlBar viewMode={viewMode} setViewMode={setViewMode} />
        </div>
        
        <div className="bg-white px-4 py-3 border-b border-slate-200">
          <ProgressBar completed={completedTasksCount} total={totalTasksCount} />
        </div>
        
        <TaskGrid viewMode={viewMode} />
        
        {/* モバイル用のFloating Action Button - PCでは非表示 */}
        <button 
          onClick={() => setTaskModalOpen(true)}
          className="md:hidden fixed bottom-16 right-6 bg-blue-600 text-white rounded-full p-3 shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 z-10 transition-all duration-300 transform hover:scale-110"
          aria-label="タスクを追加"
          style={{
            background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
            boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2)'
          }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
        </button>
        
        <MobileNavBar 
          onAddTask={() => setTaskModalOpen(true)} 
        />
        
        {/* Modals */}
        {isTaskModalOpen && <TaskModal />}
        {isCategoryModalOpen && <CategoryModal />}
      </div>
    </div>
  );
}
