import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";
import {
  Ruler,
  Package,
  ArrowUpRight,
  MapPin,
  Settings,
  EyeOff,
  MoreHorizontal,
  Heart,
  Star,
  AlertCircle,
  Wrench,
  DoorOpen,
  Layers3,
  Target,
  Weight,
  Zap,
  Shield,
  Gauge,
  Link
} from "lucide-react";
import { PieceData } from "../data/catalog";
import { SmartBadge } from "./DesignSystem";
import { isPieceFavorited, togglePieceFavorite } from "../utils/favorites";
import { getPieceImage } from "../utils/imageMap";

interface PieceCardProps {
  piece: PieceData;
  onSelect: (piece: PieceData) => void;
  variant?: "grid" | "list";
  isAdminMode?: boolean;
  onToggleVisibility?: () => void;
  isHidden?: boolean;
  waveIndex?: number;
  cardIndex?: number;
}

// Função para determinar informações contextuais baseadas na categoria
function getContextualInfo(piece: PieceData) {
  const categoria = piece.categoria.toLowerCase();

  if (categoria.includes('ferrag')) {
    // Para ferragens, mostrar compatibilidade e aplicações
    return {
      type: 'hardware',
      icon: Wrench,
      sections: [
        {
          title: 'Compatibilidade',
          icon: DoorOpen,
          color: 'blue',
          items: getHardwareCompatibility(piece)
        },
        {
          title: 'Aplicações',
          icon: Target,
          color: 'green',
          items: getHardwareApplications(piece)
        }
      ]
    };
  } else if (categoria.includes('porta')) {
    // Para portas, mostrar sistemas de entrada e materiais
    return {
      type: 'doors',
      icon: DoorOpen,
      sections: [
        {
          title: 'Sistemas de Entrada',
          icon: Link,
          color: 'purple',
          items: getDoorSystems(piece)
        },
        {
          title: 'Especificações',
          icon: Ruler,
          color: 'blue',
          items: getDoorSpecs(piece)
        }
      ]
    };
  } else if (categoria.includes('gav')) {
    // Para gavetas, mostrar capacidade e mecanismos
    return {
      type: 'drawers',
      icon: Package,
      sections: [
        {
          title: 'Capacidade',
          icon: Weight,
          color: 'orange',
          items: getDrawerCapacity(piece)
        },
        {
          title: 'Mecanismos',
          icon: Zap,
          color: 'green',
          items: getDrawerMechanisms(piece)
        }
      ]
    };
  } else if (categoria.includes('pratel')) {
    // Para prateleiras, mostrar carga e regulagem
    return {
      type: 'shelves',
      icon: Layers3,
      sections: [
        {
          title: 'Capacidade de Carga',
          icon: Weight,
          color: 'red',
          items: getShelfCapacity(piece)
        },
        {
          title: 'Sistema de Regulagem',
          icon: Settings,
          color: 'blue',
          items: getShelfRegulation(piece)
        }
      ]
    };
  } else {
    // Para armários e outros, manter dimensões
    return {
      type: 'dimensions',
      icon: Ruler,
      sections: [
        {
          title: 'Dimensões Mínimas',
          icon: Ruler,
          color: 'emerald',
          items: getDimensionItems(piece.min as any, 'min')
        },
        {
          title: 'Dimensões Máximas',
          icon: Ruler,
          color: 'blue',
          items: getDimensionItems(piece.max as any, 'max')
        }
      ]
    };
  }
}

// Funções auxiliares para obter informações específicas por categoria
function getHardwareCompatibility(piece: PieceData): string[] {
  if (piece.subcategoria.toLowerCase().includes('dobra')) {
    return ['Portas até 600mm', 'Espessura 18-25mm', 'Peso até 8kg', 'Abertura 110°'];
  } else if (piece.subcategoria.toLowerCase().includes('corre')) {
    return ['Gavetas 250-550mm', 'Carga até 45kg', 'Extensão total', 'Soft-close'];
  } else if (piece.subcategoria.toLowerCase().includes('regul')) {
    return ['Prateleiras 18-37mm', 'Furação 32mm', 'Ajuste milimétrico', 'Carga até 40kg'];
  }
  return ['Múltiplas aplicações', 'Instalação simples', 'Durabilidade alta'];
}

