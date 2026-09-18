/**
 * Silnik reguł nauki tradycji magicznych i zaklęć (PG, rozdział "Magia").
 *
 * Zasady źródłowe (zweryfikowane bezpośrednio w podręczniku):
 * - "Poznawanie tradycji": poznanie nowej tradycji oznacza automatyczną
 *   naukę jednego z jej zaklęć kręgu 0.
 * - "Uczenie się zaklęć": nauka zaklęcia wymaga już znanej tradycji, z
 *   której to zaklęcie pochodzi, a jego krąg nie może przekraczać Mocy
 *   postaci.
 * - "Czarna magia" (Klątwy, Sztuki Zakazane, Nekromancja i best-effort
 *   klasyfikowane tradycje z suplementów - zob. `traditions.js`): poznanie
 *   takiej tradycji przyznaje od razu 1 punkt Splugawienia; każde kolejne
 *   nauczone z niej zaklęcie niesie ryzyko +1 Splugawienia (rzut k6 <
 *   liczba już znanych zaklęć czarnej magii).
 *
 * Ten moduł rozbija pole `magia` ze `paths.js`/`origins.js` (jednostki
 * nadania: tradycja / wybor / zaklecie - zob. dokumentację w paths.js) na
 * listę "atomowych wyborów" - niepodzielnych decyzji gracza, jedną kartę
 * UI na atom - i udostępnia funkcje pomocnicze do ich rozwiązywania
 * (śledzenie znanych tradycji, filtrowanie dostępnych zaklęć wg Mocy).
 */

import PATHS from '../data/paths.js';
import SPELLS from '../data/spells.js';
import { TRADYCJE, TRADYCJE_RELIGIJNE, pobierzListePoznawalnychTradycji } from '../data/traditions.js';

/** Minimalny poziom postaci wymagany do odblokowania danego klucza korzyści ścieżki. */
const WYMAGANY_POZIOM = {
  sciezki_nowicjuszy: { poziom_1: 1, poziom_2: 2, poziom_5: 5, poziom_8: 8 },
  sciezki_ekspertow: { poziom_1: 3, poziom_6: 6 },
  sciezki_mistrzow: { poziom_1: 7, poziom_10: 10 }
};

function znajdzSciezke(grupaKey, id) {
  if (!id) return null;
  return (PATHS[grupaKey] && PATHS[grupaKey][id]) || null;
}

/**
 * Normalizuje pole `magia` (bare obiekt albo tablica obiektów) do tablicy
 * jednostek nadania. Wartości tekstowe (np. "Zaklęcie egzorcyzm" Egzorcysty)
 * to automatyczne, nieinteraktywne nadania zaklęcia - nie przechodzą przez
 * ten mechanizm wyboru, więc zwracają puste.
 */
function normalizujMagie(magia) {
  if (!magia || typeof magia === 'string') return [];
  return Array.isArray(magia) ? magia : [magia];
}

/**
 * Rozwija jedną jednostkę nadania magii na listę atomowych wyborów.
 * @param {Object} jednostka - jednostka nadania (typ tradycja/wybor/zaklecie)
 * @param {string} idBase - prefiks stabilnego id (unikalny w ramach źródła)
 * @param {string} source - etykieta źródła nadania (do wyświetlenia)
 * @returns {Array}
 */
function rozwinJednostke(jednostka, idBase, source) {
  const atomy = [];
  if (jednostka.typ === 'tradycja') {
    atomy.push({ id: `${idBase}-t`, source, rodzaj: 'wymuszona_tradycja', kategoria: jednostka.kategoria || ['dowolna'] });
  } else if (jednostka.typ === 'wybor') {
    const ilosc = jednostka.ilosc || 1;
    for (let i = 0; i < ilosc; i++) {
      if (jednostka.tradycjaNazwa) {
        atomy.push({ id: `${idBase}-w${i}`, source, rodzaj: 'wybor_fixed', tradycjaNazwa: jednostka.tradycjaNazwa });
      } else {
        atomy.push({ id: `${idBase}-w${i}`, source, rodzaj: 'wybor', kategoria: jednostka.kategoria || ['dowolna'] });
      }
    }
  } else if (jednostka.typ === 'zaklecie') {
    const ilosc = jednostka.ilosc || 1;
    for (let i = 0; i < ilosc; i++) {
      atomy.push({ id: `${idBase}-z${i}`, source, rodzaj: 'zaklecie_tylko' });
    }
  }
  return atomy;
}

