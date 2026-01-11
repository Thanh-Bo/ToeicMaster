"use client";

import { User } from "lucide-react";

interface AvatarProps {
  user: {
    fullName: string;
    avatarUrl?: string | null;
  } | null;
  className?: string;
}

export const UserAvatar = ({ user, className = "h-10 w-10" }: AvatarProps) => {
  const baseClasses = "flex items-center justify-center rounded-full bg-gradient-to-br from-blue-400 to-blue-600 text-white shadow-sm ring-2 ring-white dark:ring-zinc-700";

  if (user?.avatarUrl) {
    return (
      <img 
        src={user.avatarUrl} 
        alt={user.fullName} 
        className={`${className} rounded-full object-cover ring-2 ring-white dark:ring-zinc-700 shadow-sm`} 
      />
    );
  }
  
  if (user?.fullName) {
    const initial = user.fullName.charAt(0).toUpperCase();
    return (
      <div className={`${baseClasses} ${className} text-sm font-bold`}>
        {initial}
      </div>
    );
  }

  return (
    <div className={`${baseClasses} ${className}`}>
      <User size={16} />
    </div>
  );
};
