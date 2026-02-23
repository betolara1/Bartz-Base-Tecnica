import { useState, useEffect, useRef } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import { ScrollArea } from "./ui/scroll-area";
import {
  Search,
  X,
  Package,
  Clock,
  TrendingUp,
  Settings,
  EyeOff,
  Eye,
  Sparkles,
  ArrowRight,
  Filter,
  Zap
} from "lucide-react";
import { PieceData, searchPieces } from "../data/catalog";
import { SmartBadge } from "./DesignSystem";

interface SmartSearchProps {
  value: string;
  onChange: (value: string) => void;
  onSelectPiece: (piece: PieceData) => void;
  placeholder?: string;
  isAdminMode?: boolean;
  hiddenElements?: Set<string>;
  onToggleElement?: (elementId: string) => void;
}

export function SmartSearch({
  value,
  onChange,
  onSelectPiece,
  placeholder = "Buscar especificações...",
  isAdminMode = false,
  hiddenElements = new Set(),
  onToggleElement
}: SmartSearchProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [results, setResults] = useState<PieceData[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Load recent searches from localStorage
    try {
      const stored = localStorage.getItem('bartz-recent-searches');
      if (stored) {
        setRecentSearches(JSON.parse(stored));
      }
    } catch (error) {
      console.warn("Error loading recent searches:", error);
    }
  }, []);

  useEffect(() => {
    if (value.trim()) {
      setIsSearching(true);

      // Debounce search
      const timeoutId = setTimeout(() => {
        try {
          const searchResults = searchPieces(value);
          setResults(searchResults.slice(0, 8)); // Limit results for better UX
          setIsSearching(false);
        } catch (error) {
          console.error("Search error:", error);
          setResults([]);
          setIsSearching(false);
        }
      }, 300);

      return () => clearTimeout(timeoutId);
    } else {
      setResults([]);
      setIsSearching(false);
    }
  }, [value]);

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        !inputRef.current?.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = (newValue: string) => {
    onChange(newValue);
    setIsOpen(newValue.length > 0);
  };

  const handlePieceSelect = (piece: PieceData) => {
    // Add to recent searches
    const newRecentSearches = [piece.descricao, ...recentSearches.filter(s => s !== piece.descricao)].slice(0, 5);
    setRecentSearches(newRecentSearches);

    try {
      localStorage.setItem('bartz-recent-searches', JSON.stringify(newRecentSearches));
    } catch (error) {
      console.warn("Error saving recent search:", error);
    }

    onSelectPiece(piece);
    setIsOpen(false);
  };

  const handleClear = () => {
    onChange("");
    setResults([]);
    setIsOpen(false);
    inputRef.current?.focus();
  };

  const handleRecentSearch = (searchTerm: string) => {
    onChange(searchTerm);
    setIsOpen(true);
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
    try {
      localStorage.removeItem('bartz-recent-searches');
    } catch (error) {
      console.warn("Error clearing recent searches:", error);
    }
  };

  // Popular categories for quick access (internal logic, not exposed)
  const quickCategories = [
    "Portas",
    "Gavetas",
    "Prateleiras",
    "Laterais",
    "Fundos"
  ];

  return (
    <div className="relative group/search">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
          <Search className="h-4 w-4 text-zinc-400 group-focus-within/search:text-amber-500 transition-colors" />
        </div>
        <Input
          ref={inputRef}
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={(e) => handleInputChange(e.target.value)}
          onFocus={() => setIsOpen(value.length > 0 || recentSearches.length > 0)}
          className="pl-10 pr-10 h-11 rounded-xl glass-card border-zinc-200/50 dark:border-zinc-800/50 shadow-sm focus:ring-4 focus:ring-amber-500/10 focus:border-amber-500/30 dark:focus:border-amber-500/50 transition-all font-medium text-sm"
        />
        {value && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClear}
            className="absolute inset-y-0 right-1 px-2.5 hover:bg-transparent text-zinc-300 hover:text-zinc-500 transition-colors"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Search Results Dropdown */}
      {isOpen && (
        <div
          ref={dropdownRef}
          className="absolute z-50 w-full mt-2 glass-card border border-zinc-200/50 dark:border-zinc-800/50 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        >
          <ScrollArea className="max-h-[420px]">
            <div className="p-3">
              {isSearching && value ? (
                <div className="flex items-center justify-center py-10 text-xs font-bold text-zinc-400 uppercase tracking-widest">
                  <Sparkles className="w-4 h-4 mr-2 animate-pulse text-amber-500" />
                  Buscando especificações...
                </div>
              ) : value ? (
                <>
                  {results.length > 0 ? (
                    <div className="space-y-1.5">
                      <div className="px-3 py-2 text-[10px] font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-2">
                        <Filter className="w-3.5 h-3.5 text-amber-500" />
                        Sugestões Encontradas
                      </div>
                      {results.map((piece) => (
                        <Card
                          key={piece.id}
                          className="cursor-pointer rounded-xl border-0 bg-transparent hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-all group/item"
                          onClick={() => handlePieceSelect(piece)}
                        >
                          <CardContent className="p-3">
                            <div className="flex items-center gap-4">
                              <div className="w-10 h-10 rounded-xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center flex-shrink-0 group-hover/item:scale-110 transition-transform duration-300">
                                <Package className="w-5 h-5 text-zinc-500 group-hover/item:text-amber-500 transition-colors" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="font-bold text-sm text-slate-900 dark:text-white truncate group-hover/item:text-amber-600 dark:group-hover/item:text-amber-400 transition-colors uppercase tracking-tight">
                                  {piece.descricao}
                                </div>
                                <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-tight flex items-center gap-1.5">
                                  <span className="truncate">{piece.categoria}</span>
                                  <span className="w-1 h-1 rounded-full bg-zinc-200 dark:bg-zinc-700" />
                                  <span className="truncate text-zinc-500 dark:text-zinc-400">{piece.subcategoria}</span>
                                </div>
                              </div>
                              <div className="flex items-center gap-3 flex-shrink-0">
                                <ArrowRight className="w-4 h-4 text-zinc-300 group-hover/item:text-amber-500 group-hover/item:translate-x-1 transition-all" />
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-zinc-50 dark:bg-zinc-900 flex items-center justify-center border border-zinc-100 dark:border-zinc-800">
                        <Search className="w-6 h-6 text-zinc-300" />
                      </div>
                      <div className="text-sm font-bold text-slate-900 dark:text-white mb-1 uppercase tracking-tight">
                        Nenhum resultado
                      </div>
                      <div className="text-xs font-bold text-zinc-400 uppercase tracking-tighter">
                        Tente outros termos de busca
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="space-y-6 pt-2">
                  {/* Recent Searches */}
                  {recentSearches.length > 0 && !hiddenElements.has('recent-searches') && (
                    <div>
                      <div className="flex items-center justify-between px-3 mb-3">
                        <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-2">
                          <Clock className="w-3.5 h-3.5 text-zinc-400" />
                          Consultas Recentes
                        </div>
                        <div className="flex items-center gap-3">
                          {isAdminMode && onToggleElement && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => onToggleElement('recent-searches')}
                              className="h-6 w-6 p-0 text-zinc-300 hover:text-zinc-500 transition-colors"
                            >
                              <EyeOff className="w-3.5 h-3.5" />
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={clearRecentSearches}
                            className="h-6 px-2.5 text-[10px] font-bold uppercase tracking-widest text-zinc-400 hover:text-red-500 transition-colors"
                          >
                            Limpar
                          </Button>
                        </div>
                      </div>
                      <div className="space-y-1">
                        {recentSearches.map((search, index) => (
                          <div
                            key={index}
                            onClick={() => handleRecentSearch(search)}
                            className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-zinc-50 dark:hover:bg-zinc-800/50 cursor-pointer group/recent transition-all"
                          >
                            <div className="w-6 h-6 rounded-lg bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center">
                              <Clock className="w-3 h-3 text-zinc-400 group-hover/recent:text-amber-500 transition-colors" />
                            </div>
                            <span className="flex-1 text-sm font-bold text-slate-700 dark:text-zinc-300 group-hover/recent:text-slate-900 dark:group-hover/recent:text-white truncate uppercase tracking-tight">
                              {search}
                            </span>
                            <ArrowRight className="w-3.5 h-3.5 text-zinc-200 group-hover/recent:text-amber-500 transition-all transform opacity-0 group-hover/recent:opacity-100 group-hover/recent:translate-x-1" />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {recentSearches.length > 0 && <Separator className="bg-zinc-100 dark:bg-zinc-800" />}

                  {/* Quick Categories */}
                  {!hiddenElements.has('quick-categories') && (
                    <div className="pb-2">
                      <div className="flex items-center justify-between px-3 mb-3">
                        <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-2">
                          <Zap className="w-3.5 h-3.5 text-amber-500" />
                          Atalhos de Categoria
                        </div>
                        {isAdminMode && onToggleElement && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onToggleElement('quick-categories')}
                            className="h-6 w-6 p-0 text-zinc-300 hover:text-zinc-500"
                          >
                            <EyeOff className="w-3.5 h-3.5" />
                          </Button>
                        )}
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        {quickCategories.map((category) => (
                          <div
                            key={category}
                            onClick={() => handleRecentSearch(category)}
                            className="flex items-center gap-2 px-3 py-3 rounded-xl border border-zinc-100 dark:border-zinc-800 hover:border-amber-200 hover:bg-amber-50/30 dark:hover:bg-amber-500/5 cursor-pointer group/cat transition-all"
                          >
                            <div className="w-2 h-2 rounded-full bg-zinc-200 dark:bg-zinc-700 group-hover/cat:bg-amber-500 transition-colors" />
                            <span className="flex-1 text-xs font-bold text-slate-600 dark:text-zinc-400 group-hover/cat:text-amber-600 dark:group-hover/cat:text-amber-400 uppercase tracking-widest truncate">
                              {category}
                            </span>
                            <ArrowRight className="w-3 h-3 text-zinc-200 group-hover/cat:text-amber-500 opacity-0 group-hover/cat:opacity-100" />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </ScrollArea>
        </div>
      )}
    </div>
  );
}
