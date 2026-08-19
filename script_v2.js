let wydatki = JSON.parse(localStorage.getItem("wydatki")) || [];
let edytowaneId = null;

document.querySelector("form").addEventListener("submit", walidacja);
document.getElementById("filtrKategoria").addEventListener("change", render);
document.getElementById("filtrMiesiac").addEventListener("change", render);
document.getElementById("sortowanie").addEventListener("change", render);
document.getElementById("usunWszystkie").addEventListener("click", usunWszystkie);
document.getElementById("wyszukiwarka").addEventListener("input", render);

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

}

function zapiszWydatki() {
    localStorage.setItem("wydatki", JSON.stringify(wydatki));
}

function render() {
    let katFiltru = document.getElementById("filtrKategoria").value;
    let miesiacFiltru = document.getElementById("filtrMiesiac").value;
    let typSortowania = document.getElementById("sortowanie").value;
    let wyszukiwanaFraza = document.getElementById("wyszukiwarka").value.toLowerCase();

    let widoczneWydatki = [];

    // filtrowanie petlą
    for (let i = 0; i < wydatki.length; i++) {
        let w = wydatki[i];
        let pasujeKategoria = (katFiltru === "wszystkie" || w.kategoria.toLowerCase() === katFiltru.toLowerCase());
        let pasujeMiesiac = (miesiacFiltru === "" || w.data.startsWith(miesiacFiltru));
        let pasujeNazwa = w.nazwa.toLowerCase().includes(wyszukiwanaFraza);

        if (pasujeKategoria && pasujeMiesiac && pasujeNazwa) {
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
        li.className = "flex flex-col gap-3 rounded-xl bg-base-200 p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between";

        li.innerHTML = `
            ${w.nazwa} - ${w.kwota.toFixed(2)} zł (${w.kategoria}) [${w.data}]
            <div class="flex gap-1">
            <button type="button" onclick="edytujWydatek(${w.id})" class="btn btn-sm btn-outline btn-info">Edytuj</button>
            <button type="button" onclick="usunWydatek(${w.id})" class="btn btn-sm btn-outline btn-error">Usuń</button>
            </div>
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

function renderKategorie()
{
    let podsumowanie = {};

    for (let i = 0; i < wydatki.length; i++) {
        let kategoria = wydatki[i].kategoria;
        let kwota = wydatki[i].kwota;

        if (podsumowanie[kategoria] === undefined) {
            podsumowanie[kategoria] = 0;
        }

        podsumowanie[kategoria] += kwota;
    }

    let listaKategorii = document.getElementById("podsumowanieKategorii");

    listaKategorii.innerHTML = "";

    for (let kategoria in podsumowanie) {
        let li = document.createElement("li");

        li.textContent =
            kategoria + " - " + podsumowanie[kategoria].toFixed(2) + " zł";

        listaKategorii.appendChild(li);
    }
}

function edytujWydatek(id)
{
    for (let i = 0; i < wydatki.length; i++) {
        if (wydatki[i].id === id) {
            document.getElementById("nazwa").value = wydatki[i].nazwa;
            document.getElementById("kwota").value = wydatki[i].kwota;
            document.getElementById("kategoria").value = wydatki[i].kategoria;
            document.getElementById("data").value = wydatki[i].data;

            edytowaneId = id;

            document.querySelector("form button[type='submit']").textContent = "Zapisz zmiany";

            break;
        }
    }
}

function usunWydatek(id)
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


function usunWszystkie()
{
    if (wydatki.length === 0) {
        alert("Nie ma żadnych wydatków do usunięcia.");
        return;
    }

    let potwierdzenie = confirm("Czy na pewno chcesz usunąć wszystkie wydatki?");

    if (potwierdzenie) {
        wydatki = [];
        zapiszWydatki();
        render();
    }
}




render()