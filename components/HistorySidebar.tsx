import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { ScrollArea } from "./ui/scroll-area";
import { Separator } from "./ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";
import {
  Clock,
  Package2,
  Play,
  ChevronRight,
  Trash2,
  BookOpen,
  TrendingUp,
  Info,
  Heart,
  Star
} from "lucide-react";
import {
  getPiecesHistory,
  clearPiecesHistory,
  formatTimeAgo,
  type HistoryItem
} from "../utils/history";
import {
  getFavoritePieces,
  getFavoriteTutorials,
  clearPiecesFavorites,
  clearTutorialsFavorites,
  removePieceFromFavorites,
  removeTutorialFromFavorites,
  type FavoritePiece,
  type FavoriteTutorial
} from "../utils/favorites";
import { TutorialData } from "../data/tutorials";

interface HistorySidebarProps {
  onSelectPiece: (pieceId: string) => void;
  onSelectTutorial?: (tutorial: TutorialData) => void;
}

export function HistorySidebar({ onSelectPiece, onSelectTutorial }: HistorySidebarProps) {
  const [piecesHistory, setPiecesHistory] = useState<HistoryItem[]>([]);
  const [favoritePieces, setFavoritePieces] = useState<FavoritePiece[]>([]);
  const [favoriteTutorials, setFavoriteTutorials] = useState<FavoriteTutorial[]>([]);
  const [activeTab, setActiveTab] = useState<"pieces" | "favorites">("pieces");

  const loadHistory = () => {
    setPiecesHistory(getPiecesHistory());
  };

  const loadFavorites = () => {
    setFavoritePieces(getFavoritePieces());
    setFavoriteTutorials(getFavoriteTutorials());
  };

  useEffect(() => {
    loadHistory();
    loadFavorites();

    // Listen for history updates
    const handleHistoryUpdate = () => {
      loadHistory();
    };

    const handleFavoritesUpdate = () => {
      loadFavorites();
    };

    window.addEventListener('historyUpdated', handleHistoryUpdate);
    window.addEventListener('favoritesUpdated', handleFavoritesUpdate);

    return () => {
      window.removeEventListener('historyUpdated', handleHistoryUpdate);
      window.removeEventListener('favoritesUpdated', handleFavoritesUpdate);
    };
  }, []);

  const handleClearPiecesHistory = () => {
    clearPiecesHistory();
    setPiecesHistory([]);
  };

  const handleClearPiecesFavorites = () => {
    clearPiecesFavorites();
    setFavoritePieces([]);
  };

  const handleClearTutorialsFavorites = () => {
    clearTutorialsFavorites();
    setFavoriteTutorials([]);
  };

  const handleRemovePieceFavorite = (id: string) => {
    removePieceFromFavorites(id);
    setFavoritePieces(prev => prev.filter(f => f.id !== id));
  };

  const handleRemoveTutorialFavorite = (id: string) => {
    removeTutorialFromFavorites(id);
    setFavoriteTutorials(prev => prev.filter(f => f.id !== id));
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Básico":
        return "bg-green-100 text-green-700 border-green-200";
      case "Intermediário":
        return "bg-amber-100 text-amber-700 border-amber-200";
      case "Avançado":
        return "bg-red-100 text-red-700 border-red-200";
      default:
        return "bg-slate-100 text-slate-700 border-slate-200";
    }
  };

  const InfoTooltip = ({ content, children }: { content: string; children: React.ReactNode }) => (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="flex items-center gap-2 cursor-help">
            {children}
            <Info className="w-3 h-3 text-slate-400 hover:text-slate-600 transition-colors" />
          </div>
        </TooltipTrigger>
        <TooltipContent side="right" className="max-w-xs">
          <p className="text-sm">{content}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );

  const favoritesCount = favoritePieces.length + favoriteTutorials.length;

  return (
    <div className="h-full flex flex-col glass-card border-none">
      <div className="p-5 border-b border-zinc-100/50 dark:border-zinc-800/50">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-amber-500/10 text-amber-500">
            <Clock className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-widest">
              Atividade
            </h3>
            <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-tighter">Histórico e Favoritos</p>
          </div>
        </div>
      </div>

      <div className="flex-1 min-h-0">
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "pieces" | "favorites")} className="h-full flex flex-col">
          <div className="px-5 pt-4 pb-2">
            <TabsList className="grid w-full grid-cols-2 h-10 bg-zinc-100/50 dark:bg-zinc-900/50 p-1 rounded-xl">
              <TabsTrigger value="pieces" className="text-[10px] font-bold uppercase tracking-widest rounded-lg transition-all data-[state=active]:bg-white dark:data-[state=active]:bg-zinc-800 data-[state=active]:shadow-sm data-[state=active]:text-amber-600">
                Peças
              </TabsTrigger>
              <TabsTrigger value="favorites" className="text-[10px] font-bold uppercase tracking-widest rounded-lg transition-all data-[state=active]:bg-white dark:data-[state=active]:bg-zinc-800 data-[state=active]:shadow-sm data-[state=active]:text-amber-600">
                Salvos
              </TabsTrigger>
            </TabsList>
          </div>

          <div className="flex-1 min-h-0">
            <TabsContent value="pieces" className="h-full m-0 px-5 pb-5">
              {piecesHistory.length > 0 ? (
                <div className="h-full flex flex-col">
                  <div className="flex items-center justify-between mb-4 pt-2">
                    <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Recentes ({piecesHistory.length})</span>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleClearPiecesHistory}
                            className="h-7 w-7 p-0 text-zinc-300 hover:text-red-500 transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent side="left" className="glass-card border-zinc-200/50">
                          <p className="text-[10px] font-bold uppercase tracking-widest">Limpar histórico</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>

                  <ScrollArea className="flex-1 pr-2 -mr-2">
                    <div className="space-y-2">
                      {piecesHistory.map((item, index) => (
                        <div key={`${item.id}-${item.timestamp}`}>
                          <div
                            className="group p-3 rounded-xl border border-transparent hover:border-zinc-100 dark:hover:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-900/50 cursor-pointer transition-all duration-300"
                            onClick={() => onSelectPiece(item.id)}
                          >
                            <div className="flex items-start gap-3">
                              <div className="w-5 h-5 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-400 group-hover:text-amber-500 group-hover:bg-amber-500/10 text-[9px] font-bold flex items-center justify-center flex-shrink-0 transition-colors">
                                {index + 1}
                              </div>

                              <div className="flex-1 min-w-0">
                                <div className="font-bold text-xs text-slate-900 dark:text-zinc-200 truncate mb-1 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors uppercase tracking-tight">
                                  {item.descricao}
                                </div>

                                <div className="flex items-center gap-1.5 text-[10px] font-bold text-zinc-400 uppercase tracking-tighter mb-1.5 opacity-70">
                                  <span>{item.categoria}</span>
                                  <ChevronRight className="w-2.5 h-2.5" />
                                  <span className="text-zinc-500">{item.subcategoria}</span>
                                </div>

                                <div className="flex items-center gap-1.5 text-[9px] font-bold text-zinc-400 uppercase tracking-widest opacity-60">
                                  <Clock className="w-3 h-3" />
                                  <span>{formatTimeAgo(item.timestamp)}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-center py-10 opacity-50">
                  <div className="w-12 h-12 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 flex items-center justify-center mb-4">
                    <Package2 className="w-6 h-6 text-zinc-300" />
                  </div>
                  <h4 className="font-bold text-xs text-slate-900 dark:text-white mb-1 uppercase tracking-tight">Vazio</h4>
                  <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-tighter">
                    Você ainda não consultou peças.
                  </p>
                </div>
              )}
            </TabsContent>


            <TabsContent value="favorites" className="h-full m-0 px-5 pb-5">
              {favoritesCount > 0 ? (
                <div className="h-full flex flex-col">
                  <div className="flex items-center justify-between mb-4 pt-2">
                    <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Coleção ({favoritesCount})</span>
                    <div className="flex items-center gap-1">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={handleClearPiecesFavorites}
                              className="h-7 w-7 p-0 text-zinc-300 hover:text-red-500 transition-colors"
                              disabled={favoritePieces.length === 0}
                            >
                              <Package2 className="w-3.5 h-3.5" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent className="glass-card border-zinc-200/50">
                            <p className="text-[10px] font-bold uppercase tracking-widest">Limpar peças</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={handleClearTutorialsFavorites}
                              className="h-7 w-7 p-0 text-zinc-300 hover:text-red-500 transition-colors"
                              disabled={favoriteTutorials.length === 0}
                            >
                              <Play className="w-3.5 h-3.5" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent className="glass-card border-zinc-200/50">
                            <p className="text-[10px] font-bold uppercase tracking-widest">Limpar aulas</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </div>

                  <ScrollArea className="flex-1 pr-2 -mr-2">
                    <div className="space-y-4">
                      {/* Favorite Pieces */}
                      {favoritePieces.length > 0 && (
                        <div className="space-y-1.5">
                          {favoritePieces.map((item) => (
                            <div
                              key={item.id}
                              className="group p-3 rounded-xl border border-pink-50 dark:border-pink-900/20 bg-pink-50/30 dark:bg-pink-500/5 hover:bg-pink-50 dark:hover:bg-pink-500/10 cursor-pointer transition-all duration-300"
                            >
                              <div className="flex items-start gap-3">
                                <div className="w-8 h-8 rounded-lg bg-pink-100 dark:bg-pink-500/20 text-pink-500 flex items-center justify-center flex-shrink-0">
                                  <Heart className="w-4 h-4 fill-current" />
                                </div>

                                <div
                                  className="flex-1 min-w-0 cursor-pointer"
                                  onClick={() => onSelectPiece(item.id)}
                                >
                                  <div className="font-bold text-xs text-slate-900 dark:text-zinc-200 truncate mb-1 group-hover:text-pink-600 transition-colors uppercase tracking-tight">
                                    {item.descricao}
                                  </div>

                                  <div className="flex items-center gap-1.5 text-[9px] font-bold text-zinc-400 uppercase tracking-widest opacity-70">
                                    <span>{item.categoria}</span>
                                    <ChevronRight className="w-2.5 h-2.5" />
                                    <span>{item.subcategoria}</span>
                                  </div>
                                </div>

                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleRemovePieceFavorite(item.id);
                                  }}
                                  className="h-6 w-6 p-0 text-pink-300 hover:text-pink-600 opacity-0 group-hover:opacity-100 transition-all"
                                >
                                  <Trash2 className="w-3 h-3" />
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Favorite Tutorials */}
                      {favoriteTutorials.length > 0 && (
                        <div className="space-y-1.5">
                          {favoriteTutorials.map((item) => (
                            <div
                              key={item.id}
                              className="group p-3 rounded-xl border border-amber-50 dark:border-amber-900/20 bg-amber-50/30 dark:bg-amber-500/5 hover:bg-amber-50 dark:hover:bg-amber-500/10 cursor-pointer transition-all duration-300"
                            >
                              <div className="flex items-start gap-4">
                                <div className="w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-500/20 text-amber-500 flex items-center justify-center flex-shrink-0">
                                  <Star className="w-4 h-4 fill-current" />
                                </div>

                                <div
                                  className="flex-1 min-w-0 cursor-pointer"
                                  onClick={() => onSelectTutorial && onSelectTutorial(item as any)}
                                >
                                  <div className="font-bold text-xs text-slate-900 dark:text-zinc-200 truncate mb-1 group-hover:text-amber-600 transition-colors uppercase tracking-tight">
                                    {item.title}
                                  </div>

                                  <div className="flex items-center gap-1.5 text-[9px] font-bold text-zinc-400 uppercase tracking-widest opacity-70">
                                    <Badge variant="outline" className="text-[8px] h-4 px-1 border-amber-200 text-amber-600 uppercase tracking-widest font-bold">Tutorial</Badge>
                                    <span>{item.duration}</span>
                                  </div>
                                </div>

                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleRemoveTutorialFavorite(item.id);
                                  }}
                                  className="h-6 w-6 p-0 text-amber-300 hover:text-amber-600 opacity-0 group-hover:opacity-100 transition-all"
                                >
                                  <Trash2 className="w-3 h-3" />
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </ScrollArea>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-center py-10 opacity-50">
                  <div className="w-12 h-12 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 flex items-center justify-center mb-4">
                    <Heart className="w-6 h-6 text-zinc-300" />
                  </div>
                  <h4 className="font-bold text-xs text-slate-900 dark:text-white mb-1 uppercase tracking-tight">Coleção vazia</h4>
                  <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-tighter">
                    Reserve seus favoritos para acesso rápido.
                  </p>
                </div>
              )}
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
}
