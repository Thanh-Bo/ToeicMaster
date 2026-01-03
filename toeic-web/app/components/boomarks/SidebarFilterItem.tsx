// components/SidebarFilterItem.tsx
import React from "react";

interface Props {
  label: string;
  partNum: number | null;
  count?: number; // Số lượng câu hỏi
  icon?: React.ReactNode;
  isActive: boolean;
  onClick: (partNum: number | null) => void;
}

export default function SidebarFilterItem({ label, partNum, count, icon, isActive, onClick }: Props) {
  return (
    <button
      onClick={() => onClick(partNum)}
      className={`w-full text-left px-4 py-3 rounded-lg flex items-center justify-between transition-colors mb-1 group
        ${isActive 
          ? "bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 font-bold shadow-sm ring-1 ring-blue-200 dark:ring-blue-700" 
          : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-zinc-700 hover:text-gray-900 dark:hover:text-white"}`}
    >
      <div className="flex items-center gap-3">
        {icon && <span className={isActive ? "text-blue-600 dark:text-blue-400" : "text-gray-400 dark:text-gray-500 group-hover:text-gray-600 dark:group-hover:text-gray-400"}>{icon}</span>}
        <span className="text-sm">{label}</span>
      </div>
      
      <div className="flex items-center gap-2">
        {/* Badge hiển thị số lượng */}
        {count !== undefined && count > 0 && (
          <span className={`text-xs px-2 py-0.5 rounded-full 
            ${isActive ? "bg-white dark:bg-blue-800 text-blue-600 dark:text-blue-300" : "bg-gray-200 dark:bg-zinc-700 text-gray-500 dark:text-gray-400"}`}>
            {count}
          </span>
        )}
       
      </div>
    </button>
  );
}