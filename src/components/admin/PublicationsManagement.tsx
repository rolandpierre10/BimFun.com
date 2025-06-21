
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
    <div className="w-full max-w-full overflow-hidden">
      <div className="p-3 md:p-6 space-y-4">
        {/* Filters */}
        <div className="flex flex-col gap-3 md:flex-row md:gap-4">
          <div className="relative flex-1 min-w-0">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Rechercher..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2">
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-32 md:w-40">
                <SelectValue placeholder="Type..." />
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
              <Filter className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Mobile Layout */}
        <div className="md:hidden space-y-3">
          {filteredPublications.map((pub) => (
            <Card key={pub.id} className="w-full">
              <div className="p-3 space-y-3">
                <div className="flex justify-between items-start gap-2">
                  <h3 className="font-medium text-sm truncate flex-1 min-w-0">{pub.title}</h3>
                  <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800 whitespace-nowrap shrink-0">
                    {pub.content_type}
                  </span>
                </div>
                
                <div className="text-xs text-gray-500 space-y-1">
                  <div className="truncate">Par: {pub.profiles?.full_name || 'Supprimé'}</div>
                  <div>Le: {new Date(pub.created_at).toLocaleDateString('fr-FR')}</div>
                </div>

                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-3 text-xs min-w-0">
                    <span className="flex items-center gap-1 shrink-0">
                      <Heart className="h-3 w-3 text-red-500" />
                      <span className="text-xs">{pub.likes_count}</span>
                    </span>
                    <span className="flex items-center gap-1 shrink-0">
                      <MessageCircle className="h-3 w-3 text-blue-500" />
                      <span className="text-xs">{pub.comments_count}</span>
                    </span>
                    <span className="flex items-center gap-1 shrink-0">
                      <Eye className="h-3 w-3 text-gray-500" />
                      <span className="text-xs">{pub.views_count}</span>
                    </span>
                  </div>
                  
                  <Button
                    size="sm"
                    variant={pub.is_public ? "default" : "secondary"}
                    onClick={() => handleToggleVisibility(pub.id, pub.is_public)}
                    className="text-xs px-2 py-1 h-7 shrink-0"
                  >
                    {pub.is_public ? 'Public' : 'Privé'}
                  </Button>
                </div>

                <div className="flex justify-end gap-1">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button size="sm" variant="outline" className="h-7 w-7 p-0 shrink-0">
                        <Eye className="h-3 w-3" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="w-[95vw] max-w-sm mx-auto">
                      <DialogHeader>
                        <DialogTitle className="text-left text-sm truncate">{pub.title}</DialogTitle>
                        <DialogDescription className="text-left text-xs">
                          Publié par {pub.profiles?.full_name} le {new Date(pub.created_at).toLocaleDateString('fr-FR')}
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-2 text-left text-sm">
                        <div><strong>Type:</strong> {pub.content_type}</div>
                        <div><strong>Status:</strong> {pub.is_public ? 'Public' : 'Privé'}</div>
                        <div><strong>Engagement:</strong> {pub.likes_count} likes, {pub.comments_count} commentaires, {pub.views_count} vues</div>
                      </div>
                    </DialogContent>
                  </Dialog>
                  
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleReportPublication(pub.id, 'Signalé par l\'administrateur')}
                    className="h-7 w-7 p-0 shrink-0"
                  >
                    <Flag className="h-3 w-3" />
                  </Button>
                  
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button size="sm" variant="destructive" className="h-7 w-7 p-0 shrink-0">
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="w-[95vw] max-w-sm mx-auto">
                      <AlertDialogHeader>
                        <AlertDialogTitle className="text-sm">Confirmer la suppression</AlertDialogTitle>
                        <AlertDialogDescription className="text-xs">
                          Supprimer cette publication ? Action irréversible.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter className="flex-col gap-2 sm:flex-row">
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
              </div>
            </Card>
          ))}
        </div>

        {/* Desktop Table Layout */}
        <Card className="hidden md:block">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Gestion des Publications</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="w-full">
              <div className="min-w-[800px]">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[200px]">Titre</TableHead>
                      <TableHead className="w-[150px]">Auteur</TableHead>
                      <TableHead className="w-[80px]">Type</TableHead>
                      <TableHead className="w-[80px]">Statut</TableHead>
                      <TableHead className="w-[120px]">Engagement</TableHead>
                      <TableHead className="w-[100px]">Date</TableHead>
                      <TableHead className="w-[140px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredPublications.map((pub) => (
                      <TableRow key={pub.id}>
                        <TableCell className="font-medium">
                          <div className="truncate max-w-[180px]">{pub.title}</div>
                        </TableCell>
                        <TableCell>
                          <div className="max-w-[130px]">
                            <div className="font-medium truncate text-sm">{pub.profiles?.full_name || 'Supprimé'}</div>
                            <div className="text-xs text-gray-500 truncate">@{pub.profiles?.username}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                            {pub.content_type}
                          </span>
                        </TableCell>
                        <TableCell>
                          <Button
                            size="sm"
                            variant={pub.is_public ? "default" : "secondary"}
                            onClick={() => handleToggleVisibility(pub.id, pub.is_public)}
                            className="text-xs px-2 py-1 h-7"
                          >
                            {pub.is_public ? 'Public' : 'Privé'}
                          </Button>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2 text-sm">
                            <span className="flex items-center gap-1">
                              <Heart className="h-3 w-3 text-red-500" />
                              {pub.likes_count}
                            </span>
                            <span className="flex items-center gap-1">
                              <MessageCircle className="h-3 w-3 text-blue-500" />
                              {pub.comments_count}
                            </span>
                            <span className="flex items-center gap-1">
                              <Eye className="h-3 w-3 text-gray-500" />
                              {pub.views_count}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3 text-gray-400" />
                            <span className="text-sm">{new Date(pub.created_at).toLocaleDateString('fr-FR')}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button size="sm" variant="outline" className="h-7 w-7 p-0">
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
                                  <div><strong>Type:</strong> {pub.content_type}</div>
                                  <div><strong>Status:</strong> {pub.is_public ? 'Public' : 'Privé'}</div>
                                  <div><strong>Engagement:</strong> {pub.likes_count} likes, {pub.comments_count} commentaires, {pub.views_count} vues</div>
                                </div>
                              </DialogContent>
                            </Dialog>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleReportPublication(pub.id, 'Signalé par l\'administrateur')}
                              className="h-7 w-7 p-0"
                            >
                              <Flag className="h-3 w-3" />
                            </Button>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button size="sm" variant="destructive" className="h-7 w-7 p-0">
                                  <Trash2 className="h-3 w-3" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Êtes-vous sûr de vouloir supprimer cette publication ? Cette action est irréversible.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Annuler</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => handleDeletePublication(pub.id)}
                                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
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
    </div>
  );
};

export default PublicationsManagement;