/**
 * Oblicza wszystkie atomowe wybory magii przyznane postaci na obecnym
 * poziomie - jeden atom = jedna karta UI w Kroku 4.5. Uwzględnia
 * pochodzenie (opcja "1 zaklęcie" na poziomie 4) oraz wszystkie poziomy
 * korzyści wybranych ścieżek nowicjusza/eksperckiej/mistrzowskiej, które są
 * już odblokowane przy `wybranyPoziom` postaci.
 *
 * @param {Object} params
 * @param {Object|null} params.pochodzenie
 * @param {string|null} params.wybranaOpcjaPoziom4 - wybrana opcja radiową z Kroku korzyści pochodzenia
 * @param {string|null} params.sciezkaNowicjuszaId
 * @param {string|null} params.sciezkaEksperckaId
 * @param {string|null} params.sciezkaMistrzowskaId
 * @param {number} params.wybranyPoziom
 * @returns {Array}
 */
function obliczSlotyMagii({ pochodzenie, wybranaOpcjaPoziom4, sciezkaNowicjuszaId, sciezkaEksperckaId, sciezkaMistrzowskaId, wybranyPoziom }) {
  const atomy = [];

  if (pochodzenie && pochodzenie.poziom_4 && wybranyPoziom >= 4 && wybranaOpcjaPoziom4 === '1 zaklęcie') {
    atomy.push(...rozwinJednostke(
      { typ: 'zaklecie', ilosc: 1 },
      `poch-${pochodzenie.id}`,
      `Pochodzenie: ${pochodzenie.nazwa} (poziom 4)`
    ));
  }

  const dodajSciezke = (grupaKey, sciezkaId) => {
    const sciezka = znajdzSciezke(grupaKey, sciezkaId);
    if (!sciezka) return;
    const poziomyWTejGrupie = WYMAGANY_POZIOM[grupaKey];
    Object.entries(poziomyWTejGrupie).forEach(([lvlKey, wymaganyPoziom]) => {
      if (wybranyPoziom < wymaganyPoziom) return;
      const pkt = sciezka[lvlKey];
      if (!pkt) return;
      const jednostki = normalizujMagie(pkt.magia);
      jednostki.forEach((jednostka, idx) => {
        const idBase = `${sciezkaId}-${lvlKey}-m${idx}`;
        const source = `Ścieżka: ${sciezka.nazwa} (poziom ${wymaganyPoziom})`;
        atomy.push(...rozwinJednostke(jednostka, idBase, source));
      });
    });
  };

  dodajSciezke('sciezki_nowicjuszy', sciezkaNowicjuszaId);
  dodajSciezke('sciezki_ekspertow', sciezkaEksperckaId);
  dodajSciezke('sciezki_mistrzow', sciezkaMistrzowskaId);

  return atomy;
}

/** Sprawdza, czy dana tradycja (po id) jest tradycją czarnej magii. */
function czyCzarnaMagia(tradycjaId) {
  return !!(tradycjaId && TRADYCJE[tradycjaId] && TRADYCJE[tradycjaId].czarnaMagia);
}

/**
 * Zwraca listę tradycji dostępnych do poznania dla danego ograniczenia
 * kategorii slotu ('dowolna' / 'religijne' / lista konkretnych id tradycji),
 * pomijając tradycje już znane.
 */
function pobierzTradycjeDlaKategorii(kategoria, znaneTradycje) {
  const wszystkie = pobierzListePoznawalnychTradycji();
  let dozwolone;
  if (!kategoria || kategoria.includes('dowolna')) {
    dozwolone = wszystkie;
  } else if (kategoria.includes('religijne')) {
    dozwolone = wszystkie.filter(id => TRADYCJE_RELIGIJNE.includes(id));
  } else {
    dozwolone = wszystkie.filter(id => kategoria.includes(id));
  }
  return dozwolone
    .filter(id => !znaneTradycje.has(id))
    .map(id => ({ id, nazwa: TRADYCJE[id].nazwa, czarnaMagia: !!TRADYCJE[id].czarnaMagia }))
    .sort((a, b) => a.nazwa.localeCompare(b.nazwa, 'pl'));
}

