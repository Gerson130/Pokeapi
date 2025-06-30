let currentPokemonId = 1; // valor por defecto

async function buscarPokemon() {
  const input = document.getElementById('pokemonInput').value.toLowerCase();
  const container = document.getElementById('pokemonContainer');
  container.innerHTML = 'Buscando...';

  try {
    const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${input}`);
    if (!res.ok) throw new Error("No encontrado");
    const data = await res.json();

    currentPokemonId = data.id; // guardar ID actual

    mostrarPokemon(data);
  } catch (error) {
    container.innerHTML = `<p>Pokémon no encontrado. Intenta con otro nombre o número.</p>`;
  }
}

function mostrarPokemon(data) {
  const container = document.getElementById('pokemonContainer');
  container.innerHTML = `
    <h2>${data.name.toUpperCase()}</h2>
    <img src="${data.sprites.front_default}" alt="${data.name}">
    <p><strong>Tipo:</strong> ${data.types.map(t => t.type.name).join(', ')}</p>
    <p><strong>Altura:</strong> ${data.height / 10} m</p>
    <p><strong>Peso:</strong> ${data.weight / 10} kg</p>
    <p>Id:<p class="id">${data.id}</p></p>
  `;
}

async function cambiarPokemon(delta) {
  const newId = currentPokemonId + delta;
  if (newId < 1 || newId > 1025) return; // evita errores, 1025 es límite actual aprox

  try {
    const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${newId}`);
    if (!res.ok) throw new Error("Error");
    const data = await res.json();
    currentPokemonId = data.id;
    mostrarPokemon(data);
  } catch (error) {
    console.error("Error al cargar Pokémon:", error);
  }
}

async function guardarPokemon() {
  const agregados = document.querySelector('#agregados');
  let id = document.querySelector('.id').textContent;
  try {
    const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
    const data = await res.json();
    agregados.innerHTML = `
      <img src="${data.sprites.front_default}" alt="${data.name}">
      <h1><strong>${data.name}</strong></h1>
    `;
  } catch (error) {
    console.log("Error al guardar pokemon");
  }
  
} 
//prueba