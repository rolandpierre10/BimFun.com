
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Image, Search } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface GifPickerProps {
  onGifSelect: (gifUrl: string) => void;
}

const GifPicker = ({ onGifSelect }: GifPickerProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [gifs, setGifs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // GIFs populaires par défaut
  const trendingGifs = [
    'https://media.giphy.com/media/3o7abKhOpu0NwenH3O/giphy.gif',
    'https://media.giphy.com/media/l0HlBO7eyXzSZkJri/giphy.gif',
    'https://media.giphy.com/media/26BRrSvJUa0crqw4E/giphy.gif',
    'https://media.giphy.com/media/3o6Zt481isNVuQI1l6/giphy.gif',
    'https://media.giphy.com/media/l0MYt5jPR6QX5pnqM/giphy.gif',
    'https://media.giphy.com/media/26BRBKqUiq586bRVm/giphy.gif'
  ];

  const searchGifs = async () => {
    if (!searchTerm.trim()) {
      setGifs(trendingGifs.map(url => ({ images: { downsized: { url } } })));
      return;
    }

    setIsLoading(true);
    try {
      // Utilisation d'une API publique pour les GIFs (remplacez par votre clé API Giphy si disponible)
      const response = await fetch(
        `https://api.giphy.com/v1/gifs/search?api_key=GlVGYHkr3WSBnllca54iNt0yFbjz7L65&q=${encodeURIComponent(searchTerm)}&limit=12`
      );
      const data = await response.json();
      setGifs(data.data || []);
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de charger les GIFs",
        variant: "destructive",
      });
      setGifs(trendingGifs.map(url => ({ images: { downsized: { url } } })));
    } finally {
      setIsLoading(false);
    }
  };

  const handleGifSelect = (gifUrl: string) => {
    onGifSelect(gifUrl);
    setIsOpen(false);
  };

  React.useEffect(() => {
    if (isOpen) {
      searchGifs();
    }
  }, [isOpen, searchTerm]);

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
          <Image className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-4" align="start">
        <div className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="Rechercher un GIF..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && searchGifs()}
            />
            <Button size="sm" onClick={searchGifs} disabled={isLoading}>
              <Search className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="grid grid-cols-3 gap-2 max-h-60 overflow-y-auto">
            {isLoading ? (
              <div className="col-span-3 text-center py-4">
                Chargement...
              </div>
            ) : (
              gifs.map((gif, index) => (
                <img
                  key={index}
                  src={gif.images?.downsized?.url || gif}
                  alt="GIF"
                  className="w-full h-16 object-cover rounded cursor-pointer hover:opacity-80"
                  onClick={() => handleGifSelect(gif.images?.downsized?.url || gif)}
                />
              ))
            )}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default GifPicker;
