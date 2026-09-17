/**
 * Metadane tradycji magicznych - lista i atrybuty zweryfikowane wg tabeli
 * "Tradycje i atrybuty" z Podręcznika Głównego (str. 115); tradycje z suplementów
 * dodane z najlepszą wiedzą o ich charakterze (nie ma dla nich analogicznej tabeli).
 *
 * `czarnaMagia: true` oznacza tradycję czarnej magii (PG str. 115: Klątwy, Sztuki
 * Zakazane, Nekromancja - jedyne potwierdzone w PG). Poznanie takiej tradycji
 * przyznaje 1 punkt Splugawienia; każde nauczenie się z niej kolejnego zaklęcia
 * niesie ryzyko kolejnego punktu (rzut k6 < liczba już znanych zaklęć czarnej magii).
 *
 * `realTradycja: false` oznacza wpis, który w źródle występuje jako nazwa ścieżki
 * przyznającej jedno konkretne, zablokowane zaklęcie (np. "Zaklęcie egzorcyzm"
 * Egzorcysty), a nie jako prawdziwą, samodzielnie poznawalną tradycję magiczną -
 * takie wpisy są wyłączone z listy tradycji do wyboru w Kroku 4.5, ale ich zaklęcia
 * pozostają wyszukiwalne w bibliotece.
 */

