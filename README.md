# Kreator Postaci - Cień Władcy Demonów

Template multiagentowy dla Cursor do tworzenia aplikacji kreatora postaci dla gry RPG "Cień Władcy Demonów".

## 🎯 Cel projektu

Stworzenie prostego ale skutecznego kreatora postaci wykorzystującego:
- **HTML + JavaScript** (frontend)
- **Node.js + Express** (backend) 
- **Brak bazy danych** (wszystko w pamięci)
- **Architektę multiagentową** (4 specjalistyczne agenty)

## 🤖 Agenty

### 1. **Architect** 
Projektuje architekturę i definiuje wymagania
- Tworzy `ARCHITECTURE.md`
- Definiuje Kryteria Akceptacji (AC)
- Planuje kolejne sprinty

### 2. **Develop**
Implementuje kod według planu
- Pisze kod źródłowy
- Dodaje JSDoc do wszystkich funkcji
- Tworzy testy jednostkowe

### 3. **Code-Review** 
Przegląda i poprawia kod
- Uruchamia testy (`npm test`)
- Sprawdza zgodność z zasadami gry
- Zostawia konstruktywny feedback

### 4. **Documentation**
Dokumentuje funkcjonalność
- Generuje dokumentację API
- Utrzymuje mapowanie zasad gry
- Pisze instrukcje wdrożenia

## 🚀 Szybki start

1. **Skopiuj template do projektu Cursor**
2. **Uruchom pierwszy prompt:**

```
architect: Stwórz podstawową strukturę kreatora postaci dla gry "Cień Władcy Demonów". 

Wymagania:
- Wybór pochodzenia (Człowiek, Jötunn)
- Losowanie atrybutów podstawowych
- Obliczenie atrybutów drugorzędnych
- Endpoint POST /api/build
- Test jednostkowy dla każdego pochodzenia
```

3. **Agenty automatycznie wykonają cykl:**
   - Architect → Develop → Code-Review → Documentation

## 📁 Struktura plików

```
projekt/
├── .cursor/
│   ├── composer.json      # Konfiguracja agentów
│   └── rules/             # Zasady dla każdego agenta
├── src/
│   ├── data.js           # Dane z zasad gry
│   ├── server.js         # Serwer Express
│   └── ui/               # Frontend (HTML + JS)
├── tests/                # Testy Jest
└── docs/                 # Auto-generowana dokumentacja
```

## 🎲 Funkcjonalności

### Wersja 1.0 (MVP)
- [x] Wybór pochodzenia (Człowiek, Jötunn)
- [x] Losowe/własne atrybuty podstawowe
- [x] Obliczanie atrybutów drugorzędnych
- [x] Eksport postaci do JSON

### Planowane rozszerzenia
- [ ] Więcej pochodzeń z suplementów
- [ ] Ścieżki eksperckie  
- [ ] System magii i zaklęć
- [ ] Ekwipunek i bogactwo
- [ ] Eksport do PDF

## 🔧 Komendy

```bash
# Instalacja zależności
npm install

# Uruchomienie serwera deweloperskiego
npm run dev

# Testy jednostkowe
npm test

# Linting i formatowanie kodu
npm run lint

# Generowanie dokumentacji
npm run docs:generate
```

## 📖 Źródła zasad gry

- Podręcznik główny "Cień Władcy Demonów" (str. 34-70)
- Suplementy: Chwalebna Śmierć, Straszliwe Piękno, Rozkoszna Agonia

## 🤝 Współpraca agentów

Każdy agent ma jasno określoną rolę i komunikuje się przez Cursor:

```
architect → develop → code-review → documentation → architect
```

Cykl powtarza się aż do ukończenia wszystkich funkcjonalności.

## 📄 Licencja

MIT - Zobacz plik LICENSE dla szczegółów.

---

**Powered by Cursor Multi-Agent System** 🚀
