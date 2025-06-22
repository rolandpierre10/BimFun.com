
// Utilitaire pour gérer les redirections mobiles de manière fiable
export const handleMobileRedirect = (url: string, fallbackText?: string) => {
  console.log('=== MOBILE REDIRECT DEBUG ===');
  console.log('URL to redirect to:', url);
  console.log('User agent:', navigator.userAgent);
  console.log('Platform:', navigator.platform);
  
  // Vérifier si l'URL est valide
  if (!url || typeof url !== 'string') {
    console.error('Invalid URL provided:', url);
    return false;
  }
  
  try {
    // Détecter si on est sur mobile
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    console.log('Is mobile device:', isMobile);
    
    if (isMobile) {
      // Sur mobile, utiliser directement window.location.href
      console.log('Mobile redirect: Using window.location.href');
      window.location.href = url;
      return true;
    } else {
      // Sur desktop, essayer d'ouvrir dans un nouvel onglet
      console.log('Desktop redirect: Opening in new tab');
      const newWindow = window.open(url, '_blank');
      if (newWindow) {
        newWindow.focus();
        return true;
      } else {
        // Fallback sur desktop si popup bloqué
        console.log('Popup blocked, using direct redirect');
        window.location.href = url;
        return true;
      }
    }
    
  } catch (error) {
    console.error('Redirect failed:', error);
    
    // Dernier recours: redirection directe
    try {
      window.location.href = url;
      return true;
    } catch (finalError) {
      console.error('Final redirect attempt failed:', finalError);
      
      // Afficher un message à l'utilisateur avec le lien
      if (fallbackText) {
        alert(`${fallbackText}\n\nRedirection automatique échouée. Veuillez visiter: ${url}`);
      } else {
        alert(`Redirection automatique échouée. Veuillez visiter: ${url}`);
      }
      return false;
    }
  }
};

export const handleMobileLogout = () => {
  console.log('Handling mobile logout redirect');
  
  // Pour la déconnexion, redirection simple vers la page d'accueil
  window.location.href = '/';
};
