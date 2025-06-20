
import React, { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

const DemoInteractions = () => {
  useEffect(() => {
    const addDemoInteractions = async () => {
      // Vérifier si des publications existent déjà
      const { data: existingPublications } = await supabase
        .from('publications')
        .select('id')
        .limit(1);

      if (existingPublications && existingPublications.length === 0) {
        // Ajouter quelques publications de démonstration sans référence utilisateur
        const demoPublications = [
          {
            title: 'Nouvelle identité visuelle pour startup tech',
            description: 'Voici ma dernière création : une identité visuelle complète pour une startup dans le domaine de la tech. Le défi était de créer quelque chose de moderne tout en restant accessible.',
            content_type: 'photo',
            media_urls: ['https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&h=600&fit=crop'],
            tags: ['design', 'branding', 'startup', 'tech'],
            is_public: true,
            likes_count: 24,
            views_count: 156,
            comments_count: 8,
            user_id: '00000000-0000-0000-0000-000000000000' // ID par défaut
          },
          {
            title: 'Architecture microservices avec Docker',
            description: 'Partage de mon expérience sur la mise en place d\'une architecture microservices robuste. Les défis et les solutions que j\'ai trouvées.',
            content_type: 'photo',
            media_urls: ['https://images.unsplash.com/photo-1518432031352-d6fc5c10da5a?w=800&h=600&fit=crop'],
            tags: ['développement', 'docker', 'microservices', 'architecture'],
            is_public: true,
            likes_count: 31,
            views_count: 203,
            comments_count: 12,
            user_id: '00000000-0000-0000-0000-000000000000'
          },
          {
            title: 'Série portraits urbains - Barcelone',
            description: 'Une série de portraits capturés dans les rues de Barcelone. Chaque visage raconte une histoire unique de cette ville magnifique.',
            content_type: 'photo',
            media_urls: [
              'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=800&h=600&fit=crop',
              'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=600&fit=crop'
            ],
            tags: ['photographie', 'portrait', 'street', 'barcelone'],
            is_public: true,
            likes_count: 45,
            views_count: 289,
            comments_count: 15,
            user_id: '00000000-0000-0000-0000-000000000000'
          }
        ];

        // Insérer les publications une par une
        for (const pub of demoPublications) {
          await supabase.from('publications').insert([pub]);
        }
      }
    };

    addDemoInteractions();
  }, []);

  return null; // Ce composant n'affiche rien, il ne fait qu'ajouter des données
};

export default DemoInteractions;
