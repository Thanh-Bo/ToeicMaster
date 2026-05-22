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
  PlayCircle,
  Crown,
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
      <Link href={`/vocabulary/${topic.topicGuid || topic.id}`}>
      <div className={`bg-white dark:bg-zinc-900/70 backdrop-blur-md rounded-2xl shadow-xs hover:shadow-xl dark:hover:shadow-2xl/40 border border-gray-200/70 dark:border-zinc-800/80 transition-all duration-300 overflow-hidden flex flex-col h-full group hover:-translate-y-1.5 cursor-pointer ${
        topic.currentLevel === 5 ? 'ring-1 ring-yellow-400/30' : ''
      }`}>
        {/* Top Gradient Border Accent - Dynamic based on state */}
        <div className={`h-1.5 transition-all ${
          topic.currentLevel === 5
            ? 'bg-gradient-to-r from-yellow-400 via-amber-500 to-yellow-300'
            : topic.canReviewNow
            ? 'bg-gradient-to-r from-amber-400 via-orange-500 to-amber-300'
            : 'bg-gradient-to-r from-blue-500 via-indigo-600 to-cyan-400'
        }`}></div>

        <div className="p-5 sm:p-6 flex-1 flex flex-col">
          {/* Header: Icon + Level + Progress */}
          <div className="flex justify-between items-start mb-4 gap-3">
            <div className="flex items-start gap-3 sm:gap-4 flex-1">
              {/* Icon */}
              <div className="p-2.5 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-900/20 dark:to-blue-800/10 group-hover:shadow-md transition-all flex-shrink-0">
                <div className="w-6.5 h-6.5 sm:w-7.5 sm:h-7.5">{icon}</div>
              </div>
              
              <div className="flex-1 min-w-0">
                <h3 className="text-sm sm:text-base font-bold text-gray-900 dark:text-white mb-1.5 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors truncate">
                  {topic.title}
                </h3>
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className={`text-[10px] sm:text-xs font-bold px-2.5 py-1 rounded-full transition-colors ${
                    topic.level === 'Basic' ? 'bg-green-50 text-green-700 dark:bg-green-950/30 dark:text-green-400' :
                    topic.level === 'Intermediate' ? 'bg-blue-50 text-blue-700 dark:bg-blue-950/30 dark:text-blue-400' :
                    'bg-purple-50 text-purple-700 dark:bg-purple-950/30 dark:text-purple-400'
                  }`}>
                    {topic.level}
                  </span>
                  {topic.isExplanationPremiumRequired && (
                    <Crown className="h-3.5 w-3.5 text-yellow-500 animate-pulse" />
                  )}
                </div>
              </div>
            </div>
          </div>
          
          {/* Description */}
          {descriptionText && (
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2 font-medium leading-relaxed">
              {descriptionText}
            </p>
          )}
          
          {/* PHASE 1: 5-Level SRS Progress Bar */}
          <div className="mt-auto">
            {/* Header: Current Level */}
            <div className="flex justify-between items-center mb-2">
              <span className="text-[10px] sm:text-xs font-bold text-gray-500 dark:text-gray-400">Trạng thái ghi nhớ</span>
              <span className="text-xs sm:text-sm font-extrabold text-blue-600 dark:text-blue-400">{topic.currentLevel}/5</span>
            </div>
            
            {/* 5-Block Progress Visualization - Custom Pill shapes */}
            <div className="flex gap-1.5 mb-3.5">
              {[1, 2, 3, 4, 5].map((level, idx) => {
                const levelColors = {
                  1: { light: 'from-teal-400 to-teal-500 border-teal-500 shadow-xs shadow-teal-500/20', dark: 'dark:from-teal-600 dark:to-teal-700 dark:border-teal-700' },
                  2: { light: 'from-blue-500 to-blue-600 border-blue-500 shadow-xs shadow-blue-500/20', dark: 'dark:from-blue-600 dark:to-blue-700 dark:border-blue-700' },
                  3: { light: 'from-indigo-500 to-indigo-600 border-indigo-500 shadow-xs shadow-indigo-500/20', dark: 'dark:from-indigo-600 dark:to-indigo-700 dark:border-indigo-700' },
                  4: { light: 'from-orange-500 to-orange-600 border-orange-500 shadow-xs shadow-orange-500/20', dark: 'dark:from-orange-600 dark:to-orange-700 dark:border-orange-700' },
                  5: { light: 'from-yellow-400 to-yellow-500 border-yellow-500 shadow-xs shadow-yellow-500/20', dark: 'dark:from-yellow-500 dark:to-yellow-600 dark:border-yellow-600' },
                };
                
                const colors = levelColors[level as keyof typeof levelColors];
                const isActive = level <= topic.currentLevel;
                
                return (
                  <div
                    key={level}
                    className={`flex-1 h-5 sm:h-7.5 rounded-lg border transition-all duration-300 ${
                      isActive
                        ? `bg-linear-to-br ${colors.light} ${colors.dark} text-white`
                        : 'bg-gray-50/50 dark:bg-zinc-800/40 border-gray-200 dark:border-zinc-800/80 text-gray-400 dark:text-zinc-600 hover:border-gray-300 dark:hover:border-zinc-700'
                    } flex items-center justify-center text-[10px] sm:text-xs font-bold hover:scale-105 cursor-default`}
                    style={{
                      opacity: isActive ? 1 : 0.7,
                    }}
                    title={`Cấp độ ${level}${topic.wordCounts && topic.wordCounts[level] > 0 ? `: ${topic.wordCounts[level]} từ` : ''}`}
                  >
                    {isActive ? (
                      <span className="text-[10px] sm:text-xs font-black">{level}</span>
                    ) : (
                      <span className="text-[9px] sm:text-[10px] font-bold opacity-40">{level}</span>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Status Info */}
            <div className="flex items-center gap-1.5 mb-2.5 text-[10px] sm:text-xs">
              {topic.currentLevel === 5 ? (
                <>
                  <Award className="text-yellow-500 dark:text-yellow-400 animate-bounce" size={14} />
                  <span className="font-bold text-yellow-600 dark:text-yellow-400">Đã thành thạo 🎉</span>
                </>
              ) : topic.canReviewNow ? (
                <>
                  <Zap 
                    className="text-amber-500 dark:text-amber-400 animate-pulse"
                    size={14}
                  />
                  <span className="font-bold text-amber-600 dark:text-amber-400">Cần ôn tập ngay ⚡</span>
                </>
              ) : (
                <>
                  <Clock className="text-gray-400 dark:text-gray-500" size={14} />
                  <span className="font-bold text-gray-500 dark:text-gray-400 tabular-nums">
                    {timeRemaining && topic.nextReviewAt ? `Ôn tập sau ${timeRemaining}` : 'Chưa kích hoạt'}
                  </span>
                </>
              )}
            </div>

            {/* Word count info */}
            <div className="flex items-center gap-1.5 text-[10px] sm:text-xs font-bold text-gray-500 dark:text-gray-500">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              <span>{topic.totalWords} từ vựng</span>
            </div>
          </div>
        </div>

        {/* Footer Button - Enhanced CTA */}
        <div className="px-5 py-4 border-t border-gray-100 dark:border-zinc-800/80 bg-gray-50/50 dark:bg-zinc-900/30 relative">
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
                window.location.href = `/vocabulary/${topic.topicGuid || topic.id}`;
              }
            }}
            className={`w-full py-2.5 px-4 text-white font-black rounded-xl flex items-center justify-center gap-2 transition-all shadow-xs active:scale-98 group/btn text-xs sm:text-sm cursor-pointer ${
              topic.currentLevel === 5
                ? 'bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-600 hover:to-amber-600 shadow-sm shadow-yellow-500/10'
                : topic.canReviewNow
                ? 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 shadow-sm shadow-amber-500/10 animate-pulse'
                : 'bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 shadow-sm shadow-blue-500/10'
            }`}
          >
            <PlayCircle size={16} className="group-hover/btn:scale-110 transition-transform" />
            {topic.currentLevel === 5
              ? "Ôn tập tự do"
              : `Giai đoạn ${topic.currentLevel + 1}`}
          </button>
        </div>
      </div>
    </Link>

    {/* Warning Modal - Glassmorphic overlay */}
    {showWarningModal && (
      <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
        <div className="bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md rounded-2xl shadow-2xl max-w-sm w-full p-6 sm:p-7 mx-4 border border-gray-100 dark:border-zinc-800 animate-in fade-in zoom-in-95 duration-200">
          {/* Icon */}
          <div className="flex justify-center mb-4">
            <div className="w-12 h-12 rounded-full bg-amber-50 dark:bg-amber-950/40 flex items-center justify-center">
              <Clock className="text-amber-600 dark:text-amber-400" size={22} />
            </div>
          </div>

          {/* Title */}
          <h2 className="text-lg font-bold text-center text-gray-900 dark:text-white mb-2">
            Chưa đến lịch ôn tập
          </h2>

          {/* Message */}
          <p className="text-center text-sm text-gray-500 dark:text-gray-400 mb-1">
            Lịch ôn tập hiệu quả nhất của bạn là sau:
          </p>
          <p className="text-center text-lg font-extrabold text-amber-600 dark:text-amber-400 mb-5">
            {timeRemaining}
          </p>

          {/* Description */}
          <p className="text-center text-xs text-gray-400 dark:text-gray-500 mb-6 leading-relaxed">
            Để đạt hiệu quả ghi nhớ tối ưu của thuật toán SRS, bạn nên chờ đến giờ ôn. Tuy nhiên bạn vẫn có thể làm bài ngay nếu muốn.
          </p>

          {/* Buttons */}
          <div className="flex gap-3">
            <button
              onClick={() => setShowWarningModal(false)}
              className="flex-1 py-2.5 rounded-xl font-bold bg-gray-100 hover:bg-gray-200 dark:bg-zinc-850 dark:hover:bg-zinc-800 text-gray-700 dark:text-gray-300 transition-all flex items-center justify-center gap-1.5 text-xs sm:text-sm cursor-pointer"
            >
              <X size={16} />
              Quay lại
            </button>
            <button
              onClick={() => {
                setShowWarningModal(false);
                window.location.href = `/vocabulary/${topic.topicGuid || topic.id}`;
              }}
              className="flex-1 py-2.5 rounded-xl font-bold bg-amber-500 hover:bg-amber-600 text-white transition-all flex items-center justify-center gap-1.5 text-xs sm:text-sm cursor-pointer"
            >
              <Check size={16} />
              Làm ngay
            </button>
          </div>
        </div>
      </div>
    )}
    </>
  );
}