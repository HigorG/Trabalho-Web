//https://www.omdbapi.com/?i=tt3896198&apikey=84620263-->

    const serieSearchBox = document.getElementById('serie-search-box');
    const searchList = document.querySelector('.search-lista');
    const resultGrid = document.getElementById('result-grid');
    const API_KEY ="84620263";

    async function loadSeries(searchTerm){
        const URL = `https://www.omdbapi.com/?s=${searchTerm}&type=series&page=1&apikey=${API_KEY}`;
        const res = await fetch(URL);
        const data =await res.json();

        if (data.Response === "True"){
            displaySeriesList(data.Search);

        } else {
            searchList.innerHTML =`<p style="color:white;padding:10px;">Nenhum resultado encontrado.</p>`;
        
        }
    }
    function displaySeriesList(series){
        searchList.innerHTML = ""
        for (let idx = 0; idx < series.length; idx++){
        let serieListItem = document.createElement('div');
        serieListItem.dataset.id = series[idx].imdbID;
        serieListItem.classList.add('search-lista-item');

        let seriePoster = series[idx].Poster !== "N/A" ? series[idx].Poster : "image_not_found.png";

        serieListItem.innerHTML =
        serieListItem.innerHTML = `
        <div class="search-item-thumb">
            <img src="${seriePoster}" alt="${series[idx].Title}">
        </div>
        <div class="search-item-info">
            <h3>${series[idx].Title}</h3>
            <p>${series[idx].Year}</p>
        </div>
    `;
    searchList.appendChild(serieListItem);

}
    loadSeriesDetails();
}

function loadSeriesDetails(){
    const searchListSeries = searchList.querySelectorAll('search-lista-item');
    searchListSeries.forEach(serie => {
    serie.addEventListener('click',async () => {
    searchList .classList.add('hide-search-list');
    serieSearchBox.value ="";
    const result = await fetch(`https://www.omdbapi.com/?i=${serie.dataset.id}&apikey=${API_KEY}`);
    const serieDetails = await result.json();
    displaySeriesDetails(serieDetails);

    });

    });
}

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

function findSeries(){
    let searchTerm = serieSearchBox.value.trim();
    if (searchTerm.length > 0){
        searchList.classList.remove('hide-search-list');
        loadSeries(searchTerm);
    }else{
        searchList.classList.add('hide-search-list');

    }
}
serieSearchBox.addEventListener('keyup',findSeries);

window.addEventListener('click',(event) => {
    if (event.target.className !== "form-control") {
        searchList.classList.add('hide-search-list');
    } 
})

    
    

    