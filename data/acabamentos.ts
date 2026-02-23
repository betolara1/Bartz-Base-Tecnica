export interface MaterialData {
  tipo: "MDF" | "MDP";
  espessuras: number[];
}

export interface AcabamentoData {
  id: string;
  nome: string;
  marca: string;
  materiais: MaterialData[];
  aplicacoes: string[];
  observacoes?: string;
}

export const acabamentosData: AcabamentoData[] = [
  {
    id: "cristallo-branco-diamante",
    nome: "Cristallo Branco Diamante",
    marca: "Duratex",
    materiais: [
      {
        tipo: "MDF",
        espessuras: [18, 37]
      }
    ],
    aplicacoes: ["Portas", "Frentes de gavetas", "Painéis", "Tamponamentos"]
  },
  {
    id: "cristallo-preto",
    nome: "Cristallo Preto",
    marca: "Duratex",
    materiais: [
      {
        tipo: "MDF",
        espessuras: [18, 37]
      }
    ],
    aplicacoes: ["Portas", "Frentes de gavetas", "Painéis", "Tamponamentos"]
  },
  {
    id: "cristallo-gianduia",
    nome: "Cristallo Gianduia",
    marca: "Duratex",
    materiais: [
      {
        tipo: "MDF",
        espessuras: [18, 37]
      }
    ],
    aplicacoes: ["Portas", "Frentes de gavetas", "Painéis", "Tamponamentos"]
  },
  {
    id: "cristallo-opalla",
    nome: "Cristallo Opalla",
    marca: "Duratex",
    materiais: [
      {
        tipo: "MDF",
        espessuras: [18, 37]
      }
    ],
    aplicacoes: ["Portas", "Frentes de gavetas", "Painéis", "Tamponamentos"]
  },
  {
    id: "cristallo-cinza-sagrado",
    nome: "Cristallo Cinza Sagrado",
    marca: "Duratex",
    materiais: [
      {
        tipo: "MDF",
        espessuras: [18, 37]
      }
    ],
    aplicacoes: ["Portas", "Frentes de gavetas", "Painéis", "Tamponamentos"]
  },
  {
    id: "nogueira-caiena",
    nome: "Nogueira Caiena",
    marca: "Duratex",
    materiais: [
      {
        tipo: "MDF",
        espessuras: [18, 37]
      }
    ],
    aplicacoes: ["Portas", "Frentes de gavetas", "Painéis", "Tamponamentos"]
  },
  {
    id: "mint",
    nome: "Mint",
    marca: "Duratex",
    materiais: [
      {
        tipo: "MDF",
        espessuras: [18, 37]
      },
      {
        tipo: "MDP",
        espessuras: [15, 25]
      }
    ],
    aplicacoes: ["Portas", "Frentes de gavetas", "Painéis", "Tamponamentos"]
  },
  {
    id: "ebano",
    nome: "Ébano",
    marca: "Arauco",
    materiais: [
      {
        tipo: "MDF",
        espessuras: [18, 25, 37]
      }
    ],
    aplicacoes: ["Portas", "Frentes de gavetas", "Painéis", "Tamponamentos"]
  },
  {
    id: "grafito",
    nome: "Grafito",
    marca: "Arauco",
    materiais: [
      {
        tipo: "MDF",
        espessuras: [6]
      },
      {
        tipo: "MDP",
        espessuras: [15, 18, 25, 37]
      }
    ],
    aplicacoes: ["Caixarias", "Portas", "Frentes de gavetas", "Painéis", "Tamponamentos"]
  },
  {
    id: "louro-freijo",
    nome: "Louro Freijó",
    marca: "Arauco",
    materiais: [
      {
        tipo: "MDF",
        espessuras: [18, 37]
      },
      {
        tipo: "MDP",
        espessuras: [15, 18, 25, 37]
      }
    ],
    aplicacoes: ["Portas", "Frentes de gavetas", "Painéis", "Tamponamentos"]
  },
  {
    id: "carvalho-mel",
    nome: "Carvalho Mel",
    marca: "Arauco",
    materiais: [
      {
        tipo: "MDF",
        espessuras: [6, 15]
      },
      {
        tipo: "MDP",
        espessuras: [15, 18, 25, 37]
      }
    ],
    aplicacoes: ["Caixarias", "Portas", "Frentes de gavetas", "Painéis", "Tamponamentos"]
  },
  {
    id: "branco-tx",
    nome: "Branco TX",
    marca: "Arauco",
    materiais: [
      {
        tipo: "MDF",
        espessuras: [6, 15, 18, 25, 37]
      }
    ],
    aplicacoes: ["Caixarias", "Portas", "Frentes de gavetas", "Painéis", "Tamponamentos"]
  },
  {
    id: "reali",
    nome: "Reali",
    marca: "Arauco",
    materiais: [
      {
        tipo: "MDF",
        espessuras: [18, 37]
      }
    ],
    aplicacoes: ["Portas", "Frentes de gavetas", "Painéis", "Tamponamentos"]
  },
  {
    id: "cinza-puro",
    nome: "Cinza Puro",
    marca: "Arauco",
    materiais: [
      {
        tipo: "MDF",
        espessuras: [6, 18, 37]
      },
      {
        tipo: "MDP",
        espessuras: [15, 18, 25, 37]
      }
    ],
    aplicacoes: ["Portas", "Frentes de gavetas", "Painéis", "Tamponamentos"]
  },
  {
    id: "camelo",
    nome: "Camelo",
    marca: "Arauco",
    materiais: [
      {
        tipo: "MDF",
        espessuras: [18, 37]
      }
    ],
    aplicacoes: ["Portas", "Frentes de gavetas", "Painéis", "Tamponamentos"]
  },
  {
    id: "damasco",
    nome: "Damasco",
    marca: "Arauco",
    materiais: [
      {
        tipo: "MDF",
        espessuras: [18, 37]
      }
    ],
    aplicacoes: ["Portas", "Frentes de gavetas", "Painéis", "Tamponamentos"]
  },
  {
    id: "beige",
    nome: "Beige",
    marca: "Arauco",
    materiais: [
      {
        tipo: "MDF",
        espessuras: [6, 15, 18, 25, 37]
      },
      {
        tipo: "MDP",
        espessuras: [15, 25]
      }
    ],
    aplicacoes: ["Caixarias", "Portas", "Frentes de gavetas", "Painéis", "Tamponamentos"]
  },
  {
    id: "petar",
    nome: "Petar",
    marca: "Arauco",
    materiais: [
      {
        tipo: "MDF",
        espessuras: [18, 25, 37]
      }
    ],
    aplicacoes: ["Portas", "Frentes de gavetas", "Painéis", "Tamponamentos"]
  },
  {
    id: "pau-ferro",
    nome: "Pau-ferro",
    marca: "Arauco",
    materiais: [
      {
        tipo: "MDF",
        espessuras: [18, 25, 37]
      },
      {
        tipo: "MDP",
        espessuras: [18]
      }
    ],
    aplicacoes: ["Portas", "Frentes de gavetas", "Painéis", "Tamponamentos"]
  },
  {
    id: "atlantica",
    nome: "Atlântica",
    marca: "Arauco",
    materiais: [
      {
        tipo: "MDF",
        espessuras: [18, 25, 37]
      },
      {
        tipo: "MDP",
        espessuras: [18]
      }
    ],
    aplicacoes: ["Portas", "Frentes de gavetas", "Painéis", "Tamponamentos"]
  },
  {
    id: "jalapao",
    nome: "Jalapão",
    marca: "Arauco",
    materiais: [
      {
        tipo: "MDF",
        espessuras: [18, 37]
      }
    ],
    aplicacoes: ["Portas", "Frentes de gavetas", "Painéis", "Tamponamentos"]
  },
  {
    id: "quartzo",
    nome: "Quartzo",
    marca: "Arauco",
    materiais: [
      {
        tipo: "MDF",
        espessuras: [18, 25, 37]
      }
    ],
    aplicacoes: ["Portas", "Frentes de gavetas", "Painéis", "Tamponamentos"]
  },
  {
    id: "branco-supremo",
    nome: "Branco Supremo",
    marca: "Arauco",
    materiais: [
      {
        tipo: "MDP",
        espessuras: [18, 37]
      }
    ],
    aplicacoes: ["Portas", "Frentes de gavetas", "Painéis", "Tamponamentos"]
  },
  {
    id: "marmo",
    nome: "Marmo",
    marca: "Guararapes",
    materiais: [
      {
        tipo: "MDF",
        espessuras: [18, 37]
      }
    ],
    aplicacoes: ["Portas", "Frentes de gavetas", "Painéis", "Tamponamentos"]
  },
  {
    id: "petra",
    nome: "Petra",
    marca: "Guararapes",
    materiais: [
      {
        tipo: "MDF",
        espessuras: [18, 37]
      }
    ],
    aplicacoes: ["Portas", "Frentes de gavetas", "Painéis", "Tamponamentos"]
  },
  {
    id: "bronze",
    nome: "Bronze",
    marca: "Guararapes",
    materiais: [
      {
        tipo: "MDF",
        espessuras: [18, 37]
      }
    ],
    aplicacoes: ["Portas", "Frentes de gavetas", "Painéis", "Tamponamentos"]
  },
  {
    id: "milk-shake",
    nome: "Milk shake",
    marca: "Guararapes",
    materiais: [
      {
        tipo: "MDF",
        espessuras: [18, 37]
      }
    ],
    aplicacoes: ["Portas", "Frentes de gavetas", "Painéis", "Tamponamentos"]
  },
  {
    id: "azul-petroleo",
    nome: "Azul Petróleo",
    marca: "Guararapes",
    materiais: [
      {
        tipo: "MDF",
        espessuras: [18, 37]
      }
    ],
    aplicacoes: ["Portas", "Frentes de gavetas", "Painéis", "Tamponamentos"]
  },
  {
    id: "imbuia",
    nome: "Imbuia",
    marca: "Guararapes",
    materiais: [
      {
        tipo: "MDF",
        espessuras: [18, 37]
      }
    ],
    aplicacoes: ["Portas", "Frentes de gavetas", "Painéis", "Tamponamentos"]
  },
  {
    id: "niquel",
    nome: "Níquel",
    marca: "Guararapes",
    materiais: [
      {
        tipo: "MDF",
        espessuras: [18, 37]
      }
    ],
    aplicacoes: ["Portas", "Frentes de gavetas", "Painéis", "Tamponamentos"]
  },
  {
    id: "bianco-ravena",
    nome: "Bianco Ravena",
    marca: "Sudati",
    materiais: [
      {
        tipo: "MDF",
        espessuras: [6, 15, 18, 25, 37]
      }
    ],
    aplicacoes: ["Portas", "Frentes de gavetas", "Painéis", "Tamponamentos"]
  },
  {
    id: "santiago",
    nome: "Santiago",
    marca: "Sudati",
    materiais: [
      {
        tipo: "MDF",
        espessuras: [6, 15, 18, 25, 37]
      }
    ],
    aplicacoes: ["Portas", "Frentes de gavetas", "Painéis", "Tamponamentos"]
  },
  {
    id: "asti",
    nome: "Asti",
    marca: "Sudati",
    materiais: [
      {
        tipo: "MDF",
        espessuras: [18, 37]
      }
    ],
    aplicacoes: ["Portas", "Frentes de gavetas", "Painéis", "Tamponamentos"]
  },
  {
    id: "glamour",
    nome: "Glamour",
    marca: "Sudati",
    materiais: [
      {
        tipo: "MDF",
        espessuras: [18, 37]
      }
    ],
    aplicacoes: ["Portas", "Frentes de gavetas", "Painéis", "Tamponamentos"]
  },
  {
    id: "amazonia",
    nome: "Amazônia",
    marca: "Sudati",
    materiais: [
      {
        tipo: "MDF",
        espessuras: [18, 37]
      }
    ],
    aplicacoes: ["Portas", "Frentes de gavetas", "Painéis", "Tamponamentos"]
  },
  {
    id: "carvalho-natural",
    nome: "Carvalho Natural",
    marca: "Sudati",
    materiais: [
      {
        tipo: "MDF",
        espessuras: [6, 15, 18, 37]
      }
    ],
    aplicacoes: ["Portas", "Frentes de gavetas", "Painéis", "Tamponamentos"]
  },
  {
    id: "corazzi",
    nome: "Corazzi",
    marca: "Sudati",
    materiais: [
      {
        tipo: "MDF",
        espessuras: [18, 25, 37]
      }
    ],
    aplicacoes: ["Portas", "Frentes de gavetas", "Painéis", "Tamponamentos"]
  },
  {
    id: "manhattan",
    nome: "Manhattan",
    marca: "Sudati",
    materiais: [
      {
        tipo: "MDF",
        espessuras: [18, 37]
      }
    ],
    aplicacoes: ["Portas", "Frentes de gavetas", "Painéis", "Tamponamentos"]
  },
  {
    id: "vulcano",
    nome: "Vulcano",
    marca: "Sudati",
    materiais: [
      {
        tipo: "MDF",
        espessuras: [18, 37]
      }
    ],
    aplicacoes: ["Portas", "Frentes de gavetas", "Painéis", "Tamponamentos"]
  },
  {
    id: "cancun",
    nome: "Cancún",
    marca: "Sudati",
    materiais: [
      {
        tipo: "MDF",
        espessuras: [18, 37]
      }
    ],
    aplicacoes: ["Portas", "Frentes de gavetas", "Painéis", "Tamponamentos"]
  },
  {
    id: "urbi",
    nome: "Urbi",
    marca: "Fibraplac",
    materiais: [
      {
        tipo: "MDF",
        espessuras: [6, 15, 18, 25, 37]
      }
    ],
    aplicacoes: ["Portas", "Frentes de gavetas", "Painéis", "Tamponamentos", "Caixarias"]
  },
  {
    id: "linum",
    nome: "Linum",
    marca: "Fibraplac",
    materiais: [
      {
        tipo: "MDF",
        espessuras: [18, 37]
      }
    ],
    aplicacoes: ["Portas", "Frentes de gavetas", "Painéis", "Tamponamentos"]
  },
  {
    id: "cabiuna-nobre",
    nome: "Cabiúna Nobre",
    marca: "Fibraplac",
    materiais: [
      {
        tipo: "MDF",
        espessuras: [15, 18, 25, 37]
      }
    ],
    aplicacoes: ["Portas", "Frentes de gavetas", "Painéis", "Tamponamentos"]
  },
  {
    id: "serrano",
    nome: "Serrano",
    marca: "Fibraplac",
    materiais: [
      {
        tipo: "MDF",
        espessuras: [15, 18, 25, 37]
      }
    ],
    aplicacoes: ["Portas", "Frentes de gavetas", "Painéis", "Tamponamentos"]
  },
  {
    id: "raphia",
    nome: "Raphia",
    marca: "Fibraplac",
    materiais: [
      {
        tipo: "MDF",
        espessuras: [18, 37]
      }
    ],
    aplicacoes: ["Portas", "Frentes de gavetas", "Painéis", "Tamponamentos"]
  },
  {
    id: "carvalho-latino",
    nome: "Carvalho latino",
    marca: "Fibraplac",
    materiais: [
      {
        tipo: "MDF",
        espessuras: [18, 37]
      }
    ],
    aplicacoes: ["Portas", "Frentes de gavetas", "Painéis", "Tamponamentos"]
  },
  {
    id: "panna",
    nome: "Panna",
    marca: "Fibraplac",
    materiais: [
      {
        tipo: "MDF",
        espessuras: [6, 15, 18, 25, 37]
      }
    ],
    aplicacoes: ["Portas", "Frentes de gavetas", "Painéis", "Tamponamentos", "Caixarias"]
  },
  {
    id: "ameixa-negra",
    nome: "Ameixa Negra",
    marca: "Genérica",
    materiais: [{ tipo: "MDF", espessuras: [18] }],
    aplicacoes: ["Portas", "Frentes de gavetas", "Painéis"]
  },
  {
    id: "carvalho-latino",
    nome: "Carvalho Latino",
    marca: "Genérica",
    materiais: [{ tipo: "MDF", espessuras: [18] }],
    aplicacoes: ["Portas", "Frentes de gavetas", "Painéis"]
  },
  {
    id: "ebano-chess",
    nome: "Ébano Chess",
    marca: "Genérica",
    materiais: [{ tipo: "MDF", espessuras: [18] }],
    aplicacoes: ["Portas", "Frentes de gavetas", "Painéis"]
  },
  {
    id: "azul-petr-lio",
    nome: "Azul Petrólio",
    marca: "Diversas",
    materiais: [{ tipo: "MDF", espessuras: [18] }],
    aplicacoes: ["Portas", "Frentes de gavetas", "Painéis"]
  },
  {
    id: "branco",
    nome: "Branco",
    marca: "Diversas",
    materiais: [{ tipo: "MDF", espessuras: [18] }],
    aplicacoes: ["Portas", "Frentes de gavetas", "Painéis"]
  },
  {
    id: "cabiuna-nobre",
    nome: "Cabiuna Nobre",
    marca: "Diversas",
    materiais: [{ tipo: "MDF", espessuras: [18] }],
    aplicacoes: ["Portas", "Frentes de gavetas", "Painéis"]
  },
  {
    id: "cancun",
    nome: "Cancun",
    marca: "Diversas",
    materiais: [{ tipo: "MDF", espessuras: [18] }],
    aplicacoes: ["Portas", "Frentes de gavetas", "Painéis"]
  },
  {
    id: "cristallo-opala",
    nome: "Cristallo Opala",
    marca: "Diversas",
    materiais: [{ tipo: "MDF", espessuras: [18] }],
    aplicacoes: ["Portas", "Frentes de gavetas", "Painéis"]
  },
  {
    id: "milkshake",
    nome: "MilkShake",
    marca: "Diversas",
    materiais: [{ tipo: "MDF", espessuras: [18] }],
    aplicacoes: ["Portas", "Frentes de gavetas", "Painéis"]
  },
  {
    id: "pau-ferro",
    nome: "Pau Ferro",
    marca: "Diversas",
    materiais: [{ tipo: "MDF", espessuras: [18] }],
    aplicacoes: ["Portas", "Frentes de gavetas", "Painéis"]
  }
];

