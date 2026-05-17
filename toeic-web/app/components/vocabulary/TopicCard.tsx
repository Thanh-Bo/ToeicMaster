import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

import { 
  FileSignature,
  Megaphone,
  ShieldCheck,
  BriefcaseBusiness,
  MicVocal,
  Plane,
  Landmark,
  Building2,
  UserRoundSearch,
  Presentation,
  FlaskConical,
  Truck,
  Headphones,
  BadgeCheck,
  Globe2,
  Boxes,
  MessagesSquare,
  ClipboardList,
  Handshake,
  Search,
  ShoppingCart,
  Calculator,
  Shield,
  Home,
  Factory,
  HeartPulse,
  Scale,
  UtensilsCrossed,
  Package,
  Laptop,Clock, Zap, X, Check,
  Award,
  PlayCircle
} from 'lucide-react';

interface Props {
  topic: any;
}

// PHASE 4: Sound effects (optional)
const playSound = (type: 'ready' | 'levelup' | 'unlock') => {
  if (typeof window === 'undefined') return;
  
  // Create simple beep sounds using Web Audio API
  const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
  if (!AudioContextClass) return;

  const audioContext = new AudioContextClass();
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();
  
  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);
  
  if (type === 'ready') {
    oscillator.frequency.value = 800;
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.2);
  } else if (type === 'levelup') {
    oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
    oscillator.frequency.linearRampToValueAtTime(1200, audioContext.currentTime + 0.1);
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.3);
  } else if (type === 'unlock') {
    oscillator.frequency.setValueAtTime(600, audioContext.currentTime);
    oscillator.frequency.linearRampToValueAtTime(1000, audioContext.currentTime + 0.15);
    gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.4);
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.4);
  }
};