const TRADYCJE = {
  // --- Podręcznik Główny (PG str. 115, "Tradycje i atrybuty") ---
  sztuki_tajemne: { nazwa: 'Sztuki Tajemne', atrybut: 'intelekt', czarnaMagia: false },
  magia_bitewna: { nazwa: 'Magia Bitewna', atrybut: 'intelekt', czarnaMagia: false },
  przywolania: { nazwa: 'Przywołania', atrybut: 'intelekt', czarnaMagia: false },
  klatwy: { nazwa: 'Klątwy', atrybut: 'intelekt', czarnaMagia: true },
  jasnowidzenie: { nazwa: 'Jasnowidzenie', atrybut: 'intelekt', czarnaMagia: false },
  uroki: { nazwa: 'Uroki', atrybut: 'intelekt', czarnaMagia: false },
  sztuki_zakazane: { nazwa: 'Sztuki Zakazane', atrybut: 'intelekt', czarnaMagia: true },
  iluzja: { nazwa: 'Iluzja', atrybut: 'intelekt', czarnaMagia: false },
  nekromancja: { nazwa: 'Nekromancja', atrybut: 'intelekt', czarnaMagia: true },
  ochrona: { nazwa: 'Ochrona', atrybut: 'intelekt', czarnaMagia: false },
  magia_runiczna: { nazwa: 'Magia Runiczna', atrybut: 'intelekt', czarnaMagia: false },
  magia_cienia: { nazwa: 'Magia Cienia', atrybut: 'intelekt', czarnaMagia: false },
  technomancja: { nazwa: 'Technomancja', atrybut: 'intelekt', czarnaMagia: false },
  teleportacja: { nazwa: 'Teleportacja', atrybut: 'intelekt', czarnaMagia: false },
  czas: { nazwa: 'Czas', atrybut: 'intelekt', czarnaMagia: false },
  chaos: { nazwa: 'Chaos', atrybut: 'wola', czarnaMagia: false },
  magia_burzy: { nazwa: 'Magia Burzy', atrybut: 'wola', czarnaMagia: false },
  magia_pierwotna: { nazwa: 'Magia Pierwotna', atrybut: 'wola', czarnaMagia: false },
  natura: { nazwa: 'Natura', atrybut: 'wola', czarnaMagia: false },
  ogien: { nazwa: 'Ogień', atrybut: 'wola', czarnaMagia: false },
  piesni: { nazwa: 'Pieśni', atrybut: 'wola', czarnaMagia: false },
  powietrze: { nazwa: 'Powietrze', atrybut: 'wola', czarnaMagia: false },
  przemiany: { nazwa: 'Przemiany', atrybut: 'wola', czarnaMagia: false },
  teurgia: { nazwa: 'Teurgia', atrybut: 'wola', czarnaMagia: false },
  magia_niebianska: { nazwa: 'Magia Niebiańska', atrybut: 'wola', czarnaMagia: false },
  transformacja: { nazwa: 'Transformacja', atrybut: 'wola', czarnaMagia: false },
  woda: { nazwa: 'Woda', atrybut: 'wola', czarnaMagia: false },
  ziemia: { nazwa: 'Ziemia', atrybut: 'wola', czarnaMagia: false },
  zniszczenie: { nazwa: 'Zniszczenie', atrybut: 'wola', czarnaMagia: false },
  zycie: { nazwa: 'Życie', atrybut: 'wola', czarnaMagia: false },

  // --- Suplementy - klasyfikacja najlepszej wiedzy (brak analogicznej tabeli źródłowej) ---
  magia_fey: { nazwa: 'Magia Fey', atrybut: 'intelekt', czarnaMagia: false, zrodlo: 'SP' },
  spirytyzm: { nazwa: 'Spirytyzm', atrybut: 'wola', czarnaMagia: false, zrodlo: 'SUP' },
  smierc: { nazwa: 'Śmierć', atrybut: 'intelekt', czarnaMagia: true, zrodlo: 'SUP' },
  telepatia: { nazwa: 'Telepatia', atrybut: 'intelekt', czarnaMagia: false, zrodlo: 'SUP' },
  alchemia: { nazwa: 'Alchemia', atrybut: 'intelekt', czarnaMagia: false, zrodlo: 'SUP' },
  cien: { nazwa: 'Cień', atrybut: 'intelekt', czarnaMagia: true, zrodlo: 'GWP', realTradycja: false },
  demonologia: { nazwa: 'Demonologia', atrybut: 'wola', czarnaMagia: true, zrodlo: 'GWP' },
  magia_krwi: { nazwa: 'Magia Krwi', atrybut: 'intelekt', czarnaMagia: true, zrodlo: 'GP' },
  telekineza: { nazwa: 'Telekineza', atrybut: 'intelekt', czarnaMagia: false, zrodlo: 'SUP', realTradycja: false },

  // --- Wpisy path-locked (jedno zaklęcie ściśle powiązane z konkretną ścieżką,
  // nie samodzielna tradycja) - wyłączone z wyboru nowej tradycji ---
  diabolista: { nazwa: 'Diabolista', atrybut: 'wola', czarnaMagia: true, zrodlo: 'RA', realTradycja: false },
  kleryk: { nazwa: 'Kleryk', atrybut: 'wola', czarnaMagia: false, zrodlo: 'NW', realTradycja: false },
  spaczeniec: { nazwa: 'Spaczeniec', atrybut: 'wola', czarnaMagia: true, zrodlo: 'GP', realTradycja: false },
  opiekun: { nazwa: 'Opiekun', atrybut: 'wola', czarnaMagia: false, zrodlo: 'SUP', realTradycja: false },
  szaman: { nazwa: 'Szaman', atrybut: 'wola', czarnaMagia: false, zrodlo: 'SUP', realTradycja: false }
};

/** Tradycje religijne (PG str. 58, tabela "Tradycje religijne") - używane, gdy ścieżka
 * (Kleryk/Kapłan/Paladyn/Wyrocznia) ogranicza wybór nowej tradycji do religijnych.
 * Uproszczenie: aplikacja nie śledzi osobno wybranej religii, więc pokazuje unię
 * tradycji ze wszystkich czterech religii. */
const TRADYCJE_RELIGIJNE = ['magia_niebianska', 'teurgia', 'zycie', 'magia_bitewna', 'ziemia', 'natura', 'magia_pierwotna', 'klatwy', 'uroki'];

/** Zwraca listę id tradycji, które są prawdziwymi, samodzielnie poznawalnymi tradycjami. */
function pobierzListePoznawalnychTradycji() {
  return Object.entries(TRADYCJE)
    .filter(([, t]) => t.realTradycja !== false)
    .map(([id]) => id);
}

export { TRADYCJE, TRADYCJE_RELIGIJNE, pobierzListePoznawalnychTradycji };
