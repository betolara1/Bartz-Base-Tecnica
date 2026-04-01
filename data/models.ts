// Estrutura de dados para modelos e agregados das peças

export interface MaterialOption {
  id: string;
  codigo: string; // código do item
  name: string;
  available: boolean;
  description?: string;
}

export interface ThicknessOption {
  id: string; // id único
  codigo: string; // código do item
  thickness: number; // em mm
  available: boolean;
  standard?: boolean; // se é a espessura padrão
}

export interface FinishOption {
  id: string;
  name: string;
  color: string;
  colorHex?: string;
  texture: "liso" | "texturizado" | "rustico" | "brilhante";
  available: boolean;
  standard?: boolean;
  thicknesses?: number[]; // Espessuras onde este acabamento está disponível
  materials?: string[]; // Materiais onde este acabamento está disponível (ex: "mdf", "mdp")
}

export interface AggregateOption {
  id: string;
  name: string;
  category: "organizacao" | "funcional" | "acabamento";
  description: string;
  available: boolean;
  price?: string; // indicativo de preço
  compatibility?: string[]; // categorias compatíveis
}

export interface PieceModel {
  pieceId: string;
  type: "modular" | "linear" | "curvo" | "muxarabi"; // Tipos de módulos
  materials: MaterialOption[];
  thicknesses: ThicknessOption[];
  finishes: FinishOption[];
  aggregates: AggregateOption[];
  notes?: string[];
  characteristics?: string[]; // Características específicas do tipo
  patterns?: string[]; // Padrões de muxarabi
  patternDimensions?: Record<string, {
    minWidth: number;
    maxWidth: number;
    minHeight: number;
    maxHeight: number;
  }>; // Dimensões técnicas por padrão
  thicknessDimensions?: Record<number, {
    minWidth: number | string;
    maxWidth: number | string;
    minHeight: number | string;
    maxHeight: number | string;
  }>; // Dimensões técnicas por espessura
  compositionOptions?: CompositionOption[]; // Custom form options for compositions like internal cuts
  frontOptions?: FrontOptions; // Opções específicas de portas e gavetas (ex: Linha Comum)
}

export interface FrontOptions {
  materials: MaterialOption[];
  thicknesses: ThicknessOption[];
  finishes: FinishOption[];
  handleOptions: HandleOption[];
  handleBrands?: string[]; // Marcas de puxadores avulsos
}

export interface HandleOption {
  id: string;
  name: string;
  available: boolean;
  colors: HandleColor[];
}

export interface HandleColor {
  id: string;
  name: string;
  hex: string;
  available: boolean;
}

export interface CompositionOption {
  id: string;
  label: string;
  type: "boolean" | "number_range";
  min?: number;
  max?: number;
  description?: string;
  defaultValue?: any;
}

