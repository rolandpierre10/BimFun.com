import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { usePublications } from '@/hooks/usePublications';
import { supabase } from '@/integrations/supabase/client';
import { Upload, X, Image, Video, Music, Tv, Megaphone } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import EmojiPicker from './EmojiPicker';
import GifPicker from './GifPicker';

interface CreatePublicationProps {
  onClose?: () => void;
}

const CreatePublication = ({ onClose }: CreatePublicationProps) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [contentType, setContentType] = useState<'photo' | 'video' | 'music' | 'series' | 'announcement'>('photo');
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [selectedGif, setSelectedGif] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const { createPublication, uploadMedia } = usePublications();
  const { toast } = useToast();

  const contentTypeIcons = {
    photo: <Image className="h-4 w-4" />,
    video: <Video className="h-4 w-4" />,
    music: <Music className="h-4 w-4" />,
    series: <Tv className="h-4 w-4" />,
    announcement: <Megaphone className="h-4 w-4" />
  };

  const handleEmojiSelect = (emoji: string) => {
    setDescription(prev => prev + emoji);
  };

  const handleGifSelect = (gifUrl: string) => {
    setSelectedGif(gifUrl);
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

    setIsUploading(true);

    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error('Not authenticated');

      let mediaUrls: string[] = [];

      // Upload files if any
      if (files.length > 0 && contentType !== 'announcement') {
        for (const file of files) {
          const url = await uploadMedia(file, contentType);
          mediaUrls.push(url);
        }
      }

      // Add GIF to media URLs if selected
      if (selectedGif) {
        mediaUrls.push(selectedGif);
      }

      await createPublication.mutateAsync({
        user_id: user.user.id,
        title: title.trim(),
        description: description.trim() || null,
        content_type: contentType,
        media_urls: mediaUrls,
        tags,
        is_public: true,
      });

      // Reset form
      setTitle('');
      setDescription('');
      setContentType('photo');
      setTags([]);
      setFiles([]);
      setSelectedGif(null);
      
      if (onClose) onClose();
    } catch (error) {
      console.error('Error creating publication:', error);
    } finally {
      setIsUploading(false);
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

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center gap-2">
            {contentTypeIcons[contentType]}
            Créer une publication
          </CardTitle>
          {onClose && (
            <Button size="sm" variant="outline" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          )}
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
                <SelectItem value="photo">📸 Photo</SelectItem>
                <SelectItem value="video">🎥 Vidéo</SelectItem>
                <SelectItem value="music">🎵 Musique</SelectItem>
                <SelectItem value="series">📺 Mini-série</SelectItem>
                <SelectItem value="announcement">📢 Annonce</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Titre *</label>
            <div className="flex gap-2">
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Titre de votre publication..."
                required
                className="flex-1"
              />
              <EmojiPicker onEmojiSelect={(emoji) => setTitle(prev => prev + emoji)} />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Description</label>
            <div className="space-y-2">
              <div className="flex gap-2">
                <Textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Décrivez votre contenu..."
                  rows={3}
                  className="flex-1"
                />
                <div className="flex flex-col gap-2">
                  <EmojiPicker onEmojiSelect={handleEmojiSelect} />
                  <GifPicker onGifSelect={handleGifSelect} />
                </div>
              </div>
              
              {selectedGif && (
                <div className="relative inline-block">
                  <img 
                    src={selectedGif} 
                    alt="GIF sélectionné" 
                    className="h-24 rounded border"
                  />
                  <Button
                    type="button"
                    size="sm"
                    variant="destructive"
                    className="absolute -top-2 -right-2 h-6 w-6 p-0"
                    onClick={() => setSelectedGif(null)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              )}
            </div>
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
                  id="file-upload"
                />
                <label htmlFor="file-upload" className="cursor-pointer">
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
              disabled={isUploading || !title.trim()}
              className="flex-1"
            >
              {isUploading ? 'Publication...' : 'Publier'}
            </Button>
            {onClose && (
              <Button type="button" variant="outline" onClick={onClose}>
                Annuler
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default CreatePublication;
