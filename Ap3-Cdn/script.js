//https://www.omdbapi.com/?i=tt3896198&apikey=84620263-->

const serieSearchBox = document.getElementById('serie-search-box');
const searchList = document.querySelector('.search-lista');
const resultGrid = document.getElementById('result-grid');
const API_KEY = "84620263";

// busca séries pela API
async function loadSeries(searchTerm) {
    const URL = `https://www.omdbapi.com/?s=${encodeURIComponent(searchTerm)}&type=series&page=1&apikey=${API_KEY}`;
    try {
        const res = await fetch(URL);
        const data = await res.json();
        if (data.Response === "True" && data.Search) {
            displaySeriesList(data.Search);
        } else {
            searchList.innerHTML = `<p style="color:white;padding:10px;">Nenhum resultado encontrado.</p>`;
        }
    } catch (err) {
        console.error("Erro ao buscar séries:", err);
        searchList.innerHTML = `<p style="color:white;padding:10px;">Erro na busca. Tente novamente.</p>`;
    }
}

function displaySeriesList(series) {
    searchList.innerHTML = "";
    for (let i = 0; i < series.length; i++) {
        const item = series[i];
        const serieListItem = document.createElement('div');
        serieListItem.dataset.id = item.imdbID;
        serieListItem.classList.add('search-lista-item');

        const seriePoster = item.Poster !== "N/A" ? item.Poster : "image_not_found.png";

        serieListItem.innerHTML = `
            <div class="search-item-thumb">
                <img src="${seriePoster}" alt="${item.Title}">
            </div>
            <div class="search-item-info">
                <h3>${item.Title}</h3>
                <p>${item.Year}</p>
            </div>
        `;
        searchList.appendChild(serieListItem);
    }

    // Não é necessário chamar loadSeriesDetails() individualmente agora — usamos delegation abaixo
}

/* Event delegation: detecta clicks em .search-lista-item mesmo que os itens sejam criados dinamicamente */
searchList.addEventListener('click', async (event) => {
    const item = event.target.closest('.search-lista-item');
    if (!item) return; // clique fora de um item
    // esconder lista e limpar input
    searchList.classList.add('hide-search-list');
    serieSearchBox.value = "";
    console.log("clicou item:", item.dataset.id);

    try {
        const result = await fetch(`https://www.omdbapi.com/?i=${item.dataset.id}&apikey=${API_KEY}`);
        const serieDetails = await result.json();
        displaySeriesDetails(serieDetails);
    } catch (err) {
        console.error("Erro ao carregar detalhes:", err);
    }
});

function displaySeriesDetails(details) {
    resultGrid.innerHTML = `
        <div class="serie-poster">
            <img src="${details.Poster !== "N/A" ? details.Poster : "image_not_found.png"}" alt="poster">
        </div>
        <div class="serie-info">
            <h3 class="serie-title">${details.Title}</h3>
            <ul class="serie-misc-info">
                <li class="Ano">Ano: ${details.Year}</li>
                <li class="roted">${details.Rated}</li>
                <li class="lancado">Lançado: ${details.Released}</li>
            </ul>
            <p class="genero"><b>Gênero:</b> ${details.Genre}</p>
            <p class="escrito"><b>Escrito por:</b> ${details.Writer}</p>
            <p class="plot"><b>Sinopse:</b> ${details.Plot}</p>
            <p class="lingua"><b>Língua:</b> ${details.Language}</p>
        </div>
    `;
}

function findSeries() {
    const searchTerm = serieSearchBox.value.trim();
    if (searchTerm.length > 0) {
        searchList.classList.remove('hide-search-list');
        loadSeries(searchTerm);
    } else {
        searchList.classList.add('hide-search-list');
    }
}
serieSearchBox.addEventListener('keyup', findSeries);

// clique fora (melhor checagem: se o clique não foi no input nem dentro da lista)
window.addEventListener('click', (event) => {
    if (!event.target.closest('.search-lista') && event.target !== serieSearchBox) {
        searchList.classList.add('hide-search-list');
    }
});