// Acabamentos compartilhados para Curvos e Muxarabi (45 cores para 18mm, 19 para 25mm)
const SHARED_CURVO_MUXARABI_FINISHES: FinishOption[] = [
  { id: "branco-tx", name: "Branco", color: "Branco", colorHex: "#FFFFFF", texture: "liso", available: true, standard: true, thicknesses: [15, 18, 25, 37], materials: ["mdf"] },
  { id: "ameixa-negra", name: "Ameixa Negra", color: "Madeira", colorHex: "#5D4037", texture: "texturizado", available: true, thicknesses: [18, 25, 37] },
  { id: "amazonia", name: "Amazônia", color: "Verde", colorHex: "#2E4D2E", texture: "texturizado", available: true, thicknesses: [18, 37] },
  { id: "asti", name: "Asti", color: "Madeira", colorHex: "#D2B48C", texture: "texturizado", available: true, thicknesses: [18, 25, 37] },
  { id: "atlantica", name: "Atlântica", color: "Azul", colorHex: "#4A708B", texture: "texturizado", available: true, thicknesses: [18, 25, 37] },
  { id: "azul-petroleo", name: "Azul Petróleo", color: "Azul", colorHex: "#004751", texture: "liso", available: true, thicknesses: [18, 37] },
  { id: "beige", name: "Beige", color: "Bege", colorHex: "#F5F5DC", texture: "liso", available: true, thicknesses: [15, 18, 25, 37] },
  { id: "bianco-ravena", name: "Bianco Ravena", color: "Madeira", colorHex: "#F5F5F5", texture: "texturizado", available: true, thicknesses: [15, 18, 25, 37] },
  { id: "bronze", name: "Bronze", color: "Metálico", colorHex: "#8B5A2B", texture: "texturizado", available: true, thicknesses: [18, 37] },
  { id: "cabiuna-nobre", name: "Cabiuna Nobre", color: "Madeira", colorHex: "#3D2B1F", texture: "texturizado", available: true, thicknesses: [15, 18, 25, 37], materials: ["mdf"] },
  { id: "camelo", name: "Camelo", color: "Couro", colorHex: "#996644", texture: "texturizado", available: true, thicknesses: [18, 37] },
  { id: "cancun", name: "Cancun", color: "Madeira", colorHex: "#8B7D6B", texture: "texturizado", available: true, thicknesses: [18, 37] },
  { id: "carvalho-latino", name: "Carvalho Latino", color: "Madeira", colorHex: "#D2B48C", texture: "texturizado", available: true, thicknesses: [18, 37] },
  { id: "carvalho-mel", name: "Carvalho Mel", color: "Madeira", colorHex: "#C19A6B", texture: "texturizado", available: true, thicknesses: [15, 18], materials: ["mdp"] },
  { id: "carvalho-natural", name: "Carvalho Natural", color: "Madeira", colorHex: "#E3C9A6", texture: "texturizado", available: true, thicknesses: [15, 18, 25, 37] },
  { id: "cinza-puro", name: "Cinza Puro", color: "Cinza", colorHex: "#808080", texture: "liso", available: true, thicknesses: [18, 37] },
  { id: "corazzi", name: "Corazzi", color: "Madeira", colorHex: "#A0866A", texture: "texturizado", available: true, thicknesses: [18, 25, 37] },
  { id: "cristallo-branco-diamante", name: "Cristallo Branco Diamante", color: "Branco", colorHex: "#FFFFFF", texture: "brilhante", available: true, thicknesses: [18, 37] },
  { id: "cristallo-cinza-sagrado", name: "Cristallo Cinza Sagrado", color: "Cinza", colorHex: "#A5A5A5", texture: "brilhante", available: true, thicknesses: [18, 37] },
  { id: "cristallo-gianduia", name: "Cristallo Gianduia", color: "Bege", colorHex: "#9B938A", texture: "brilhante", available: true, thicknesses: [18, 37] },
  { id: "cristallo-opalla", name: "Cristallo Opalla", color: "Off-white", colorHex: "#E9E0D2", texture: "brilhante", available: true, thicknesses: [18, 37] },
  { id: "cristallo-preto", name: "Cristallo Preto", color: "Preto", colorHex: "#1A1A1A", texture: "brilhante", available: true, thicknesses: [18, 37] },
  { id: "damasco", name: "Damasco", color: "Madeira", colorHex: "#FFCBA4", texture: "texturizado", available: true, thicknesses: [18, 37] },
  { id: "ebano", name: "Ébano Chess", color: "Madeira", colorHex: "#2F4F4F", texture: "texturizado", available: true, thicknesses: [18, 25, 37] },
  { id: "glamour", name: "Glamour", color: "Madeira", colorHex: "#8B7355", texture: "texturizado", available: true, thicknesses: [18, 25, 37] },
  { id: "imbuia", name: "Imbuia", color: "Madeira", colorHex: "#8B6914", texture: "texturizado", available: true, thicknesses: [18, 37] },
  { id: "jalapao", name: "Jalapão", color: "Madeira", colorHex: "#8B4513", texture: "texturizado", available: true, thicknesses: [18, 37] },
  { id: "linum", name: "Linum", color: "Trama", colorHex: "#CDBA96", texture: "texturizado", available: true, thicknesses: [18, 25, 37] },
  { id: "louro-freijo", name: "Louro Freijó", color: "Madeira", colorHex: "#CD853F", texture: "texturizado", available: true, thicknesses: [18, 37] },
  { id: "manhattan", name: "Manhattan", color: "Cinza", colorHex: "#696969", texture: "texturizado", available: true, thicknesses: [18, 37] },
  { id: "marmo", name: "Marmo", color: "Mármore", colorHex: "#E8E8E8", texture: "texturizado", available: true, thicknesses: [18, 37] },
  { id: "milk-shake", name: "MilkShake", color: "Off-white", colorHex: "#F5F5F5", texture: "liso", available: true, thicknesses: [18, 37] },
  { id: "mint", name: "Mint", color: "Verde", colorHex: "#98FB98", texture: "liso", available: true, thicknesses: [18, 37] },
  { id: "niquel", name: "Níquel", color: "Cinza", colorHex: "#BDBDBD", texture: "texturizado", available: true, thicknesses: [18, 37] },
  { id: "nogueira-caiena", name: "Nogueira Caiena", color: "Madeira", colorHex: "#6B4226", texture: "texturizado", available: true, thicknesses: [18, 37] },
  { id: "panna", name: "Panna", color: "Off-white", colorHex: "#E6E6FA", texture: "liso", available: true, thicknesses: [15, 18, 25, 37], materials: ["mdf"] },
  { id: "pau-ferro", name: "Pau Ferro", color: "Madeira", colorHex: "#4B3621", texture: "texturizado", available: true, thicknesses: [18, 25, 37] },
  { id: "petar", name: "Petar", color: "Cinza", colorHex: "#B8860B", texture: "texturizado", available: true, thicknesses: [18, 25, 37] },
  { id: "petra", name: "Petra", color: "Cinza", colorHex: "#696969", texture: "texturizado", available: true, thicknesses: [18, 37] },
  { id: "quartzo", name: "Quartzo", color: "Cinza", colorHex: "#E6E6FA", texture: "texturizado", available: true, thicknesses: [18, 25, 37] },
  { id: "raphia", name: "Raphia", color: "Trama", colorHex: "#6E7B68", texture: "texturizado", available: true, thicknesses: [18, 37] },
  { id: "reali", name: "Reali", color: "Madeira", colorHex: "#8B7355", texture: "texturizado", available: true, thicknesses: [18, 37] },
  { id: "santiago", name: "Santiago", color: "Madeira", colorHex: "#D2B48C", texture: "texturizado", available: true, thicknesses: [15, 18, 25, 37] },
  { id: "serrano", name: "Serrano", color: "Madeira", colorHex: "#B8860B", texture: "texturizado", available: true, thicknesses: [15, 18, 25, 37], materials: ["mdf"] },
  { id: "urbi", name: "Urbi", color: "Cinza", colorHex: "#D1D5DB", texture: "texturizado", available: true, thicknesses: [15, 18, 25, 37], materials: ["mdf"] },
  { id: "vulcano", name: "Vulcano", color: "Madeira", colorHex: "#3E2723", texture: "texturizado", available: true, thicknesses: [18, 37] }
];

