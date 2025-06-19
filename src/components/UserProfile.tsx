
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MessageCircle, Phone, Video, User, MapPin, Briefcase, Calendar, FileText } from 'lucide-react';
import MessagingInterface from './MessagingInterface';
import UserPublications from './UserPublications';

interface UserProfileProps {
  user: {
    id: string;
    name: string;
    profession?: string;
    location: string;
    joinDate: string;
    bio: string;
    avatar?: string;
  };
  onClose?: () => void;
}

const UserProfile = ({ user, onClose }: UserProfileProps) => {
  const [showMessaging, setShowMessaging] = useState(false);
  const [activeTab, setActiveTab] = useState('about');

  if (showMessaging) {
    return (
      <MessagingInterface 
        userName={user.name} 
        userId={user.id}
        onClose={() => setShowMessaging(false)} 
      />
    );
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
              {user.avatar ? (
                <img src={user.avatar} alt={user.name} className="w-16 h-16 rounded-full object-cover" />
              ) : (
                <User className="h-8 w-8 text-gray-500" />
              )}
            </div>
            <div>
              <CardTitle className="text-2xl">{user.name}</CardTitle>
              {user.profession && (
                <Badge variant="outline" className="mt-1">
                  <Briefcase className="h-3 w-3 mr-1" />
                  {user.profession}
                </Badge>
              )}
            </div>
          </div>
          {onClose && (
            <Button size="sm" variant="outline" onClick={onClose}>
              ✕
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-3 w-full">
            <TabsTrigger value="about" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              À propos
            </TabsTrigger>
            <TabsTrigger value="publications" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Publications
            </TabsTrigger>
            <TabsTrigger value="contact" className="flex items-center gap-2">
              <MessageCircle className="h-4 w-4" />
              Contact
            </TabsTrigger>
          </TabsList>

          <TabsContent value="about" className="space-y-6">
            {/* Informations de base */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-gray-600">
                <MapPin className="h-4 w-4" />
                <span>{user.location}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <Calendar className="h-4 w-4" />
                <span>Membre depuis {user.joinDate}</span>
              </div>
            </div>

            {/* Bio */}
            <div>
              <h3 className="font-semibold mb-2">À propos</h3>
              <p className="text-gray-600 leading-relaxed">{user.bio}</p>
            </div>

            {/* Statistiques */}
            <div className="grid grid-cols-3 gap-4 pt-4 border-t">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">24</div>
                <div className="text-sm text-gray-600">Connexions</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">12</div>
                <div className="text-sm text-gray-600">Publications</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">8</div>
                <div className="text-sm text-gray-600">Projets</div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="publications">
            <UserPublications userId={user.id} isOwnProfile={false} />
          </TabsContent>

          <TabsContent value="contact" className="space-y-4">
            {/* Options de communication */}
            <div>
              <h3 className="font-semibold mb-3">Communication</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <Button
                  onClick={() => setShowMessaging(true)}
                  className="flex items-center gap-2 bg-gray-900 hover:bg-gray-800"
                >
                  <MessageCircle className="h-4 w-4" />
                  Message texte
                </Button>
                <Button
                  variant="outline"
                  onClick={() => console.log('Appel audio avec', user.name)}
                  className="flex items-center gap-2"
                >
                  <Phone className="h-4 w-4" />
                  Appel vocal
                </Button>
                <Button
                  variant="outline"
                  onClick={() => console.log('Appel vidéo avec', user.name)}
                  className="flex items-center gap-2"
                >
                  <Video className="h-4 w-4" />
                  Appel vidéo
                </Button>
              </div>
              <p className="text-sm text-gray-500 mt-2 text-center">
                Toutes les communications sont sécurisées et privées
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default UserProfile;