// Função para buscar acabamentos por marca
export function getAcabamentosByMarca(marca: string): AcabamentoData[] {
  return acabamentosData.filter(acabamento =>
    acabamento.marca.toLowerCase() === marca.toLowerCase()
  );
}

// Função para buscar acabamentos por material e espessura
export function getAcabamentosByMaterialEEspessura(
  material: "MDF" | "MDP",
  espessura: number
): AcabamentoData[] {
  return acabamentosData.filter(acabamento =>
    acabamento.materiais.some(mat =>
      mat.tipo === material && mat.espessuras.includes(espessura)
    )
  );
}

// Função para buscar acabamentos por aplicação
export function getAcabamentosByAplicacao(aplicacao: string): AcabamentoData[] {
  return acabamentosData.filter(acabamento =>
    acabamento.aplicacoes.some(app =>
      app.toLowerCase().includes(aplicacao.toLowerCase())
    )
  );
}

// Função para buscar acabamento por nome
export function getAcabamentoByNome(nome: string): AcabamentoData | undefined {
  return acabamentosData.find(acabamento =>
    acabamento.nome.toLowerCase() === nome.toLowerCase()
  );
}

// Função para obter todas as marcas disponíveis
export function getMarcas(): string[] {
  const marcas = [...new Set(acabamentosData.map(acabamento => acabamento.marca))];
  return marcas.sort();
}

