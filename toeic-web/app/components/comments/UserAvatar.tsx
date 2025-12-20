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
  const baseClasses = "flex items-center justify-center rounded-full bg-gray-200 text-gray-500";

  if (user?.avatarUrl) {
    return <img src={user.avatarUrl} alt={user.fullName} className={`${className} rounded-full`} />;
  }
  
  if (user?.fullName) {
    const initial = user.fullName.charAt(0).toUpperCase();
    return (
      <div className={`${baseClasses} ${className}`}>
        <span className="font-bold" style={{ fontSize: `calc(${className.match(/h-(\d+)/)?.[1] || 10}rem / 2.5)` }}>{initial}</span>
      </div>
    );
  }

  return (
    <div className={`${baseClasses} ${className}`}>
      <User style={{ width: `calc(${className.match(/w-(\d+)/)?.[1] || 10}rem / 2)`, height: `calc(${className.match(/h-(\d+)/)?.[1] || 10}rem / 2)` }} />
    </div>
  );
};
