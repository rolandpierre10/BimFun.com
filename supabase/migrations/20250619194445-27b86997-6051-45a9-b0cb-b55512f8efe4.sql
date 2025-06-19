
-- Supprimer les politiques RLS existantes sur user_roles si elles existent
DROP POLICY IF EXISTS "Users can view their own roles" ON public.user_roles;
DROP POLICY IF EXISTS "Admins can manage all roles" ON public.user_roles;
DROP POLICY IF EXISTS "Allow self admin assignment" ON public.user_roles;

-- Créer une politique pour permettre aux utilisateurs de voir leurs propres rôles
CREATE POLICY "Users can view their own roles" ON public.user_roles
FOR SELECT 
TO authenticated
USING (user_id = auth.uid());

-- Créer une politique pour permettre aux admins de gérer tous les rôles
CREATE POLICY "Admins can manage all roles" ON public.user_roles
FOR ALL 
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles ur 
    WHERE ur.user_id = auth.uid() 
    AND ur.role = 'admin'
  )
);

-- Créer une politique spéciale pour permettre l'auto-attribution du rôle admin
-- (nécessaire pour le premier admin)
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
