
// Utilitaire pour gérer les redirections mobiles de manière fiable
export const handleMobileRedirect = (url: string, fallbackText?: string) => {
  console.log('=== MOBILE REDIRECT DEBUG ===');
  console.log('URL to redirect to:', url);
  console.log('User agent:', navigator.userAgent);
  console.log('Attempting redirection...');
  
  // Vérifier si l'URL est valide
  if (!url || typeof url !== 'string') {
    console.error('Invalid URL provided:', url);
    return false;
  }
  
  try {
    // Méthode principale: redirection directe
    console.log('Method 1: Direct window.location.href');
    window.location.href = url;
    
    // Si on arrive ici, c'est que la redirection a échoué
    console.log('Direct redirect may have failed, trying alternative methods...');
    
    // Attendre un peu puis essayer window.open
    setTimeout(() => {
      console.log('Method 2: window.open in same tab');
      try {
        const newWindow = window.open(url, '_self');
        if (!newWindow) {
          console.warn('window.open returned null, trying fallback');
          // Fallback: créer un lien et le cliquer
          const link = document.createElement('a');
          link.href = url;
          link.target = '_self';
          link.style.display = 'none';
          document.body.appendChild(link);
          console.log('Method 3: Creating temporary link');
          link.click();
          document.body.removeChild(link);
        }
      } catch (error) {
        console.error('Alternative redirect methods failed:', error);
        // Dernier recours: afficher l'URL à l'utilisateur
        alert(`Redirection automatique échouée. Veuillez visiter: ${url}`);
      }
    }, 100);
    
    return true;
    
  } catch (error) {
    console.error('All redirect methods failed:', error);
    
    // Afficher un message à l'utilisateur avec le lien
    if (fallbackText) {
      alert(`${fallbackText}\n\nRedirection automatique échouée. Veuillez visiter: ${url}`);
    } else {
      alert(`Redirection automatique échouée. Veuillez visiter: ${url}`);
    }
    return false;
  }
};

export const handleMobileLogout = () => {
  console.log('Handling mobile logout redirect');
  
  // Pour la déconnexion, on utilise plusieurs tentatives
  try {
    // Première tentative: replace
    window.location.replace('/');
  } catch (error) {
    console.warn('Replace failed, trying assign:', error);
    try {
      window.location.assign('/');
    } catch (error2) {
      console.warn('Assign failed, trying href:', error2);
      window.location.href = '/';
    }
  }
};
