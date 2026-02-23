export interface FavoritePiece {
  id: string;
  categoria: string;
  subcategoria: string;
  descricao: string;
  timestamp: number;
}

export interface FavoriteTutorial {
  id: string;
  title: string;
  category: string;
  subcategory?: string;
  duration: string;
  thumbnail: string;
  timestamp: number;
}

export interface FavoritesData {
  pieces: FavoritePiece[];
  tutorials: FavoriteTutorial[];
}

const FAVORITES_KEY = 'bartz_favorites';

// Get complete favorites data with error handling
export function getFavorites(): FavoritesData {
  try {
    if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
      return { pieces: [], tutorials: [] };
    }

    const stored = localStorage.getItem(FAVORITES_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      return {
        pieces: Array.isArray(parsed.pieces) ? parsed.pieces : [],
        tutorials: Array.isArray(parsed.tutorials) ? parsed.tutorials : []
      };
    }
  } catch (error) {
    console.warn('Error reading favorites from localStorage:', error);
  }
  
  return { pieces: [], tutorials: [] };
}

// Save complete favorites data with error handling
function saveFavorites(favorites: FavoritesData): void {
  try {
    if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
      return;
    }
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
  } catch (error) {
    console.warn('Error saving favorites to localStorage:', error);
  }
}

// Add piece to favorites
export function addPieceToFavorites(item: Omit<FavoritePiece, 'timestamp'>): void {
  try {
    const favorites = getFavorites();
    const timestamp = Date.now();
    
    // Remove existing item with same id if exists
    favorites.pieces = favorites.pieces.filter(f => f.id !== item.id);
    
    // Add new item at the beginning
    favorites.pieces.unshift({
      ...item,
      timestamp
    });
    
    saveFavorites(favorites);
    
    // Dispatch event for UI updates
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent("favoritesUpdated"));
    }
  } catch (error) {
    console.warn('Error adding piece to favorites:', error);
  }
}

// Remove piece from favorites
export function removePieceFromFavorites(id: string): void {
  try {
    const favorites = getFavorites();
    favorites.pieces = favorites.pieces.filter(f => f.id !== id);
    saveFavorites(favorites);
    
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent("favoritesUpdated"));
    }
  } catch (error) {
    console.warn('Error removing piece from favorites:', error);
  }
}

// Check if piece is favorited
export function isPieceFavorited(id: string): boolean {
  try {
    const favorites = getFavorites();
    return favorites.pieces.some(f => f.id === id);
  } catch (error) {
    console.warn('Error checking if piece is favorited:', error);
    return false;
  }
}

// Add tutorial to favorites
export function addTutorialToFavorites(item: Omit<FavoriteTutorial, 'timestamp'>): void {
  try {
    const favorites = getFavorites();
    const timestamp = Date.now();
    
    // Remove existing item with same id if exists
    favorites.tutorials = favorites.tutorials.filter(f => f.id !== item.id);
    
    // Add new item at the beginning
    favorites.tutorials.unshift({
      ...item,
      timestamp
    });
    
    saveFavorites(favorites);
    
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent("favoritesUpdated"));
    }
  } catch (error) {
    console.warn('Error adding tutorial to favorites:', error);
  }
}

// Remove tutorial from favorites
export function removeTutorialFromFavorites(id: string): void {
  try {
    const favorites = getFavorites();
    favorites.tutorials = favorites.tutorials.filter(f => f.id !== id);
    saveFavorites(favorites);
    
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent("favoritesUpdated"));
    }
  } catch (error) {
    console.warn('Error removing tutorial from favorites:', error);
  }
}

// Check if tutorial is favorited
export function isTutorialFavorited(id: string): boolean {
  try {
    const favorites = getFavorites();
    return favorites.tutorials.some(f => f.id === id);
  } catch (error) {
    console.warn('Error checking if tutorial is favorited:', error);
    return false;
  }
}

// Get pieces favorites only
export function getFavoritePieces(): FavoritePiece[] {
  try {
    return getFavorites().pieces;
  } catch (error) {
    console.warn('Error getting favorite pieces:', error);
    return [];
  }
}

// Get tutorials favorites only
export function getFavoriteTutorials(): FavoriteTutorial[] {
  try {
    return getFavorites().tutorials;
  } catch (error) {
    console.warn('Error getting favorite tutorials:', error);
    return [];
  }
}

// Clear all favorites
export function clearAllFavorites(): void {
  try {
    if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
      return;
    }
    localStorage.removeItem(FAVORITES_KEY);
    window.dispatchEvent(new CustomEvent("favoritesUpdated"));
  } catch (error) {
    console.warn('Error clearing favorites from localStorage:', error);
  }
}

// Clear only pieces favorites
export function clearPiecesFavorites(): void {
  try {
    const favorites = getFavorites();
    favorites.pieces = [];
    saveFavorites(favorites);
    
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent("favoritesUpdated"));
    }
  } catch (error) {
    console.warn('Error clearing pieces favorites:', error);
  }
}

// Clear only tutorials favorites
export function clearTutorialsFavorites(): void {
  try {
    const favorites = getFavorites();
    favorites.tutorials = [];
    saveFavorites(favorites);
    
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent("favoritesUpdated"));
    }
  } catch (error) {
    console.warn('Error clearing tutorials favorites:', error);
  }
}

// Get favorites count for UI badges
export function getFavoritesCount(): { pieces: number; tutorials: number; total: number } {
  try {
    const favorites = getFavorites();
    return {
      pieces: favorites.pieces.length,
      tutorials: favorites.tutorials.length,
      total: favorites.pieces.length + favorites.tutorials.length
    };
  } catch (error) {
    console.warn('Error getting favorites count:', error);
    return { pieces: 0, tutorials: 0, total: 0 };
  }
}

// Toggle piece favorite status
export function togglePieceFavorite(piece: Omit<FavoritePiece, 'timestamp'>): boolean {
  try {
    const isFavorited = isPieceFavorited(piece.id);
    
    if (isFavorited) {
      removePieceFromFavorites(piece.id);
      return false;
    } else {
      addPieceToFavorites(piece);
      return true;
    }
  } catch (error) {
    console.warn('Error toggling piece favorite:', error);
    return false;
  }
}

// Toggle tutorial favorite status
export function toggleTutorialFavorite(tutorial: Omit<FavoriteTutorial, 'timestamp'>): boolean {
  try {
    const isFavorited = isTutorialFavorited(tutorial.id);
    
    if (isFavorited) {
      removeTutorialFromFavorites(tutorial.id);
      return false;
    } else {
      addTutorialToFavorites(tutorial);
      return true;
    }
  } catch (error) {
    console.warn('Error toggling tutorial favorite:', error);
    return false;
  }
}

// Export aliases for backward compatibility (matching the import names in PieceDetails)
export const addToFavorites = addPieceToFavorites;
export const removeFromFavorites = removePieceFromFavorites;
export const isFavorite = isPieceFavorited;
