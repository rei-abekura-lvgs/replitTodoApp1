import React from 'react';
import { Button } from '@/components/ui/button';
import { Task } from '@shared/schema';

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  task: Task | null;
}

export default function DeleteConfirmModal({ 
  isOpen, 
  onClose, 
  onConfirm, 
  task 
}: DeleteConfirmModalProps) {
  if (!isOpen || !task) return null;
  
  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fadeIn"
      onClick={onClose}
      // viteのHMRで問題が起きないように
      style={{ animation: 'fadeIn 0.2s ease-in-out' }}
    >
      <div 
        className="bg-white rounded-xl shadow-lg max-w-md w-full mx-4 animate-scaleIn"
        style={{
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          animation: 'scaleIn 0.2s ease-out'
        }}
        onClick={e => e.stopPropagation()}
      >
        <div className="p-5 sm:p-6">
          <div className="flex items-center mb-5">
            <div className="bg-red-100 rounded-full p-3 mr-4">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="24" 
                height="24" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                className="text-red-600"
              >
                <path d="M3 6h18"></path>
                <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
              </svg>
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-slate-900">タスクを削除しますか？</h3>
          </div>
          
          <div className="mb-6">
            <div className="bg-slate-50 px-4 py-3 rounded-lg mb-4 border border-slate-200">
              <p className="font-medium text-slate-800">{task.title}</p>
              {task.description && (
                <p className="text-sm text-slate-600 mt-1">{task.description}</p>
              )}
            </div>
            <p className="text-slate-600">このタスクを削除すると、この操作は<span className="font-semibold text-red-600">元に戻せません</span>。</p>
          </div>
          
          <div className="flex flex-col sm:flex-row-reverse sm:justify-start gap-3">
            <Button
              variant="destructive"
              onClick={onConfirm}
              className="w-full sm:w-auto shadow-sm hover:shadow"
              style={{
                transform: 'translateY(0)',
                transition: 'transform 0.2s, box-shadow 0.2s'
              }}
              onMouseOver={(e) => {
                const target = e.currentTarget as HTMLButtonElement;
                target.style.transform = 'translateY(-1px)';
                target.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
              }}
              onMouseOut={(e) => {
                const target = e.currentTarget as HTMLButtonElement;
                target.style.transform = 'translateY(0)';
                target.style.boxShadow = '0 1px 3px 0 rgba(0, 0, 0, 0.1)';
              }}
            >
              削除する
            </Button>
            <Button
              variant="outline"
              onClick={onClose}
              className="w-full sm:w-auto"
            >
              キャンセル
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}