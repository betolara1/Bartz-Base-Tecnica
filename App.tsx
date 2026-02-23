import { useState, useEffect } from "react";
import { Button } from "./components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./components/ui/select";
import { Badge } from "./components/ui/badge";
import {
  Grid3X3,
  List,
  Package2,
  Search,
  Filter,
  Settings,
  Moon,
  Sun,
  Menu,
  X,
  Smartphone,
  Tablet,
  Monitor,
  Loader2,
  ChevronRight,
  TrendingUp,
} from "lucide-react";
import { PieceCard } from "./components/PieceCard";
import { PieceDetails } from "./components/PieceDetails";
import { SmartSearch } from "./components/SmartSearch";
import { HistorySidebar } from "./components/HistorySidebar";
import { AdminPanel } from "./components/AdminPanel";
import { BartztLogo } from "./components/BartztLogo";
import { MobileHeader } from "./components/MobileHeader";
import { ThemeProvider, useTheme } from "./components/ThemeProvider";
import { ErrorBoundary } from "./components/ErrorBoundary";
import {
  catalogData,
  getCategories,
  getSubcategories,
  getPiecesByCategory,
  searchPieces,
  getPieceById,
  PieceData,
} from "./data/catalog";
import { TutorialData } from "./data/tutorials";
import { addToHistory } from "./utils/history";
import { acabamentosData } from "./data/acabamentos";

type ViewMode = "grid" | "list";
type DevicePreview = "desktop" | "tablet" | "mobile";

