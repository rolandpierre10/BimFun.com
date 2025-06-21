
import React from 'react';
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Share2, Mail, MessageSquare, Facebook, Twitter, Linkedin, Instagram, Phone } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ShareMenuProps {
  title: string;
  description?: string;
  url: string;
}

const ShareMenu = ({ title, description, url }: ShareMenuProps) => {
  const { toast } = useToast();

  const shareViaEmail = () => {
    const subject = encodeURIComponent(`Découvrez: ${title}`);
    const body = encodeURIComponent(
      `Je pensais que cela pourrait vous intéresser:\n\n${title}\n${description || ''}\n\n${url}`
    );
    window.open(`mailto:?subject=${subject}&body=${body}`, '_blank');
    
    toast({
      title: "Email ouvert",
      description: "Votre client email s'est ouvert pour partager la publication",
    });
  };

  const shareViaSMS = () => {
    const message = encodeURIComponent(`Découvrez: ${title} - ${url}`);
    window.open(`sms:?body=${message}`, '_blank');
    
    toast({
      title: "SMS ouvert",
      description: "Votre application SMS s'est ouverte pour partager la publication",
    });
  };

  const shareViaWhatsApp = () => {
    const message = encodeURIComponent(`Découvrez: ${title}\n${description || ''}\n\n${url}`);
    window.open(`https://wa.me/?text=${message}`, '_blank');
    
    toast({
      title: "WhatsApp ouvert",
      description: "WhatsApp s'est ouvert pour partager la publication",
    });
  };

  const shareOnFacebook = () => {
    const shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
    window.open(shareUrl, '_blank', 'width=600,height=400');
    
    toast({
      title: "Partagé sur Facebook",
      description: "La publication a été partagée sur Facebook",
    });
  };

  const shareOnTwitter = () => {
    const text = encodeURIComponent(`${title} - ${description || ''}`);
    const shareUrl = `https://twitter.com/intent/tweet?text=${text}&url=${encodeURIComponent(url)}`;
    window.open(shareUrl, '_blank', 'width=600,height=400');
    
    toast({
      title: "Partagé sur Twitter",
      description: "La publication a été partagée sur Twitter",
    });
  };

  const shareOnLinkedIn = () => {
    const shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
    window.open(shareUrl, '_blank', 'width=600,height=400');
    
    toast({
      title: "Partagé sur LinkedIn",
      description: "La publication a été partagée sur LinkedIn",
    });
  };

  const shareOnInstagram = () => {
    // Instagram ne permet pas le partage direct via URL, on copie le lien
    navigator.clipboard.writeText(url).then(() => {
      toast({
        title: "Lien copié pour Instagram",
        description: "Collez le lien dans votre story ou post Instagram",
      });
    });
  };

  const copyLink = () => {
    navigator.clipboard.writeText(url).then(() => {
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

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="flex items-center gap-2 text-gray-600 hover:text-green-600"
        >
          <Share2 className="h-4 w-4" />
          <span>Partager</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-3" align="start">
        <div className="space-y-2">
          <h4 className="font-medium text-sm text-gray-900 mb-3">Partager cette publication</h4>
          
          <div className="grid grid-cols-2 gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={shareViaEmail}
              className="flex items-center gap-2 justify-start"
            >
              <Mail className="h-4 w-4" />
              Email
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={shareViaSMS}
              className="flex items-center gap-2 justify-start"
            >
              <MessageSquare className="h-4 w-4" />
              SMS
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={shareViaWhatsApp}
              className="flex items-center gap-2 justify-start text-green-600 hover:text-green-700"
            >
              <Phone className="h-4 w-4" />
              WhatsApp
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={shareOnFacebook}
              className="flex items-center gap-2 justify-start text-blue-600 hover:text-blue-700"
            >
              <Facebook className="h-4 w-4" />
              Facebook
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={shareOnTwitter}
              className="flex items-center gap-2 justify-start text-blue-400 hover:text-blue-500"
            >
              <Twitter className="h-4 w-4" />
              Twitter
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={shareOnLinkedIn}
              className="flex items-center gap-2 justify-start text-blue-700 hover:text-blue-800"
            >
              <Linkedin className="h-4 w-4" />
              LinkedIn
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={shareOnInstagram}
              className="flex items-center gap-2 justify-start text-pink-600 hover:text-pink-700"
            >
              <Instagram className="h-4 w-4" />
              Instagram
            </Button>
          </div>
          
          <div className="pt-2 border-t">
            <Button
              variant="secondary"
              size="sm"
              onClick={copyLink}
              className="w-full flex items-center gap-2 justify-center"
            >
              <Share2 className="h-4 w-4" />
              Copier le lien
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default ShareMenu;
