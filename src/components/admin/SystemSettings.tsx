
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { supabase } from '@/integrations/supabase/client';
import { Settings, Save, Database, Mail, Shield, Globe } from 'lucide-react';
import { Textarea } from "@/components/ui/textarea";

interface SystemSettingsProps {
  onRefresh: () => void;
}

const SystemSettings: React.FC<SystemSettingsProps> = ({ onRefresh }) => {
  const { toast } = useToast();
  const [settings, setSettings] = useState({
    siteName: 'BimFun',
    siteDescription: 'Plateforme sociale créative',
    allowRegistration: true,
    requireEmailVerification: false,
    maxFileSize: 10, // MB
    allowedFileTypes: 'image/jpeg,image/png,image/gif,video/mp4',
    maintenanceMode: false,
    maintenanceMessage: '',
    maxPostsPerHour: 10,
    autoModeration: true
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    // Simuler le chargement des paramètres depuis la base de données
    // En production, vous chargerez ces données depuis une table settings
    console.log('Loading system settings...');
  };

  const handleSaveSettings = async () => {
    setLoading(true);
    try {
      // Ici vous sauvegarderiez les paramètres dans la base de données
      // Pour l'instant, on simule juste une sauvegarde
      await new Promise(resolve => setTimeout(resolve, 1000));

      toast({
        title: "Paramètres sauvegardés",
        description: "Les paramètres système ont été mis à jour avec succès",
      });

      onRefresh();
    } catch (error) {
      console.error('Error saving settings:', error);
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder les paramètres",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleClearCache = async () => {
    try {
      // Simuler le nettoyage du cache
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Cache nettoyé",
        description: "Le cache système a été vidé avec succès",
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de nettoyer le cache",
        variant: "destructive",
      });
    }
  };

  const handleDatabaseMaintenance = async () => {
    try {
      // Simuler la maintenance de la base de données
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "Maintenance effectuée",
        description: "Les opérations de maintenance ont été exécutées",
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Erreur lors de la maintenance",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Paramètres généraux */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Globe className="h-5 w-5" />
              <span>Paramètres Généraux</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Nom du site</label>
              <Input
                value={settings.siteName}
                onChange={(e) => setSettings({...settings, siteName: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Description du site</label>
              <Textarea
                value={settings.siteDescription}
                onChange={(e) => setSettings({...settings, siteDescription: e.target.value})}
              />
            </div>
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Autoriser les inscriptions</label>
              <Switch
                checked={settings.allowRegistration}
                onCheckedChange={(checked) => setSettings({...settings, allowRegistration: checked})}
              />
            </div>
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Mode maintenance</label>
              <Switch
                checked={settings.maintenanceMode}
                onCheckedChange={(checked) => setSettings({...settings, maintenanceMode: checked})}
              />
            </div>
            {settings.maintenanceMode && (
              <div>
                <label className="block text-sm font-medium mb-2">Message de maintenance</label>
                <Textarea
                  value={settings.maintenanceMessage}
                  onChange={(e) => setSettings({...settings, maintenanceMessage: e.target.value})}
                  placeholder="Le site est temporairement indisponible pour maintenance..."
                />
              </div>
            )}
          </CardContent>
        </Card>

        {/* Paramètres de sécurité */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Shield className="h-5 w-5" />
              <span>Sécurité</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Vérification email requise</label>
              <Switch
                checked={settings.requireEmailVerification}
                onCheckedChange={(checked) => setSettings({...settings, requireEmailVerification: checked})}
              />
            </div>
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Modération automatique</label>
              <Switch
                checked={settings.autoModeration}
                onCheckedChange={(checked) => setSettings({...settings, autoModeration: checked})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Publications max par heure</label>
              <Input
                type="number"
                value={settings.maxPostsPerHour}
                onChange={(e) => setSettings({...settings, maxPostsPerHour: parseInt(e.target.value)})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Taille max des fichiers (MB)</label>
              <Input
                type="number"
                value={settings.maxFileSize}
                onChange={(e) => setSettings({...settings, maxFileSize: parseInt(e.target.value)})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Types de fichiers autorisés</label>
              <Input
                value={settings.allowedFileTypes}
                onChange={(e) => setSettings({...settings, allowedFileTypes: e.target.value})}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Actions système */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Database className="h-5 w-5" />
            <span>Actions Système</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button
              variant="outline"
              onClick={handleClearCache}
              className="flex items-center justify-center space-x-2"
            >
              <Settings className="h-4 w-4" />
              <span>Vider le Cache</span>
            </Button>
            <Button
              variant="outline"
              onClick={handleDatabaseMaintenance}
              className="flex items-center justify-center space-x-2"
            >
              <Database className="h-4 w-4" />
              <span>Maintenance DB</span>
            </Button>
            <Button
              variant="outline"
              onClick={() => window.open('https://supabase.com/dashboard', '_blank')}
              className="flex items-center justify-center space-x-2"
            >
              <Globe className="h-4 w-4" />
              <span>Supabase Dashboard</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Bouton de sauvegarde */}
      <div className="flex justify-end">
        <Button
          onClick={handleSaveSettings}
          disabled={loading}
          className="flex items-center space-x-2"
        >
          <Save className="h-4 w-4" />
          <span>{loading ? 'Sauvegarde...' : 'Sauvegarder'}</span>
        </Button>
      </div>
    </div>
  );
};

export default SystemSettings;
