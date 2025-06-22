
// Utilitaire simplifié pour gérer les redirections mobiles
export const handleMobileRedirect = (url: string, fallbackText?: string) => {
  console.log('=== MOBILE REDIRECT SIMPLE ===');
  console.log('URL:', url);
  
  // Vérifier si l'URL est valide
  if (!url || typeof url !== 'string') {
    console.error('URL invalide:', url);
    return false;
  }
  
  try {
    // Redirection directe et simple - fonctionne sur tous les appareils
    console.log('Redirection directe vers:', url);
    window.location.href = url;
    return true;
    
  } catch (error) {
    console.error('Erreur de redirection:', error);
    
    // Dernier recours
    if (fallbackText) {
      alert(`${fallbackText}\n\nVeuillez visiter: ${url}`);
    }
    return false;
  }
};

export const handleMobileLogout = () => {
  console.log('Déconnexion - redirection vers accueil');
  window.location.href = '/';
};
