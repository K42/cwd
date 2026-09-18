/**
 * Silnik reguł początkowego wyposażenia i sklepu (PG, "Początkowe
 * wyposażenie" str. 25-26 oraz "Ekwipunek", Rozdział 6).
 *
 * Waluta: 10 okrawków (okr) = 1 miedziak (md), 10 miedziaków = 1 srebrnik
 * (sr), 10 srebrników = 1 złota korona (zk) - PG, "Ceny". Wszystkie
 * obliczenia pieniężne wykonuje się wewnętrznie w okrawkach (najmniejsza
 * jednostka), a wyświetla w rozbiciu na największe pasujące nominały.
 *
 * Sprzedaż: "Używany ekwipunek wart jest połowę lub mniej swojej
 * podstawowej ceny" (PG, "Inne środki płatności") - ten kreator używa
 * maksymalnej dozwolonej stawki: dokładnie połowy ceny bazowej.
 */

import EQUIPMENT from '../data/equipment.js';
import { ZAMOZNOSC, pobierzZamoznoscDlaRzutu } from '../data/zamoznosc.js';

const PRZELICZNIK_NA_OKRAWKI = { okr: 1, md: 10, sr: 100, zk: 1000 };
const NOMINALY_OD_NAJWIEKSZEGO = ['zk', 'sr', 'md', 'okr'];

const STAWKA_SKUPU = 0.5;

const RZADKOSC_ETYKIETY = {
  pospolity: 'Pospolity', niepospolity: 'Niepospolity', rzadki: 'Rzadki', egzotyczny: 'Egzotyczny'
};

const KATEGORIA_ETYKIETY = {
  bron_biala: 'Broń biała',
  bron_dystansowa: 'Broń dystansowa',
  tarcze: 'Tarcze',
  amunicja: 'Amunicja',
  zbroje: 'Zbroje i pancerze',
  wyposazenie: 'Wyposażenie',
  ubior: 'Ubiór i akcesoria',
  narzedzia: 'Narzędzia',
  jedzenie_zakwaterowanie: 'Jedzenie i zakwaterowanie',
  zwierzeta: 'Zwierzęta i sprzęt',
  eliksiry: 'Eliksiry',
  substancje_alchemiczne: 'Substancje alchemiczne',
  przedmioty_zakazane: 'Przedmioty zakazane',
  wynalazki: 'Wynalazki'
};

/** Znajduje przedmiot w katalogu po id. */
function pobierzPrzedmiot(id) {
  return EQUIPMENT.find(i => i.id === id) || null;
}

/** Przelicza cenę przedmiotu (obiekt {wartosc, jednostka}) na okrawki. */
function cenaNaOkrawki(cena) {
  if (!cena) return 0;
  return cena.wartosc * (PRZELICZNIK_NA_OKRAWKI[cena.jednostka] || 1);
}

/** Formatuje cenę przedmiotu z katalogu do czytelnego tekstu (np. "min. 5 md"). */
function formatujCene(cena) {
  if (!cena) return '—';
  const etykietyJednostek = { okr: 'okr.', md: 'md', sr: 'sr', zk: 'zk' };
  const prefix = cena.orientacyjna ? 'min. ' : '';
  return `${prefix}${cena.wartosc} ${etykietyJednostek[cena.jednostka] || cena.jednostka}`;
}

/** Formatuje kwotę w okrawkach na czytelny tekst w rozbiciu na nominały (np. "1 zk 3 sr"). */
function formatujOkrawki(okrawki) {
  if (!Number.isFinite(okrawki) || okrawki <= 0) return '0 okr.';
  let pozostale = Math.floor(okrawki);
  const etykiety = { zk: 'zk', sr: 'sr', md: 'md', okr: 'okr.' };
  const czesci = [];
  NOMINALY_OD_NAJWIEKSZEGO.forEach(nominal => {
    const wartoscNominalu = PRZELICZNIK_NA_OKRAWKI[nominal];
    const ilosc = Math.floor(pozostale / wartoscNominalu);
    if (ilosc > 0) {
      czesci.push(`${ilosc} ${etykiety[nominal]}`);
      pozostale -= ilosc * wartoscNominalu;
    }
  });
  return czesci.length ? czesci.join(' ') : '0 okr.';
}

/** Cena skupu (sprzedaży przez postać) przedmiotu w okrawkach - połowa ceny bazowej, zaokrąglona w dół. */
function cenaSkupuOkrawki(cena) {
  return Math.floor(cenaNaOkrawki(cena) * STAWKA_SKUPU);
}

/**
 * Rozwija listę przedmiotów danego poziomu zamożności na atomowe wybory
 * gracza (jedna karta UI = jeden atom) - analogicznie do rozwinJednostke()
 * w logic/magia.js. Gwarantowane pozycje (bez wyboru) nie generują atomu.
 */
function obliczAtomyWyposazenia(zamoznoscId) {
  const zam = ZAMOZNOSC[zamoznoscId];
  if (!zam) return [];
  const atomy = [];
  zam.przedmioty.forEach((p, idx) => {
    if (p.wybor) {
      atomy.push({
        id: `${zamoznoscId}-w${idx}`,
        rodzaj: 'wybor_przedmiotu',
        opcje: p.wybor,
        opisWyboru: p.opisWyboru || null
      });
    }
  });
  if (zam.wyborDodatkowy) {
    atomy.push({
      id: `${zamoznoscId}-dodatkowy`,
      rodzaj: 'wybor_dodatkowy',
      opcje: zam.wyborDodatkowy.opcje,
      opis: zam.wyborDodatkowy.opis
    });
  }
  return atomy;
}

/** Zwraca gwarantowane (bez wyboru) pozycje wyposażenia danego poziomu zamożności - katalogowe i opisowe. */
function pobierzGwarantowanePozycje(zamoznoscId) {
  const zam = ZAMOZNOSC[zamoznoscId];
  if (!zam) return [];
  return zam.przedmioty.filter(p => !p.wybor);
}

export {
  PRZELICZNIK_NA_OKRAWKI,
  STAWKA_SKUPU,
  RZADKOSC_ETYKIETY,
  KATEGORIA_ETYKIETY,
  pobierzPrzedmiot,
  cenaNaOkrawki,
  formatujCene,
  formatujOkrawki,
  cenaSkupuOkrawki,
  obliczAtomyWyposazenia,
  pobierzGwarantowanePozycje,
  pobierzZamoznoscDlaRzutu
};
