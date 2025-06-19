
import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from "@/hooks/use-toast";
import { Navigate } from 'react-router-dom';

interface AdminRouteProps {
  children: React.ReactNode;
}

const AdminRoute: React.FC<AdminRouteProps> = ({ children }) => {
  const { user, loading: authLoading } = useAuth();
  const { toast } = useToast();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAdminAccess();
  }, [user]);

  const checkAdminAccess = async () => {
    if (authLoading) {
      return;
    }

    if (!user) {
      setIsAdmin(false);
      setLoading(false);
      return;
    }

    try {
      console.log('Checking admin access for user:', user.id);
      
      // D'abord vérifier s'il existe déjà des admins
      const { data: existingAdmins, error: checkError } = await supabase
        .from('user_roles')
        .select('id')
        .eq('role', 'admin')
        .limit(1);

      console.log('Existing admins check:', { existingAdmins, checkError });

      // Si aucun admin n'existe, créer un admin pour cet utilisateur
      if (!checkError && (!existingAdmins || existingAdmins.length === 0)) {
        console.log('No admin exists, creating admin role for current user');
        const { error: createError } = await supabase
          .from('user_roles')
          .insert({
            user_id: user.id,
            role: 'admin',
            assigned_by: user.id
          });

        if (createError) {
          console.error('Error creating admin role:', createError);
        } else {
          console.log('Admin role created successfully');
          setIsAdmin(true);
          toast({
            title: "Accès accordé",
            description: "Vous êtes maintenant administrateur",
          });
          setLoading(false);
          return;
        }
      }

      // Vérifier si l'utilisateur a le rôle admin
      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id)
        .eq('role', 'admin')
        .maybeSingle();

      console.log('Admin check result:', { data, error });

      if (error) {
        console.error('Error checking admin access:', error);
        setIsAdmin(false);
        toast({
          title: "Erreur",
          description: "Erreur lors de la vérification des droits d'accès",
          variant: "destructive",
        });
      } else if (data) {
        console.log('User is admin');
        setIsAdmin(true);
      } else {
        console.log('User is not admin');
        setIsAdmin(false);
        toast({
          title: "Accès refusé",
          description: "Vous n'avez pas les droits d'administrateur",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Exception while checking admin access:', error);
      setIsAdmin(false);
      toast({
        title: "Erreur",
        description: "Erreur lors de la vérification des droits d'accès",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Show loading spinner while checking auth or admin status
  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Vérification des droits d'accès...</p>
        </div>
      </div>
    );
  }

  // Redirect to home if not authenticated
  if (!user) {
    return <Navigate to="/" replace />;
  }

  // Show access denied if not admin
  if (isAdmin === false) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto">
          <div className="bg-red-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Accès Refusé</h2>
          <p className="text-gray-600 mb-4">
            Vous n'avez pas les droits d'administrateur nécessaires pour accéder à cette page.
          </p>
          <button
            onClick={() => window.history.back()}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            Retour
          </button>
        </div>
      </div>
    );
  }

  // Render admin content if user is admin
  return <>{children}</>;
};

export default AdminRoute;
