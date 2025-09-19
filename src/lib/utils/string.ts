// Fonction utilitaire pour le formatage en Title Case
export const toTitleCase = (str: string): string => {
  if (!str) return '';
  return str.toLowerCase().split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};
