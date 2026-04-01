import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Package, Palette, Settings, CheckCircle, Info, Loader2, Shapes, MousePointer2, DoorOpen, Search, Maximize2, X as CloseIcon } from "lucide-react";
import {
  getModelForPiece,
  getAvailableMaterials,
  getAvailableThicknesses,
  getAvailableFinishes,
  getAvailableFrontMaterials,
  getAvailableFrontThicknesses,
  getAvailableFrontFinishes,
  getAvailableHandles,
  getAvailableHandleBrands,
  textureLabels,
  typeLabels,
  typeDescriptions,
  PieceModel,
  FinishOption,
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
  const [selectedMaterial, setSelectedMaterial] = useState<string | null>(null);
  const [selectedPattern, setSelectedPattern] = useState<string | null>(null);
  const [compositions, setCompositions] = useState<Record<string, any>>({});
  const [zoomedFinish, setZoomedFinish] = useState<FinishOption | null>(null);

  // Estados para configuração de portas e gavetas (Frontais)
  const [selectedFrontMaterial, setSelectedFrontMaterial] = useState<string | null>(null);
  const [selectedFrontThickness, setSelectedFrontThickness] = useState<number | null>(null);
  const [selectedFrontFinishId, setSelectedFrontFinishId] = useState<string | null>(null);
  const [selectedHandleId, setSelectedHandleId] = useState<string | null>(null);
  const [selectedHandleColorId, setSelectedHandleColorId] = useState<string | null>(null);
  const [selectedHandleType, setSelectedHandleType] = useState<"perfil" | "avulso" | "nenhum">("nenhum");
  const [selectedHandleBrand, setSelectedHandleBrand] = useState<string | null>(null);

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

          // Set default selected thicknesses and materials
          const standardThickness = pieceModel.thicknesses.find(t => t.standard)?.thickness || pieceModel.thicknesses[0]?.thickness;
          setSelectedThickness(standardThickness);

          const standardMaterial = pieceModel.materials[0]?.id || "mdf";
          setSelectedMaterial(standardMaterial);

          // Set default selected pattern if Muxarabi
          if (pieceModel.patterns && pieceModel.patterns.length > 0) {
            setSelectedPattern(pieceModel.patterns[0]);
          }

          // Inicializar configuração de portas e gavetas (se disponíveis)
          if (pieceModel.frontOptions) {
            const frontMaterial = pieceModel.frontOptions.materials[0]?.id || "mdf";
            const frontThickness = pieceModel.frontOptions.thicknesses.find(t => t.standard)?.thickness || pieceModel.frontOptions.thicknesses[0]?.thickness;
            const frontHandles = pieceModel.frontOptions.handleOptions[0];
            
            setSelectedFrontMaterial(frontMaterial);
            setSelectedFrontThickness(frontThickness);
            setSelectedFrontFinishId(pieceModel.frontOptions.finishes[0]?.id || null);
            setSelectedHandleId(frontHandles?.id || null);
            setSelectedHandleColorId(frontHandles?.colors[0]?.id || null);
            
            // Inicializar tipo e marca
            if (frontHandles?.id === "sem-perfil") {
              setSelectedHandleType("nenhum");
            } else if (frontHandles?.id === "perfil-gola-24mm") {
              setSelectedHandleType("perfil");
            }
            
            if (pieceModel.frontOptions.handleBrands && pieceModel.frontOptions.handleBrands.length > 0) {
              setSelectedHandleBrand(pieceModel.frontOptions.handleBrands[0]);
            }
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
          const currentFinishes = getAvailableFinishes(pieceId, standardThickness, standardMaterial);

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

            setAcabamentos(allAcabamentos); // Show all compatible finishes
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


  // Efeito adicional para atualizar acabamentos quando a espessura ou material mudam
  useEffect(() => {
    if (model && selectedThickness) {
      const currentFinishes = getAvailableFinishes(model.pieceId, selectedThickness, selectedMaterial || undefined);

      if (model.finishes && model.finishes.length > 0) {
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
      } else {
        // Se o modelo não tem acabamentos específicos definidos, buscamos da base geral de acabamentos
        // filtrando por material e espessura
        const materialType = (selectedMaterial?.toUpperCase() === "MDP" ? "MDP" : "MDF") as "MDF" | "MDP";
        const compatibleAcabamentos = getAcabamentosByMaterialEEspessura(materialType, selectedThickness);
        setAcabamentos(compatibleAcabamentos);
      }
    }
  }, [selectedThickness, selectedMaterial, model]);

  // Componente para acabamento real da base de dados
  const AcabamentoCard = ({ acabamento, espessuraEscolhida }: { acabamento: AcabamentoData, espessuraEscolhida: number | null }) => {
    const [imageExtension, setImageExtension] = useState<"jpg" | "png" | "error">("jpg");
    const backgroundColor = acabamento.colorHex || getColorFromFinish(
      acabamento.nome,
      acabamento.materiais.map(m => m.tipo)
    );
    const textColor = getContrastTextColor(backgroundColor);

    const folderEspessura = espessuraEscolhida ? `${espessuraEscolhida}mm` : '18mm';
    const imageUrl = `/cores/${folderEspessura}/${acabamento.nome}.${imageExtension}`;

    const handleImageError = () => {
      if (imageExtension === "jpg") {
        setImageExtension("png"); // Try PNG if JPG fails
      } else if (imageExtension === "png") {
        setImageExtension("error"); // Both failed, fallback to CSS
      }
    };

    return (
      <div className="flex flex-col items-center gap-2 p-1.5 border border-slate-100 rounded-lg bg-white hover:border-amber-300 hover:shadow-md transition-all duration-200 group cursor-help">
        <div
          className="w-full aspect-square rounded-md border border-slate-200 shadow-sm relative overflow-hidden flex-shrink-0"
          style={{ backgroundColor }}
        >
          {/* Se a imagem ainda não deu erro definitivo, tentamos carregá-la */}
          {imageExtension !== "error" && (
            <img
              src={imageUrl}
              alt={acabamento.nome}
              className="absolute inset-0 w-full h-full object-cover z-10"
              onError={handleImageError}
            />
          )}

          {/* Fallback de cor/textura gerado via CSS, fica visível se a imagem falhar */}
          {getTextureOverlay(acabamento.nome)}

          {/* Iniciais aparecem no hover sobre a imagem ou a cor */}
          <div
            className="absolute inset-0 flex items-center justify-center text-[10px] font-bold opacity-0 group-hover:opacity-100 bg-black/30 transition-opacity duration-200 z-20"
            style={{ color: '#ffffff' }}
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
    <>
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

              {/* Seletor de Material Base do Corpo */}
              {availableMaterials.length > 0 && (
                <div className="space-y-4 pb-2">
                  <h4 className="font-medium text-sm flex items-center gap-2">
                    <Shapes className="w-4 h-4 text-emerald-600" />
                    Corpo do Módulo: Material
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {availableMaterials.map((material) => (
                      <button
                        key={material.id}
                        onClick={() => setSelectedMaterial(material.id)}
                        className={`
                          px-4 py-2 rounded-lg text-xs font-medium transition-all duration-200 border-2
                          ${selectedMaterial === material.id
                            ? "bg-emerald-600 border-emerald-700 text-white shadow-md scale-105"
                            : "bg-white border-slate-200 text-slate-600 hover:border-emerald-300 hover:bg-emerald-50"
                          }
                        `}
                      >
                        {material.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Seletor de Espessura do Corpo */}
              {availableThicknesses.length > 0 && (
                <div className="space-y-4 pb-2">
                  <h4 className="font-medium text-sm flex items-center gap-2">
                    <Settings className="w-4 h-4" />
                    Corpo do Módulo: Espessura
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
                </div>
              )}

              <Separator className="my-4" />

              <Separator className="my-4" />

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
                              {Array.from({ length: (opt.max ?? 20) - (opt.min ?? 0) + 1 }, (_, index) => (opt.min ?? 0) + index).map(num => (
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
              {/* Seletor de Material e Espessura para Acabamentos */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-4">
                {/* Material Selection in Finishes Tab */}
                <div className="space-y-3">
                  <h5 className="text-xs font-semibold text-slate-900 flex items-center gap-2">
                    <Shapes className="w-3 h-3" />
                    Tipo de Material
                  </h5>
                  <div className="flex flex-wrap gap-2">
                    {availableMaterials.map((material) => (
                      <button
                        key={material.id}
                        onClick={() => setSelectedMaterial(material.id)}
                        className={`
                          px-4 py-2 rounded-lg text-xs font-medium transition-all duration-200 border-2
                          ${selectedMaterial === material.id
                            ? "bg-emerald-600 border-emerald-700 text-white shadow-md scale-105"
                            : "bg-white border-slate-200 text-slate-600 hover:border-emerald-300 hover:bg-emerald-50"
                          }
                        `}
                      >
                        {material.name}
                      </button>
                    ))}
                  </div>
                </div>

                <Separator className="opacity-50" />

                <div className="space-y-3">
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
                </div>
                <p className="text-[10px] text-slate-500 italic">
                  * A disponibilidade de cores varia conforme o material e a espessura selecionados.
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
                      <div key={acabamento.id} className="group relative flex flex-col items-center gap-2">
                        <div className="relative w-full aspect-square rounded-lg border border-slate-200 shadow-sm overflow-hidden">
                          <div 
                            className="absolute inset-0" 
                            style={{ backgroundColor: acabamento.colorHex || "#eee" }}
                          >
                            {getTextureOverlay(acabamento.nome)}
                          </div>
                          
                          {/* Zoom Icon Overlay */}
                          <div 
                            className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100 cursor-pointer"
                            onClick={() => setZoomedFinish({
                              id: acabamento.id,
                              name: acabamento.nome,
                              color: acabamento.nome,
                              colorHex: acabamento.colorHex || "#eee",
                              texture: "liso",
                              materials: acabamento.materiais.map(m => m.tipo),
                              available: true
                            })}
                          >
                            <div className="bg-white/90 p-1.5 rounded-full shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                              <Maximize2 className="w-3 h-3 text-amber-600" />
                            </div>
                          </div>
                        </div>
                        <span className="text-[9px] font-medium text-center text-slate-600 truncate w-full">
                          {acabamento.nome}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <Palette className="w-6 h-6 mx-auto mb-2 opacity-40" />
                    <p className="font-medium text-sm">Nenhum acabamento encontrado</p>
                    <p className="text-xs text-slate-600 mt-1">
                      Não foram encontrados acabamentos compatíveis com os materiais selecionados
                    </p>
                    <div className="flex items-center gap-1.5 pt-1">
                      <div className="flex -space-x-2">
                        {['#fbbf24', '#f87171', '#4ade80', '#60a5fa', '#a78bfa'].map((c, i) => (
                          <div key={i} className="w-4 h-4 rounded-full border-2 border-white" style={{ backgroundColor: c }} />
                        ))}
                      </div>
                      <span className="text-[10px] font-bold text-blue-600">+ centenas de outras opções</span>
                    </div>
                  </div>
                )}

                <Separator className="my-6 opacity-40" />

                {/* CONFIGURAÇÃO DE PORTAS E GAVETAS (RELOCADO PARA TAB DE CORES) */}
                {model.frontOptions && (
                  <div className="space-y-6 pt-4 pb-4 animate-in fade-in slide-in-from-top-4 duration-500">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-sm flex items-center gap-2 text-slate-800">
                        <DoorOpen className="w-4 h-4 text-amber-600" />
                        Portas e Gavetas (Frentes)
                      </h4>
                      <Badge variant="secondary" className="text-[10px] uppercase font-bold bg-amber-100 text-amber-700 border-amber-200 shadow-sm">
                        Configuração Frontal
                      </Badge>
                    </div>

                    {/* 1. Material e Espessura da Frente */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Material da Frente</span>
                        <div className="flex gap-2">
                          {getAvailableFrontMaterials(model.pieceId).map((material) => (
                            <button
                              key={material.id}
                              onClick={() => setSelectedFrontMaterial(material.id)}
                              className={`flex-1 py-1.5 rounded-md text-[11px] font-bold border transition-all ${
                                selectedFrontMaterial === material.id
                                  ? "bg-white border-amber-600 text-amber-700 shadow-sm ring-1 ring-amber-600/20"
                                  : "bg-slate-100/50 border-slate-200 text-slate-600 hover:bg-white"
                              }`}
                            >
                              {material.name}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Espessura da Frente</span>
                        <div className="flex gap-2">
                          {getAvailableFrontThicknesses(model.pieceId).map((thickness) => (
                            <button
                              key={thickness.thickness}
                              onClick={() => setSelectedFrontThickness(thickness.thickness)}
                              className={`flex-1 py-1.5 rounded-md text-[11px] font-bold border transition-all ${
                                selectedFrontThickness === thickness.thickness
                                  ? "bg-white border-amber-600 text-amber-700 shadow-sm ring-1 ring-amber-600/20"
                                  : "bg-slate-100/50 border-slate-200 text-slate-600 hover:bg-white"
                              }`}
                            >
                              {thickness.thickness}mm
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* 2. Cores da Porta (Filtrado por Material) com ZOOM */}
                    <div className="space-y-3">
                      <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Cor da Porta / Gaveta</span>
                      <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                        {getAvailableFrontFinishes(model.pieceId, selectedFrontThickness || undefined, selectedFrontMaterial || undefined).map((finish) => (
                          <div key={finish.id} className="group relative flex flex-col items-center gap-1.5">
                            <button
                              onClick={() => setSelectedFrontFinishId(finish.id)}
                              className={`w-full aspect-square rounded-lg border-2 transition-all relative overflow-hidden ${
                                selectedFrontFinishId === finish.id 
                                  ? "border-amber-600 shadow-md ring-2 ring-amber-600/20" 
                                  : "border-slate-200 hover:border-slate-300"
                              }`}
                              style={{ backgroundColor: finish.colorHex || "#eee" }}
                            >
                              {getTextureOverlay(finish.name)}
                              
                              {/* Zoom Button Overlay */}
                              <div 
                                className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setZoomedFinish(finish);
                                }}
                              >
                                <div className="bg-white/90 p-1.5 rounded-full shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                                  <Maximize2 className="w-3.5 h-3.5 text-amber-600" />
                                </div>
                              </div>
                            </button>
                            <span className={`text-[9px] leading-tight text-center truncate w-full px-0.5 ${
                              selectedFrontFinishId === finish.id ? "font-bold text-amber-700" : "text-slate-500"
                            }`}>
                              {finish.name}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* 3. Escolha de Puxadores */}
                    <div className="space-y-4 pt-2">
                      <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Escolha de Puxadores</span>
                      
                      {/* Seletor de Tipo de Puxador */}
                      <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200">
                        <button 
                          onClick={() => {
                            setSelectedHandleType("nenhum");
                            setSelectedHandleId("sem-perfil");
                          }}
                          className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-bold transition-all ${
                            selectedHandleType === "nenhum" 
                              ? "bg-white text-slate-900 shadow-sm border-slate-200" 
                              : "text-slate-500 hover:text-slate-700 hover:bg-white/50"
                          }`}
                        >
                          Sem Puxador
                        </button>
                        <button 
                          onClick={() => {
                            setSelectedHandleType("perfil");
                            const gola = model.frontOptions?.handleOptions.find(h => h.id === "perfil-gola-24mm");
                            if (gola) {
                              setSelectedHandleId(gola.id);
                              setSelectedHandleColorId(gola.colors[0]?.id || null);
                            }
                          }}
                          className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-bold transition-all ${
                            selectedHandleType === "perfil" 
                              ? "bg-white text-amber-700 shadow-sm border-amber-200" 
                              : "text-slate-500 hover:text-slate-700 hover:bg-white/50"
                          }`}
                        >
                          <Settings className="w-3.5 h-3.5" />
                          Perfil Gola
                        </button>
                        <button 
                          onClick={() => {
                            setSelectedHandleType("avulso");
                            setSelectedHandleId("avulso");
                            if (!selectedHandleBrand) {
                              setSelectedHandleBrand(getAvailableHandleBrands(model.pieceId)[0] || null);
                            }
                          }}
                          className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-bold transition-all ${
                            selectedHandleType === "avulso" 
                              ? "bg-white text-blue-700 shadow-sm border-blue-200" 
                              : "text-slate-500 hover:text-slate-700 hover:bg-white/50"
                          }`}
                        >
                          <MousePointer2 className="w-3.5 h-3.5" />
                          Puxador Avulso
                        </button>
                      </div>

                      {/* Conteúdo dependente do Tipo */}
                      
                      {/* Seção Perfil Gola */}
                      {selectedHandleType === "perfil" && (
                        <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-300 border-l-2 border-amber-500 pl-4 py-2">
                          <div className="space-y-2">
                            <span className="text-[10px] uppercase font-bold text-amber-800">Modelo do Perfil</span>
                            <div className="flex flex-wrap gap-2">
                              {getAvailableHandles(model.pieceId).filter(h => h.id !== "sem-perfil").map((handle) => (
                                <button
                                  key={handle.id}
                                  onClick={() => {
                                    setSelectedHandleId(handle.id);
                                    if (handle.colors.length > 0 && !selectedHandleColorId) {
                                      setSelectedHandleColorId(handle.colors[0].id);
                                    }
                                  }}
                                  className={`px-4 py-2 rounded-lg text-xs font-bold border transition-all ${
                                    selectedHandleId === handle.id
                                      ? "bg-amber-600 border-amber-700 text-white shadow-md ring-2 ring-amber-600/30"
                                      : "bg-white border-slate-200 text-slate-600 hover:border-amber-400"
                                  }`}
                                >
                                  {handle.name}
                                </button>
                              ))}
                            </div>
                          </div>

                          {/* Cores do Puxador Gola */}
                          {selectedHandleId && selectedHandleId !== "sem-perfil" && (
                            <div className="space-y-3 p-3 bg-amber-50/50 rounded-lg border border-amber-100">
                              <span className="text-[10px] uppercase font-bold text-amber-800 flex items-center gap-2">
                                Cor do Acabamento Gola
                              </span>
                              <div className="flex gap-4">
                                {model.frontOptions?.handleOptions
                                  .find(h => h.id === selectedHandleId)?.colors.map((color) => (
                                    <button
                                      key={color.id}
                                      onClick={() => setSelectedHandleColorId(color.id)}
                                      className="flex flex-col items-center gap-1.5 group"
                                    >
                                      <div 
                                        className={`w-8 h-8 rounded-full border-2 shadow-sm transition-all ${
                                          selectedHandleColorId === color.id 
                                            ? "border-amber-600 scale-125 ring-2 ring-amber-600/30" 
                                            : "border-white group-hover:border-amber-300"
                                        }`}
                                        style={{ backgroundColor: color.hex }}
                                      />
                                      <span className={`text-[10px] ${
                                        selectedHandleColorId === color.id ? "font-bold text-amber-700" : "text-slate-500"
                                      }`}>
                                        {color.name}
                                      </span>
                                    </button>
                                  ))}
                              </div>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Seção Puxador Avulso (Marcas) */}
                      {selectedHandleType === "avulso" && (
                        <div className="space-y-3 animate-in fade-in slide-in-from-top-2 duration-300 border-l-2 border-blue-500 pl-4 py-2">
                          <span className="text-[10px] uppercase font-bold text-blue-800 flex items-center gap-2">
                            Marcas Disponíveis (Puxadores Avulsos)
                          </span>
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                            {getAvailableHandleBrands(model.pieceId).map((brand) => (
                              <button
                                key={brand}
                                onClick={() => setSelectedHandleBrand(brand)}
                                className={`px-3 py-2 rounded-lg text-[11px] font-bold border transition-all text-center ${
                                  selectedHandleBrand === brand
                                    ? "bg-blue-600 border-blue-700 text-white shadow-md ring-2 ring-blue-600/20"
                                    : "bg-white border-slate-200 text-slate-600 hover:border-blue-400 hover:bg-blue-50"
                                }`}
                              >
                                {brand}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
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

    {/* COLOR ZOOM LIGHTBOX */}
    {zoomedFinish && (
      <div 
        className="fixed inset-0 z-[200] flex items-center justify-center bg-zinc-950/90 backdrop-blur-md animate-in fade-in duration-300"
        onClick={() => setZoomedFinish(null)}
      >
        <button 
          className="absolute top-6 right-6 p-3 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors z-[210]"
          onClick={(e) => {
            e.stopPropagation();
            setZoomedFinish(null);
          }}
        >
          <CloseIcon className="w-6 h-6" />
        </button>
        
        <div 
          className="relative w-full max-w-lg px-4 flex flex-col items-center animate-in zoom-in-95 duration-300"
          onClick={(e) => e.stopPropagation()}
        >
          <div 
            className="w-64 h-64 md:w-80 md:h-80 rounded-3xl shadow-2xl border-4 border-white/20 overflow-hidden relative"
            style={{ backgroundColor: zoomedFinish.colorHex || "#eee" }}
          >
            {getTextureOverlay(zoomedFinish.name)}
          </div>
          
          <div className="mt-8 text-center space-y-2">
            <h3 className="text-white font-black text-3xl uppercase tracking-tighter">{zoomedFinish.name}</h3>
          </div>
        </div>
      </div>
    )}
  </>
);
}
