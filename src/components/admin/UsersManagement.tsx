
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Users, Ban, AlertTriangle, Crown, User } from 'lucide-react';
import UserOnlineStatus from '@/components/UserOnlineStatus';
import FollowButton from '@/components/FollowButton';

interface User {
  id: string;
  full_name: string;
  username: string;
  created_at: string;
  posts_count: number;
  followers_count: number;
  role: string;
  subscribed: boolean;
  subscription_tier: string;
}

interface UsersManagementProps {
  users: User[];
  onUserAction: (userId: string, action: 'ban' | 'unban' | 'warn' | 'promote' | 'demote') => void;
  onRefresh: () => void;
}

const UsersManagement: React.FC<UsersManagementProps> = ({ users, onUserAction, onRefresh }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState<string | null>(null);

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case 'admin': return 'destructive';
      case 'moderator': return 'secondary';
      case 'user': return 'outline';
      default: return 'outline';
    }
  };

  const handleUserAction = async (userId: string, action: 'ban' | 'unban' | 'warn' | 'promote' | 'demote') => {
    setLoading(userId);
    try {
      console.log(`Performing action ${action} on user ${userId}`);
      
      let actionType: 'no_action' | 'warning' | 'content_removal' | 'account_suspension' | 'account_ban' = 'no_action';
      if (action === 'ban') actionType = 'account_ban';
      if (action === 'warn') actionType = 'warning';
      
      const expirationDate = new Date();
      expirationDate.setDate(expirationDate.getDate() + 30); // 30 jours d'expiration

      const { error } = await supabase
        .from('moderation_actions')
        .insert({
          moderator_id: user?.id,
          target_user_id: userId,
          action_type: actionType,
          reason: `Action ${action} effectuée par l'administrateur`,
          expires_at: actionType === 'account_ban' ? expirationDate.toISOString() : null
        });

      if (error) {
        console.error('Error performing user action:', error);
        throw error;
      }

      toast({
        title: "Action effectuée",
        description: `L'utilisateur a été ${action === 'ban' ? 'banni' : action === 'unban' ? 'débanni' : 'averti'}`,
      });

      onRefresh();
    } catch (error) {
      console.error('Error performing user action:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'effectuer cette action",
        variant: "destructive",
      });
    } finally {
      setLoading(null);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Users className="h-5 w-5" />
          <span>Gestion des Utilisateurs</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {users.length === 0 ? (
            <p className="text-center text-gray-500 py-8">Aucun utilisateur trouvé</p>
          ) : (
            users.map((userItem) => (
              <div key={userItem.id} className="border rounded-lg p-4 space-y-3">
                <div className="flex justify-between items-start">
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <h3 className="font-semibold">{userItem.full_name}</h3>
                      <Badge variant={getRoleBadgeVariant(userItem.role)}>
                        {userItem.role}
                      </Badge>
                      {userItem.subscribed && (
                        <Badge variant="default">
                          {userItem.subscription_tier}
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-600">@{userItem.username}</p>
                    <div className="flex space-x-4 text-sm text-gray-500">
                      <span>{userItem.posts_count} publications</span>
                      <span>{userItem.followers_count} abonnés</span>
                      <span>Inscrit: {new Date(userItem.created_at).toLocaleDateString('fr-FR')}</span>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2 items-center">
                    <FollowButton userId={userItem.id} userName={userItem.full_name} size="sm" variant="outline" />
                    <UserOnlineStatus userId={userItem.id} showAsButton={true} />
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleUserAction(userItem.id, 'warn')}
                      disabled={loading === userItem.id}
                      className="flex items-center space-x-1"
                    >
                      <AlertTriangle className="h-4 w-4" />
                      <span>Avertir</span>
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleUserAction(userItem.id, 'ban')}
                      disabled={loading === userItem.id}
                      className="flex items-center space-x-1"
                    >
                      <Ban className="h-4 w-4" />
                      <span>Bannir</span>
                    </Button>
                    {userItem.role === 'user' && (
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => handleUserAction(userItem.id, 'promote')}
                        disabled={loading === userItem.id}
                        className="flex items-center space-x-1"
                      >
                        <Crown className="h-4 w-4" />
                        <span>Promouvoir</span>
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default UsersManagement;
