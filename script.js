// script.js
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
    console.error('Error:', error);
    document.getElementById('pokemonContainer').innerHTML = `
      <div class="error">
        <p>${error.message}</p>
      </div>
    `;
  }
}

function displayPokemon(pokemon) {
  const mainContainer = document.getElementById('pokemonContainer');
  const statsContainer = document.querySelector('.stats-content');
  const primaryType = pokemon.types[0].type.name;
  const typeClass = typeColors[primaryType] || 'normal-bg';
  
  // Tarjeta principal
  mainContainer.className = `compact-main ${typeClass}`;
  mainContainer.innerHTML = `
    <button onclick="saveFavorite()" class="favorite-btn-corner">⭐</button>
    <h2>${capitalize(pokemon.name)} <span class="id">#${pokemon.id.toString().padStart(3, '0')}</span></h2>
    <img src="${pokemon.sprites.other['official-artwork'].front_default || pokemon.sprites.front_default}" 
         alt="${pokemon.name}" 
         class="pokemon-img">
    <div class="types-container">
      ${pokemon.types.map(type => `
        <span class="type-badge ${typeColors[type.type.name]}">
          ${capitalize(type.type.name)}
        </span>
      `).join('')}
    </div>
  `;

  // Panel de stats
  statsContainer.innerHTML = `
    <div class="stat-item">
      <h4>Habilidades</h4>
      <p>${pokemon.abilities.map(a => capitalize(a.ability.name.replace('-', ' '))).join(', ')}</p>
    </div>
    <div class="stat-item">
      <h4>Estadísticas Base</h4>
      ${pokemon.stats.map(stat => `
        <p><span class="stat-name">${capitalize(stat.stat.name)}:</span> <span class="stat-value">${stat.base_stat}</span></p>
      `).join('')}
    </div>
    <div class="stat-item">
      <h4>Características</h4>
      <p>Altura: ${pokemon.height/10}m</p>
      <p>Peso: ${pokemon.weight/10}kg</p>
      <p>Experiencia Base: ${pokemon.base_experience}</p>
    </div>
  `;
}

async function loadAdjacentPokemons() {
  try {
    // Pokémon anterior
    if (currentPokemonId > 1) {
      const prevId = currentPokemonId - 1;
      const prevResponse = await fetch(`https://pokeapi.co/api/v2/pokemon/${prevId}`);
      if (prevResponse.ok) {
        const prevData = await prevResponse.json();
        displayAdjacentPokemon(prevData, 'prevPokemon');
      }
    } else {
      document.getElementById('prevPokemon').innerHTML = '<p>◄</p>';
    }
    
    // Pokémon siguiente
    const nextId = currentPokemonId + 1;
    const nextResponse = await fetch(`https://pokeapi.co/api/v2/pokemon/${nextId}`);
    if (nextResponse.ok) {
      const nextData = await nextResponse.json();
      displayAdjacentPokemon(nextData, 'nextPokemon');
    } else {
      document.getElementById('nextPokemon').innerHTML = '<p>►</p>';
    }
  } catch (error) {
    console.error('Error cargando Pokémon adyacentes:', error);
  }
}

function displayAdjacentPokemon(pokemon, containerId) {
  const container = document.getElementById(containerId);
  const primaryType = pokemon.types[0].type.name;
  const typeClass = typeColors[primaryType] || 'normal-bg';
  
  container.className = `compact-adjacent ${typeClass}`;
  container.innerHTML = `
    <img src="${pokemon.sprites.front_default}" alt="${pokemon.name}">
    <h3>#${pokemon.id.toString().padStart(3, '0')}</h3>
  `;
  
  container.onclick = () => {
    currentPokemonId = pokemon.id;
    loadPokemon(currentPokemonId);
  };
}

function changePokemon(offset) {
  const newId = currentPokemonId + offset;
  
  if (newId < 1) {
    alert('¡Este es el primer Pokémon!');
    return;
  }
  
  loadPokemon(newId);
}

async function buscarPokemon() {
  const input = document.getElementById('pokemonInput').value.trim().toLowerCase();
  
  if (!input) {
    alert('Por favor ingresa un nombre o número');
    return;
  }
  
  loadPokemon(input);
}

async function saveFavorite() {
  try {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${currentPokemonId}`);
    const pokemon = await response.json();
    
    if (!favorites.some(fav => fav.id === pokemon.id)) {
      favorites.push({
        id: pokemon.id,
        name: pokemon.name,
        sprite: pokemon.sprites.front_default,
        type: pokemon.types[0].type.name
      });
      updateFavorites();
    } else {
      alert('¡Este Pokémon ya está en favoritos!');
    }
  } catch (error) {
    console.error('Error guardando favorito:', error);
  }
}

function updateFavorites() {
  const favoritesContainer = document.getElementById('agregados');
  
  if (favorites.length === 0) {
    favoritesContainer.innerHTML = '<p class="no-favorites">No hay favoritos aún</p>';
    return;
  }
  
  favoritesContainer.innerHTML = favorites.map(pokemon => `
    <div class="favorite-item ${typeColors[pokemon.type]}">
      <img src="${pokemon.sprite}" alt="${pokemon.name}">
      <h3>${capitalize(pokemon.name)}</h3>
      <button onclick="removeFavorite(${pokemon.id})" class="remove-btn">×</button>
    </div>
  `).join('');
}

function removeFavorite(id) {
  favorites = favorites.filter(pokemon => pokemon.id !== id);
  updateFavorites();
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// Asignar eventos
document.querySelector('.nav-prev').addEventListener('click', () => changePokemon(-1));
document.querySelector('.nav-next').addEventListener('click', () => changePokemon(1));