
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from '@/contexts/AuthContext';
import { Users, AlertTriangle, Crown, Shield, UserCheck, RefreshCw } from 'lucide-react';
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
  loading?: boolean;
}

const UsersManagement: React.FC<UsersManagementProps> = ({ users, onUserAction, onRefresh, loading = false }) => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { toast } = useToast();
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  console.log('UsersManagement received users:', users);

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
        title: "Erreur",
        description: "Vous devez être connecté pour effectuer cette action",
        variant: "destructive",
      });
      return;
    }

    if (userId === user.id) {
      toast({
        title: "Action interdite",
        description: "Vous ne pouvez pas effectuer d'action sur votre propre compte",
        variant: "destructive",
      });
      return;
    }

    setActionLoading(userId);
    try {
      console.log(`Performing action ${action} on user ${userId}`);
      await onUserAction(userId, action);
    } catch (error) {
      console.error('Error performing user action:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'effectuer cette action",
        variant: "destructive",
      });
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Users className="h-5 w-5" />
            <span>Gestion des Utilisateurs</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-500">Chargement des utilisateurs...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!users || users.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Users className="h-5 w-5" />
              <span>Gestion des Utilisateurs</span>
            </div>
            <Button 
              onClick={onRefresh} 
              variant="outline" 
              size="sm"
              disabled={loading}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Actualiser
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 mb-4">Aucun utilisateur trouvé</p>
            <Button 
              onClick={onRefresh} 
              variant="outline" 
              disabled={loading}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Actualiser
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Users className="h-5 w-5" />
            <span>Gestion des Utilisateurs ({users.length})</span>
          </div>
          <Button 
            onClick={onRefresh} 
            variant="outline" 
            size="sm"
            disabled={loading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Actualiser
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
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
                        {userItem.id === user?.id && (
                          <Badge variant="default" className="text-xs">
                            <UserCheck className="h-3 w-3 mr-1" />
                            Vous
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-gray-600">@{userItem.username}</p>
                    </div>
                    <UserOnlineStatus userId={userItem.id} showAsButton={true} />
                  </div>
                  
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>{userItem.posts_count} publications</span>
                    <span>{userItem.followers_count} abonnés</span>
                  </div>
                  
                  {userItem.id !== user?.id && (
                    <div className="flex flex-wrap gap-2">
                      <FollowButton userId={userItem.id} userName={userItem.full_name} size="sm" variant="outline" />
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleUserAction(userItem.id, 'warn')}
                        disabled={actionLoading === userItem.id}
                        className="flex items-center space-x-1"
                      >
                        <AlertTriangle className="h-3 w-3" />
                        <span className="text-xs">Avertir</span>
                      </Button>
                      {userItem.role === 'user' && (
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => handleUserAction(userItem.id, 'promote')}
                          disabled={actionLoading === userItem.id}
                          className="flex items-center space-x-1"
                        >
                          <Crown className="h-3 w-3" />
                          <span className="text-xs">Promouvoir</span>
                        </Button>
                      )}
                      {userItem.role === 'moderator' && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleUserAction(userItem.id, 'demote')}
                          disabled={actionLoading === userItem.id}
                          className="flex items-center space-x-1"
                        >
                          <Shield className="h-3 w-3" />
                          <span className="text-xs">Rétrograder</span>
                        </Button>
                      )}
                    </div>
                  )}
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
                      {userItem.id === user?.id && (
                        <Badge variant="default">
                          <UserCheck className="h-3 w-3 mr-1" />
                          Vous
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-600">@{userItem.username}</p>
                    <div className="flex space-x-4 text-sm text-gray-500">
                      <span>{userItem.posts_count} publications</span>
                      <span>{userItem.followers_count} abonnés</span>
                      <span>Inscrit le {new Date(userItem.created_at).toLocaleDateString('fr-FR')}</span>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2 items-center">
                    <UserOnlineStatus userId={userItem.id} showAsButton={true} />
                    {userItem.id !== user?.id && (
                      <>
                        <FollowButton userId={userItem.id} userName={userItem.full_name} size="sm" variant="outline" />
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleUserAction(userItem.id, 'warn')}
                          disabled={actionLoading === userItem.id}
                          className="flex items-center space-x-1"
                        >
                          <AlertTriangle className="h-4 w-4" />
                          <span>Avertir</span>
                        </Button>
                        {userItem.role === 'user' && (
                          <Button
                            size="sm"
                            variant="secondary"
                            onClick={() => handleUserAction(userItem.id, 'promote')}
                            disabled={actionLoading === userItem.id}
                            className="flex items-center space-x-1"
                          >
                            <Crown className="h-4 w-4" />
                            <span>Promouvoir</span>
                          </Button>
                        )}
                        {userItem.role === 'moderator' && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleUserAction(userItem.id, 'demote')}
                            disabled={actionLoading === userItem.id}
                            className="flex items-center space-x-1"
                          >
                            <Shield className="h-4 w-4" />
                            <span>Rétrograder</span>
                          </Button>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default UsersManagement;
