import { acabamentosData } from "./acabamentos";

export interface PieceData {
  id: string;
  categoria: string;
  subcategoria: string;
  descricao: string;
  min: {
    largura: number | string;
    altura: number | string;
    profundidade: number | string;
  };
  max: {
    largura: number | string;
    altura: number | string;
    profundidade: number | string;
  };
  fixos: {
    largura: boolean;
    altura: boolean;
    profundidade: boolean;
  };
  links?: {
    video?: string;
    documentation?: string;
    manual?: string;
    doc?: string;
    viewer3dId?: string;
  };
  popularidade: number;
  relatedIds: string[];
  tags: string[];
  acabamentos?: string[]; // IDs dos acabamentos selecionados
  modelConfig?: any; // Configuração de modelos do AdminPanel
  image?: string; // Caminho para foto do produto
  createdAt?: number; // Timestamp de criação
  updatedAt?: number; // Timestamp de última atualização
}

// Catálogo principal (dados existentes)
const baseCatalogData: PieceData[] = [
  {
    id: "mod-curvo-90",
    categoria: "Ateliê Bartz",
    subcategoria: "Módulo Curvo",
    descricao: "Módulo Curvo 90°",
    min: { largura: "Raio + 35", altura: 130, profundidade: 250 },
    max: { largura: 435, altura: 1200, profundidade: 800 },
    fixos: { largura: true, altura: false, profundidade: false },
    popularidade: 4,
    relatedIds: [],
    image: "/fotos/modulo-curvo-90.png",
    tags: ["curvo", "90 graus", "ateliê"]
  },
  {
    id: "tampo-curvo-1side",
    categoria: "Ateliê Bartz",
    subcategoria: "Tampo Curvo",
    descricao: "Tampo Frente 1 Lado Arredondado",
    min: { largura: 200, altura: 200, profundidade: 18 },
    max: { largura: 2700, altura: 1800, profundidade: 25 },
    fixos: { largura: false, altura: false, profundidade: false },
    popularidade: 4,
    relatedIds: ["mod-curvo-90"],
    image: "/fotos/tampo-1-lado-arrendodado.png",
    tags: ["curvo", "tampo", "1 lado", "arredondado"]
  },
  {
    id: "tampo-curvo-2sides",
    categoria: "Ateliê Bartz",
    subcategoria: "Tampo Curvo",
    descricao: "Tampo Frente 2 Lados Arredondados",
    min: { largura: 350, altura: 200, profundidade: 18 },
    max: { largura: 2700, altura: 1800, profundidade: 25 },
    fixos: { largura: false, altura: false, profundidade: false },
    popularidade: 4,
    relatedIds: ["mod-curvo-90"],
    image: "/fotos/tampo-2-lado-arrendodado.png",
    tags: ["curvo", "tampo", "2 lados", "arredondados"]
  },
  {
    id: "muxarabi",
    categoria: "Ateliê Bartz",
    subcategoria: "Muxarabi",
    descricao: "Muxarabi",
    min: { largura: 300, altura: 300, profundidade: 18 },
    max: { largura: 1200, altura: 2700, profundidade: 25 },
    fixos: { largura: false, altura: false, profundidade: false },
    popularidade: 5,
    relatedIds: [],
    image: "/fotos/muxarabi.png",
    tags: ["muxarabi", "vazado", "painel", "decorativo"]
  },
  {
    id: "triangulo-retangulo",
    categoria: "Ateliê Bartz",
    subcategoria: "Especiais",
    descricao: "Triângulo Retângulo",
    min: { largura: 300, altura: 300, profundidade: 15 },
    max: { largura: 1200, altura: 1200, profundidade: 37 },
    fixos: { largura: false, altura: false, profundidade: false },
    popularidade: 4,
    relatedIds: [],
    image: "/fotos/triangulo-retangulo.png",
    tags: ["triangulo", "retangulo", "especial", "ateliê"]
  },
  {
    id: "geometria-circular",
    categoria: "Ateliê Bartz",
    subcategoria: "Especiais",
    descricao: "Geometria Circular",
    min: { largura: 300, altura: 300, profundidade: 15 },
    max: { largura: 1400, altura: 1400, profundidade: 37 },
    fixos: { largura: false, altura: false, profundidade: false },
    popularidade: 4,
    relatedIds: [],
    image: "/fotos/geometria-circular.png",
    tags: ["circulo", "redondo", "especial", "ateliê"]
  },
  {
    id: "geometria-livre",
    categoria: "Ateliê Bartz",
    subcategoria: "Especiais",
    descricao: "Geometria Livre",
    min: { largura: 120, altura: 120, profundidade: 15 },
    max: { largura: 2700, altura: 1800, profundidade: 37 },
    fixos: { largura: false, altura: false, profundidade: false },
    popularidade: 3,
    relatedIds: [],
    image: "/fotos/geometria-livre.png",
    tags: ["livre", "personalizado", "especial", "ateliê"]
  }
];

// Armazenamento de peças criadas pelo usuário
let userCreatedPieces: PieceData[] = [];

// Carregar peças criadas pelo usuário do localStorage
if (typeof window !== 'undefined') {
  const stored = localStorage.getItem('bartz_user_pieces');
  if (stored) {
    try {
      userCreatedPieces = JSON.parse(stored);
    } catch (error) {
      console.warn('Error loading user pieces from localStorage:', error);
    }
  }
}

// Função para salvar peças criadas pelo usuário
function saveUserPieces() {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem('bartz_user_pieces', JSON.stringify(userCreatedPieces));
    } catch (error) {
      console.warn('Error saving user pieces to localStorage:', error);
    }
  }
}