// Dados dos modelos
export const modelsData: PieceModel[] = [
  {
    pieceId: "mod-curvo-90",
    type: "curvo",
    materials: [
      { id: "mdf", codigo: "MDF001", name: "MDF", available: true, description: "Painel de fibras - Melhor acabamento" }
    ],
    thicknesses: [
      { id: "18", codigo: "ESP18", thickness: 18, available: true, standard: true }
    ],
    thicknessDimensions: {
      18: { minWidth: 'Raio + 35mm', maxWidth: '', minHeight: 130, maxHeight: 1200 }
    },
    finishes: [
      { id: "atlantia", name: "Atlântica", color: "Azul", colorHex: "#4A708B", texture: "texturizado", available: true, standard: true },
      { id: "bronze", name: "Bronze", color: "Bronze", colorHex: "#8B5A2B", texture: "texturizado", available: true },
      { id: "cabiuna-nobre", name: "Cabiuna Nobre", color: "Madeira Escura", colorHex: "#3D2B1F", texture: "texturizado", available: true },
      { id: "camelo", name: "Camelo", color: "Camelo", colorHex: "#996644", texture: "texturizado", available: true },
      { id: "carvalho-latino", name: "Carvalho Latino", color: "Madeira Clara", colorHex: "#D2B48C", texture: "texturizado", available: true },
      { id: "linum", name: "Linum", color: "Tecido", colorHex: "#CDBA96", texture: "texturizado", available: true },
      { id: "nogueira-caiena", name: "Nogueira Caiena", color: "Madeira", colorHex: "#6B4226", texture: "texturizado", available: true },
      { id: "pau-ferro", name: "Pau Ferro", color: "Madeira", colorHex: "#4B3621", texture: "texturizado", available: true },
      { id: "raphia", name: "Raphia", color: "Trama", colorHex: "#6E7B68", texture: "texturizado", available: true },
      { id: "serrano", name: "Serrano", color: "Madeira Natural", colorHex: "#B8860B", texture: "texturizado", available: true }
    ],
    aggregates: [],
    characteristics: [
      "Raio: 150mm, 175mm, 200mm, 225mm, 250mm, 275mm, 300mm, 325mm, 350mm, 375mm, 400mm",
      "Curva de 90 graus",
      "Veios Verticais"
    ],
    notes: [
      "Disponível em frentes e tampos convexos",
      "Ideal para cantos arredondados e transições suaves"
    ]
  },
  {
    pieceId: "tampo-curvo-1side",
    type: "curvo",
    materials: [
      { id: "mdf", codigo: "MDF001", name: "MDF", available: true, description: "Painel de fibras - Melhor acabamento" }
    ],
    thicknesses: [
      { id: "18", codigo: "ESP18", thickness: 18, available: true, standard: true },
      { id: "25", codigo: "ESP25", thickness: 25, available: true, standard: false }
    ],
    thicknessDimensions: {
      18: { minWidth: 200, maxWidth: 2700, minHeight: 200, maxHeight: 1800 },
      25: { minWidth: 200, maxWidth: 2700, minHeight: 200, maxHeight: 1800 }
    },
    finishes: [
      { id: "branco-tx", name: "Branco", color: "Branco", colorHex: "#FFFFFF", texture: "liso", available: true, standard: true, thicknesses: [18, 25] },
      { id: "ameixa-negra", name: "Ameixa Negra", color: "Madeira", colorHex: "#5D4037", texture: "texturizado", available: true, thicknesses: [18, 25] },
      { id: "amazonia", name: "Amazônia", color: "Verde", colorHex: "#2E4D2E", texture: "texturizado", available: true, thicknesses: [18] },
      { id: "asti", name: "Asti", color: "Madeira", colorHex: "#D2B48C", texture: "texturizado", available: true, thicknesses: [18, 25] },
      { id: "atlantica", name: "Atlântica", color: "Azul", colorHex: "#4A708B", texture: "texturizado", available: true, thicknesses: [18, 25] },
      { id: "azul-petroleo", name: "Azul Petróleo", color: "Azul", colorHex: "#004751", texture: "liso", available: true, thicknesses: [18] },
      { id: "beige", name: "Beige", color: "Bege", colorHex: "#F5F5DC", texture: "liso", available: true, thicknesses: [18, 25] },
      { id: "bianco-ravena", name: "Bianco Ravena", color: "Madeira", colorHex: "#F5F5F5", texture: "texturizado", available: true, thicknesses: [18, 25] },
      { id: "bronze", name: "Bronze", color: "Metálico", colorHex: "#8B5A2B", texture: "texturizado", available: true, thicknesses: [18] },
      { id: "cabiuna-nobre", name: "Cabiuna Nobre", color: "Madeira", colorHex: "#3D2B1F", texture: "texturizado", available: true, thicknesses: [18, 25] },
      { id: "camelo", name: "Camelo", color: "Couro", colorHex: "#996644", texture: "texturizado", available: true, thicknesses: [18] },
      { id: "cancun", name: "Cancun", color: "Madeira", colorHex: "#8B7D6B", texture: "texturizado", available: true, thicknesses: [18] },
      { id: "carvalho-latino", name: "Carvalho Latino", color: "Madeira", colorHex: "#D2B48C", texture: "texturizado", available: true, thicknesses: [18] },
      { id: "carvalho-natural", name: "Carvalho Natural", color: "Madeira", colorHex: "#E3C9A6", texture: "texturizado", available: true, thicknesses: [18, 25] },
      { id: "cinza-puro", name: "Cinza Puro", color: "Cinza", colorHex: "#808080", texture: "liso", available: true, thicknesses: [18] },
      { id: "corazzi", name: "Corazzi", color: "Madeira", colorHex: "#A0866A", texture: "texturizado", available: true, thicknesses: [18, 25] },
      { id: "cristallo-branco-diamante", name: "Cristallo Branco Diamante", color: "Branco", colorHex: "#FFFFFF", texture: "brilhante", available: true, thicknesses: [18] },
      { id: "cristallo-cinza-sagrado", name: "Cristallo Cinza Sagrado", color: "Cinza", colorHex: "#A5A5A5", texture: "brilhante", available: true, thicknesses: [18] },
      { id: "cristallo-gianduia", name: "Cristallo Gianduia", color: "Bege", colorHex: "#9B938A", texture: "brilhante", available: true, thicknesses: [18] },
      { id: "cristallo-opalla", name: "Cristallo Opalla", color: "Off-white", colorHex: "#E9E0D2", texture: "brilhante", available: true, thicknesses: [18] },
      { id: "cristallo-preto", name: "Cristallo Preto", color: "Preto", colorHex: "#1A1A1A", texture: "brilhante", available: true, thicknesses: [18] },
      { id: "damasco", name: "Damasco", color: "Madeira", colorHex: "#FFCBA4", texture: "texturizado", available: true, thicknesses: [18] },
      { id: "ebano", name: "Ébano Chess", color: "Madeira", colorHex: "#2F4F4F", texture: "texturizado", available: true, thicknesses: [18, 25] },
      { id: "glamour", name: "Glamour", color: "Madeira", colorHex: "#8B7355", texture: "texturizado", available: true, thicknesses: [18, 25] },
      { id: "imbuia", name: "Imbuia", color: "Madeira", colorHex: "#8B6914", texture: "texturizado", available: true, thicknesses: [18] },
      { id: "jalapao", name: "Jalapão", color: "Madeira", colorHex: "#8B4513", texture: "texturizado", available: true, thicknesses: [18] },
      { id: "linum", name: "Linum", color: "Trama", colorHex: "#CDBA96", texture: "texturizado", available: true, thicknesses: [18, 25] },
      { id: "louro-freijo", name: "Louro Freijó", color: "Madeira", colorHex: "#CD853F", texture: "texturizado", available: true, thicknesses: [18] },
      { id: "manhattan", name: "Manhattan", color: "Cinza", colorHex: "#696969", texture: "texturizado", available: true, thicknesses: [18] },
      { id: "marmo", name: "Marmo", color: "Mármore", colorHex: "#E8E8E8", texture: "texturizado", available: true, thicknesses: [18] },
      { id: "milk-shake", name: "MilkShake", color: "Off-white", colorHex: "#F5F5F5", texture: "liso", available: true, thicknesses: [18] },
      { id: "mint", name: "Mint", color: "Verde", colorHex: "#98FB98", texture: "liso", available: true, thicknesses: [18] },
      { id: "niquel", name: "Níquel", color: "Cinza", colorHex: "#BDBDBD", texture: "texturizado", available: true, thicknesses: [18] },
      { id: "nogueira-caiena", name: "Nogueira Caiena", color: "Madeira", colorHex: "#6B4226", texture: "texturizado", available: true, thicknesses: [18] },
      { id: "panna", name: "Panna", color: "Off-white", colorHex: "#E6E6FA", texture: "liso", available: true, thicknesses: [18, 25] },
      { id: "pau-ferro", name: "Pau Ferro", color: "Madeira", colorHex: "#4B3621", texture: "texturizado", available: true, thicknesses: [18, 25] },
      { id: "petar", name: "Petar", color: "Cinza", colorHex: "#B8860B", texture: "texturizado", available: true, thicknesses: [18, 25] },
      { id: "petra", name: "Petra", color: "Cinza", colorHex: "#696969", texture: "texturizado", available: true, thicknesses: [18] },
      { id: "quartzo", name: "Quartzo", color: "Cinza", colorHex: "#E6E6FA", texture: "texturizado", available: true, thicknesses: [18, 25] },
      { id: "raphia", name: "Raphia", color: "Trama", colorHex: "#6E7B68", texture: "texturizado", available: true, thicknesses: [18] },
      { id: "reali", name: "Reali", color: "Madeira", colorHex: "#8B7355", texture: "texturizado", available: true, thicknesses: [18] },
      { id: "santiago", name: "Santiago", color: "Madeira", colorHex: "#D2B48C", texture: "texturizado", available: true, thicknesses: [18, 25] },
      { id: "serrano", name: "Serrano", color: "Madeira", colorHex: "#B8860B", texture: "texturizado", available: true, thicknesses: [18, 25] },
      { id: "urbi", name: "Urbi", color: "Cinza", colorHex: "#D1D5DB", texture: "texturizado", available: true, thicknesses: [18, 25] },
      { id: "vulcano", name: "Vulcano", color: "Madeira", colorHex: "#3E2723", texture: "texturizado", available: true, thicknesses: [18] }
    ],
    aggregates: [],
    characteristics: [
      "Frente 1 Lado Arredondado",
      "Espessuras: Apenas 18mm ou 25mm",
      "Material: Apenas MDF",
      "Raio: 150mm, 175mm, 200mm, 225mm, 250mm, 275mm, 300mm, 325mm, 350mm, 375mm, 400mm",
      "Veios Longitudinais"
    ],
    notes: [
      "Acabamentos premium com toque texturizado ou brilho intenso"
    ]
  },
  {
    pieceId: "tampo-curvo-2sides",
    type: "curvo",
    materials: [
      { id: "mdf", codigo: "MDF001", name: "MDF", available: true, description: "Painel de fibras - Melhor acabamento" }
    ],
    thicknesses: [
      { id: "18", codigo: "ESP18", thickness: 18, available: true, standard: true },
      { id: "25", codigo: "ESP25", thickness: 25, available: true, standard: false }
    ],
    thicknessDimensions: {
      18: { minWidth: 350, maxWidth: 2700, minHeight: 200, maxHeight: 1800 },
      25: { minWidth: 350, maxWidth: 2700, minHeight: 200, maxHeight: 1800 }
    },
    finishes: [
      { id: "branco-tx", name: "Branco", color: "Branco", colorHex: "#FFFFFF", texture: "liso", available: true, standard: true, thicknesses: [18, 25] },
      { id: "ameixa-negra", name: "Ameixa Negra", color: "Madeira", colorHex: "#5D4037", texture: "texturizado", available: true, thicknesses: [18, 25] },
      { id: "amazonia", name: "Amazônia", color: "Verde", colorHex: "#2E4D2E", texture: "texturizado", available: true, thicknesses: [18] },
      { id: "asti", name: "Asti", color: "Madeira", colorHex: "#D2B48C", texture: "texturizado", available: true, thicknesses: [18, 25] },
      { id: "atlantica", name: "Atlântica", color: "Azul", colorHex: "#4A708B", texture: "texturizado", available: true, thicknesses: [18, 25] },
      { id: "azul-petroleo", name: "Azul Petróleo", color: "Azul", colorHex: "#004751", texture: "liso", available: true, thicknesses: [18] },
      { id: "beige", name: "Beige", color: "Bege", colorHex: "#F5F5DC", texture: "liso", available: true, thicknesses: [18, 25] },
      { id: "bianco-ravena", name: "Bianco Ravena", color: "Madeira", colorHex: "#F5F5F5", texture: "texturizado", available: true, thicknesses: [18, 25] },
      { id: "bronze", name: "Bronze", color: "Metálico", colorHex: "#8B5A2B", texture: "texturizado", available: true, thicknesses: [18] },
      { id: "cabiuna-nobre", name: "Cabiuna Nobre", color: "Madeira", colorHex: "#3D2B1F", texture: "texturizado", available: true, thicknesses: [18, 25] },
      { id: "camelo", name: "Camelo", color: "Couro", colorHex: "#996644", texture: "texturizado", available: true, thicknesses: [18] },
      { id: "cancun", name: "Cancun", color: "Madeira", colorHex: "#8B7D6B", texture: "texturizado", available: true, thicknesses: [18] },
      { id: "carvalho-latino", name: "Carvalho Latino", color: "Madeira", colorHex: "#D2B48C", texture: "texturizado", available: true, thicknesses: [18] },
      { id: "carvalho-natural", name: "Carvalho Natural", color: "Madeira", colorHex: "#E3C9A6", texture: "texturizado", available: true, thicknesses: [18, 25] },
      { id: "cinza-puro", name: "Cinza Puro", color: "Cinza", colorHex: "#808080", texture: "liso", available: true, thicknesses: [18] },
      { id: "corazzi", name: "Corazzi", color: "Madeira", colorHex: "#A0866A", texture: "texturizado", available: true, thicknesses: [18, 25] },
      { id: "cristallo-branco-diamante", name: "Cristallo Branco Diamante", color: "Branco", colorHex: "#FFFFFF", texture: "brilhante", available: true, thicknesses: [18] },
      { id: "cristallo-cinza-sagrado", name: "Cristallo Cinza Sagrado", color: "Cinza", colorHex: "#A5A5A5", texture: "brilhante", available: true, thicknesses: [18] },
      { id: "cristallo-gianduia", name: "Cristallo Gianduia", color: "Bege", colorHex: "#9B938A", texture: "brilhante", available: true, thicknesses: [18] },
      { id: "cristallo-opalla", name: "Cristallo Opalla", color: "Off-white", colorHex: "#E9E0D2", texture: "brilhante", available: true, thicknesses: [18] },
      { id: "cristallo-preto", name: "Cristallo Preto", color: "Preto", colorHex: "#1A1A1A", texture: "brilhante", available: true, thicknesses: [18] },
      { id: "damasco", name: "Damasco", color: "Madeira", colorHex: "#FFCBA4", texture: "texturizado", available: true, thicknesses: [18] },
      { id: "ebano", name: "Ébano Chess", color: "Madeira", colorHex: "#2F4F4F", texture: "texturizado", available: true, thicknesses: [18, 25] },
      { id: "glamour", name: "Glamour", color: "Madeira", colorHex: "#8B7355", texture: "texturizado", available: true, thicknesses: [18, 25] },
      { id: "imbuia", name: "Imbuia", color: "Madeira", colorHex: "#8B6914", texture: "texturizado", available: true, thicknesses: [18] },
      { id: "jalapao", name: "Jalapão", color: "Madeira", colorHex: "#8B4513", texture: "texturizado", available: true, thicknesses: [18] },
      { id: "linum", name: "Linum", color: "Trama", colorHex: "#CDBA96", texture: "texturizado", available: true, thicknesses: [18, 25] },
      { id: "louro-freijo", name: "Louro Freijó", color: "Madeira", colorHex: "#CD853F", texture: "texturizado", available: true, thicknesses: [18] },
      { id: "manhattan", name: "Manhattan", color: "Cinza", colorHex: "#696969", texture: "texturizado", available: true, thicknesses: [18] },
      { id: "marmo", name: "Marmo", color: "Mármore", colorHex: "#E8E8E8", texture: "texturizado", available: true, thicknesses: [18] },
      { id: "milk-shake", name: "MilkShake", color: "Off-white", colorHex: "#F5F5F5", texture: "liso", available: true, thicknesses: [18] },
      { id: "mint", name: "Mint", color: "Verde", colorHex: "#98FB98", texture: "liso", available: true, thicknesses: [18] },
      { id: "niquel", name: "Níquel", color: "Cinza", colorHex: "#BDBDBD", texture: "texturizado", available: true, thicknesses: [18] },
      { id: "nogueira-caiena", name: "Nogueira Caiena", color: "Madeira", colorHex: "#6B4226", texture: "texturizado", available: true, thicknesses: [18] },
      { id: "panna", name: "Panna", color: "Off-white", colorHex: "#E6E6FA", texture: "liso", available: true, thicknesses: [18, 25] },
      { id: "pau-ferro", name: "Pau Ferro", color: "Madeira", colorHex: "#4B3621", texture: "texturizado", available: true, thicknesses: [18, 25] },
      { id: "petar", name: "Petar", color: "Cinza", colorHex: "#B8860B", texture: "texturizado", available: true, thicknesses: [18, 25] },
      { id: "petra", name: "Petra", color: "Cinza", colorHex: "#696969", texture: "texturizado", available: true, thicknesses: [18] },
      { id: "quartzo", name: "Quartzo", color: "Cinza", colorHex: "#E6E6FA", texture: "texturizado", available: true, thicknesses: [18, 25] },
      { id: "raphia", name: "Raphia", color: "Trama", colorHex: "#6E7B68", texture: "texturizado", available: true, thicknesses: [18] },
      { id: "reali", name: "Reali", color: "Madeira", colorHex: "#8B7355", texture: "texturizado", available: true, thicknesses: [18] },
      { id: "santiago", name: "Santiago", color: "Madeira", colorHex: "#D2B48C", texture: "texturizado", available: true, thicknesses: [18, 25] },
      { id: "serrano", name: "Serrano", color: "Madeira", colorHex: "#B8860B", texture: "texturizado", available: true, thicknesses: [18, 25] },
      { id: "urbi", name: "Urbi", color: "Cinza", colorHex: "#D1D5DB", texture: "texturizado", available: true, thicknesses: [18, 25] },
      { id: "vulcano", name: "Vulcano", color: "Madeira", colorHex: "#3E2723", texture: "texturizado", available: true, thicknesses: [18] }
    ],
    aggregates: [],
    characteristics: [
      "Frente 2 Lados Arredondados",
      "Espessuras: Apenas 18mm ou 25mm",
      "Material: Apenas MDF",
      "Raio: 150mm, 175mm, 200mm, 225mm, 250mm, 275mm, 300mm, 325mm, 350mm, 375mm, 400mm",
      "Veios Longitudinais"
    ],
    notes: [
      "Acabamentos premium com toque texturizado"
    ]
  },
  {
    pieceId: "muxarabi",
    type: "muxarabi",
    materials: [
      { id: "mdf", codigo: "MDF001", name: "MDF", available: true, description: "Painel de fibras - Melhor acabamento" }
    ],
    thicknesses: [
      { id: "18", codigo: "ESP18", thickness: 18, available: true, standard: true },
      { id: "25", codigo: "ESP25", thickness: 25, available: true, standard: false }
    ],
    finishes: SHARED_CURVO_MUXARABI_FINISHES,
    aggregates: [],
    patterns: ["25x25", "40x25", "50x25", "40x40", "50x50"],
    patternDimensions: {
      "25x25": { minWidth: 325, maxWidth: 1175, minHeight: 325, maxHeight: 2675 },
      "40x25": { minWidth: 335, maxWidth: 1180, minHeight: 335, maxHeight: 2675 },
      "50x25": { minWidth: 300, maxWidth: 1200, minHeight: 300, maxHeight: 2700 },
      "40x40": { minWidth: 300, maxWidth: 1180, minHeight: 300, maxHeight: 2700 },
      "50x50": { minWidth: 350, maxWidth: 1150, minHeight: 350, maxHeight: 2650 }
    },
    characteristics: [
      "Espessuras: 18mm ou 25mm",
      "Material: Apenas MDF",
      "Vazado Geométrico"
    ],
    notes: [
      "Ideal para divisórias e detalhes decorativos"
    ]
  },
  {
    pieceId: "triangulo-retangulo",
    type: "modular",
    materials: [
      { id: "mdf", codigo: "MDF001", name: "MDF", available: true, description: "Painel de fibras - Melhor acabamento" }
    ],
    thicknesses: [
      { id: "15", codigo: "ESP15", thickness: 15, available: true, standard: false },
      { id: "18", codigo: "ESP18", thickness: 18, available: true, standard: true },
      { id: "25", codigo: "ESP25", thickness: 25, available: true, standard: false },
      { id: "37", codigo: "ESP37", thickness: 37, available: true, standard: false }
    ],
    thicknessDimensions: {
      15: { minWidth: 300, maxWidth: 1200, minHeight: 300, maxHeight: 1200 },
      18: { minWidth: 300, maxWidth: 1200, minHeight: 300, maxHeight: 1200 },
      25: { minWidth: 300, maxWidth: 1200, minHeight: 300, maxHeight: 1200 },
      37: { minWidth: 300, maxWidth: 1200, minHeight: 300, maxHeight: 1200 }
    },
    finishes: SHARED_CURVO_MUXARABI_FINISHES.filter(f => f.thicknesses?.some(t => [15, 18, 25, 37].includes(t))),
    aggregates: [],
    characteristics: [
      "Triângulo Retângulo",
      "Espessuras: 15mm, 18mm, 25mm ou 37mm",
      "Material: Apenas MDF"
    ],
    notes: [
      "Ideal para fechamentos e detalhes geométricos"
    ]
  },
  {
    pieceId: "geometria-circular",
    type: "modular",
    materials: [
      { id: "mdf", codigo: "MDF001", name: "MDF", available: true, description: "Painel de fibras - Melhor acabamento" }
    ],
    thicknesses: [
      { id: "15", codigo: "ESP15", thickness: 15, available: true, standard: false },
      { id: "18", codigo: "ESP18", thickness: 18, available: true, standard: true },
      { id: "25", codigo: "ESP25", thickness: 25, available: true, standard: false },
      { id: "37", codigo: "ESP37", thickness: 37, available: true, standard: false }
    ],
    thicknessDimensions: {
      15: { minWidth: 300, maxWidth: 1400, minHeight: 300, maxHeight: 1400 },
      18: { minWidth: 300, maxWidth: 1400, minHeight: 300, maxHeight: 1400 },
      25: { minWidth: 300, maxWidth: 1400, minHeight: 300, maxHeight: 1400 },
      37: { minWidth: 300, maxWidth: 1400, minHeight: 300, maxHeight: 1400 }
    },
    finishes: SHARED_CURVO_MUXARABI_FINISHES.filter(f => f.thicknesses?.some(t => [15, 18, 25, 37].includes(t))),
    aggregates: [],
    characteristics: [
      "Geometria Circular",
      "Espessuras: 15mm, 18mm, 25mm ou 37mm",
      "Material: Apenas MDF"
    ],
    notes: [
      "Perfeito para tampos de mesa redondos e detalhes decorativos"
    ]
  },
  {
    pieceId: "geometria-livre",
    type: "modular",
    materials: [
      { id: "mdf", codigo: "MDF001", name: "MDF", available: true, description: "Painel de fibras - Melhor acabamento" }
    ],
    thicknesses: [
      { id: "15", codigo: "ESP15", thickness: 15, available: true, standard: false },
      { id: "18", codigo: "ESP18", thickness: 18, available: true, standard: true },
      { id: "25", codigo: "ESP25", thickness: 25, available: true, standard: false },
      { id: "37", codigo: "ESP37", thickness: 37, available: true, standard: false }
    ],
    thicknessDimensions: {
      15: { minWidth: 120, maxWidth: 2700, minHeight: 120, maxHeight: 1800 },
      18: { minWidth: 120, maxWidth: 2700, minHeight: 120, maxHeight: 1800 },
      25: { minWidth: 120, maxWidth: 2700, minHeight: 120, maxHeight: 1800 },
      37: { minWidth: 120, maxWidth: 2700, minHeight: 120, maxHeight: 1800 }
    },
    finishes: SHARED_CURVO_MUXARABI_FINISHES.filter(f => f.thicknesses?.some(t => [15, 18, 25, 37].includes(t))),
    aggregates: [],
    characteristics: [
      "Geometria Livre",
      "Espessuras: 15/18/25/37mm",
      "Material: Apenas MDF",
      "IMPORTANTE: VERIFICAR COM O COMERCIAL"
    ],
    notes: [
      "Formas personalizadas sob consulta.",
      "Atenção: Verificar valores com o comercial antes de prosseguir.",
      "Nota: A peça será fabricada em total conformidade com a geometria definida na edição. Recomenda-se uma revisão detalhada antes da finalização."
    ],
    compositionOptions: [
      {
        id: "fita_corte_interno",
        label: "Fita corte interno",
        type: "boolean",
        description: "SIM (para itens maiores de 150mm na largura e profundidade)",
        defaultValue: true
      },
      {
        id: "recorte_circulo",
        label: "Círculo",
        type: "number_range",
        min: 0,
        max: 20,
        defaultValue: 0
      },
      {
        id: "recorte_triangulo",
        label: "Triângulo",
        type: "number_range",
        min: 0,
        max: 20,
        defaultValue: 0
      },
      {
        id: "recorte_meia_lua",
        label: "Meia Lua",
        type: "number_range",
        min: 0,
        max: 20,
        defaultValue: 0
      },
      {
        id: "recorte_retangulo",
        label: "Retângulo",
        type: "number_range",
        min: 0,
        max: 20,
        defaultValue: 0
      }
    ]
  },
  {
    pieceId: "basic-inferiores",
    type: "modular",
    materials: [
      { id: "mdf", codigo: "MDF001", name: "MDF", available: true, description: "Painel de fibras - Melhor acabamento" },
      { id: "mdp", codigo: "MDP001", name: "MDP", available: true, description: "Painel de partículas - Resistente" }
    ],
    thicknesses: [
      { id: "15", codigo: "ESP15", thickness: 15, available: true, standard: true }
    ],
    thicknessDimensions: {
      15: { minWidth: 300, maxWidth: 900, minHeight: 670, maxHeight: 760 }
    },
    finishes: SHARED_CURVO_MUXARABI_FINISHES.filter(f => 
      f.thicknesses?.includes(15) && 
      (
        (f.id === "carvalho-mel" && f.materials?.includes("mdp")) ||
        (["branco-tx", "panna", "urbi"].includes(f.id) && (f.materials?.includes("mdf") || !f.materials))
      )
    ),
    aggregates: [],
    characteristics: [
      "Linha Basic - Conjunto Inferiores",
      "Configurações: 1 Porta, 2 Portas, 4 Gavetas, 2 Gav + 1 Gavetão, 2 Gavetões",
      "Profundidade fixa: 545mm",
      "Altura selecinável: 670mm ou 760mm"
    ],
    notes: [
      "Frentes em MDF 18mm, Corpo em MDF 15mm",
      "Puxadores e sistemas de corrediças inclusos conforme configuração",
      "Ajuste de largura milimétrico entre 300mm e 900mm"
    ],
    frontOptions: {
      materials: [
        { id: "mdf", codigo: "MDF001", name: "MDF", available: true, description: "Painel de fibras - Melhor acabamento" },
        { id: "mdp", codigo: "MDP001", name: "MDP", available: true, description: "Painel de partículas - Resistente" }
      ],
      thicknesses: [
        { id: "15", codigo: "ESP15", thickness: 15, available: true, standard: true },
        { id: "18", codigo: "ESP18", thickness: 18, available: true, standard: false }
      ],
      finishes: SHARED_CURVO_MUXARABI_FINISHES.filter(f => 
        (f.thicknesses?.includes(15) || f.thicknesses?.includes(18)) && 
        (
          (f.id === "carvalho-mel" && f.materials?.includes("mdp")) ||
          (["branco-tx", "cabiuna-nobre", "panna", "serrano", "urbi"].includes(f.id) && (f.materials?.includes("mdf") || !f.materials))
        )
      ),
      handleOptions: [
        { 
          id: "sem-perfil", 
          name: "Sem perfil", 
          available: true,
          colors: []
        },
        { 
          id: "perfil-gola-24mm", 
          name: "Perfil gola 24mm", 
          available: true,
          colors: [
            { id: "cinza", name: "Cinza", hex: "#A1A1A1", available: true },
            { id: "bronze", name: "Bronze", hex: "#8B5A2B", available: true },
            { id: "preto", name: "Preto", hex: "#1A1A1A", available: true },
            { id: "inox", name: "Inox", hex: "#B5AD8B", available: true }
          ]
        }
      ],
      handleBrands: ["Archi", "Contatto", "Metalsinos", "Puxart", "Tabone", "Torralba", "Zen"]
    }
  },
  {
    pieceId: "basic-superiores",
    type: "modular",
    materials: [
      { id: "mdf", codigo: "MDF001", name: "MDF", available: true, description: "Painel de fibras - Melhor acabamento" },
      { id: "mdp", codigo: "MDP001", name: "MDP", available: true, description: "Painel de partículas - Resistente" }
    ],
    thicknesses: [
      { id: "15", codigo: "ESP15", thickness: 15, available: true, standard: true }
    ],
    thicknessDimensions: {
      15: { minWidth: 200, maxWidth: 1200, minHeight: 330, maxHeight: 880 }
    },
    finishes: SHARED_CURVO_MUXARABI_FINISHES.filter(f => 
      f.thicknesses?.includes(15) && 
      (
        (f.id === "carvalho-mel" && f.materials?.includes("mdp")) ||
        (["branco-tx", "panna", "urbi"].includes(f.id) && (f.materials?.includes("mdf") || !f.materials))
      )
    ),
    aggregates: [],
    characteristics: [
      "Linha Basic - Conjunto Superiores",
      "Configurações: 1 Porta, 2 Portas, Basculantes",
      "Profundidade fixa: 350mm",
      "Alturas Nominais: 330, 440, 660, 880mm"
    ],
    notes: [
      "Frentes em MDF 18mm",
      "Ferragens de alta performance inclusas"
    ],
    frontOptions: {
      materials: [
        { id: "mdf", codigo: "MDF001", name: "MDF", available: true, description: "Painel de fibras - Melhor acabamento" },
        { id: "mdp", codigo: "MDP001", name: "MDP", available: true, description: "Painel de partículas - Resistente" }
      ],
      thicknesses: [
        { id: "15", codigo: "ESP15", thickness: 15, available: true, standard: true },
        { id: "18", codigo: "ESP18", thickness: 18, available: true, standard: false }
      ],
      finishes: SHARED_CURVO_MUXARABI_FINISHES.filter(f => 
        (f.thicknesses?.includes(15) || f.thicknesses?.includes(18)) && 
        (
          (f.id === "carvalho-mel" && f.materials?.includes("mdp")) ||
          (["branco-tx", "cabiuna-nobre", "panna", "serrano", "urbi"].includes(f.id) && (f.materials?.includes("mdf") || !f.materials))
        )
      ),
      handleOptions: [
        { 
          id: "sem-perfil", 
          name: "Sem perfil", 
          available: true,
          colors: []
        },
        { 
          id: "perfil-gola-24mm", 
          name: "Perfil gola 24mm", 
          available: true,
          colors: [
            { id: "cinza", name: "Cinza", hex: "#A1A1A1", available: true },
            { id: "bronze", name: "Bronze", hex: "#8B5A2B", available: true },
            { id: "preto", name: "Preto", hex: "#1A1A1A", available: true },
            { id: "inox", name: "Inox", hex: "#B5AD8B", available: true }
          ]
        }
      ],
      handleBrands: ["Archi", "Contatto", "Metalsinos", "Puxart", "Tabone", "Torralba", "Zen"]
    }
  }
];

