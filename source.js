const { useState, useEffect, useCallback, useRef } = React;

const API   = 'https://pokeapi.co/api/v2';
const LIMIT = 9999;

const TYPES = [
  'normal','fire','water','grass','electric','ice',
  'fighting','poison','ground','flying','psychic','bug',
  'rock','ghost','dragon','dark','steel','fairy',
];

const STAT_COLORS = ['#e63946','#f4a261','#57cc99','#4cc9f0','#7209b7','#4361ee'];

const typeColor = (type) => `var(--type-${type}, #888)`;
const formatId  = (id)   => `#${String(id).padStart(3, '0')}`;

function StatBar({ stat, index }) {
  const [width, setWidth] = useState('0%');
  const pct = Math.min(100, Math.round((stat.base_stat / 255) * 100));

  useEffect(() => {
    const t = setTimeout(() => setWidth(`${pct}%`), 50);
    return () => clearTimeout(t);
  }, [pct]);

  return (
    <div className="stat-row">
      <div className="stat-name">
        {stat.stat.name.replace('special-', 'sp.')}
      </div>
      <div className="stat-val">{stat.base_stat}</div>
      <div className="stat-bar-bg">
        <div
          className="stat-bar"
          style={{
            width,
            background: STAT_COLORS[index % STAT_COLORS.length],
          }}
        />
      </div>
    </div>
  );
}

