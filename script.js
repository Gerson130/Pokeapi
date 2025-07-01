let currentPokemonId = 25; // Pikachu por defecto
let favorites = [];

const typeColors = {
  fire: 'fire-bg',
  water: 'water-bg',
  grass: 'grass-bg',
  electric: 'electric-bg',
  psychic: 'psychic-bg',
  ice: 'ice-bg',
  dragon: 'dragon-bg',
  dark: 'dark-bg',
  fairy: 'fairy-bg',
  normal: 'normal-bg',
  fighting: 'fighting-bg',
  flying: 'flying-bg',
  poison: 'poison-bg',
  ground: 'ground-bg',
  rock: 'rock-bg',
  bug: 'bug-bg',
  ghost: 'ghost-bg',
  steel: 'steel-bg'
};

document.addEventListener('DOMContentLoaded', () => {
  loadPokemon(currentPokemonId);
});

async function loadPokemon(id) {
  try {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
    if (!response.ok) throw new Error('Pokémon no encontrado');
    const data = await response.json();
    currentPokemonId = data.id;
    displayPokemon(data);
    loadAdjacentPokemons();
  } catch (error) {
    document.getElementById('pokemonContainer').innerHTML = `<p>${error.message}</p>`;
  }
}

function displayPokemon(pokemon) {
  const mainContainer = document.getElementById('pokemonContainer');
  const statsContainer = document.querySelector('.stats-content');
  const primaryType = pokemon.types[0].type.name;
  const typeClass = typeColors[primaryType] || 'normal-bg';

  mainContainer.className = `compact-main ${typeClass}`;
  mainContainer.innerHTML = `
    <button onclick="saveFavorite()" class="favorite-btn-corner">⭐</button>
    <h2>${capitalize(pokemon.name)} <span class="id">#${pokemon.id.toString().padStart(3, '0')}</span></h2>
    <img src="${pokemon.sprites.other['official-artwork'].front_default}" class="pokemon-img" alt="${pokemon.name}">
    <div class="types-container">
      ${pokemon.types.map(t => `<span class="type-badge ${typeColors[t.type.name]}">${capitalize(t.type.name)}</span>`).join('')}
    </div>
  `;

  statsContainer.innerHTML = `
    <div class="stat-item"><h4>Habilidades</h4><p>${pokemon.abilities.map(a => capitalize(a.ability.name)).join(', ')}</p></div>
    <div class="stat-item"><h4>Estadísticas Base</h4>
      ${pokemon.stats.map(stat => `<p>${capitalize(stat.stat.name)}: ${stat.base_stat}</p>`).join('')}
    </div>
    <div class="stat-item">
      <h4>Características</h4>
      <p>Altura: ${pokemon.height / 10}m</p>
      <p>Peso: ${pokemon.weight / 10}kg</p>
      <p>Experiencia: ${pokemon.base_experience}</p>
    </div>
  `;
}