function AppContent() {
  const { theme, toggleTheme, isLoading: themeLoading } = useTheme();

  // Core state
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [selectedPiece, setSelectedPiece] = useState<PieceData | null>(null);
  const [filteredPieces, setFilteredPieces] = useState<PieceData[]>(catalogData);
  const [devicePreview, setDevicePreview] = useState<DevicePreview>("desktop");

  // UI state
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [hiddenElements, setHiddenElements] = useState<Set<string>>(new Set());
  const [isMobile, setIsMobile] = useState(false);

  // Wave animation state
  const [waveIndex, setWaveIndex] = useState(0);

  // Detect mobile
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) {
        setSidebarOpen(false);
      }
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Wave animation effect
  useEffect(() => {
    const interval = setInterval(() => {
      setWaveIndex(prev => (prev + 1) % 3); // Cycle through 3 states
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // Filter pieces
  useEffect(() => {
    let pieces: PieceData[] = [];

    if (searchQuery.trim()) {
      pieces = searchPieces(searchQuery);
    } else {
      pieces = getPiecesByCategory(
        selectedCategory === "all" ? undefined : selectedCategory,
        selectedSubcategory === "all" ? undefined : selectedSubcategory
      );
    }

    // Filter out hidden elements in admin mode
    if (isAdminMode) {
      pieces = pieces.filter(piece => !hiddenElements.has(piece.id));
    }

    setFilteredPieces(pieces);
  }, [selectedCategory, selectedSubcategory, searchQuery, hiddenElements, isAdminMode]);

  // Scroll to top when piece is selected or filters change
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }, [selectedPiece, selectedCategory, selectedSubcategory, searchQuery]);

  const categories = getCategories();
  const subcategories = selectedCategory === "all" ? [] : getSubcategories(selectedCategory);

  // Event handlers
  const handlePieceSelect = (pieceOrId: PieceData | string) => {
    let piece: PieceData | undefined;

    if (typeof pieceOrId === 'string') {
      piece = getPieceById(pieceOrId);
    } else {
      piece = pieceOrId;
    }

    if (!piece) return;

    setSelectedPiece(piece);
    addToHistory({
      id: piece.id,
      categoria: piece.categoria,
      subcategoria: piece.subcategoria,
      descricao: piece.descricao || '',
    });
  };

  const handleTutorialSelect = (tutorial: TutorialData) => {
    // Only used to open the modal now. History is no longer tracked.
  };

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCategory("all");
    setSelectedSubcategory("all");
  };

  const toggleElementVisibility = (elementId: string) => {
    const newHidden = new Set(hiddenElements);
    if (newHidden.has(elementId)) {
      newHidden.delete(elementId);
    } else {
      newHidden.add(elementId);
    }
    setHiddenElements(newHidden);
  };

  // Acabamentos carousel state
  const [acabamentosScrollIndex, setAcabamentosScrollIndex] = useState(0);
  const maxAcabamentosPerView = 8;

  const nextAcabamentos = () => {
    const max = Math.max(0, acabamentosData.length - maxAcabamentosPerView);
    setAcabamentosScrollIndex(prev => Math.min(prev + maxAcabamentosPerView, max));
  };

  const prevAcabamentos = () => {
    setAcabamentosScrollIndex(prev => Math.max(prev - maxAcabamentosPerView, 0));
  };

  // Helper function to get color from acabamento name
  const getColorFromAcabamento = (nome: string): string => {
    const colors = {
      branco: '#FFFFFF',
      preto: '#1a1a1a',
      cinza: '#808080',
      bege: '#F5F5DC',
      grafito: '#2C2C2C',
      nogueira: '#8B4513',
      carvalho: '#DEB887',
      imbuia: '#8B6914',
      azul: '#4169E1',
      verde: '#228B22',
      bronze: '#CD7F32',
      dourado: '#FFD700',
      prata: '#C0C0C0',
      marmo: '#E8E8E8',
      petra: '#696969',
      mint: '#98FB98',
      damasco: '#FFCBA4',
      camelo: '#C19A6B',
      reali: '#8B7355',
      quartzo: '#E6E6FA',
      petar: '#B8860B',
      ébano: '#2F4F4F',
      louro: '#CD853F'
    };

    const lowerName = nome.toLowerCase();
    for (const [key, color] of Object.entries(colors)) {
      if (lowerName.includes(key)) {
        return color;
      }
    }
    return '#D1D5DB';
  };

  // Loading state
  if (themeLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-600 to-orange-600 flex items-center justify-center">
            <BartztLogo size={24} className="text-white" />
          </div>
          <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
        </div>
      </div>
    );
  }

  // Admin Panel
  if (isAdminMode && !selectedPiece) {
    return (
      <div className="min-h-screen bg-background">
        <AdminPanel onClose={() => setIsAdminMode(false)} />
      </div>
    );
  }

  // Piece details view
  if (selectedPiece) {
    return (
      <div className="min-h-screen bg-background">
        <PieceDetails
          piece={selectedPiece}
          onBack={() => setSelectedPiece(null)}
          onSelectPiece={handlePieceSelect}
          onSelectTutorial={handleTutorialSelect}
          isAdminMode={isAdminMode}
        />
      </div>
    );
  }

  // Mobile view
  if (isMobile) {
    return (
      <div className="min-h-screen bg-background">
        <MobileHeader
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onPieceSelect={handlePieceSelect}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          categories={categories}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          theme={theme}
          onThemeToggle={toggleTheme}
          isAdminMode={isAdminMode}
          onToggleAdminMode={() => setIsAdminMode(!isAdminMode)}
          hiddenElements={hiddenElements}
          onToggleElement={toggleElementVisibility}
        />

        <main className="p-4">
          {/* Results summary */}
          {(searchQuery || selectedCategory !== "all") && (
            <div className="mb-4 p-3 bg-card rounded-lg border">
              <div className="flex items-center gap-2">
                <Search className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm text-foreground">
                  {searchQuery ? `"${searchQuery}"` : selectedCategory}
                </span>
                <Badge variant="secondary" className="text-xs">
                  {filteredPieces.length}
                </Badge>
              </div>
            </div>
          )}

          {/* Content */}
          {filteredPieces.length > 0 ? (
            <div className={
              viewMode === "grid"
                ? "grid gap-4 grid-cols-1 sm:grid-cols-2"
                : "space-y-4"
            }>
              {filteredPieces.map((piece, index) => (
                <PieceCard
                  key={piece.id}
                  piece={piece}
                  onSelect={handlePieceSelect}
                  variant={viewMode}
                  isAdminMode={isAdminMode}
                  onToggleVisibility={() => toggleElementVisibility(piece.id)}
                  isHidden={hiddenElements.has(piece.id)}
                  waveIndex={waveIndex}
                  cardIndex={index}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
                <Package2 className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Nenhuma especificação encontrada
              </h3>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                {searchQuery
                  ? `Não encontramos especificações para "${searchQuery}"`
                  : "Não há especificações nesta categoria"}
              </p>
              <Button variant="outline" onClick={clearFilters}>
                Ver todas as especificações
              </Button>
            </div>
          )}
        </main>
      </div>
    );
  }

  // Desktop layout
  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'w-72' : 'w-0'} transition-all duration-500 ease-in-out overflow-hidden border-r border-zinc-200/50 dark:border-zinc-800/50 bg-white dark:bg-zinc-950`}>
        <div className="h-full w-72 flex flex-col">
          {/* Sidebar Header */}
          <div className="px-6 py-8 border-b border-zinc-100 dark:border-zinc-800/50">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 rounded-2xl premium-gradient premium-shadow flex items-center justify-center transform hover:rotate-6 transition-transform shrink-0">
                <BartztLogo size={24} className="text-white" />
              </div>
              <div>
                <h1 className="text-xl font-black text-slate-900 dark:text-white tracking-tighter uppercase">Bartz</h1>
                <p className="text-[9px] font-black text-zinc-400 uppercase tracking-[0.2em]">Base de Especificações</p>
              </div>
            </div>

            {/* System Status Badge */}
            <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/30">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
              <span className="text-[10px] font-black text-emerald-700 dark:text-emerald-400 uppercase tracking-widest">Sistema Institucional</span>
            </div>
          </div>

          {/* Filters */}
          <div className="px-6 py-6 border-b border-zinc-100 dark:border-zinc-800/50">
            <p className="text-[9px] font-black text-zinc-400 uppercase tracking-[0.2em] mb-5 flex items-center gap-2">
              <Filter className="w-3 h-3" />
              Filtros Avançados
            </p>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-[9px] font-black text-zinc-400 uppercase tracking-widest block">Categoria</label>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-full h-10 rounded-xl border-zinc-200 dark:border-zinc-800 text-xs font-bold">
                    <SelectValue placeholder="Todas as categorias" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas as categorias</SelectItem>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>{category}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {subcategories.length > 0 && selectedCategory !== "all" && (
                <div className="space-y-2">
                  <label className="text-[9px] font-black text-zinc-400 uppercase tracking-widest block">Subcategoria</label>
                  <Select value={selectedSubcategory} onValueChange={setSelectedSubcategory}>
                    <SelectTrigger className="w-full h-10 rounded-xl border-zinc-200 dark:border-zinc-800 text-xs font-bold">
                      <SelectValue placeholder="Todas as subcategorias" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todas as subcategorias</SelectItem>
                      {subcategories.map((subcategory) => (
                        <SelectItem key={subcategory} value={subcategory}>{subcategory}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {(searchQuery || selectedCategory !== "all" || selectedSubcategory !== "all") && (
                <button
                  onClick={clearFilters}
                  className="w-full h-9 rounded-xl text-[10px] font-black uppercase tracking-widest text-zinc-500 border border-zinc-200 dark:border-zinc-700 hover:border-amber-500/50 hover:text-amber-600 hover:bg-amber-500/5 transition-all"
                >
                  Limpar filtros
                </button>
              )}
            </div>
          </div>

          {/* Statistics */}
          <div className="px-6 py-6 border-b border-zinc-100 dark:border-zinc-800/50">
            <p className="text-[9px] font-black text-zinc-400 uppercase tracking-[0.2em] mb-5 flex items-center gap-2">
              <TrendingUp className="w-3 h-3" />
              Estatísticas
            </p>

            <div className="space-y-3">
              {[
                { label: 'Total de especificações', value: catalogData.length },
                { label: 'Resultados atuais', value: filteredPieces.length, highlight: true },
                { label: 'Categorias', value: categories.length },
              ].map(stat => (
                <div key={stat.label} className="flex items-center justify-between py-1">
                  <span className="text-[11px] font-medium text-zinc-500">{stat.label}</span>
                  <span className={`text-sm font-black tabular-nums ${stat.highlight ? 'text-amber-600' : 'text-slate-900 dark:text-white'}`}>
                    {stat.value}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* History Sidebar */}
          <div className="flex-1">
            <HistorySidebar
              onSelectPiece={handlePieceSelect}
              onSelectTutorial={handleTutorialSelect}
            />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col bg-zinc-50/30 dark:bg-zinc-950/30">
        {/* Header */}
        <header className="sticky top-0 z-10 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-xl border-b border-zinc-200/50 dark:border-zinc-800/50 px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="h-9 w-9 p-0 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all"
              >
                {sidebarOpen ? <X className="w-4 h-4 text-zinc-500" /> : <Menu className="w-4 h-4 text-zinc-500" />}
              </Button>

              <div>
                <h2 className="text-lg font-black text-slate-900 dark:text-white tracking-tight uppercase">Catálogo Técnico</h2>
                {(searchQuery || selectedCategory !== "all") && (
                  <p className="text-[9px] font-black text-amber-600 uppercase tracking-[0.15em] mt-0.5">
                    {filteredPieces.length} resultados encontrados
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* View Mode */}
              <div className="flex items-center gap-1 p-1 rounded-xl bg-zinc-100 dark:bg-zinc-800">
                {([{ v: 'grid', Icon: Grid3X3 }, { v: 'list', Icon: List }] as const).map(({ v, Icon }) => (
                  <button
                    key={v}
                    onClick={() => setViewMode(v as ViewMode)}
                    className={`p-2 rounded-lg transition-all ${viewMode === v ? 'bg-white dark:bg-zinc-700 shadow-sm text-slate-900 dark:text-white' : 'text-zinc-400 hover:text-zinc-600'}`}
                  >
                    <Icon className="w-4 h-4" />
                  </button>
                ))}
              </div>

              <div className="w-px h-6 bg-zinc-200 dark:bg-zinc-700" />

              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className="p-2 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-400 hover:text-zinc-600 transition-all"
              >
                {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Search */}
          <SmartSearch
            value={searchQuery}
            onChange={setSearchQuery}
            onSelectPiece={handlePieceSelect}
            placeholder="Buscar especificações técnicas..."
            isAdminMode={isAdminMode}
            hiddenElements={hiddenElements}
            onToggleElement={toggleElementVisibility}
          />
        </header>

        {/* Content */}
        <main className="flex-1 p-6">
          {filteredPieces.length > 0 ? (
            <div className={
              viewMode === "grid"
                ? `grid gap-6 ${devicePreview === "tablet"
                  ? "grid-cols-2 lg:grid-cols-3"
                  : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                }`
                : "space-y-4"
            }>
              {filteredPieces.map((piece, index) => (
                <PieceCard
                  key={piece.id}
                  piece={piece}
                  onSelect={handlePieceSelect}
                  variant={viewMode}
                  isAdminMode={isAdminMode}
                  onToggleVisibility={() => toggleElementVisibility(piece.id)}
                  isHidden={hiddenElements.has(piece.id)}
                  waveIndex={waveIndex}
                  cardIndex={index}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-32 text-center">
              <div className="w-24 h-24 mb-8 rounded-[32px] bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex items-center justify-center">
                <Package2 className="w-10 h-10 text-zinc-300 dark:text-zinc-700" />
              </div>
              <h3 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight mb-3">
                Nenhum resultado
              </h3>
              <p className="text-sm text-zinc-500 font-medium mb-8 max-w-sm leading-relaxed">
                {searchQuery
                  ? `Nenhuma especificação encontrada para "${searchQuery}".`
                  : "Nenhuma especificação disponível para os filtros selecionados."}
              </p>
              <button
                onClick={clearFilters}
                className="h-11 px-8 rounded-2xl bg-amber-500 text-white text-[10px] font-black uppercase tracking-widest hover:bg-amber-600 transition-all shadow-lg shadow-amber-500/30"
              >
                Limpar filtros
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider defaultTheme="light">
      <ErrorBoundary>
        <AppContent />
      </ErrorBoundary>
    </ThemeProvider>
  );
}