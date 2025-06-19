
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { 
  Users, 
  FileText, 
  AlertTriangle, 
  TrendingUp, 
  DollarSign,
  Ban,
  CheckCircle,
  Search,
  Eye,
  Trash2
} from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface AdminStats {
  total_users: number;
  total_publications: number;
  total_subscribers: number;
  active_users_today: number;
  total_reports: number;
  revenue_this_month: number;
}

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
}

const AdminDashboard = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [publications, setPublications] = useState<any[]>([]);
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');

  useEffect(() => {
    if (user) {
      checkAdminAccess();
    }
  }, [user]);

  const checkAdminAccess = async () => {
    try {
      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user?.id)
        .eq('role', 'admin')
        .single();

      if (error || !data) {
        toast({
          title: "Accès refusé",
          description: "Vous n'avez pas les droits d'administrateur",
          variant: "destructive",
        });
        return;
      }

      loadDashboardData();
    } catch (error) {
      console.error('Error checking admin access:', error);
    }
  };

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      await Promise.all([
        loadStats(),
        loadUsers(),
        loadPublications(),
        loadReports()
      ]);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      // Try to get stats from the RPC function first
      const { data: rpcData, error: rpcError } = await supabase.rpc('get_admin_dashboard_stats');
      
      if (rpcError) {
        console.error('RPC Error:', rpcError);
        // Fallback to manual stats gathering
        await loadStatsFallback();
        return;
      }

      // Parse the JSON response from the RPC function
      const parsedStats = typeof rpcData === 'string' ? JSON.parse(rpcData) : rpcData;
      setStats(parsedStats);
    } catch (error) {
      console.error('Error loading stats:', error);
      await loadStatsFallback();
    }
  };

  const loadStatsFallback = async () => {
    try {
      const [usersCount, pubsCount, subsCount, reportsCount] = await Promise.all([
        supabase.from('profiles').select('id', { count: 'exact' }),
        supabase.from('publications').select('id', { count: 'exact' }),
        supabase.from('subscribers').select('id', { count: 'exact' }).eq('subscribed', true),
        supabase.from('reports').select('id', { count: 'exact' }).eq('status', 'pending')
      ]);

      setStats({
        total_users: usersCount.count || 0,
        total_publications: pubsCount.count || 0,
        total_subscribers: subsCount.count || 0,
        active_users_today: 0,
        total_reports: reportsCount.count || 0,
        revenue_this_month: 0
      });
    } catch (error) {
      console.error('Error in fallback stats:', error);
      setStats({
        total_users: 0,
        total_publications: 0,
        total_subscribers: 0,
        active_users_today: 0,
        total_reports: 0,
        revenue_this_month: 0
      });
    }
  };

  const loadUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select(`
          id,
          full_name,
          username,
          created_at,
          posts_count,
          followers_count
        `)
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;
      
      // Get user roles and subscriptions separately
      const userIds = data?.map(u => u.id) || [];
      
      const [rolesData, subscriptionsData] = await Promise.all([
        supabase.from('user_roles').select('user_id, role').in('user_id', userIds),
        supabase.from('subscribers').select('user_id, subscribed, subscription_tier').in('user_id', userIds)
      ]);

      const formattedUsers = data?.map(user => {
        const userRole = rolesData.data?.find(r => r.user_id === user.id);
        const userSub = subscriptionsData.data?.find(s => s.user_id === user.id);
        
        return {
          id: user.id,
          full_name: user.full_name || 'N/A',
          username: user.username || 'N/A',
          created_at: user.created_at,
          posts_count: user.posts_count || 0,
          followers_count: user.followers_count || 0,
          role: userRole?.role || 'user',
          subscribed: userSub?.subscribed || false,
          subscription_tier: userSub?.subscription_tier || 'free'
        };
      }) || [];

      setUsers(formattedUsers);
    } catch (error) {
      console.error('Error loading users:', error);
    }
  };

  const loadPublications = async () => {
    try {
      const { data, error } = await supabase
        .from('publications')
        .select(`
          id,
          title,
          created_at,
          is_public,
          likes_count,
          views_count,
          user_id
        `)
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;

      // Get user profiles for publications
      const userIds = data?.map(p => p.user_id) || [];
      const { data: profilesData } = await supabase
        .from('profiles')
        .select('id, full_name, username')
        .in('id', userIds);

      const formattedPubs = data?.map(pub => ({
        ...pub,
        profiles: profilesData?.find(p => p.id === pub.user_id)
      })) || [];

      setPublications(formattedPubs);
    } catch (error) {
      console.error('Error loading publications:', error);
    }
  };

  const loadReports = async () => {
    try {
      const { data, error } = await supabase
        .from('reports')
        .select(`
          id,
          report_type,
          status,
          description,
          created_at,
          reporter_id
        `)
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;

      // Get reporter profiles
      const reporterIds = data?.map(r => r.reporter_id).filter(Boolean) || [];
      const { data: profilesData } = await supabase
        .from('profiles')
        .select('id, full_name, username')
        .in('id', reporterIds);

      const formattedReports = data?.map(report => ({
        ...report,
        profiles: profilesData?.find(p => p.id === report.reporter_id)
      })) || [];

      setReports(formattedReports);
    } catch (error) {
      console.error('Error loading reports:', error);
    }
  };

  const handleUserAction = async (userId: string, action: 'ban' | 'unban' | 'warn') => {
    try {
      // Map the action to the correct enum values from the database
      let dbAction = action;
      if (action === 'ban') dbAction = 'account_ban';
      if (action === 'warn') dbAction = 'warning';
      
      const { error } = await supabase
        .from('moderation_actions')
        .insert({
          moderator_id: user?.id,
          target_user_id: userId,
          action_type: dbAction,
          reason: `Action ${action} effectuée par l'administrateur`
        });

      if (error) throw error;

      toast({
        title: "Action effectuée",
        description: `L'utilisateur a été ${action === 'ban' ? 'banni' : action === 'unban' ? 'débanni' : 'averti'}`,
      });

      loadUsers();
    } catch (error) {
      console.error('Error performing user action:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'effectuer cette action",
        variant: "destructive",
      });
    }
  };

  const handleDeletePublication = async (publicationId: string) => {
    try {
      const { error } = await supabase
        .from('publications')
        .delete()
        .eq('id', publicationId);

      if (error) throw error;

      toast({
        title: "Publication supprimée",
        description: "La publication a été supprimée avec succès",
      });

      loadPublications();
    } catch (error) {
      console.error('Error deleting publication:', error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer la publication",
        variant: "destructive",
      });
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.username.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = selectedFilter === 'all' || user.role === selectedFilter;
    return matchesSearch && matchesFilter;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Chargement du tableau de bord...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Tableau de Bord Admin</h1>
          <p className="text-gray-600">Gérez votre plateforme BimFun</p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg mb-6">
          {[
            { id: 'overview', label: 'Vue d\'ensemble', icon: TrendingUp },
            { id: 'users', label: 'Utilisateurs', icon: Users },
            { id: 'publications', label: 'Publications', icon: FileText },
            { id: 'reports', label: 'Signalements', icon: AlertTriangle }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-md font-medium transition-colors ${
                activeTab === tab.id
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <tab.icon className="h-4 w-4" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Utilisateurs Total</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats?.total_users || 0}</div>
                <p className="text-xs text-muted-foreground">Comptes créés</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Publications</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats?.total_publications || 0}</div>
                <p className="text-xs text-muted-foreground">Contenu publié</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Abonnés Premium</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats?.total_subscribers || 0}</div>
                <p className="text-xs text-muted-foreground">Utilisateurs payants</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Signalements</CardTitle>
                <AlertTriangle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats?.total_reports || 0}</div>
                <p className="text-xs text-muted-foreground">En attente</p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
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
                <select
                  value={selectedFilter}
                  onChange={(e) => setSelectedFilter(e.target.value)}
                  className="border border-gray-300 rounded-md px-3 py-2"
                >
                  <option value="all">Tous les rôles</option>
                  <option value="admin">Administrateurs</option>
                  <option value="moderator">Modérateurs</option>
                  <option value="user">Utilisateurs</option>
                </select>
              </div>
            </div>

            <Card>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Utilisateur</TableHead>
                    <TableHead>Rôle</TableHead>
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
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          user.role === 'admin' ? 'bg-red-100 text-red-800' :
                          user.role === 'moderator' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {user.role}
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
                      <TableCell>{new Date(user.created_at).toLocaleDateString('fr-FR')}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleUserAction(user.id, 'warn')}
                          >
                            Avertir
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleUserAction(user.id, 'ban')}
                          >
                            <Ban className="h-3 w-3" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          </div>
        )}

        {/* Publications Tab */}
        {activeTab === 'publications' && (
          <Card>
            <CardHeader>
              <CardTitle>Gestion des Publications</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Titre</TableHead>
                    <TableHead>Auteur</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Likes</TableHead>
                    <TableHead>Vues</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {publications.map((pub) => (
                    <TableRow key={pub.id}>
                      <TableCell className="font-medium">{pub.title}</TableCell>
                      <TableCell>
                        {pub.profiles?.full_name || 'Utilisateur supprimé'}
                      </TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          pub.is_public ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {pub.is_public ? 'Public' : 'Privé'}
                        </span>
                      </TableCell>
                      <TableCell>{pub.likes_count}</TableCell>
                      <TableCell>{pub.views_count}</TableCell>
                      <TableCell>{new Date(pub.created_at).toLocaleDateString('fr-FR')}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline">
                            <Eye className="h-3 w-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleDeletePublication(pub.id)}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}

        {/* Reports Tab */}
        {activeTab === 'reports' && (
          <Card>
            <CardHeader>
              <CardTitle>Signalements en Attente</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Type</TableHead>
                    <TableHead>Signaleur</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {reports.map((report) => (
                    <TableRow key={report.id}>
                      <TableCell>{report.report_type}</TableCell>
                      <TableCell>
                        {report.profiles?.full_name || 'Utilisateur anonyme'}
                      </TableCell>
                      <TableCell className="max-w-xs truncate">
                        {report.description}
                      </TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          report.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          report.status === 'resolved' ? 'bg-green-100 text-green-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {report.status}
                        </span>
                      </TableCell>
                      <TableCell>{new Date(report.created_at).toLocaleDateString('fr-FR')}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline">
                            Examiner
                          </Button>
                          <Button size="sm" variant="default">
                            <CheckCircle className="h-3 w-3" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
