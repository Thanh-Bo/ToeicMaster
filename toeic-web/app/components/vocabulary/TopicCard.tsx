import React from 'react';

import { PlayCircle, Award } from 'lucide-react';
import { Topic } from '@/app/types';

interface Props {
  topic: Topic;
  onStart: (id: number) => void;
}

export default function TopicCard({ topic, onStart }: Props) {
  const progress = Math.round((topic.learnedWords / topic.totalWords) * 100);
  
  // Màu sắc theo level
  const levelColor = 
    topic.level === 'Basic' ? 'bg-green-100 text-green-700' :
    topic.level === 'Intermediate' ? 'bg-blue-100 text-blue-700' :
    'bg-purple-100 text-purple-700';

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all overflow-hidden flex flex-col h-full">
      <div className="p-5 flex-1">
        <div className="flex justify-between items-start mb-3">
          <span className={`text-xs font-bold px-2 py-1 rounded-md ${levelColor}`}>
            {topic.level} ({topic.levelRange})
          </span>
          {progress === 100 && <Award className="text-yellow-500" size={20} />}
        </div>
        
        <h3 className="text-lg font-bold text-gray-800 mb-2">{topic.title}</h3>
        
        {/* Progress Bar */}
        <div className="mt-4">
          <div className="flex justify-between text-xs text-gray-500 mb-1">
            <span>Tiến độ</span>
            <span>{topic.learnedWords}/{topic.totalWords}</span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-500" 
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
      </div>

      <div className="p-4 border-t bg-gray-50">
        <button 
          onClick={() => onStart(topic.id)}
          className="w-full py-2 bg-white border border-blue-600 text-blue-600 font-bold rounded-lg hover:bg-blue-600 hover:text-white transition flex items-center justify-center gap-2"
        >
          <PlayCircle size={18} />
          {progress === 0 ? "Bắt đầu học" : "Học tiếp"}
        </button>
      </div>
    </div>
  );
}