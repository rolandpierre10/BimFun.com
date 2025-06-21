
import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Publication } from '@/hooks/usePublications';
import PublicationCard from '@/components/PublicationCard';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

const PublicationPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: publication, isLoading, error } = useQuery({
    queryKey: ['publication', id],
    queryFn: async () => {
      if (!id) throw new Error('Publication ID is required');
      
      const { data, error } = await supabase
        .from('publications')
        .select('*')
        .eq('id', id)
        .eq('is_public', true)
        .single();

      if (error) throw error;
      return data as Publication;
    },
    enabled: !!id,
  });

  const { data: userProfile } = useQuery({
    queryKey: ['profile', publication?.user_id],
    queryFn: async () => {
      if (!publication?.user_id) return null;
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', publication.user_id)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!publication?.user_id,
  });

  useEffect(() => {
    if (publication && !document.title.includes(publication.title)) {
      document.title = `${publication.title} - BimFun`;
      
      // Update meta tags for social sharing
      const metaDescription = document.querySelector('meta[name="description"]');
      if (metaDescription) {
        metaDescription.setAttribute('content', publication.description || publication.title);
      }

      // Add Open Graph meta tags
      const addMetaTag = (property: string, content: string) => {
        let meta = document.querySelector(`meta[property="${property}"]`);
        if (!meta) {
          meta = document.createElement('meta');
          meta.setAttribute('property', property);
          document.head.appendChild(meta);
        }
        meta.setAttribute('content', content);
      };

      addMetaTag('og:title', publication.title);
      addMetaTag('og:description', publication.description || publication.title);
      addMetaTag('og:url', window.location.href);
      if (publication.media_urls && publication.media_urls.length > 0) {
        addMetaTag('og:image', publication.media_urls[0]);
      }
      addMetaTag('og:type', 'article');
    }
  }, [publication]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4 max-w-2xl">
          <Skeleton className="h-8 w-32 mb-6" />
          <Skeleton className="h-64 w-full mb-4" />
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-3/4" />
        </div>
      </div>
    );
  }

  if (error || !publication) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4 max-w-2xl">
          <Button
            variant="ghost"
            onClick={() => navigate('/')}
            className="mb-6 flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Retour à l'accueil
          </Button>
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Publication introuvable
            </h1>
            <p className="text-gray-600 mb-6">
              Cette publication n'existe pas ou n'est plus disponible.
            </p>
            <Button onClick={() => navigate('/')}>
              Retour à l'accueil
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-2xl">
        <Button
          variant="ghost"
          onClick={() => navigate('/')}
          className="mb-6 flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Retour à l'accueil
        </Button>
        
        <PublicationCard
          publication={publication}
          userProfile={userProfile}
          showAllActions={true}
        />
      </div>
    </div>
  );
};

export default PublicationPage;
