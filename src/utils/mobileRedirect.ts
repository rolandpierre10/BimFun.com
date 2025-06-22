
// Utilitaire simplifié pour gérer les redirections mobiles
export const handleMobileRedirect = (url: string, fallbackText?: string) => {
  console.log('=== MOBILE REDIRECT ===');
  console.log('URL:', url);
  console.log('User agent:', navigator.userAgent);
  
  // Vérifier si l'URL est valide
  if (!url || typeof url !== 'string') {
    console.error('URL invalide:', url);
    return false;
  }
  
  try {
    // Sur mobile, toujours utiliser window.location.href
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    if (isMobile) {
      console.log('Mobile détecté - Redirection directe');
      window.location.href = url;
    } else {
      console.log('Desktop détecté - Tentative nouvel onglet');
      const newWindow = window.open(url, '_blank');
      if (!newWindow) {
        console.log('Popup bloqué - Redirection directe');
        window.location.href = url;
      }
    }
    
    return true;
    
  } catch (error) {
    console.error('Erreur de redirection:', error);
    
    // Dernier recours
    try {
      window.location.href = url;
      return true;
    } catch (finalError) {
      console.error('Échec final de redirection:', finalError);
      if (fallbackText) {
        alert(`${fallbackText}\n\nVeuillez visiter: ${url}`);
      }
      return false;
    }
  }
};

export const handleMobileLogout = () => {
  console.log('Déconnexion - redirection vers accueil');
  window.location.href = '/';
};
