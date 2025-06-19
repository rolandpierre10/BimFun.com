
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { CheckCircle, X, Eye, AlertTriangle, Calendar, User } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

interface Report {
  id: string;
  report_type: string;
  status: string;
  description: string;
  created_at: string;
  reporter_id: string;
  reported_content_id: string;
  reported_content_type: string;
  reported_user_id?: string;
  moderator_notes?: string;
  profiles?: {
    full_name: string;
    username: string;
  };
}

interface ReportsManagementProps {
  reports: Report[];
  onRefresh: () => void;
}

const ReportsManagement: React.FC<ReportsManagementProps> = ({ reports, onRefresh }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [moderatorNotes, setModeratorNotes] = useState('');

  const handleResolveReport = async (reportId: string, action: 'resolved' | 'rejected', notes: string) => {
    try {
      const { error } = await supabase
        .from('reports')
        .update({
          status: action,
          moderator_id: user?.id,
          moderator_notes: notes,
          updated_at: new Date().toISOString()
        })
        .eq('id', reportId);

      if (error) throw error;

      toast({
        title: action === 'resolved' ? "Signalement résolu" : "Signalement rejeté",
        description: `Le signalement a été ${action === 'resolved' ? 'résolu' : 'rejeté'} avec succès`,
      });

      onRefresh();
    } catch (error) {
      console.error('Error resolving report:', error);
      toast({
        title: "Erreur",
        description: "Impossible de traiter le signalement",
        variant: "destructive",
      });
    }
  };

  const handleTakeAction = async (report: Report) => {
    try {
      // Créer une action de modération basée sur le signalement
      let actionType = 'warning';
      if (report.report_type === 'harassment' || report.report_type === 'hate_speech') {
        actionType = 'account_ban';
      }

      const { error } = await supabase
        .from('moderation_actions')
        .insert({
          moderator_id: user?.id,
          target_user_id: report.reported_user_id,
          action_type: actionType,
          reason: `Action suite au signalement: ${report.description}`,
          report_id: report.id
        });

      if (error) throw error;

      // Marquer le signalement comme résolu
      await handleResolveReport(report.id, 'resolved', `Action ${actionType} appliquée`);

      toast({
        title: "Action appliquée",
        description: `Une ${actionType === 'account_ban' ? 'sanction' : 'action'} a été appliquée`,
      });
    } catch (error) {
      console.error('Error taking action:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'appliquer l'action",
        variant: "destructive",
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'resolved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getReportTypeColor = (type: string) => {
    switch (type) {
      case 'harassment': return 'bg-red-100 text-red-800';
      case 'hate_speech': return 'bg-red-100 text-red-800';
      case 'spam': return 'bg-orange-100 text-orange-800';
      case 'inappropriate_content': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <AlertTriangle className="h-5 w-5" />
            <span>Signalements en Attente</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Type</TableHead>
                <TableHead>Signaleur</TableHead>
                <TableHead>Contenu</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reports.map((report) => (
                <TableRow key={report.id}>
                  <TableCell>
                    <span className={`px-2 py-1 text-xs rounded-full ${getReportTypeColor(report.report_type)}`}>
                      {report.report_type}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <User className="h-3 w-3 text-gray-400" />
                      <div>
                        <div className="font-medium">{report.profiles?.full_name || 'Utilisateur anonyme'}</div>
                        <div className="text-sm text-gray-500">@{report.profiles?.username}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div className="font-medium">{report.reported_content_type}</div>
                      <div className="text-gray-500 truncate max-w-32">
                        ID: {report.reported_content_id}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="max-w-xs">
                    <div className="truncate" title={report.description}>
                      {report.description}
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(report.status)}`}>
                      {report.status}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-3 w-3 text-gray-400" />
                      <span className="text-sm">{new Date(report.created_at).toLocaleDateString('fr-FR')}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => {
                              setSelectedReport(report);
                              setModeratorNotes('');
                            }}
                          >
                            <Eye className="h-3 w-3" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>Détails du Signalement</DialogTitle>
                            <DialogDescription>
                              Signalement #{report.id.slice(0, 8)}...
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <strong>Type:</strong> {report.report_type}
                              </div>
                              <div>
                                <strong>Statut:</strong> {report.status}
                              </div>
                              <div>
                                <strong>Signaleur:</strong> {report.profiles?.full_name || 'Anonyme'}
                              </div>
                              <div>
                                <strong>Date:</strong> {new Date(report.created_at).toLocaleDateString('fr-FR')}
                              </div>
                            </div>
                            <div>
                              <strong>Description:</strong>
                              <p className="mt-1 p-2 bg-gray-50 rounded">{report.description}</p>
                            </div>
                            <div>
                              <strong>Contenu signalé:</strong>
                              <p className="mt-1 text-sm text-gray-600">
                                Type: {report.reported_content_type}, ID: {report.reported_content_id}
                              </p>
                            </div>
                            {report.moderator_notes && (
                              <div>
                                <strong>Notes du modérateur:</strong>
                                <p className="mt-1 p-2 bg-blue-50 rounded">{report.moderator_notes}</p>
                              </div>
                            )}
                            {report.status === 'pending' && (
                              <div>
                                <label className="block text-sm font-medium mb-2">Notes du modérateur</label>
                                <Textarea
                                  value={moderatorNotes}
                                  onChange={(e) => setModeratorNotes(e.target.value)}
                                  placeholder="Ajoutez vos notes sur ce signalement..."
                                />
                              </div>
                            )}
                          </div>
                          {report.status === 'pending' && (
                            <div className="flex justify-end space-x-2 pt-4">
                              <Button
                                variant="outline"
                                onClick={() => handleResolveReport(report.id, 'rejected', moderatorNotes)}
                              >
                                <X className="h-3 w-3 mr-1" />
                                Rejeter
                              </Button>
                              <Button
                                variant="default"
                                onClick={() => handleTakeAction(report)}
                              >
                                Appliquer Action
                              </Button>
                              <Button
                                variant="default"
                                onClick={() => handleResolveReport(report.id, 'resolved', moderatorNotes)}
                              >
                                <CheckCircle className="h-3 w-3 mr-1" />
                                Résoudre
                              </Button>
                            </div>
                          )}
                        </DialogContent>
                      </Dialog>
                      {report.status === 'pending' && (
                        <>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleResolveReport(report.id, 'rejected', 'Signalement rejeté')}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="default"
                            onClick={() => handleResolveReport(report.id, 'resolved', 'Signalement traité')}
                          >
                            <CheckCircle className="h-3 w-3" />
                          </Button>
                        </>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReportsManagement;
