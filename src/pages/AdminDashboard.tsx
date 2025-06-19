import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from "@/hooks/use-toast";
import { TrendingUp, Users, FileText, AlertTriangle, Settings } from 'lucide-react';

// Import des nouveaux composants
import AdminStats from '@/components/admin/AdminStats';
import UsersManagement from '@/components/admin/UsersManagement';
import PublicationsManagement from '@/components/admin/PublicationsManagement';
import ReportsManagement from '@/components/admin/ReportsManagement';
import SystemSettings from '@/components/admin/SystemSettings';

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

  useEffect(() => {
    if (user) {
      loadDashboardData();
    }
  }, [user]);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      console.log('Loading admin dashboard data...');
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
      console.log('Attempting to load stats...');
      
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
    try {
      console.log('Loading users...');
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

      if (error) {
        console.error('Error loading users:', error);
        return;
      }
      
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

      console.log('Users loaded:', formattedUsers.length);
      setUsers(formattedUsers);
    } catch (error) {
      console.error('Error loading users:', error);
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
    try {
      console.log(`Performing action ${action} on user ${userId}`);
      
      let dbAction: 'account_ban' | 'warning' | 'no_action' = 'no_action';
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

      if (error) {
        console.error('Error performing user action:', error);
        throw error;
      }

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
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg mb-6">
          {[
            { id: 'overview', label: 'Vue d\'ensemble', icon: TrendingUp },
            { id: 'users', label: 'Utilisateurs', icon: Users },
            { id: 'publications', label: 'Publications', icon: FileText },
            { id: 'reports', label: 'Signalements', icon: AlertTriangle },
            { id: 'settings', label: 'Paramètres', icon: Settings }
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

        {/* Content based on active tab */}
        {activeTab === 'overview' && <AdminStats stats={stats} />}
        
        {activeTab === 'users' && (
          <UsersManagement 
            users={users} 
            onUserAction={handleUserAction} 
            onRefresh={loadUsers}
          />
        )}
        
        {activeTab === 'publications' && (
          <PublicationsManagement 
            publications={publications} 
            onDeletePublication={handleDeletePublication} 
            onRefresh={loadPublications}
          />
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