// Funções para buscar dados dos modelos
export function getModelForPiece(pieceId: string): PieceModel | undefined {
  return modelsData.find(model => model.pieceId === pieceId);
}

export function getAvailableMaterials(pieceId: string): MaterialOption[] {
  const model = getModelForPiece(pieceId);
  return model?.materials.filter(m => m.available) || [];
}

export function getAvailableThicknesses(pieceId: string): ThicknessOption[] {
  const model = getModelForPiece(pieceId);
  return model?.thicknesses.filter(t => t.available) || [];
}

export function getAvailableFrontMaterials(pieceId: string): MaterialOption[] {
  const model = getModelForPiece(pieceId);
  return model?.frontOptions?.materials.filter(m => m.available) || [];
}

export function getAvailableFrontThicknesses(pieceId: string): ThicknessOption[] {
  const model = getModelForPiece(pieceId);
  return model?.frontOptions?.thicknesses.filter(t => t.available) || [];
}

export function getAvailableFrontFinishes(pieceId: string, thickness?: number, materialId?: string): FinishOption[] {
  const model = getModelForPiece(pieceId);
  let finishes = model?.frontOptions?.finishes.filter(f => f.available) || [];

  if (thickness) {
    finishes = finishes.filter(f => !f.thicknesses || f.thicknesses.includes(thickness));
  }

  if (materialId) {
    finishes = finishes.filter(f => !f.materials || f.materials.includes(materialId.toLowerCase()));
  }

  return finishes;
}

