
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { supabase } from '@/integrations/supabase/client';
import { Eye, Trash2, Flag, Search, Filter, Calendar, Heart, MessageCircle } from 'lucide-react';
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
  const [selectedPublication, setSelectedPublication] = useState<Publication | null>(null);

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
      toast({
        title: "Publication supprimée",
        description: "La publication a été supprimée avec succès",
      });
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
    <div className="space-y-6 p-4 max-w-full overflow-hidden">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
          <div className="relative flex-1 min-w-0">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Rechercher une publication..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-full"
            />
          </div>
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Filtrer par type..." />
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
        </div>
        <Button onClick={onRefresh} variant="outline" className="w-full sm:w-auto">
          <Filter className="h-4 w-4 mr-2" />
          Actualiser
        </Button>
      </div>

      <Card className="w-full">
        <CardHeader>
          <CardTitle>Gestion des Publications</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <ScrollArea className="w-full">
            <div className="overflow-x-auto">
              <Table className="min-w-full">
                <TableHeader>
                  <TableRow>
                    <TableHead className="min-w-[200px]">Titre</TableHead>
                    <TableHead className="min-w-[150px] hidden sm:table-cell">Auteur</TableHead>
                    <TableHead className="min-w-[80px]">Type</TableHead>
                    <TableHead className="min-w-[80px] hidden md:table-cell">Statut</TableHead>
                    <TableHead className="min-w-[120px] hidden lg:table-cell">Engagement</TableHead>
                    <TableHead className="min-w-[100px] hidden xl:table-cell">Date</TableHead>
                    <TableHead className="min-w-[120px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPublications.map((pub) => (
                    <TableRow key={pub.id}>
                      <TableCell className="font-medium">
                        <div className="max-w-[200px] truncate pr-2">{pub.title}</div>
                      </TableCell>
                      <TableCell className="hidden sm:table-cell">
                        <div className="max-w-[150px]">
                          <div className="font-medium truncate">{pub.profiles?.full_name || 'Utilisateur supprimé'}</div>
                          <div className="text-sm text-gray-500 truncate">@{pub.profiles?.username}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800 whitespace-nowrap">
                          {pub.content_type}
                        </span>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        <Button
                          size="sm"
                          variant={pub.is_public ? "default" : "secondary"}
                          onClick={() => handleToggleVisibility(pub.id, pub.is_public)}
                          className="text-xs px-2 py-1"
                        >
                          {pub.is_public ? 'Public' : 'Privé'}
                        </Button>
                      </TableCell>
                      <TableCell className="hidden lg:table-cell">
                        <div className="flex items-center space-x-2 text-sm">
                          <span className="flex items-center whitespace-nowrap">
                            <Heart className="h-3 w-3 mr-1 text-red-500" />
                            {pub.likes_count}
                          </span>
                          <span className="flex items-center whitespace-nowrap">
                            <MessageCircle className="h-3 w-3 mr-1 text-blue-500" />
                            {pub.comments_count}
                          </span>
                          <span className="flex items-center whitespace-nowrap">
                            <Eye className="h-3 w-3 mr-1 text-gray-500" />
                            {pub.views_count}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="hidden xl:table-cell">
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-3 w-3 text-gray-400" />
                          <span className="text-sm whitespace-nowrap">{new Date(pub.created_at).toLocaleDateString('fr-FR')}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button size="sm" variant="outline" className="p-2">
                                <Eye className="h-3 w-3" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                              <DialogHeader>
                                <DialogTitle className="text-left">{pub.title}</DialogTitle>
                                <DialogDescription className="text-left">
                                  Publié par {pub.profiles?.full_name} le {new Date(pub.created_at).toLocaleDateString('fr-FR')}
                                </DialogDescription>
                              </DialogHeader>
                              <div className="space-y-4 text-left">
                                <div>
                                  <strong>Type:</strong> {pub.content_type}
                                </div>
                                <div>
                                  <strong>Status:</strong> {pub.is_public ? 'Public' : 'Privé'}
                                </div>
                                <div>
                                  <strong>Engagement:</strong> {pub.likes_count} likes, {pub.comments_count} commentaires, {pub.views_count} vues
                                </div>
                                <div className="block md:hidden">
                                  <strong>Auteur:</strong> {pub.profiles?.full_name || 'Utilisateur supprimé'} (@{pub.profiles?.username})
                                </div>
                              </div>
                            </DialogContent>
                          </Dialog>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleReportPublication(pub.id, 'Signalé par l\'administrateur')}
                            className="p-2"
                          >
                            <Flag className="h-3 w-3" />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                size="sm"
                                variant="destructive"
                                className="p-2"
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent className="max-w-md mx-4">
                              <AlertDialogHeader>
                                <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Êtes-vous sûr de vouloir supprimer cette publication ? Cette action est irréversible.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter className="flex-col sm:flex-row gap-2">
                                <AlertDialogCancel className="w-full sm:w-auto">Annuler</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDeletePublication(pub.id)}
                                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90 w-full sm:w-auto"
                                >
                                  Supprimer
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
};

export default PublicationsManagement;
