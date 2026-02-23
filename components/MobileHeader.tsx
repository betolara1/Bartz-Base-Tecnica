import React, { useState } from "react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "./ui/sheet";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
  DialogDescription,
  DialogHeader,
} from "./ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Separator } from "./ui/separator";
import {
  Menu,
  Search,
  Filter,
  Settings,
  Moon,
  Sun,
  Plus,
  Palette,
  X,
  Grid3X3,
  List,
  Package2,
} from "lucide-react";
import { BartztLogo } from "./BartztLogo";
import { SmartSearch } from "./SmartSearch";
import { HistorySidebar } from "./HistorySidebar";
import { StyleGuide, SmartBadge } from "./DesignSystem";
import { useTheme } from "./ThemeProvider";
import { PieceData } from "../data/catalog";
import { TutorialData } from "../data/tutorials";
import { getCategoryStats } from "../data/catalog";

type ViewMode = "grid" | "list";

interface MobileHeaderProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  onPieceSelect: (piece: PieceData | string) => void;
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  categories: string[];
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  theme: string;
  onThemeToggle: () => void;
  isAdminMode: boolean;
  onToggleAdminMode: () => void;
  hiddenElements: Set<string>;
  onToggleElement: (elementId: string) => void;
}

export function MobileHeader({
  searchQuery,
  onSearchChange,
  onPieceSelect,
  selectedCategory,
  onCategoryChange,
  categories,
  viewMode,
  onViewModeChange,
  theme,
  onThemeToggle,
  isAdminMode,
  onToggleAdminMode,
  hiddenElements,
  onToggleElement,
}: MobileHeaderProps) {
  const [showStyleGuide, setShowStyleGuide] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  // Get category stats safely
  const categoryStats = getCategoryStats() || {};

  const handleSelectTutorial = (tutorial: TutorialData) => {
    // Placeholder for tutorial selection logic
    console.log("Tutorial selected:", tutorial);
  };

  return (
    <>
      {/* Mobile Header */}
      <div className={`sticky top-0 z-50 border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60 ${theme === 'dark'
          ? 'bg-gradient-to-r from-slate-800/95 via-slate-700/95 to-slate-900/95'
          : 'bg-gradient-to-r from-amber-600/95 via-orange-600/95 to-amber-700/95'
        }`}>
        <div className="flex items-center justify-between p-4">
          {/* Logo and Brand */}
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className="relative">
              <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center transition-all duration-300 shadow-lg border border-white/20">
                <BartztLogo
                  size={28}
                  variant="full"
                  className="text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]"
                />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="text-xl font-bold text-white leading-tight truncate">
                Bartz
              </h1>
              <p className={`text-sm transition-all duration-300 truncate ${theme === 'dark' ? 'text-slate-200' : 'text-orange-100'
                }`}>
                Knowledge Base • Móveis
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 flex-shrink-0">
            {/* Search Toggle */}
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-white/80 hover:text-white hover:bg-white/20 h-9 w-9 p-0"
                >
                  <Search className="w-4 h-4" />
                </Button>
              </SheetTrigger>
              <SheetContent side="top" className="h-[90vh]">
                <SheetHeader>
                  <SheetTitle className="flex items-center gap-2">
                    <Search className="w-5 h-5 text-violet-600" />
                    Busca Inteligente
                  </SheetTitle>
                  <SheetDescription>
                    Encontre peças e especificações técnicas
                  </SheetDescription>
                </SheetHeader>
                <div className="mt-6">
                  <SmartSearch
                    value={searchQuery}
                    onChange={onSearchChange}
                    onSelectPiece={onPieceSelect}
                    placeholder="Buscar peças..."
                    isAdminMode={isAdminMode}
                    hiddenElements={hiddenElements}
                    onToggleElement={onToggleElement}
                  />
                </div>
              </SheetContent>
            </Sheet>

            {/* Filter Toggle */}
            <Sheet open={showFilters} onOpenChange={setShowFilters}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-white/80 hover:text-white hover:bg-white/20 h-9 w-9 p-0 relative"
                >
                  <Filter className="w-4 h-4" />
                  {selectedCategory !== "all" && (
                    <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full" />
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent side="bottom" className="h-[70vh]">
                <SheetHeader>
                  <SheetTitle className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Filter className="w-5 h-5" />
                      Filtros
                    </div>
                    {selectedCategory !== "all" && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          onCategoryChange("all");
                          setShowFilters(false);
                        }}
                        className="text-xs"
                      >
                        <X className="w-3 h-3 mr-1" />
                        Limpar
                      </Button>
                    )}
                  </SheetTitle>
                  <SheetDescription>
                    Filtre por categoria e subcategoria
                  </SheetDescription>
                </SheetHeader>

                <div className="mt-6 space-y-4">
                  <div className="space-y-3">
                    <label className="text-sm font-semibold">Categoria</label>
                    <Select value={selectedCategory} onValueChange={onCategoryChange}>
                      <SelectTrigger className="rounded-xl">
                        <SelectValue placeholder="Todas as categorias" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">
                          <div className="flex items-center justify-between w-full">
                            <span>Todas as categorias</span>
                            <Badge variant="secondary" className="ml-3 text-xs">
                              Total
                            </Badge>
                          </div>
                        </SelectItem>
                        {categories.map((category) => (
                          <SelectItem key={category} value={category}>
                            <div className="flex items-center justify-between w-full">
                              <span>{category}</span>
                              <Badge variant="secondary" className="ml-3 text-xs">
                                {categoryStats[category] || 0}
                              </Badge>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </SheetContent>
            </Sheet>

            {/* Menu */}
            <Sheet open={showHistory} onOpenChange={setShowHistory}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-white/80 hover:text-white hover:bg-white/20 h-9 w-9 p-0"
                >
                  <Menu className="w-4 h-4" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-full sm:w-[350px]">
                <SheetHeader>
                  <SheetTitle>Menu Principal</SheetTitle>
                  <SheetDescription>
                    Acesso rápido e histórico de navegação
                  </SheetDescription>
                </SheetHeader>

                <div className="mt-6 space-y-6">
                  {/* Quick Actions */}
                  <div className="space-y-3">
                    <h3 className="font-semibold">Ações Rápidas</h3>
                    <div className="grid grid-cols-2 gap-3">
                      <Button
                        variant="outline"
                        onClick={onThemeToggle}
                        className="flex flex-col gap-1 h-auto py-3"
                      >
                        {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
                        <span className="text-xs">
                          {theme === 'light' ? 'Escuro' : 'Claro'}
                        </span>
                      </Button>

                      <Dialog open={showStyleGuide} onOpenChange={setShowStyleGuide}>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            className="flex flex-col gap-1 h-auto py-3"
                          >
                            <Palette className="w-4 h-4" />
                            <span className="text-xs">Design</span>
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="w-[95vw] max-w-4xl max-h-[90vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle>Sistema de Design</DialogTitle>
                            <DialogDescription>
                              Componentes e tokens visuais
                            </DialogDescription>
                          </DialogHeader>
                          <StyleGuide />
                        </DialogContent>
                      </Dialog>

                      {isAdminMode && (
                        <Button
                          onClick={() => {
                            onToggleAdminMode();
                            setShowHistory(false);
                          }}
                          className="flex flex-col gap-1 h-auto py-3 col-span-2"
                        >
                          <Plus className="w-4 h-4" />
                          <span className="text-xs">Adicionar Peça</span>
                        </Button>
                      )}
                    </div>
                  </div>

                  <Separator />

                  {/* History */}
                  <div className="flex-1 min-h-0">
                    <HistorySidebar
                      onSelectPiece={onPieceSelect}
                      onSelectTutorial={handleSelectTutorial}
                    />
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        {/* Status Bar */}
        <div className="px-4 pb-3">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 flex-wrap">
              <SmartBadge
                type="category"
                count={0}
                tooltip="Peças disponíveis"
                isAdminMode={isAdminMode}
                onToggle={() => onToggleElement('mobile-piece-count')}
                isHidden={hiddenElements.has('mobile-piece-count')}
              >
                peças
              </SmartBadge>
              {isAdminMode && (
                <Badge variant="outline" className="text-xs bg-white/20 text-white border-white/30">
                  Admin
                </Badge>
              )}
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onViewModeChange(viewMode === "grid" ? "list" : "grid")}
                className="text-white/70 hover:text-white hover:bg-white/20 h-6 w-6 p-0"
              >
                {viewMode === "grid" ? <List className="w-3 h-3" /> : <Grid3X3 className="w-3 h-3" />}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
