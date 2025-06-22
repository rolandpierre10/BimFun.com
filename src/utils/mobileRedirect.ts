
// Utilitaire pour gérer les redirections mobiles de manière fiable
export const handleMobileRedirect = (url: string, fallbackText?: string) => {
  console.log('Attempting mobile redirect to:', url);
  
  // Méthode 1: Redirection directe
  try {
    window.location.href = url;
    return;
  } catch (error) {
    console.warn('Direct redirect failed:', error);
  }
  
  // Méthode 2: Fallback avec création d'un lien temporaire
  try {
    const link = document.createElement('a');
    link.href = url;
    link.target = '_self';
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    return;
  } catch (error) {
    console.warn('Link click redirect failed:', error);
  }
  
  // Méthode 3: Dernière tentative avec window.open en même onglet
  try {
    window.open(url, '_self');
    return;
  } catch (error) {
    console.error('All redirect methods failed:', error);
    
    // Afficher un message à l'utilisateur avec le lien
    if (fallbackText) {
      alert(`${fallbackText}\n\nVeuillez cliquer sur ce lien: ${url}`);
    }
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
