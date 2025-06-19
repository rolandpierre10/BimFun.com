
import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Ban, Search, Shield, UserPlus, Mail, Calendar, Lock } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface AdminUser {
  id: string;
  full_name: string;
  username: string;
  created_at: string;
  posts_count: number;
  followers_count: number;
  role: string;
  subscribed: boolean;
  subscription_tier: string;
  email?: string;
  is_banned?: boolean;
}

interface UsersManagementProps {
  users: AdminUser[];
  onUserAction: (userId: string, action: 'ban' | 'unban' | 'warn' | 'promote' | 'demote') => Promise<void>;
  onRefresh: () => void;
}

const UsersManagement: React.FC<UsersManagementProps> = ({ users, onUserAction, onRefresh }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const [banReason, setBanReason] = useState('');
  const [banDuration, setBanDuration] = useState('permanent');

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.username.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = selectedFilter === 'all' || 
                         (selectedFilter === 'banned' && user.is_banned) ||
                         (selectedFilter === 'active' && !user.is_banned) ||
                         user.role === selectedFilter;
    return matchesSearch && matchesFilter;
  });

  const handleBanUser = async (userId: string, reason: string, duration: string) => {
    try {
      const expiresAt = duration === 'permanent' ? null : 
                       duration === '7days' ? new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) :
                       duration === '30days' ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) :
                       new Date(Date.now() + 365 * 24 * 60 * 60 * 1000);

      const { error } = await supabase
        .from('moderation_actions')
        .insert({
          moderator_id: user?.id,
          target_user_id: userId,
          action_type: 'account_ban',
          reason: reason,
          expires_at: expiresAt
        });

      if (error) throw error;

      toast({
        title: "Utilisateur banni",
        description: `L'utilisateur a été banni avec succès`,
      });

      onRefresh();
    } catch (error) {
      console.error('Error banning user:', error);
      toast({
        title: "Erreur",
        description: "Impossible de bannir l'utilisateur",
        variant: "destructive",
      });
    }
  };

  const handleRoleChange = async (userId: string, newRole: string) => {
    try {
      const { error } = await supabase
        .from('user_roles')
        .upsert({
          user_id: userId,
          role: newRole,
          assigned_by: user?.id
        });

      if (error) throw error;

      toast({
        title: "Rôle modifié",
        description: `Le rôle de l'utilisateur a été modifié avec succès`,
      });

      onRefresh();
    } catch (error) {
      console.error('Error changing role:', error);
      toast({
        title: "Erreur",
        description: "Impossible de modifier le rôle",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Rechercher un utilisateur..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-64"
            />
          </div>
          <Select value={selectedFilter} onValueChange={setSelectedFilter}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filtrer par..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les utilisateurs</SelectItem>
              <SelectItem value="admin">Administrateurs</SelectItem>
              <SelectItem value="moderator">Modérateurs</SelectItem>
              <SelectItem value="user">Utilisateurs</SelectItem>
              <SelectItem value="active">Actifs</SelectItem>
              <SelectItem value="banned">Bannis</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Utilisateur</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Rôle</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead>Abonnement</TableHead>
              <TableHead>Publications</TableHead>
              <TableHead>Followers</TableHead>
              <TableHead>Inscription</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.map((user) => (
              <TableRow key={user.id}>
                <TableCell>
                  <div>
                    <div className="font-medium">{user.full_name}</div>
                    <div className="text-sm text-gray-500">@{user.username}</div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-1">
                    <Mail className="h-3 w-3 text-gray-400" />
                    <span className="text-sm">{user.email || 'N/A'}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <Select 
                    value={user.role} 
                    onValueChange={(value) => handleRoleChange(user.id, value)}
                  >
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="user">Utilisateur</SelectItem>
                      <SelectItem value="moderator">Modérateur</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    user.is_banned ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                  }`}>
                    {user.is_banned ? 'Banni' : 'Actif'}
                  </span>
                </TableCell>
                <TableCell>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    user.subscribed ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {user.subscribed ? user.subscription_tier : 'gratuit'}
                  </span>
                </TableCell>
                <TableCell>{user.posts_count}</TableCell>
                <TableCell>{user.followers_count}</TableCell>
                <TableCell>
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-3 w-3 text-gray-400" />
                    <span className="text-sm">{new Date(user.created_at).toLocaleDateString('fr-FR')}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onUserAction(user.id, 'warn')}
                    >
                      Avertir
                    </Button>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          size="sm"
                          variant={user.is_banned ? "default" : "destructive"}
                          onClick={() => setSelectedUser(user)}
                        >
                          {user.is_banned ? <Lock className="h-3 w-3" /> : <Ban className="h-3 w-3" />}
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>
                            {user.is_banned ? 'Débannir' : 'Bannir'} l'utilisateur
                          </DialogTitle>
                          <DialogDescription>
                            {user.is_banned 
                              ? `Êtes-vous sûr de vouloir débannir ${user.full_name} ?`
                              : `Configurez les détails du bannissement pour ${user.full_name}`
                            }
                          </DialogDescription>
                        </DialogHeader>
                        {!user.is_banned && (
                          <div className="space-y-4">
                            <div>
                              <label className="block text-sm font-medium mb-2">Raison</label>
                              <Input
                                value={banReason}
                                onChange={(e) => setBanReason(e.target.value)}
                                placeholder="Raison du bannissement..."
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium mb-2">Durée</label>
                              <Select value={banDuration} onValueChange={setBanDuration}>
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="7days">7 jours</SelectItem>
                                  <SelectItem value="30days">30 jours</SelectItem>
                                  <SelectItem value="1year">1 an</SelectItem>
                                  <SelectItem value="permanent">Permanent</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                        )}
                        <div className="flex justify-end space-x-2">
                          <Button
                            variant={user.is_banned ? "default" : "destructive"}
                            onClick={() => {
                              if (user.is_banned) {
                                onUserAction(user.id, 'unban');
                              } else {
                                handleBanUser(user.id, banReason, banDuration);
                              }
                            }}
                          >
                            {user.is_banned ? 'Débannir' : 'Bannir'}
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
};

export default UsersManagement;
