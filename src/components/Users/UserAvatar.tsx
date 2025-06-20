import React from 'react';
import Image from 'next/image';

interface UserAvatarProps {
  name: string;
  avatar?: string;
  className?: string;
}

export default function UserAvatar({ name, avatar, className = "" }: UserAvatarProps) {
  // Get initials from name
  const getInitials = (name: string) => {
    const names = name.split(' ');
    if (names.length >= 2) {
      return `${names[0][0]}${names[1][0]}`.toUpperCase();
    }
    return name[0].toUpperCase();
  };

  // If there's a valid avatar URL
  if (avatar && avatar !== 'null' && avatar !== 'undefined' && !avatar.includes('user.png')) {
    return (
      <div className={`h-10 w-10 rounded-full bg-gray-100 dark:bg-gray-700 overflow-hidden ${className}`}>
        <Image
          src={avatar}
          alt={name}
          width={40}
          height={40}
          className="object-cover w-full h-full"
        />
      </div>
    );
  }

  // Fallback to initials
  return (
    <div className={`h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center ${className}`}>
      <span className="text-sm font-medium text-blue-800 dark:text-blue-200">
        {getInitials(name)}
      </span>
    </div>
  );
} 