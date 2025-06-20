
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { supabase } from '@/integrations/supabase/client';
import { Upload, X, Image, Video, Music, Tv, Megaphone, Plus, AlertCircle } from 'lucide-react';

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

  // Production-ready file upload with error handling
  const uploadFile = async (file: File, contentType: string): Promise<string> => {
    const bucketMap = {
      photo: 'user-photos',
      video: 'user-videos', 
      music: 'user-music',
      series: 'user-series'
    };

    const bucket = bucketMap[contentType as keyof typeof bucketMap] || 'user-photos';
    const fileExt = file.name.split('.').pop()?.toLowerCase();
    const fileName = `admin-${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = `${fileName}`;

    // Validate file size (max 50MB for production)
    if (file.size > 50 * 1024 * 1024) {
      throw new Error('Fichier trop volumineux (max 50MB)');
    }

    // Validate file type
    const allowedTypes = {
      photo: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
      video: ['mp4', 'mov', 'avi', 'mkv', 'webm'],
      music: ['mp3', 'wav', 'flac', 'aac', 'm4a'],
      series: ['mp4', 'mov', 'avi', 'mkv', 'webm']
    };

    const allowedExts = allowedTypes[contentType as keyof typeof allowedTypes] || [];
    if (fileExt && !allowedExts.includes(fileExt)) {
      throw new Error(`Type de fichier non autorisé. Formats acceptés: ${allowedExts.join(', ')}`);
    }

    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

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
      if (!user.user) throw new Error('Non authentifié');

      let mediaUrls: string[] = [];

      // Upload files with progress and error handling
      if (files.length > 0 && contentType !== 'announcement') {
        for (const file of files) {
          try {
            const url = await uploadFile(file, contentType);
            mediaUrls.push(url);
          } catch (fileError) {
            console.error('Erreur upload fichier:', fileError);
            toast({
              title: "Erreur d'upload",
              description: `Impossible d'uploader ${file.name}: ${fileError.message}`,
              variant: "destructive",
            });
            return;
          }
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
        description: "La publication a été créée avec succès et est maintenant visible par tous les utilisateurs",
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
        description: "Impossible de créer la publication. Veuillez réessayer.",
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
      <Card className="border-2 border-dashed border-blue-200 hover:border-blue-400 transition-colors">
        <CardHeader>
          <CardTitle className="text-center text-gray-600">Créer une Publication</CardTitle>
        </CardHeader>
        <CardContent>
          <Button 
            onClick={() => setShowForm(true)} 
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3"
            size="lg"
          >
            <Plus className="h-5 w-5 mr-2" />
            Nouvelle Publication
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-blue-200">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center gap-2 text-blue-700">
            {contentTypeIcons[contentType]}
            Créer une Publication
          </CardTitle>
          <Button size="sm" variant="outline" onClick={() => setShowForm(false)}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="text-sm font-medium mb-2 block text-gray-700">Type de contenu</label>
            <Select value={contentType} onValueChange={(value: any) => setContentType(value)}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="announcement">📢 Annonce officielle</SelectItem>
                <SelectItem value="photo">📸 Photo</SelectItem>
                <SelectItem value="video">🎥 Vidéo</SelectItem>
                <SelectItem value="music">🎵 Musique</SelectItem>
                <SelectItem value="series">📺 Mini-série</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block text-gray-700">Titre *</label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Titre de la publication..."
              required
              className="w-full"
            />
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block text-gray-700">Description</label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Décrivez votre publication..."
              rows={4}
              className="w-full resize-none"
            />
          </div>

          {contentType !== 'announcement' && (
            <div>
              <label className="text-sm font-medium mb-2 block text-gray-700">Fichiers</label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
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
                  <span className="text-blue-600 hover:text-blue-500 font-medium">
                    Cliquez pour sélectionner des fichiers
                  </span>
                  <p className="text-gray-500 text-sm mt-1">
                    {contentType === 'photo' && 'Images (PNG, JPG, JPEG, GIF, WebP) - Max 50MB par fichier'}
                    {contentType === 'video' && 'Vidéos (MP4, AVI, MOV, MKV, WebM) - Max 50MB par fichier'}
                    {contentType === 'music' && 'Audio (MP3, WAV, FLAC, AAC, M4A) - Max 50MB par fichier'}
                    {contentType === 'series' && 'Vidéos (MP4, AVI, MOV, MKV, WebM) - Max 50MB par fichier'}
                  </p>
                </label>
              </div>
              
              {files.length > 0 && (
                <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-700 font-medium">{files.length} fichier(s) sélectionné(s)</p>
                  <div className="text-xs text-blue-600 mt-1">
                    {files.map(file => `${file.name} (${(file.size / 1024 / 1024).toFixed(2)} MB)`).join(', ')}
                  </div>
                </div>
              )}
            </div>
          )}

          <div>
            <label className="text-sm font-medium mb-2 block text-gray-700">Tags</label>
            <div className="flex gap-2 mb-2">
              <Input
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                placeholder="Ajouter un tag..."
                className="flex-1"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
              />
              <Button type="button" onClick={handleAddTag} size="sm" variant="outline">
                Ajouter
              </Button>
            </div>
            
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {tags.map((tag, index) => (
                  <Badge key={index} variant="secondary" className="flex items-center gap-1">
                    {tag}
                    <X className="h-3 w-3 cursor-pointer hover:bg-gray-300 rounded" onClick={() => removeTag(tag)} />
                  </Badge>
                ))}
              </div>
            )}
          </div>

          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-start gap-2">
              <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
              <div className="text-sm text-blue-800">
                <p className="font-medium">Publication en mode production</p>
                <p>Cette publication sera immédiatement visible par tous les utilisateurs de la plateforme.</p>
              </div>
            </div>
          </div>

          <div className="flex gap-3 pt-4 border-t">
            <Button 
              type="submit" 
              disabled={isCreating || !title.trim()}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2"
            >
              {isCreating ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Publication...
                </div>
              ) : (
                'Publier maintenant'
              )}
            </Button>
            <Button type="button" variant="outline" onClick={() => setShowForm(false)} className="px-6">
              Annuler
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default AdminPublicationCreator;
