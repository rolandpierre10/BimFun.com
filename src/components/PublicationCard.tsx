
import React, { useState } from 'react';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Heart, MessageCircle, Share2, Play, User, Eye, ThumbsDown, UserPlus, MessageSquare, UserCheck } from 'lucide-react';
import { Publication } from '@/hooks/usePublications';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface PublicationCardProps {
  publication: Publication;
  userProfile?: any;
  onLike?: (id: string) => void;
  onDislike?: (id: string) => void;
  onComment?: (id: string) => void;
  onShare?: (id: string) => void;
  onFollow?: (userId: string) => void;
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
  showAllActions = false 
}: PublicationCardProps) => {
  const [commentText, setCommentText] = useState('');
  const [isCommenting, setIsCommenting] = useState(false);
  const [showComments, setShowComments] = useState(false);
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
                <img 
                  src={url} 
                  alt={`Image ${index + 1}`}
                  className="w-full h-48 object-cover rounded-lg"
                />
                {index === 3 && publication.media_urls.length > 4 && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 rounded-lg flex items-center justify-center">
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
              onClick={() => onLike?.(publication.id)}
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

            <Button
              variant="ghost"
              size="sm"
              onClick={() => onShare?.(publication.id)}
              className="flex items-center gap-2 text-gray-600 hover:text-green-600"
            >
              <Share2 className="h-4 w-4" />
              <span>Partager</span>
            </Button>

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

          <div className="flex items-center gap-1 text-sm text-gray-500">
            <Eye className="h-4 w-4" />
            <span>{publication.views_count}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PublicationCard;
