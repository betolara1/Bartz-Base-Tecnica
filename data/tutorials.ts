import { getPieceVideos } from '../utils/videoMap';
import { getPieceImage } from '../utils/imageMap';

export interface TutorialStep {
  id: number;
  description: string;
  note?: string;
}

export interface TutorialData {
  id: string;
  title: string;
  description: string;
  duration: string;
  difficulty: "Básico" | "Intermediário" | "Avançado";
  category: string;
  subcategory?: string;
  videoUrl: string;
  thumbnail: string;
  steps: TutorialStep[];
  tags: string[];
  views: number;
  likes: number;
  dateAdded: string;
  lastUpdated: string;
  promobVersion?: string;
  relatedPieces?: string[];
}

export const tutorialsData: TutorialData[] = [];

// Utility functions for tutorials
export function getTutorialCategories(): string[] {
  const categories = Array.from(new Set(tutorialsData.map(t => t.category)));
  return categories.sort();
}

export function getTutorialSubcategories(category: string): string[] {
  const subcategories = tutorialsData
    .filter(t => t.category === category && t.subcategory)
    .map(t => t.subcategory!);
  return Array.from(new Set(subcategories)).sort();
}

export function getTutorialsByCategory(category?: string, subcategory?: string): TutorialData[] {
  let filtered = tutorialsData;

  if (category) {
    filtered = filtered.filter(t => t.category === category);
  }

  if (subcategory) {
    filtered = filtered.filter(t => t.subcategory === subcategory);
  }

  // Sort by views (popularity) by default
  return filtered.sort((a, b) => b.views - a.views);
}

export function searchTutorials(query: string): TutorialData[] {
  if (!query.trim()) return [];

  const normalizedQuery = query.toLowerCase().trim();

  return tutorialsData.filter(tutorial => {
    // Search in title, description, category, subcategory, and tags
    const searchableText = [
      tutorial.title,
      tutorial.description,
      tutorial.category,
      tutorial.subcategory || '',
      ...tutorial.tags,
      ...tutorial.steps.map(step => step.description)
    ].join(' ').toLowerCase();

    // Split query into words for better matching
    const queryWords = normalizedQuery.split(' ');

    // Check if all query words are found in searchable text
    return queryWords.every(word =>
      searchableText.includes(word)
    );
  }).sort((a, b) => {
    // Sort by relevance (title matches first, then description, then popularity)
    const aTitle = a.title.toLowerCase().includes(normalizedQuery);
    const bTitle = b.title.toLowerCase().includes(normalizedQuery);

    if (aTitle && !bTitle) return -1;
    if (!aTitle && bTitle) return 1;

    // If both or neither match title, sort by popularity
    return b.views - a.views;
  });
}

export function getTutorialById(id: string): TutorialData | undefined {
  return tutorialsData.find(t => t.id === id);
}

export function getPopularTutorials(limit: number = 5): TutorialData[] {
  return tutorialsData
    .sort((a, b) => b.views - a.views)
    .slice(0, limit);
}

export function getTutorialCategoryStats(): Record<string, number> {
  const stats: Record<string, number> = {};

  tutorialsData.forEach(tutorial => {
    stats[tutorial.category] = (stats[tutorial.category] || 0) + 1;
  });

  return stats;
}

export function getRelatedTutorials(tutorialId: string, limit: number = 3): TutorialData[] {
  const tutorial = getTutorialById(tutorialId);
  if (!tutorial) return [];

  // Find tutorials with matching category or tags
  const related = tutorialsData.filter(t => {
    if (t.id === tutorialId) return false;

    // Match by category
    if (t.category === tutorial.category) return true;

    // Match by shared tags
    const sharedTags = t.tags.filter(tag => tutorial.tags.includes(tag));
    return sharedTags.length > 0;
  });

  // Sort by relevance (same category first, then by popularity)
  return related
    .sort((a, b) => {
      if (a.category === tutorial.category && b.category !== tutorial.category) return -1;
      if (a.category !== tutorial.category && b.category === tutorial.category) return 1;
      return b.views - a.views;
    })
    .slice(0, limit);
}

