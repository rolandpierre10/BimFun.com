
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Download, Share2, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import ShareMenu from './ShareMenu';

interface ClickableImageProps {
  src: string;
  alt: string;
  className?: string;
  title?: string;
  description?: string;
}

const ClickableImage = ({ src, alt, className = "", title, description }: ClickableImageProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();

  const handleDownload = async () => {
    try {
      const response = await fetch(src);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = alt || 'image';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      toast({
        title: "Téléchargement commencé",
        description: "L'image est en cours de téléchargement",
      });
    } catch (error) {
      toast({
        title: "Erreur de téléchargement",
        description: "Impossible de télécharger l'image",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <img 
          src={src} 
          alt={alt}
          className={`cursor-pointer hover:opacity-90 transition-opacity ${className}`}
          onClick={() => setIsOpen(true)}
        />
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] p-0">
        <div className="relative">
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2 z-10 bg-black/50 hover:bg-black/70 text-white"
            onClick={() => setIsOpen(false)}
          >
            <X className="h-4 w-4" />
          </Button>
          
          <img 
            src={src} 
            alt={alt}
            className="w-full h-auto max-h-[80vh] object-contain"
          />
          
          <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white p-4">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                {title && <h3 className="font-semibold">{title}</h3>}
                {description && <p className="text-sm opacity-90">{description}</p>}
              </div>
              
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleDownload}
                  className="text-white hover:bg-white/20"
                >
                  <Download className="h-4 w-4" />
                </Button>
                
                <ShareMenu
                  title={title || alt}
                  description={description}
                  url={window.location.href}
                  imageUrl={src}
                />
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ClickableImage;
