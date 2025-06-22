
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Users, AlertTriangle, Crown, Shield } from 'lucide-react';
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
  const { t } = useTranslation();
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
    if (!user?.id) {
      toast({
        title: t('admin.error'),
        description: t('admin.mustBeLoggedIn'),
        variant: "destructive",
      });
      return;
    }

    setLoading(userId);
    try {
      console.log(`Performing action ${action} on user ${userId}`);
      
      if (action === 'promote') {
        // Promouvoir l'utilisateur au rôle de modérateur
        const { error } = await supabase
          .from('user_roles')
          .upsert({
            user_id: userId,
            role: 'moderator',
            assigned_by: user.id
          });

        if (error) throw error;
        
        toast({
          title: t('admin.userPromoted'),
          description: t('admin.userPromotedDesc'),
        });
      } else if (action === 'demote') {
        // Rétrograder l'utilisateur au rôle d'utilisateur normal
        const { error } = await supabase
          .from('user_roles')
          .delete()
          .eq('user_id', userId);

        if (error) throw error;
        
        toast({
          title: t('admin.userDemoted'),
          description: t('admin.userDemotedDesc'),
        });
      } else {
        // Actions de modération (warn)
        let actionType: 'no_action' | 'warning' | 'content_removal' | 'account_suspension' | 'account_ban' = 'no_action';
        if (action === 'warn') actionType = 'warning';
        
        const { error } = await supabase
          .from('moderation_actions')
          .insert({
            moderator_id: user.id,
            target_user_id: userId,
            action_type: actionType,
            reason: `Action ${action} effectuée par l'administrateur`,
            expires_at: null
          });

        if (error) throw error;

        toast({
          title: t('admin.actionPerformed'),
          description: t('admin.userWarned'),
        });
      }

      onRefresh();
    } catch (error) {
      console.error('Error performing user action:', error);
      toast({
        title: t('admin.error'),
        description: t('admin.cannotPerformAction'),
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
          <span>{t('admin.usersManagement')}</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {users.length === 0 ? (
            <p className="text-center text-gray-500 py-8">{t('admin.noUsersFound')}</p>
          ) : (
            <>
              {/* Vue mobile */}
              <div className="block md:hidden space-y-4">
                {users.map((userItem) => (
                  <Card key={userItem.id} className="p-4">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <div className="flex items-center space-x-2">
                            <h3 className="font-semibold text-sm">{userItem.full_name}</h3>
                            <Badge variant={getRoleBadgeVariant(userItem.role)} className="text-xs">
                              {userItem.role}
                            </Badge>
                          </div>
                          <p className="text-xs text-gray-600">@{userItem.username}</p>
                        </div>
                        <UserOnlineStatus userId={userItem.id} showAsButton={true} />
                      </div>
                      
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>{userItem.posts_count} {t('admin.posts')}</span>
                        <span>{userItem.followers_count} {t('admin.followers')}</span>
                      </div>
                      
                      <div className="flex flex-wrap gap-2">
                        <FollowButton userId={userItem.id} userName={userItem.full_name} size="sm" variant="outline" />
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleUserAction(userItem.id, 'warn')}
                          disabled={loading === userItem.id}
                          className="flex items-center space-x-1"
                        >
                          <AlertTriangle className="h-3 w-3" />
                          <span className="text-xs">{t('admin.warn')}</span>
                        </Button>
                        {userItem.role === 'user' && (
                          <Button
                            size="sm"
                            variant="secondary"
                            onClick={() => handleUserAction(userItem.id, 'promote')}
                            disabled={loading === userItem.id}
                            className="flex items-center space-x-1"
                          >
                            <Crown className="h-3 w-3" />
                            <span className="text-xs">{t('admin.promote')}</span>
                          </Button>
                        )}
                        {userItem.role === 'moderator' && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleUserAction(userItem.id, 'demote')}
                            disabled={loading === userItem.id}
                            className="flex items-center space-x-1"
                          >
                            <Shield className="h-3 w-3" />
                            <span className="text-xs">{t('admin.demote')}</span>
                          </Button>
                        )}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>

              {/* Vue desktop */}
              <div className="hidden md:block space-y-4">
                {users.map((userItem) => (
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
                          <span>{userItem.posts_count} {t('admin.publications')}</span>
                          <span>{userItem.followers_count} {t('admin.followers')}</span>
                          <span>{t('admin.subscribedSince')} {new Date(userItem.created_at).toLocaleDateString('fr-FR')}</span>
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
                          <span>{t('admin.warn')}</span>
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
                            <span>{t('admin.promote')}</span>
                          </Button>
                        )}
                        {userItem.role === 'moderator' && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleUserAction(userItem.id, 'demote')}
                            disabled={loading === userItem.id}
                            className="flex items-center space-x-1"
                          >
                            <Shield className="h-4 w-4" />
                            <span>{t('admin.demote')}</span>
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default UsersManagement;
