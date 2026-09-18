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

const RZADKOSC_RANGA = { pospolity: 0, niepospolity: 1, rzadki: 2, egzotyczny: 3 };

const SORTOWANIE_ETYKIETY = {
  nazwa: 'Nazwa', cena: 'Cena', obrazenia: 'Obrażenia', obrona: 'Obrona', rzadkosc: 'Rzadkość'
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

const KATEGORIE_BRONI = ['bron_biala', 'bron_dystansowa', 'tarcze'];

/**
 * Formatuje statystyki i właściwości przedmiotu (broń/tarcza: obrażenia,
 * chwyt, właściwości, wymagania; zbroja: obrona, wymagania) do jednej
 * czytelnej linijki tekstu. Zwraca `null` dla przedmiotów bez takich pól
 * (np. wyposażenie ogólne, jedzenie).
 */
function formatujStatystykiPrzedmiotu(item) {
  if (!item) return null;
  if (KATEGORIE_BRONI.includes(item.kategoria)) {
    const czesci = [];
    if (item.obrazenia) czesci.push(`Obrażenia ${item.obrazenia}`);
    if (item.chwyt) czesci.push(`Chwyt: ${item.chwyt}`);
    if (item.wlasciwosci) czesci.push(`Właściwości: ${item.wlasciwosci}`);
    if (item.wymagania) czesci.push(`Wymagania: ${item.wymagania}`);
    return czesci.length ? czesci.join(' · ') : null;
  }
  if (item.kategoria === 'zbroje') {
    const czesci = [];
    if (item.obrona) czesci.push(`Obrona: ${item.obrona}`);
    if (item.wymagania) czesci.push(`Wymagania: ${item.wymagania}`);
    return czesci.length ? czesci.join(' · ') : null;
  }
  return null;
}

/**
 * Przelicza zapis kości obrażeń (np. "1k6 + 1", "2k6", "1k3", albo płaskie
 * "1") na średnią liczbową, żeby dało się sortować po obrażeniach. Zwraca
 * `null` dla przedmiotów bez pola obrażeń (czyli nie-broni).
 */
function sredniaObrazen(zapis) {
  if (!zapis) return null;
  const kosci = zapis.match(/(\d+)\s*k\s*(\d+)/i);
  let baza = 0;
  if (kosci) {
    baza = parseInt(kosci[1], 10) * (parseInt(kosci[2], 10) + 1) / 2;
  } else {
    const plaska = parseFloat(zapis);
    if (Number.isNaN(plaska)) return null;
    baza = plaska;
  }
  const bonus = zapis.match(/\+\s*(\d+)/);
  if (bonus) baza += parseInt(bonus[1], 10);
  return baza;
}

/**
 * Wyciąga liczbową wartość Obrony (np. "17" -> 17). Zbroje, których Obrona
 * zależy od Zręczności postaci (np. "Zręczność + 2"), nie mają stałej
 * liczby do porównania - zwraca wtedy `null`.
 */
function wartoscObrony(obrona) {
  if (obrona === null || obrona === undefined || obrona === '') return null;
  const liczba = parseInt(obrona, 10);
  return Number.isNaN(liczba) ? null : liczba;
}

/**
 * Sortuje listę przedmiotów katalogu wg wybranego kryterium ('nazwa',
 * 'cena', 'obrazenia', 'obrona' albo 'rzadkosc') i kierunku ('asc'/'desc').
 * Przedmioty, dla których dane kryterium nie ma sensu (np. Obrażenia dla
 * zbroi), lądują zawsze na końcu listy, niezależnie od kierunku - są
 * wtedy dodatkowo posortowane alfabetycznie, żeby lista była stabilna.
 */
function sortujPrzedmioty(lista, sortBy, sortDir) {
  const kierunek = sortDir === 'desc' ? -1 : 1;
  const wartosc = (item) => {
    switch (sortBy) {
    case 'cena': return item.cena ? cenaNaOkrawki(item.cena) : null;
    case 'obrazenia': return sredniaObrazen(item.obrazenia);
    case 'obrona': return wartoscObrony(item.obrona);
    case 'rzadkosc': return item.rzadkosc ? RZADKOSC_RANGA[item.rzadkosc] : null;
    case 'nazwa':
    default: return null;
    }
  };
  return lista.slice().sort((a, b) => {
    const av = wartosc(a);
    const bv = wartosc(b);
    const aBrak = av === null || av === undefined;
    const bBrak = bv === null || bv === undefined;
    if (aBrak && bBrak) return a.nazwa.localeCompare(b.nazwa, 'pl');
    if (aBrak) return 1;
    if (bBrak) return -1;
    if (av !== bv) return (av - bv) * kierunek;
    return a.nazwa.localeCompare(b.nazwa, 'pl');
  });
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
  formatujStatystykiPrzedmiotu,
  SORTOWANIE_ETYKIETY,
  sortujPrzedmioty,
  pobierzZamoznoscDlaRzutu
};
