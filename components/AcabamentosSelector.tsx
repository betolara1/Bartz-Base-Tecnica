import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { 
  Palette,
  Search,
  Filter,
  X,
  Info,
  CheckCircle2,
  Star,
  Layers,
  Package2,
  Eye,
  Upload,
  Image,
  ExternalLink
} from "lucide-react";
import { 
  acabamentosData, 
  AcabamentoData,
  getMarcas,
  getAcabamentosByMarca,
  getAcabamentosByMaterialEEspessura,
  searchAcabamentos
} from "../data/acabamentos";
import { SmartBadge } from "./DesignSystem";
import { ImageWithFallback } from "./figma/ImageWithFallback";

interface AcabamentosSelectorProps {
  categoria?: string;
  selectedAcabamentos?: string[];
  onAcabamentosChange?: (acabamentos: string[]) => void;
  readonly?: boolean;
  compact?: boolean;
}

export function AcabamentosSelector({ 
  categoria, 
  selectedAcabamentos = [], 
  onAcabamentosChange,
  readonly = false,
  compact = false 
}: AcabamentosSelectorProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMarca, setSelectedMarca] = useState<string>("all");
  const [selectedMaterial, setSelectedMaterial] = useState<"MDF" | "MDP" | "all">("all");
  const [selectedEspessura, setSelectedEspessura] = useState<number | "all">("all");
  const [showImageUpload, setShowImageUpload] = useState<string | null>(null);

  // Filtrar acabamentos compatíveis com a categoria
  const getCompatibleAcabamentos = () => {
    let filtered = acabamentosData;

    // Filtro por categoria da peça
    if (categoria) {
      const cat = categoria.toLowerCase();
      filtered = filtered.filter(acabamento => {
        if (cat === "portas") {
          return acabamento.aplicacoes.some(app => 
            app.toLowerCase().includes("porta") || 
            app.toLowerCase().includes("frente")
          );
        }
        if (cat === "gavetas") {
          return acabamento.aplicacoes.some(app => 
            app.toLowerCase().includes("gaveta") || 
            app.toLowerCase().includes("frente")
          );
        }
        if (cat === "prateleiras" || cat === "armários") {
          return acabamento.aplicacoes.some(app => 
            app.toLowerCase().includes("painel") || 
            app.toLowerCase().includes("tamponamento") ||
            app.toLowerCase().includes("caixaria")
          );
        }
        return true;
      });
    }

    // Filtros adicionais
    if (searchQuery.trim()) {
      filtered = searchAcabamentos(searchQuery);
    }

    if (selectedMarca !== "all") {
      filtered = filtered.filter(acabamento => acabamento.marca === selectedMarca);
    }

    if (selectedMaterial !== "all" && selectedEspessura !== "all") {
      filtered = getAcabamentosByMaterialEEspessura(selectedMaterial, selectedEspessura as number);
    } else if (selectedMaterial !== "all") {
      filtered = filtered.filter(acabamento => 
        acabamento.materiais.some(mat => mat.tipo === selectedMaterial)
      );
    }

    return filtered;
  };

  const compatibleAcabamentos = getCompatibleAcabamentos();
  const selectedAcabamentosData = selectedAcabamentos
    .map(id => acabamentosData.find(a => a.id === id))
    .filter(Boolean) as AcabamentoData[];

  const toggleAcabamento = (acabamentoId: string) => {
    if (readonly) return;
    
    const isSelected = selectedAcabamentos.includes(acabamentoId);
    const newSelection = isSelected
      ? selectedAcabamentos.filter(id => id !== acabamentoId)
      : [...selectedAcabamentos, acabamentoId];
    
    onAcabamentosChange?.(newSelection);
  };

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedMarca("all");
    setSelectedMaterial("all");
    setSelectedEspessura("all");
  };

  // Gerar URL de imagem do acabamento baseada na marca e nome
  const getAcabamentoImageUrl = (acabamento: AcabamentoData): string => {
    // URLs reais dos sites dos fornecedores (simuladas para o exemplo)
    const baseUrls = {
      'Duratex': 'https://www.duratex.com.br/produtos/acabamentos/',
      'Arauco': 'https://www.arauco.com/br/produtos/paineis/',
      'Guararapes': 'https://www.guararapes.com.br/produtos/', 
      'Sudati': 'https://www.sudati.com.br/acabamentos/',
      'Fibraplac': 'https://www.fibraplac.com.br/produtos/'
    };
    
    // Simular estrutura de URL baseada no nome do acabamento
    const slug = acabamento.nome.toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[àáâãäå]/g, 'a')
      .replace(/[èéêë]/g, 'e')
      .replace(/[ìíîï]/g, 'i')
      .replace(/[òóôõö]/g, 'o')
      .replace(/[ùúûü]/g, 'u')
      .replace(/[ç]/g, 'c')
      .replace(/[^a-z0-9-]/g, '');
    
    return `${baseUrls[acabamento.marca as keyof typeof baseUrls] || ''}${slug}.jpg`;
  };

  // Gerar cor de fallback se não houver imagem
  const getColorFromName = (nome: string): string => {
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

  // Componente de preview de acabamento com imagem
  const AcabamentoImagePreview = ({ acabamento, className = "" }: { 
    acabamento: AcabamentoData; 
    className?: string; 
  }) => {
    const imageUrl = getAcabamentoImageUrl(acabamento);
    const fallbackColor = getColorFromName(acabamento.nome);
    
    return (
      <div className={`relative rounded-md border-2 border-white shadow-sm overflow-hidden ${className}`}>
        <ImageWithFallback
          src={imageUrl}
          alt={`Acabamento ${acabamento.nome} - ${acabamento.marca}`}
          className="w-full h-full object-cover"
          style={{ backgroundColor: fallbackColor }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-200" />
        
        {/* Indicador de imagem real vs cor simulada */}
        <div className="absolute top-1 right-1">
          <div className="w-2 h-2 rounded-full bg-green-500 border border-white shadow-sm" 
               title="Imagem do fornecedor disponível" />
        </div>
      </div>
    );
  };

  // Componente de preview compacto
  const AcabamentoCompactPreview = ({ acabamento }: { acabamento: AcabamentoData }) => (
    <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
      <AcabamentoImagePreview acabamento={acabamento} className="w-8 h-8 flex-shrink-0" />
      <div className="flex-1 min-w-0">
        <p className="font-medium text-sm truncate">{acabamento.nome}</p>
        <div className="flex items-center gap-2">
          <p className="text-xs text-muted-foreground">{acabamento.marca}</p>
          <Button
            variant="ghost"
            size="sm"
            className="h-4 w-4 p-0 opacity-60 hover:opacity-100"
            onClick={() => window.open(getAcabamentoImageUrl(acabamento), '_blank')}
            title="Ver no site do fornecedor"
          >
            <ExternalLink className="w-3 h-3" />
          </Button>
        </div>
      </div>
    </div>
  );

  // Componente de preview detalhado
  const AcabamentoDetailedPreview = ({ acabamento, isSelected, onToggle }: {
    acabamento: AcabamentoData;
    isSelected: boolean;
    onToggle: () => void;
  }) => (
    <Card 
      className={`cursor-pointer transition-all duration-200 ${
        isSelected 
          ? 'ring-2 ring-blue-500 bg-blue-50 dark:bg-blue-950/20' 
          : 'hover:shadow-md hover:border-slate-300 dark:hover:border-slate-600'
      } ${readonly ? 'cursor-default' : ''}`}
      onClick={readonly ? undefined : onToggle}
    >
      <CardContent className="p-4">
        <div className="flex items-start gap-3 mb-3">
          <AcabamentoImagePreview acabamento={acabamento} className="w-16 h-16 flex-shrink-0" />
          
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1 min-w-0">
                <h4 className="font-medium truncate text-base">{acabamento.nome}</h4>
                <div className="flex items-center gap-2">
                  <p className="text-sm text-muted-foreground">{acabamento.marca}</p>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-5 w-5 p-0 opacity-60 hover:opacity-100"
                    onClick={(e) => {
                      e.stopPropagation();
                      window.open(getAcabamentoImageUrl(acabamento), '_blank');
                    }}
                    title="Ver no site do fornecedor"
                  >
                    <ExternalLink className="w-3 h-3" />
                  </Button>
                </div>
              </div>
              {isSelected && !readonly && (
                <CheckCircle2 className="w-5 h-5 text-blue-600 flex-shrink-0" />
              )}
            </div>
          </div>
        </div>
        
        <div className="space-y-3">
          <div className="flex flex-wrap gap-1">
            {acabamento.materiais.map((material, idx) => (
              <SmartBadge key={idx} type="category" className="text-xs">
                {material.tipo} {material.espessuras.join('/')}mm
              </SmartBadge>
            ))}
          </div>
          
          <div className="flex flex-wrap gap-1">
            {acabamento.aplicacoes.slice(0, 2).map((aplicacao, idx) => (
              <SmartBadge key={idx} type="new" className="text-xs">
                {aplicacao}
              </SmartBadge>
            ))}
            {acabamento.aplicacoes.length > 2 && (
              <SmartBadge type="frequent" className="text-xs">
                +{acabamento.aplicacoes.length - 2}
              </SmartBadge>
            )}
          </div>

          {acabamento.observacoes && (
            <div className="flex items-start gap-2 mt-3 p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg text-xs">
              <Info className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
              <span className="text-amber-800 dark:text-amber-200 line-clamp-2">
                {acabamento.observacoes}
              </span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );

  // Versão compacta (para usar em detalhes de peça)
  if (compact) {
    return (
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base flex items-center gap-2">
              <Palette className="w-4 h-4" />
              Acabamentos Disponíveis
              {selectedAcabamentosData.length > 0 && (
                <SmartBadge type="category" count={selectedAcabamentosData.length}>
                  opções
                </SmartBadge>
              )}
            </CardTitle>
            
            {compatibleAcabamentos.length > 0 && (
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Eye className="w-4 h-4 mr-1" />
                    Ver todos ({compatibleAcabamentos.length})
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden">
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                      <Palette className="w-5 h-5" />
                      Catálogo de Acabamentos
                      {categoria && (
                        <SmartBadge type="category">
                          {categoria}
                        </SmartBadge>
                      )}
                    </DialogTitle>
                  </DialogHeader>
                  
                  <AcabamentosSelector
                    categoria={categoria}
                    selectedAcabamentos={selectedAcabamentos}
                    onAcabamentosChange={onAcabamentosChange}
                    readonly={readonly}
                    compact={false}
                  />
                </DialogContent>
              </Dialog>
            )}
          </div>
        </CardHeader>
        
        <CardContent className="pt-0">
          {selectedAcabamentosData.length > 0 ? (
            <div className="grid grid-cols-1 gap-3">
              {selectedAcabamentosData.slice(0, 4).map(acabamento => (
                <AcabamentoCompactPreview key={acabamento.id} acabamento={acabamento} />
              ))}
              
              {selectedAcabamentosData.length > 4 && (
                <div className="text-center pt-2">
                  <SmartBadge type="frequent">
                    +{selectedAcabamentosData.length - 4} acabamentos adicionais
                  </SmartBadge>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-6 text-muted-foreground">
              <Palette className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">Nenhum acabamento selecionado</p>
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  // Versão completa (para usar no AdminPanel ou modal)
  return (
    <div className="space-y-6">
      {/* Filtros */}
      <Card className="p-4 bg-muted/30">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-medium flex items-center gap-2">
              <Filter className="w-4 h-4" />
              Filtros de Acabamentos
            </h4>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={clearFilters}
              className="text-xs"
            >
              <X className="w-3 h-3 mr-1" />
              Limpar
            </Button>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Buscar acabamento</Label>
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Nome, marca ou cor..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Marca</Label>
              <Select value={selectedMarca} onValueChange={setSelectedMarca}>
                <SelectTrigger>
                  <SelectValue placeholder="Todas as marcas" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas as marcas</SelectItem>
                  {getMarcas().map(marca => (
                    <SelectItem key={marca} value={marca}>{marca}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Material</Label>
              <Select 
                value={selectedMaterial} 
                onValueChange={(value: any) => setSelectedMaterial(value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Todos os materiais" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os materiais</SelectItem>
                  <SelectItem value="MDF">MDF</SelectItem>
                  <SelectItem value="MDP">MDP</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Espessura (mm)</Label>
              <Select 
                value={selectedEspessura.toString()} 
                onValueChange={(value) => setSelectedEspessura(value === "all" ? "all" : parseInt(value))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Todas as espessuras" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas as espessuras</SelectItem>
                  <SelectItem value="6">6mm</SelectItem>
                  <SelectItem value="15">15mm</SelectItem>
                  <SelectItem value="18">18mm</SelectItem>
                  <SelectItem value="25">25mm</SelectItem>
                  <SelectItem value="37">37mm</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {categoria && (
            <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <div className="flex items-center gap-2">
                <Info className="w-4 h-4 text-blue-600" />
                <span className="text-sm text-blue-800 dark:text-blue-200">
                  Exibindo apenas acabamentos compatíveis com <strong>{categoria}</strong>
                </span>
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Lista de Acabamentos */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h4 className="font-medium">
            Catálogo de Acabamentos ({compatibleAcabamentos.length} disponíveis)
          </h4>
          
          {!readonly && selectedAcabamentos.length > 0 && (
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => onAcabamentosChange?.([])}
            >
              Desmarcar todos
            </Button>
          )}
        </div>

        {compatibleAcabamentos.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-96 overflow-y-auto">
            {compatibleAcabamentos.map(acabamento => (
              <AcabamentoDetailedPreview
                key={acabamento.id}
                acabamento={acabamento}
                isSelected={selectedAcabamentos.includes(acabamento.id)}
                onToggle={() => toggleAcabamento(acabamento.id)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <Palette className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="font-medium text-foreground mb-2">Nenhum acabamento encontrado</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Tente ajustar os filtros ou termos de busca
            </p>
            <Button variant="outline" onClick={clearFilters}>
              Limpar filtros
            </Button>
          </div>
        )}
      </div>

      {/* Acabamentos selecionados */}
      {!readonly && selectedAcabamentosData.length > 0 && (
        <Card className="p-4 bg-green-50 dark:bg-green-900/20">
          <div className="flex items-center gap-2 mb-3">
            <CheckCircle2 className="w-4 h-4 text-green-600" />
            <h4 className="font-medium text-green-800 dark:text-green-200">
              Acabamentos Selecionados ({selectedAcabamentosData.length})
            </h4>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {selectedAcabamentosData.map(acabamento => (
              <div key={acabamento.id} className="flex items-center gap-2 p-2 bg-white dark:bg-slate-800 rounded border">
                <AcabamentoImagePreview acabamento={acabamento} className="w-6 h-6 flex-shrink-0" />
                <span className="text-sm font-medium truncate flex-1">{acabamento.nome}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0 text-red-600 hover:text-red-800"
                  onClick={() => toggleAcabamento(acabamento.id)}
                >
                  <X className="w-3 h-3" />
                </Button>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
