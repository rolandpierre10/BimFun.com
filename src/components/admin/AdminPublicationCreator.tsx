
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { supabase } from '@/integrations/supabase/client';
import { Upload, X, Image, Video, Music, Tv, Megaphone, Plus } from 'lucide-react';

interface AdminPublicationCreatorProps {
  onPublicationCreated: () => void;
}

const AdminPublicationCreator: React.FC<AdminPublicationCreatorProps> = ({ onPublicationCreated }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [contentType, setContentType] = useState<'photo' | 'video' | 'music' | 'series' | 'announcement'>('announcement');
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const { toast } = useToast();

  const contentTypeIcons = {
    photo: <Image className="h-4 w-4" />,
    video: <Video className="h-4 w-4" />,
    music: <Music className="h-4 w-4" />,
    series: <Tv className="h-4 w-4" />,
    announcement: <Megaphone className="h-4 w-4" />
  };

  const handleAddTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      setFiles(selectedFiles);
    }
  };

  const uploadFile = async (file: File, contentType: string): Promise<string> => {
    const bucketMap = {
      photo: 'user-photos',
      video: 'user-videos',
      music: 'user-music',
      series: 'user-series'
    };

    const bucket = bucketMap[contentType as keyof typeof bucketMap] || 'user-photos';
    const fileExt = file.name.split('.').pop();
    const fileName = `admin-${Date.now()}.${fileExt}`;
    const filePath = `${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    const { data } = supabase.storage
      .from(bucket)
      .getPublicUrl(filePath);

    return data.publicUrl;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      toast({
        title: "Erreur",
        description: "Le titre est requis",
        variant: "destructive",
      });
      return;
    }

    setIsCreating(true);

    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error('Not authenticated');

      let mediaUrls: string[] = [];

      // Upload files if any
      if (files.length > 0 && contentType !== 'announcement') {
        for (const file of files) {
          const url = await uploadFile(file, contentType);
          mediaUrls.push(url);
        }
      }

      const { error } = await supabase
        .from('publications')
        .insert({
          user_id: user.user.id,
          title: title.trim(),
          description: description.trim() || null,
          content_type: contentType,
          media_urls: mediaUrls,
          tags,
          is_public: true,
        });

      if (error) throw error;

      toast({
        title: "Publication créée",
        description: "La publication administrative a été créée avec succès",
      });

      // Reset form
      setTitle('');
      setDescription('');
      setContentType('announcement');
      setTags([]);
      setFiles([]);
      setShowForm(false);
      
      onPublicationCreated();
    } catch (error) {
      console.error('Error creating publication:', error);
      toast({
        title: "Erreur",
        description: "Impossible de créer la publication",
        variant: "destructive",
      });
    } finally {
      setIsCreating(false);
    }
  };

  const getAcceptedFileTypes = () => {
    switch (contentType) {
      case 'photo': return 'image/*';
      case 'video': return 'video/*';
      case 'music': return 'audio/*';
      case 'series': return 'video/*';
      default: return '';
    }
  };

  if (!showForm) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Créer une Publication</CardTitle>
        </CardHeader>
        <CardContent>
          <Button onClick={() => setShowForm(true)} className="w-full">
            <Plus className="h-4 w-4 mr-2" />
            Nouvelle Publication
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center gap-2">
            {contentTypeIcons[contentType]}
            Créer une Publication Administrative
          </CardTitle>
          <Button size="sm" variant="outline" onClick={() => setShowForm(false)}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Type de contenu</label>
            <Select value={contentType} onValueChange={(value: any) => setContentType(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="announcement">📢 Annonce</SelectItem>
                <SelectItem value="photo">📸 Photo</SelectItem>
                <SelectItem value="video">🎥 Vidéo</SelectItem>
                <SelectItem value="music">🎵 Musique</SelectItem>
                <SelectItem value="series">📺 Mini-série</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Titre *</label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Titre de la publication..."
              required
            />
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Description</label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Contenu de la publication..."
              rows={4}
            />
          </div>

          {contentType !== 'announcement' && (
            <div>
              <label className="text-sm font-medium mb-2 block">Fichiers</label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <Upload className="h-12 w-12 mx-auto text-gray-400 mb-2" />
                <input
                  type="file"
                  multiple
                  accept={getAcceptedFileTypes()}
                  onChange={handleFileChange}
                  className="hidden"
                  id="admin-file-upload"
                />
                <label htmlFor="admin-file-upload" className="cursor-pointer">
                  <span className="text-blue-600 hover:text-blue-500">
                    Cliquez pour sélectionner des fichiers
                  </span>
                  <p className="text-gray-500 text-sm mt-1">
                    {contentType === 'photo' && 'Images (PNG, JPG, JPEG)'}
                    {contentType === 'video' && 'Vidéos (MP4, AVI, MOV)'}
                    {contentType === 'music' && 'Audio (MP3, WAV, FLAC)'}
                    {contentType === 'series' && 'Vidéos (MP4, AVI, MOV)'}
                  </p>
                </label>
              </div>
              
              {files.length > 0 && (
                <div className="mt-2">
                  <p className="text-sm text-gray-600">{files.length} fichier(s) sélectionné(s)</p>
                  <div className="text-xs text-gray-500">
                    {files.map(file => file.name).join(', ')}
                  </div>
                </div>
              )}
            </div>
          )}

          <div>
            <label className="text-sm font-medium mb-2 block">Tags</label>
            <div className="flex gap-2 mb-2">
              <Input
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                placeholder="Ajouter un tag..."
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
              />
              <Button type="button" onClick={handleAddTag} size="sm">
                Ajouter
              </Button>
            </div>
            
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {tags.map((tag, index) => (
                  <Badge key={index} variant="secondary" className="flex items-center gap-1">
                    {tag}
                    <X className="h-3 w-3 cursor-pointer" onClick={() => removeTag(tag)} />
                  </Badge>
                ))}
              </div>
            )}
          </div>

          <div className="flex gap-2 pt-4">
            <Button 
              type="submit" 
              disabled={isCreating || !title.trim()}
              className="flex-1"
            >
              {isCreating ? 'Création...' : 'Publier'}
            </Button>
            <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
              Annuler
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default AdminPublicationCreator;