function getHardwareApplications(piece: PieceData): string[] {
  if (piece.subcategoria.toLowerCase().includes('dobra')) {
    return ['Armários base', 'Armários aéreos', 'Portas sobrepostas'];
  } else if (piece.subcategoria.toLowerCase().includes('corre')) {
    return ['Gavetas simples', 'Gavetas duplas', 'Organizadores'];
  } else if (piece.subcategoria.toLowerCase().includes('regul')) {
    return ['Prateleiras fixas', 'Divisórias', 'Organizadores'];
  }
  return ['Uso versátil', 'Fácil instalação'];
}

function getDoorSystems(piece: PieceData): string[] {
  return [
    'Sistema 32mm',
    'Furação CNC',
    'Dobradiças caneco',
    'Soft-close opcional'
  ];
}

function getDoorSpecs(piece: PieceData): string[] {
  const specs = [];
  if (piece.min.profundidade === piece.max.profundidade) {
    specs.push(`Espessura: ${piece.min.profundidade}mm`);
  } else {
    specs.push(`Espessura: ${piece.min.profundidade}-${piece.max.profundidade}mm`);
  }

  if (piece.subcategoria.toLowerCase().includes('simples')) {
    specs.push('Porta única');
  } else if (piece.subcategoria.toLowerCase().includes('dupla')) {
    specs.push('Porta dupla');
  }

  specs.push('Borda ABS');
  specs.push('Furações padrão');

  return specs;
}

function getDrawerCapacity(piece: PieceData): string[] {
  const capacity = [];

  if (piece.subcategoria.toLowerCase().includes('simples')) {
    capacity.push('Carga: até 25kg');
    capacity.push('1 compartimento');
  } else if (piece.subcategoria.toLowerCase().includes('dupla')) {
    capacity.push('Carga: até 40kg');
    capacity.push('2 compartimentos');
  } else if (piece.subcategoria.toLowerCase().includes('tripla')) {
    capacity.push('Carga: até 60kg');
    capacity.push('3 compartimentos');
  }

  capacity.push('Extensão total');
  capacity.push('Soft-close');

  return capacity;
}

function getDrawerMechanisms(piece: PieceData): string[] {
  return [
    'Corrediças telescópicas',
    'Sistema push-to-open',
    'Amortecimento integrado',
    'Ajuste tridimensional'
  ];
}

function getShelfCapacity(piece: PieceData): string[] {
  const isRegulavel = piece.subcategoria.toLowerCase().includes('regulável');

  return [
    `Carga: até ${isRegulavel ? '40' : '30'}kg`,
    'Distribuição uniforme',
    'Deflexão mínima',
    'Teste de resistência'
  ];
}

function getShelfRegulation(piece: PieceData): string[] {
  const isRegulavel = piece.subcategoria.toLowerCase().includes('regulável');

  if (isRegulavel) {
    return [
      'Furação 32mm',
      'Ajuste a cada 8mm',
      'Suportes invisíveis',
      'Fácil reposicionamento'
    ];
  } else {
    return [
      'Posição fixa',
      'Encaixes precisos',
      'Instalação definitiva',
      'Máxima estabilidade'
    ];
  }
}

function getDimensionItems(dimensions: { largura: number; altura: number; profundidade: number }, type: 'min' | 'max'): string[] {
  return [
    `L: ${dimensions.largura}mm`,
    `A: ${dimensions.altura}mm`,
    `P: ${dimensions.profundidade}mm`
  ];
}