export function getAvailableHandles(pieceId: string): HandleOption[] {
  const model = getModelForPiece(pieceId);
  return model?.frontOptions?.handleOptions.filter(h => h.available) || [];
}

export function getAvailableHandleBrands(pieceId: string): string[] {
  const model = getModelForPiece(pieceId);
  return model?.frontOptions?.handleBrands || [];
}

export function getAvailableFinishes(pieceId: string, thickness?: number, materialId?: string): FinishOption[] {
  const model = getModelForPiece(pieceId);
  let finishes = model?.finishes.filter(f => f.available) || [];

  if (thickness) {
    finishes = finishes.filter(f => !f.thicknesses || f.thicknesses.includes(thickness));
  }

  if (materialId) {
    finishes = finishes.filter(f => !f.materials || f.materials.includes(materialId.toLowerCase()));
  }

  return finishes;
}

export function getAvailableAggregates(pieceId: string, category?: string): AggregateOption[] {
  const model = getModelForPiece(pieceId);
  let aggregates = model?.aggregates.filter(a => a.available) || [];

  if (category) {
    aggregates = aggregates.filter(a =>
      a.compatibility?.includes(category.toLowerCase()) || !a.compatibility
    );
  }

  return aggregates;
}

export function getAggregatesByCategory(pieceId: string): Record<string, AggregateOption[]> {
  const aggregates = getAvailableAggregates(pieceId);

  return aggregates.reduce((acc, aggregate) => {
    if (!acc[aggregate.category]) {
      acc[aggregate.category] = [];
    }
    acc[aggregate.category].push(aggregate);
    return acc;
  }, {} as Record<string, AggregateOption[]>);
}

export function getStandardOptions(pieceId: string) {
  const model = getModelForPiece(pieceId);
  if (!model) return null;

  return {
    material: model.materials.find(m => m.available),
    thickness: model.thicknesses.find(t => t.standard && t.available),
    finish: model.finishes.find(f => f.standard && f.available)
  };
}

// Mapear categorias para termos mais amigáveis
export const categoryLabels = {
  organizacao: "Organização",
  funcional: "Funcional",
  acabamento: "Acabamento"
};

export const textureLabels = {
  liso: "Liso",
  texturizado: "Texturizado",
  rustico: "Rústico",
  brilhante: "Brilhante"
};

export const typeLabels = {
  modular: "Modular",
  linear: "Linear",
  curvo: "Curvo",
  muxarabi: "Muxarabi"
};

export const typeDescriptions = {
  modular: "Módulos independentes que podem ser combinados",
  linear: "Estrutura contínua sem divisões internas",
  curvo: "Módulos com superfícies curvas e raios específicos",
  muxarabi: "Painéis vazados com padrões geométricos"
};
