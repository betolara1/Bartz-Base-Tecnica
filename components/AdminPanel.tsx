import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Switch } from "./ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Separator } from "./ui/separator";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "./ui/dialog";
import {
  Settings,
  Save,
  Lock,
  Unlock,
  Plus,
  Trash2,
  Eye,
  FileText,
  Video,
  Box,
  Upload,
  AlertCircle,
  CheckCircle2,
  Package,
  Palette,
  Settings as SettingsIcon
} from "lucide-react";
import { PieceData } from "../data/catalog";
import { DimensionDisplay, FixedStateBadge } from "./DesignSystem";

// Tipos para configuração de modelos
interface ApiMaterial {
  id: string;
  name: string;
  description?: string;
  available: boolean;
}

interface ApiThickness {
  thickness: number;
  available: boolean;
  standard?: boolean;
}

interface ApiFinish {
  id: string;
  name: string;
  color: string;
  colorHex?: string;
  texture: "liso" | "texturizado" | "rustico" | "brilhante";
  available: boolean;
  standard?: boolean;
  availableInMDF?: boolean;
  availableInMDP?: boolean;
}

interface ApiAggregate {
  id: string;
  name: string;
  category: "organizacao" | "funcional" | "acabamento";
  description: string;
  available: boolean;
  price?: string;
  compatibility?: string[];
}

interface ApiModel {
  type: "modular" | "linear" | "curvo" | "muxarabi";
  materials: ApiMaterial[];
  thicknesses: ApiThickness[];
  finishes: ApiFinish[];
  aggregates: ApiAggregate[];
  characteristics?: string[];
  notes?: string[];
}

interface AdminPanelProps {
  piece?: PieceData;
  onSave?: (piece: PieceData) => void;
  onClose?: () => void;
}

