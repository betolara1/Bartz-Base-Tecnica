import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Package, Palette, Settings, CheckCircle, Info, Loader2, Shapes } from "lucide-react";
import {
  getModelForPiece,
  getAvailableMaterials,
  getAvailableThicknesses,
  getAvailableFinishes,
  textureLabels,
  typeLabels,
  typeDescriptions,
  PieceModel,
} from "../data/models";
import {
  acabamentosData,
  getAcabamentosByMaterialEEspessura,
  AcabamentoData as BaseAcabamentoData,
  MaterialData
} from "../data/acabamentos";

// Estendemos o tipo base para incluir visualizações específicas de modelos
export interface AcabamentoData extends BaseAcabamentoData {
  colorHex?: string;
  textureType?: string;
}

interface ModelosEAcabamentosCardProps {
  pieceId?: string;
  pieceCategory: string;
  pieceSubcategory: string;
  isAdminMode?: boolean;
}

// Dados de fallback para casos onde modelo não é encontrado
const fallbackCharacteristics = [
  "Módulo padrão com estrutura independente",
  "Compatível com sistema de modulação 32mm",
  "Permite combinação horizontal e vertical"
];

const fallbackNotes = [
  "Consulte especificações técnicas detalhadas",
  "Verifique compatibilidade com fornecedor",
  "Considere medidas mínimas para agregados"
];

// Helper para remover acentos para comparação de nomes
const normalizeText = (text: string) => {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/-/g, " ")
    .replace(/\s+/g, " ")
    .trim();
};

// Cores e texturas reais para os acabamentos específicos
const FINISH_VISUALS: { [key: string]: { hex: string, texture: string } } = {
  'atlantica': { hex: '#4A708B', texture: 'wood' },
  'bronze': { hex: '#8B5A2B', texture: 'metallic' },
  'cabiuna nobre': { hex: '#3D2B1F', texture: 'wood' },
  'camelo': { hex: '#996644', texture: 'leather' },
  'carvalho latino': { hex: '#D2B48C', texture: 'wood' },
  'linum': { hex: '#CDBA96', texture: 'fabric' },
  'nogueira caiena': { hex: '#6B4226', texture: 'wood' },
  'pau ferro': { hex: '#4B3621', texture: 'wood' },
  'raphia': { hex: '#6E7B68', texture: 'fabric' },
  'serrano': { hex: '#B8860B', texture: 'wood' },
  'branco tx': { hex: '#FFFFFF', texture: 'matte' },
};

// Gerar paleta de cores baseada no tipo de material e nome
const getColorFromFinish = (name: string, materials: string[]) => {
  const normalized = normalizeText(name);
  const visual = FINISH_VISUALS[normalized];
  if (visual) return visual.hex;

  const materialColors: { [key: string]: string[] } = {
    'mdf': ['#d4a574', '#8b4513', '#cd853f', '#daa520', '#b8860b'],
    'mdp': ['#d4a574', '#daa520', '#cd853f', '#b8860b', '#8b4513'],
    'default': ['#6b7280', '#9ca3af', '#d1d5db', '#374151', '#1f2937']
  };

  const materialType = materials.map(m => m.toLowerCase()).find(m =>
    Object.keys(materialColors).includes(m)
  ) || 'default';

  const colorSet = materialColors[materialType];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colorSet[Math.abs(hash) % colorSet.length];
};

// Obter textura CSS baseada no tipo
const getTextureOverlay = (name: string) => {
  const normalized = normalizeText(name);
  const textureType = FINISH_VISUALS[normalized]?.texture || 'matte';

  switch (textureType) {
    case 'wood':
      return (
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `repeating-linear-gradient(
              90deg,
              transparent,
              transparent 15px,
              rgba(0,0,0,0.1) 15px,
              rgba(0,0,0,0.2) 20px,
              transparent 25px
            ), repeating-linear-gradient(
              0deg,
              transparent,
              transparent 40px,
              rgba(255,255,255,0.05) 40px,
              rgba(255,255,255,0.1) 45px,
              transparent 50px
            )`
          }}
        />
      );
    case 'fabric':
      return (
        <div
          className="absolute inset-0 opacity-40"
          style={{
            backgroundImage: `conic-gradient(from 0deg at 50% 50%, rgba(0,0,0,0.1) 0%, transparent 25%, rgba(0,0,0,0.1) 50%, transparent 75%, rgba(0,0,0,0.1) 100%)`,
            backgroundSize: '4px 4px'
          }}
        />
      );
    case 'leather':
      return (
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `radial-gradient(circle at 50% 50%, rgba(0,0,0,0.3) 1px, transparent 1px)`,
            backgroundSize: '6px 6px'
          }}
        />
      );
    case 'metallic':
      return (
        <div className="absolute inset-0 bg-gradient-to-tr from-white/30 via-transparent to-black/40" />
      );
    default:
      return <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-black/10" />;
  }
};

