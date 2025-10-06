# API Pochodzeń - Dokumentacja
## Sprint 2: Rozszerzone dane pochodzeń

**Wersja:** 2.0  
**Data:** 6 października 2025  
**Status:** Implementowane

---

## 📋 Przegląd

Nowe API umożliwia dostęp do rozszerzonych danych pochodzeń z podręcznika głównego, włącznie z tabelami losowania i funkcjami losowania. Zgodnie z AC-012 i AC-013.

### Główne funkcje:
- **Pobieranie tabel losowania** dla pochodzeń
- **Losowanie z tabel** (k6, k20, 2k6, 3k6)
- **Walidacja danych** pochodzeń
- **Efekty mechaniczne** w wynikach losowania

---

## 🔗 Endpointy API

### 1. Lista Pochodzeń

```http
GET /api/origins
```

**Odpowiedź:**
```json
{
  "pochodzenia": [
    {
      "id": "czlowiek",
      "nazwa": "Człowiek",
      "zrodlo": "PG",
      "ma_tabele": true,
      "liczba_tabel": 6,
      "status": "kompletne",
      "strona_zrodlowa": 11
    }
  ],
  "liczba_pochodzen": 1,
  "pochodzenia_z_tabelami": 1
}
```

**Pola odpowiedzi:**
- `id` - Identyfikator pochodzenia
- `nazwa` - Nazwa pochodzenia
- `zrodlo` - Źródło (PG = Podręcznik Główny)
- `ma_tabele` - Czy ma tabele losowania
- `liczba_tabel` - Liczba dostępnych tabel
- `status` - Status implementacji
- `strona_zrodlowa` - Strona w podręczniku

---

### 2. Tabele Pochodzenia

```http
GET /api/origins/:originId/tables
```

**Parametry:**
- `originId` - ID pochodzenia (np. "czlowiek")

**Odpowiedź:**
```json
{
  "pochodzenie": {
    "id": "czlowiek",
    "nazwa": "Człowiek",
    "zrodlo": "PG"
  },
  "tabele": {
    "wiek": {
      "nazwa": "Człowiek: wiek",
      "typ": "3k6",
      "opis": "Większość ludzi dożywa wieku około siedemdziesięciu lat.",
      "opcje": [
        {
          "rzut": "3",
          "wynik": "Dziecko, 11 lat lub mniej."
        },
        {
          "rzut": "4-7",
          "wynik": "Młodociany, 12–17 lat."
        }
      ]
    }
  }
}
```

**Typy tabel:**
- `wiek` - Tabela wieku postaci
- `budowa_ciala` - Tabela budowy ciała
- `wyglad` - Tabela wyglądu
- `przeszlosc` - Tabela przeszłości
- `osobowosc` - Tabela osobowości
- `religia` - Tabela religii (tylko Człowiek)

**Typy rzutów:**
- `k6` - Pojedyncza k6 (1-6)
- `k20` - Pojedyncza k20 (1-20)
- `2k6` - Dwie k6 (2-12)
- `3k6` - Trzy k6 (3-18)

---

### 3. Losowanie z Tabeli

```http
POST /api/origins/:originId/tables/:tableName/roll
```

**Parametry:**
- `originId` - ID pochodzenia
- `tableName` - Nazwa tabeli (np. "wiek", "przeszlosc")

**Odpowiedź:**
```json
{
  "pochodzenie": {
    "id": "czlowiek",
    "nazwa": "Człowiek"
  },
  "tabela": {
    "nazwa": "Człowiek: wiek",
    "typ": "3k6",
    "opis": "Większość ludzi dożywa wieku około siedemdziesięciu lat."
  },
  "wynik": {
    "rzut": "10",
    "wynik": "Młody dorosły, 18–35 lat.",
    "wartosc_rzutu": 10,
    "efekt": null
  },
  "timestamp": "2025-10-06T08:40:00.239Z"
}
```

**Pola wyniku:**
- `rzut` - Wartość rzutu jako string
- `wynik` - Opis wyniku z tabeli
- `wartosc_rzutu` - Wartość numeryczna rzutu
- `efekt` - Efekt mechaniczny (jeśli dotyczy)

---

## 🎲 Efekty Mechaniczne

Niektóre wyniki w tabelach mają efekty mechaniczne wpływające na postać:

### Przykłady efektów:

```json
{
  "rzut": "1",
  "wynik": "Umarłeś i powróciłeś do żywych. Zaczynasz grę z 1k6 punktów Szaleństwa.",
  "efekt": {
    "szalenstwo": "1k6"
  }
}
```

```json
{
  "rzut": "2",
  "wynik": "Przez krótki czas byłeś opętany przez demona. Zaczynasz grę z 1 punktem Splugawienia.",
  "efekt": {
    "splugawienie": 1
  }
}
```

