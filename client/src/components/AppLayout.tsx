import { ReactNode } from "react";
import Sidebar from "./Sidebar";
import { Header } from "./Header";
import MobileNavBar from "./MobileNavBar";

interface AppLayoutProps {
  children: ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-slate-50 text-slate-800">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        
        <main className="flex-1 overflow-auto">
          {children}
        </main>
        
        <MobileNavBar onAddTask={() => {}} />
      </div>
    </div>
  );
}
