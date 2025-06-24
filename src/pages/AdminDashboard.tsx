
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from "@/hooks/use-toast";
import { TrendingUp, Users, FileText, AlertTriangle, Settings, Plus, CreditCard } from 'lucide-react';

// Import des composants admin
import AdminStats from '@/components/admin/AdminStats';
import UsersManagement from '@/components/admin/UsersManagement';
import PublicationsManagement from '@/components/admin/PublicationsManagement';
import ReportsManagement from '@/components/admin/ReportsManagement';
import SystemSettings from '@/components/admin/SystemSettings';
import AdminPublicationCreator from '@/components/admin/AdminPublicationCreator';
import SubscriptionsManagement from '@/components/admin/SubscriptionsManagement';

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
  const [usersLoading, setUsersLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    if (user) {
      loadDashboardData();
    }
  }, [user]);

  // Charger les utilisateurs quand l'onglet devient actif
  useEffect(() => {
    if (activeTab === 'users' && !usersLoading && users.length === 0) {
      loadUsers();
    }
  }, [activeTab]);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      console.log('Loading admin dashboard data...');
      await Promise.all([
        loadStats(),
        loadPublications(),
        loadReports()
      ]);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les données du tableau de bord",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      console.log('Loading stats...');
      
      const [usersCount, pubsCount, subsCount, reportsCount] = await Promise.all([
        supabase.from('profiles').select('id', { count: 'exact' }),
        supabase.from('publications').select('id', { count: 'exact' }),
        supabase.from('subscribers').select('id', { count: 'exact' }).eq('subscribed', true),
        supabase.from('reports').select('id', { count: 'exact' }).eq('status', 'pending')
      ]);

      console.log('Stats loaded:', { usersCount, pubsCount, subsCount, reportsCount });

      setStats({
        total_users: usersCount.count || 0,
        total_publications: pubsCount.count || 0,
        total_subscribers: subsCount.count || 0,
        active_users_today: 0,
        total_reports: reportsCount.count || 0,
        revenue_this_month: 0
      });
    } catch (error) {
      console.error('Error loading stats:', error);
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
    setUsersLoading(true);
    try {
      console.log('Starting to load users...');
      
      // Charger les profils
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);

      console.log('Profiles query result:', { profilesData, profilesError });

      if (profilesError) {
        console.error('Error loading profiles:', profilesError);
        toast({
          title: "Erreur",
          description: "Impossible de charger les profils utilisateurs",
          variant: "destructive",
        });
        setUsers([]);
        return;
      }
      
      if (!profilesData || profilesData.length === 0) {
        console.log('No profiles found');
        setUsers([]);
        return;
      }

      console.log('Profiles loaded:', profilesData.length);
      const userIds = profilesData.map(u => u.id);
      
      // Charger les rôles et abonnements en parallèle
      const [rolesResult, subscriptionsResult] = await Promise.all([
        supabase.from('user_roles').select('user_id, role').in('user_id', userIds),
        supabase.from('subscribers').select('user_id, subscribed, subscription_tier').in('user_id', userIds)
      ]);

      const rolesData = rolesResult.data || [];
      const subscriptionsData = subscriptionsResult.data || [];

      console.log('Roles data:', rolesData);
      console.log('Subscriptions data:', subscriptionsData);

      const formattedUsers: AdminUser[] = profilesData.map(userProfile => {
        const userRole = rolesData.find(r => r.user_id === userProfile.id);
        const userSub = subscriptionsData.find(s => s.user_id === userProfile.id);
        
        return {
          id: userProfile.id,
          full_name: userProfile.full_name || 'Utilisateur',
          username: userProfile.username || 'utilisateur',
          created_at: userProfile.created_at,
          posts_count: userProfile.posts_count || 0,
          followers_count: userProfile.followers_count || 0,
          role: userRole?.role || 'user',
          subscribed: userSub?.subscribed || false,
          subscription_tier: userSub?.subscription_tier || 'free'
        };
      });

      console.log('Formatted users:', formattedUsers);
      setUsers(formattedUsers);
    } catch (error) {
      console.error('Error loading users:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les utilisateurs",
        variant: "destructive",
      });
      setUsers([]);
    } finally {
      setUsersLoading(false);
    }
  };

  const loadPublications = async () => {
    try {
      console.log('Loading publications...');
      const { data, error } = await supabase
        .from('publications')
        .select(`
          id,
          title,
          content_type,
          created_at,
          is_public,
          likes_count,
          views_count,
          comments_count,
          user_id
        `)
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) {
        console.error('Error loading publications:', error);
        return;
      }

      const userIds = data?.map(p => p.user_id) || [];
      const { data: profilesData } = await supabase
        .from('profiles')
        .select('id, full_name, username')
        .in('id', userIds);

      const formattedPubs = data?.map(pub => ({
        ...pub,
        profiles: profilesData?.find(p => p.id === pub.user_id)
      })) || [];

      console.log('Publications loaded:', formattedPubs.length);
      setPublications(formattedPubs);
    } catch (error) {
      console.error('Error loading publications:', error);
    }
  };

  const loadReports = async () => {
    try {
      console.log('Loading reports...');
      const { data, error } = await supabase
        .from('reports')
        .select(`
          id,
          report_type,
          status,
          description,
          created_at,
          reporter_id,
          reported_content_id,
          reported_content_type,
          reported_user_id,
          moderator_notes
        `)
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) {
        console.error('Error loading reports:', error);
        return;
      }

      const reporterIds = data?.map(r => r.reporter_id).filter(Boolean) || [];
      const { data: profilesData } = await supabase
        .from('profiles')
        .select('id, full_name, username')
        .in('id', reporterIds);

      const formattedReports = data?.map(report => ({
        ...report,
        profiles: profilesData?.find(p => p.id === report.reporter_id)
      })) || [];

      console.log('Reports loaded:', formattedReports.length);
      setReports(formattedReports);
    } catch (error) {
      console.error('Error loading reports:', error);
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

    try {
      console.log(`Admin action: ${action} on user ${userId} by ${user.id}`);
      
      if (action === 'promote') {
        const { error } = await supabase
          .from('user_roles')
          .upsert({
            user_id: userId,
            role: 'moderator',
            assigned_by: user.id
          });

        if (error) throw error;
        
        toast({
          title: "Utilisateur promu",
          description: "L'utilisateur a été promu modérateur",
        });
      } else if (action === 'demote') {
        const { error } = await supabase
          .from('user_roles')
          .delete()
          .eq('user_id', userId);

        if (error) throw error;
        
        toast({
          title: "Utilisateur rétrogradé",
          description: "L'utilisateur a été rétrogradé",
        });
      } else if (action === 'warn') {
        const { error } = await supabase
          .from('moderation_actions')
          .insert({
            moderator_id: user.id,
            target_user_id: userId,
            action_type: 'warning',
            reason: `Avertissement donné par l'administrateur`,
            expires_at: null
          });

        if (error) throw error;

        toast({
          title: "Avertissement envoyé",
          description: "L'utilisateur a été averti",
        });
      }

      // Recharger les utilisateurs après l'action
      await loadUsers();
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
      console.log(`Deleting publication ${publicationId}`);
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
        <div className="flex flex-wrap gap-1 bg-gray-100 p-1 rounded-lg mb-6 overflow-x-auto">
          {[
            { id: 'overview', label: 'Vue d\'ensemble', icon: TrendingUp },
            { id: 'users', label: `Utilisateurs${users.length > 0 ? ` (${users.length})` : ''}`, icon: Users },
            { id: 'publications', label: 'Publications', icon: FileText },
            { id: 'create-publication', label: 'Créer Publication', icon: Plus },
            { id: 'subscriptions', label: 'Abonnements', icon: CreditCard },
            { id: 'reports', label: 'Signalements', icon: AlertTriangle },
            { id: 'settings', label: 'Paramètres', icon: Settings }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-3 py-2 rounded-md font-medium transition-colors whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <tab.icon className="h-4 w-4" />
              <span className="text-sm">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Content based on active tab */}
        {activeTab === 'overview' && <AdminStats stats={stats} />}
        
        {activeTab === 'users' && (
          <UsersManagement 
            users={users} 
            onUserAction={handleUserAction} 
            onRefresh={loadUsers}
            loading={usersLoading}
          />
        )}
        
        {activeTab === 'publications' && (
          <PublicationsManagement 
            publications={publications} 
            onDeletePublication={handleDeletePublication} 
            onRefresh={loadPublications}
          />
        )}
        
        {activeTab === 'create-publication' && (
          <AdminPublicationCreator />
        )}
        
        {activeTab === 'subscriptions' && (
          <SubscriptionsManagement />
        )}
        
        {activeTab === 'reports' && (
          <ReportsManagement 
            reports={reports} 
            onRefresh={loadReports}
          />
        )}
        
        {activeTab === 'settings' && (
          <SystemSettings 
            onRefresh={loadDashboardData}
          />
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