/**
 * Zwraca listę zaklęć dostępnych do nauki: z tradycji już znanych postaci
 * (albo wyłącznie z `tradycjaOgraniczenie`, gdy podana - przypadek
 * wybor_fixed), o kręgu nie wyższym niż aktualna Moc postaci.
 */
function pobierzZakleciaDoNauki({ znaneTradycje, moc, tradycjaOgraniczenie }) {
  const dozwoloneTradycje = tradycjaOgraniczenie ? [tradycjaOgraniczenie] : [...znaneTradycje];
  return SPELLS.filter(s => dozwoloneTradycje.includes(s.tradycja) && s.krag <= moc);
}

/**
 * Rozwiązuje pełną listę atomów wg dokonanych przez gracza wyborów
 * (`wybory`, mapa id atomu -> { mode, tradycjaId, spellId }), zwracając
 * kolejność-świadome rozwiązania (dla wybor_fixed liczy się to, co jest
 * już znane w chwili przetwarzania danego atomu) oraz zbiór wynikowych
 * znanych tradycji.
 */
function obliczRozwiazanieMagii(atomy, wybory) {
  const znaneTradycje = new Set();
  const rozwiazania = [];
  let liczbaZnanychCzarnychZaklec = 0;

  for (const atom of atomy) {
    const wybor = wybory[atom.id] || {};
    let mode = null;
    let tradycjaId = null;
    let spellId = null;
    let darmowyZaklecieId = null;

    if (atom.rodzaj === 'wymuszona_tradycja') {
      mode = 'tradycja';
      tradycjaId = wybor.tradycjaId || null;
    } else if (atom.rodzaj === 'wybor_fixed') {
      mode = znaneTradycje.has(atom.tradycjaNazwa) ? 'zaklecie' : 'tradycja';
      tradycjaId = atom.tradycjaNazwa;
      spellId = wybor.spellId || null;
    } else if (atom.rodzaj === 'zaklecie_tylko') {
      mode = 'zaklecie';
      spellId = wybor.spellId || null;
    } else if (atom.rodzaj === 'wybor') {
      mode = wybor.mode || null;
      tradycjaId = mode === 'tradycja' ? (wybor.tradycjaId || null) : null;
      spellId = mode === 'zaklecie' ? (wybor.spellId || null) : null;
    }

    if (mode === 'tradycja' && tradycjaId) {
      znaneTradycje.add(tradycjaId);
      // "Poznawanie tradycji": poznanie tradycji oznacza naukę jednego jej
      // zaklęcia kręgu 0 - gracz wybiera, które (patrz pobierzZakleciaKregu0()).
      darmowyZaklecieId = wybor.darmowyZaklecieId || null;
      // Jeśli to tradycja czarnej magii, to darmowe zaklęcie liczy się już
      // jako "znane zaklęcie czarnej magii" na potrzeby ryzyka splugawienia
      // przy nauce KOLEJNYCH zaklęć z tej tradycji.
      if (czyCzarnaMagia(tradycjaId)) liczbaZnanychCzarnychZaklec++;
    }

    const kompletny = mode === 'tradycja' ? !!(tradycjaId && darmowyZaklecieId) : (mode === 'zaklecie' ? !!spellId : false);

    // Ryzyko splugawienia dotyczy tylko zaklęć czarnej magii nauczonych
    // jako "kolejne zaklęcie" (mode 'zaklecie') - nie darmowego zaklęcia
    // kręgu 0 przyznanego automatycznie przy poznaniu samej tradycji
    // (to już naliczone powyżej, jednorazowo, przy poznaniu tradycji).
    let czarnaMagiaRyzyko = null;
    if (mode === 'zaklecie' && spellId) {
      const spell = SPELLS.find(s => s.id === spellId);
      if (spell && czyCzarnaMagia(spell.tradycja)) {
        czarnaMagiaRyzyko = { liczbaZnanychPrzed: liczbaZnanychCzarnychZaklec };
        liczbaZnanychCzarnychZaklec++;
      }
    }

    rozwiazania.push({ atom, mode, tradycjaId, spellId, darmowyZaklecieId, kompletny, czarnaMagiaRyzyko });
  }

  return { rozwiazania, znaneTradycje };
}

