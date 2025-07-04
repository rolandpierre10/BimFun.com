


-- Supprimer les politiques RLS existantes sur user_roles si elles existent
DROP POLICY IF EXISTS "Users can view their own roles" ON public.user_roles;
DROP POLICY IF EXISTS "Admins can manage all roles" ON public.user_roles;
DROP POLICY IF EXISTS "Allow self admin assignment" ON public.user_roles;

-- Désactiver temporairement RLS pour permettre la création du premier admin
ALTER TABLE public.user_roles DISABLE ROW LEVEL SECURITY;

-- Insérer le premier admin si aucun n'existe
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM public.user_roles WHERE role = 'admin') THEN
    INSERT INTO public.user_roles (user_id, role, assigned_by)
    SELECT id, 'admin', id 
    FROM auth.users 
    ORDER BY created_at ASC 
    LIMIT 1;
  END IF;
END $$;

-- Réactiver RLS
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Créer une fonction de sécurité pour éviter la récursion
CREATE OR REPLACE FUNCTION public.get_user_role_direct(user_uuid uuid)
RETURNS text
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT role FROM public.user_roles WHERE user_id = user_uuid AND role = 'admin' LIMIT 1;
$$;

-- Créer une politique pour permettre aux utilisateurs de voir leurs propres rôles
CREATE POLICY "Users can view their own roles" ON public.user_roles
FOR SELECT 
TO authenticated
USING (user_id = auth.uid());

-- Créer une politique pour permettre aux admins de gérer tous les rôles
CREATE POLICY "Admins can manage all roles" ON public.user_roles
FOR ALL 
TO authenticated
USING (public.get_user_role_direct(auth.uid()) = 'admin');

-- Créer une politique spéciale pour permettre l'auto-attribution du premier rôle admin
CREATE POLICY "Allow self admin assignment" ON public.user_roles
FOR INSERT 
TO authenticated
WITH CHECK (
  user_id = auth.uid() 
  AND role = 'admin'
  AND NOT EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE role = 'admin'
  )
);


