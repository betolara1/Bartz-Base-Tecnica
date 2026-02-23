export interface HistoryItem {
  id: string;
  categoria: string;
  subcategoria: string;
  descricao: string;
  timestamp: number;
}

export interface TutorialHistoryItem {
  id: string;
  title: string;
  category: string;
  subcategory?: string;
  duration: string;
  timestamp: number;
}

export interface HistoryData {
  pieces: HistoryItem[];
  tutorials: TutorialHistoryItem[];
}

const HISTORY_KEY = 'bartz_history';
const MAX_HISTORY_ITEMS = 10;

// Get complete history data with error handling
export function getHistory(): HistoryData {
  try {
    if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
      return { pieces: [], tutorials: [] };
    }

    const stored = localStorage.getItem(HISTORY_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      return {
        pieces: Array.isArray(parsed.pieces) ? parsed.pieces : [],
        tutorials: Array.isArray(parsed.tutorials) ? parsed.tutorials : []
      };
    }
  } catch (error) {
    console.warn('Error reading history from localStorage:', error);
  }
  
  return { pieces: [], tutorials: [] };
}

// Save complete history data
function saveHistory(history: HistoryData): void {
  try {
    if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
      return;
    }
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
  } catch (error) {
    console.warn('Error saving history to localStorage:', error);
  }
}

// Add piece to history
export function addToHistory(item: Omit<HistoryItem, 'timestamp'>): void {
  try {
    const history = getHistory();
    const timestamp = Date.now();
    
    // Remove existing item with same id if exists
    history.pieces = history.pieces.filter(h => h.id !== item.id);
    
    // Add new item at the beginning
    history.pieces.unshift({
      ...item,
      timestamp
    });
    
    // Keep only the last MAX_HISTORY_ITEMS
    history.pieces = history.pieces.slice(0, MAX_HISTORY_ITEMS);
    
    saveHistory(history);
  } catch (error) {
    console.warn('Error adding to history:', error);
  }
}

// Add tutorial to history
export function addTutorialToHistory(item: Omit<TutorialHistoryItem, 'timestamp'>): void {
  try {
    const history = getHistory();
    const timestamp = Date.now();
    
    // Remove existing item with same id if exists
    history.tutorials = history.tutorials.filter(h => h.id !== item.id);
    
    // Add new item at the beginning
    history.tutorials.unshift({
      ...item,
      timestamp
    });
    
    // Keep only the last MAX_HISTORY_ITEMS
    history.tutorials = history.tutorials.slice(0, MAX_HISTORY_ITEMS);
    
    saveHistory(history);
  } catch (error) {
    console.warn('Error adding tutorial to history:', error);
  }
}

// Get pieces history only
export function getPiecesHistory(): HistoryItem[] {
  try {
    return getHistory().pieces;
  } catch (error) {
    console.warn('Error getting pieces history:', error);
    return [];
  }
}

// Get tutorials history only
export function getTutorialsHistory(): TutorialHistoryItem[] {
  try {
    return getHistory().tutorials;
  } catch (error) {
    console.warn('Error getting tutorials history:', error);
    return [];
  }
}

// Clear all history
export function clearHistory(): void {
  try {
    if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
      return;
    }
    localStorage.removeItem(HISTORY_KEY);
  } catch (error) {
    console.warn('Error clearing history from localStorage:', error);
  }
}

// Clear only pieces history
export function clearPiecesHistory(): void {
  try {
    const history = getHistory();
    history.pieces = [];
    saveHistory(history);
  } catch (error) {
    console.warn('Error clearing pieces history:', error);
  }
}

// Clear only tutorials history
export function clearTutorialsHistory(): void {
  try {
    const history = getHistory();
    history.tutorials = [];
    saveHistory(history);
  } catch (error) {
    console.warn('Error clearing tutorials history:', error);
  }
}

// Get recent search terms - general search history
const SEARCH_HISTORY_KEY = 'bartz_search_history';
const MAX_SEARCH_ITEMS = 5;

export function getSearchHistory(): string[] {
  try {
    if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
      return [];
    }
    
    const stored = localStorage.getItem(SEARCH_HISTORY_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.warn('Error reading search history:', error);
    return [];
  }
}

export function addSearchToHistory(query: string): void {
  if (!query.trim()) return;
  
  try {
    if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
      return;
    }
    
    const searches = getSearchHistory();
    
    // Remove existing query if exists
    const filtered = searches.filter(s => s !== query);
    
    // Add new query at the beginning
    filtered.unshift(query);
    
    // Keep only the last MAX_SEARCH_ITEMS
    const updated = filtered.slice(0, MAX_SEARCH_ITEMS);
    
    localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(updated));
  } catch (error) {
    console.warn('Error saving search:', error);
  }
}

export function clearSearchHistory(): void {
  try {
    if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
      return;
    }
    localStorage.removeItem(SEARCH_HISTORY_KEY);
  } catch (error) {
    console.warn('Error clearing search history:', error);
  }
}

// Get recent search terms for tutorials
const TUTORIAL_SEARCHES_KEY = 'bartz_tutorial_searches';

export function getTutorialSearchHistory(): string[] {
  try {
    if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
      return [];
    }
    
    const stored = localStorage.getItem(TUTORIAL_SEARCHES_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.warn('Error reading tutorial search history:', error);
    return [];
  }
}

export function addTutorialSearch(query: string): void {
  if (!query.trim()) return;
  
  try {
    if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
      return;
    }
    
    const searches = getTutorialSearchHistory();
    
    // Remove existing query if exists
    const filtered = searches.filter(s => s !== query);
    
    // Add new query at the beginning
    filtered.unshift(query);
    
    // Keep only the last MAX_SEARCH_ITEMS
    const updated = filtered.slice(0, MAX_SEARCH_ITEMS);
    
    localStorage.setItem(TUTORIAL_SEARCHES_KEY, JSON.stringify(updated));
  } catch (error) {
    console.warn('Error saving tutorial search:', error);
  }
}

export function clearTutorialSearchHistory(): void {
  try {
    if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
      return;
    }
    localStorage.removeItem(TUTORIAL_SEARCHES_KEY);
  } catch (error) {
    console.warn('Error clearing tutorial search history:', error);
  }
}

// Format time ago for history display
export function formatTimeAgo(timestamp: number): string {
  try {
    const now = Date.now();
    const diff = now - timestamp;
    
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (minutes < 1) return 'agora há pouco';
    if (minutes < 60) return `${minutes}min atrás`;
    if (hours < 24) return `${hours}h atrás`;
    if (days < 7) return `${days}d atrás`;
    
    return new Date(timestamp).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit'
    });
  } catch (error) {
    console.warn('Error formatting time ago:', error);
    return 'data desconhecida';
  }
}
