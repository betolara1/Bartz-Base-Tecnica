import { useState } from "react";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { 
  Settings, 
  Eye, 
  Shield,
  User,
  Sparkles
} from "lucide-react";

interface ModeSelectorProps {
  isAdminMode: boolean;
  onToggleAdminMode: () => void;
}

export function ModeSelector({ isAdminMode, onToggleAdminMode }: ModeSelectorProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const modes = {
    user: {
      icon: Eye,
      title: 'Modo Usuário',
      description: 'Navegação e consulta de especificações',
      color: 'blue',
      features: ['Busca inteligente', 'Histórico detalhado', 'Recomendações']
    },
    admin: {
      icon: Shield,
      title: 'Modo Administrativo',
      description: 'Gerenciamento e configuração do sistema',
      color: 'red',
      features: ['Edição de conteúdo', 'Controle de visibilidade', 'Configurações']
    }
  };

  const currentMode = modes[isAdminMode ? 'admin' : 'user'];
  const CurrentIcon = currentMode.icon;

  return (
    <div className="relative">
      <Button
        variant="outline"
        onClick={() => setIsExpanded(!isExpanded)}
        className={`
          gap-2 transition-all duration-200
          ${isAdminMode ? 'bg-red-50 border-red-200 text-red-700 hover:bg-red-100 dark:bg-red-900/20 dark:border-red-800 dark:text-red-400' : 'bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100 dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-400'}
        `}
      >
        <CurrentIcon className="w-4 h-4" />
        {currentMode.title}
        <Badge 
          variant="secondary" 
          className={`text-xs ${
            isAdminMode 
              ? 'bg-red-100 text-red-700 border-red-300 dark:bg-red-900/30 dark:text-red-400 dark:border-red-700' 
              : 'bg-blue-100 text-blue-700 border-blue-300 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-700'
          }`}
        >
          {isAdminMode ? 'Admin' : 'Usuário'}
        </Badge>
      </Button>

      {isExpanded && (
        <Card className="absolute top-full left-0 mt-2 w-80 z-50 shadow-xl border rounded-xl overflow-hidden">
          <CardContent className="p-0">
            <div className="p-4 bg-muted/50 border-b">
              <h3 className="font-semibold text-foreground mb-1">Selecionar Modo</h3>
              <p className="text-sm text-muted-foreground">
                Escolha como você quer usar o sistema
              </p>
            </div>

            <div className="p-4 space-y-3">
              {Object.entries(modes).map(([key, modeData]) => {
                const Icon = modeData.icon;
                const isActive = (key === 'admin') === isAdminMode;
                
                return (
                  <div
                    key={key}
                    className={`
                      p-4 rounded-lg border cursor-pointer transition-all duration-200
                      ${isActive 
                        ? `bg-${modeData.color}-50 border-${modeData.color}-200 shadow-sm dark:bg-${modeData.color}-900/20 dark:border-${modeData.color}-800` 
                        : 'border-border hover:bg-muted/50 hover:border-border'
                      }
                    `}
                    onClick={() => {
                      const shouldBeAdmin = key === 'admin';
                      if (shouldBeAdmin !== isAdminMode) {
                        onToggleAdminMode();
                      }
                      setIsExpanded(false);
                    }}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`
                        w-10 h-10 rounded-lg flex items-center justify-center
                        ${isActive 
                          ? `bg-${modeData.color}-100 dark:bg-${modeData.color}-900/30` 
                          : 'bg-muted'
                        }
                      `}>
                        <Icon className={`
                          w-5 h-5 
                          ${isActive 
                            ? `text-${modeData.color}-600 dark:text-${modeData.color}-400` 
                            : 'text-muted-foreground'
                          }
                        `} />
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className={`
                            font-medium 
                            ${isActive 
                              ? `text-${modeData.color}-900 dark:text-${modeData.color}-100` 
                              : 'text-foreground'
                            }
                          `}>
                            {modeData.title}
                          </h4>
                          {isActive && (
                            <Badge 
                              variant="secondary" 
                              className={`text-xs bg-${modeData.color}-100 text-${modeData.color}-700 border-${modeData.color}-300 dark:bg-${modeData.color}-900/30 dark:text-${modeData.color}-400 dark:border-${modeData.color}-700`}
                            >
                              Ativo
                            </Badge>
                          )}
                        </div>
                        <p className={`
                          text-sm mb-2
                          ${isActive 
                            ? `text-${modeData.color}-700 dark:text-${modeData.color}-300` 
                            : 'text-muted-foreground'
                          }
                        `}>
                          {modeData.description}
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {modeData.features.map((feature, index) => (
                            <span 
                              key={index}
                              className={`
                                text-xs px-2 py-1 rounded-full
                                ${isActive 
                                  ? `bg-${modeData.color}-100 text-${modeData.color}-700 dark:bg-${modeData.color}-900/30 dark:text-${modeData.color}-400` 
                                  : 'bg-muted text-muted-foreground'
                                }
                              `}
                            >
                              {feature}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="p-4 bg-muted/50 border-t">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Sparkles className="w-4 h-4" />
                <span>Sistema em constante evolução</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
