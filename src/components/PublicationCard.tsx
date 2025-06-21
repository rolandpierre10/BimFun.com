import React, { useState } from 'react';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Heart, MessageCircle, Play, User, Eye, ThumbsDown, UserPlus, MessageSquare, UserCheck } from 'lucide-react';
import { Publication } from '@/hooks/usePublications';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import ShareMenu from './ShareMenu';
import ClickableImage from './ClickableImage';

interface PublicationCardProps {
  publication: Publication;
  userProfile?: any;
  onLike?: (id: string) => void;
  onDislike?: (id: string) => void;
  onComment?: (id: string) => void;
  onShare?: (id: string) => void;
  onFollow?: (userId: string) => void;
  onView?: (id: string) => void;
  showAllActions?: boolean;
}

const PublicationCard = ({ 
  publication, 
  userProfile,
  onLike, 
  onDislike,
  onComment, 
  onShare,
  onFollow,
  onView,
  showAllActions = false 
}: PublicationCardProps) => {
  const [commentText, setCommentText] = useState('');
  const [isCommenting, setIsCommenting] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [viewCount, setViewCount] = useState(publication.views_count || 0);
  const { toast } = useToast();

  const getContentTypeIcon = () => {
    switch (publication.content_type) {
      case 'photo': return '📸';
      case 'video': return '🎥';
      case 'music': return '🎵';
      case 'series': return '📺';
      case 'announcement': return '📢';
      default: return '📝';
    }
  };

  const getContentTypeLabel = () => {
    switch (publication.content_type) {
      case 'photo': return 'Photo';
      case 'video': return 'Vidéo';
      case 'music': return 'Musique';
      case 'series': return 'Mini-série';
      case 'announcement': return 'Annonce';
      default: return 'Contenu';
    }
  };

  const handleComment = async () => {
    if (!commentText.trim()) return;

    const { data: user } = await supabase.auth.getUser();
    if (!user.user) {
      toast({
        title: "Connexion requise",
        description: "Vous devez être connecté pour commenter",
        variant: "destructive",
      });
      return;
    }

    setIsCommenting(true);
    try {
      const { error } = await supabase
        .from('publication_comments')
        .insert([{
          user_id: user.user.id,
          publication_id: publication.id,
          content: commentText
        }]);

      if (error) throw error;

      setCommentText('');
      toast({
        title: "Commentaire ajouté",
        description: "Votre commentaire a été publié",
      });
      
      if (onComment) {
        onComment(publication.id);
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter le commentaire",
        variant: "destructive",
      });
    } finally {
      setIsCommenting(false);
    }
  };

  const handleLike = async () => {
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) {
      toast({
        title: "Connexion requise",
        description: "Vous devez être connecté pour aimer une publication",
        variant: "destructive",
      });
      return;
    }

    try {
      const { data: existing } = await supabase
        .from('publication_interactions')
        .select('id')
        .eq('user_id', user.user.id)
        .eq('publication_id', publication.id)
        .eq('interaction_type', 'like')
        .single();

      if (existing) {
        // Unlike
        await supabase
          .from('publication_interactions')
          .delete()
          .eq('id', existing.id);
        
        toast({
          title: "J'aime retiré",
          description: "Vous n'aimez plus cette publication",
        });
      } else {
        // Remove dislike if exists
        await supabase
          .from('publication_interactions')
          .delete()
          .eq('user_id', user.user.id)
          .eq('publication_id', publication.id)
          .eq('interaction_type', 'dislike');

        // Like
        await supabase
          .from('publication_interactions')
          .insert([{
            user_id: user.user.id,
            publication_id: publication.id,
            interaction_type: 'like'
          }]);

        toast({
          title: "Publication aimée",
          description: "Vous aimez cette publication",
        });
      }

      if (onLike) {
        onLike(publication.id);
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de traiter votre action",
        variant: "destructive",
      });
    }
  };

  const handleView = async () => {
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) return;

    try {
      // Vérifier si l'utilisateur a déjà vu cette publication
      const { data: existingView } = await supabase
        .from('publication_interactions')
        .select('id')
        .eq('user_id', user.user.id)
        .eq('publication_id', publication.id)
        .eq('interaction_type', 'view')
        .single();

      if (!existingView) {
        // Ajouter la vue
        await supabase
          .from('publication_interactions')
          .insert([{
            user_id: user.user.id,
            publication_id: publication.id,
            interaction_type: 'view'
          }]);

        // Incrémenter le compteur de vues localement
        const newViewCount = viewCount + 1;
        setViewCount(newViewCount);

        // Incrémenter le compteur de vues dans la base de données
        await supabase
          .from('publications')
          .update({ views_count: newViewCount })
          .eq('id', publication.id);

        toast({
          title: "Vue enregistrée",
          description: "Votre vue a été enregistrée",
        });

        if (onView) {
          onView(publication.id);
        }
      }
    } catch (error) {
      console.error('Error recording view:', error);
    }
  };

  const handleShare = () => {
    const publicationUrl = `${window.location.origin}/publication/${publication.id}`;
    
    if (navigator.share) {
      navigator.share({
        title: publication.title,
        text: publication.description || publication.title,
        url: publicationUrl
      }).then(() => {
        toast({
          title: "Publication partagée",
          description: "La publication a été partagée avec succès",
        });
      }).catch((error) => {
        console.log('Error sharing:', error);
        // Fallback to clipboard
        copyToClipboard(publicationUrl);
      });
    } else {
      // Fallback to clipboard
      copyToClipboard(publicationUrl);
    }

    if (onShare) {
      onShare(publication.id);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast({
        title: "Lien copié",
        description: "Le lien de la publication a été copié dans le presse-papiers",
      });
    }).catch(() => {
      toast({
        title: "Erreur",
        description: "Impossible de copier le lien",
        variant: "destructive",
      });
    });
  };

  const handleSendMessage = () => {
    toast({
      title: "Fonctionnalité à venir",
      description: "La messagerie sera bientôt disponible",
    });
  };

  const handleFriendRequest = () => {
    toast({
      title: "Demande d'ami envoyée",
      description: "Votre demande d'ami a été envoyée",
    });
  };

  const renderMedia = () => {
    if (!publication.media_urls || publication.media_urls.length === 0) {
      return null;
    }

    const firstMedia = publication.media_urls[0];

    switch (publication.content_type) {
      case 'photo':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {publication.media_urls.slice(0, 4).map((url, index) => (
              <div key={index} className="relative">
                <ClickableImage
                  src={url}
                  alt={`Image ${index + 1}`}
                  className="w-full h-48 object-cover rounded-lg"
                  title={publication.title}
                  description={publication.description}
                />
                {index === 3 && publication.media_urls.length > 4 && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 rounded-lg flex items-center justify-center pointer-events-none">
                    <span className="text-white text-lg font-semibold">
                      +{publication.media_urls.length - 4}
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        );

      case 'video':
      case 'series':
        return (
          <div className="relative">
            <video 
              src={firstMedia}
              className="w-full h-64 object-cover rounded-lg"
              poster=""
              controls={false}
            />
            <div className="absolute inset-0 bg-black bg-opacity-30 rounded-lg flex items-center justify-center">
              <Play className="h-16 w-16 text-white" />
            </div>
          </div>
        );

      case 'music':
        return (
          <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg p-6 text-white">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                <Play className="h-8 w-8" />
              </div>
              <div>
                <h4 className="font-semibold">{publication.title}</h4>
                <p className="opacity-80">Piste audio</p>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const getFirstImageUrl = () => {
    if (publication.content_type === 'photo' && publication.media_urls && publication.media_urls.length > 0) {
      const imageUrl = publication.media_urls[0];
      // Ensure the URL is properly formatted for sharing
      if (imageUrl.startsWith('http')) {
        return imageUrl;
      }
      // If it's a relative path, make it absolute
      return `${window.location.origin}${imageUrl}`;
    }
    return undefined;
  };

  const getPublicationUrl = () => {
    return `${window.location.origin}/publication/${publication.id}`;
  };

  return (
    <Card className="w-full mb-4">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
              {userProfile?.avatar_url ? (
                <img src={userProfile.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <User className="h-5 w-5 text-gray-500" />
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-semibold">{userProfile?.full_name || userProfile?.username || 'Utilisateur'}</h3>
                {showAllActions && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onFollow?.(publication.user_id)}
                    className="h-6 px-2 text-xs"
                  >
                    <UserPlus className="h-3 w-3 mr-1" />
                    Suivre
                  </Button>
                )}
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Badge variant="outline" className="text-xs">
                  {getContentTypeIcon()} {getContentTypeLabel()}
                </Badge>
                <span>•</span>
                <span>
                  {formatDistanceToNow(new Date(publication.created_at), { 
                    addSuffix: true, 
                    locale: fr 
                  })}
                </span>
              </div>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <h4 className="font-semibold text-lg">{publication.title}</h4>
        
        {publication.description && (
          <p className="text-gray-700">{publication.description}</p>
        )}

        {renderMedia()}

        {publication.tags && publication.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {publication.tags.map((tag, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                #{tag}
              </Badge>
            ))}
          </div>
        )}

        <div className="flex items-center justify-between pt-2 border-t">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLike}
              className="flex items-center gap-2 text-gray-600 hover:text-red-600"
            >
              <Heart className="h-4 w-4" />
              <span>{publication.likes_count}</span>
            </Button>

            {showAllActions && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDislike?.(publication.id)}
                className="flex items-center gap-2 text-gray-600 hover:text-blue-600"
              >
                <ThumbsDown className="h-4 w-4" />
              </Button>
            )}

            <Dialog>
              <DialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex items-center gap-2 text-gray-600 hover:text-blue-600"
                >
                  <MessageCircle className="h-4 w-4" />
                  <span>{publication.comments_count}</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Ajouter un commentaire</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <Textarea
                    placeholder="Écrivez votre commentaire..."
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    rows={3}
                  />
                  <Button
                    onClick={handleComment}
                    disabled={isCommenting || !commentText.trim()}
                    className="w-full"
                  >
                    {isCommenting ? 'Publication...' : 'Publier le commentaire'}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>

            <ShareMenu
              title={publication.title}
              description={publication.description || ''}
              url={getPublicationUrl()}
              imageUrl={getFirstImageUrl()}
            />

            {showAllActions && (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleSendMessage}
                  className="flex items-center gap-2 text-gray-600 hover:text-purple-600"
                >
                  <MessageSquare className="h-4 w-4" />
                  <span>Message</span>
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleFriendRequest}
                  className="flex items-center gap-2 text-gray-600 hover:text-orange-600"
                >
                  <UserCheck className="h-4 w-4" />
                  <span>Ami(e)</span>
                </Button>
              </>
            )}
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleView}
            className="flex items-center gap-1 text-sm text-gray-500 hover:text-blue-600"
          >
            <Eye className="h-4 w-4" />
            <span>{viewCount}</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default PublicationCard;
