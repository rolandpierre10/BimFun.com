
import React from 'react';
import { Button } from "@/components/ui/button";
import { UserPlus, UserCheck } from 'lucide-react';
import { useFollowing } from '@/hooks/useFollowing';

interface FollowButtonProps {
  userId: string;
  userName?: string;
  variant?: 'default' | 'outline' | 'secondary';
  size?: 'sm' | 'default' | 'lg';
}

const FollowButton = ({ userId, userName, variant = 'default', size = 'default' }: FollowButtonProps) => {
  const { isFollowing, isLoading, toggleFollow, canFollow } = useFollowing(userId);

  if (!canFollow) {
    return null;
  }

  return (
    <Button
      onClick={toggleFollow}
      disabled={isLoading}
      variant={isFollowing ? 'outline' : variant}
      size={size}
      className="flex items-center gap-2"
    >
      {isFollowing ? (
        <>
          <UserCheck className="h-4 w-4" />
          Suivi
        </>
      ) : (
        <>
          <UserPlus className="h-4 w-4" />
          Suivre
        </>
      )}
    </Button>
  );
};

export default FollowButton;