// Catálogo completo (base + criadas pelo usuário)
export const catalogData: PieceData[] = [...baseCatalogData, ...userCreatedPieces];

// Função para adicionar nova peça ao catálogo
export function addPieceToCatalog(piece: Omit<PieceData, 'id' | 'createdAt' | 'updatedAt'>): PieceData {
  const now = Date.now();
  const newPiece: PieceData = {
    ...piece,
    id: `user-${now}-${Math.random().toString(36).substr(2, 9)}`,
    createdAt: now,
    updatedAt: now
  };

  userCreatedPieces.push(newPiece);
  catalogData.push(newPiece);
  saveUserPieces();

  // Dispatch event for UI updates
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent("catalogUpdated", { detail: newPiece }));
  }

  return newPiece;
}

// Função para atualizar peça existente
export function updatePieceInCatalog(id: string, updates: Partial<PieceData>): PieceData | null {
  const pieceIndex = catalogData.findIndex(p => p.id === id);
  if (pieceIndex === -1) return null;

  const userPieceIndex = userCreatedPieces.findIndex(p => p.id === id);
  const updatedPiece = {
    ...catalogData[pieceIndex],
    ...updates,
    updatedAt: Date.now()
  };

  catalogData[pieceIndex] = updatedPiece;

  if (userPieceIndex !== -1) {
    userCreatedPieces[userPieceIndex] = updatedPiece;
    saveUserPieces();
  }

  // Dispatch event for UI updates
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent("catalogUpdated", { detail: updatedPiece }));
  }

  return updatedPiece;
}

// Função para remover peça do catálogo (apenas peças criadas pelo usuário)
export function removePieceFromCatalog(id: string): boolean {
  const userPieceIndex = userCreatedPieces.findIndex(p => p.id === id);
  if (userPieceIndex === -1) return false; // Não pode remover peças base

  const catalogIndex = catalogData.findIndex(p => p.id === id);
  if (catalogIndex !== -1) {
    catalogData.splice(catalogIndex, 1);
  }

  userCreatedPieces.splice(userPieceIndex, 1);
  saveUserPieces();

  // Dispatch event for UI updates
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent("catalogUpdated", { detail: { deleted: id } }));
  }

  return true;
}

// Função para verificar se uma peça foi criada pelo usuário
export function isUserCreatedPiece(id: string): boolean {
  return userCreatedPieces.some(p => p.id === id);
}

// Funções existentes (mantendo compatibilidade)
export function getCategories(): string[] {
  const categories = new Set(catalogData.map(piece => piece.categoria));
  return Array.from(categories).sort();
}

export function getSubcategories(category: string): string[] {
  const subcategories = new Set(
    catalogData
      .filter(piece => piece.categoria === category)
      .map(piece => piece.subcategoria)
      .filter(Boolean)
  );
  return Array.from(subcategories).sort();
}

export function getPiecesByCategory(category?: string, subcategory?: string): PieceData[] {
  return catalogData.filter(piece => {
    if (category && piece.categoria !== category) return false;
    if (subcategory && piece.subcategoria !== subcategory) return false;
    return true;
  });
}

export function getPieceById(id: string): PieceData | undefined {
  return catalogData.find(piece => piece.id === id);
}

export function searchPieces(query: string): PieceData[] {
  const lowerQuery = query.toLowerCase().trim();

  if (!lowerQuery) return catalogData;

  return catalogData.filter(piece =>
    piece.descricao.toLowerCase().includes(lowerQuery) ||
    piece.categoria.toLowerCase().includes(lowerQuery) ||
    piece.subcategoria.toLowerCase().includes(lowerQuery) ||
    piece.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
  );
}

export function getCategoryStats(): Record<string, number> {
  const stats: Record<string, number> = {};

  catalogData.forEach(piece => {
    stats[piece.categoria] = (stats[piece.categoria] || 0) + 1;
  });

  return stats;
}

export function getRelatedPieces(pieceId: string, maxResults: number = 5): PieceData[] {
  const piece = getPieceById(pieceId);
  if (!piece) return [];

  // Primeiro, buscar peças explicitamente relacionadas
  const explicitlyRelated = piece.relatedIds
    .map(id => getPieceById(id))
    .filter(Boolean) as PieceData[];

  // Depois, buscar peças da mesma categoria
  const sameCategory = catalogData
    .filter(p =>
      p.id !== pieceId &&
      !piece.relatedIds.includes(p.id) &&
      p.categoria === piece.categoria
    )
    .sort((a, b) => b.popularidade - a.popularidade);

  // Combinar e limitar resultados
  return [...explicitlyRelated, ...sameCategory].slice(0, maxResults);
}

export function getPopularPieces(maxResults: number = 10): PieceData[] {
  return [...catalogData]
    .sort((a, b) => b.popularidade - a.popularidade)
    .slice(0, maxResults);
}

export function getPiecesByTag(tag: string): PieceData[] {
  return catalogData.filter(piece =>
    piece.tags.some(t => t.toLowerCase().includes(tag.toLowerCase()))
  );
}

// Função para obter estatísticas do catálogo
export function getCatalogStats() {
  const total = catalogData.length;
  const userCreated = userCreatedPieces.length;
  const basePieces = total - userCreated;

  return {
    total,
    basePieces,
    userCreated,
    categories: getCategories().length,
    popularPieces: catalogData.filter(p => p.popularidade >= 4).length
  };
}