```json
{
  "rzut": "13",
  "wynik": "Odbyłeś wiele podróży w różne strony świata. Umiesz mówić w jednym dodatkowym języku.",
  "efekt": {
    "jezyk_dodatkowy": 1
  }
}
```

### Typy efektów:
- `szalenstwo` - Punkty szaleństwa (liczba lub "1k6")
- `splugawienie` - Punkty splugawienia (liczba)
- `jezyk_dodatkowy` - Dodatkowy język (liczba)
- `czytanie_pisanie` - Umiejętność czytania/pisania (język)
- `pieniadze` - Pieniądze startowe (np. "2k6_mc")

---

## 🔧 Funkcje Pomocnicze

### Walidacja Pochodzenia

```javascript
const { walidujPochodzenie } = require('./src/data/origins_extended');

const wynik = walidujPochodzenie(pochodzenie);
// {
//   poprawne: true,
//   bledy: [],
//   ostrzezenia: []
// }
```

### Losowanie z Tabeli

```javascript
const { losujZTabeli } = require('./src/data/origins_extended');

const wynik = losujZTabeli('3k6', tabela);
// {
//   rzut: "14",
//   wynik: "Dorosły w średnim wieku, 36–55 lat.",
//   wartosc_rzutu: 14
// }
```

---

## 📊 Przykłady Użycia

### 1. Pobierz listę pochodzeń

```bash
curl http://localhost:3000/api/origins
```

### 2. Pobierz tabele dla Człowieka

```bash
curl http://localhost:3000/api/origins/czlowiek/tables
```

### 3. Wylosuj wiek dla Człowieka

```bash
curl -X POST http://localhost:3000/api/origins/czlowiek/tables/wiek/roll
```

### 4. Wylosuj przeszłość dla Człowieka

```bash
curl -X POST http://localhost:3000/api/origins/czlowiek/tables/przeszlosc/roll
```

---

## ⚠️ Kody Błędów

### 404 - Nie znaleziono

```json
{
  "error": "Nieznane pochodzenie: nieistniejace",
  "dostepne": ["czlowiek"]
}
```

```json
{
  "error": "Tabela nieistniejaca nie istnieje dla pochodzenia czlowiek",
  "dostepne_tabele": ["wiek", "budowa_ciala", "wyglad", "przeszlosc", "osobowosc", "religia"]
}
```

### 400 - Błąd walidacji

```json
{
  "error": "Nieznany typ rzutu: k100",
  "timestamp": "2025-10-06T08:40:00.239Z"
}
```

### 500 - Błąd serwera

```json
{
  "error": "Nieprawidłowa tabela",
  "timestamp": "2025-10-06T08:40:00.239Z"
}
```

---

## 🧪 Testy

### Uruchomienie testów

```bash
npm test -- tests/api_origins.test.js
```

### Pokrycie testów

- ✅ Lista pochodzeń
- ✅ Pobieranie tabel
- ✅ Losowanie z tabel
- ✅ Walidacja błędów
- ✅ Efekty mechaniczne
- ✅ Struktura odpowiedzi

---

## 📈 Status Implementacji

| Pochodzenie | Status | Tabele | AC-010 | AC-012 | AC-013 |
|-------------|--------|--------|--------|--------|--------|
| **Człowiek** | ✅ Kompletne | 6 | ✅ | ✅ | ✅ |
| Automaton | ⏳ Planowane | 0 | ❌ | ❌ | ❌ |
| Goblin | ⏳ Planowane | 0 | ❌ | ❌ | ❌ |
| Krasnolud | ⏳ Planowane | 0 | ❌ | ❌ | ❌ |
| Odmieniec | ⏳ Planowane | 0 | ❌ | ❌ | ❌ |
| Ork | ⏳ Planowane | 0 | ❌ | ❌ | ❌ |

---

## 🔄 Roadmap

### Faza 1: Prototyp ✅
- [x] Struktura danych Człowieka
- [x] API endpointy
- [x] Funkcja losowania
- [x] Testy jednostkowe

### Faza 2: Migracja (Następna)
- [ ] Automaton (PG str. 13-15)
- [ ] Goblin (PG str. 16-17)
- [ ] Krasnolud (PG str. 18-20)
- [ ] Odmieniec (PG str. 20-21)
- [ ] Ork (PG str. 22-24)

### Faza 3: Frontend (Planowane)
- [ ] Rozwinięty kafelek pochodzenia
- [ ] Interfejs tabel losowania
- [ ] Integracja z kreatorem

---

## 📞 Wsparcie

- **Dokumentacja:** `docs/SPRINT2_ORIGINS_EXPANSION.md`
- **Mapowanie:** `docs/MAPOWANIE_PODRĘCZNIK_DANE.md`
- **Testy:** `tests/api_origins.test.js`
- **Kod:** `src/data/origins_extended.js`

---

**Ostatnia aktualizacja:** 6 października 2025  
**Autor:** @develop.mdc  
**Status:** Implementowane i przetestowane

