/**
 * Pełny katalog przedmiotów dostępnych w grze - broń, zbroje, ekwipunek
 * ogólny, narzędzia, ubiory, żywność, zwierzęta, eliksiry i substancje
 * alchemiczne. Źródło: Podręcznik Główny (Rozdział 6: Ekwipunek) oraz
 * Suplement Władcy Demonów (jedyny dodatek zawierający własny cennik -
 * pozostałe pięć dodatków [Niepewna Wiara, Rozkoszna Agonia, Straszliwe
 * Piękno, Głód w Pustce, Grobowce Pustkowia] nie wprowadza nowego,
 * kupowalnego ekwipunku).
 *
 * Cena (`cena`) jest zawsze wyrażona w najmniejszej sensownej jednostce
 * podanej w źródle: `jednostka` to 'okr' (okrawek), 'md' (miedziak),
 * 'sr' (srebrnik) lub 'zk' (złota korona), z przelicznikiem 10 okrawków =
 * 1 miedziak, 10 miedziaków = 1 srebrnik, 10 srebrników = 1 złota korona
 * (PG, "Ceny"). `orientacyjna: true` oznacza cenę zapisaną w źródle jako
 * "min. X" - dolną granicę ustaloną przez MG zależnie od konkretnego
 * przedmiotu (np. instrumentu muzycznego).
 *
 * Świadomie pominięte jako spoza zakresu osobistego ekwipunku startowego:
 * pojazdy ze statystykami bojowymi, nieruchomości, najemnicy i konstrukty
 * (to zasoby kampanii/MG, nie przedmioty do noszenia przy sobie).
 */

