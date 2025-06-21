
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { supabase } from '@/integrations/supabase/client';
import { Eye, Trash2, Flag, Search, Filter, Calendar, Heart, MessageCircle, RefreshCw } from 'lucide-react';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Publication {
  id: string;
  title: string;
  content_type: string;
  created_at: string;
  is_public: boolean;
  likes_count: number;
  views_count: number;
  comments_count: number;
  user_id: string;
  profiles?: {
    full_name: string;
    username: string;
  };
}

interface PublicationsManagementProps {
  publications: Publication[];
  onDeletePublication: (publicationId: string) => Promise<void>;
  onRefresh: () => void;
}

const PublicationsManagement: React.FC<PublicationsManagementProps> = ({ 
  publications, 
  onDeletePublication, 
  onRefresh 
}) => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');

  const filteredPublications = publications.filter(pub => {
    const matchesSearch = pub.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         pub.profiles?.full_name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'all' || 
                         (filterType === 'public' && pub.is_public) ||
                         (filterType === 'private' && !pub.is_public) ||
                         pub.content_type === filterType;
    return matchesSearch && matchesFilter;
  });

  const handleToggleVisibility = async (publicationId: string, currentVisibility: boolean) => {
    try {
      const { error } = await supabase
        .from('publications')
        .update({ is_public: !currentVisibility })
        .eq('id', publicationId);

      if (error) throw error;

      toast({
        title: "Visibilité modifiée",
        description: `La publication est maintenant ${!currentVisibility ? 'publique' : 'privée'}`,
      });

      onRefresh();
    } catch (error) {
      console.error('Error toggling visibility:', error);
      toast({
        title: "Erreur",
        description: "Impossible de modifier la visibilité",
        variant: "destructive",
      });
    }
  };

  const handleReportPublication = async (publicationId: string, reason: string) => {
    try {
      const { error } = await supabase
        .from('reports')
        .insert({
          reported_content_id: publicationId,
          reported_content_type: 'publication',
          report_type: 'inappropriate_content',
          description: reason
        });

      if (error) throw error;

      toast({
        title: "Signalement créé",
        description: "La publication a été signalée pour modération",
      });
    } catch (error) {
      console.error('Error reporting publication:', error);
      toast({
        title: "Erreur",
        description: "Impossible de signaler la publication",
        variant: "destructive",
      });
    }
  };

  const handleDeletePublication = async (publicationId: string) => {
    try {
      await onDeletePublication(publicationId);
    } catch (error) {
      console.error('Error deleting publication:', error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer la publication",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="w-full">
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-xl">Gestion des Publications</CardTitle>
          <div className="text-sm text-gray-600">
            {filteredPublications.length} publication(s) trouvée(s)
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Filters - Mobile Optimized */}
          <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Rechercher par titre ou auteur..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-32 sm:w-40">
                  <SelectValue placeholder="Filtrer..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes</SelectItem>
                  <SelectItem value="public">Publiques</SelectItem>
                  <SelectItem value="private">Privées</SelectItem>
                  <SelectItem value="text">Texte</SelectItem>
                  <SelectItem value="image">Images</SelectItem>
                  <SelectItem value="video">Vidéos</SelectItem>
                </SelectContent>
              </Select>
              <Button onClick={onRefresh} variant="outline" size="sm" className="shrink-0">
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Publications List - Always showing cards for better mobile experience */}
          <div className="space-y-4">
            {filteredPublications.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                Aucune publication trouvée
              </div>
            ) : (
              filteredPublications.map((pub) => (
                <Card key={pub.id} className="w-full">
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      {/* Header */}
                      <div className="flex justify-between items-start gap-3">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-sm sm:text-base truncate">
                            {pub.title}
                          </h3>
                          <div className="text-xs text-gray-500 mt-1">
                            <div>Par: {pub.profiles?.full_name || 'Utilisateur supprimé'}</div>
                            <div>@{pub.profiles?.username || 'N/A'}</div>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-2 shrink-0">
                          <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                            {pub.content_type}
                          </span>
                          <Button
                            size="sm"
                            variant={pub.is_public ? "default" : "secondary"}
                            onClick={() => handleToggleVisibility(pub.id, pub.is_public)}
                            className="text-xs px-3 py-1 h-7"
                          >
                            {pub.is_public ? 'Public' : 'Privé'}
                          </Button>
                        </div>
                      </div>

                      {/* Stats */}
                      <div className="flex items-center gap-4 text-sm">
                        <span className="flex items-center gap-1">
                          <Heart className="h-4 w-4 text-red-500" />
                          <span>{pub.likes_count}</span>
                        </span>
                        <span className="flex items-center gap-1">
                          <MessageCircle className="h-4 w-4 text-blue-500" />
                          <span>{pub.comments_count}</span>
                        </span>
                        <span className="flex items-center gap-1">
                          <Eye className="h-4 w-4 text-gray-500" />
                          <span>{pub.views_count}</span>
                        </span>
                        <span className="flex items-center gap-1 ml-auto">
                          <Calendar className="h-4 w-4 text-gray-400" />
                          <span className="text-xs">
                            {new Date(pub.created_at).toLocaleDateString('fr-FR')}
                          </span>
                        </span>
                      </div>

                      {/* Actions */}
                      <div className="flex justify-end gap-2 pt-2 border-t">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button size="sm" variant="outline" className="h-8 px-3">
                              <Eye className="h-4 w-4 mr-1" />
                              Voir
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="w-[95vw] max-w-lg mx-auto max-h-[80vh] overflow-y-auto">
                            <DialogHeader>
                              <DialogTitle className="text-left pr-8">{pub.title}</DialogTitle>
                              <DialogDescription className="text-left">
                                Publié par {pub.profiles?.full_name || 'Utilisateur supprimé'} le {new Date(pub.created_at).toLocaleDateString('fr-FR')}
                              </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-3 text-left">
                              <div><strong>Type:</strong> {pub.content_type}</div>
                              <div><strong>Status:</strong> {pub.is_public ? 'Public' : 'Privé'}</div>
                              <div>
                                <strong>Engagement:</strong> {pub.likes_count} likes, {pub.comments_count} commentaires, {pub.views_count} vues
                              </div>
                              <div><strong>Auteur:</strong> {pub.profiles?.full_name || 'Utilisateur supprimé'} (@{pub.profiles?.username || 'N/A'})</div>
                              <div><strong>Date de création:</strong> {new Date(pub.created_at).toLocaleString('fr-FR')}</div>
                            </div>
                          </DialogContent>
                        </Dialog>
                        
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleReportPublication(pub.id, 'Signalé par l\'administrateur')}
                          className="h-8 px-3"
                        >
                          <Flag className="h-4 w-4 mr-1" />
                          Signaler
                        </Button>
                        
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button size="sm" variant="destructive" className="h-8 px-3">
                              <Trash2 className="h-4 w-4 mr-1" />
                              Supprimer
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent className="w-[95vw] max-w-md mx-auto">
                            <AlertDialogHeader>
                              <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
                              <AlertDialogDescription>
                                Êtes-vous sûr de vouloir supprimer cette publication "{pub.title}" ? Cette action est irréversible.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter className="flex-col gap-2 sm:flex-row">
                              <AlertDialogCancel className="w-full sm:w-auto">Annuler</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDeletePublication(pub.id)}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90 w-full sm:w-auto"
                              >
                                Supprimer définitivement
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PublicationsManagement;