function Modal({ pokemon, onClose }) {
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [onClose]);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  if (!pokemon) return null;

  return (
    <div
      id="modal-overlay"
      className="open"
      onClick={(e) => { if (e.target.id === 'modal-overlay') onClose(); }}
    >
      <div id="modal">
        <div className="modal-header">
          <div>
            <div className="modal-num">{formatId(pokemon.id)}</div>
            <div className="modal-name">{pokemon.name}</div>
          </div>
          <button id="modal-close" onClick={onClose}>✕</button>
        </div>

        <div className="modal-body">
          <img
            id="m-art"
            className="modal-art"
            src={pokemon.img}
            alt={pokemon.name}
          />

          <div className="modal-types">
            {pokemon.types.map((t) => (
              <span
                key={t}
                className="type-badge"
                style={{ background: typeColor(t), fontSize: '0.8rem', padding: '0.3rem 1rem' }}
              >
                {t}
              </span>
            ))}
          </div>

          <div className="info-grid">
            <div className="info-item">
              <div className="info-label">Altura</div>
              <div className="info-value">{(pokemon.height / 10).toFixed(1)} m</div>
            </div>
            <div className="info-item">
              <div className="info-label">Peso</div>
              <div className="info-value">{(pokemon.weight / 10).toFixed(1)} kg</div>
            </div>
            <div className="info-item">
              <div className="info-label">Exp Base</div>
              <div className="info-value">{pokemon.base_experience ?? '—'}</div>
            </div>
            <div className="info-item">
              <div className="info-label">Tipo</div>
              <div className="info-value">{pokemon.types.join(' / ')}</div>
            </div>
          </div>

          <div className="modal-section-title">Base Stats</div>
          <div className="stats">
            {pokemon.stats.map((s, i) => (
              <StatBar key={s.stat.name} stat={s} index={i} />
            ))}
          </div>

          <div className="modal-section-title">Habilidades</div>
          <div className="moves">
            {pokemon.abilities.map((a) => (
              <span key={a} className="move-tag">
                {a.replace(/-/g, ' ')}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function PokemonCard({ pokemon, index, onClick }) {
  const accent = `var(--type-${pokemon.types[0]})`;

  return (
    <div
      className="card"
      onClick={() => onClick(pokemon)}
      style={{
        animationDelay: `${Math.min(index * 0.035, 0.8)}s`,
        '--card-accent': accent,
        '--card-glow':   accent,
      }}
    >
      <div className="card-num">{formatId(pokemon.id)}</div>

      <div className="card-img-wrap">
        <img src={pokemon.img} alt={pokemon.name} loading="lazy" />
      </div>

      <div className="card-name">{pokemon.name}</div>

      <div className="types">
        {pokemon.types.map((t) => (
          <span
            key={t}
            className="type-badge"
            style={{ background: `var(--type-${t})` }}
          >
            {t}
          </span>
        ))}
      </div>
    </div>
  );
}

function PokemonGrid({ pokemon, loading, onCardClick }) {
  if (loading && pokemon.length === 0) {
    return (
      <div id="grid">
        <div id="loader">
          <div className="pokeball-spin" />
          <span>Carregando Pokémon...</span>
        </div>
      </div>
    );
  }

  if (!loading && pokemon.length === 0) {
    return (
      <div id="grid">
        <div id="loader">
          <span>Nenhum Pokémon encontrado 😢</span>
        </div>
      </div>
    );
  }

  return (
    <div id="grid">
      {pokemon.map((p, i) => (
        <PokemonCard
          key={p.id}
          pokemon={p}
          index={i}
          onClick={onCardClick}
        />
      ))}
    </div>
  );
}

function TypeFilters({ activeType, onTypeClick }) {
  return (
    <div className="filters">
      {TYPES.map((type) => {
        const isActive = type === activeType;
        return (
          <button
            key={type}
            className={`type-btn${isActive ? ' active' : ''}`}
            onClick={() => onTypeClick(type)}
            style={isActive ? {
              borderColor:     `var(--type-${type})`,
              backgroundColor: `var(--type-${type})`,
              color:           '#fff',
            } : {}}
          >
            {type}
          </button>
        );
      })}
    </div>
  );
}

function Header({ search, onSearchChange }) {
  return (
    <header>
      <div className="header-inner">
        <div className="logo">
          Poké<span>dex</span>
        </div>
        <div className="search-wrap">
          <span className="search-icon">🔍</span>
          <input
            id="search"
            type="text"
            placeholder="Buscar Pokémon..."
            autoComplete="off"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
      </div>
    </header>
  );
}

function App() {
  const [allPokemon, setAllPokemon] = useState([]);
  const [search,     setSearch]     = useState('');
  const [activeType, setActiveType] = useState(null);
  const [loading,    setLoading]    = useState(false);
  const [offset,     setOffset]     = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [selected,   setSelected]   = useState(null);

  const filtered = allPokemon.filter((p) => {
    const matchName = !search
      || p.name.includes(search.toLowerCase())
      || String(p.id).includes(search);
    const matchType = !activeType || p.types.includes(activeType);
    return matchName && matchType;
  });

  const fetchMore = useCallback(async () => {
    if (loading) return;
    setLoading(true);

    try {
      const res  = await fetch(`${API}/pokemon?limit=${LIMIT}&offset=${offset}`);
      const data = await res.json();
      setTotalCount(data.count);

      const details = await Promise.all(
        data.results.map((p) => fetch(p.url).then((r) => r.json()))
      );

      const parsed = details.map((d) => ({
        id:              d.id,
        name:            d.name,
        types:           d.types.map((t) => t.type.name),
        img:             d.sprites.other['official-artwork'].front_default || d.sprites.front_default,
        height:          d.height,
        weight:          d.weight,
        stats:           d.stats,
        abilities:       d.abilities.map((a) => a.ability.name),
        base_experience: d.base_experience,
      }));

      setAllPokemon((prev) => [...prev, ...parsed]);
      setOffset((prev) => prev + LIMIT);
    } catch (err) {
      console.error('Erro ao buscar Pokémon:', err);
    } finally {
      setLoading(false);
    }
  }, [loading, offset]);

  useEffect(() => {
    fetchMore();
  }, []);

  const handleTypeClick = (type) => {
    setActiveType((prev) => (prev === type ? null : type));
  };

  const hasMore = offset < totalCount;

  return (
    <>
      <Header search={search} onSearchChange={setSearch} />

      <TypeFilters activeType={activeType} onTypeClick={handleTypeClick} />

      <div className="container">
        <div id="count">
          {filtered.length} Pokémon encontrado{filtered.length !== 1 ? 's' : ''}
        </div>

        <PokemonGrid
          pokemon={filtered}
          loading={loading}
          onCardClick={setSelected}
        />

        {hasMore && (
          <button
            id="load-more"
            onClick={fetchMore}
            disabled={loading}
          >
            {loading ? 'Carregando...' : 'Carregar mais'}
          </button>
        )}
      </div>

      {selected && (
        <Modal pokemon={selected} onClose={() => setSelected(null)} />
      )}
    </>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);