export default function TopicCard({ topic }: Props) {
 
  const [timeRemaining, setTimeRemaining] = useState<string>('');
  const [showConfetti, setShowConfetti] = useState(false);
  const [showWarningModal, setShowWarningModal] = useState(false);
  const confettiRef = useRef<HTMLCanvasElement>(null);
  const prevCanReviewRef = useRef(topic.canReviewNow);
  
  // PHASE 3: Confetti animation for level-up
  useEffect(() => {
    if (!confettiRef.current) return;
    
    if (!showConfetti) return;
    
    const canvas = confettiRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    
    const pieces: any[] = [];
    
    // Create confetti pieces
    for (let i = 0; i < 50; i++) {
      pieces.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height - canvas.height,
        vx: (Math.random() - 0.5) * 8,
        vy: Math.random() * 6 + 4,
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 15,
        size: Math.random() * 4 + 2,
        color: ['#FFD700', '#FFA500', '#FF6B6B', '#4ECDC4', '#45B7D1'][Math.floor(Math.random() * 5)],
      });
    }
    
    let frameCount = 0;
    const maxFrames = 120; // 2 seconds at 60fps
    
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      for (let piece of pieces) {
        piece.x += piece.vx;
        piece.y += piece.vy;
        piece.vy += 0.1; // Gravity
        piece.rotation += piece.rotationSpeed;
        
        ctx.save();
        ctx.translate(piece.x, piece.y);
        ctx.rotate((piece.rotation * Math.PI) / 180);
        ctx.fillStyle = piece.color;
        ctx.fillRect(-piece.size / 2, -piece.size / 2, piece.size, piece.size);
        ctx.restore();
      }
      
      frameCount++;
      if (frameCount < maxFrames) {
        requestAnimationFrame(animate);
      } else {
        setShowConfetti(false);
      }
    };
    
    animate();
  }, [showConfetti]);
  
  // PHASE 2: Detect state changes and trigger effects
  useEffect(() => {
    if (topic.canReviewNow && !prevCanReviewRef.current) {
      // Transitioned to "Ready" state
      playSound('ready');
    }
    
    if (topic.currentLevel === 5) {
      // Reached mastery level
      setShowConfetti(true);
      
    }
    
    prevCanReviewRef.current = topic.canReviewNow;
  }, [topic.canReviewNow, topic.currentLevel]);
  
  // Calculate time remaining for countdown (PHASE 3: Enhanced with seconds)
  useEffect(() => {
    // Chỉ hiển thị countdown khi đã làm bài (currentLevel >= 1)
    if (topic.currentLevel === 0 || !topic.nextReviewAt || topic.canReviewNow) {
      setTimeRemaining('');
      return;
    }
    
    const updateTimer = () => {
      const nextReviewDate = new Date(topic.nextReviewAt);
      const now = new Date();
      const diff = nextReviewDate.getTime() - now.getTime();
      
      if (diff <= 0) {
        setTimeRemaining('Đã sẵn sàng');
      } else {
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        
        if (days > 0) {
          setTimeRemaining(`${days}d ${hours}h`);
        } else if (hours > 0) {
          setTimeRemaining(`${hours}h ${minutes}m`);
        } else if (minutes > 0) {
          setTimeRemaining(`${minutes}m ${seconds}s`);
        } else {
          setTimeRemaining(`${seconds}s`);
        }
      }
    };
    
    updateTimer();
    const interval = setInterval(updateTimer, 1000); // Update every second
    return () => clearInterval(interval);
  }, [topic.nextReviewAt, topic.canReviewNow]);
  
  // Get description text (might have format "IconName - Text" or just text)
  const parts = topic.description?.split(' - ') || [''];
  const descriptionText = parts.length > 1 ? parts[1] : parts[0] || '';
  const iconNameFromDesc = parts.length > 1 ? parts[0] : '';

  // Map topic IDs or description to icons
  const iconMap: Record<string, React.ReactNode> = {
  FileSignature: (
    <FileSignature
      size={32}
      className="text-blue-600 dark:text-blue-400"
    />
  ),

  Megaphone: (
    <Megaphone
      size={32}
      className="text-orange-600 dark:text-orange-400"
    />
  ),

  ShieldCheck: (
    <ShieldCheck
      size={32}
      className="text-green-600 dark:text-green-400"
    />
  ),

  BriefcaseBusiness: (
    <BriefcaseBusiness
      size={32}
      className="text-purple-600 dark:text-purple-400"
    />
  ),

  MicVocal: (
    <MicVocal
      size={32}
      className="text-pink-600 dark:text-pink-400"
    />
  ),

  Plane: (
    <Plane
      size={32}
      className="text-sky-600 dark:text-sky-400"
    />
  ),

  Landmark: (
    <Landmark
      size={32}
      className="text-emerald-600 dark:text-emerald-400"
    />
  ),

  Building2: (
    <Building2
      size={32}
      className="text-gray-600 dark:text-gray-400"
    />
  ),

  UserRoundSearch: (
    <UserRoundSearch
      size={32}
      className="text-indigo-600 dark:text-indigo-400"
    />
  ),

  Presentation: (
    <Presentation
      size={32}
      className="text-red-600 dark:text-red-400"
    />
  ),

  FlaskConical: (
    <FlaskConical
      size={32}
      className="text-pink-600 dark:text-pink-400"
    />
  ),

  Truck: (
    <Truck
      size={32}
      className="text-amber-600 dark:text-amber-400"
    />
  ),

  Headphones: (
    <Headphones
      size={32}
      className="text-cyan-600 dark:text-cyan-400"
    />
  ),

  BadgeCheck: (
    <BadgeCheck
      size={32}
      className="text-lime-600 dark:text-lime-400"
    />
  ),

  Globe2: (
    <Globe2
      size={32}
      className="text-teal-600 dark:text-teal-400"
    />
  ),

  Boxes: (
    <Boxes
      size={32}
      className="text-yellow-700 dark:text-yellow-400"
    />
  ),

  MessagesSquare: (
    <MessagesSquare
      size={32}
      className="text-violet-600 dark:text-violet-400"
    />
  ),

  ClipboardList: (
    <ClipboardList
      size={32}
      className="text-fuchsia-600 dark:text-fuchsia-400"
    />
  ),

  Handshake: (
    <Handshake
      size={32}
      className="text-rose-600 dark:text-rose-400"
    />
  ),

  Search: (
    <Search
      size={32}
      className="text-blue-500 dark:text-blue-300"
    />
  ),

  ShoppingCart: (
    <ShoppingCart
      size={32}
      className="text-green-500 dark:text-green-300"
    />
  ),

  Calculator: (
    <Calculator
      size={32}
      className="text-orange-500 dark:text-orange-300"
    />
  ),

  Shield: (
    <Shield
      size={32}
      className="text-red-500 dark:text-red-300"
    />
  ),

  Home: (
    <Home
      size={32}
      className="text-stone-600 dark:text-stone-400"
    />
  ),

  Factory: (
    <Factory
      size={32}
      className="text-zinc-700 dark:text-zinc-400"
    />
  ),

  HeartPulse: (
    <HeartPulse
      size={32}
      className="text-pink-500 dark:text-pink-300"
    />
  ),

  Scale: (
    <Scale
      size={32}
      className="text-neutral-700 dark:text-neutral-300"
    />
  ),

  UtensilsCrossed: (
    <UtensilsCrossed
      size={32}
      className="text-yellow-600 dark:text-yellow-300"
    />
  ),

  Package: (
    <Package
      size={32}
      className="text-orange-700 dark:text-orange-400"
    />
  ),

  Laptop: (
    <Laptop
      size={32}
      className="text-cyan-700 dark:text-cyan-300"
    />
  ),
};


  // Try to get icon from description first, fall back to topic ID-based assignment
  const iconsByTopicId: Record<number, string> = {
  1: 'FileSignature',     // Contracts
  2: 'Megaphone',         // Marketing
  3: 'ShieldCheck',       // Warranties
  4: 'BriefcaseBusiness', // Business Planning
  5: 'MicVocal',          // Conferences
  6: 'Plane',             // Travel & Tourism
  7: 'Landmark',          // Banking & Finance
  8: 'Building2',         // Office & Management
  9: 'UserRoundSearch',   // Hiring & HR
  10: 'Presentation',     // Meetings & Presentations

  11: 'FlaskConical',     // Product Development
  12: 'Truck',            // Supply Chain & Logistics
  13: 'Headphones',       // Customer Service
  14: 'BadgeCheck',       // Quality Control
  15: 'Globe2',           // International Trade
  16: 'Boxes',            // Inventory Management
  17: 'MessagesSquare',   // Corporate Communications
  18: 'ClipboardList',    // Project Management
  19: 'Handshake',        // Sales & Negotiation
  20: 'Search',           // Market Research
  21: 'ShoppingCart',     // E-commerce & Digital
  22: 'Calculator',       // Accounting & Auditing
  23: 'Shield',           // Insurance & Risk
  24: 'Home',             // Real Estate
  25: 'Factory',          // Manufacturing
  26: 'HeartPulse',       // Healthcare Business
  27: 'Scale',            // Legal & Compliance
  28: 'UtensilsCrossed',  // Restaurant & Hospitality
  29: 'Package',          // Shipping & Delivery
  30: 'Laptop',           // Technology & IT
};

  const iconName = iconNameFromDesc || iconsByTopicId[topic.id] || 'Book';
  const icon = iconMap[iconName] || iconMap['Book'];

  return (
    <>
      <Link href={`/vocabulary/${topic.id}`}>
      <div className="bg-white dark:bg-zinc-900/70 backdrop-blur-sm rounded-2xl shadow-lg dark:shadow-2xl/40 border border-gray-200 dark:border-zinc-800 hover:shadow-2xl dark:hover:shadow-2xl/50 transition-all duration-300 overflow-hidden flex flex-col h-full group hover:-translate-y-1 cursor-pointer">
        {/* Top Gradient Border Accent */}
        <div className="h-1.5 bg-linear-to-br from-blue-500 via-blue-600 to-blue-400 group-hover:via-blue-500 transition-all"></div>

        <div className="p-7 flex-1 flex flex-col">
          {/* Header: Icon + Level + Progress */}
          <div className="flex justify-between items-start mb-5 gap-4">
            <div className="flex items-start gap-4 flex-1">
              {/* Icon */}
              <div className="p-3 rounded-xl bg-linear-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30 group-hover:shadow-lg transition-all flex-shrink-0">
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
                 
                </div>
              </div>
            </div>
          </div>
          
          {/* Description */}
          {descriptionText && (
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-5 line-clamp-2 font-medium">{descriptionText}</p>
          )}
          
          {/* PHASE 1: 5-Level SRS Progress Bar */}
          <div className="mt-auto">
            {/* Header: Current Level */}
            <div className="flex justify-between items-center mb-3">
              <span className="text-xs font-bold text-gray-600 dark:text-gray-400">Cấp độ ghi nhớ</span>
              <span className="text-sm font-bold text-blue-600 dark:text-blue-400">{topic.currentLevel}/5</span>
            </div>
            
            {/* 5-Block Progress Visualization - PHASE 3: Animations */}
            <div className="flex gap-2 mb-4">
              {[1, 2, 3, 4, 5].map((level, idx) => {
                // Màu sắc cho từng level
                const levelColors = {
                  1: { light: 'from-teal-400 to-teal-500 border-teal-600 shadow-teal-400/50', dark: 'dark:from-teal-600 dark:to-teal-700 dark:border-teal-700 dark:shadow-teal-600/30' },
                  2: { light: 'from-blue-500 to-blue-600 border-blue-700 shadow-blue-500/50', dark: 'dark:from-blue-600 dark:to-blue-700 dark:border-blue-700 dark:shadow-blue-600/30' },
                  3: { light: 'from-indigo-500 to-indigo-600 border-indigo-700 shadow-indigo-500/50', dark: 'dark:from-indigo-600 dark:to-indigo-700 dark:border-indigo-700 dark:shadow-indigo-600/30' },
                  4: { light: 'from-orange-500 to-orange-600 border-orange-700 shadow-orange-500/50', dark: 'dark:from-orange-600 dark:to-orange-700 dark:border-orange-700 dark:shadow-orange-600/30' },
                  5: { light: 'from-yellow-400 to-yellow-500 border-yellow-600 shadow-yellow-400/50', dark: 'dark:from-yellow-500 dark:to-yellow-600 dark:border-yellow-600 dark:shadow-yellow-500/30' },
                };
                
                const colors = levelColors[level as keyof typeof levelColors];
                
                return (
                  <div
                    key={level}
                    className={`flex-1 h-8 rounded-lg border-2 transition-all duration-500 ${
                      level <= topic.currentLevel
                        ? `bg-linear-to-br ${colors.light} ${colors.dark}`
                        : 'bg-gray-100 dark:bg-zinc-700 border-gray-300 dark:border-zinc-600 hover:border-gray-400 dark:hover:border-zinc-500'
                    } flex items-center justify-center text-xs font-bold ${
                      level <= topic.currentLevel ? 'text-white' : 'text-gray-500 dark:text-gray-400'
                    } hover:scale-105 transition-transform cursor-default`}
                    style={{
                      animation: level <= topic.currentLevel 
                        ? `slideUp 0.4s ease-out ${idx * 50}ms forwards` 
                        : 'none',
                      opacity: level <= topic.currentLevel ? 1 : 0.6,
                    }}
                    title={`Level ${level}${topic.wordCounts && topic.wordCounts[level] > 0 ? `: ${topic.wordCounts[level]} từ` : ''}`}
                  >
                    {level <= topic.currentLevel && (
                      <span className="text-xs font-bold">{level}</span>
                    )}
                  </div>
                );
              })}
            </div>

            <style jsx>{`
              @keyframes slideUp {
                from { opacity: 0; transform: translateY(10px); }
                to { opacity: 1; transform: translateY(0); }
              }
              @keyframes pulse {
                0%, 100% { opacity: 1; }
                50% { opacity: 0.7; }
              }
              @keyframes glow {
                0%, 100% { box-shadow: 0 0 10px rgba(251, 146, 60, 0.5); }
                50% { box-shadow: 0 0 20px rgba(251, 146, 60, 0.8); }
              }
            `}</style>

            {/* Status: Ready / Cooldown / Mastered - PHASE 2: Enhanced State Detection */}
            <div className="flex items-center gap-2 mb-3 text-xs">
              {topic.currentLevel === 5 ? (
                <>
                  <Award className="text-yellow-500 dark:text-yellow-400 animate-bounce" size={16} />
                  <span className="font-semibold text-yellow-700 dark:text-yellow-300">Đã thành thạo 🎉</span>
                </>
              ) : topic.canReviewNow ? (
                <>
                  <Zap 
                    className="text-amber-500 dark:text-amber-400"
                    size={16}
                    style={{ animation: 'pulse 1s cubic-bezier(0.4, 0, 0.6, 1) infinite' }}
                  />
                  <span className="font-semibold text-amber-700 dark:text-amber-300">Cần ôn ngay ⚡</span>
                </>
              ) : (
                <>
                  <Clock className="text-gray-500 dark:text-gray-400" size={16} />
                  <span className="font-semibold text-gray-600 dark:text-gray-400 tabular-nums">
                    {timeRemaining && topic.nextReviewAt ? `Nên làm lại sau ${timeRemaining}` : 'Đang chờ...'}
                  </span>
                </>
              )}
            </div>

            {/* Word count info */}
            <div className="flex items-center gap-2 text-xs font-semibold text-gray-600 dark:text-gray-500">
              <span className="w-2 h-2 rounded-full bg-green-500"></span>
              <span>{topic.totalWords} từ </span>
            </div>
          </div>
        </div>

        {/* Footer Button - PHASE 2: Enhanced CTA Text */}
        <div className="px-7 py-5 border-t border-gray-200 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-800/50 relative">
          {/* PHASE 4: Confetti Canvas */}
          {showConfetti && (
            <canvas
              ref={confettiRef}
              className="absolute inset-0 pointer-events-none"
              style={{ width: '100%', height: '100%' }}
            />
          )}
          
          <button 
            onClick={(e) => {
              if (timeRemaining && !topic.canReviewNow) {
                e.preventDefault(); 
                e.stopPropagation();
                setShowWarningModal(true);
              } else {
                window.location.href = `/vocabulary/${topic.id}`;
              }
            }}
            className={`w-full py-2.5 px-4 text-white font-bold rounded-lg flex items-center justify-center gap-2 transition-all shadow-md hover:shadow-lg active:scale-95 group/btn ${
              topic.currentLevel === 5
                ? 'bg-linear-to-br from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 shadow-yellow-500/30'
                : topic.canReviewNow
                ? 'bg-linear-to-br from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 shadow-amber-500/30 animate-pulse'
                : 'bg-linear-to-br from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600'
            }`}
          >
            <PlayCircle size={18} className="group-hover/btn:scale-110 transition-transform" />
            
            {/* PHASE 2: Smart CTA Text */}
            {topic.currentLevel === 5
              ? " Ôn tập tự do"
              : ` Giai đoạn ${topic.currentLevel + 1}`}
          </button>
        </div>
      </div>
    </Link>

    {/* Warning Modal - Show when trying to review before scheduled time */}
    {showWarningModal && (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl max-w-sm p-8 mx-4 animate-in fade-in zoom-in-95 duration-300">
          {/* Icon */}
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
              <Clock className="text-orange-600 dark:text-orange-400" size={32} />
            </div>
          </div>

          {/* Title */}
          <h2 className="text-xl font-bold text-center text-gray-900 dark:text-white mb-2">
            Chưa đến lịch ôn tập
          </h2>

          {/* Message */}
          <p className="text-center text-gray-600 dark:text-gray-400 mb-2">
            Lịch ôn tập của bạn là:
          </p>
          <p className="text-center text-lg font-bold text-orange-600 dark:text-orange-400 mb-6">
            {timeRemaining}
          </p>

          {/* Description */}
          <p className="text-center text-sm text-gray-500 dark:text-gray-500 mb-8">
            Hãy chờ đến thời gian nếu muốn hiệu quả tối đa. Bạn có thể làm bài ngay nếu muốn.
          </p>

          {/* Buttons */}
          <div className="flex gap-3">
            <button
              onClick={() => setShowWarningModal(false)}
              
              className="flex-1 py-3 px-4 rounded-lg font-semibold bg-gray-200 hover:bg-gray-300 dark:bg-zinc-700 dark:hover:bg-zinc-600 text-gray-900 dark:text-white transition-all flex items-center justify-center gap-2"
            >
              <X size={20} />
              Hủy
            </button>
            <button
              onClick={() => {
                setShowWarningModal(false);
                window.location.href = `/vocabulary/${topic.id}`;
              }}
              className="flex-1 py-3 px-4 rounded-lg font-semibold bg-orange-600 hover:bg-orange-700 dark:bg-orange-600 dark:hover:bg-orange-700 text-white transition-all flex items-center justify-center gap-2"
            >
              <Check size={20} />
              Làm ngay
            </button>
          </div>
        </div>
      </div>
    )}
    </>
  );
}