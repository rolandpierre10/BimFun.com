
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from '@/integrations/supabase/client';
import { Eye, Trash2, Flag, Search, Filter, Calendar, Heart, MessageCircle, RefreshCw, Edit } from 'lucide-react';
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
  description?: string;
  content_type: string;
  created_at: string;
  is_public: boolean;
  likes_count: number;
  views_count: number;
  comments_count: number;
  user_id: string;
  tags?: string[];
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
  const [editingPublication, setEditingPublication] = useState<Publication | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editTags, setEditTags] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);

  const filteredPublications = publications.filter(pub => {
    const matchesSearch = pub.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         pub.profiles?.full_name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'all' || 
                         (filterType === 'public' && pub.is_public) ||
                         (filterType === 'private' && !pub.is_public) ||
                         pub.content_type === filterType;
    return matchesSearch && matchesFilter;
  });

  const handleEditPublication = (publication: Publication) => {
    setEditingPublication(publication);
    setEditTitle(publication.title);
    setEditDescription(publication.description || '');
    setEditTags(publication.tags ? publication.tags.join(', ') : '');
    setShowEditDialog(true);
  };

  const handleSaveEdit = async () => {
    if (!editingPublication) return;

    setIsEditing(true);
    try {
      const tagsArray = editTags.split(',').map(tag => tag.trim()).filter(tag => tag);
      
      const { error } = await supabase
        .from('publications')
        .update({
          title: editTitle,
          description: editDescription,
          tags: tagsArray
        })
        .eq('id', editingPublication.id);

      if (error) throw error;

      toast({
        title: "Publication modifiée",
        description: "La publication a été mise à jour avec succès",
      });

      setShowEditDialog(false);
      setEditingPublication(null);
      onRefresh();
    } catch (error) {
      console.error('Error updating publication:', error);
      toast({
        title: "Erreur",
        description: "Impossible de modifier la publication",
        variant: "destructive",
      });
    } finally {
      setIsEditing(false);
    }
  };

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
          {/* Filters - Responsive */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
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
                <SelectTrigger className="w-full sm:w-40">
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

          {/* Publications Display - Mobile-First with Desktop Table Fallback */}
          <div className="space-y-4">
            {filteredPublications.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                Aucune publication trouvée
              </div>
            ) : (
              <>
                {/* Mobile View - Cards */}
                <div className="block lg:hidden">
                  {filteredPublications.map((pub) => (
                    <Card key={pub.id} className="mb-4">
                      <CardContent className="p-4">
                        <div className="space-y-3">
                          {/* Header with Title and Status */}
                          <div className="flex justify-between items-start gap-3">
                            <div className="flex-1 min-w-0">
                              <h3 className="font-semibold text-base truncate">
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

                          {/* Stats Row */}
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

                          {/* Actions Row */}
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
                                  {pub.description && (
                                    <div><strong>Description:</strong> {pub.description}</div>
                                  )}
                                  {pub.tags && pub.tags.length > 0 && (
                                    <div><strong>Tags:</strong> {pub.tags.join(', ')}</div>
                                  )}
                                </div>
                              </DialogContent>
                            </Dialog>
                            
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleEditPublication(pub)}
                              className="h-8 px-3"
                            >
                              <Edit className="h-4 w-4 mr-1" />
                              Modifier
                            </Button>
                            
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
                  ))}
                </div>

                {/* Desktop View - Table */}
                <div className="hidden lg:block">
                  <ScrollArea className="w-full">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Titre</TableHead>
                          <TableHead>Auteur</TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Engagement</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredPublications.map((pub) => (
                          <TableRow key={pub.id}>
                            <TableCell className="font-medium max-w-xs">
                              <div className="truncate">{pub.title}</div>
                            </TableCell>
                            <TableCell>
                              <div className="text-sm">
                                <div>{pub.profiles?.full_name || 'Utilisateur supprimé'}</div>
                                <div className="text-gray-500">@{pub.profiles?.username || 'N/A'}</div>
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
                              >
                                {pub.is_public ? 'Public' : 'Privé'}
                              </Button>
                            </TableCell>
                            <TableCell>
                              <div className="flex gap-4 text-sm">
                                <span className="flex items-center gap-1">
                                  <Heart className="h-4 w-4 text-red-500" />
                                  {pub.likes_count}
                                </span>
                                <span className="flex items-center gap-1">
                                  <MessageCircle className="h-4 w-4 text-blue-500" />
                                  {pub.comments_count}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Eye className="h-4 w-4 text-gray-500" />
                                  {pub.views_count}
                                </span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="text-sm">
                                {new Date(pub.created_at).toLocaleDateString('fr-FR')}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex gap-2">
                                <Dialog>
                                  <DialogTrigger asChild>
                                    <Button size="sm" variant="outline">
                                      <Eye className="h-4 w-4" />
                                    </Button>
                                  </DialogTrigger>
                                  <DialogContent>
                                    <DialogHeader>
                                      <DialogTitle>{pub.title}</DialogTitle>
                                      <DialogDescription>
                                        Publié par {pub.profiles?.full_name || 'Utilisateur supprimé'} le {new Date(pub.created_at).toLocaleDateString('fr-FR')}
                                      </DialogDescription>
                                    </DialogHeader>
                                    <div className="space-y-3">
                                      <div><strong>Type:</strong> {pub.content_type}</div>
                                      <div><strong>Status:</strong> {pub.is_public ? 'Public' : 'Privé'}</div>
                                      <div>
                                        <strong>Engagement:</strong> {pub.likes_count} likes, {pub.comments_count} commentaires, {pub.views_count} vues
                                      </div>
                                      <div><strong>Auteur:</strong> {pub.profiles?.full_name || 'Utilisateur supprimé'} (@{pub.profiles?.username || 'N/A'})</div>
                                      <div><strong>Date de création:</strong> {new Date(pub.created_at).toLocaleString('fr-FR')}</div>
                                      {pub.description && (
                                        <div><strong>Description:</strong> {pub.description}</div>
                                      )}
                                      {pub.tags && pub.tags.length > 0 && (
                                        <div><strong>Tags:</strong> {pub.tags.join(', ')}</div>
                                      )}
                                    </div>
                                  </DialogContent>
                                </Dialog>
                                
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleEditPublication(pub)}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleReportPublication(pub.id, 'Signalé par l\'administrateur')}
                                >
                                  <Flag className="h-4 w-4" />
                                </Button>
                                
                                <AlertDialog>
                                  <AlertDialogTrigger asChild>
                                    <Button size="sm" variant="destructive">
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </AlertDialogTrigger>
                                  <AlertDialogContent>
                                    <AlertDialogHeader>
                                      <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
                                      <AlertDialogDescription>
                                        Êtes-vous sûr de vouloir supprimer cette publication "{pub.title}" ? Cette action est irréversible.
                                      </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                      <AlertDialogCancel>Annuler</AlertDialogCancel>
                                      <AlertDialogAction
                                        onClick={() => handleDeletePublication(pub.id)}
                                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                      >
                                        Supprimer définitivement
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
                  </ScrollArea>
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Edit Publication Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="w-[95vw] max-w-md mx-auto">
          <DialogHeader>
            <DialogTitle>Modifier la publication</DialogTitle>
            <DialogDescription>
              Modifiez les informations de la publication
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Titre</label>
              <Input
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                placeholder="Titre de la publication"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Description</label>
              <Textarea
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                placeholder="Description de la publication"
                rows={3}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Tags</label>
              <Input
                value={editTags}
                onChange={(e) => setEditTags(e.target.value)}
                placeholder="Tag1, Tag2, Tag3..."
              />
            </div>
            <div className="flex gap-2 pt-4">
              <Button
                onClick={handleSaveEdit}
                disabled={isEditing || !editTitle.trim()}
                className="flex-1"
              >
                {isEditing ? 'Modification...' : 'Sauvegarder'}
              </Button>
              <Button
                onClick={() => setShowEditDialog(false)}
                variant="outline"
                className="flex-1"
              >
                Annuler
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PublicationsManagement;
