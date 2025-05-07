export type ColorType = 'blue' | 'green' | 'red' | 'purple' | 'amber';

export const PRIORITY_LABELS = {
  1: { name: '低', color: 'green' },
  2: { name: '中', color: 'amber' },
  3: { name: '高', color: 'red' }
};

export const CATEGORY_COLORS: Record<string, string> = {
  blue: 'text-blue-500 bg-blue-100',
  green: 'text-green-500 bg-green-100',
  red: 'text-red-500 bg-red-100',
  purple: 'text-purple-500 bg-purple-100',
  amber: 'text-amber-500 bg-amber-100'
};

export const PRIORITY_COLORS = {
  1: 'border-green-500',   // 低
  2: 'border-amber-500',   // 中
  3: 'border-red-500'      // 高
};

export type ViewMode = 'grid' | 'list';
