let wydatki = JSON.parse(localStorage.getItem("wydatki")) || [];
let edytowaneId = null;

document.querySelector("form").addEventListener("submit", walidacja);
document.getElementById("filtrKategoria").addEventListener("change", render);
document.getElementById("filtrMiesiac").addEventListener("change", render);
document.getElementById("sortowanie").addEventListener("change", render);
document.getElementById("usunWszystkie").addEventListener("click", usunWszystkie);

function walidacja(event)
{
    event.preventDefault();

    let nazwa = document.getElementById("nazwa").value.trim();
    let kwota_wartosc = document.getElementById("kwota").value;
    let kwota = Number(kwota_wartosc);
    let kategoria = document.getElementById("kategoria").value;
    let data = document.getElementById("data").value;

    if(nazwa === ""){
        alert("Podaj nazwę");
        return;
    }

    if(kwota_wartosc === ""){
        alert("Podaj kwotę");
        return;
    }

    if(kwota <= 0){
        alert("Kwota musi być większa od 0");
        return;
    }

    if (kategoria === "") {
        alert("Wybierz kategorię");
        return;
    }

    if (data === "") {
        alert("Podaj datę");
        return;
    }

    // dodajWydatek(nazwa, kwota);

    if (edytowaneId !== null) {
        for (let i = 0; i < wydatki.length; i++) {
            if (wydatki[i].id === edytowaneId) {
                wydatki[i].nazwa = nazwa;
                wydatki[i].kwota = kwota;
                wydatki[i].kategoria = kategoria;
                wydatki[i].data = data;
            }
        }
        edytowaneId = null;
        document.querySelector("form button[type='submit']").textContent = "Dodaj";
    } else {
        let nowyWydatek = {
            id: Date.now(), // tworze nowe unikalne id
            nazwa: nazwa,
            kwota: kwota,
            kategoria: kategoria,
            data: data
        };
        wydatki.push(nowyWydatek);
    }

    zapiszWydatki();
    document.querySelector("form").reset();
    render();

    // aktualizujSume();

    // document.getElementById("nazwa").value = "";
    // document.getElementById("kwota").value = "";
}


// function dodajWydatek(nazwa, kwota)
// {
//     let wydatek = document.createElement("li");

//     wydatek.dataset.kwota = kwota;
//     wydatek.dataset.nazwa = nazwa;

//     wydatek.innerHTML = `
//         ${nazwa} - ${kwota}
//         <button type="button" onclick="usunWydatek(this)">Usuń</button>
//         <button type="button" onclick="edytujWydatek(this)">Edytuj</button>
//     `;

//     document.getElementById("lista").appendChild(wydatek);
// }

function zapiszWydatki() {
    localStorage.setItem("wydatki", JSON.stringify(wydatki));
}

function render() {
    let katFiltru = document.getElementById("filtrKategoria").value;
    let miesiacFiltru = document.getElementById("filtrMiesiac").value;
    let typSortowania = document.getElementById("sortowanie").value;

    let widoczneWydatki = [];

    // filtrowanie petlą
    for (let i = 0; i < wydatki.length; i++) {
        let w = wydatki[i];
        let pasujeKategoria = (katFiltru === "wszystkie" || w.kategoria.toLowerCase() === katFiltru.toLowerCase());
        let pasujeMiesiac = (miesiacFiltru === "" || w.data.startsWith(miesiacFiltru));

        if (pasujeKategoria && pasujeMiesiac) {
            widoczneWydatki.push(w);
        }
    }

    // sortowanie
    widoczneWydatki.sort(function(a, b) {
        if (typSortowania === "najnowsze") return new Date(b.data) - new Date(a.data);
        if (typSortowania === "najstarsze") return new Date(a.data) - new Date(b.data);
        if (typSortowania === "najdrozsze") return b.kwota - a.kwota;
        if (typSortowania === "najtansze") return a.kwota - b.kwota;
    });

    // wyswietlanie listy
    let listaEl = document.getElementById("lista");
    listaEl.innerHTML = "";

    for (let i = 0; i < widoczneWydatki.length; i++) {
        let w = widoczneWydatki[i];
        let li = document.createElement("li");

        li.innerHTML = `
            ${w.nazwa} - ${w.kwota.toFixed(2)} zł (${w.kategoria}) [${w.data}]
            <button type="button" onclick="edytujWydatek(${w.id})">Edytuj</button>
            <button type="button" onclick="usunWydatek(${w.id})">Usuń</button>
        `;
        listaEl.appendChild(li);
    }

    // kwota i liczba
    let suma = 0;
    for (let i = 0; i < wydatki.length; i++) {
        suma += wydatki[i].kwota;
    }
    document.getElementById("suma").textContent = suma.toFixed(2);
    document.getElementById("liczbaWydatkow").textContent = wydatki.length;

    renderKategorie();
}

function usunWydatek(przycisk)
{
    let nowaLista = [];
    for (let i = 0; i < wydatki.length; i++) {
        if (wydatki[i].id !== id) {
            nowaLista.push(wydatki[i]);
        }
    }
    wydatki = nowaLista;

    zapiszWydatki();
    render();
}


function aktualizujSume()
{
    let wydatki = document.querySelectorAll("#lista li");
    let suma = 0;

    wydatki.forEach(function(wydatek) {
        let kwota = Number(wydatek.dataset.kwota);
        suma += kwota;
    });

    document.getElementById("suma").textContent = suma.toFixed(2);
}


// function zapiszWydatki()
// {
//     let wydatki = [];

//     document.querySelectorAll("#lista li").forEach(function(wydatek) {

//         wydatki.push({
//             nazwa: wydatek.dataset.nazwa,
//             kwota: Number(wydatek.dataset.kwota)
//         });

//     });

//     localStorage.setItem("wydatki", JSON.stringify(wydatki));
// }


function wczytajWydatki()
{
    let wydatki = JSON.parse(localStorage.getItem("wydatki")) || [];

    wydatki.forEach(function(wydatek) {
        dodajWydatek(wydatek.nazwa, wydatek.kwota);
    });

    aktualizujSume();
}


wczytajWydatki();