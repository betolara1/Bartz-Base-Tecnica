# Ateliê Bartz - Base de Especificações Técnicas

<div align="center">
  <img src="assets/dashboard.png" alt="Dashboard Principal" width="100%" />
</div>

<br />

Bem-vindo ao repositório oficial da **Base de Especificações Técnicas do Ateliê Bartz**. Este é um sistema institucional moderno desenvolvido para fornecer um catálogo técnico completo, detalhado e interativo das peças e modulações de engenharia.

---

> ⚠️ **Nota Histórica do Projeto:**
> 
> *Este projeto foi inicialmente idealizado e iniciado por outra pessoa. No entanto, eu (atual mantenedor) assumi a continuidade do desenvolvimento e a responsabilidade de finalizá-lo por completo, utilizando o auxílio de Inteligência Artificial para refinar a arquitetura, otimizar o código e entregar um produto de excelência.*

---

## 📱 Totalmente Otimizado para Mobile

Uma das grandes prioridades deste sistema é oferecer uma experiência impecável em qualquer dispositivo. O layout é responsivo de ponta a ponta:
- Interfaces se adaptam organicamente a telas de celulares e tablets.
- **Modals de vídeo responsivos:** O sistema detecta dispositivos móveis e força a exibição dos tutoriais em vídeo no modo **Landscape (Paisagem)** para uma experiência de aprendizado muito mais imersiva, rotacionando o conteúdo automaticamente em 90 graus e expandindo para preencher toda a tela.
- Navegação fluida e acessível projetada para uso "em campo" na fábrica ou em montagens.

<div align="center">
  <img src="assets/dashboard2.png" alt="Dashboard Visão Alternativa" width="48%" />
  <img src="assets/produto.png" alt="Detalhes do Produto" width="48%" />
</div>

## ✨ Funcionalidades Principais

* **Catálogo Amplo:** Pesquisa inteligente instantânea por código de engenharia, categorias e tags.
* **Gabarito de Medidas:** Visualização clara das limitações de largura, altura e profundidade (fixas ou com range variável).
* **Modelos e Acabamentos:** Integração rigorosa com a base de materiais e espessuras padrões de engenharia.
* **Capacitação Integrada (Aulas e Tutoriais):** Sistema de visualização de vídeos dinâmicos focados no treinamento de montagem e compreensão dos módulos.
* **Sistema de Favoritos (Salvos):** Permite salvar peças consultadas frequentemente com fácil acesso.
* **Modo Dark / Light:** Suporte nativo a temas visuais para melhor ergonomia visual em diferentes ambientes.

## 📸 Galeria do Sistema

Aqui estão algumas das visões detalhadas do fluxo da aplicação:

### Visualização de Modelos & Acabamentos
Apresentação técnica dos esquemas e opções de aplicação.
<div align="center">
  <img src="assets/modelos.png" alt="Modelos e Acabamentos" width="80%" />
</div>

### Central de Tutoriais (Aulas)
Integração de mídias (Vídeos MP4 e demonstrações em GIF) para capacitar a montagem das modulações.
<div align="center">
  <img src="assets/aulas.png" alt="Aulas e Tutoriais" width="80%" />
</div>

## 🛠️ Tecnologias Utilizadas

O sistema foi construído utilizando as seguintes tecnologias para garantir alta performance e um design de altíssimo nível (Premium Glassmorphism & UI Design):

- **[React 18](https://react.dev/)** - Biblioteca principal para construção da UI.
- **[Vite](https://vitejs.dev/)** - Ferramenta de build de extrema rapidez.
- **[Tailwind CSS](https://tailwindcss.com/)** - Framework de CSS utilitário (junto com classes customizadas para gradientes premium e glassmorphism).
- **[Radix UI](https://www.radix-ui.com/)** - Componentes primitivos não estilizados para acessibilidade.
- **[TypeScript](https://www.typescriptlang.org/)** - Adicionando tipagem estática e segurança na estruturação dos dados (Catálogo, Modelos, Aulas).
- **[Lucide Icons](https://lucide.dev/)** - Ícones vetoriais modernos.

## 🚀 Como Executar o Projeto Localmente

1. Certifique-se de ter o `Node.js` instalado na sua máquina.
2. Clone este repositório.
3. Instale as dependências:
   ```bash
   npm install
   ```
4. Inicie o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```
5. O servidor será iniciado localmente (geralmente em `http://localhost:3000`). Graças às configurações de host, **o site pode ser testado por qualquer outro dispositivo conectado à mesma rede Wi-Fi** (ex: celular) utilizando o seu endereço IP provido no terminal pela inicialização do Vite.

---
<p align="center">Construído com excelência técnica para a equipe Bartz.</p>