async function loadAdjacentPokemons() {
  const prevId = currentPokemonId - 1;
  const nextId = currentPokemonId + 1;

  if (prevId > 0) {
    const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${prevId}`);
    const data = await res.json();
    displayAdjacentPokemon(data, 'prevPokemon');
  }

  const resNext = await fetch(`https://pokeapi.co/api/v2/pokemon/${nextId}`);
  if (resNext.ok) {
    const data = await resNext.json();
    displayAdjacentPokemon(data, 'nextPokemon');
  }
}

function displayAdjacentPokemon(pokemon, containerId) {
  const container = document.getElementById(containerId);
  const primaryType = pokemon.types[0].type.name;
  const typeClass = typeColors[primaryType] || 'normal-bg';

  container.className = `compact-adjacent ${typeClass}`;
  container.innerHTML = `<img src="${pokemon.sprites.front_default}" alt="${pokemon.name}"><h3>#${pokemon.id}</h3>`;
  container.onclick = () => loadPokemon(pokemon.id);
}

function changePokemon(offset) {
  const newId = currentPokemonId + offset;
  if (newId < 1) return;
  loadPokemon(newId);
}

function saveFavorite() {
  fetch(`https://pokeapi.co/api/v2/pokemon/${currentPokemonId}`)
    .then(res => res.json())
    .then(pokemon => {
      if (!favorites.some(f => f.id === pokemon.id)) {
        favorites.push({
          id: pokemon.id,
          name: pokemon.name,
          sprite: pokemon.sprites.front_default,
          type: pokemon.types[0].type.name
        });
        updateFavorites();
      } else {
        alert("¡Ya está en favoritos!");
      }
    });
}

function updateFavorites() {
  const container = document.getElementById('agregados');
  if (favorites.length === 0) {
    container.innerHTML = '<p>No hay favoritos aún</p>';
    return;
  }

  container.innerHTML = favorites.map(p =>
    `<div class="favorite-item ${typeColors[p.type]}">
      <img src="${p.sprite}" alt="${p.name}">
      <h3>${capitalize(p.name)}</h3>
      <button onclick="removeFavorite(${p.id})" class="remove-btn">×</button>
    </div>`
  ).join('');
}

function removeFavorite(id) {
  favorites = favorites.filter(p => p.id !== id);
  updateFavorites();
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// ================= FILTROS =================

let filtroSeleccionado = 'nombre'; 

function cambiarFiltro() {
  const tipo = document.getElementById('filterType').value;
  const inputContainer = document.getElementById('inputContainer');
  filtroSeleccionado = tipo;

  switch (tipo) {
    case 'nombre':
      inputContainer.innerHTML = `
        <input type="text" id="pokemonInput" placeholder="Ej: pikachu o 25" class="search-input">
        <button onclick="buscarPokemon()" class="search-btn">Buscar</button>
      `;
      break;
    case 'tipo':
      inputContainer.innerHTML = `
        <select id="tipoInput">
          <option value="fire">Fuego</option>
          <option value="water">Agua</option>
          <option value="grass">Planta</option>
          <option value="electric">Eléctrico</option>
          <option value="psychic">Psíquico</option>
        </select>
        <button onclick="buscarPokemon()" class="search-btn">Buscar</button>
      `;
      break;
    case 'habitat':
      inputContainer.innerHTML = `
        <select id="habitatInput">
          <option value="cave">Cueva</option>
          <option value="forest">Bosque</option>
          <option value="sea">Mar</option>
        </select>
        <button onclick="buscarPokemon()" class="search-btn">Buscar</button>
      `;
      break;
    case 'habilidad':
      inputContainer.innerHTML = `
        <select id="habilidadInput">
          <option value="blaze">Blaze</option>
          <option value="torrent">Torrent</option>
          <option value="levitate">Levitate</option>
        </select>
        <button onclick="buscarPokemon()" class="search-btn">Buscar</button>
      `;
      break;
    case 'generacion':
      inputContainer.innerHTML = `
        <select id="generacionInput">
          <option value="generation-i">Generación I</option>
          <option value="generation-ii">Generación II</option>
        </select>
        <button onclick="buscarPokemon()" class="search-btn">Buscar</button>
      `;
      break;
    default:
      inputContainer.innerHTML = '';
  }
}

function buscarPokemon() {
  const container = document.getElementById('pokemonContainer');
  container.innerHTML = 'Buscando...';

  switch (filtroSeleccionado) {
    case 'nombre':
      buscarPorNombre();
      break;
    case 'tipo':
      buscarPorTipo(document.getElementById('tipoInput').value);
      break;
    case 'habitat':
      buscarPorHabitat(document.getElementById('habitatInput').value);
      break;
    case 'habilidad':
      buscarPorHabilidad(document.getElementById('habilidadInput').value);
      break;
    case 'generacion':
      buscarPorGeneracion(document.getElementById('generacionInput').value);
      break;
    default:
      container.innerHTML = 'Selecciona una opción válida.';
  }
}

async function buscarPorNombre() {
  const input = document.getElementById('pokemonInput').value.toLowerCase();
  try {
    const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${input}`);
    if (!res.ok) throw new Error();
    const data = await res.json();
    loadPokemon(data.id);
  } catch {
    document.getElementById('pokemonContainer').innerHTML = '<p>Pokémon no encontrado</p>';
  }
}

async function buscarPorTipo(tipo) {
  const container = document.getElementById('pokemonContainer');
  if (!tipo) return;
  const res = await fetch(`https://pokeapi.co/api/v2/type/${tipo}`);
  const data = await res.json();
  container.innerHTML = data.pokemon.slice(0, 10).map(p => `<p>${p.pokemon.name}</p>`).join('');
}

async function buscarPorHabitat(habitat) {
  const container = document.getElementById('pokemonContainer');
  if (!habitat) return;
  const res = await fetch(`https://pokeapi.co/api/v2/pokemon-habitat/${habitat}`);
  const data = await res.json();
  container.innerHTML = data.pokemon_species.slice(0, 10).map(p => `<p>${p.name}</p>`).join('');
}

async function buscarPorHabilidad(habilidad) {
  const container = document.getElementById('pokemonContainer');
  if (!habilidad) return;
  const res = await fetch(`https://pokeapi.co/api/v2/ability/${habilidad}`);
  const data = await res.json();
  container.innerHTML = data.pokemon.slice(0, 10).map(p => `<p>${p.pokemon.name}</p>`).join('');
}

async function buscarPorGeneracion(gen) {
  const container = document.getElementById('pokemonContainer');
  if (!gen) return;
  const res = await fetch(`https://pokeapi.co/api/v2/generation/${gen}`);
  const data = await res.json();
  container.innerHTML = data.pokemon_species.slice(0, 10).map(p => `<p>${p.name}</p>`).join('');
}
