
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Plus, X, Upload, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const AdminPublicationCreator = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [contentType, setContentType] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [currentTag, setCurrentTag] = useState('');
  const [mediaUrls, setMediaUrls] = useState<string[]>([]);
  const [currentMediaUrl, setCurrentMediaUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleAddTag = () => {
    if (currentTag.trim() && !tags.includes(currentTag.trim())) {
      setTags([...tags, currentTag.trim()]);
      setCurrentTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleAddMediaUrl = () => {
    if (currentMediaUrl.trim() && !mediaUrls.includes(currentMediaUrl.trim())) {
      setMediaUrls([...mediaUrls, currentMediaUrl.trim()]);
      setCurrentMediaUrl('');
    }
  };

  const handleRemoveMediaUrl = (urlToRemove: string) => {
    setMediaUrls(mediaUrls.filter(url => url !== urlToRemove));
  };

  const handleCreatePublication = async () => {
    if (!title.trim() || !contentType) {
      toast({
        title: 'Erreur',
        description: 'Veuillez remplir au moins le titre et le type de contenu',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    console.log('Creating publication with data:', {
      title,
      description,
      contentType,
      tags,
      mediaUrls
    });

    try {
      // Get current user (should be admin)
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError || !user) {
        throw new Error('User not authenticated');
      }

      console.log('Current user:', user);

      const publicationData = {
        title: title.trim(),
        description: description.trim() || null,
        content_type: contentType,
        tags: tags,
        media_urls: mediaUrls,
        is_public: true, // Always public for admin publications
        user_id: user.id,
        likes_count: 0,
        views_count: 0,
        comments_count: 0
      };

      console.log('Inserting publication:', publicationData);

      const { data, error } = await supabase
        .from('publications')
        .insert([publicationData])
        .select()
        .single();

      if (error) {
        console.error('Database error:', error);
        throw error;
      }

      console.log('Publication created successfully:', data);

      toast({
        title: 'Publication créée',
        description: 'La publication a été créée et publiée avec succès',
      });

      // Reset form
      setTitle('');
      setDescription('');
      setContentType('');
      setTags([]);
      setMediaUrls([]);
      setCurrentTag('');
      setCurrentMediaUrl('');

    } catch (error) {
      console.error('Error creating publication:', error);
      toast({
        title: 'Erreur',
        description: `Impossible de créer la publication: ${error.message}`,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Créer une nouvelle publication</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Titre *</label>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Titre de la publication"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Description</label>
          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description de la publication"
            rows={3}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Type de contenu *</label>
          <Select value={contentType} onValueChange={setContentType}>
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner le type de contenu" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="photo">Photo</SelectItem>
              <SelectItem value="video">Vidéo</SelectItem>
              <SelectItem value="music">Musique</SelectItem>
              <SelectItem value="series">Mini-série</SelectItem>
              <SelectItem value="announcement">Annonce</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Tags</label>
          <div className="flex space-x-2 mb-2">
            <Input
              value={currentTag}
              onChange={(e) => setCurrentTag(e.target.value)}
              placeholder="Ajouter un tag"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddTag();
                }
              }}
            />
            <Button type="button" onClick={handleAddTag} size="sm">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                {tag}
                <X
                  className="h-3 w-3 cursor-pointer"
                  onClick={() => handleRemoveTag(tag)}
                />
              </Badge>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">URLs des médias</label>
          <div className="flex space-x-2 mb-2">
            <Input
              value={currentMediaUrl}
              onChange={(e) => setCurrentMediaUrl(e.target.value)}
              placeholder="URL de l'image/vidéo"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddMediaUrl();
                }
              }}
            />
            <Button type="button" onClick={handleAddMediaUrl} size="sm">
              <Upload className="h-4 w-4" />
            </Button>
          </div>
          <div className="space-y-2">
            {mediaUrls.map((url, index) => (
              <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                <span className="text-sm truncate flex-1">{url}</span>
                <X
                  className="h-4 w-4 cursor-pointer text-red-500 ml-2"
                  onClick={() => handleRemoveMediaUrl(url)}
                />
              </div>
            ))}
          </div>
        </div>

        <Button 
          onClick={handleCreatePublication} 
          className="w-full" 
          disabled={isLoading || !title.trim() || !contentType}
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Création en cours...
            </>
          ) : (
            'Créer et publier'
          )}
        </Button>
      </CardContent>
    </Card>
  );
};

export default AdminPublicationCreator;
