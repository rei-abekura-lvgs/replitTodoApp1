interface ProgressBarProps {
  completed: number;
  total: number;
}

export default function ProgressBar({ completed, total }: ProgressBarProps) {
  const percentage = total > 0 ? (completed / total) * 100 : 0;
  
  return (
    <div className="flex items-center">
      <div className="flex-1 mr-4">
        <div className="bg-slate-200 rounded-full h-2 overflow-hidden">
          <div 
            className="bg-primary-600 h-full rounded-full" 
            style={{ width: `${percentage}%` }}
          ></div>
        </div>
      </div>
      <div className="text-sm text-slate-600">
        <span className="font-medium">{completed}/{total}</span> 完了
      </div>
    </div>
  );
}
