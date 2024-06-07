const debounce = (func, delay) => {
    let timeoutId;
    return function(...args) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func.apply(this, args), delay);
    };
};

const cache = {};

const fetchData = (endpoint, query) => {
    const url = `https://pokeapi.co/api/v2/${endpoint}/${query}`;
    if (cache[url]) {
        return Promise.resolve(cache[url]);
    }
    return fetch(url).then(response => {
        if (!response.ok) {
            throw new Error('El Pokémon no existe');
        }
        return response.json().then(data => {
            cache[url] = data;
            return data;
        });
    });
};

const displayPokemonData = data => {
    const pokemonContainer = document.getElementById('pokemon2');
    pokemonContainer.innerHTML = `
        <h2 class="text-capitalize">${data.name}</h2>
        <img src="${data.sprites.front_default}" alt="${data.name}" class="img-fluid">
        <p>Height: ${data.height}</p>
        <p>Weight: ${data.weight}</p>
    `;
};

const displayAbilityData = data => {
    const effectEntries = data.effect_entries.find(entry => entry.language.name === 'es') || data.effect_entries.find(entry => entry.language.name === 'en');
    const pokemonContainer = document.getElementById('pokemon2');
    pokemonContainer.innerHTML = `
        <h2 class="text-capitalize">${data.name}</h2>
        <p>ID: ${data.id}</p>
        <p>Generation: ${data.generation.name}</p>
        <p>Effect: ${effectEntries ? effectEntries.effect : 'No disponible en español o inglés'}</p>
    `;
};

const displayTypeData = data => {
    const damageFromEs = data.damage_relations.double_damage_from.map(d => d.name).join(', ') || data.damage_relations.double_damage_from.map(d => d.name).join(', ');
    const damageToEs = data.damage_relations.double_damage_to.map(d => d.name).join(', ') || data.damage_relations.double_damage_to.map(d => d.name).join(', ');
    const pokemonContainer = document.getElementById('pokemon2');
    pokemonContainer.innerHTML = `
        <h2 class="text-capitalize">${data.name}</h2>
        <p>ID: ${data.id}</p>
        <p>Weak against: ${damageFromEs}</p>
        <p>Effective damage to: ${damageToEs}</p>
    `;
};

const displayNatureData = data => {
    const pokemonContainer = document.getElementById('pokemon2');
    pokemonContainer.innerHTML = `
        <h2 class="text-capitalize">${data.name}</h2>
        <p>ID: ${data.id}</p>
        <p>Growth: ${data.decreased_stat.name}</p>
        <p>Increase: ${data.increased_stat.name}</p>
        <p>Best Skill: ${data.likes_flavor.name}</p>
        <p>Less Skill: ${data.hates_flavor.name}</p>
    `;
};

const displayPokeathlonStatData = data => {
    const pokemonContainer = document.getElementById('pokemon2');
    pokemonContainer.innerHTML = `
        <h2 class="text-capitalize">${data.name}</h2>
        <p>ID: ${data.id}</p>
        <p>High: ${data.height}</p>
        <p>Low: ${data.weight}</p>
        <p>Speed: ${data.speed}</p>
        <p>Stamina: ${data.stamina}</p>
        <p>Power: ${data.power}</p>
        <p>Skill: ${data.skill}</p>
        <p>Agility: ${data.agility}</p>
        <p>Jump: ${data.jump}</p>
    `;
};

document.getElementById('search-button').addEventListener('click', debounce(() => {
    const search = document.getElementById('search').value.trim().toLowerCase();
    const endpoint = document.getElementById('endpoint-select').value;
    const pokemonContainer = document.getElementById('pokemon2');
    const spinner = document.getElementById('spinner');
    const errorMessage = document.getElementById('error-message');

    if (!search) return;

    pokemonContainer.innerHTML = '';
    spinner.style.display = 'block';
    errorMessage.textContent = '';

    fetchData(endpoint, search)
        .then(data => {
            if (endpoint === 'pokemon') {
                displayPokemonData(data);
            } else if (endpoint === 'ability') {
                displayAbilityData(data);
            } else if (endpoint === 'type') {
                displayTypeData(data);
            } else if (endpoint === 'nature') {
                displayNatureData(data);
            } else if (endpoint === 'pokeathlon-stat') {
                displayPokeathlonStatData(data);
            }
            spinner.style.display = 'none';
        })
        .catch(error => {
            console.error(error);
            errorMessage.textContent = 'Ha ocurrido un error. Por favor, inténtalo de nuevo.';
            spinner.style.display = 'none';
        });
}, 300));
document.getElementById('endpoint-select').addEventListener('change', () => {
    const endpoint = document.getElementById('endpoint-select').value;
    const searchInput = document.getElementById('search');
    let placeholder = 'Buscar Pokémon';
    if (endpoint === 'ability') {
        placeholder = 'Buscar por Habilidad';
    } else if (endpoint === 'type') {
        placeholder = 'Buscar por Tipo';
    } else if (endpoint === 'nature') {
        placeholder = 'Buscar por Naturaleza';
    } else if (endpoint === 'pokeathlon-stat') {
        placeholder = 'Buscar por Estadísticas de Pokéathlon';
    }
    searchInput.placeholder = placeholder;
    searchInput.value = '';
});

