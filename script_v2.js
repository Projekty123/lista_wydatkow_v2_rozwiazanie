function walidacja(event)
{
    event.preventDefault();

    let nazwa = document.getElementById("nazwa").value.trim();
    let kwota_wartosc = document.getElementById("kwota").value;
    let kwota = Number(kwota_wartosc);

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

    dodajWydatek(nazwa, kwota);

    zapiszWydatki();

    aktualizujSume();

    document.getElementById("nazwa").value = "";
    document.getElementById("kwota").value = "";
}


function dodajWydatek(nazwa, kwota)
{
    let wydatek = document.createElement("li");

    wydatek.dataset.kwota = kwota;
    wydatek.dataset.nazwa = nazwa;

    wydatek.innerHTML = `
        ${nazwa} - ${kwota}
        <button type="button" onclick="usunWydatek(this)">Usuń</button>
    `;

    document.getElementById("lista").appendChild(wydatek);
}


function usunWydatek(przycisk)
{
    przycisk.parentElement.remove();

    zapiszWydatki();

    aktualizujSume();
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


function zapiszWydatki()
{
    let wydatki = [];

    document.querySelectorAll("#lista li").forEach(function(wydatek) {

        wydatki.push({
            nazwa: wydatek.dataset.nazwa,
            kwota: Number(wydatek.dataset.kwota)
        });

    });

    localStorage.setItem("wydatki", JSON.stringify(wydatki));
}


function wczytajWydatki()
{
    let wydatki = JSON.parse(localStorage.getItem("wydatki")) || [];

    wydatki.forEach(function(wydatek) {
        dodajWydatek(wydatek.nazwa, wydatek.kwota);
    });

    aktualizujSume();
}


wczytajWydatki();