const EQUIPMENT = [
  // ===== BROŃ - prosta broń biała (PG str. 106) =====
  { id: 'atak_bez_broni', nazwa: 'Atak bez broni', kategoria: 'bron_biala', podkategoria: 'prosta', obrazenia: '1', chwyt: 'Dowolny', wlasciwosci: 'Finezyjna', cena: null, rzadkosc: null, zrodlo: 'PG', strona_zrodlowa: 106 },
  { id: 'kostur', nazwa: 'Kostur', kategoria: 'bron_biala', podkategoria: 'prosta', obrazenia: '1k6 + 1', chwyt: 'Dwuręczny', wlasciwosci: 'Finezyjna', cena: { wartosc: 5, jednostka: 'md' }, rzadkosc: 'pospolity', zrodlo: 'PG', strona_zrodlowa: 106 },
  { id: 'mlotek_lub_siekiera', nazwa: 'Młotek lub siekiera', kategoria: 'bron_biala', podkategoria: 'prosta', obrazenia: '1k3', chwyt: 'Dowolny', wlasciwosci: 'Miotana, zasięg (bliski)', cena: { wartosc: 1, jednostka: 'sr' }, rzadkosc: 'pospolity', zrodlo: 'PG', strona_zrodlowa: 106 },
  { id: 'noz_lub_sztylet', nazwa: 'Nóż lub sztylet', kategoria: 'bron_biala', podkategoria: 'prosta', obrazenia: '1k3', chwyt: 'Dowolny', wlasciwosci: 'Finezyjna, miotana, zasięg (bliski)', cena: { wartosc: 5, jednostka: 'md' }, rzadkosc: 'pospolity', zrodlo: 'PG', strona_zrodlowa: 106 },
  { id: 'oszczep', nazwa: 'Oszczep', kategoria: 'bron_biala', podkategoria: 'prosta', obrazenia: '1k3', chwyt: 'Jednoręczny', wlasciwosci: 'Finezyjna, miotana, zasięg (średni)', cena: { wartosc: 1, jednostka: 'sr' }, rzadkosc: 'pospolity', zrodlo: 'PG', strona_zrodlowa: 106 },
  { id: 'palka', nazwa: 'Pałka', kategoria: 'bron_biala', podkategoria: 'prosta', obrazenia: '1k6', chwyt: 'Jednoręczny', wlasciwosci: '', cena: { wartosc: 5, jednostka: 'md' }, rzadkosc: 'pospolity', zrodlo: 'PG', strona_zrodlowa: 106 },
  { id: 'sierp_lub_wlocznia_prosta', nazwa: 'Sierp lub włócznia', kategoria: 'bron_biala', podkategoria: 'prosta', obrazenia: '1k6', chwyt: 'Jednoręczny', wlasciwosci: 'Finezyjna', cena: { wartosc: 1, jednostka: 'sr' }, rzadkosc: 'pospolity', zrodlo: 'PG', strona_zrodlowa: 106 },
  { id: 'strzalka_bron', nazwa: 'Strzałka', kategoria: 'bron_biala', podkategoria: 'prosta', obrazenia: '1', chwyt: 'Dowolny', wlasciwosci: 'Finezyjna, miotana, zasięg (bliski)', cena: { wartosc: 1, jednostka: 'md' }, rzadkosc: 'pospolity', zrodlo: 'PG', strona_zrodlowa: 106 },
  { id: 'topor_prosty', nazwa: 'Topór', kategoria: 'bron_biala', podkategoria: 'prosta', obrazenia: '1k6 + 1', chwyt: 'Jednoręczny', wlasciwosci: '', cena: { wartosc: 1, jednostka: 'sr' }, rzadkosc: 'pospolity', zrodlo: 'PG', strona_zrodlowa: 106 },

  // ===== BROŃ - dystansowa (PG str. 106) =====
  { id: 'dlugi_luk', nazwa: 'Długi łuk', kategoria: 'bron_dystansowa', obrazenia: '1k6 + 1', chwyt: 'Dwuręczny', wlasciwosci: 'Rozmiar 1, używa strzał, zasięg (daleki)', wymagania: 'min. 9 Siły', cena: { wartosc: 1, jednostka: 'zk' }, rzadkosc: 'niepospolity', zrodlo: 'PG', strona_zrodlowa: 106 },
  { id: 'dmuchawka', nazwa: 'Dmuchawka', kategoria: 'bron_dystansowa', obrazenia: '1k3', chwyt: 'Jednoręczny', wlasciwosci: 'Używa igieł, zasięg (średni)', cena: { wartosc: 1, jednostka: 'sr' }, rzadkosc: 'niepospolity', zrodlo: 'PG', strona_zrodlowa: 106 },
  { id: 'flinta', nazwa: 'Flinta', kategoria: 'bron_dystansowa', obrazenia: '3k6', chwyt: 'Dwuręczny', wlasciwosci: 'Niewypał, przeładowanie, używa kul, zasięg (daleki)', cena: { wartosc: 10, jednostka: 'zk' }, rzadkosc: 'egzotyczny', zrodlo: 'PG', strona_zrodlowa: 106 },
  { id: 'kusza', nazwa: 'Kusza', kategoria: 'bron_dystansowa', obrazenia: '2k6', chwyt: 'Dwuręczny', wlasciwosci: 'Przeładowanie, używa bełtów, zasięg (daleki)', cena: { wartosc: 1, jednostka: 'zk' }, rzadkosc: 'pospolity', zrodlo: 'PG', strona_zrodlowa: 106 },
  { id: 'luk', nazwa: 'Łuk', kategoria: 'bron_dystansowa', obrazenia: '1k6', chwyt: 'Dwuręczny', wlasciwosci: 'Używa strzał, zasięg (daleki)', cena: { wartosc: 5, jednostka: 'sr' }, rzadkosc: 'pospolity', zrodlo: 'PG', strona_zrodlowa: 106 },
  { id: 'kusza_pistoletowa', nazwa: 'Kusza pistoletowa', kategoria: 'bron_dystansowa', obrazenia: '1k6', chwyt: 'Dowolny', wlasciwosci: 'Przeładowanie, używa bełtów, zasięg (bliski)', cena: { wartosc: 2, jednostka: 'zk' }, rzadkosc: 'rzadki', zrodlo: 'PG', strona_zrodlowa: 106 },
  { id: 'pistolet', nazwa: 'Pistolet', kategoria: 'bron_dystansowa', obrazenia: '2k6', chwyt: 'Dowolny', wlasciwosci: 'Niewypał, przeładowanie, używa kul, zasięg (średni)', cena: { wartosc: 5, jednostka: 'zk' }, rzadkosc: 'egzotyczny', zrodlo: 'PG', strona_zrodlowa: 106 },
  { id: 'proca', nazwa: 'Proca', kategoria: 'bron_dystansowa', obrazenia: '1k3', chwyt: 'Dowolny', wlasciwosci: 'Używa kamieni, zasięg (średni)', cena: { wartosc: 5, jednostka: 'md' }, rzadkosc: 'pospolity', zrodlo: 'PG', strona_zrodlowa: 106 },

  // ===== TARCZE (PG str. 106) =====
  { id: 'mala_tarcza', nazwa: 'Mała tarcza', kategoria: 'tarcze', obrazenia: '1', chwyt: 'Dowolny', wlasciwosci: 'Defensywna +1', wymagania: 'min. 9 Siły', cena: { wartosc: 5, jednostka: 'md' }, rzadkosc: 'pospolity', zrodlo: 'PG', strona_zrodlowa: 106 },
  { id: 'duza_tarcza', nazwa: 'Duża tarcza', kategoria: 'tarcze', obrazenia: '1k3', chwyt: 'Dowolny', wlasciwosci: 'Defensywna +2, Rozmiar 1', wymagania: 'min. 11 Siły', cena: { wartosc: 1, jednostka: 'sr' }, rzadkosc: 'pospolity', zrodlo: 'PG', strona_zrodlowa: 106 },

  // ===== BROŃ - wojskowa biała (PG str. 106, min. 11 Siły) =====
  { id: 'bulawa', nazwa: 'Buława', kategoria: 'bron_biala', podkategoria: 'wojskowa', obrazenia: '1k6', chwyt: 'Dowolny', wlasciwosci: '', wymagania: 'min. 11 Siły', cena: { wartosc: 5, jednostka: 'sr' }, rzadkosc: 'pospolity', zrodlo: 'PG', strona_zrodlowa: 106 },
  { id: 'glewia_halabarda_berdysz', nazwa: 'Glewia, halabarda lub berdysz', kategoria: 'bron_biala', podkategoria: 'wojskowa', obrazenia: '1k6 + 2', chwyt: 'Dwuręczny', wlasciwosci: 'Dalekosiężna +1', wymagania: 'min. 11 Siły', cena: { wartosc: 1, jednostka: 'zk' }, rzadkosc: 'niepospolity', zrodlo: 'PG', strona_zrodlowa: 106 },
  { id: 'lanca', nazwa: 'Lanca', kategoria: 'bron_biala', podkategoria: 'wojskowa', obrazenia: '1k6 + 1', chwyt: 'Dwuręczny', wlasciwosci: 'Dalekosiężna +2, jednoręczna w czasie jazdy wierzchem', wymagania: 'min. 11 Siły', cena: { wartosc: 5, jednostka: 'sr' }, rzadkosc: 'niepospolity', zrodlo: 'PG', strona_zrodlowa: 106 },
  { id: 'miecz_dlugi_mlot_bojowy_wojskowy', nazwa: 'Miecz długi lub młot bojowy (dwuręczny)', kategoria: 'bron_biala', podkategoria: 'wojskowa', obrazenia: '2k6', chwyt: 'Dwuręczny', wlasciwosci: 'Nieporęczna', wymagania: 'min. 11 Siły', cena: { wartosc: 1, jednostka: 'zk' }, rzadkosc: 'rzadki', zrodlo: 'PG', strona_zrodlowa: 106 },
  { id: 'pika', nazwa: 'Pika', kategoria: 'bron_biala', podkategoria: 'wojskowa', obrazenia: '1k6', chwyt: 'Dwuręczny', wlasciwosci: 'Dalekosiężna +2, Rozmiar 1', wymagania: 'min. 11 Siły', cena: { wartosc: 5, jednostka: 'sr' }, rzadkosc: 'niepospolity', zrodlo: 'PG', strona_zrodlowa: 106 },
  { id: 'topor_bojowy_korbacz_itp', nazwa: 'Topór bojowy, korbacz, morgensztern, nadziak lub miecz', kategoria: 'bron_biala', podkategoria: 'wojskowa', obrazenia: '1k6 + 2', chwyt: 'Jednoręczny', wlasciwosci: '', wymagania: 'min. 11 Siły', cena: { wartosc: 5, jednostka: 'sr' }, rzadkosc: 'niepospolity', zrodlo: 'PG', strona_zrodlowa: 106 },
  { id: 'trojzab', nazwa: 'Trójząb', kategoria: 'bron_biala', podkategoria: 'wojskowa', obrazenia: '1k6', chwyt: 'Jednoręczny', wlasciwosci: 'Miotana, zasięg (bliski)', wymagania: 'min. 11 Siły', cena: { wartosc: 5, jednostka: 'sr' }, rzadkosc: 'niepospolity', zrodlo: 'PG', strona_zrodlowa: 106 },
  { id: 'wlocznia_wojskowa', nazwa: 'Włócznia (wojskowa)', kategoria: 'bron_biala', podkategoria: 'wojskowa', obrazenia: '1k6', chwyt: 'Jednoręczny', wlasciwosci: 'Finezyjna, miotana, zasięg (bliski)', wymagania: 'min. 11 Siły', cena: { wartosc: 1, jednostka: 'sr' }, rzadkosc: 'pospolity', zrodlo: 'PG', strona_zrodlowa: 106 },

  // ===== BROŃ - szybka biała (PG str. 106, min. 11 Siły lub Zręczności) =====
  { id: 'bicz', nazwa: 'Bicz', kategoria: 'bron_biala', podkategoria: 'szybka', obrazenia: '1k3', chwyt: 'Dowolny', wlasciwosci: 'Dalekosiężna +1, finezyjna', wymagania: 'min. 11 Siły lub Zręczności', cena: { wartosc: 5, jednostka: 'sr' }, rzadkosc: 'niepospolity', zrodlo: 'PG', strona_zrodlowa: 106 },
  { id: 'lancuch_kordelas_nóz_kanczug_krotki_miecz', nazwa: 'Łańcuch, kordelas, długi nóż, kańczug lub krótki miecz', kategoria: 'bron_biala', podkategoria: 'szybka', obrazenia: '1k6', chwyt: 'Dowolny', wlasciwosci: 'Finezyjna', wymagania: 'min. 11 Siły lub Zręczności', cena: { wartosc: 5, jednostka: 'sr' }, rzadkosc: 'niepospolity', zrodlo: 'PG', strona_zrodlowa: 106 },
  { id: 'rapier_szabla_bulat', nazwa: 'Rapier, szabla lub bułat', kategoria: 'bron_biala', podkategoria: 'szybka', obrazenia: '1k6 + 1', chwyt: 'Jednoręczny', wlasciwosci: 'Finezyjna', wymagania: 'min. 11 Siły lub Zręczności', cena: { wartosc: 1, jednostka: 'zk' }, rzadkosc: 'niepospolity', zrodlo: 'PG', strona_zrodlowa: 106 },

  // ===== BROŃ - ciężka biała (PG str. 106, min. 13 Siły) =====
  { id: 'dworeczny_miecz_topor_mlot', nazwa: 'Dwuręczny miecz, dwuręczny topór lub dwuręczny młot', kategoria: 'bron_biala', podkategoria: 'ciezka', obrazenia: '3k6', chwyt: 'Dwuręczny', wlasciwosci: 'Nieporęczna', wymagania: 'min. 13 Siły', cena: { wartosc: 2, jednostka: 'zk' }, rzadkosc: 'rzadki', zrodlo: 'PG', strona_zrodlowa: 106 },
  { id: 'miecz_dlugi_mlot_bojowy_ciezki', nazwa: 'Miecz długi lub młot bojowy (jednoręczny)', kategoria: 'bron_biala', podkategoria: 'ciezka', obrazenia: '2k6', chwyt: 'Jednoręczny', wlasciwosci: 'Nieporęczna', wymagania: 'min. 13 Siły', cena: { wartosc: 1, jednostka: 'zk' }, rzadkosc: 'rzadki', zrodlo: 'PG', strona_zrodlowa: 106 },

  // ===== AMUNICJA (PG str. 107) =====
  { id: 'belty', nazwa: 'Bełty (5)', kategoria: 'amunicja', cena: { wartosc: 5, jednostka: 'md' }, rzadkosc: null, zrodlo: 'PG', strona_zrodlowa: 107 },
  { id: 'czarny_proch_i_kule', nazwa: 'Czarny proch i kule (5)', kategoria: 'amunicja', cena: { wartosc: 1, jednostka: 'sr' }, rzadkosc: null, zrodlo: 'PG', strona_zrodlowa: 107 },
  { id: 'kamienie_amunicja', nazwa: 'Kamienie (5)', kategoria: 'amunicja', cena: { wartosc: 5, jednostka: 'md' }, rzadkosc: null, zrodlo: 'PG', strona_zrodlowa: 107 },
  { id: 'strzalki_amunicja', nazwa: 'Strzałki (5)', kategoria: 'amunicja', cena: { wartosc: 5, jednostka: 'md' }, rzadkosc: null, zrodlo: 'PG', strona_zrodlowa: 107 },
  { id: 'strzaly', nazwa: 'Strzały (5)', kategoria: 'amunicja', cena: { wartosc: 5, jednostka: 'md' }, rzadkosc: null, zrodlo: 'PG', strona_zrodlowa: 107 },

  // ===== UBIÓR I PANCERZ (PG str. 105) =====
  { id: 'odziez_pancerz', nazwa: 'Odzież', kategoria: 'zbroje', obrona: 'Zręczność', wymagania: 'brak wymagań', cena: null, rzadkosc: 'pospolity', opis: 'Cena różna - zob. kategorię "Ubiór i akcesoria".', zrodlo: 'PG', strona_zrodlowa: 105 },
  { id: 'miekka_skorznia', nazwa: 'Miękka skórznia', kategoria: 'zbroje', obrona: 'Zręczność + 1', wymagania: 'brak wymagań', cena: null, rzadkosc: 'pospolity', zrodlo: 'PG', strona_zrodlowa: 105 },
  { id: 'utwardzana_skorznia', nazwa: 'Utwardzana skórznia', kategoria: 'zbroje', podkategoria: 'lekki', obrona: 'Zręczność + 2', wymagania: 'min. 11 Siły', cena: { wartosc: 5, jednostka: 'sr' }, rzadkosc: 'pospolity', zrodlo: 'PG', strona_zrodlowa: 105 },
  { id: 'brygantyna', nazwa: 'Brygantyna', kategoria: 'zbroje', podkategoria: 'lekki', obrona: '13', wymagania: 'min. 11 Siły', cena: { wartosc: 5, jednostka: 'sr' }, rzadkosc: 'pospolity', zrodlo: 'PG', strona_zrodlowa: 105 },
  { id: 'kolczuga', nazwa: 'Kolczuga', kategoria: 'zbroje', podkategoria: 'sredni', obrona: '15', wymagania: 'min. 13 Siły', cena: { wartosc: 1, jednostka: 'zk' }, rzadkosc: 'niepospolity', zrodlo: 'PG', strona_zrodlowa: 105 },
  { id: 'zbroja_luskowa', nazwa: 'Zbroja łuskowa', kategoria: 'zbroje', podkategoria: 'sredni', obrona: '16', wymagania: 'min. 13 Siły', cena: { wartosc: 2, jednostka: 'zk' }, rzadkosc: 'niepospolity', zrodlo: 'PG', strona_zrodlowa: 105 },
  { id: 'bechter', nazwa: 'Bechter', kategoria: 'zbroje', podkategoria: 'ciezki', obrona: '17', wymagania: 'min. 15 Siły', cena: { wartosc: 5, jednostka: 'zk' }, rzadkosc: 'rzadki', zrodlo: 'PG', strona_zrodlowa: 105 },
  { id: 'pelna_zbroja_plytowa', nazwa: 'Pełna zbroja płytowa', kategoria: 'zbroje', podkategoria: 'ciezki', obrona: '18', wymagania: 'min. 15 Siły', cena: { wartosc: 25, jednostka: 'zk' }, rzadkosc: 'egzotyczny', zrodlo: 'PG', strona_zrodlowa: 105 },

  // ===== WYPOSAŻENIE (PG str. 108-109) =====
  { id: 'beczka', nazwa: 'Beczka', kategoria: 'wyposazenie', cena: { wartosc: 2, jednostka: 'md' }, rzadkosc: 'pospolity', zrodlo: 'PG', strona_zrodlowa: 108 },
  { id: 'buklak', nazwa: 'Bukłak', kategoria: 'wyposazenie', cena: { wartosc: 1, jednostka: 'md' }, rzadkosc: 'pospolity', zrodlo: 'PG', strona_zrodlowa: 108 },
  { id: 'fajka', nazwa: 'Fajka', kategoria: 'wyposazenie', cena: { wartosc: 2, jednostka: 'md' }, rzadkosc: 'niepospolity', zrodlo: 'PG', strona_zrodlowa: 108 },
  { id: 'flaszka', nazwa: 'Flaszka', kategoria: 'wyposazenie', cena: { wartosc: 1, jednostka: 'md' }, rzadkosc: 'pospolity', zrodlo: 'PG', strona_zrodlowa: 108 },
  { id: 'flaszka_oleju', nazwa: 'Flaszka oleju', kategoria: 'wyposazenie', cena: { wartosc: 1, jednostka: 'md' }, rzadkosc: 'pospolity', opis: 'Można nią zaatakować, rzucając w stworzenie lub obiekt w średnim zasięgu - trafienie oblewa cel olejem, który zapala się i zadaje obrażenia od ognia/elektryczności.', zrodlo: 'PG', strona_zrodlowa: 107 },
  { id: 'garnek', nazwa: 'Garnek', kategoria: 'wyposazenie', cena: { wartosc: 1, jednostka: 'md' }, rzadkosc: 'pospolity', zrodlo: 'PG', strona_zrodlowa: 108 },
  { id: 'kolec_zelazny', nazwa: 'Kolec, duży, żelazny', kategoria: 'wyposazenie', cena: { wartosc: 1, jednostka: 'md' }, rzadkosc: 'pospolity', zrodlo: 'PG', strona_zrodlowa: 108 },
  { id: 'hak', nazwa: 'Hak', kategoria: 'wyposazenie', cena: { wartosc: 1, jednostka: 'md' }, rzadkosc: 'niepospolity', zrodlo: 'PG', strona_zrodlowa: 108 },
  { id: 'hubka_i_krzesiwo', nazwa: 'Hubka i krzesiwo', kategoria: 'wyposazenie', cena: { wartosc: 1, jednostka: 'md' }, rzadkosc: 'pospolity', zrodlo: 'PG', strona_zrodlowa: 108 },
  { id: 'kajdany', nazwa: 'Kajdany', kategoria: 'wyposazenie', cena: { wartosc: 5, jednostka: 'md' }, rzadkosc: 'niepospolity', zrodlo: 'PG', strona_zrodlowa: 108 },
  { id: 'kasetka_na_zwoje', nazwa: 'Kasetka na zwoje', kategoria: 'wyposazenie', cena: { wartosc: 2, jednostka: 'md' }, rzadkosc: 'niepospolity', zrodlo: 'PG', strona_zrodlowa: 108 },
  { id: 'kij_trzymetrowy', nazwa: 'Kij, trzymetrowy', kategoria: 'wyposazenie', cena: { wartosc: 1, jednostka: 'md' }, rzadkosc: 'pospolity', zrodlo: 'PG', strona_zrodlowa: 108 },
  { id: 'koc', nazwa: 'Koc', kategoria: 'wyposazenie', cena: { wartosc: 1, jednostka: 'md' }, rzadkosc: 'pospolity', zrodlo: 'PG', strona_zrodlowa: 108 },
  { id: 'kolczan', nazwa: 'Kołczan lub kasetka na bełty', kategoria: 'wyposazenie', cena: { wartosc: 5, jednostka: 'okr' }, rzadkosc: 'pospolity', zrodlo: 'PG', strona_zrodlowa: 108 },
  { id: 'kosci_do_gry', nazwa: 'Kości do gry', kategoria: 'wyposazenie', cena: { wartosc: 2, jednostka: 'okr' }, rzadkosc: 'niepospolity', zrodlo: 'PG', strona_zrodlowa: 108 },
  { id: 'latarnia', nazwa: 'Latarnia', kategoria: 'wyposazenie', cena: { wartosc: 1, jednostka: 'sr' }, rzadkosc: 'niepospolity', opis: 'Zapalona oświetla obszar o promieniu 10 metrów. Napełniona całą flaszką oleju pali się przez 4 godziny.', zrodlo: 'PG', strona_zrodlowa: 107 },
  { id: 'lina_zwoj', nazwa: 'Lina, zwój (20 m)', kategoria: 'wyposazenie', cena: { wartosc: 1, jednostka: 'md' }, rzadkosc: 'niepospolity', zrodlo: 'PG', strona_zrodlowa: 108 },
  { id: 'lusterko_srebrne', nazwa: 'Lusterko, małe, srebrne', kategoria: 'wyposazenie', cena: { wartosc: 1, jednostka: 'sr' }, rzadkosc: 'rzadki', zrodlo: 'PG', strona_zrodlowa: 108 },
  { id: 'mapa', nazwa: 'Mapa', kategoria: 'wyposazenie', cena: { wartosc: 1, jednostka: 'sr' }, rzadkosc: 'niepospolity', zrodlo: 'PG', strona_zrodlowa: 108 },
  { id: 'mlotek_i_kliny', nazwa: 'Młotek i 10 klinów', kategoria: 'wyposazenie', cena: { wartosc: 1, jednostka: 'md' }, rzadkosc: 'niepospolity', zrodlo: 'PG', strona_zrodlowa: 108 },
  { id: 'namiot', nazwa: 'Namiot, dwuosobowy', kategoria: 'wyposazenie', cena: { wartosc: 5, jednostka: 'md' }, rzadkosc: 'niepospolity', zrodlo: 'PG', strona_zrodlowa: 108 },
  { id: 'plecak', nazwa: 'Plecak', kategoria: 'wyposazenie', cena: { wartosc: 1, jednostka: 'md' }, rzadkosc: 'pospolity', zrodlo: 'PG', strona_zrodlowa: 108 },
  { id: 'pochodnia', nazwa: 'Pochodnia', kategoria: 'wyposazenie', cena: { wartosc: 5, jednostka: 'okr' }, rzadkosc: 'pospolity', zrodlo: 'PG', strona_zrodlowa: 108 },
  { id: 'pudelko_cygar', nazwa: 'Pudełko cygar', kategoria: 'wyposazenie', cena: { wartosc: 1, jednostka: 'md', orientacyjna: true }, rzadkosc: 'pospolity', zrodlo: 'PG', strona_zrodlowa: 108 },
  { id: 'pudelko_metalowe', nazwa: 'Pudełko, metalowe', kategoria: 'wyposazenie', cena: { wartosc: 5, jednostka: 'md' }, rzadkosc: 'niepospolity', zrodlo: 'PG', strona_zrodlowa: 108 },
  { id: 'racje_na_tydzien', nazwa: 'Racje na tydzień', kategoria: 'wyposazenie', cena: { wartosc: 1, jednostka: 'md' }, rzadkosc: 'pospolity', zrodlo: 'PG', strona_zrodlowa: 108 },
  { id: 'reflektor', nazwa: 'Reflektor', kategoria: 'wyposazenie', cena: { wartosc: 5, jednostka: 'sr' }, rzadkosc: 'niepospolity', opis: 'Zapalony oświetla stożkowy obszar o długości 20 metrów. Napełniony całą flaszką oleju pali się przez 4 godziny.', zrodlo: 'PG', strona_zrodlowa: 108 },
  { id: 'sakiewka', nazwa: 'Sakiewka', kategoria: 'wyposazenie', cena: { wartosc: 1, jednostka: 'md' }, rzadkosc: 'pospolity', zrodlo: 'PG', strona_zrodlowa: 108 },
  { id: 'skrzynia_drewniana', nazwa: 'Skrzynia, drewniana', kategoria: 'wyposazenie', cena: { wartosc: 4, jednostka: 'md' }, rzadkosc: 'niepospolity', zrodlo: 'PG', strona_zrodlowa: 108 },
  { id: 'sztucce', nazwa: 'Sztućce', kategoria: 'wyposazenie', cena: { wartosc: 5, jednostka: 'okr' }, rzadkosc: 'niepospolity', zrodlo: 'PG', strona_zrodlowa: 108 },
  { id: 'spiwor', nazwa: 'Śpiwór', kategoria: 'wyposazenie', cena: { wartosc: 2, jednostka: 'md' }, rzadkosc: 'pospolity', zrodlo: 'PG', strona_zrodlowa: 108 },
  { id: 'swieca', nazwa: 'Świeca', kategoria: 'wyposazenie', cena: { wartosc: 1, jednostka: 'okr' }, rzadkosc: 'niepospolity', opis: 'Zapalona oświetla obszar o promieniu 1 metra; pali się przez 1 godzinę.', zrodlo: 'PG', strona_zrodlowa: 108 },
  { id: 'talia_kart', nazwa: 'Talia kart', kategoria: 'wyposazenie', cena: { wartosc: 3, jednostka: 'okr' }, rzadkosc: 'niepospolity', zrodlo: 'PG', strona_zrodlowa: 108 },
  { id: 'tyton_do_fajki', nazwa: 'Tytoń do fajki', kategoria: 'wyposazenie', cena: { wartosc: 1, jednostka: 'md', orientacyjna: true }, rzadkosc: 'pospolity', zrodlo: 'PG', strona_zrodlowa: 108 },
  { id: 'worek', nazwa: 'Worek', kategoria: 'wyposazenie', cena: { wartosc: 5, jednostka: 'okr' }, rzadkosc: 'pospolity', zrodlo: 'PG', strona_zrodlowa: 108 },
  { id: 'zapalki', nazwa: 'Zapałki', kategoria: 'wyposazenie', cena: { wartosc: 1, jednostka: 'md' }, rzadkosc: 'egzotyczny', opis: 'Zapalona zapałka rozprasza ciemność w promieniu 1 metra przez 1 rundę.', zrodlo: 'PG', strona_zrodlowa: 108 },
  { id: 'zestaw_podroznika', nazwa: 'Zestaw podróżnika', kategoria: 'wyposazenie', cena: { wartosc: 1, jednostka: 'sr' }, rzadkosc: 'pospolity', opis: 'Zawiera plecak, śpiwór, sztućce, hubkę i krzesiwo, 3 pochodnie, zwój liny (20 metrów), hak, racje żywnościowe na tydzień oraz bukłak z wodą.', zrodlo: 'PG', strona_zrodlowa: 109 },

  // ===== UBIÓR I AKCESORIA (PG str. 109) =====
  { id: 'bizuteria', nazwa: 'Biżuteria', kategoria: 'ubior', cena: { wartosc: 1, jednostka: 'sr', orientacyjna: true }, rzadkosc: 'rzadki', zrodlo: 'PG', strona_zrodlowa: 109 },
  { id: 'buty_dobrej_jakosci', nazwa: 'Buty dobrej jakości', kategoria: 'ubior', cena: { wartosc: 2, jednostka: 'sr' }, rzadkosc: 'rzadki', zrodlo: 'PG', strona_zrodlowa: 109 },
  { id: 'buty_skorzane', nazwa: 'Buty, skórzane', kategoria: 'ubior', cena: { wartosc: 2, jednostka: 'md' }, rzadkosc: 'pospolity', zrodlo: 'PG', strona_zrodlowa: 109 },
  { id: 'cylinder', nazwa: 'Cylinder', kategoria: 'ubior', cena: { wartosc: 8, jednostka: 'md' }, rzadkosc: 'niepospolity', zrodlo: 'PG', strona_zrodlowa: 109 },
  { id: 'czapka', nazwa: 'Czapka', kategoria: 'ubior', cena: { wartosc: 5, jednostka: 'okr' }, rzadkosc: 'pospolity', zrodlo: 'PG', strona_zrodlowa: 109 },
  { id: 'czapka_dobrej_jakosci', nazwa: 'Czapka dobrej jakości', kategoria: 'ubior', cena: { wartosc: 1, jednostka: 'sr' }, rzadkosc: 'rzadki', zrodlo: 'PG', strona_zrodlowa: 109 },
  { id: 'formalny_stroj_na_miare', nazwa: 'Formalny strój, szyty na miarę', kategoria: 'ubior', cena: { wartosc: 4, jednostka: 'sr' }, rzadkosc: 'niepospolity', zrodlo: 'PG', strona_zrodlowa: 109 },
  { id: 'formalny_stroj_uzywany', nazwa: 'Formalny strój, używany', kategoria: 'ubior', cena: { wartosc: 1, jednostka: 'sr' }, rzadkosc: 'niepospolity', zrodlo: 'PG', strona_zrodlowa: 109 },
  { id: 'kamizelka', nazwa: 'Kamizelka', kategoria: 'ubior', cena: { wartosc: 3, jednostka: 'md' }, rzadkosc: 'pospolity', zrodlo: 'PG', strona_zrodlowa: 109 },
  { id: 'kapelusz_damski', nazwa: 'Kapelusz, damski', kategoria: 'ubior', cena: { wartosc: 1, jednostka: 'sr' }, rzadkosc: 'niepospolity', zrodlo: 'PG', strona_zrodlowa: 109 },
  { id: 'kostium_wyszukany', nazwa: 'Kostium, wyszukany', kategoria: 'ubior', cena: { wartosc: 5, jednostka: 'sr', orientacyjna: true }, rzadkosc: 'rzadki', zrodlo: 'PG', strona_zrodlowa: 109 },
  { id: 'kostium_prosty', nazwa: 'Kostium, prosty', kategoria: 'ubior', cena: { wartosc: 5, jednostka: 'md' }, rzadkosc: 'niepospolity', zrodlo: 'PG', strona_zrodlowa: 109 },
  { id: 'koszula', nazwa: 'Koszula', kategoria: 'ubior', cena: { wartosc: 1, jednostka: 'md' }, rzadkosc: 'pospolity', zrodlo: 'PG', strona_zrodlowa: 109 },
  { id: 'koszula_wysokiej_jakosci', nazwa: 'Koszula wysokiej jakości', kategoria: 'ubior', cena: { wartosc: 1, jednostka: 'sr', orientacyjna: true }, rzadkosc: 'rzadki', zrodlo: 'PG', strona_zrodlowa: 109 },
  { id: 'kurtka_lekka', nazwa: 'Kurtka, lekka', kategoria: 'ubior', cena: { wartosc: 5, jednostka: 'md' }, rzadkosc: 'pospolity', zrodlo: 'PG', strona_zrodlowa: 109 },
  { id: 'mundur', nazwa: 'Mundur', kategoria: 'ubior', cena: { wartosc: 5, jednostka: 'md' }, rzadkosc: 'niepospolity', zrodlo: 'PG', strona_zrodlowa: 109 },
  { id: 'okulary', nazwa: 'Okulary', kategoria: 'ubior', cena: { wartosc: 5, jednostka: 'sr' }, rzadkosc: 'rzadki', zrodlo: 'PG', strona_zrodlowa: 109 },
  { id: 'palto', nazwa: 'Palto', kategoria: 'ubior', cena: { wartosc: 1, jednostka: 'sr' }, rzadkosc: 'niepospolity', zrodlo: 'PG', strona_zrodlowa: 109 },
  { id: 'pas_ubior', nazwa: 'Pas', kategoria: 'ubior', cena: { wartosc: 1, jednostka: 'md' }, rzadkosc: 'pospolity', zrodlo: 'PG', strona_zrodlowa: 109 },
  { id: 'peleryna', nazwa: 'Peleryna', kategoria: 'ubior', cena: { wartosc: 5, jednostka: 'md' }, rzadkosc: 'pospolity', zrodlo: 'PG', strona_zrodlowa: 109 },
  { id: 'plaszcz_zimowy', nazwa: 'Płaszcz, zimowy', kategoria: 'ubior', cena: { wartosc: 1, jednostka: 'sr' }, rzadkosc: 'pospolity', zrodlo: 'PG', strona_zrodlowa: 109 },
  { id: 'ponczochy_jedwabne', nazwa: 'Pończochy, jedwabne', kategoria: 'ubior', cena: { wartosc: 8, jednostka: 'md' }, rzadkosc: 'niepospolity', zrodlo: 'PG', strona_zrodlowa: 109 },
  { id: 'rekawice_robocze', nazwa: 'Rękawice robocze', kategoria: 'ubior', cena: { wartosc: 1, jednostka: 'md' }, rzadkosc: 'pospolity', zrodlo: 'PG', strona_zrodlowa: 109 },
  { id: 'rekawiczki_wysokiej_jakosci', nazwa: 'Rękawiczki wysokiej jakości', kategoria: 'ubior', cena: { wartosc: 1, jednostka: 'sr' }, rzadkosc: 'rzadki', zrodlo: 'PG', strona_zrodlowa: 109 },
  { id: 'spodnie_wysokiej_jakosci', nazwa: 'Spodnie wysokiej jakości', kategoria: 'ubior', cena: { wartosc: 2, jednostka: 'sr', orientacyjna: true }, rzadkosc: 'rzadki', zrodlo: 'PG', strona_zrodlowa: 109 },
  { id: 'spodnie_zwykle', nazwa: 'Spodnie, zwykłe', kategoria: 'ubior', cena: { wartosc: 2, jednostka: 'md' }, rzadkosc: 'pospolity', zrodlo: 'PG', strona_zrodlowa: 109 },
  { id: 'stroj_artysty', nazwa: 'Strój artysty', kategoria: 'ubior', cena: { wartosc: 7, jednostka: 'md' }, rzadkosc: 'niepospolity', zrodlo: 'PG', strona_zrodlowa: 109 },
  { id: 'stroj_dworzanina', nazwa: 'Strój dworzanina', kategoria: 'ubior', cena: { wartosc: 5, jednostka: 'sr' }, rzadkosc: 'rzadki', zrodlo: 'PG', strona_zrodlowa: 109 },
  { id: 'stroj_krolewski', nazwa: 'Strój królewski', kategoria: 'ubior', cena: { wartosc: 25, jednostka: 'zk' }, rzadkosc: 'egzotyczny', zrodlo: 'PG', strona_zrodlowa: 109 },
  { id: 'stroj_szlachcica', nazwa: 'Strój szlachcica', kategoria: 'ubior', cena: { wartosc: 5, jednostka: 'zk' }, rzadkosc: 'egzotyczny', zrodlo: 'PG', strona_zrodlowa: 109 },
  { id: 'suknia_wysokiej_jakosci', nazwa: 'Suknia wysokiej jakości', kategoria: 'ubior', cena: { wartosc: 5, jednostka: 'sr', orientacyjna: true }, rzadkosc: 'rzadki', zrodlo: 'PG', strona_zrodlowa: 109 },
  { id: 'suknia_zwykla', nazwa: 'Suknia, zwykła', kategoria: 'ubior', cena: { wartosc: 5, jednostka: 'md' }, rzadkosc: 'pospolity', zrodlo: 'PG', strona_zrodlowa: 109 },
  { id: 'szata', nazwa: 'Szata', kategoria: 'ubior', cena: { wartosc: 1, jednostka: 'sr' }, rzadkosc: 'niepospolity', zrodlo: 'PG', strona_zrodlowa: 109 },
  { id: 'torebka', nazwa: 'Torebka', kategoria: 'ubior', cena: { wartosc: 1, jednostka: 'sr' }, rzadkosc: 'niepospolity', zrodlo: 'PG', strona_zrodlowa: 109 },
  { id: 'ubranie_robocze', nazwa: 'Ubranie robocze', kategoria: 'ubior', cena: { wartosc: 3, jednostka: 'md' }, rzadkosc: 'pospolity', zrodlo: 'PG', strona_zrodlowa: 109 },
  { id: 'ubranie_zimowe', nazwa: 'Ubranie, zimowe', kategoria: 'ubior', cena: { wartosc: 8, jednostka: 'md' }, rzadkosc: 'niepospolity', zrodlo: 'PG', strona_zrodlowa: 109 },
  { id: 'ubranie_zwykle', nazwa: 'Ubranie, zwykłe', kategoria: 'ubior', cena: { wartosc: 5, jednostka: 'md' }, rzadkosc: 'pospolity', zrodlo: 'PG', strona_zrodlowa: 109 },
  { id: 'polatane_ubranie', nazwa: 'Połatane ubranie', kategoria: 'ubior', cena: { wartosc: 3, jednostka: 'md', orientacyjna: true }, rzadkosc: 'pospolity', opis: 'Podstawowe ubranie startowe postaci o zamożności Ubóstwo.', zrodlo: 'PG', strona_zrodlowa: 25 },
  { id: 'lachmany', nazwa: 'Łachmany', kategoria: 'ubior', cena: { wartosc: 1, jednostka: 'okr', orientacyjna: true }, rzadkosc: 'pospolity', opis: 'Podstawowe ubranie startowe postaci o zamożności Nędza.', zrodlo: 'PG', strona_zrodlowa: 25 },
  { id: 'wytworne_ubranie', nazwa: 'Wytworne ubranie', kategoria: 'ubior', cena: { wartosc: 5, jednostka: 'md', orientacyjna: true }, rzadkosc: 'niepospolity', opis: 'Podstawowe ubranie startowe postaci o zamożności Komfort.', zrodlo: 'PG', strona_zrodlowa: 26 },
  { id: 'ubranie_dworzanina', nazwa: 'Ubranie dworzanina', kategoria: 'ubior', cena: { wartosc: 5, jednostka: 'sr', orientacyjna: true }, rzadkosc: 'rzadki', opis: 'Podstawowe ubranie startowe postaci o zamożności Dobrobyt.', zrodlo: 'PG', strona_zrodlowa: 26 },

  // ===== NARZĘDZIA (PG str. 110) =====
  { id: 'garota', nazwa: 'Garota', kategoria: 'narzedzia', cena: { wartosc: 1, jednostka: 'okr' }, rzadkosc: 'pospolity', opis: 'Użyta na pochwyconym stworzeniu zadaje 1k6 obrażeń i je unieruchamia. Wymaga obu rąk.', zrodlo: 'PG', strona_zrodlowa: 110 },
  { id: 'instrument_magiczny', nazwa: 'Instrument magiczny', kategoria: 'narzedzia', cena: { wartosc: 1, jednostka: 'sr' }, rzadkosc: 'niepospolity', opis: 'Przedmiot wykorzystywany przy rzucaniu czarów (rytualny nóż, kocioł, kryształ, różdżka itp.), w tym narzędzia do wróżenia.', zrodlo: 'PG', strona_zrodlowa: 110 },
  { id: 'instrument_muzyczny', nazwa: 'Instrument muzyczny', kategoria: 'narzedzia', cena: { wartosc: 1, jednostka: 'sr', orientacyjna: true }, rzadkosc: 'rzadki', zrodlo: 'PG', strona_zrodlowa: 110 },
  { id: 'kastety', nazwa: 'Kastety', kategoria: 'narzedzia', cena: { wartosc: 1, jednostka: 'sr' }, rzadkosc: 'pospolity', opis: 'Sprzedawane w parach. Nosząc je, zadajesz dodatkowy 1 punkt obrażeń atakami bez broni.', zrodlo: 'PG', strona_zrodlowa: 110 },
  { id: 'klepsydra', nazwa: 'Klepsydra', kategoria: 'narzedzia', cena: { wartosc: 1, jednostka: 'sr' }, rzadkosc: 'rzadki', zrodlo: 'PG', strona_zrodlowa: 110 },
  { id: 'krysztalowa_kula', nazwa: 'Kryształowa kula', kategoria: 'narzedzia', cena: { wartosc: 1, jednostka: 'zk' }, rzadkosc: 'egzotyczny', zrodlo: 'PG', strona_zrodlowa: 110 },
  { id: 'ksiazka', nazwa: 'Książka, drukowana lub rękopis', kategoria: 'narzedzia', cena: { wartosc: 1, jednostka: 'zk' }, rzadkosc: 'egzotyczny', zrodlo: 'PG', strona_zrodlowa: 110 },
  { id: 'luneta', nazwa: 'Luneta', kategoria: 'narzedzia', cena: { wartosc: 100, jednostka: 'zk' }, rzadkosc: 'egzotyczny', zrodlo: 'PG', strona_zrodlowa: 110 },
  { id: 'lom', nazwa: 'Łom', kategoria: 'narzedzia', cena: { wartosc: 2, jednostka: 'md' }, rzadkosc: 'pospolity', opis: 'Zapewnia 1 ułatwienie w testach Siły przy wyważaniu drzwi, skrzyń i innych obiektów.', zrodlo: 'PG', strona_zrodlowa: 110 },
  { id: 'narzedzia_tortur', nazwa: 'Narzędzia tortur', kategoria: 'narzedzia', cena: { wartosc: 2, jednostka: 'sr' }, rzadkosc: 'niepospolity', zrodlo: 'PG', strona_zrodlowa: 110 },
  { id: 'ostrokrzew_i_jemiola', nazwa: 'Ostrokrzew i jemioła', kategoria: 'narzedzia', cena: { wartosc: 1, jednostka: 'md' }, rzadkosc: 'pospolity', zrodlo: 'PG', strona_zrodlowa: 110 },
  { id: 'przyrzady_nawigacyjne', nazwa: 'Przyrządy nawigacyjne', kategoria: 'narzedzia', cena: { wartosc: 2, jednostka: 'sr' }, rzadkosc: 'egzotyczny', zrodlo: 'PG', strona_zrodlowa: 110 },
  { id: 'siec', nazwa: 'Sieć', kategoria: 'narzedzia', cena: { wartosc: 5, jednostka: 'md' }, rzadkosc: 'pospolity', opis: 'Zarzucona na stworzenie o Rozmiarze 2 lub mniejszym może je spowolnić.', zrodlo: 'PG', strona_zrodlowa: 110 },
  { id: 'szklo_powiekszajace', nazwa: 'Szkło powiększające', kategoria: 'narzedzia', cena: { wartosc: 1, jednostka: 'sr' }, rzadkosc: 'egzotyczny', opis: 'Zapewnia 1 ułatwienie w testach Percepcji przy szukaniu ukrytych obiektów, śladów i wskazówek.', zrodlo: 'PG', strona_zrodlowa: 110 },
  { id: 'swiety_symbol', nazwa: 'Święty symbol', kategoria: 'narzedzia', cena: { wartosc: 5, jednostka: 'md' }, rzadkosc: 'pospolity', zrodlo: 'PG', strona_zrodlowa: 110 },
  { id: 'trucizna', nazwa: 'Trucizna', kategoria: 'narzedzia', cena: { wartosc: 5, jednostka: 'sr' }, rzadkosc: 'rzadki', zrodlo: 'PG', strona_zrodlowa: 110 },
  { id: 'wielokrazek', nazwa: 'Wielokrążek', kategoria: 'narzedzia', cena: { wartosc: 1, jednostka: 'sr' }, rzadkosc: 'niepospolity', zrodlo: 'PG', strona_zrodlowa: 110 },
  { id: 'woda_swiecona', nazwa: 'Woda święcona', kategoria: 'narzedzia', cena: { wartosc: 3, jednostka: 'sr' }, rzadkosc: 'rzadki', opis: 'Rzucona w stworzenie zadaje obrażenia zależne od jego Splugawienia; podwojone przeciw demonom, diabłom, faerie, duchom i nieumarłym.', zrodlo: 'PG', strona_zrodlowa: 110 },
  { id: 'wytrychy', nazwa: 'Wytrychy', kategoria: 'narzedzia', cena: { wartosc: 1, jednostka: 'sr' }, rzadkosc: 'rzadki', zrodlo: 'PG', strona_zrodlowa: 110 },
  { id: 'zestaw_alchemika', nazwa: 'Zestaw alchemika', kategoria: 'narzedzia', cena: { wartosc: 5, jednostka: 'sr' }, rzadkosc: 'egzotyczny', zrodlo: 'PG', strona_zrodlowa: 110 },
  { id: 'zestaw_do_charakteryzacji', nazwa: 'Zestaw do charakteryzacji (6 użyć)', kategoria: 'narzedzia', cena: { wartosc: 5, jednostka: 'sr' }, rzadkosc: 'rzadki', zrodlo: 'PG', strona_zrodlowa: 110 },
  { id: 'zestaw_narzedzi', nazwa: 'Zestaw narzędzi', kategoria: 'narzedzia', cena: { wartosc: 1, jednostka: 'sr' }, rzadkosc: 'pospolity', opis: 'Zestaw narzędzi wykorzystywanych w danej profesji.', zrodlo: 'PG', strona_zrodlowa: 110 },
  { id: 'zestaw_pisarski', nazwa: 'Zestaw pisarski', kategoria: 'narzedzia', cena: { wartosc: 1, jednostka: 'sr' }, rzadkosc: 'rzadki', zrodlo: 'PG', strona_zrodlowa: 110 },
  { id: 'zestaw_uzdrowiciela', nazwa: 'Zestaw uzdrowiciela (6 użyć)', kategoria: 'narzedzia', cena: { wartosc: 5, jednostka: 'sr' }, rzadkosc: 'niepospolity', opis: 'Poświęć użycie i wykonaj test Intelektu, by uleczyć 1 punkt obrażeń celu w bezpośrednim zasięgu.', zrodlo: 'PG', strona_zrodlowa: 110 },

  // ===== JEDZENIE I ZAKWATEROWANIE (PG str. 111) =====
  { id: 'ale', nazwa: 'Ale, kufel', kategoria: 'jedzenie_zakwaterowanie', cena: { wartosc: 2, jednostka: 'okr' }, rzadkosc: 'pospolity', zrodlo: 'PG', strona_zrodlowa: 111 },
  { id: 'alkohol_mocny_dobry', nazwa: 'Alkohol, mocny, dobrej jakości', kategoria: 'jedzenie_zakwaterowanie', cena: { wartosc: 1, jednostka: 'sr' }, rzadkosc: 'niepospolity', zrodlo: 'PG', strona_zrodlowa: 111 },
  { id: 'alkohol_mocny_typowy', nazwa: 'Alkohol, mocny, typowy', kategoria: 'jedzenie_zakwaterowanie', cena: { wartosc: 5, jednostka: 'md' }, rzadkosc: 'pospolity', zrodlo: 'PG', strona_zrodlowa: 111 },
  { id: 'bimber', nazwa: 'Bimber', kategoria: 'jedzenie_zakwaterowanie', cena: { wartosc: 2, jednostka: 'md' }, rzadkosc: 'pospolity', zrodlo: 'PG', strona_zrodlowa: 111 },
  { id: 'miod_pitny', nazwa: 'Miód pitny, kufel', kategoria: 'jedzenie_zakwaterowanie', cena: { wartosc: 4, jednostka: 'okr' }, rzadkosc: 'pospolity', zrodlo: 'PG', strona_zrodlowa: 111 },
  { id: 'opium', nazwa: 'Opium', kategoria: 'jedzenie_zakwaterowanie', cena: { wartosc: 5, jednostka: 'md' }, rzadkosc: 'niepospolity', zrodlo: 'PG', strona_zrodlowa: 111 },
  { id: 'pasza_dla_zwierzat', nazwa: 'Pasza dla zwierząt', kategoria: 'jedzenie_zakwaterowanie', cena: { wartosc: 4, jednostka: 'okr' }, rzadkosc: 'pospolity', zrodlo: 'PG', strona_zrodlowa: 111 },
  { id: 'piwo', nazwa: 'Piwo, kufel', kategoria: 'jedzenie_zakwaterowanie', cena: { wartosc: 1, jednostka: 'okr' }, rzadkosc: 'pospolity', zrodlo: 'PG', strona_zrodlowa: 111 },
  { id: 'posilek_lekki', nazwa: 'Posiłek, lekki', kategoria: 'jedzenie_zakwaterowanie', cena: { wartosc: 3, jednostka: 'okr' }, rzadkosc: 'pospolity', zrodlo: 'PG', strona_zrodlowa: 111 },
  { id: 'posilek_typowy', nazwa: 'Posiłek, typowy', kategoria: 'jedzenie_zakwaterowanie', cena: { wartosc: 5, jednostka: 'okr' }, rzadkosc: 'pospolity', zrodlo: 'PG', strona_zrodlowa: 111 },
  { id: 'posilek_wyszukany', nazwa: 'Posiłek, wyszukany', kategoria: 'jedzenie_zakwaterowanie', cena: { wartosc: 5, jednostka: 'md' }, rzadkosc: 'rzadki', zrodlo: 'PG', strona_zrodlowa: 111 },
  { id: 'wino_dobre', nazwa: 'Wino, dobrej jakości', kategoria: 'jedzenie_zakwaterowanie', cena: { wartosc: 12, jednostka: 'md', orientacyjna: true }, rzadkosc: 'niepospolity', opis: '2k6 miedziaków (średnio).', zrodlo: 'PG', strona_zrodlowa: 111 },
  { id: 'wino_pospolite', nazwa: 'Wino, pospolite', kategoria: 'jedzenie_zakwaterowanie', cena: { wartosc: 4, jednostka: 'okr' }, rzadkosc: 'pospolity', zrodlo: 'PG', strona_zrodlowa: 111 },
  { id: 'wino_wysokiej_jakosci', nazwa: 'Wino, wysokiej jakości', kategoria: 'jedzenie_zakwaterowanie', cena: { wartosc: 12, jednostka: 'sr', orientacyjna: true }, rzadkosc: 'rzadki', opis: '2k6 srebrników (średnio).', zrodlo: 'PG', strona_zrodlowa: 111 },
  { id: 'zakwaterowanie', nazwa: 'Zakwaterowanie (za noc)', kategoria: 'jedzenie_zakwaterowanie', cena: { wartosc: 1, jednostka: 'md', orientacyjna: true }, rzadkosc: 'pospolity', zrodlo: 'PG', strona_zrodlowa: 111 },

  // ===== ZWIERZĘTA I SPRZĘT DLA ZWIERZĄT (PG str. 111) =====
  { id: 'derka', nazwa: 'Derka', kategoria: 'zwierzeta', cena: { wartosc: 1, jednostka: 'md' }, rzadkosc: 'niepospolity', zrodlo: 'PG', strona_zrodlowa: 111 },
  { id: 'jastrzab', nazwa: 'Jastrząb (drobne zwierzę, latające)', kategoria: 'zwierzeta', cena: { wartosc: 1, jednostka: 'sr' }, rzadkosc: 'egzotyczny', zrodlo: 'PG', strona_zrodlowa: 111 },
  { id: 'kon_bojowy', nazwa: 'Koń bojowy', kategoria: 'zwierzeta', cena: { wartosc: 10, jednostka: 'zk' }, rzadkosc: 'rzadki', zrodlo: 'PG', strona_zrodlowa: 111 },
  { id: 'kon_mul_kuc', nazwa: 'Koń, muł lub kuc', kategoria: 'zwierzeta', cena: { wartosc: 2, jednostka: 'sr' }, rzadkosc: 'pospolity', zrodlo: 'PG', strona_zrodlowa: 111 },
  { id: 'pies', nazwa: 'Pies (małe zwierzę)', kategoria: 'zwierzeta', cena: { wartosc: 5, jednostka: 'md' }, rzadkosc: 'pospolity', zrodlo: 'PG', strona_zrodlowa: 111 },
  { id: 'sakwa_dla_konia', nazwa: 'Sakwa dla konia', kategoria: 'zwierzeta', cena: { wartosc: 2, jednostka: 'md' }, rzadkosc: 'niepospolity', zrodlo: 'PG', strona_zrodlowa: 111 },
  { id: 'siodlo', nazwa: 'Siodło', kategoria: 'zwierzeta', cena: { wartosc: 5, jednostka: 'md' }, rzadkosc: 'niepospolity', zrodlo: 'PG', strona_zrodlowa: 111 },
  { id: 'uprzaz', nazwa: 'Uprząż', kategoria: 'zwierzeta', cena: { wartosc: 1, jednostka: 'md' }, rzadkosc: 'pospolity', zrodlo: 'PG', strona_zrodlowa: 111 },
  { id: 'wedzidlo_i_uzda', nazwa: 'Wędzidło i uzda', kategoria: 'zwierzeta', cena: { wartosc: 1, jednostka: 'md' }, rzadkosc: 'pospolity', zrodlo: 'PG', strona_zrodlowa: 111 },

  // ===== ELIKSIRY (PG str. 112) =====
  { id: 'eliksir_antytoksyna', nazwa: 'Eliksir antytoksyny', kategoria: 'eliksiry', cena: { wartosc: 5, jednostka: 'sr' }, rzadkosc: 'rzadki', zrodlo: 'PG', strona_zrodlowa: 112 },
  { id: 'eliksir_czujnosci', nazwa: 'Eliksir czujności', kategoria: 'eliksiry', cena: { wartosc: 5, jednostka: 'sr' }, rzadkosc: 'rzadki', zrodlo: 'PG', strona_zrodlowa: 112 },
  { id: 'eliksir_leczenia', nazwa: 'Eliksir leczenia', kategoria: 'eliksiry', cena: { wartosc: 2, jednostka: 'sr' }, rzadkosc: 'niepospolity', zrodlo: 'PG', strona_zrodlowa: 112 },
  { id: 'eliksir_niewidzialnosci', nazwa: 'Eliksir niewidzialności', kategoria: 'eliksiry', cena: { wartosc: 1, jednostka: 'zk' }, rzadkosc: 'egzotyczny', zrodlo: 'PG', strona_zrodlowa: 112 },
  { id: 'eliksir_odpornosci_na_ogien', nazwa: 'Eliksir odporności na ogień', kategoria: 'eliksiry', cena: { wartosc: 5, jednostka: 'sr' }, rzadkosc: 'rzadki', zrodlo: 'PG', strona_zrodlowa: 112 },
  { id: 'eliksir_panaceum', nazwa: 'Eliksir panaceum', kategoria: 'eliksiry', cena: { wartosc: 10, jednostka: 'zk' }, rzadkosc: 'egzotyczny', zrodlo: 'PG', strona_zrodlowa: 112 },
  { id: 'eliksir_przenikliwosci', nazwa: 'Eliksir przenikliwości', kategoria: 'eliksiry', cena: { wartosc: 5, jednostka: 'sr' }, rzadkosc: 'egzotyczny', zrodlo: 'PG', strona_zrodlowa: 112 },
  { id: 'eliksir_ulotnej_mlodosci', nazwa: 'Eliksir ulotnej młodości', kategoria: 'eliksiry', cena: { wartosc: 1, jednostka: 'zk' }, rzadkosc: 'egzotyczny', zrodlo: 'PG', strona_zrodlowa: 112 },
  { id: 'eliksir_wzrostu', nazwa: 'Eliksir wzrostu', kategoria: 'eliksiry', cena: { wartosc: 5, jednostka: 'sr' }, rzadkosc: 'egzotyczny', zrodlo: 'PG', strona_zrodlowa: 112 },

  // ===== SUPLEMENT WŁADCY DEMONÓW: substancje alchemiczne =====
  { id: 'dym_w_butelce', nazwa: 'Dym w butelce', kategoria: 'substancje_alchemiczne', cena: { wartosc: 5, jednostka: 'sr' }, rzadkosc: 'rzadki', zrodlo: 'SUP' },
  { id: 'nadzwyczajny_klej', nazwa: 'Nadzwyczajny klej', kategoria: 'substancje_alchemiczne', cena: { wartosc: 1, jednostka: 'sr' }, rzadkosc: 'niepospolity', zrodlo: 'SUP' },
  { id: 'woda_calokwiatowa', nazwa: 'Woda całokwiatowa', kategoria: 'substancje_alchemiczne', cena: { wartosc: 3, jednostka: 'sr' }, rzadkosc: 'rzadki', opis: 'Wypita leczy 1 punkt obrażeń albo (na parzystym rzucie k6) obrażenia równe Szybkości Zdrowienia i usuwa stan choroba.', zrodlo: 'SUP' },
  { id: 'odczynnik_uniwersalny', nazwa: 'Odczynnik uniwersalny', kategoria: 'substancje_alchemiczne', cena: { wartosc: 5, jednostka: 'md' }, rzadkosc: 'rzadki', zrodlo: 'SUP' },
  { id: 'smoczy_ogien', nazwa: 'Smoczy ogień', kategoria: 'substancje_alchemiczne', cena: { wartosc: 5, jednostka: 'zk' }, rzadkosc: 'egzotyczny', zrodlo: 'SUP' },
  { id: 'woda_krolewska', nazwa: 'Woda królewska', kategoria: 'substancje_alchemiczne', cena: { wartosc: 10, jednostka: 'zk' }, rzadkosc: 'egzotyczny', opis: 'Silnie żrący płyn - rzucony zadaje 2k6 obrażeń, a następnie 3k6 obrażeń na koniec rundy w kontakcie.', zrodlo: 'SUP' },
  { id: 'woda_zycia', nazwa: 'Woda życia', kategoria: 'substancje_alchemiczne', cena: { wartosc: 1, jednostka: 'sr' }, rzadkosc: 'niepospolity', opis: 'Silny trunek - wypity odurza na 1 godzinę (osłabienie, spowolnienie, redukcja obrażeń o połowę).', zrodlo: 'SUP' },

  // ===== SUPLEMENT WŁADCY DEMONÓW: przedmioty zakazane =====
  { id: 'askaryda', nazwa: 'Askaryda', kategoria: 'przedmioty_zakazane', cena: { wartosc: 1, jednostka: 'zk' }, rzadkosc: 'egzotyczny', zrodlo: 'SUP' },
  { id: 'ciagutek', nazwa: 'Ciągutek', kategoria: 'przedmioty_zakazane', cena: { wartosc: 5, jednostka: 'sr' }, rzadkosc: 'egzotyczny', zrodlo: 'SUP' },
  { id: 'destylowane_lzy_dziewicy', nazwa: 'Destylowane łzy dziewicy (1 dawka)', kategoria: 'przedmioty_zakazane', cena: { wartosc: 1, jednostka: 'zk' }, rzadkosc: 'egzotyczny', zrodlo: 'SUP' },
  { id: 'eliksir_milosny', nazwa: 'Eliksir miłosny', kategoria: 'przedmioty_zakazane', cena: { wartosc: 1, jednostka: 'zk' }, rzadkosc: 'rzadki', zrodlo: 'SUP' },
  { id: 'ozywienczy_czerep', nazwa: 'Ożywieńczy czerep', kategoria: 'przedmioty_zakazane', cena: { wartosc: 100, jednostka: 'zk' }, rzadkosc: 'egzotyczny', zrodlo: 'SUP' },
  { id: 'platki_lotosu', nazwa: 'Płatki lotosu (1 dawka)', kategoria: 'przedmioty_zakazane', cena: { wartosc: 1, jednostka: 'sr' }, rzadkosc: 'egzotyczny', zrodlo: 'SUP' },
  { id: 'rog_jednorozca', nazwa: 'Róg jednorożca', kategoria: 'przedmioty_zakazane', cena: { wartosc: 100, jednostka: 'zk' }, rzadkosc: 'egzotyczny', zrodlo: 'SUP' },
  { id: 'szalej', nazwa: 'Szalej (1 dawka)', kategoria: 'przedmioty_zakazane', cena: { wartosc: 1, jednostka: 'zk' }, rzadkosc: 'egzotyczny', zrodlo: 'SUP' },
  { id: 'zwiastuny_smierci', nazwa: 'Zwiastuny śmierci', kategoria: 'przedmioty_zakazane', cena: { wartosc: 5, jednostka: 'zk' }, rzadkosc: 'egzotyczny', zrodlo: 'SUP' },

  // ===== SUPLEMENT WŁADCY DEMONÓW: wynalazki i ładunki wybuchowe =====
  { id: 'bomba', nazwa: 'Bomba', kategoria: 'wynalazki', cena: { wartosc: 1, jednostka: 'zk' }, rzadkosc: 'rzadki', zrodlo: 'SUP' },
  { id: 'bomba_dymna', nazwa: 'Bomba dymna', kategoria: 'wynalazki', cena: { wartosc: 5, jednostka: 'sr' }, rzadkosc: 'rzadki', zrodlo: 'SUP' },
  { id: 'detonator_czasowy', nazwa: 'Detonator czasowy', kategoria: 'wynalazki', cena: { wartosc: 2, jednostka: 'zk' }, rzadkosc: 'egzotyczny', zrodlo: 'SUP' },
  { id: 'flara', nazwa: 'Flara', kategoria: 'wynalazki', cena: { wartosc: 1, jednostka: 'sr' }, rzadkosc: 'rzadki', zrodlo: 'SUP' },
  { id: 'garlacz', nazwa: 'Garłacz', kategoria: 'wynalazki', cena: { wartosc: 2, jednostka: 'zk' }, rzadkosc: 'rzadki', zrodlo: 'SUP' },
  { id: 'zegar', nazwa: 'Zegar', kategoria: 'wynalazki', cena: { wartosc: 1, jednostka: 'zk' }, rzadkosc: 'rzadki', zrodlo: 'SUP' },
  { id: 'zegarek_kieszonkowy', nazwa: 'Zegarek kieszonkowy', kategoria: 'wynalazki', cena: { wartosc: 5, jednostka: 'zk' }, rzadkosc: 'egzotyczny', zrodlo: 'SUP' },

  // ===== SUPLEMENT WŁADCY DEMONÓW: eliksiry =====
  { id: 'eliksir_eterycznosci', nazwa: 'Eliksir eteryczności', kategoria: 'eliksiry', cena: { wartosc: 5, jednostka: 'zk' }, rzadkosc: 'egzotyczny', zrodlo: 'SUP' },
  { id: 'eliksir_imitacji', nazwa: 'Eliksir imitacji', kategoria: 'eliksiry', cena: { wartosc: 1, jednostka: 'zk' }, rzadkosc: 'egzotyczny', zrodlo: 'SUP' },
  { id: 'eliksir_krzepy', nazwa: 'Eliksir krzepy', kategoria: 'eliksiry', cena: { wartosc: 5, jednostka: 'sr' }, rzadkosc: 'rzadki', opis: 'Zapewnia premię +1 do Siły na 3k6 minut.', zrodlo: 'SUP' },
  { id: 'eliksir_niewazkosci', nazwa: 'Eliksir nieważkości', kategoria: 'eliksiry', cena: { wartosc: 5, jednostka: 'sr' }, rzadkosc: 'egzotyczny', zrodlo: 'SUP' },
  { id: 'eliksir_odwagi', nazwa: 'Eliksir odwagi', kategoria: 'eliksiry', cena: { wartosc: 5, jednostka: 'sr' }, rzadkosc: 'rzadki', opis: 'Zapewnia premię +1 do Woli na 3k6 minut.', zrodlo: 'SUP' },
  { id: 'eliksir_pomniejszajacy', nazwa: 'Eliksir pomniejszający', kategoria: 'eliksiry', cena: { wartosc: 5, jednostka: 'sr' }, rzadkosc: 'egzotyczny', zrodlo: 'SUP' },
  { id: 'eliksir_rybiego_tchu', nazwa: 'Eliksir rybiego tchu', kategoria: 'eliksiry', cena: { wartosc: 5, jednostka: 'sr' }, rzadkosc: 'egzotyczny', zrodlo: 'SUP' },
  { id: 'eliksir_skrzydel', nazwa: 'Eliksir skrzydeł', kategoria: 'eliksiry', cena: { wartosc: 3, jednostka: 'zk' }, rzadkosc: 'egzotyczny', zrodlo: 'SUP' },
  { id: 'eliksir_sprytu', nazwa: 'Eliksir sprytu', kategoria: 'eliksiry', cena: { wartosc: 5, jednostka: 'sr' }, rzadkosc: 'rzadki', opis: 'Zapewnia premię +1 do Intelektu na 3k6 minut.', zrodlo: 'SUP' },
  { id: 'eliksir_zrecznosci', nazwa: 'Eliksir zręczności', kategoria: 'eliksiry', cena: { wartosc: 5, jednostka: 'sr' }, rzadkosc: 'rzadki', opis: 'Zapewnia premię +1 do Zręczności na 3k6 minut.', zrodlo: 'SUP' }
];

export default EQUIPMENT;
