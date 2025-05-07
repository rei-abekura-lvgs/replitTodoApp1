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
        
        {/* Floating Action Button */}
        <button 
          onClick={() => setTaskModalOpen(true)}
          className="fixed bottom-16 md:bottom-6 right-6 bg-primary-600 text-white rounded-full p-3 shadow-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 z-10"
        >
          <span className="material-icons">add</span>
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