// Determinar se a cor é clara ou escura para contraste do texto
const getContrastTextColor = (hexColor: string) => {
  const r = parseInt(hexColor.slice(1, 3), 16);
  const g = parseInt(hexColor.slice(3, 5), 16);
  const b = parseInt(hexColor.slice(5, 7), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.5 ? '#1f2937' : '#ffffff';
};

export function ModelosEAcabamentosCard({
  pieceId: pieceIdProp,
  pieceCategory,
  pieceSubcategory,
  isAdminMode = false
}: ModelosEAcabamentosCardProps) {
  const [model, setModel] = useState<PieceModel | null>(null);
  const [acabamentos, setAcabamentos] = useState<AcabamentoData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedThickness, setSelectedThickness] = useState<number | null>(null);
  const [selectedPattern, setSelectedPattern] = useState<string | null>(null);
  const [compositions, setCompositions] = useState<Record<string, any>>({});

  useEffect(() => {
    function loadModelData() {
      setLoading(true);

      try {
        // Mapear categoria/subcategoria para IDs de peças conhecidas se pieceId não foi fornecido
        let pieceId = pieceIdProp || "ARM001"; // default modular

        if (!pieceIdProp) {
          if (pieceCategory === "Armários") {
            pieceId = "ARM001";
          } else if (pieceCategory === "Gavetas") {
            pieceId = "BAL001";
          } else if (pieceCategory === "Prateleiras") {
            pieceId = "EST001";
          } else if (pieceCategory === "Portas") {
            pieceId = "ARM001";
          } else if (pieceCategory === "Ferragens") {
            pieceId = "EST001";
          } else if (pieceCategory === "Ateliê Bartz" && (pieceSubcategory === "Módulo Curvo" || pieceSubcategory.includes("Curvo"))) {
            pieceId = "mod-curvo-90";
          }
        }

        // Buscar modelo correspondente
        const pieceModel = getModelForPiece(pieceId);

        if (pieceModel) {
          setModel(pieceModel);

          // Set default selected thickness
          const standardThickness = pieceModel.thicknesses.find(t => t.standard)?.thickness || pieceModel.thicknesses[0]?.thickness;
          setSelectedThickness(standardThickness);

          // Set default selected pattern if Muxarabi
          if (pieceModel.patterns && pieceModel.patterns.length > 0) {
            setSelectedPattern(pieceModel.patterns[0]);
          }

          // Inicializar composições com seus valores padrão
          if (pieceModel.compositionOptions) {
            const initialCompositions: Record<string, any> = {};
            pieceModel.compositionOptions.forEach(opt => {
              initialCompositions[opt.id] = opt.defaultValue;
            });
            setCompositions(initialCompositions);
          }

          // Categorização de acabamentos com filtro inicial
          const currentFinishes = getAvailableFinishes(pieceId, standardThickness);

          if (pieceModel.finishes && pieceModel.finishes.length > 0) {
            const mappedFinishes: AcabamentoData[] = currentFinishes.map(f => ({
              id: f.id,
              nome: f.name,
              marca: "Bartz",
              materiais: pieceModel.materials.map(m => ({
                tipo: (m.id.toUpperCase() === "MDF" ? "MDF" : "MDP") as "MDF" | "MDP",
                espessuras: pieceModel.thicknesses.map(t => t.thickness)
              })),
              aplicacoes: ["Módulo Especial"],
              observacoes: f.thicknesses ? `Disponível em: ${f.thicknesses.join(", ")}mm` : `Disponível em todas as espessuras`,
              colorHex: f.colorHex,
              textureType: f.texture
            }));
            setAcabamentos(mappedFinishes);
          } else {
            // Buscar acabamentos compatíveis baseado nos materiais e espessuras
            const allAcabamentos: AcabamentoData[] = [];

            pieceModel.materials.forEach(material => {
              if (material.available) {
                pieceModel.thicknesses.forEach(thickness => {
                  if (thickness.available) {
                    const materialType = material.id === "mdf" ? "MDF" : "MDP";
                    const compatibleAcabamentos = getAcabamentosByMaterialEEspessura(
                      materialType as "MDF" | "MDP",
                      thickness.thickness
                    );

                    compatibleAcabamentos.forEach(acabamento => {
                      if (!allAcabamentos.find(a => a.id === acabamento.id)) {
                        allAcabamentos.push(acabamento);
                      }
                    });
                  }
                });
              }
            });

            setAcabamentos(allAcabamentos.slice(0, 12)); // Limitar a 12 acabamentos
          }
        } else {
          // Fallback para modelo genérico se não encontrar específico
          setModel({
            pieceId: "GENERIC",
            type: "modular",
            materials: [
              { id: "mdp", codigo: "MDPGEN", name: "MDP", available: true, description: "Painel de partículas" },
              { id: "mdf", codigo: "MDFGEN", name: "MDF", available: true, description: "Painel de fibras" }
            ],
            thicknesses: [
              { id: "15", codigo: "ESP15GEN", thickness: 15, available: true, standard: false },
              { id: "18", codigo: "ESP18GEN", thickness: 18, available: true, standard: true },
              { id: "25", codigo: "ESP25GEN", thickness: 25, available: true, standard: false }
            ],
            finishes: [
              { id: "branco-tx", name: "Branco TX", color: "Branco", colorHex: "#FFFFFF", texture: "liso", available: true, standard: true }
            ],
            aggregates: [],
            characteristics: fallbackCharacteristics,
            notes: fallbackNotes,
          });

          // Usar alguns acabamentos como exemplo
          setAcabamentos(acabamentosData.slice(0, 8));
        }
      } catch (error) {
        console.warn("Erro ao carregar dados de modelos:", error);

        // Fallback em caso de erro
        setModel({
          pieceId: "FALLBACK",
          type: "modular",
          materials: [
            { id: "mdp", codigo: "MDPFALLBACK", name: "MDP", available: true },
            { id: "mdf", codigo: "MDFFALLBACK", name: "MDF", available: true }
          ],
          thicknesses: [
            { id: "18", codigo: "ESP18FALLBACK", thickness: 18, available: true, standard: true }
          ],
          finishes: [
            { id: "branco-tx", name: "Branco TX", color: "Branco", colorHex: "#FFFFFF", texture: "liso", available: true, standard: true }
          ],
          aggregates: [],
          characteristics: fallbackCharacteristics,
          notes: fallbackNotes,
        });

        setAcabamentos(acabamentosData.slice(0, 6));
      } finally {
        setLoading(false);
      }
    }

    loadModelData();
  }, [pieceIdProp, pieceCategory, pieceSubcategory]);


  // Efeito adicional para atualizar acabamentos quando a espessura muda
  useEffect(() => {
    if (model && selectedThickness) {
      if (model.finishes && model.finishes.length > 0) {
        const currentFinishes = getAvailableFinishes(model.pieceId, selectedThickness);
        const mappedFinishes: AcabamentoData[] = currentFinishes.map(f => ({
          id: f.id,
          nome: f.name,
          marca: "Bartz",
          materiais: model.materials.map(m => ({
            tipo: (m.id.toUpperCase() === "MDF" ? "MDF" : "MDP") as "MDF" | "MDP",
            espessuras: model.thicknesses.map(t => t.thickness)
          })),
          aplicacoes: ["Módulo Especial"],
          observacoes: f.thicknesses ? `Disponível em: ${f.thicknesses.join(", ")}mm` : `Disponível em todas as espessuras`,
          colorHex: f.colorHex,
          textureType: f.texture
        }));
        setAcabamentos(mappedFinishes);
      }
    }
  }, [selectedThickness, model]);

  // Componente para acabamento real da base de dados
  const AcabamentoCard = ({ acabamento }: { acabamento: AcabamentoData }) => {
    const backgroundColor = acabamento.colorHex || getColorFromFinish(
      acabamento.nome,
      acabamento.materiais.map(m => m.tipo)
    );
    const textColor = getContrastTextColor(backgroundColor);

    return (
      <div className="flex flex-col items-center gap-2 p-1.5 border border-slate-100 rounded-lg bg-white hover:border-amber-300 hover:shadow-md transition-all duration-200 group cursor-help">
        <div
          className="w-full aspect-square rounded-md border border-slate-200 shadow-sm relative overflow-hidden flex-shrink-0"
          style={{ backgroundColor }}
        >
          {getTextureOverlay(acabamento.nome)}

          {/* Iniciais aparecem no hover */}
          <div
            className="absolute inset-0 flex items-center justify-center text-[10px] font-bold opacity-0 group-hover:opacity-100 bg-black/10 transition-opacity duration-200"
            style={{ color: textColor }}
          >
            {acabamento.nome.substring(0, 2).toUpperCase()}
          </div>
        </div>
        <div className="w-full text-center overflow-hidden">
          <div className="font-medium text-[9px] leading-tight truncate px-0.5 text-slate-700" title={acabamento.nome}>
            {acabamento.nome}
          </div>
        </div>
      </div>
    );
  };


  // Filtrar materiais e espessuras disponíveis
  const availableMaterials = model ? getAvailableMaterials(model.pieceId) : [];
  const availableThicknesses = model ? getAvailableThicknesses(model.pieceId) : [];

  if (loading) {
    return (
      <Card className="rounded-xl border-slate-200">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-3">
            <Package className="w-5 h-5 text-amber-600" />
            Modelos e Acabamentos
          </CardTitle>
          <CardDescription>
            Carregando informações de materiais e acabamentos...
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="rounded-xl border-slate-200">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-3">
          <Package className="w-5 h-5 text-amber-600" />
          Modelos e Acabamentos
        </CardTitle>
        <CardDescription>
          Opções de materiais, acabamentos técnicos e agregados disponíveis
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Model Type and Status Info */}
        {model && (
          <div className="space-y-2 pb-2">
            <div className="flex items-center gap-2 flex-wrap">
              <Badge variant="outline" className="text-xs bg-amber-50 text-amber-700 border-amber-200">
                {typeLabels[model.type]}
              </Badge>
              <span className="text-xs text-slate-500">
                {typeDescriptions[model.type]}
              </span>
            </div>

          </div>
        )}

        {model ? (
          <Tabs defaultValue="materials" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="materials" className="text-xs">Materiais</TabsTrigger>
              <TabsTrigger value="finishes" className="text-xs">Acabamentos & Cores</TabsTrigger>
            </TabsList>

            <TabsContent value="materials" className="space-y-4 mt-4">
              {/* Características do Tipo */}
              {model.characteristics && model.characteristics.length > 0 && (
                <div className="space-y-3">
                  <h4 className="font-medium text-sm flex items-center gap-2">
                    <Info className="w-4 h-4" />
                    Características {typeLabels[model.type]}
                  </h4>
                  <div className="space-y-2">
                    {model.characteristics.map((char, index) => {
                      const isRadius = char.startsWith("Raio Borda:") || char.startsWith("Raio:");
                      if (isRadius) {
                        const label = char.startsWith("Raio Borda:") ? "Raio Borda:" : "Raio:";
                        const radiuses = char.replace(label, "").split(",").map(r => r.trim());
                        return (
                          <div key={index} className="space-y-3 p-3 bg-blue-50/50 rounded-lg border border-blue-100 mt-2">
                            <h5 className="text-xs font-semibold text-blue-900 flex items-center gap-2">
                              <Settings className="w-3 h-3" />
                              Opções de {label === "Raio:" ? "Raio" : "Raio de Borda"}
                            </h5>
                            <div className="flex flex-wrap gap-2">
                              {radiuses.map((r, i) => (
                                <Badge key={i} variant="outline" className="bg-white hover:bg-blue-100 cursor-pointer border-blue-200 text-blue-700">
                                  {r}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        );
                      }
                      return (
                        <div key={index} className="flex items-start gap-2 p-2 bg-blue-50/50 rounded-lg border border-blue-100">
                          <CheckCircle className="w-3 h-3 text-blue-600 flex-shrink-0 mt-0.5" />
                          <span className="text-xs text-blue-900">{char}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Padrões de Muxarabi */}
              {model.patterns && model.patterns.length > 0 && (
                <div className="space-y-3 pb-2">
                  <h4 className="font-medium text-sm flex items-center gap-2">
                    <Settings className="w-4 h-4" />
                    Padrão de Vazado (Grid)
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {model.patterns.map((pattern) => (
                      <button
                        key={pattern}
                        onClick={() => setSelectedPattern(pattern)}
                        className={`
                          px-4 py-2 rounded-lg text-xs font-medium transition-all duration-200 border-2
                          ${selectedPattern === pattern
                            ? "bg-amber-600 border-amber-700 text-white shadow-md scale-105"
                            : "bg-white border-slate-200 text-slate-600 hover:border-amber-300 hover:bg-amber-50"
                          }
                        `}
                      >
                        {pattern}
                      </button>
                    ))}
                  </div>

                  {/* Dimensões Técnicas do Padrão Selecionado (Muxarabi) */}
                  {selectedPattern && model.patternDimensions?.[selectedPattern] && (
                    <div className="mt-4 p-4 bg-orange-50/50 border border-orange-200/50 rounded-xl space-y-3">
                      <h4 className="font-medium text-[11px] uppercase tracking-wider flex items-center gap-2 text-orange-800">
                        <Info className="w-3.5 h-3.5" />
                        Dimensões Nominais ({selectedPattern})
                      </h4>
                      <div className="grid grid-cols-3 gap-2">
                        <div className="bg-white/80 p-2 rounded-lg border border-orange-100 flex flex-col items-center">
                          <span className="text-[9px] text-slate-500 uppercase font-bold">Largura</span>
                          <span className="text-[11px] font-bold text-orange-700">
                            {model.patternDimensions[selectedPattern].minWidth} ~ {model.patternDimensions[selectedPattern].maxWidth}
                          </span>
                        </div>
                        <div className="bg-white/80 p-2 rounded-lg border border-orange-100 flex flex-col items-center">
                          <span className="text-[9px] text-slate-500 uppercase font-bold">Altura</span>
                          <span className="text-[11px] font-bold text-orange-700">
                            {model.patternDimensions[selectedPattern].minHeight} ~ {model.patternDimensions[selectedPattern].maxHeight}
                          </span>
                        </div>
                        <div className="bg-white/80 p-2 rounded-lg border border-orange-100 flex flex-col items-center">
                          <span className="text-[9px] text-slate-500 uppercase font-bold">Espessura</span>
                          <div className="flex flex-col items-center">
                            <span className="text-[11px] font-bold text-orange-700">18mm</span>
                            <span className="text-[11px] font-bold text-orange-700">25mm</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  <Separator className="my-4" />
                </div>
              )}

              {/* Seletor de Espessura e Dimensões (Prominente pós-características) */}
              {availableThicknesses.length > 0 && (!model.patterns || model.patterns.length === 0) && (
                <div className="space-y-4 pb-2">
                  <h4 className="font-medium text-sm flex items-center gap-2">
                    <Settings className="w-4 h-4" />
                    Espessura Disponível (Clique para selecionar)
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {availableThicknesses.map((thickness) => (
                      <button
                        key={thickness.thickness}
                        onClick={() => setSelectedThickness(thickness.thickness)}
                        className={`
                          px-4 py-2 rounded-lg text-xs font-medium transition-all duration-200 border-2
                          ${selectedThickness === thickness.thickness
                            ? "bg-amber-600 border-amber-700 text-white shadow-md scale-105"
                            : "bg-white border-slate-200 text-slate-600 hover:border-amber-300 hover:bg-amber-50"
                          }
                        `}
                      >
                        {thickness.thickness}mm
                        {thickness.standard && <span className="ml-1 opacity-80">(Padrão)</span>}
                      </button>
                    ))}
                  </div>

                  {/* Dimensões Técnicas por Espessura (ex: Triângulo Retângulo) */}
                  {model.thicknessDimensions && selectedThickness && model.thicknessDimensions[selectedThickness] && (
                    <div className="mt-2 p-4 bg-orange-50/50 border border-orange-200/50 rounded-xl space-y-3">
                      <h4 className="font-medium text-[11px] uppercase tracking-wider flex items-center gap-2 text-orange-800">
                        <Info className="w-3.5 h-3.5" />
                        Dimensões Nominais ({selectedThickness}mm)
                      </h4>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="bg-white/80 p-2 rounded-lg border border-orange-100 flex flex-col items-center">
                          <span className="text-[9px] text-slate-500 uppercase font-bold">Largura</span>
                          <span className="text-[11px] font-bold text-orange-700">
                            {model.thicknessDimensions[selectedThickness].minWidth} ~ {model.thicknessDimensions[selectedThickness].maxWidth}
                          </span>
                        </div>
                        <div className="bg-white/80 p-2 rounded-lg border border-orange-100 flex flex-col items-center">
                          <span className="text-[9px] text-slate-500 uppercase font-bold">Altura</span>
                          <span className="text-[11px] font-bold text-orange-700">
                            {model.thicknessDimensions[selectedThickness].minHeight} ~ {model.thicknessDimensions[selectedThickness].maxHeight}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                  <Separator className="my-4" />
                </div>
              )}

              {/* Composições Especiais (Ex: Geometria Livre) */}
              {model.compositionOptions && model.compositionOptions.length > 0 && (
                <div className="space-y-3 pb-2">
                  <h4 className="font-medium text-sm flex items-center gap-2">
                    <Shapes className="w-4 h-4 text-emerald-600" />
                    Composições e Recortes Geométricos
                  </h4>
                  <div className="p-4 bg-emerald-50/50 border border-emerald-100 rounded-xl space-y-4">
                    {model.compositionOptions.map(opt => (
                      <div key={opt.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-emerald-100/50 last:border-0 pb-3 last:pb-0">
                        <div className="flex-1">
                          <span className="text-sm font-medium text-slate-800">{opt.label}</span>
                          {opt.description && (
                            <p className="text-[10px] text-slate-500 mt-0.5">{opt.description}</p>
                          )}
                        </div>

                        <div className="w-32 flex-shrink-0">
                          {opt.type === "boolean" ? (
                            <select
                              className="w-full text-sm border-slate-200 rounded-md bg-white shadow-sm h-8"
                              value={compositions[opt.id] ? "SIM" : "NÃO"}
                              onChange={(e) => setCompositions(prev => ({ ...prev, [opt.id]: e.target.value === "SIM" }))}
                            >
                              <option value="SIM">SIM</option>
                              <option value="NÃO">NÃO</option>
                            </select>
                          ) : opt.type === "number_range" ? (
                            <select
                              className="w-full text-sm border-slate-200 rounded-md bg-white shadow-sm h-8"
                              value={compositions[opt.id] ?? opt.defaultValue ?? 0}
                              onChange={(e) => setCompositions(prev => ({ ...prev, [opt.id]: parseInt(e.target.value) }))}
                            >
                              {Array.from({ length: (opt.max ?? 20) - (opt.min ?? 0) + 1 }, (_, i) => (opt.min ?? 0) + i).map(num => (
                                <option key={num} value={num}>{num}</option>
                              ))}
                            </select>
                          ) : null}
                        </div>
                      </div>
                    ))}
                  </div>
                  <Separator className="my-4" />
                </div>
              )}

              {/* Materiais Disponíveis */}
              <div className="space-y-3">
                <h4 className="font-medium text-sm flex items-center gap-2">
                  <Package className="w-4 h-4" />
                  Materiais Base
                </h4>
                <div className="space-y-2">
                  {availableMaterials.map((material) => (
                    <div key={material.id} className="p-3 border border-slate-200 rounded-lg bg-slate-50/50">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium text-sm">{material.name}</span>
                        <CheckCircle className="w-4 h-4 text-green-600" />
                      </div>
                      {material.description && (
                        <p className="text-xs text-slate-600">{material.description}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>

            </TabsContent>

            <TabsContent value="finishes" className="space-y-6 mt-4">
              {/* Seletor de Espessura para Acabamentos */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
                <div className="flex items-center justify-between">
                  <h5 className="text-xs font-semibold text-slate-900 flex items-center gap-2">
                    <Settings className="w-3 h-3" />
                    Selecione a Espessura
                  </h5>
                  {selectedThickness && (
                    <Badge variant="secondary" className="bg-amber-100 text-amber-700 text-[10px]">
                      {selectedThickness}mm selecionado
                    </Badge>
                  )}
                </div>
                <div className="flex flex-wrap gap-2">
                  {availableThicknesses.map((thickness) => (
                    <button
                      key={thickness.thickness}
                      onClick={() => setSelectedThickness(thickness.thickness)}
                      className={`
                        px-4 py-2 rounded-lg text-xs font-medium transition-all duration-200 border-2
                        ${selectedThickness === thickness.thickness
                          ? "bg-amber-600 border-amber-700 text-white shadow-md scale-105"
                          : "bg-white border-slate-200 text-slate-600 hover:border-amber-300 hover:bg-amber-50"
                        }
                      `}
                    >
                      {thickness.thickness}mm
                      {thickness.standard && <span className="ml-1 opacity-70">(Padrão)</span>}
                    </button>
                  ))}
                </div>
                <p className="text-[10px] text-slate-500 italic">
                  * A disponibilidade de cores varia conforme a espessura selecionada.
                </p>
              </div>

              {/* Acabamentos Técnicos com Cores Integradas */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-sm flex items-center gap-2">
                    <Palette className="w-4 h-4" />
                    Acabamentos & Cores Disponíveis
                  </h4>
                  <Badge variant="outline" className="text-xs">
                    {acabamentos.length} {acabamentos.length === 1 ? 'acabamento' : 'acabamentos'}
                  </Badge>
                </div>

                {acabamentos.length > 0 ? (
                  <div className="grid grid-cols-4 sm:grid-cols-5 gap-2 sm:gap-3">
                    {acabamentos.map((acabamento) => (
                      <AcabamentoCard key={acabamento.id} acabamento={acabamento} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <Palette className="w-6 h-6 mx-auto mb-2 opacity-40" />
                    <p className="font-medium text-sm">Nenhum acabamento encontrado</p>
                    <p className="text-xs text-slate-600 mt-1">
                      Não foram encontrados acabamentos compatíveis com os materiais selecionados
                    </p>
                  </div>
                )}

                {/* Informação sobre outros projetos e cores */}
                {acabamentos.length > 0 && (
                  <div className="space-y-4">
                    <div className="p-4 bg-gradient-to-br from-blue-50/80 to-indigo-50/80 rounded-xl border border-blue-200/60">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center flex-shrink-0">
                          <Palette className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex-1">
                          <h5 className="font-medium text-sm text-blue-900 mb-2">Outras Cores & Projetos Personalizados</h5>
                          <p className="text-xs text-blue-700 leading-relaxed mb-3">
                            Além dos acabamentos padrão listados, a <strong>Bartz</strong> desenvolve projetos
                            personalizados com uma ampla variedade de cores e texturas especiais para atender
                            suas necessidades específicas.
                          </p>
                          <div className="flex items-center gap-2 text-xs text-blue-600">
                            <div className="flex gap-1">
                              <div className="w-4 h-4 rounded-full bg-red-400 border border-red-300"></div>
                              <div className="w-4 h-4 rounded-full bg-green-400 border border-green-300"></div>
                              <div className="w-4 h-4 rounded-full bg-purple-400 border border-purple-300"></div>
                              <div className="w-4 h-4 rounded-full bg-yellow-400 border border-yellow-300"></div>
                              <div className="w-4 h-4 rounded-full bg-pink-400 border border-pink-300"></div>
                            </div>
                            <span className="font-medium">+ centenas de outras opções</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Informação técnica sobre compatibilidade */}
                    <div className="p-3 bg-slate-50/50 rounded-lg border border-slate-200">
                      <h5 className="font-medium text-xs text-slate-700 mb-2">Compatibilidade Técnica:</h5>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        Acabamentos listados são compatíveis with os materiais e espessuras disponíveis
                        para esta categoria de peça. Para projetos com cores personalizadas, consulte nossa
                        equipe técnica para verificar viabilidade e especificações.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>

          </Tabs>
        ) : (
          <div className="text-center py-8">
            <Package className="w-8 h-8 mx-auto mb-3 opacity-40" />
            <p className="font-medium text-sm">Modelos não disponíveis</p>
            <p className="text-xs text-slate-600 mt-1">Informações de modelos aparecerão aqui quando disponíveis</p>
          </div>
        )}

        <Separator />

        {/* Informações de Dados */}
        <div className="text-xs text-slate-500 text-center">
          <span className="text-emerald-600">
            ✅ Dados carregados da base técnica • {model ? `Tipo: ${typeLabels[model.type]}` : 'Carregando...'}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
