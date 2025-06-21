
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Plus, X, Upload, Loader2, Download, Link } from 'lucide-react';
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
  const [files, setFiles] = useState<File[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
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
      // Validation simple de l'URL
      try {
        new URL(currentMediaUrl.trim());
        setMediaUrls([...mediaUrls, currentMediaUrl.trim()]);
        setCurrentMediaUrl('');
        toast({
          title: 'URL ajoutée',
          description: 'L\'URL du média a été ajoutée avec succès',
        });
      } catch (error) {
        toast({
          title: 'URL invalide',
          description: 'Veuillez entrer une URL valide',
          variant: 'destructive',
        });
      }
    }
  };

  const handleRemoveMediaUrl = (urlToRemove: string) => {
    setMediaUrls(mediaUrls.filter(url => url !== urlToRemove));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      setFiles(selectedFiles);
      console.log('Files selected:', selectedFiles.length);
    }
  };

  const uploadFiles = async (): Promise<string[]> => {
    if (files.length === 0) return [];

    setIsUploading(true);
    const uploadedUrls: string[] = [];

    try {
      for (const file of files) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
        
        // Déterminer le bucket en fonction du type de contenu
        let bucket = 'user-photos'; // défaut
        if (contentType === 'video' || contentType === 'series') {
          bucket = 'user-videos';
        } else if (contentType === 'music') {
          bucket = 'user-music';
        }

        console.log(`Uploading ${file.name} to bucket: ${bucket}`);

        const { error: uploadError } = await supabase.storage
          .from(bucket)
          .upload(fileName, file);

        if (uploadError) {
          console.error('Upload error:', uploadError);
          throw uploadError;
        }

        const { data } = supabase.storage
          .from(bucket)
          .getPublicUrl(fileName);

        uploadedUrls.push(data.publicUrl);
        console.log(`File uploaded successfully: ${data.publicUrl}`);
      }
    } catch (error) {
      console.error('Error uploading files:', error);
      throw error;
    } finally {
      setIsUploading(false);
    }

    return uploadedUrls;
  };

  const handleDownloadFile = (url: string, filename?: string) => {
    try {
      const link = document.createElement('a');
      link.href = url;
      link.download = filename || `media_${Date.now()}`;
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast({
        title: 'Téléchargement démarré',
        description: 'Le fichier va être téléchargé',
      });
    } catch (error) {
      console.error('Download error:', error);
      toast({
        title: 'Erreur de téléchargement',
        description: 'Impossible de télécharger le fichier',
        variant: 'destructive',
      });
    }
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
      mediaUrls,
      filesCount: files.length
    });

    try {
      // Get current user (should be admin)
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError || !user) {
        throw new Error('User not authenticated');
      }

      console.log('Current user:', user);

      // Upload files first if any
      let allMediaUrls = [...mediaUrls];
      if (files.length > 0) {
        const uploadedUrls = await uploadFiles();
        allMediaUrls = [...allMediaUrls, ...uploadedUrls];
      }

      const publicationData = {
        title: title.trim(),
        description: description.trim() || null,
        content_type: contentType,
        tags: tags,
        media_urls: allMediaUrls,
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
      setFiles([]);
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

  const getAcceptedFileTypes = () => {
    switch (contentType) {
      case 'photo': return 'image/*';
      case 'video': return 'video/*';
      case 'music': return 'audio/*';
      case 'series': return 'video/*';
      default: return '*/*';
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

        {contentType && contentType !== 'announcement' && (
          <div>
            <label className="block text-sm font-medium mb-2">Télécharger des fichiers</label>
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
                <p className="text-sm text-gray-600 mb-2">{files.length} fichier(s) sélectionné(s)</p>
                <div className="space-y-2">
                  {files.map((file, index) => (
                    <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                      <span className="text-sm truncate flex-1">{file.name}</span>
                      <div className="flex gap-2 ml-2">
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            const url = URL.createObjectURL(file);
                            handleDownloadFile(url, file.name);
                            URL.revokeObjectURL(url);
                          }}
                        >
                          <Download className="h-3 w-3" />
                        </Button>
                        <X
                          className="h-4 w-4 cursor-pointer text-red-500"
                          onClick={() => {
                            setFiles(files.filter((_, i) => i !== index));
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        <div>
          <label className="block text-sm font-medium mb-2">URLs des médias</label>
          <div className="flex space-x-2 mb-2">
            <Input
              value={currentMediaUrl}
              onChange={(e) => setCurrentMediaUrl(e.target.value)}
              placeholder="https://exemple.com/image.jpg"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddMediaUrl();
                }
              }}
            />
            <Button type="button" onClick={handleAddMediaUrl} size="sm">
              <Link className="h-4 w-4" />
            </Button>
          </div>
          <div className="space-y-2">
            {mediaUrls.map((url, index) => (
              <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                <span className="text-sm truncate flex-1">{url}</span>
                <div className="flex gap-2 ml-2">
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => handleDownloadFile(url)}
                  >
                    <Download className="h-3 w-3" />
                  </Button>
                  <X
                    className="h-4 w-4 cursor-pointer text-red-500"
                    onClick={() => handleRemoveMediaUrl(url)}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <Button 
          onClick={handleCreatePublication} 
          className="w-full" 
          disabled={isLoading || isUploading || !title.trim() || !contentType}
        >
          {isLoading || isUploading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              {isUploading ? 'Téléchargement en cours...' : 'Création en cours...'}
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
