
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

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Rechercher une publication..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-64"
            />
          </div>
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="w-48">
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
        <Button onClick={onRefresh} variant="outline">
          <Filter className="h-4 w-4 mr-2" />
          Actualiser
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Gestion des Publications</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Titre</TableHead>
                <TableHead>Auteur</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Statut</TableHead>
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
                    <div>
                      <div className="font-medium">{pub.profiles?.full_name || 'Utilisateur supprimé'}</div>
                      <div className="text-sm text-gray-500">@{pub.profiles?.username}</div>
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
                    <div className="flex items-center space-x-3 text-sm">
                      <span className="flex items-center">
                        <Heart className="h-3 w-3 mr-1 text-red-500" />
                        {pub.likes_count}
                      </span>
                      <span className="flex items-center">
                        <MessageCircle className="h-3 w-3 mr-1 text-blue-500" />
                        {pub.comments_count}
                      </span>
                      <span className="flex items-center">
                        <Eye className="h-3 w-3 mr-1 text-gray-500" />
                        {pub.views_count}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-3 w-3 text-gray-400" />
                      <span className="text-sm">{new Date(pub.created_at).toLocaleDateString('fr-FR')}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button size="sm" variant="outline">
                            <Eye className="h-3 w-3" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>{pub.title}</DialogTitle>
                            <DialogDescription>
                              Publié par {pub.profiles?.full_name} le {new Date(pub.created_at).toLocaleDateString('fr-FR')}
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div>
                              <strong>Type:</strong> {pub.content_type}
                            </div>
                            <div>
                              <strong>Status:</strong> {pub.is_public ? 'Public' : 'Privé'}
                            </div>
                            <div>
                              <strong>Engagement:</strong> {pub.likes_count} likes, {pub.comments_count} commentaires, {pub.views_count} vues
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleReportPublication(pub.id, 'Signalé par l\'administrateur')}
                      >
                        <Flag className="h-3 w-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => onDeletePublication(pub.id)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
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

export default PublicationsManagement;
