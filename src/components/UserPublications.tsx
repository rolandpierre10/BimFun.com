
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Image, Video, Music, Tv, Megaphone } from 'lucide-react';

interface UserPublicationsProps {
  userId?: string;
  isOwnProfile?: boolean;
}

const UserPublications = ({ userId, isOwnProfile = false }: UserPublicationsProps) => {
  const [activeTab, setActiveTab] = useState('all');

  // Mock publications pour éviter les boucles infinies
  const mockPublications = [
    {
      id: '1',
      title: 'Ma première publication',
      content_type: 'photo',
      description: 'Une belle photo de vacances',
      created_at: new Date().toISOString(),
      likes_count: 5,
      views_count: 120,
      comments_count: 2
    },
    {
      id: '2',
      title: 'Vidéo de présentation',
      content_type: 'video',
      description: 'Ma nouvelle vidéo',
      created_at: new Date().toISOString(),
      likes_count: 12,
      views_count: 340,
      comments_count: 8
    }
  ];

  const filterPublications = (contentType: string) => {
    if (contentType === 'all') return mockPublications;
    return mockPublications.filter(pub => pub.content_type === contentType);
  };

  const getTabCount = (contentType: string) => {
    return filterPublications(contentType).length;
  };

  return (
    <div className="w-full space-y-3 sm:space-y-4 lg:space-y-6">
      {isOwnProfile && (
        <div className="flex flex-col space-y-3 sm:space-y-0 sm:flex-row sm:justify-between sm:items-center gap-3 sm:gap-4 px-2 sm:px-0">
          <h2 className="text-lg sm:text-xl lg:text-2xl font-bold">Mes Publications</h2>
          <Button
            onClick={() => console.log('Nouvelle publication')}
            className="flex items-center gap-2 w-full sm:w-auto py-3 sm:py-2 text-base sm:text-sm touch-manipulation"
            style={{ minHeight: '44px' }}
          >
            <Plus className="h-4 w-4" />
            Nouvelle publication
          </Button>
        </div>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="overflow-x-auto pb-2">
          <TabsList className="grid grid-cols-6 w-max sm:w-full min-w-full gap-1">
            <TabsTrigger value="all" className="flex items-center gap-1 text-xs sm:text-sm whitespace-nowrap px-2 sm:px-3 py-2">
              <span>Tout</span>
              <span className="hidden sm:inline">({mockPublications.length})</span>
            </TabsTrigger>
            <TabsTrigger value="photo" className="flex items-center gap-1 text-xs sm:text-sm whitespace-nowrap px-2 sm:px-3 py-2">
              <Image className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline">Photos</span>
              <span className="sm:hidden">P</span>
              <span className="hidden sm:inline">({getTabCount('photo')})</span>
            </TabsTrigger>
            <TabsTrigger value="video" className="flex items-center gap-1 text-xs sm:text-sm whitespace-nowrap px-2 sm:px-3 py-2">
              <Video className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline">Vidéos</span>
              <span className="sm:hidden">V</span>
              <span className="hidden sm:inline">({getTabCount('video')})</span>
            </TabsTrigger>
            <TabsTrigger value="music" className="flex items-center gap-1 text-xs sm:text-sm whitespace-nowrap px-2 sm:px-3 py-2">
              <Music className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline">Musique</span>
              <span className="sm:hidden">M</span>
              <span className="hidden sm:inline">({getTabCount('music')})</span>
            </TabsTrigger>
            <TabsTrigger value="series" className="flex items-center gap-1 text-xs sm:text-sm whitespace-nowrap px-2 sm:px-3 py-2">
              <Tv className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline">Séries</span>
              <span className="sm:hidden">S</span>
              <span className="hidden sm:inline">({getTabCount('series')})</span>
            </TabsTrigger>
            <TabsTrigger value="announcement" className="flex items-center gap-1 text-xs sm:text-sm whitespace-nowrap px-2 sm:px-3 py-2">
              <Megaphone className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline">Annonces</span>
              <span className="sm:hidden">A</span>
              <span className="hidden sm:inline">({getTabCount('announcement')})</span>
            </TabsTrigger>
          </TabsList>
        </div>

        {(['all', 'photo', 'video', 'music', 'series', 'announcement'] as const).map((contentType) => (
          <TabsContent key={contentType} value={contentType} className="space-y-3 sm:space-y-4">
            {filterPublications(contentType).length > 0 ? (
              <div className="space-y-3 sm:space-y-4">
                {filterPublications(contentType).map((publication) => (
                  <div key={publication.id} className="bg-white rounded-lg border p-4 shadow-sm">
                    <h3 className="font-semibold text-lg mb-2">{publication.title}</h3>
                    <p className="text-gray-600 mb-3">{publication.description}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span>❤️ {publication.likes_count}</span>
                      <span>👁️ {publication.views_count}</span>
                      <span>💬 {publication.comments_count}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 sm:py-8 lg:py-12 px-3 sm:px-4">
                <p className="text-gray-500 mb-3 sm:mb-4 text-sm sm:text-base">
                  {contentType === 'all' ? 'Aucune publication' : `Aucune ${contentType === 'photo' ? 'photo' : contentType === 'video' ? 'vidéo' : contentType === 'music' ? 'musique' : contentType === 'series' ? 'série' : 'annonce'}`}
                </p>
                {isOwnProfile && (
                  <Button
                    onClick={() => console.log('Créer publication')}
                    variant="outline"
                    className="flex items-center gap-2 mx-auto py-3 text-base touch-manipulation"
                    style={{ minHeight: '44px' }}
                  >
                    <Plus className="h-4 w-4" />
                    Créer votre première publication
                  </Button>
                )}
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default UserPublications;
