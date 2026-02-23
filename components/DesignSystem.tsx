import { ReactNode, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";
import {
  Palette,
  Type,
  Square,
  Circle,
  Settings,
  Eye,
  EyeOff,
  Star,
  TrendingUp,
  Clock,
  Users,
  Package,
  Search,
  Filter,
  FileText,
  Video,
  Sparkles,
  Crown,
  Zap,
  Target,
  Award,
  Bookmark,
  Info,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Lock,
  Unlock,
  Ruler
} from "lucide-react";

// Smart Badge Component with enhanced features
interface SmartBadgeProps {
  children: ReactNode;
  type?: "new" | "popular" | "frequent" | "category" | "search" | "technical" | "consulted";
  count?: number;
  tooltip?: string;
  className?: string;
  isAdminMode?: boolean;
  onToggle?: () => void;
  isHidden?: boolean;
}

export function SmartBadge({
  children,
  type = "category",
  count,
  tooltip,
  className = "",
  isAdminMode = false,
  onToggle,
  isHidden = false
}: SmartBadgeProps) {
  if (isHidden && !isAdminMode) return null;

  const getBadgeStyles = (type: SmartBadgeProps["type"]) => {
    const baseStyles = "inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium transition-all duration-200";

    switch (type) {
      case "new":
        return `${baseStyles} bg-green-100 text-green-700 border border-green-200 dark:bg-green-900/20 dark:text-green-300 dark:border-green-800`;
      case "popular":
        return `${baseStyles} bg-orange-100 text-orange-700 border border-orange-200 dark:bg-orange-900/20 dark:text-orange-300 dark:border-orange-800`;
      case "frequent":
        return `${baseStyles} bg-blue-100 text-blue-700 border border-blue-200 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800`;
      case "category":
        return `${baseStyles} bg-purple-100 text-purple-700 border border-purple-200 dark:bg-purple-900/20 dark:text-purple-300 dark:border-purple-800`;
      case "search":
        return `${baseStyles} bg-violet-100 text-violet-700 border border-violet-200 dark:bg-violet-900/20 dark:text-violet-300 dark:border-violet-800`;
      case "technical":
        return `${baseStyles} bg-slate-100 text-slate-700 border border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700`;
      case "consulted":
        return `${baseStyles} bg-amber-100 text-amber-700 border border-amber-200 dark:bg-amber-900/20 dark:text-amber-300 dark:border-amber-800`;
      default:
        return `${baseStyles} bg-gray-100 text-gray-700 border border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700`;
    }
  };

  const getIcon = (type: SmartBadgeProps["type"]) => {
    switch (type) {
      case "new":
        return <Sparkles className="w-3 h-3" />;
      case "popular":
        return <TrendingUp className="w-3 h-3" />;
      case "frequent":
        return <Clock className="w-3 h-3" />;
      case "category":
        return <Package className="w-3 h-3" />;
      case "search":
        return <Search className="w-3 h-3" />;
      case "technical":
        return <FileText className="w-3 h-3" />;
      case "consulted":
        return <Target className="w-3 h-3" />;
      default:
        return null;
    }
  };

  const badgeContent = (
    <div className={`${getBadgeStyles(type)} ${className} ${isHidden ? 'opacity-50 border-dashed' : ''
      }`}>
      {getIcon(type)}
      <span className="truncate max-w-32">
        {children}
        {count !== undefined && count > 0 && ` (${count})`}
      </span>
      {isAdminMode && onToggle && (
        <Button
          variant="ghost"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            onToggle();
          }}
          className="h-4 w-4 p-0 ml-1 hover:bg-current/20"
        >
          {isHidden ? <EyeOff className="w-2.5 h-2.5" /> : <Eye className="w-2.5 h-2.5" />}
        </Button>
      )}
    </div>
  );

  if (tooltip) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            {badgeContent}
          </TooltipTrigger>
          <TooltipContent>
            <p className="max-w-xs text-xs">{tooltip}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return badgeContent;
}

// Fixed State Badge Component for AdminPanel
interface FixedStateBadgeProps {
  isFixed: boolean;
  className?: string;
}

export function FixedStateBadge({ isFixed, className = "" }: FixedStateBadgeProps) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Badge
            variant={isFixed ? "default" : "outline"}
            className={`text-xs ${isFixed
              ? "bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-300 dark:border-amber-800"
              : "bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700"
              } ${className}`}
          >
            {isFixed ? (
              <>
                <Lock className="w-3 h-3 mr-1" />
                Fixo
              </>
            ) : (
              <>
                <Unlock className="w-3 h-3 mr-1" />
                Variável
              </>
            )}
          </Badge>
        </TooltipTrigger>
        <TooltipContent>
          <p>
            {isFixed
              ? "Esta dimensão é fixa e não pode ser alterada pelo usuário"
              : "Esta dimensão pode variar dentro do intervalo configurado"
            }
          </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

// Dimension Display Component for AdminPanel
interface DimensionDisplayProps {
  label: string;
  min: number | string;
  max: number | string;
  isFixed: boolean;
  unit?: string;
  variant?: "default" | "card";
  className?: string;
}

export function DimensionDisplay({
  label,
  min,
  max,
  isFixed,
  unit = "mm",
  className = ""
}: DimensionDisplayProps) {
  const displayValue = isFixed ? `${min}${unit}` : `${min} - ${max}${unit}`;

  return (
    <div className={`flex items-center justify-between p-3 bg-muted/30 rounded-lg ${className}`}>
      <div className="flex items-center gap-2">
        <Ruler className="w-4 h-4 text-muted-foreground" />
        <span className="font-medium text-foreground">{label}</span>
      </div>
      <div className="flex items-center gap-2">
        <span className="font-mono text-sm text-foreground">{displayValue}</span>
        <FixedStateBadge isFixed={isFixed} />
      </div>
    </div>
  );
}

