import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import {
  ArrowLeft,
  Ruler,
  Package,
  Link as LinkIcon,
  Play,
  FileText,
  Heart,
  HeartOff,
  ExternalLink,
  Info,
  Palette,
  Layers,
  Eye,
  Star,
  Building,
  Settings,
  X,
  Clock,
  Users,
  BookOpen,
  Video,
  AlertCircle,
  Lock,
  ChevronRight,
  CheckCircle,
  Unlock
} from "lucide-react";
import { PieceData } from "../data/catalog";
import { TutorialData, getTutorialsForPiece } from "../data/tutorials";
import { getModelForPiece } from "../data/models";
import { SmartBadge } from "./DesignSystem";
import { ModelosEAcabamentosCard } from "./ModelosEAcabamentosCard";
import { VideoEmbed } from "./VideoEmbed";
import { isPieceFavorited, togglePieceFavorite } from "../utils/favorites";
import { getPieceImage } from "../utils/imageMap";
import { getPieceVideos } from "../utils/videoMap";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { cn } from "./ui/utils";

interface PieceDetailsProps {
  piece: PieceData;
  onBack: () => void;
  onSelectPiece: (piece: PieceData) => void;
  onSelectTutorial: (tutorial: TutorialData) => void;
  isAdminMode?: boolean;
}

