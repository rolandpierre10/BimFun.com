
import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useSubscription } from '@/hooks/useSubscription';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  userRole: string | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState<string | null>(null);
  const { createCheckout } = useSubscription();

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('Initial session:', session?.user?.email);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event, session?.user?.email);
      
      if (event === 'SIGNED_OUT') {
        console.log('User signed out - clearing state');
        setUser(null);
        setUserRole(null);
      } else {
        setUser(session?.user ?? null);
      }
      
      setLoading(false);
      
      // Si l'utilisateur vient de se connecter et qu'il n'a pas d'abonnement, proposer l'abonnement
      if (event === 'SIGNED_IN' && session?.user) {
        // Petite attente pour s'assurer que l'état est bien mis à jour
        setTimeout(() => {
          // Ici on pourrait vérifier si l'utilisateur a déjà un abonnement
          // et ne proposer l'abonnement que s'il n'en a pas
        }, 1000);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // Fetch user role when user changes
  useEffect(() => {
    if (user) {
      const fetchUserRole = async () => {
        try {
          const { data, error } = await supabase
            .from('user_roles')
            .select('role')
            .eq('user_id', user.id)
            .single();

          if (data && !error) {
            setUserRole(data.role || 'user');
          } else {
            setUserRole('user');
          }
        } catch (error) {
          console.error('Error fetching user role:', error);
          setUserRole('user');
        }
      };

      fetchUserRole();
    } else {
      setUserRole(null);
    }
  }, [user]);

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
  };

  const signUp = async (email: string, password: string) => {
    const { error } = await supabase.auth.signUp({ 
      email, 
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/`,
        data: {
          app_name: 'BimFun'
        }
      }
    });
    if (error) throw error;
  };

  const signOut = async () => {
    console.log('Starting signOut process');
    
    try {
      // Clear local state immediately
      setUser(null);
      setUserRole(null);
      
      // Then sign out from Supabase
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Supabase signOut error:', error);
        throw error;
      }
      
      console.log('SignOut successful');
    } catch (error) {
      console.error('SignOut error:', error);
      throw error;
    }
  };

  const logout = signOut; // Alias for signOut

  const value = {
    user,
    loading,
    userRole,
    signIn,
    signUp,
    signOut,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
