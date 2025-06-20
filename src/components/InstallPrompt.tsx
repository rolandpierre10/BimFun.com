
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { X, Download } from 'lucide-react';

const InstallPrompt = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowPrompt(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      console.log(`User response to the install prompt: ${outcome}`);
      setDeferredPrompt(null);
      setShowPrompt(false);
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
  };

  if (!showPrompt) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 bg-white border border-gray-200 rounded-lg shadow-lg p-4 z-50 md:left-auto md:right-4 md:max-w-sm">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center mb-2">
            <Download className="h-5 w-5 text-blue-600 mr-2" />
            <h3 className="font-semibold text-gray-900">Installer BimFun</h3>
          </div>
          <p className="text-sm text-gray-600 mb-3">
            Installez l'app pour un accès rapide et une meilleure expérience !
          </p>
          <div className="flex gap-2">
            <Button 
              onClick={handleInstallClick}
              size="sm"
              className="bg-blue-600 hover:bg-blue-700"
            >
              Installer
            </Button>
            <Button 
              onClick={handleDismiss}
              variant="outline"
              size="sm"
            >
              Plus tard
            </Button>
          </div>
        </div>
        <Button
          onClick={handleDismiss}
          variant="ghost"
          size="sm"
          className="ml-2 p-1"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default InstallPrompt;
