# Kreator Postaci - Cień Władcy Demonów

Aplikacja webowa do tworzenia postaci w grze RPG "Cień Władcy Demonów" (Shadow of the Demon Lord).

## 🎯 Cel projektu

Stworzenie prostego ale skutecznego kreatora postaci wykorzystującego:
- **HTML + Vanilla JavaScript** (frontend)
- **Node.js + Express** (backend) 
- **Brak bazy danych** (wszystko w pamięci)
- **Pełna implementacja zasad gry** z oficjalnego podręcznika
- **Architekturę multiagentową** (4 specjalistyczne agenty)

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

## 📚 Dokumentacja

Szczegółowa dokumentacja dostępna w katalogu `docs/`:

- **[APLIKACJA.md](docs/APLIKACJA.md)** - Kompletna dokumentacja techniczna aplikacji
  - Architektura systemu
  - Szczegóły implementacji
  - API Reference
  - Instrukcja użytkownika
  - Algorytmy i obliczenia

- **[ARCHITECTURE.md](ARCHITECTURE.md)** - Przegląd architektury projektu

- **API.md** (generowana) - Dokumentacja API z JSDoc:
  ```bash
  npm run docs:generate
  ```

## 💡 Szybka Pomoc dla Użytkowników

### Jak utworzyć postać?

**Krok 1 - Wybór Pochodzenia:**
1. Przeglądaj kafelki 17 dostępnych ras
2. Kliknij kafelek aby zobaczyć szczegóły (atrybuty, cechy, języki)
3. Kliknij przycisk "Wybierz [Nazwa]" na rozwiniętym kafelku
4. Kliknij "Dalej →"

**Krok 2 - Atrybuty i Poziom:**
1. Wybierz poziom postaci (0-10):
   - **Poziom 0**: Nowa postać bez ścieżek
   - **Poziom 1**: Wybierz ścieżkę nowicjusza (Wojownik, Mag, Kapłan, Łotr)
   - **Poziom 3**: Wybierz ścieżkę ekspercką
   - **Poziom 7**: Wybierz ścieżkę mistrzowską
2. Wybierz ścieżkę z rozwijanej listy (jeśli dostępna)
3. Zostaw zaznaczony checkbox "Domyślne atrybuty" lub ustaw własne wartości
4. Sprawdź finalne atrybuty (z modyfikatorami pochodzenia)
5. Kliknij "Dalej →"

**Krok 3 - Podsumowanie:**
1. Przejrzyj podgląd kompletnej postaci
2. Kliknij "🎲 Utwórz Postać"
3. Zapisz postać klikając "💾 Eksportuj JSON"

### Co oznaczają atrybuty?

- **Siła** - Określa zdrowie, udźwig, obrażenia broni wręcz
- **Zręczność** - Określa obronę, inicjatywę, precyzję ataków
- **Intelekt** - Określa percepcję, wiedzę, moc zaklęć
- **Wola** - Określa odporność na magię, siłę charakteru

### Atrybuty drugorzędne (obliczane automatycznie):

- **Obrona** = Zręczność (+ modyfikatory)
- **Zdrowie** = Siła (+ bonusy ze ścieżek)
- **Percepcja** = Intelekt
- **Szybkość Zdrowienia** = Siła ÷ 4 (zaokrąglone w dół, minimum 1)

### Często zadawane pytania

**P: Jak zmienić wybraną rasę?**  
O: Kliknij przycisk "← Wstecz" aby wrócić do poprzedniego kroku.

**P: Czy mogę mieć więcej niż jedną ścieżkę?**  
O: Tak! Postać wybiera kolejne ścieżki na poziomach 1, 3, 7, 9.

**P: Co robi "domyślne atrybuty"?**  
O: Ustawia atrybuty bazowe (10, 10, 10, 10) z modyfikatorami pochodzenia. Odznacz aby ustawić własne wartości.

**P: Jak działa eksport postaci?**  
O: Postać jest zapisywana jako plik JSON, który możesz otworzyć w edytorze tekstu lub zachować jako backup.

**P: Czy mogę importować zapisane postacie?**  
O: Import będzie dostępny w przyszłych wersjach.

### Wsparcie techniczne

W przypadku problemów:
1. Sprawdź czy serwer działa (konsola powinna pokazać "Kreator postaci działa na porcie 3000")
2. Odśwież przeglądarkę (F5)
3. Sprawdź konsolę przeglądarki (F12) pod kątem błędów
4. Zgłoś problem przez GitHub Issues

## 📄 Licencja

MIT - Zobacz plik LICENSE dla szczegółów.

---

**Powered by Cursor Multi-Agent System** 🚀
