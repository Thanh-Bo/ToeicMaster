import React from 'react';
import Link from 'next/link';

import { 
  PlayCircle, Award, FileText, Megaphone, CheckCircle, BarChart3, 
  Mic2, Plane, DollarSign, Building2, Users, Presentation, Book 
} from 'lucide-react';

interface Props {
  topic: any;
}

export default function TopicCard({ topic }: Props) {
  const progress = Math.round((topic.learnedWords / topic.totalWords) * 100);
  
  // Màu sắc theo level
  const levelColor = 
    topic.level === 'Basic' ? 'bg-green-100 text-green-700' :
    topic.level === 'Intermediate' ? 'bg-blue-100 text-blue-700' :
    'bg-purple-100 text-purple-700';

  // Get description text (might have format "IconName - Text" or just text)
  const parts = topic.description?.split(' - ') || [''];
  const descriptionText = parts.length > 1 ? parts[1] : parts[0] || '';
  const iconNameFromDesc = parts.length > 1 ? parts[0] : '';

  // Map topic IDs or description to icons
  const iconMap: Record<string, React.ReactNode> = {
    FileText: <FileText size={32} className="text-blue-600 dark:text-blue-400" />,
    Megaphone: <Megaphone size={32} className="text-orange-600 dark:text-orange-400" />,
    CheckCircle: <CheckCircle size={32} className="text-green-600 dark:text-green-400" />,
    BarChart3: <BarChart3 size={32} className="text-purple-600 dark:text-purple-400" />,
    Mic2: <Mic2 size={32} className="text-pink-600 dark:text-pink-400" />,
    Plane: <Plane size={32} className="text-sky-600 dark:text-sky-400" />,
    DollarSign: <DollarSign size={32} className="text-emerald-600 dark:text-emerald-400" />,
    Building2: <Building2 size={32} className="text-gray-600 dark:text-gray-400" />,
    Users: <Users size={32} className="text-indigo-600 dark:text-indigo-400" />,
    Presentation: <Presentation size={32} className="text-red-600 dark:text-red-400" />,
    Book: <Book size={32} className="text-slate-600 dark:text-slate-400" />,
  };

  // Try to get icon from description first, fall back to topic ID-based assignment
  const iconsByTopicId: Record<number, string> = {
    1: 'FileText',       // Office & General
    2: 'Megaphone',      // Marketing & Communications
    3: 'CheckCircle',    // Meetings & Planning
    4: 'BarChart3',      // Finance & Reports
    5: 'DollarSign',     // Banking & Money
    6: 'Building2',      // Office & Management
    7: 'Users',          // HR & Personnel
    8: 'Presentation',   // Presentations
    9: 'Plane',          // Travel & Tourism
    10: 'Book',          // General Education
  };

  const iconName = iconNameFromDesc || iconsByTopicId[topic.id] || 'Book';
  const icon = iconMap[iconName] || iconMap['Book'];

  return (
    <Link href={`/vocabulary/${topic.id}`}>
    <div className="bg-white dark:bg-zinc-900/70 backdrop-blur-sm rounded-2xl shadow-lg dark:shadow-2xl/40 border border-gray-200 dark:border-zinc-800 hover:shadow-2xl dark:hover:shadow-2xl/50 transition-all duration-300 overflow-hidden flex flex-col h-full group hover:-translate-y-1 cursor-pointer">
      {/* Top Gradient Border Accent */}
      <div className="h-1.5 bg-gradient-to-r from-blue-500 via-blue-600 to-blue-400 group-hover:via-blue-500 transition-all"></div>

      <div className="p-7 flex-1 flex flex-col">
        {/* Header: Icon + Level + Progress */}
        <div className="flex justify-between items-start mb-5 gap-4">
          <div className="flex items-start gap-4 flex-1">
            {/* Icon */}
            <div className="p-3 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30 group-hover:shadow-lg transition-all flex-shrink-0">
              {icon}
            </div>
            
            <div className="flex-1">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{topic.title}</h3>
              <div className="flex items-center gap-2 flex-wrap">
                <span className={`text-xs font-black px-3 py-1.5 rounded-full transition-colors ${
                  topic.level === 'Basic' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300' :
                  topic.level === 'Intermediate' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300' :
                  'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300'
                }`}>
                  {topic.level}
                </span>
                {progress === 100 && <Award className="text-yellow-500 dark:text-yellow-400" size={18} />}
              </div>
            </div>
          </div>
        </div>
        
        {/* Description */}
        {descriptionText && (
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-5 line-clamp-2 font-medium">{descriptionText}</p>
        )}
        
        {/* Progress Bar with Animation */}
        <div className="mt-auto">
          <div className="flex justify-between text-xs font-bold text-gray-600 dark:text-gray-400 mb-3">
            <span>Tiến độ học</span>
            <span className="text-blue-600 dark:text-blue-400">{progress}%</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-zinc-700 rounded-full h-3 overflow-hidden shadow-sm">
            <div 
              className="bg-gradient-to-r from-blue-600 via-blue-500 to-blue-400 h-full rounded-full transition-all duration-500 shadow-lg" 
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <div className="flex items-center gap-2 mt-3 text-xs font-semibold text-gray-600 dark:text-gray-500">
            <span className="w-2 h-2 rounded-full bg-green-500"></span>
            <span>{topic.learnedWords}/{topic.totalWords} từ đã học</span>
          </div>
        </div>
      </div>

      {/* Footer Button */}
      <div className="px-7 py-5 border-t border-gray-200 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-800/50">
        <button 
          className="w-full py-2.5 px-4 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-bold rounded-lg flex items-center justify-center gap-2 transition-all shadow-md hover:shadow-lg active:scale-95 group/btn"
        >
          <PlayCircle size={18} className="group-hover/btn:scale-110 transition-transform" />
          {progress === 0 ? "Bắt đầu học" : progress === 100 ? "Ôn tập lại" : "Tiếp tục học"}
        </button>
      </div>
    </div>
    </Link>
  );
}