export function getTutorialsForPiece(
  pieceId: string,
  pieceCategory: string,
  pieceSubcategory: string,
  pieceDescricao: string = '',
  limit: number = 4
): TutorialData[] {
  // Auto-generate GIF tutorials if video files exist for this piece
  const gifUrls = getPieceVideos(pieceId);
  const gifTutorials: TutorialData[] = gifUrls.map((gifUrl, idx) => {
    // Custom title for Geometria Livre
    let title = gifUrls.length > 1 && idx === 0
      ? `Guia de Uso do ${pieceDescricao || pieceSubcategory}`
      : `Apresentação do ${pieceDescricao || pieceSubcategory}`;

    if (pieceId === 'geometria-livre') {
      if (idx === 0) title = "Como usar corretamente a Geometria Livre";
      else if (idx === 2) title = "Como fazer curvas na Geometria Livre";
      else title = `Apresentação do ${pieceDescricao || pieceSubcategory}`;
    }

    return {
      id: `demogif-${pieceId}-${idx}`,
      title,
      description: idx === 0 && gifUrls.length > 1
        ? 'Vídeo instrucional ensinando como utilizar as funcionalidades técnicas deste item.'
        : 'Visão geral e tutorial do produto em ambiente de produção.',
      duration: 'GIF',
      difficulty: 'Básico',
      category: pieceCategory,
      subcategory: 'Tutorial',
      videoUrl: gifUrl,
      thumbnail: getPieceImage(pieceId) || gifUrl,
      steps: [],
      tags: ['tutorial', 'produto', 'gif'],
      views: 0,
      likes: 0,
      dateAdded: new Date().toISOString().split('T')[0],
      lastUpdated: new Date().toISOString().split('T')[0],
      relatedPieces: [pieceId]
    };
  });

  // Find tutorials that are specifically related to this piece
  const directlyRelated = tutorialsData.filter(t =>
    t.relatedPieces?.includes(pieceId)
  );

  // Find tutorials that match the piece's category/subcategory context
  const contextuallyRelated = tutorialsData.filter(t => {
    if (t.relatedPieces?.includes(pieceId)) return false; // Already included above

    // Match by piece category to tutorial category/tags
    const categoryMatches = t.category.toLowerCase().includes(pieceCategory.toLowerCase()) ||
      t.tags.some(tag => tag.toLowerCase().includes(pieceCategory.toLowerCase())) ||
      t.subcategory?.toLowerCase().includes(pieceSubcategory.toLowerCase());

    // Special matching logic based on piece types and tutorial content
    const pieceKeywords = [pieceCategory, pieceSubcategory].join(' ').toLowerCase();
    const tutorialContent = [t.title, t.description, t.category, t.subcategory || '', ...t.tags].join(' ').toLowerCase();

    // Look for relevant keywords
    const relevantMatches =
      (pieceKeywords.includes('porta') && (tutorialContent.includes('porta') || tutorialContent.includes('dobradiça') || tutorialContent.includes('puxador'))) ||
      (pieceKeywords.includes('gaveta') && (tutorialContent.includes('gaveta') || tutorialContent.includes('corrediça'))) ||
      (pieceKeywords.includes('prateleira') && tutorialContent.includes('furação')) ||
      (pieceKeywords.includes('lateral') && (tutorialContent.includes('furação') || tutorialContent.includes('usinagem'))) ||
      (pieceKeywords.includes('fundo') && tutorialContent.includes('dimensões')) ||
      categoryMatches;

    return relevantMatches;
  });

  // Combine: GIF tutorials first (if exists), then directly related, then contextual
  const allTutorials = [
    ...gifTutorials.map(t => ({ ...t, relevanceScore: 200 })),
    ...directlyRelated.map(t => ({ ...t, relevanceScore: 100 })),
    ...contextuallyRelated.map(t => ({ ...t, relevanceScore: 50 }))
  ];

  // Sort by relevance score first, then by popularity
  return allTutorials
    .sort((a, b) => {
      if (a.relevanceScore !== b.relevanceScore) {
        return b.relevanceScore - a.relevanceScore;
      }
      return b.views - a.views;
    })
    .slice(0, limit)
    .map(({ relevanceScore, ...tutorial }) => tutorial); // Remove the temporary relevanceScore
}
