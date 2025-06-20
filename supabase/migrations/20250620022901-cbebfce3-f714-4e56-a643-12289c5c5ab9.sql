
-- Ajouter une colonne pour le statut en ligne dans la table profiles
ALTER TABLE public.profiles 
ADD COLUMN is_online BOOLEAN DEFAULT false,
ADD COLUMN last_seen TIMESTAMP WITH TIME ZONE DEFAULT now();

-- Créer une fonction pour mettre à jour automatiquement last_seen
CREATE OR REPLACE FUNCTION update_user_last_seen()
RETURNS TRIGGER AS $$
BEGIN
  NEW.last_seen = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Créer un trigger pour mettre à jour last_seen quand is_online change
CREATE TRIGGER trigger_update_last_seen
  BEFORE UPDATE OF is_online ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_user_last_seen();

-- Activer les mises à jour en temps réel pour la table profiles
ALTER TABLE public.profiles REPLICA IDENTITY FULL;
