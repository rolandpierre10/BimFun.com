
import React from 'react';
import { Badge } from "@/components/ui/badge";
import { Wifi, WifiOff } from 'lucide-react';

interface SimpleOnlineStatusProps {
  isOnline?: boolean;
  showText?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const SimpleOnlineStatus = ({ isOnline = false, showText = true, size = 'md' }: SimpleOnlineStatusProps) => {
  const getIconSize = () => {
    switch (size) {
      case 'sm': return 'h-2 w-2';
      case 'lg': return 'h-4 w-4';
      default: return 'h-3 w-3';
    }
  };

  if (isOnline) {
    return (
      <Badge variant="default" className="flex items-center gap-1">
        <Wifi className={getIconSize()} />
        {showText && 'En ligne'}
      </Badge>
    );
  }

  return (
    <Badge variant="secondary" className="flex items-center gap-1">
      <WifiOff className={getIconSize()} />
      {showText && 'Hors ligne'}
    </Badge>
  );
};

export default SimpleOnlineStatus;