// Função para obter todas as aplicações disponíveis
export function getAplicacoes(): string[] {
  const aplicacoes = new Set<string>();
  acabamentosData.forEach(acabamento => {
    acabamento.aplicacoes.forEach(app => aplicacoes.add(app));
  });
  return Array.from(aplicacoes).sort();
}

// Função para buscar acabamentos (busca geral)
export function searchAcabamentos(query: string): AcabamentoData[] {
  const lowerQuery = query.toLowerCase().trim();

  if (!lowerQuery) return acabamentosData;

  return acabamentosData.filter(acabamento =>
    acabamento.nome.toLowerCase().includes(lowerQuery) ||
    acabamento.marca.toLowerCase().includes(lowerQuery) ||
    acabamento.aplicacoes.some(app => app.toLowerCase().includes(lowerQuery)) ||
    acabamento.materiais.some(mat => mat.tipo.toLowerCase().includes(lowerQuery))
  );
}

// Estatísticas dos acabamentos
export interface AcabamentosStats {
  totalAcabamentos: number;
  porMarca: Record<string, number>;
  porMaterial: Record<string, number>;
  porAplicacao: Record<string, number>;
}

export function getAcabamentosStats(): AcabamentosStats {
  const stats: AcabamentosStats = {
    totalAcabamentos: acabamentosData.length,
    porMarca: {},
    porMaterial: {},
    porAplicacao: {}
  };

  acabamentosData.forEach(acabamento => {
    // Stats por marca
    stats.porMarca[acabamento.marca] = (stats.porMarca[acabamento.marca] || 0) + 1;

    // Stats por material
    acabamento.materiais.forEach(material => {
      stats.porMaterial[material.tipo] = (stats.porMaterial[material.tipo] || 0) + 1;
    });

    // Stats por aplicação
    acabamento.aplicacoes.forEach(aplicacao => {
      stats.porAplicacao[aplicacao] = (stats.porAplicacao[aplicacao] || 0) + 1;
    });
  });

  return stats;
}