export function AdminPanel({ piece, onSave, onClose }: AdminPanelProps) {
  const [editedPiece, setEditedPiece] = useState<PieceData>(
    piece || {
      id: '',
      categoria: '',
      subcategoria: '',
      descricao: '',
      min: { largura: 0, altura: 0, profundidade: 0 },
      max: { largura: 0, altura: 0, profundidade: 0 },
      fixos: { largura: false, altura: false, profundidade: false },
      links: {},
      popularidade: 1,
      relatedIds: [],
      tags: []
    }
  );

  // Estado para configuração de modelos
  const [modelConfig, setModelConfig] = useState<ApiModel>({
    type: "modular",
    materials: [
      { id: "mdp", name: "MDP", description: "Painel de partículas de média densidade", available: true },
      { id: "mdf", name: "MDF", description: "Painel de fibras de média densidade", available: true }
    ],
    thicknesses: [
      { thickness: 15, available: true, standard: false },
      { thickness: 18, available: true, standard: true },
      { thickness: 25, available: true, standard: false }
    ],
    finishes: [
      { id: "branco-tx", name: "Branco TX", color: "Branco", colorHex: "#FFFFFF", texture: "liso", available: true, standard: true, availableInMDF: true, availableInMDP: true }
    ],
    aggregates: [],
    characteristics: [],
    notes: []
  });

  const [activeTab, setActiveTab] = useState('basic');
  const [hasChanges, setHasChanges] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');

  const updatePiece = (updates: Partial<PieceData>) => {
    setEditedPiece(prev => ({ ...prev, ...updates }));
    setHasChanges(true);
  };

  const updateDimension = (
    type: 'min' | 'max',
    dimension: 'largura' | 'altura' | 'profundidade',
    value: number | string
  ) => {
    setEditedPiece(prev => ({
      ...prev,
      [type]: {
        ...prev[type],
        [dimension]: value
      }
    }));
    setHasChanges(true);
  };

  const toggleFixed = (dimension: 'largura' | 'altura' | 'profundidade') => {
    setEditedPiece(prev => ({
      ...prev,
      fixos: {
        ...prev.fixos,
        [dimension]: !prev.fixos[dimension]
      }
    }));
    setHasChanges(true);
  };

  const handleSave = async () => {
    setSaveStatus('saving');

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    try {
      onSave?.(editedPiece);
      setSaveStatus('saved');
      setHasChanges(false);

      setTimeout(() => setSaveStatus('idle'), 2000);
    } catch (error) {
      setSaveStatus('error');
      setTimeout(() => setSaveStatus('idle'), 2000);
    }
  };

  const SaveButton = () => {
    const variants = {
      idle: { icon: Save, text: 'Salvar Alterações', variant: 'default' as const },
      saving: { icon: Settings, text: 'Salvando...', variant: 'default' as const },
      saved: { icon: CheckCircle2, text: 'Salvo!', variant: 'default' as const },
      error: { icon: AlertCircle, text: 'Erro ao salvar', variant: 'destructive' as const }
    };

    const { icon: Icon, text, variant } = variants[saveStatus];

    return (
      <Button
        onClick={handleSave}
        disabled={!hasChanges || saveStatus === 'saving'}
        variant={variant}
        className={`
          ${saveStatus === 'saving' ? 'animate-pulse' : ''}
          ${saveStatus === 'saved' ? 'bg-green-600 hover:bg-green-700' : ''}
        `}
      >
        <Icon className={`w-4 h-4 mr-2 ${saveStatus === 'saving' ? 'animate-spin' : ''}`} />
        {text}
      </Button>
    );
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center gap-2">
              <Settings className="w-5 h-5" />
              {piece ? 'Editar Peça' : 'Nova Peça'}
            </DialogTitle>
            <div className="flex items-center gap-2">
              {hasChanges && (
                <Badge variant="secondary" className="bg-yellow-100 text-yellow-700">
                  Alterações não salvas
                </Badge>
              )}
              <SaveButton />
            </div>
          </div>
          <DialogDescription>
            {piece
              ? `Edite as especificações técnicas, dimensões e recursos da peça "${piece.descricao}".`
              : 'Configure uma nova peça com suas especificações técnicas, dimensões e recursos associados.'
            }
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 overflow-hidden">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="basic">Básico</TabsTrigger>
            <TabsTrigger value="dimensions">Dimensões</TabsTrigger>
            <TabsTrigger value="models">Modelos</TabsTrigger>
            <TabsTrigger value="resources">Recursos</TabsTrigger>
            <TabsTrigger value="preview">Preview</TabsTrigger>
          </TabsList>

          <div className="mt-4 h-[60vh] overflow-y-auto">
            <TabsContent value="basic" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Informações Gerais</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="categoria">Categoria</Label>
                      <Select
                        value={editedPiece.categoria}
                        onValueChange={(value) => updatePiece({ categoria: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione uma categoria" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Armários">Armários</SelectItem>
                          <SelectItem value="Gavetas">Gavetas</SelectItem>
                          <SelectItem value="Prateleiras">Prateleiras</SelectItem>
                          <SelectItem value="Portas">Portas</SelectItem>
                          <SelectItem value="Ferragens">Ferragens</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="subcategoria">Subcategoria</Label>
                      <Input
                        id="subcategoria"
                        value={editedPiece.subcategoria}
                        onChange={(e) => updatePiece({ subcategoria: e.target.value })}
                        placeholder="Ex: Base, Aéreo, Simples..."
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="descricao">Descrição</Label>
                    <Textarea
                      id="descricao"
                      value={editedPiece.descricao}
                      onChange={(e) => updatePiece({ descricao: e.target.value })}
                      placeholder="Descrição detalhada da peça..."
                      rows={3}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Frequência de Consulta</Label>
                      <Select
                        value={editedPiece.popularidade.toString()}
                        onValueChange={(value) => updatePiece({ popularidade: parseInt(value) })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">⭐ Pouco consultada</SelectItem>
                          <SelectItem value="2">⭐⭐ Consulta regular</SelectItem>
                          <SelectItem value="3">⭐⭐⭐ Consulta frequente</SelectItem>
                          <SelectItem value="4">⭐⭐⭐⭐ Muito consultada</SelectItem>
                          <SelectItem value="5">⭐⭐⭐⭐⭐ Frequentemente consultada</SelectItem>
                        </SelectContent>
                      </Select>
                      <p className="text-xs text-muted-foreground">
                        Indica a frequência com que esta peça é consultada pelos usuários
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label>Tags</Label>
                      <Input
                        placeholder="Ex: padrão, funcional, moderno..."
                        value={editedPiece.tags.join(', ')}
                        onChange={(e) => updatePiece({
                          tags: e.target.value.split(',').map(t => t.trim()).filter(Boolean)
                        })}
                      />
                      <p className="text-xs text-muted-foreground">
                        Palavras-chave para facilitar buscas e organização
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="dimensions" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Configuração Dimensional</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Configure os intervalos permitidos e marque dimensões como fixas quando necessário.
                  </p>
                </CardHeader>
                <CardContent className="space-y-6">
                  {(['largura', 'altura', 'profundidade'] as const).map((dimension) => (
                    <Card key={dimension} className="p-4">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="font-semibold capitalize">{dimension}</h4>
                        <div className="flex items-center gap-3">
                          <FixedStateBadge isFixed={editedPiece.fixos[dimension]} />
                          <div className="flex items-center gap-2">
                            <Label htmlFor={`${dimension}-fixed`} className="text-sm">
                              Valor fixo
                            </Label>
                            <Switch
                              id={`${dimension}-fixed`}
                              checked={editedPiece.fixos[dimension]}
                              onCheckedChange={() => toggleFixed(dimension)}
                            />
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Valor Mínimo (mm)</Label>
                          <Input
                            type="text"
                            value={editedPiece.min[dimension]}
                            onChange={(e) => updateDimension('min', dimension, e.target.value)}
                            placeholder="0"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Valor Máximo (mm)</Label>
                          <Input
                            type="text"
                            value={editedPiece.max[dimension]}
                            onChange={(e) => updateDimension('max', dimension, e.target.value)}
                            placeholder="0"
                            disabled={editedPiece.fixos[dimension]}
                          />
                        </div>
                      </div>

                      {editedPiece.fixos[dimension] && (
                        <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                          <p className="text-sm text-amber-800">
                            <Lock className="w-4 h-4 inline mr-1" />
                            Esta dimensão será fixa em <strong>{editedPiece.min[dimension]}mm</strong>
                          </p>
                        </div>
                      )}
                    </Card>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="models" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Package className="w-5 h-5" />
                    Configuração de Modelos
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Configure materiais, espessuras, revestimentos e agregados disponíveis para esta peça.
                  </p>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="materials" className="w-full">
                    <TabsList className="grid w-full grid-cols-4">
                      <TabsTrigger value="materials">Materiais</TabsTrigger>
                      <TabsTrigger value="thicknesses">Espessuras</TabsTrigger>
                      <TabsTrigger value="finishes">Revestimentos</TabsTrigger>
                      <TabsTrigger value="aggregates">Agregados</TabsTrigger>
                    </TabsList>

                    <TabsContent value="materials" className="space-y-4 mt-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">Materiais Base</h4>
                          <p className="text-sm text-muted-foreground">Configure os materiais disponíveis</p>
                        </div>
                        <Button size="sm" className="gap-2">
                          <Plus className="w-4 h-4" />
                          Adicionar Material
                        </Button>
                      </div>

                      <div className="space-y-3">
                        {modelConfig.materials.map((material, index) => (
                          <Card key={material.id} className="p-4">
                            <div className="flex items-center justify-between mb-3">
                              <div className="flex items-center gap-3">
                                <Switch
                                  checked={material.available}
                                  onCheckedChange={(checked) => {
                                    const updatedMaterials = [...modelConfig.materials];
                                    updatedMaterials[index].available = checked;
                                    setModelConfig(prev => ({ ...prev, materials: updatedMaterials }));
                                  }}
                                />
                                <div>
                                  <h5 className="font-medium">{material.name}</h5>
                                  <p className="text-sm text-muted-foreground">{material.description}</p>
                                </div>
                              </div>
                              <Button variant="ghost" size="sm" className="text-destructive">
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                              <Input
                                placeholder="Nome do material"
                                value={material.name}
                                onChange={(e) => {
                                  const updatedMaterials = [...modelConfig.materials];
                                  updatedMaterials[index].name = e.target.value;
                                  setModelConfig(prev => ({ ...prev, materials: updatedMaterials }));
                                }}
                              />
                              <Input
                                placeholder="Descrição"
                                value={material.description || ''}
                                onChange={(e) => {
                                  const updatedMaterials = [...modelConfig.materials];
                                  updatedMaterials[index].description = e.target.value;
                                  setModelConfig(prev => ({ ...prev, materials: updatedMaterials }));
                                }}
                              />
                            </div>
                          </Card>
                        ))}
                      </div>
                    </TabsContent>

                    <TabsContent value="thicknesses" className="space-y-4 mt-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">Espessuras Disponíveis</h4>
                          <p className="text-sm text-muted-foreground">Configure as espessuras padrão e opcionais</p>
                        </div>
                        <Button size="sm" className="gap-2">
                          <Plus className="w-4 h-4" />
                          Adicionar Espessura
                        </Button>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        {modelConfig.thicknesses.map((thickness, index) => (
                          <Card key={index} className="p-3">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-2">
                                <Switch
                                  checked={thickness.available}
                                  onCheckedChange={(checked) => {
                                    const updatedThicknesses = [...modelConfig.thicknesses];
                                    updatedThicknesses[index].available = checked;
                                    setModelConfig(prev => ({ ...prev, thicknesses: updatedThicknesses }));
                                  }}
                                />
                                <span className="font-medium">{thickness.thickness}mm</span>
                              </div>
                              <Button variant="ghost" size="sm" className="text-destructive h-6 w-6 p-0">
                                <Trash2 className="w-3 h-3" />
                              </Button>
                            </div>
                            <div className="flex items-center gap-2">
                              <Input
                                type="number"
                                placeholder="Espessura (mm)"
                                value={thickness.thickness}
                                onChange={(e) => {
                                  const updatedThicknesses = [...modelConfig.thicknesses];
                                  updatedThicknesses[index].thickness = parseInt(e.target.value) || 0;
                                  setModelConfig(prev => ({ ...prev, thicknesses: updatedThicknesses }));
                                }}
                                className="text-sm"
                              />
                              <div className="flex items-center gap-1">
                                <Switch
                                  checked={thickness.standard || false}
                                  onCheckedChange={(checked) => {
                                    const updatedThicknesses = [...modelConfig.thicknesses];
                                    updatedThicknesses[index].standard = checked;
                                    setModelConfig(prev => ({ ...prev, thicknesses: updatedThicknesses }));
                                  }}
                                />
                                <Label className="text-xs">Padrão</Label>
                              </div>
                            </div>
                          </Card>
                        ))}
                      </div>
                    </TabsContent>

                    <TabsContent value="finishes" className="space-y-4 mt-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">Revestimentos Melamínicos</h4>
                          <p className="text-sm text-muted-foreground">Configure cores e texturas disponíveis</p>
                        </div>
                        <Button size="sm" className="gap-2">
                          <Plus className="w-4 h-4" />
                          Adicionar Revestimento
                        </Button>
                      </div>

                      <div className="space-y-3">
                        {modelConfig.finishes.map((finish, index) => (
                          <Card key={finish.id} className="p-4">
                            <div className="flex items-center justify-between mb-3">
                              <div className="flex items-center gap-3">
                                <Switch
                                  checked={finish.available}
                                  onCheckedChange={(checked) => {
                                    const updatedFinishes = [...modelConfig.finishes];
                                    updatedFinishes[index].available = checked;
                                    setModelConfig(prev => ({ ...prev, finishes: updatedFinishes }));
                                  }}
                                />
                                <div className="flex items-center gap-2">
                                  <div
                                    className="w-6 h-6 rounded border-2 border-slate-300"
                                    style={{ backgroundColor: finish.colorHex || finish.color }}
                                  />
                                  <div>
                                    <h5 className="font-medium">{finish.name}</h5>
                                    <p className="text-xs text-muted-foreground">{finish.color} • {finish.texture}</p>
                                  </div>
                                </div>
                              </div>
                              <Button variant="ghost" size="sm" className="text-destructive">
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                            <div className="grid grid-cols-2 gap-3 mb-3">
                              <Input
                                placeholder="Nome do revestimento"
                                value={finish.name}
                                onChange={(e) => {
                                  const updatedFinishes = [...modelConfig.finishes];
                                  updatedFinishes[index].name = e.target.value;
                                  setModelConfig(prev => ({ ...prev, finishes: updatedFinishes }));
                                }}
                              />
                              <Input
                                placeholder="Cor base"
                                value={finish.color}
                                onChange={(e) => {
                                  const updatedFinishes = [...modelConfig.finishes];
                                  updatedFinishes[index].color = e.target.value;
                                  setModelConfig(prev => ({ ...prev, finishes: updatedFinishes }));
                                }}
                              />
                              <Input
                                type="color"
                                value={finish.colorHex || '#FFFFFF'}
                                onChange={(e) => {
                                  const updatedFinishes = [...modelConfig.finishes];
                                  updatedFinishes[index].colorHex = e.target.value;
                                  setModelConfig(prev => ({ ...prev, finishes: updatedFinishes }));
                                }}
                              />
                              <Select
                                value={finish.texture}
                                onValueChange={(value: any) => {
                                  const updatedFinishes = [...modelConfig.finishes];
                                  updatedFinishes[index].texture = value;
                                  setModelConfig(prev => ({ ...prev, finishes: updatedFinishes }));
                                }}
                              >
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="liso">Liso</SelectItem>
                                  <SelectItem value="texturizado">Texturizado</SelectItem>
                                  <SelectItem value="rustico">Rústico</SelectItem>
                                  <SelectItem value="brilhante">Brilhante</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="flex items-center gap-4">
                              <div className="flex items-center gap-1">
                                <Switch
                                  checked={finish.standard || false}
                                  onCheckedChange={(checked) => {
                                    const updatedFinishes = [...modelConfig.finishes];
                                    updatedFinishes[index].standard = checked;
                                    setModelConfig(prev => ({ ...prev, finishes: updatedFinishes }));
                                  }}
                                />
                                <Label className="text-xs">Padrão</Label>
                              </div>
                              <div className="flex items-center gap-1">
                                <Switch
                                  checked={finish.availableInMDF || false}
                                  onCheckedChange={(checked) => {
                                    const updatedFinishes = [...modelConfig.finishes];
                                    updatedFinishes[index].availableInMDF = checked;
                                    setModelConfig(prev => ({ ...prev, finishes: updatedFinishes }));
                                  }}
                                />
                                <Label className="text-xs">MDF</Label>
                              </div>
                              <div className="flex items-center gap-1">
                                <Switch
                                  checked={finish.availableInMDP || false}
                                  onCheckedChange={(checked) => {
                                    const updatedFinishes = [...modelConfig.finishes];
                                    updatedFinishes[index].availableInMDP = checked;
                                    setModelConfig(prev => ({ ...prev, finishes: updatedFinishes }));
                                  }}
                                />
                                <Label className="text-xs">MDP</Label>
                              </div>
                            </div>
                          </Card>
                        ))}
                      </div>
                    </TabsContent>

                    <TabsContent value="aggregates" className="space-y-4 mt-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">Agregados Opcionais</h4>
                          <p className="text-sm text-muted-foreground">Configure acessórios e complementos</p>
                        </div>
                        <Button size="sm" className="gap-2">
                          <Plus className="w-4 h-4" />
                          Adicionar Agregado
                        </Button>
                      </div>

                      {modelConfig.aggregates.length === 0 ? (
                        <Card className="p-6 text-center">
                          <Package className="w-8 h-8 mx-auto mb-3 opacity-40" />
                          <p className="text-sm text-muted-foreground">Nenhum agregado configurado ainda</p>
                          <p className="text-xs text-muted-foreground mt-1">Clique em "Adicionar Agregado" para começar</p>
                        </Card>
                      ) : (
                        <div className="space-y-3">
                          {modelConfig.aggregates.map((aggregate, index) => (
                            <Card key={aggregate.id} className="p-4">
                              <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-3">
                                  <Switch
                                    checked={aggregate.available}
                                    onCheckedChange={(checked) => {
                                      const updatedAggregates = [...modelConfig.aggregates];
                                      updatedAggregates[index].available = checked;
                                      setModelConfig(prev => ({ ...prev, aggregates: updatedAggregates }));
                                    }}
                                  />
                                  <div>
                                    <h5 className="font-medium">{aggregate.name}</h5>
                                    <p className="text-xs text-muted-foreground capitalize">{aggregate.category}</p>
                                  </div>
                                </div>
                                <Button variant="ghost" size="sm" className="text-destructive">
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                              <div className="grid grid-cols-2 gap-3 mb-3">
                                <Input
                                  placeholder="Nome do agregado"
                                  value={aggregate.name}
                                  onChange={(e) => {
                                    const updatedAggregates = [...modelConfig.aggregates];
                                    updatedAggregates[index].name = e.target.value;
                                    setModelConfig(prev => ({ ...prev, aggregates: updatedAggregates }));
                                  }}
                                />
                                <Select
                                  value={aggregate.category}
                                  onValueChange={(value: any) => {
                                    const updatedAggregates = [...modelConfig.aggregates];
                                    updatedAggregates[index].category = value;
                                    setModelConfig(prev => ({ ...prev, aggregates: updatedAggregates }));
                                  }}
                                >
                                  <SelectTrigger>
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="organizacao">Organização</SelectItem>
                                    <SelectItem value="funcional">Funcional</SelectItem>
                                    <SelectItem value="acabamento">Acabamento</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                              <Textarea
                                placeholder="Descrição do agregado"
                                value={aggregate.description}
                                onChange={(e) => {
                                  const updatedAggregates = [...modelConfig.aggregates];
                                  updatedAggregates[index].description = e.target.value;
                                  setModelConfig(prev => ({ ...prev, aggregates: updatedAggregates }));
                                }}
                                rows={2}
                                className="mb-3"
                              />
                              <Input
                                placeholder="Preço (opcional)"
                                value={aggregate.price || ''}
                                onChange={(e) => {
                                  const updatedAggregates = [...modelConfig.aggregates];
                                  updatedAggregates[index].price = e.target.value;
                                  setModelConfig(prev => ({ ...prev, aggregates: updatedAggregates }));
                                }}
                              />
                            </Card>
                          ))}
                        </div>
                      )}
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="resources" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Recursos e Documentação</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Adicione links para vídeos, documentação e modelos 3D.
                  </p>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 p-4 border border-blue-200 bg-blue-50 rounded-lg">
                      <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                        <Video className="w-5 h-5 text-blue-600" />
                      </div>
                      <div className="flex-1 space-y-2">
                        <Label>Vídeo Explicativo</Label>
                        <Input
                          placeholder="https://example.com/video"
                          value={editedPiece.links?.video || ''}
                          onChange={(e) => updatePiece({
                            links: { ...(editedPiece.links || {}), video: e.target.value }
                          })}
                        />
                      </div>
                      <Button variant="outline" size="sm">
                        <Upload className="w-4 h-4" />
                      </Button>
                    </div>

                    <div className="flex items-center gap-3 p-4 border border-green-200 bg-green-50 rounded-lg">
                      <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                        <FileText className="w-5 h-5 text-green-600" />
                      </div>
                      <div className="flex-1 space-y-2">
                        <Label>Documentação Técnica</Label>
                        <Input
                          placeholder="https://example.com/docs"
                          value={editedPiece.links?.doc || ''}
                          onChange={(e) => updatePiece({
                            links: { ...(editedPiece.links || {}), doc: e.target.value }
                          })}
                        />
                      </div>
                      <Button variant="outline" size="sm">
                        <Upload className="w-4 h-4" />
                      </Button>
                    </div>

                    <div className="flex items-center gap-3 p-4 border border-purple-200 bg-purple-50 rounded-lg">
                      <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                        <Box className="w-5 h-5 text-purple-600" />
                      </div>
                      <div className="flex-1 space-y-2">
                        <Label>Modelo 3D</Label>
                        <Input
                          placeholder="viewer_001"
                          value={editedPiece.links?.viewer3dId || ''}
                          onChange={(e) => updatePiece({
                            links: { ...(editedPiece.links || {}), viewer3dId: e.target.value }
                          })}
                        />
                      </div>
                      <Button variant="outline" size="sm">
                        <Upload className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="preview" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Preview da Peça</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Visualize como a peça aparecerá no catálogo.
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Card Preview */}
                    <div>
                      <h4 className="font-medium mb-3">Visualização no Catálogo</h4>
                      <Card className="border-slate-200 rounded-xl overflow-hidden">
                        <CardHeader className="pb-4">
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-2">
                                <h3 className="text-base font-semibold text-slate-900 leading-tight line-clamp-2">
                                  {editedPiece.descricao || 'Nova peça'}
                                </h3>
                                {editedPiece.popularidade >= 4 && (
                                  <Badge variant="secondary" className="text-xs bg-blue-100 text-blue-700 border-blue-200">
                                    Frequentemente consultada
                                  </Badge>
                                )}
                              </div>
                              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                <span>{editedPiece.categoria || 'Categoria'}</span>
                                <span>→</span>
                                <span>{editedPiece.subcategoria || 'Subcategoria'}</span>
                              </div>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent className="pt-0">
                          <div className="space-y-2.5">
                            {(['largura', 'altura', 'profundidade'] as const).map((dimension) => (
                              <div key={dimension} className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <span className="text-sm font-medium text-slate-600 capitalize">{dimension}</span>
                                  {editedPiece.fixos[dimension] && <Lock className="w-3.5 h-3.5 text-amber-600" />}
                                </div>
                                <div className={`px-2.5 py-1.5 rounded-lg border text-xs font-medium ${editedPiece.fixos[dimension]
                                  ? 'bg-amber-50 text-amber-900 border-amber-200'
                                  : 'bg-slate-50 text-slate-700 border-slate-200'
                                  }`}>
                                  {editedPiece.min[dimension]}mm - {editedPiece.max[dimension]}mm
                                </div>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    {/* Models Preview */}
                    <div>
                      <h4 className="font-medium mb-3">Configuração de Modelos</h4>
                      <Card className="p-4 space-y-4">
                        <div className="text-xs text-muted-foreground">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <strong>Materiais:</strong> {modelConfig.materials.filter(m => m.available).length}
                            </div>
                            <div>
                              <strong>Espessuras:</strong> {modelConfig.thicknesses.filter(t => t.available).length}
                            </div>
                            <div>
                              <strong>Revestimentos:</strong> {modelConfig.finishes.filter(f => f.available).length}
                            </div>
                            <div>
                              <strong>Agregados:</strong> {modelConfig.aggregates.filter(a => a.available).length}
                            </div>
                          </div>
                        </div>

                        {modelConfig.materials.filter(m => m.available).length > 0 && (
                          <div className="space-y-2">
                            <h5 className="text-xs font-medium text-slate-600">Materiais Disponíveis:</h5>
                            <div className="flex flex-wrap gap-1">
                              {modelConfig.materials.filter(m => m.available).map(material => (
                                <Badge key={material.id} variant="secondary" className="text-xs">
                                  {material.name}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}

                        {modelConfig.finishes.filter(f => f.available).length > 0 && (
                          <div className="space-y-2">
                            <h5 className="text-xs font-medium text-slate-600">Revestimentos:</h5>
                            <div className="flex flex-wrap gap-1">
                              {modelConfig.finishes.filter(f => f.available).slice(0, 3).map(finish => (
                                <div key={finish.id} className="flex items-center gap-1 text-xs">
                                  <div
                                    className="w-3 h-3 rounded border border-slate-300"
                                    style={{ backgroundColor: finish.colorHex || finish.color }}
                                  />
                                  <span>{finish.name}</span>
                                </div>
                              ))}
                              {modelConfig.finishes.filter(f => f.available).length > 3 && (
                                <Badge variant="outline" className="text-xs">
                                  +{modelConfig.finishes.filter(f => f.available).length - 3}
                                </Badge>
                              )}
                            </div>
                          </div>
                        )}
                      </Card>
                    </div>

                    {/* Dimensions Preview */}
                    <div>
                      <h4 className="font-medium mb-3">Detalhes Dimensionais</h4>
                      <div className="space-y-3">
                        {(['largura', 'altura', 'profundidade'] as const).map((dimension) => (
                          <DimensionDisplay
                            key={dimension}
                            label={dimension.charAt(0).toUpperCase() + dimension.slice(1)}
                            min={editedPiece.min[dimension]}
                            max={editedPiece.max[dimension]}
                            isFixed={editedPiece.fixos[dimension]}
                            variant="card"
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </div>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}

// Admin trigger button for existing pieces
export function AdminTrigger({ piece, onSave }: { piece: PieceData; onSave: (piece: PieceData) => void }) {
  const [showAdmin, setShowAdmin] = useState(false);

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setShowAdmin(true)}
        className="gap-2"
        title="Editar especificações técnicas"
      >
        <Settings className="w-4 h-4" />
        Editar Especificações
      </Button>

      {showAdmin && (
        <AdminPanel
          piece={piece}
          onSave={(editedPiece) => {
            onSave(editedPiece);
            setShowAdmin(false);
          }}
          onClose={() => setShowAdmin(false)}
        />
      )}
    </>
  );
}