/**
 * Zwraca zaklęcia kręgu 0 należące do danej tradycji - to z nich gracz
 * wybiera darmowe zaklęcie przyznawane automatycznie przy poznaniu tejże
 * tradycji ("Poznawanie tradycji", PG).
 */
function pobierzZakleciaKregu0(tradycjaId) {
  return SPELLS.filter(s => s.tradycja === tradycjaId && s.krag === 0);
}

/** Krótki, czytelny opis jednego atomowego wyboru - do podglądu/pomocy. */
function opisAtomu(atom) {
  if (atom.rodzaj === 'wymuszona_tradycja') {
    return `Poznajesz nową tradycję${opisKategorii(atom.kategoria, 'accusative')}.`;
  }
  if (atom.rodzaj === 'wybor_fixed') {
    return `Tradycja ${TRADYCJE[atom.tradycjaNazwa]?.nazwa || atom.tradycjaNazwa} lub zaklęcie z niej.`;
  }
  if (atom.rodzaj === 'wybor') {
    return `Nowa tradycja${opisKategorii(atom.kategoria, 'nominative')} lub zaklęcie ze znanej tradycji.`;
  }
  if (atom.rodzaj === 'zaklecie_tylko') {
    return 'Uczysz się jednego zaklęcia ze znanej już tradycji.';
  }
  return '';
}

/**
 * Czytelny opis kategorii tradycji (do wpisania w opis jednostki nadania).
 * @param {string[]} kategoria
 * @param {'nominative'|'accusative'} forma - odmiana przymiotnika
 *   "związana/związaną", dopasowana do rzeczownika, który opisuje ("tradycja"
 *   w mianowniku vs. "tradycję" w bierniku po "Poznajesz").
 */
function opisKategorii(kategoria, forma = 'nominative') {
  if (!kategoria || kategoria.includes('dowolna')) return '';
  const zwiazana = forma === 'accusative' ? 'związaną' : 'związana';
  if (kategoria.includes('religijne')) return ` ${zwiazana} z religią`;
  return ` ${zwiazana} z: ${kategoria.map(id => TRADYCJE[id]?.nazwa || id).join(', ')}`;
}

/**
 * Krótki, czytelny opis jednej jednostki nadania magii (nie rozwiniętej na
 * atomy) - używany w podglądzie kafelka ścieżki (Krok 3) i w Karcie
 * Postaci, gdzie liczy się zwięzłe podsumowanie całej korzyści, nie
 * pojedyncza karta wyboru.
 */
function opisJednostki(jednostka) {
  if (jednostka.typ === 'tradycja') {
    return `Poznajesz nową tradycję${opisKategorii(jednostka.kategoria, 'accusative')}.`;
  }
  if (jednostka.typ === 'wybor') {
    const ilosc = jednostka.ilosc || 1;
    if (jednostka.tradycjaNazwa) {
      return `Tradycja ${TRADYCJE[jednostka.tradycjaNazwa]?.nazwa || jednostka.tradycjaNazwa} lub zaklęcie z niej.`;
    }
    const razy = ilosc > 1 ? `${ilosc}x: ` : '';
    return `${razy}nowa tradycja${opisKategorii(jednostka.kategoria, 'nominative')} lub zaklęcie ze znanej tradycji.`;
  }
  if (jednostka.typ === 'zaklecie') {
    const ilosc = jednostka.ilosc || 1;
    return ilosc > 1 ? `Uczysz się ${ilosc} zaklęć ze znanych tradycji.` : 'Uczysz się jednego zaklęcia ze znanej tradycji.';
  }
  return '';
}

/**
 * Czytelny opis całego pola `magia` (string bare / obiekt / tablica) - do
 * podglądu w kafelku ścieżki (Krok 3) i w Karcie Postaci.
 */
function opisMagii(magia) {
  if (!magia) return '';
  if (typeof magia === 'string') return magia;
  const jednostki = Array.isArray(magia) ? magia : [magia];
  return jednostki.map(opisJednostki).join(' ');
}

export {
  obliczSlotyMagii,
  obliczRozwiazanieMagii,
  pobierzTradycjeDlaKategorii,
  pobierzZakleciaDoNauki,
  pobierzZakleciaKregu0,
  czyCzarnaMagia,
  opisAtomu,
  opisMagii
};
