import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { AlertTriangle, Check, X, Eye } from 'lucide-react';

interface ReportsManagementProps {
  reports: any[];
  onRefresh: () => void;
}

const ReportsManagement: React.FC<ReportsManagementProps> = ({ reports, onRefresh }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState<string | null>(null);

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'pending': return 'destructive';
      case 'reviewed': return 'secondary';
      case 'resolved': return 'default';
      case 'dismissed': return 'outline';
      default: return 'secondary';
    }
  };

  const getReportTypeBadge = (type: string) => {
    const types = {
      spam: 'Spam',
      harassment: 'Harcèlement',
      inappropriate_content: 'Contenu inapproprié',
      copyright: 'Droits d\'auteur',
      other: 'Autre'
    };
    return types[type as keyof typeof types] || type;
  };

  const handleReportAction = async (reportId: string, action: 'resolved' | 'dismissed') => {
    setLoading(reportId);
    try {
      // D'abord, obtenir les détails du rapport pour avoir le target_user_id
      const { data: reportData, error: fetchError } = await supabase
        .from('reports')
        .select('reported_user_id')
        .eq('id', reportId)
        .single();

      if (fetchError) throw fetchError;

      const { error } = await supabase
        .from('reports')
        .update({ 
          status: action,
          moderator_notes: `Rapport ${action === 'resolved' ? 'résolu' : 'rejeté'} par l'administrateur`
        })
        .eq('id', reportId);

      if (error) throw error;

      // Créer une action de modération avec le target_user_id
      if (reportData?.reported_user_id) {
        await supabase
          .from('moderation_actions')
          .insert({
            moderator_id: user?.id,
            target_user_id: reportData.reported_user_id,
            report_id: reportId,
            action_type: action === 'resolved' ? 'content_removal' : 'no_action',
            reason: `Rapport ${action === 'resolved' ? 'résolu' : 'rejeté'}`,
          });
      }

      toast({
        title: "Action effectuée",
        description: `Le rapport a été ${action === 'resolved' ? 'résolu' : 'rejeté'}`,
      });

      onRefresh();
    } catch (error) {
      console.error('Error handling report:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'effectuer cette action",
        variant: "destructive",
      });
    } finally {
      setLoading(null);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <AlertTriangle className="h-5 w-5" />
          <span>Gestion des Signalements</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {reports.length === 0 ? (
            <p className="text-center text-gray-500 py-8">Aucun signalement à traiter</p>
          ) : (
            reports.map((report) => (
              <div key={report.id} className="border rounded-lg p-4 space-y-3">
                <div className="flex justify-between items-start">
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Badge variant={getStatusBadgeVariant(report.status)}>
                        {report.status}
                      </Badge>
                      <Badge variant="outline">
                        {getReportTypeBadge(report.report_type)}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600">
                      Signalé par: {report.profiles?.full_name || 'Utilisateur supprimé'}
                    </p>
                    <p className="text-sm">
                      <strong>Description:</strong> {report.description || 'Aucune description'}
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(report.created_at).toLocaleDateString('fr-FR')}
                    </p>
                  </div>
                  
                  {report.status === 'pending' && (
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleReportAction(report.id, 'resolved')}
                        disabled={loading === report.id}
                        className="flex items-center space-x-1"
                      >
                        <Check className="h-4 w-4" />
                        <span>Résoudre</span>
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleReportAction(report.id, 'dismissed')}
                        disabled={loading === report.id}
                        className="flex items-center space-x-1"
                      >
                        <X className="h-4 w-4" />
                        <span>Rejeter</span>
                      </Button>
                    </div>
                  )}
                </div>

                {report.moderator_notes && (
                  <div className="bg-gray-50 p-3 rounded">
                    <p className="text-sm">
                      <strong>Notes du modérateur:</strong> {report.moderator_notes}
                    </p>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ReportsManagement;