export function PieceCard({
  piece,
  onSelect,
  variant = "grid",
  isAdminMode = false,
  onToggleVisibility,
  isHidden = false,
  waveIndex = 0,
  cardIndex = 0
}: PieceCardProps) {
  const [isFavorited, setIsFavorited] = useState(false);

  // Validate piece data early
  if (!piece) {
    return (
      <Card className="rounded-xl border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20 p-4">
        <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
          <AlertCircle className="w-4 h-4" />
          <span className="text-sm">Dados da peça não disponíveis</span>
        </div>
      </Card>
    );
  }

  // Validate required fields with fallbacks
  const safepiece: PieceData = {
    id: piece.id || 'unknown',
    categoria: piece.categoria || 'Categoria não definida',
    subcategoria: piece.subcategoria || 'Subcategoria não definida',
    descricao: piece.descricao || 'Descrição não disponível',
    min: piece.min || { largura: 0, altura: 0, profundidade: 0 },
    max: piece.max || { largura: 0, altura: 0, profundidade: 0 },
    fixos: piece.fixos || { largura: false, altura: false, profundidade: false },
    tags: piece.tags || [],
    popularidade: piece.popularidade || 1,
    relatedIds: piece.relatedIds || []
  };

  // Obter informações contextuais
  const contextualInfo = getContextualInfo(safepiece);

  // Wave effect - determine which info to show based on wave index and card position
  const getWaveInfo = () => {
    const wavePhase = (waveIndex + Math.floor(cardIndex / 2)) % 3;

    switch (wavePhase) {
      case 0:
        return contextualInfo.sections[0]; // First section (e.g., Compatibility)
      case 1:
        return contextualInfo.sections[1]; // Second section (e.g., Applications)  
      case 2:
        return {
          title: 'Ficha Técnica',
          icon: Shield,
          color: 'amber' as const,
          items: [
            `SKU: ${safepiece.id}`,
            `Ref: ${safepiece.id.split('-')[0]}`,
            `Rating: ${safepiece.popularidade}/5`,
            `Status: Premium`
          ]
        };
      default:
        return contextualInfo.sections[0];
    }
  };

  const waveInfo = getWaveInfo();

  useEffect(() => {
    try {
      setIsFavorited(isPieceFavorited(safepiece.id));

      // Listen for favorites updates
      const handleFavoritesUpdate = () => {
        try {
          setIsFavorited(isPieceFavorited(safepiece.id));
        } catch (error) {
          console.warn("Error updating favorite status:", error);
        }
      };

      window.addEventListener('favoritesUpdated', handleFavoritesUpdate);
      return () => window.removeEventListener('favoritesUpdated', handleFavoritesUpdate);
    } catch (error) {
      console.warn("Error setting up favorites:", error);
    }
  }, [safepiece.id]);

  const handleFavoriteToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const newState = togglePieceFavorite({
        id: safepiece.id,
        categoria: safepiece.categoria,
        subcategoria: safepiece.subcategoria,
        descricao: safepiece.descricao
      });
      setIsFavorited(newState);
    } catch (error) {
      console.warn("Error toggling favorite:", error);
    }
  };

  const getStatusColor = () => {
    return "bg-emerald-50 text-emerald-700 border-emerald-100/50 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20";
  };

  const getDimensionText = () => {
    const { min, max, fixos } = safepiece;

    if (fixos.largura && fixos.altura && fixos.profundidade) {
      return `${min.largura}×${min.altura}×${min.profundidade}mm`;
    }

    const largura = fixos.largura ? `${min.largura}` : `${min.largura}-${max.largura}`;
    const altura = fixos.altura ? `${min.altura}` : `${min.altura}-${max.altura}`;
    const profundidade = fixos.profundidade ? `${min.profundidade}` : `${min.profundidade}-${max.profundidade}`;

    return `${largura}×${altura}×${profundidade}mm`;
  };

  const handlePieceClick = () => {
    try {
      onSelect(piece);
    } catch (error) {
      console.error("Error selecting piece:", error);
    }
  };

  const TitleWithTooltip = ({ title, maxLength = 40, className = "" }: {
    title: string;
    maxLength?: number;
    className?: string;
  }) => {
    const shouldTruncate = title.length > maxLength;

    if (!shouldTruncate) {
      return <div className={className}>{title}</div>;
    }

    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className={`${className} truncate cursor-help`}>
              {title}
            </div>
          </TooltipTrigger>
          <TooltipContent side="top" className="p-3 glass-card border-zinc-200/50">
            <p className="text-xs font-bold leading-relaxed">{title}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  };

  if (variant === "list") {
    return (
      <Card
        className={`rounded-2xl border border-zinc-200/50 dark:border-zinc-800/50 hover:bg-zinc-50/50 dark:hover:bg-zinc-900/50 transition-all duration-300 cursor-pointer group px-6 py-4 ${isHidden ? 'opacity-50 grayscale' : ''
          }`}
        onClick={handlePieceClick}
      >
        <div className="flex items-center gap-6">
          <div className="flex-shrink-0">
            <div className={`w-14 h-14 rounded-2xl bg-${waveInfo.color}-50 dark:bg-${waveInfo.color}-500/10 flex items-center justify-center transition-colors overflow-hidden border border-zinc-100 dark:border-zinc-800`}>
              {getPieceImage(safepiece.id) ? (
                <img
                  src={getPieceImage(safepiece.id)!}
                  alt={safepiece.descricao}
                  className="w-full h-full object-cover transition-transform group-hover:scale-110 duration-500"
                />
              ) : (
                <contextualInfo.icon className={`w-7 h-7 text-${waveInfo.color}-600 dark:text-${waveInfo.color}-400`} />
              )}
            </div>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-2">
              <div className="flex-1 min-w-0">
                <TitleWithTooltip
                  title={safepiece.descricao}
                  maxLength={60}
                  className="text-base font-bold text-slate-900 dark:text-white mb-1 uppercase tracking-tight"
                />
                <div className="flex items-center gap-3 text-[10px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-widest">
                  <span>{safepiece.categoria}</span>
                  <span className="w-1 h-1 rounded-full bg-zinc-300 dark:bg-zinc-700" />
                  <span className="text-amber-600 dark:text-amber-500">{safepiece.subcategoria}</span>
                </div>
              </div>

              <div className="flex items-center gap-3 ml-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleFavoriteToggle}
                  className={`h-10 w-10 p-0 rounded-full transition-all ${isFavorited
                    ? 'bg-pink-50 text-pink-500 dark:bg-pink-500/10 dark:text-pink-400'
                    : 'text-zinc-300 hover:text-pink-500 hover:bg-pink-50/50 opacity-0 group-hover:opacity-100'
                    }`}
                >
                  <Heart className={`w-4 h-4 ${isFavorited ? 'fill-current' : ''}`} />
                </Button>
                <ArrowUpRight className="w-5 h-5 text-zinc-300 group-hover:text-amber-500 transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
              </div>
            </div>

            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <Ruler className="w-4 h-4 text-zinc-400" />
                <span className="text-[11px] font-bold text-slate-600 dark:text-zinc-400 uppercase tracking-tighter">
                  {contextualInfo.type === 'dimensions' ? getDimensionText() : contextualInfo.sections[0].items[0]}
                </span>
              </div>
              <Badge variant="secondary" className="text-[9px] font-bold uppercase tracking-widest bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 border-none">
                Disponível
              </Badge>
              {safepiece.tags.slice(0, 1).map((tag, i) => (
                <SmartBadge key={i} type="technical">{tag}</SmartBadge>
              ))}
            </div>
          </div>
        </div>
      </Card>
    );
  }

  const pieceImg = getPieceImage(safepiece.id);

  return (
    <Card
      className={`rounded-2xl glass-card premium-shadow hover:-translate-y-1 hover:shadow-2xl transition-all duration-500 cursor-pointer group overflow-hidden flex flex-col ${isHidden ? 'opacity-50 grayscale' : ''
        }`}
      onClick={handlePieceClick}
    >
      {/* Image / Hero section */}
      {pieceImg ? (
        <div className="relative h-52 flex-shrink-0 overflow-hidden bg-zinc-100 dark:bg-zinc-900">
          <img
            src={pieceImg}
            alt={safepiece.descricao}
            className="w-full h-full object-cover"
          />
          {/* Dark gradient overlay at the bottom for readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

          {/* Title on top of image */}
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <TitleWithTooltip
              title={safepiece.descricao}
              maxLength={50}
              className="text-base font-black text-white leading-tight tracking-tight uppercase drop-shadow"
            />
            <div className="flex items-center gap-2 mt-1 text-[10px] font-bold text-white/70 uppercase tracking-widest">
              <span>{safepiece.categoria}</span>
              <span className="w-1 h-1 rounded-full bg-amber-400" />
              <span className="text-amber-400">{safepiece.subcategoria}</span>
            </div>
          </div>

          {/* Favorite button overlaid on image */}
          <div className="absolute top-3 right-3 flex gap-1.5">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleFavoriteToggle}
              className={`h-8 w-8 p-0 rounded-full backdrop-blur-sm transition-all duration-300 ${isFavorited
                ? 'bg-pink-500 text-white'
                : 'bg-black/30 text-white/70 hover:text-pink-300 opacity-0 group-hover:opacity-100'
                }`}
            >
              <Heart className={`w-3.5 h-3.5 ${isFavorited ? 'fill-current' : ''}`} />
            </Button>

            {isAdminMode && (
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleVisibility?.();
                }}
                className="h-8 w-8 p-0 rounded-full bg-black/30 text-white/70 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all"
              >
                {isHidden ? <EyeOff className="w-3.5 h-3.5" /> : <MoreHorizontal className="w-3.5 h-3.5" />}
              </Button>
            )}
          </div>

          {/* Status badge */}
          <div className="absolute top-3 left-3">
            <Badge className="text-[9px] font-black uppercase tracking-widest bg-emerald-500 text-white border-none shadow-sm">
              Disponível
            </Badge>
          </div>
        </div>
      ) : (
        <>
          {/* Fallback: coloured top bar + header */}
          <div className="h-1.5 w-full premium-gradient opacity-80 group-hover:opacity-100 transition-opacity" />
          <CardHeader className="pb-4 pt-6 px-6 flex-shrink-0">
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <TitleWithTooltip
                  title={safepiece.descricao}
                  maxLength={50}
                  className="text-lg font-bold text-slate-900 dark:text-white mb-2 min-h-[1.75rem] leading-tight tracking-tight uppercase"
                />
                <div className="flex items-center gap-2 text-[11px] font-semibold text-slate-500 dark:text-zinc-400 uppercase tracking-widest min-h-[1.25rem]">
                  <span className="truncate">{safepiece.categoria}</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500/50" />
                  <span className="truncate text-amber-600 dark:text-amber-400 font-bold">{safepiece.subcategoria}</span>
                </div>
              </div>
              <div className="flex items-center gap-1.5 -mt-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleFavoriteToggle}
                  className={`h-9 w-9 p-0 rounded-full transition-all duration-300 ${isFavorited
                    ? 'bg-pink-50 text-pink-500 dark:bg-pink-500/10 dark:text-pink-400'
                    : 'text-slate-300 hover:text-pink-500 hover:bg-pink-50/50 dark:hover:bg-pink-500/5 opacity-0 group-hover:opacity-100'
                    }`}
                >
                  <Heart className={`w-4 h-4 ${isFavorited ? 'fill-current' : ''}`} />
                </Button>
                {isAdminMode && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => { e.stopPropagation(); onToggleVisibility?.(); }}
                    className="h-9 w-9 p-0 rounded-full text-zinc-300 hover:text-zinc-600 dark:hover:text-zinc-200 opacity-60 hover:opacity-100 transition-all border border-zinc-100 dark:border-zinc-800"
                  >
                    {isHidden ? <EyeOff className="w-4 h-4" /> : <MoreHorizontal className="w-4 h-4" />}
                  </Button>
                )}
              </div>
            </div>
          </CardHeader>
        </>
      )}

      {/* Card body — specs */}
      <CardContent className={`${pieceImg ? 'pt-4' : 'pt-0'} px-5 pb-4 flex-1 flex flex-col`}>
        <div className="space-y-3 flex-1 flex flex-col">
          {/* Tags — only shown when no image (image cards have limited space) */}
          {!pieceImg && (
            <div className="flex items-center gap-1.5 flex-wrap min-h-[2rem]">
              <Badge
                variant="secondary"
                className="text-[10px] font-bold uppercase tracking-tighter bg-emerald-50 text-emerald-700 border-none dark:bg-emerald-500/10 dark:text-emerald-400"
              >
                Disponível
              </Badge>
              {safepiece.tags.slice(0, 2).map((tag, index) => (
                <SmartBadge
                  key={index}
                  type="technical"
                  className="bg-zinc-100/50 text-zinc-600 dark:bg-zinc-800/50 dark:text-zinc-400 border-none px-2 py-0.5"
                >
                  {tag}
                </SmartBadge>
              ))}
            </div>
          )}

          {/* Tags for image cards — compact */}
          {pieceImg && (
            <div className="flex items-center gap-1.5 flex-wrap">
              {safepiece.tags.slice(0, 3).map((tag, index) => (
                <SmartBadge
                  key={index}
                  type="technical"
                  className="bg-zinc-100/50 text-zinc-600 dark:bg-zinc-800/50 dark:text-zinc-400 border-none px-2 py-0.5"
                >
                  {tag}
                </SmartBadge>
              ))}
            </div>
          )}

          <div className="relative group/specs flex-1">
            <div
              className={`h-full rounded-2xl p-4 bg-zinc-50/50 dark:bg-zinc-900/30 border border-zinc-100 dark:border-zinc-800 transition-all duration-500 group-hover/specs:border-amber-200/50 dark:group-hover/specs:bg-zinc-900/50`}
            >
              <div className="flex items-center gap-2.5 mb-3">
                <div className={`p-1.5 rounded-xl bg-${waveInfo.color}-100/50 dark:bg-${waveInfo.color}-500/10 transition-colors duration-500`}>
                  <waveInfo.icon className={`w-3.5 h-3.5 text-${waveInfo.color}-600 dark:text-${waveInfo.color}-400`} />
                </div>
                <span className={`text-[11px] font-bold text-slate-700 dark:text-zinc-300 uppercase tracking-tight`}>
                  {waveInfo.title}
                </span>
                <div className={`ml-auto w-1.5 h-1.5 rounded-full bg-amber-400 opacity-60 animate-pulse`} />
              </div>

              <div className="space-y-2">
                {waveInfo.items.slice(0, 3).map((item, itemIndex) => (
                  <div key={itemIndex} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`w-1 h-1 rounded-full bg-${waveInfo.color}-400/50`} />
                      <span className="text-[11px] text-slate-500 dark:text-zinc-500 font-bold uppercase tracking-tight">{item.split(':')[0]}</span>
                    </div>
                    <span className="text-xs font-bold text-slate-900 dark:text-white">{item.split(':')[1]?.trim() || ''}</span>
                  </div>
                ))}

                {waveInfo.items.length > 3 && (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="mt-3 pt-3 border-t border-zinc-200/50 dark:border-zinc-800/50 text-[10px] font-bold text-amber-600 dark:text-amber-500/80 cursor-help flex items-center gap-1.5 uppercase tracking-tighter hover:text-amber-700 transition-colors">
                          <AlertCircle className="w-3.5 h-3.5" />
                          +{waveInfo.items.length - 3} especificações adicionais
                        </div>
                      </TooltipTrigger>
                      <TooltipContent side="bottom" className="p-4 glass-card border-amber-200/30">
                        <div className="space-y-2">
                          {waveInfo.items.slice(3).map((item, itemIndex) => (
                            <p key={itemIndex} className="text-xs font-bold tracking-tight">• {item}</p>
                          ))}
                        </div>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-3 mt-auto border-t border-zinc-100/50 dark:border-zinc-800/50">
            <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 dark:text-zinc-600 uppercase tracking-widest">
              <Package className="w-3.5 h-3.5" />
              <span>SKU: {safepiece.id}</span>
            </div>

            <div className="flex items-center gap-1.5 text-slate-400 group-hover:text-amber-600 dark:group-hover:text-amber-500 transition-all">
              <span className="text-[11px] font-bold uppercase tracking-tight">Detalhes</span>
              <ArrowUpRight className="w-4 h-4 transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

