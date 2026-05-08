<div align="center">

# Pokédex 🔴

**Uma Pokédex interativa construída com React e PokéAPI**

[![Live Demo](https://img.shields.io/badge/🌐_Live_Demo-pedrohageboni.github.io/pokedex-e63946?style=for-the-badge)](https://pedrohageboni.github.io/pokedex/)
[![React](https://img.shields.io/badge/React-18-61dafb?style=for-the-badge&logo=react&logoColor=black)](https://react.dev)
[![PokéAPI](https://img.shields.io/badge/PokéAPI-v2-ef5350?style=for-the-badge)](https://pokeapi.co)

![preview](https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png)

</div>

---

## ✨ Funcionalidades

- 🔍 **Busca em tempo real** por nome ou número
- 🏷️ **Filtro por tipo** — 18 tipos com cores únicas
- ♾️ **Paginação** — carrega 40 Pokémon por vez
- 📋 **Modal de detalhes** com stats animados, habilidades, altura e peso
- 📱 **Layout responsivo** para mobile e desktop
- ⚡ **Requests paralelos** para carregamento rápido

## 🛠️ Tecnologias

| Tecnologia | Uso |
|---|---|
| **React 18** | Componentes, hooks e gerenciamento de estado |
| **PokéAPI v2** | Dados dos Pokémon |
| **CSS3** | Animações, variáveis e layout com Grid |
| **Babel (CDN)** | Transpile de JSX sem build tool |

## 📁 Estrutura

```
pokedex/
├── index.html   # Entry point — carrega React via CDN
├── style.css    # Estilos globais e design tokens
└── app.jsx      # Todos os componentes React
```

### Componentes

```
<App>                  ← estado global (pokémon, busca, filtro, modal)
 ├── <Header>          ← logo + campo de busca
 ├── <TypeFilters>     ← 18 botões de filtro por tipo
 ├── <PokemonGrid>     ← grid responsivo + estados de loading/vazio
 │    └── <PokemonCard>   ← card individual
 └── <Modal>           ← detalhes completos do Pokémon
      └── <StatBar>    ← barra de stat com animação CSS
```

## 🚀 Como rodar localmente

Por não ter build tool, basta servir os arquivos com qualquer servidor HTTP:

```bash
# Clone o repositório
git clone https://github.com/pedrohageboni/pokedex.git
cd pokedex

# Opção 1 — Python
python -m http.server 3000

# Opção 2 — Node
npx serve .

# Opção 3 — VS Code
# Instale a extensão "Live Server" e clique em "Go Live"
```

> ⚠️ Abrir o `index.html` diretamente pelo navegador (`file://`) não funciona por restrições de CORS do Babel. Use um servidor local.

## 📡 Como funciona a integração com a PokéAPI

```
1. GET /pokemon?limit=40&offset=0     → lista com nome e URL de cada Pokémon
2. GET /pokemon/{id}  (x40 paralelo)  → detalhes: tipos, stats, sprites, habilidades
```

Todos os requests de detalhe são feitos em paralelo com `Promise.all`, minimizando o tempo de carregamento.

---

<div align="center">

Feito com ❤️ por [Pedro Hageboni](https://github.com/pedrohageboni)

</div>