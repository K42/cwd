# Architektura Kreatora Postaci - Cień Władcy Demonów

## Przegląd
Aplikacja jest izomorficzną stroną internetową do tworzenia postaci dla gry RPG "Cień Władcy Demonów". Wykorzystuje proste technologie web bez bazy danych.

## Struktura techniczna

### Frontend (statyczny)
- **HTML + vanilla JS** - renderuje pojedynczy `index.html` serwowany przez Node.js
- **Brak frameworków** - czyste rozwiązania JavaScript dla maksymalnej prostoty
- **Caching w pamięci** - reguły gry ładowane raz i cache'owane po stronie klienta

### Backend (Node.js)
- **Express server** - minimalistyczny serwer HTTP
- **Jeden endpoint** - `/api/build` przyjmuje specyfikację postaci, zwraca kompletny obiekt
- **Czyste funkcje** - `budujPostac(spec)` bez efektów ubocznych, umożliwia snapshot testy

### Dane
- **`data.js`** - wszystkie tabele lookup (pochodzenia, ścieżki, zaklęcia) w jednym pliku
- **Hash mapa** - klucze typu `"pochodzenie:jotunn"` dla wyszukiwania O(1)
- **Walidacja** - sprawdzanie zgodności z regułami gry na etapie budowania

## Przepływ danych
1. UI zbiera wybory użytkownika (pochodzenie, atrybuty)
2. POST do `/api/build` z obiektem specyfikacji
3. Serwer buduje kompletną postać używając `data.js`
4. Zwrot JSON z wszystkimi obliczonymi wartościami
5. UI wyświetla kartę postaci

## Zasady implementacji
- **Jedna odpowiedzialność** - każdy moduł ma jedno zadanie
- **Immutability** - dane wejściowe nie są modyfikowane
- **Testowalna logika** - każda reguła gry jako osobna funkcja z testami
- **Rozszerzalność** - dodawanie nowych pochodzeń = aktualizacja `data.js`

## Kryteria Akceptacji - Sprint 1

### AC-001: Podstawowa struktura
- [ ] Folder `src/` z plikami `server.js`, `data.js`, `ui/index.html`
- [ ] `package.json` z scripts: start, test, lint
- [ ] Serwer startuje na porcie 3000

### AC-002: Endpoint budowania postaci
- [ ] POST `/api/build` przyjmuje JSON spec
- [ ] Zwraca kompletny obiekt postaci
- [ ] Waliduje dane wejściowe

### AC-003: Podstawowe pochodzenia
- [ ] Człowiek i Jötunn hardkodowane w `data.js`
- [ ] Obliczanie atrybutów drugorzędnych (Zdrowie = Siła)
- [ ] Test jednostkowy dla każdego pochodzenia