// Design Token Display Component
export function DesignTokens() {
  const colors = {
    primary: "var(--primary)",
    secondary: "var(--secondary)",
    muted: "var(--muted)",
    accent: "var(--accent)",
    destructive: "var(--destructive)",
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-base font-semibold mb-4">Cores do Sistema</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {Object.entries(colors).map(([name, value]) => (
            <div key={name} className="space-y-2">
              <div
                className="w-full h-16 rounded-lg border border-border shadow-sm"
                style={{ backgroundColor: value }}
              />
              <div className="text-sm">
                <div className="font-medium capitalize">{name}</div>
                <div className="text-xs text-muted-foreground font-mono">{value}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-base font-semibold mb-4">Tipografia</h3>
        <div className="space-y-4">
          <div className="space-y-2">
            <h1>Heading 1 - Sistema técnico</h1>
            <h2>Heading 2 - Categorias principais</h2>
            <h3>Heading 3 - Subcategorias</h3>
            <h4>Heading 4 - Especificações</h4>
            <p>Parágrafo - Descrições técnicas e informações detalhadas dos componentes.</p>
            <small className="text-sm text-muted-foreground">
              Texto auxiliar - Informações complementares e metadados.
            </small>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-base font-semibold mb-4">SmartBadges</h3>
        <div className="flex flex-wrap gap-3">
          <SmartBadge type="new">Novo</SmartBadge>
          <SmartBadge type="category" count={24}>Categoria</SmartBadge>
          <SmartBadge type="search">Busca ativa</SmartBadge>
          <SmartBadge type="technical">Especificação</SmartBadge>
          <SmartBadge type="consulted">Consulta técnica</SmartBadge>
          <SmartBadge type="frequent">Frequente</SmartBadge>
        </div>
      </div>
    </div>
  );
}

// Component Showcase
export function ComponentShowcase() {
  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-base font-semibold mb-4">Botões e Ações</h3>
        <div className="flex flex-wrap gap-3">
          <Button>Primário</Button>
          <Button variant="secondary">Secundário</Button>
          <Button variant="outline">Contorno</Button>
          <Button variant="ghost">Fantasma</Button>
          <Button variant="destructive">Destrutivo</Button>
        </div>
      </div>

      <div>
        <h3 className="text-base font-semibold mb-4">Estados de Status</h3>
        <div className="flex flex-wrap gap-3">
          <Badge className="bg-green-100 text-green-700 border-green-200">
            <CheckCircle className="w-3 h-3 mr-1" />
            Disponível
          </Badge>
          <Badge className="bg-amber-100 text-amber-700 border-amber-200">
            <AlertTriangle className="w-3 h-3 mr-1" />
            Sob consulta
          </Badge>
          <Badge className="bg-red-100 text-red-700 border-red-200">
            <XCircle className="w-3 h-3 mr-1" />
            Indisponível
          </Badge>
        </div>
      </div>

      <div>
        <h3 className="text-base font-semibold mb-4">Cards e Containers</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="rounded-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="w-4 h-4" />
                Card Padrão
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Container padrão para exibição de conteúdo estruturado.
              </p>
            </CardContent>
          </Card>

          <Card className="rounded-xl border-dashed border-amber-200 bg-amber-50/50 dark:border-amber-800 dark:bg-amber-900/10">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-amber-700 dark:text-amber-300">
                <Crown className="w-4 h-4" />
                Card Destacado
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-amber-600 dark:text-amber-400">
                Variação para conteúdo em destaque ou modo administrativo.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

// Interactive Style Guide
export function StyleGuide() {
  const [activeSection, setActiveSection] = useState("tokens");

  const sections = [
    { id: "tokens", name: "Design Tokens", icon: Palette },
    { id: "components", name: "Componentes", icon: Square },
    { id: "patterns", name: "Padrões de Uso", icon: Type },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 border-b border-border">
        {sections.map(({ id, name, icon: Icon }) => (
          <Button
            key={id}
            variant={activeSection === id ? "default" : "ghost"}
            onClick={() => setActiveSection(id)}
            className="rounded-b-none border-b-2 border-transparent data-[active]:border-primary"
            data-active={activeSection === id}
          >
            <Icon className="w-4 h-4 mr-2" />
            {name}
          </Button>
        ))}
      </div>

      <div className="py-4">
        {activeSection === "tokens" && <DesignTokens />}
        {activeSection === "components" && <ComponentShowcase />}
        {activeSection === "patterns" && (
          <div className="space-y-6">
            <div>
              <h3 className="text-base font-semibold mb-4">Padrões de Interface</h3>
              <div className="space-y-4 text-sm">
                <div className="p-4 bg-muted/30 rounded-lg">
                  <h4 className="font-medium mb-2">Hierarquia Visual</h4>
                  <p className="text-muted-foreground">
                    Use SmartBadges para categorizar informações. Títulos truncados devem ter tooltips
                    para acessibilidade. Evite expor métricas internas de popularidade.
                  </p>
                </div>
                <div className="p-4 bg-muted/30 rounded-lg">
                  <h4 className="font-medium mb-2">Responsividade</h4>
                  <p className="text-muted-foreground">
                    Layouts devem se adaptar de desktop para mobile mantendo funcionalidade.
                    Priorize conteúdo essencial em telas menores.
                  </p>
                </div>
                <div className="p-4 bg-muted/30 rounded-lg">
                  <h4 className="font-medium mb-2">Estados Administrativos</h4>
                  <p className="text-muted-foreground">
                    Modo admin deve mostrar controles adicionais discretamente.
                    Use elementos tracejados para indicar conteúdo oculto.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