export function PieceDetails({
  piece,
  onBack,
  onSelectPiece,
  onSelectTutorial,
  isAdminMode = false
}: PieceDetailsProps) {
  const [selectedTutorial, setSelectedTutorial] = useState<TutorialData | null>(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [localIsFavorited, setLocalIsFavorited] = useState(false);
  const [isImageZoomed, setIsImageZoomed] = useState(false);

  // Validate piece data early with fallbacks
  if (!piece) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="ghost" onClick={onBack} className="rounded-xl h-12 px-4 hover:bg-muted">
            <ArrowLeft className="w-5 h-5 mr-2" />
            Voltar ao catálogo
          </Button>
        </div>
        <Card className="rounded-xl border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20 p-6">
          <div className="flex items-center gap-3 text-red-600 dark:text-red-400">
            <AlertCircle className="w-6 h-6" />
            <div>
              <h3 className="font-semibold">Erro nos dados da peça</h3>
              <p className="text-sm">Não foi possível carregar os detalhes desta especificação.</p>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  // Create safe piece object with fallbacks
  const safePiece = {
    id: piece.id || 'unknown',
    categoria: piece.categoria || 'Categoria não definida',
    subcategoria: piece.subcategoria || 'Subcategoria não definida',
    descricao: piece.descricao || 'Descrição não disponível',
    min: piece.min || { largura: 0, altura: 0, profundidade: 0 },
    max: piece.max || { largura: 0, altura: 0, profundidade: 0 },
    fixos: piece.fixos || { largura: false, altura: false, profundidade: false },
    tags: piece.tags || [],
    status: (piece as any).status || 'Disponível' // Add fallback for status property
  };

  const model = getModelForPiece(safePiece.id);

  // Get related tutorials for this piece
  const relatedTutorials = getTutorialsForPiece(
    safePiece.id,
    safePiece.categoria,
    safePiece.subcategoria,
    safePiece.descricao,
    6 // Mostrar até 6 tutoriais
  );

  // Synchronize local favorite state
  useEffect(() => {
    setLocalIsFavorited(isPieceFavorited(safePiece.id));

    const handleUpdate = () => {
      setLocalIsFavorited(isPieceFavorited(safePiece.id));
    };

    window.addEventListener("favoritesUpdated", handleUpdate);
    return () => window.removeEventListener("favoritesUpdated", handleUpdate);
  }, [safePiece.id]);

  const handleFavoriteToggle = () => {
    // Optimistic update
    const nextState = !localIsFavorited;
    setLocalIsFavorited(nextState);

    togglePieceFavorite({
      id: safePiece.id,
      categoria: safePiece.categoria,
      subcategoria: safePiece.subcategoria,
      descricao: safePiece.descricao,
    });
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "disponível":
      case "disponivel":
        return "bg-green-100 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-300 dark:border-green-800";
      case "sob consulta":
        return "bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-300 dark:border-amber-800";
      case "indisponível":
      case "indisponivel":
        return "bg-red-100 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-300 dark:border-red-800";
      default:
        return "bg-green-100 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-300 dark:border-green-800";
    }
  };

  // Componente para card de tutorial destacado
  const TutorialVideoCard = ({ tutorial, featured = false }: {
    tutorial: TutorialData;
    featured?: boolean;
  }) => {
    const getDifficultyColor = (difficulty: TutorialData["difficulty"]) => {
      switch (difficulty) {
        case "Básico":
          return "bg-green-100 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-300 dark:border-green-800";
        case "Intermediário":
          return "bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-300 dark:border-amber-800";
        case "Avançado":
          return "bg-red-100 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-300 dark:border-red-800";
        default:
          return "bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-900/20 dark:text-gray-300 dark:border-gray-800";
      }
    };

    return (
      <Card
        className={`cursor-pointer transition-all duration-300 hover:shadow-xl hover:scale-[1.03] group overflow-hidden ${featured ? 'ring-2 ring-emerald-200 dark:ring-emerald-800 shadow-lg' : 'hover:ring-2 hover:ring-emerald-200 dark:hover:ring-emerald-800'
          }`}
        onClick={() => setSelectedTutorial(tutorial)}
      >
        <CardContent className="p-0">
          {/* Thumbnail com overlay aprimorado */}
          <div className="relative overflow-hidden bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900">
            <div className="aspect-video w-full relative">
              <ImageWithFallback
                src={tutorial.thumbnail}
                alt={tutorial.title}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />

              {/* Overlay com gradiente */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-300" />

              {/* Play Button com animação aprimorada */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-20 h-20 bg-white/95 dark:bg-black/95 rounded-full flex items-center justify-center group-hover:scale-110 group-hover:bg-emerald-500 group-hover:text-white transition-all duration-300 shadow-2xl border-4 border-white/20">
                  <Play className="w-10 h-10 text-emerald-600 group-hover:text-white dark:text-emerald-400 ml-1 transition-colors duration-300" />
                </div>
              </div>

              {/* Badges no thumbnail */}
              <div className="absolute top-3 left-3 flex gap-2">
                {featured && (
                  <SmartBadge type="new" className="text-xs bg-emerald-500 text-white border-0 shadow-lg">
                    ⭐ Recomendado
                  </SmartBadge>
                )}
                <Badge
                  variant="outline"
                  className={`text-xs shadow-lg backdrop-blur-sm bg-white/90 dark:bg-black/90 ${getDifficultyColor(tutorial.difficulty)}`}
                >
                  {tutorial.difficulty}
                </Badge>
              </div>

              {/* Duration com design aprimorado */}
              <div className="absolute bottom-3 right-3 bg-black/90 text-white text-xs px-3 py-1.5 rounded-full font-medium shadow-lg backdrop-blur-sm border border-white/20">
                <Clock className="w-3 h-3 inline mr-1" />
                {tutorial.duration}
              </div>
            </div>
          </div>

          {/* Content com espaçamento aprimorado */}
          <div className="p-5">
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-base leading-tight line-clamp-2 mb-2 group-hover:text-emerald-700 dark:group-hover:text-emerald-300 transition-colors">
                  {tutorial.title}
                </h4>

                <div className="flex items-center gap-2 flex-wrap mb-3">
                  <SmartBadge type="category" className="text-xs">
                    {tutorial.category}
                  </SmartBadge>
                  {tutorial.subcategory && (
                    <SmartBadge type="frequent" className="text-xs">
                      {tutorial.subcategory}
                    </SmartBadge>
                  )}
                </div>

                {tutorial.description && (
                  <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                    {tutorial.description}
                  </p>
                )}
              </div>

              {/* Footer com estatísticas - SEM popularidade exposta */}
              <div className="flex items-center justify-between pt-3 border-t border-border">
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Video className="w-3 h-3" />
                    <span>Tutorial técnico</span>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedTutorial(tutorial);
                  }}
                  className="h-8 px-4 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 font-medium transition-all duration-300"
                >
                  <Play className="w-3 h-3 mr-1.5" />
                  Assistir Agora
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-0">
      <div className="space-y-6 pb-20">
        {/* Header - Premium Glass Sticky */}
        <div className="sticky top-0 z-[100] w-full glass-card border-x-0 border-t-0 rounded-none shadow-sm">
          <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                onClick={onBack}
                className="rounded-xl h-11 px-4 text-zinc-500 hover:text-amber-600 hover:bg-amber-500/5 transition-all font-bold uppercase tracking-widest text-[10px]"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Voltar
              </Button>

              <Separator orientation="vertical" className="h-6 opacity-20" />

              <div className="flex items-center gap-3">
                <Button
                  variant="ghost"
                  onClick={handleFavoriteToggle}
                  className={`rounded-xl h-11 px-6 transition-all font-bold uppercase tracking-widest text-[10px] ${localIsFavorited
                    ? "bg-red-500/10 text-red-500 hover:bg-red-500/20"
                    : "text-zinc-500 hover:text-amber-600 hover:bg-amber-500/5"
                    }`}
                >
                  {localIsFavorited ? (
                    <>
                      <Heart className="w-4 h-4 mr-2 fill-current" />
                      Favoritado
                    </>
                  ) : (
                    <>
                      <Heart className="w-4 h-4 mr-2" />
                      Salvar
                    </>
                  )}
                </Button>

                {isAdminMode && (
                  <Button
                    variant="ghost"
                    className="rounded-xl h-11 px-6 text-zinc-500 hover:text-blue-600 hover:bg-blue-500/5 transition-all font-bold uppercase tracking-widest text-[10px]"
                  >
                    <Settings className="w-4 h-4 mr-2" />
                    Editar
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 w-full">
          {/* Tab Navigation above the title */}
          <div className="pt-8 pb-2 flex justify-center">
            <TabsList className="flex h-11 bg-zinc-100/50 dark:bg-zinc-900/50 p-1 rounded-xl glass-card border-none">
              {[
                { id: "overview", icon: Info, label: "Geral" },
                { id: "models", icon: Palette, label: "Modelos" },
                { id: "tutorials", icon: Video, label: "Aulas" },
              ].map((tab) => (
                <TabsTrigger
                  key={tab.id}
                  value={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className="rounded-lg px-8 text-[10px] font-bold uppercase tracking-widest transition-all data-[state=active]:bg-white dark:data-[state=active]:bg-zinc-800 data-[state=active]:shadow-sm data-[state=active]:text-amber-600"
                >
                  <tab.icon className="w-3.5 h-3.5 mr-2" />
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          {/* Main Title Section */}
          <div className="py-8 flex flex-col items-center text-center space-y-6">
            <div className="space-y-3">
              <div className="flex items-center justify-center gap-3">
                <span className="text-[10px] font-black text-amber-600 uppercase tracking-[0.2em]">{safePiece.categoria}</span>
                <div className="w-1 h-1 rounded-full bg-zinc-300" />
                <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">{safePiece.subcategoria}</span>
              </div>
              <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-slate-900 dark:text-white uppercase">
                {safePiece.descricao}
              </h1>
              <div className="flex items-center justify-center gap-4 pt-2">
                <Badge className={`px-5 py-1 rounded-full text-[9px] font-black tracking-widest border-none shadow-sm ${getStatusColor(safePiece.status)}`}>
                  {safePiece.status.toUpperCase()}
                </Badge>
                <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest opacity-60">
                  Código de Engenharia: <span className="text-zinc-600 dark:text-zinc-300">{safePiece.id}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Tab Content Areas */}
          <div className="mt-0">
            <TabsContent value="overview" className="mt-0 space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
              {/* Product photo — Geral tab only */}
              {(() => {
                const img = getPieceImage(safePiece.id);
                return img ? (
                  <div 
                    className="w-full max-w-2xl mx-auto mb-4 rounded-3xl overflow-hidden shadow-xl border border-zinc-100/60 dark:border-zinc-800/60 cursor-zoom-in transition-all hover:scale-[1.01] hover:shadow-2xl group relative"
                    onClick={() => setIsImageZoomed(true)}
                  >
                    <img
                      src={img}
                      alt={safePiece.descricao}
                      className="w-full h-64 md:h-80 object-cover"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                      <div className="bg-white/90 dark:bg-zinc-900/90 p-3 rounded-full shadow-lg backdrop-blur-sm">
                        <Eye className="w-5 h-5 text-amber-600" />
                      </div>
                    </div>
                  </div>
                ) : null;
              })()}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                {/* Features & Application */}
                <div className="lg:col-span-4 space-y-8">
                  <div className="space-y-4">
                    <p className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em]">Especificação Técnica</p>
                    <div className="glass-card p-6 rounded-3xl border-zinc-100/50 dark:border-zinc-800/50">
                      <div className="space-y-5">
                        <p className="text-sm text-slate-600 dark:text-zinc-400 leading-relaxed font-medium italic opacity-80">
                          "Especialmente otimizado para a modulação de engenharia Bartz, garantindo precisão milimétrica e acabamento superior."
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {safePiece.tags.map((tag, idx) => (
                            <span key={idx} className="bg-zinc-100 dark:bg-zinc-800 text-zinc-500 text-[9px] font-black uppercase tracking-widest px-3 py-1 transparent rounded-lg transition-colors hover:bg-amber-500/10 hover:text-amber-600">
                              #{tag.toLowerCase()}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <p className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em]">Normas de Aplicação</p>
                    <div className="glass-card p-6 rounded-3xl border-zinc-100/50 dark:border-zinc-800/50 bg-zinc-50/30 dark:bg-zinc-900/30">
                      <div className="flex items-start gap-4">
                        <div className="p-3 rounded-2xl bg-white dark:bg-zinc-800 shadow-sm border border-zinc-100 dark:border-zinc-700">
                          <Building className="w-5 h-5 text-amber-500" />
                        </div>
                        <div className="space-y-2">
                          <p className="text-xs font-bold text-slate-900 dark:text-zinc-200 uppercase tracking-tight">{safePiece.categoria}</p>
                          <p className="text-[11px] text-zinc-500 leading-relaxed uppercase tracking-tighter">
                            Item de uso estrutural técnico. Seguir rigorosamente o manual de montagem industrial Bartz.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Dimensions Section - Grid styled */}
                <div className="lg:col-span-3 space-y-6">
                  <p className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em] text-center">Gabarito de Medidas</p>
                  <div className="space-y-4">
                    {[
                      { label: 'Largura', val: safePiece.fixos.largura ? `${safePiece.min.largura}mm` : `${safePiece.min.largura} - ${safePiece.max.largura}mm`, fixed: safePiece.fixos.largura, icon: Ruler },
                      { label: 'Altura', val: safePiece.fixos.altura ? `${safePiece.min.altura}mm` : `${safePiece.min.altura} - ${safePiece.max.altura}mm`, fixed: safePiece.fixos.altura, icon: Ruler },
                      { label: 'Profundidade', val: safePiece.fixos.profundidade ? `${safePiece.min.profundidade}mm` : `${safePiece.min.profundidade} - ${safePiece.max.profundidade}mm`, fixed: safePiece.fixos.profundidade, icon: Ruler }
                    ].map((dim, i) => (
                      <div key={i} className="glass-card group p-5 rounded-3xl border-zinc-100/50 dark:border-zinc-800/50 transition-all hover:scale-[1.02] hover:shadow-xl hover:shadow-zinc-500/5">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-[9px] font-black uppercase tracking-[0.15em] text-zinc-400">{dim.label}</span>
                          <dim.icon className="w-3.5 h-3.5 text-zinc-300 opacity-50" />
                        </div>
                        <div className="text-2xl font-black text-slate-900 dark:text-white tracking-tighter mb-2">
                          {dim.val}
                        </div>
                        <div className={`text-[8px] font-black px-2.5 py-1 rounded-full inline-flex items-center gap-1.5 uppercase tracking-widest ${dim.fixed ? "bg-amber-500/10 text-amber-600" : "bg-blue-500/10 text-blue-600"
                          }`}>
                          {dim.fixed ? <Lock className="w-2.5 h-2.5" /> : <Unlock className="w-2.5 h-2.5" />}
                          {dim.fixed ? 'Medida Fixa' : 'Range Variável'}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Right column: Materials & Build info */}
                <div className="lg:col-span-5 space-y-8">
                  {model && (
                    <div className="space-y-8">
                      <div className="grid grid-cols-1 gap-6">
                        {/* Materiais */}
                        <div className="space-y-4">
                          <p className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em]">Materiais de Fabricação</p>
                          <div className="grid grid-cols-1 gap-3">
                            {model.materials.map((mat) => (
                              <div key={mat.id} className="glass-card p-4 rounded-2xl border-zinc-100/50 flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                  <div className="p-3 rounded-xl bg-zinc-100/50 dark:bg-zinc-800/50 text-zinc-400">
                                    <Package className="w-5 h-5" />
                                  </div>
                                  <div>
                                    <p className="text-xs font-bold text-slate-900 dark:text-zinc-200 uppercase tracking-tight">{mat.name}</p>
                                    <p className="text-[9px] font-black text-zinc-400 uppercase tracking-widest">{mat.codigo}</p>
                                  </div>
                                </div>
                                <CheckCircle className="w-4 h-4 text-emerald-500" />
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Espessuras */}
                        <div className="space-y-4">
                          <p className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em]">Gradação de Espessuras</p>
                          <div className="grid grid-cols-2 gap-3">
                            {model.thicknesses.map((esp) => (
                              <div key={esp.id} className="glass-card p-5 rounded-2xl border-zinc-100/50 text-center relative overflow-hidden group hover:border-amber-500/30 transition-colors">
                                {esp.standard && (
                                  <div className="absolute top-0 right-0">
                                    <div className="bg-amber-500 text-white text-[7px] font-black px-3 py-1 rounded-bl-xl uppercase tracking-widest">Padrão Eng</div>
                                  </div>
                                )}
                                <div className="text-3xl font-black text-slate-900 dark:text-white mb-0.5 tracking-tighter">{esp.thickness}mm</div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Engineering Notes - Premium Look */}
                      {model.notes && model.notes.length > 0 && (
                        <div className="p-6 rounded-3xl bg-amber-500/5 border border-amber-500/10 space-y-4">
                          <div className="flex items-center gap-3">
                            <AlertCircle className="w-4 h-4 text-amber-500" />
                            <p className="text-[10px] font-black text-amber-600 uppercase tracking-[0.2em]">Observações Técnicas</p>
                          </div>
                          <div className="grid grid-cols-1 gap-3">
                            {model.notes.map((note, idx) => (
                              <div key={idx} className="flex gap-3 text-[11px] text-slate-600 dark:text-zinc-400 font-medium leading-relaxed">
                                <div className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0" />
                                {note}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                  {!model && (
                    <div className="glass-card p-12 rounded-[40px] text-center border-dashed border-zinc-200 dark:border-zinc-800">
                      <Settings className="w-12 h-12 mx-auto mb-6 text-zinc-200 opacity-50" />
                      <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight mb-2">Aguardando Modelo</h3>
                      <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest">Configurações de engenharia pendentes</p>
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="models" className="mt-0 outline-none animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="py-8">
                <ModelosEAcabamentosCard
                  pieceId={safePiece.id}
                  pieceCategory={safePiece.categoria}
                  pieceSubcategory={safePiece.subcategoria}
                  isAdminMode={isAdminMode}
                />
              </div>
            </TabsContent>

            <TabsContent value="tutorials" className="mt-0 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="py-8 space-y-10">
                <div className="max-w-3xl mx-auto text-center space-y-4">
                  <h2 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Treinamento & Capacitação</h2>
                  <p className="text-sm text-zinc-500 font-medium leading-relaxed">Guia visual completo para montagem e especificações técnicas do item em ambiente fabril.</p>
                </div>

                {relatedTutorials.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {relatedTutorials.map((tutorial, index) => (
                      <TutorialVideoCard
                        key={tutorial.id}
                        tutorial={tutorial}
                        featured={index === 0}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="glass-card py-20 rounded-[40px] text-center border-dashed border-zinc-200 dark:border-zinc-800">
                    <div className="w-20 h-20 mx-auto mb-6 rounded-3xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 flex items-center justify-center text-zinc-300">
                      <Play className="w-8 h-8 opacity-20" />
                    </div>
                    <h3 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tight mb-2">Conteúdo em Produção</h3>
                    <p className="text-xs text-zinc-400 font-bold uppercase tracking-widest">Disponível em breve no ecossistema Bartz</p>
                  </div>
                )}
              </div>
            </TabsContent>
          </div>
        </div>

        {/* Video Modal - Premium styling */}
        <Dialog open={!!selectedTutorial} onOpenChange={() => setSelectedTutorial(null)}>
          <DialogContent
            aria-describedby={undefined}
            className={cn(
              "p-0 overflow-hidden border-none bg-zinc-950 shadow-2xl transition-all duration-300",
              // Desktop handling
              selectedTutorial?.duration === 'GIF'
                ? "sm:max-w-[90vw] sm:w-[90vw]"
                : "sm:max-w-5xl",
              "sm:rounded-[32px]",
              // Mobile landscape rotation (for both videos and gifs)
              "max-sm:fixed max-sm:top-[50%] max-sm:left-[50%] max-sm:origin-center max-sm:rotate-90",
              "max-sm:w-[100vh] max-sm:!max-w-[100vh] max-sm:h-[100vw] max-sm:!max-h-[100vw]",
              "max-sm:rounded-none max-sm:flex max-sm:flex-col"
            )}
          >
            <div className={cn(
              "w-full bg-black relative",
              selectedTutorial?.duration === 'GIF' ? "" : "sm:aspect-video",
              "max-sm:flex-1 max-sm:flex max-sm:items-center max-sm:justify-center max-sm:overflow-hidden"
            )}>
              {/* Custom mobile close button to ensure it's easy to tap in landscape */}
              <Button
                onClick={() => setSelectedTutorial(null)}
                variant="ghost"
                className="absolute top-4 right-4 z-[300] rounded-full h-10 w-10 p-0 text-white/70 hover:text-white bg-black/40 hover:bg-black/60 sm:hidden"
              >
                <X className="w-6 h-6" />
              </Button>

              {selectedTutorial && (
                <VideoEmbed
                  src={selectedTutorial.videoUrl}
                  title={selectedTutorial.title}
                  thumbnail={selectedTutorial.thumbnail}
                  duration={selectedTutorial.duration}
                  className={cn(
                    "rounded-t-[32px] sm:rounded-none",
                    "max-sm:rounded-none max-sm:w-full max-sm:h-full max-sm:!pb-0 max-sm:!max-h-none",
                    // Força object-contain no vídeo/img interno para evitar que corte nas bordas ao rotacionar
                    "max-sm:[&_video]:!object-contain max-sm:[&_img]:!object-contain max-sm:[&_img]:w-full max-sm:[&_img]:h-full"
                  )}
                />
              )}
            </div>
            {/* Ocultar a descrição no mobile para focar só no vídeo */}
            <div className="p-8 bg-white dark:bg-zinc-900 border-t border-zinc-100 dark:border-zinc-800 hidden sm:block">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-[10px] font-black text-amber-600 uppercase tracking-widest mb-1">{selectedTutorial?.category}</p>
                  <DialogTitle className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">{selectedTutorial?.title}</DialogTitle>
                </div>
                <Button onClick={() => setSelectedTutorial(null)} variant="ghost" className="rounded-full h-12 w-12 p-0 text-zinc-400 hover:text-amber-600 transition-colors">
                  <X className="w-6 h-6" />
                </Button>
              </div>
              <DialogDescription className="text-sm text-zinc-500 font-medium leading-relaxed max-w-3xl">{selectedTutorial?.description}</DialogDescription>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Fullscreen Image Zoom Overlay */}
      {isImageZoomed && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center bg-zinc-950/90 backdrop-blur-md animate-in fade-in duration-300"
          onClick={() => setIsImageZoomed(false)}
        >
          <button 
            className="absolute top-6 right-6 p-3 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors z-[110]"
            onClick={(e) => {
              e.stopPropagation();
              setIsImageZoomed(false);
            }}
          >
            <X className="w-6 h-6" />
          </button>
          
          <div 
            className="relative w-full max-w-5xl px-4 md:px-10 flex items-center justify-center animate-in zoom-in-95 duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            <img 
              src={getPieceImage(safePiece.id) || ""} 
              alt={safePiece.descricao}
              className="max-w-full max-h-[85vh] object-contain rounded-2xl shadow-2xl border border-white/10"
            />
            
            <div className="absolute -bottom-16 left-1/2 -translate-x-1/2 text-center space-y-1">
              <p className="text-white font-bold text-lg">{safePiece.descricao}</p>
              <p className="text-zinc-400 text-xs uppercase tracking-widest">{safePiece.id}</p>
            </div>
          </div>
        </div>
      )}
    </Tabs>
  );
}