document.getElementById('random-button').addEventListener('click', () => {
    const randomId = Math.floor(Math.random() * 898) + 1;
    document.getElementById('search').value = randomId;
    document.getElementById('search-button').click();
});

document.getElementById('clear-button').addEventListener('click', () => {
    document.getElementById('pokemon2').innerHTML = '';
    document.getElementById('search').value = '';
});

document.getElementById('search-id-button').addEventListener('click', () => {
    const id = document.getElementById('search').value;
    document.getElementById('endpoint-select').value = 'pokemon';
    document.getElementById('search').value = id;
    document.getElementById('search-button').click();
});

document.getElementById('search-name-button').addEventListener('click', () => {
    const name = document.getElementById('search').value;
    document.getElementById('endpoint-select').value = 'pokemon';
    document.getElementById('search').value = name;
    document.getElementById('search-button').click();
});

document.getElementById('search-type-button').addEventListener('click', () => {
    const type = document.getElementById('search').value;
    document.getElementById('endpoint-select').value = 'type';
    document.getElementById('search').value = type;
    document.getElementById('search-button').click();
});

document.getElementById('search-ability-button').addEventListener('click', () => {
    const ability = document.getElementById('search').value;
    document.getElementById('endpoint-select').value = 'ability';
    document.getElementById('search').value = ability;
    document.getElementById('search-button').click();
});

document.getElementById('search-nature-button').addEventListener('click', () => {
    const nature = document.getElementById('search').value;
    document.getElementById('endpoint-select').value = 'nature';
    document.getElementById('search').value = nature;
    document.getElementById('search-button').click();
});

document.getElementById('search-pokeathlon-button').addEventListener('click', () => {
    const stat = document.getElementById('search').value;
    document.getElementById('endpoint-select').value = 'pokeathlon-stat';
    document.getElementById('search').value = stat;
    document.getElementById('search-button').click();
});

// Valores limitantes del paginario
let offset = 0;
const limit = 9;

//Paginario
document.getElementById('prev-button').addEventListener('click', () =>
    {
        if (offset >= limit) {
            offset -= limit;
            fetchPokemonList();
        }
    });
    
    document.getElementById('next-button').addEventListener('click', () => {
        offset += limit;
        fetchPokemonList();
    });
    
    const fetchPokemonList = () => {
        const endpoint = document.getElementById('endpoint-select').value;
        fetch(`https://pokeapi.co/api/v2/${endpoint}?offset=${offset}&limit=${limit}`)
            .then(response => response.json())
            .then(data => {
                const resultsContainer = document.getElementById('results');
                const resultsContainer2 = document.getElementById('results2');
                resultsContainer.innerHTML = '';
                resultsContainer2.innerHTML = '';
                data.results.forEach(item => {
                    fetch(item.url)
                        .then(response => response.json())
                        .then(pokemonData => {
                            const col = document.createElement('div');
                            col.className = 'col-md-4 mb-3';
                            const card = document.createElement('div');
                            card.className = 'card';
                            const cardBody = document.createElement('div');
                            cardBody.className = 'card-body';
                            card.appendChild(cardBody);
                            col.appendChild(card);
                            resultsContainer2.appendChild(col);
    
                            const name = document.createElement('h5');
                            name.className = 'card-title';
                            name.innerText = item.name;
                            name.style.textAlign = 'center';
                            cardBody.appendChild(name);
    
                            const spriteImg = document.createElement('img');
                            spriteImg.src = pokemonData.sprites.front_default;
                            spriteImg.alt = pokemonData.name;
                            spriteImg.className = 'pokemon-sprite';
                            spriteImg.style.display = 'block'; 
                            spriteImg.style.margin = '0 auto'; 
                            cardBody.appendChild(spriteImg);
    
                            document.getElementById('prev-button').disabled = offset === 0;
                            document.getElementById('next-button').disabled = !data.next;
                        })
                        .catch(error => {
                            console.error(error);
                        });
                });
            })
            .catch(error => {
                console.error(error);
            });
    };
    
    fetchPokemonList();
    