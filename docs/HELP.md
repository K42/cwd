# 📖 Pomoc - Kreator Postaci

Witaj w kreatorze postaci dla gry "Cień Władcy Demonów"! Ten przewodnik pomoże Ci stworzyć Twoją pierwszą postać.

---

## 🎯 Szybki Start

### 1. Wybierz Pochodzenie (Krok 1)

**Pochodzenie** to rasa Twojej postaci - może to być człowiek, elf, krasnolud, goblin i wiele innych (17 opcji).

**Jak wybrać?**
1. **Przeglądaj kafelki** - Kliknij dowolny kafelek aby zobaczyć szczegóły
2. **Czytaj opisy** - Każde pochodzenie ma unikalny opis, atrybuty i cechy specjalne
3. **Wybierz** - Kliknij przycisk "Wybierz [Nazwa]" na rozwiniętym kafelku
4. **Idź dalej** - Kliknij "Dalej →" na dole strony

**Co warto wiedzieć?**
- **Rozmiar** (1/4, 1/2, 1, 2) - Wpływa na modyfikatory i obronę
- **Prędkość** - Ile metrów możesz przejść w jednej rundzie walki
- **Języki** - Jakie języki znasz od początku
- **Profesje** - W czym jesteś wykształcony
- **Cechy specjalne** - Unikalne zdolności Twojego pochodzenia

**Rekomendacje dla początkujących:**
- 👤 **Człowiek** - Wszechstronny, bez skomplikowanych zasad
- ⚔️ **Krasnolud** - Odporny, świetny dla wojowników
- ✨ **Elf** - Magiczny, dobry dla magów i łuczników

---

### 2. Określ Atrybuty i Poziom (Krok 2)

#### A. Wybierz Poziom Postaci (0-10)

**Poziom** określa jak doświadczona jest Twoja postać i jakie ma opcje rozwoju.

**Poziomy dla początkujących:**
- **Poziom 0 (Start)** - Zupełnie nowa postać, bez żadnych ścieżek
- **Poziom 1 (Nowicjusz)** - Wybierasz pierwszą ścieżkę (np. Wojownik, Mag)

**Zaawansowane poziomy:**
- **Poziom 3 (Ekspert)** - Wybierasz drugą, ekspercką ścieżkę
- **Poziom 7 (Mistrz)** - Wybierasz trzecią, mistrzowską ścieżkę
- **Poziomy 2, 4, 6, 8** - Kontynuacja poprzednich ścieżek
- **Poziomy 9-10** - Najwyższe poziomy rozwoju

**Jak wybrać?**
- Kliknij kartę z wybranym poziomem (np. "Poziom 1: Nowicjusz")
- Lista dostępnych ścieżek pojawi się automatycznie poniżej

#### B. Wybierz Ścieżkę (jeśli dostępna)

**Ścieżka** to klasa/profesja Twojej postaci.

**Ścieżki Nowicjusza (Poziom 1):**
- ⚔️ **Wojownik** - Specjalista walki wręcz i obrony
- 🔮 **Mag** - Rzuca zaklęcia arcane
- 🕊️ **Kapłan** - Uzdrawia i wspiera sojuszników
- 🗡️ **Łotr** - Skryty, zręczny, niebezpieczny

**Wybierz ścieżkę** z rozwijanej listy. Zobaczysz co otrzymasz (Zdrowie, Talenty, Magia).

#### C. Ustaw Atrybuty

**Atrybuty** to główne statystyki postaci:

| Atrybut | Co określa? | Przykłady użycia |
|---------|-------------|-------------------|
| **Siła** | Zdrowie, udźwig, obrażenia wręcz | Podnoszenie, walka mieczem |
| **Zręczność** | Obrona, inicjatywa, precyzja | Uniki, strzały z łuku |
| **Intelekt** | Percepcja, wiedza, moc zaklęć | Zauważanie, rzucanie czarów |
| **Wola** | Odporność na magię, siła charakteru | Opieranie się urokom |

**Dwie opcje:**

**Opcja 1: Domyślne atrybuty (Zalecane dla początkujących)**
- Zostaw zaznaczony checkbox "Użyj domyślnych wartości"
- Atrybuty będą automatycznie obliczone: 10, 10, 10, 10 + modyfikatory pochodzenia

**Opcja 2: Własne atrybuty (Zaawansowane)**
- Odznacz checkbox
- Ustaw własne wartości (3-18) dla każdego atrybutu
- Pamiętaj: możesz **raz** obniżyć jeden atrybut o 1 i podnieść inny o 1

**Finalne atrybuty:**
Sekcja "Obliczone atrybuty" pokazuje wartości końcowe z modyfikatorami pochodzenia:

```
Siła:  12  (+2)
       ^^   ^^
       |    modyfikator z pochodzenia
       wartość finalna
```

**Kliknij "Dalej →"** aby przejść do podsumowania.

---

### 3. Podsumowanie i Tworzenie (Krok 3)

**Sprawdź podgląd** - Zobacz wszystkie dane Twojej postaci:
- Atrybuty podstawowe (Siła, Zręczność, Intelekt, Wola)
- Atrybuty drugorzędne (Obrona, Zdrowie, Percepcja, Szybkość Zdrowienia)
- Szczegóły (Rozmiar, Prędkość, Języki, Profesje)

**Utwórz postać** - Kliknij **"🎲 Utwórz Postać"**

**Zapisz postać** - Kliknij **"💾 Eksportuj JSON"** aby pobrać plik z postacią

---

## 📊 Słownik Pojęć

### Atrybuty Podstawowe
- **Siła (STR)** - Fizyczna moc, zdolność do noszenia, obrażenia wręcz
- **Zręczność (DEX)** - Zwinność, refleks, precyzja ataków dystansowych
- **Intelekt (INT)** - Inteligencja, wiedza, moc zaklęć
- **Wola (WIL)** - Siła woli, odporność mentalna

### Atrybuty Drugorzędne (Obliczane automatycznie)

**🛡️ Obrona**
- Bazowa wartość: **Zręczność**
- Co to znaczy? Jak trudno Cię trafić w walce
- Wyższa = lepiej

**❤️ Zdrowie**
- Bazowa wartość: **Siła** + bonusy ze ścieżek
- Co to znaczy? Ile obrażeń możesz przyjąć zanim upadniesz
- Wyższe = lepiej

**👁️ Percepcja**
- Bazowa wartość: **Intelekt**
- Co to znaczy? Jak dobrze zauważasz ukryte rzeczy
- Wyższa = lepiej

**💚 Szybkość Zdrowienia**
- Wzór: **Siła ÷ 4** (zaokrąglone w dół, minimum 1)
- Co to znaczy? Ile punktów zdrowia odzyskujesz po odpoczynku
- Przykład: Siła 12 → Szybkość Zdrowienia 3

**🏃 Prędkość**
- Pochodzi z pochodzenia (zwykle 10)
- Co to znaczy? Ile metrów możesz przejść w jednej rundzie (6 sekund)
- Standardowa prędkość człowieka: 10 metrów/rundę

**📏 Rozmiar**
- Pochodzi z pochodzenia
- Opcje: 1/4 (malutki), 1/2 (mały), 1 (normalny), 2 (duży)
- Wpływa na niektóre mechaniki gry

**✨ Moc**
- Dla postaci magicznych
- Co to znaczy? Punkty magii do rzucania zaklęć
- Zwiększa się ze ścieżkami magicznymi

---

## ❓ Często Zadawane Pytania (FAQ)

### Podstawy

**P: Jak zmienić wybrane pochodzenie?**  
O: Kliknij przycisk **"← Wstecz"** na dole strony aby wrócić do kroku 1.

**P: Czy mogę zapisać postać w trakcie tworzenia?**  
O: Nie, musisz dokończyć wszystkie kroki. Jednak jest to szybki proces (2-3 minuty).

**P: Czy mogę edytować postać po utworzeniu?**  
O: Obecnie nie. Edycja będzie dostępna w przyszłych wersjach. Możesz jednak stworzyć nową postać.

### Pochodzenie

**P: Które pochodzenie jest najlepsze?**  
O: Nie ma "najlepszego" - każde ma swoje mocne strony:
- **Dla początkujących**: Człowiek (wszechstronny)
- **Dla wojowników**: Krasnolud, Ork, Jötunn
- **Dla magów**: Elf, Odmieniec
- **Dla skrytych**: Goblin, Nizioł, Chochlik

**P: Co znaczy "Rozmiar 2"?**  
O: Postać jest większa od normalnej (np. Jötunn to gigant). Większy rozmiar może dawać bonusy do siły, ale utrudnia ukrywanie się.

**P: Czy mogę zmienić pochodzenie w trakcie gry?**  
O: Nie, pochodzenie jest stałe. To podstawowa cecha postaci.

### Atrybuty

**P: Jakie atrybuty wybrać dla wojownika?**  
O: Priorytet: **Siła** (obrażenia, zdrowie) i **Zręczność** (obrona). Wola też jest ważna.

**P: Jakie atrybuty wybrać dla maga?**  
O: Priorytet: **Intelekt** (moc zaklęć) i **Wola** (odporność). Zręczność pomaga w obronie.

**P: Co jeśli wszystkie moje atrybuty są niskie?**  
O: Przy domyślnych atrybutach (10, 10, 10, 10) + modyfikatory pochodzenia, atrybuty są zbalansowane. Możesz też wybrać własne wartości.

**P: Jak działa "domyślne atrybuty"?**  
O: System ustawia bazowe wartości (10, 10, 10, 10) i dodaje modyfikatory z Twojego pochodzenia. To najprostszy sposób dla początkujących.

### Poziomy i Ścieżki

**P: Czy mogę mieć więcej niż jedną ścieżkę?**  
O: Tak! To jest sedno rozwoju postaci:
- **Poziom 1**: 1. ścieżka (Nowicjusz)
- **Poziom 3**: 2. ścieżka (Ekspert)
- **Poziom 7**: 3. ścieżka (Mistrz)

**P: Co to znaczy "Kontynuacja Nowicjusza"?**  
O: Na poziomie 2 otrzymujesz dodatkowe korzyści ze ścieżki nowicjusza (więcej zdrowia, talentów).

**P: Którą ścieżkę wybrać jako pierwszą?**  
O: Zależy od stylu gry:
- **Wojownik** - Walka wręcz, wysoka obrona
- **Mag** - Zaklęcia atakujące i użytkowe
- **Kapłan** - Uzdrawianie, wsparcie drużyny
- **Łotr** - Skradanie, zaskakiwanie

### Eksport i Zapis

**P: Jak działa eksport postaci?**  
O: Po kliknięciu "💾 Eksportuj JSON" pobierze się plik tekstowy (JSON) z wszystkimi danymi postaci. Możesz go:
- Otworzyć w notatniku/edytorze
- Zachować jako backup
- Udostępnić Mistrzowi Gry
- (Wkrótce) Importować z powrotem do kreatora

**P: Czy mogę importować zapisane postacie?**  
O: Jeszcze nie, ale funkcja importu jest planowana w wersji 1.1.

**P: Czy jest eksport do PDF?**  
O: Jeszcze nie, ale funkcja eksportu PDF jest planowana w wersji 1.1.

---

## 🔧 Rozwiązywanie Problemów

### Aplikacja nie działa

**Problem**: Strona się nie ładuje  
**Rozwiązanie**:
1. Sprawdź czy serwer działa - w konsoli powinno być: `"Kreator postaci działa na porcie 3000"`
2. Otwórz przeglądarkę na `http://localhost:3000`
3. Jeśli serwer nie działa, uruchom: `npm start`

**Problem**: Kafelki pochodzeń nie pojawiają się  
**Rozwiązanie**:
1. Odśwież stronę (F5)
2. Sprawdź konsolę przeglądarki (F12) → zakładka "Console"
3. Szukaj błędów (czerwone napisy)
4. Jeśli widzisz błąd API - sprawdź czy serwer działa

**Problem**: Przycisk "Dalej" jest nieaktywny  
**Rozwiązanie**:
- **Krok 1**: Musisz najpierw wybrać pochodzenie (kliknij "Wybierz")
- **Krok 2**: Musisz najpierw przydzielić wszystkie punkty atrybutów (jeśli widzisz interaktywny wybór)

### Problemy z danymi

**Problem**: Po kliknięciu "Utwórz Postać" pojawia się błąd  
**Rozwiązanie**:
1. Sprawdź czy wybrałeś pochodzenie
2. Sprawdź czy atrybuty są w prawidłowym zakresie (3-18)
3. Odśwież stronę i spróbuj ponownie

**Problem**: Eksport JSON nie działa  
**Rozwiązanie**:
1. Sprawdź czy przeglądarka nie blokuje pobierania (zobacz górny pasek)
2. Sprawdź ustawienia przeglądarki - czy pobieranie plików jest dozwolone
3. Spróbuj innej przeglądarki (Chrome, Firefox, Edge)

---

## 💡 Wskazówki dla Mistrza Gry

### Szybkie tworzenie NPC

1. Wybierz pochodzenie pasujące do koncepcji NPC
2. Użyj **Poziomu 0** dla prostych NPC
3. Użyj **Poziomów 1-3** dla ważniejszych NPC
4. Użyj domyślnych atrybutów dla szybkości
5. Eksportuj do JSON i zachowaj w folderze sesji

### Balansowanie spotkań

**Poziom postaci graczy → Poziom NPC**:
- Gracze poziom 1 → NPC poziom 0-1
- Gracze poziom 3 → NPC poziom 1-3
- Gracze poziom 7+ → NPC poziom 3+

### Tworzenie różnorodnych grup

Używaj różnych pochodzeń dla NPC:
- **Bandy goblinów** - Goblin (poziom 0-1)
- **Strażnicy** - Człowiek, Wojownik (poziom 1)
- **Szlachta** - Człowiek, różne ścieżki (poziom 3+)
- **Potwory** - Ork, Fomor, Warg (różne poziomy)

---

## 📞 Wsparcie

### W przypadku problemów:

1. **Sprawdź dokumentację** - [APLIKACJA.md](APLIKACJA.md)
2. **Sprawdź konsolę** - F12 w przeglądarce → zakładka "Console"
3. **Odśwież stronę** - F5
4. **Restart serwera** - Zatrzymaj (Ctrl+C) i uruchom ponownie (`npm start`)
5. **Zgłoś problem** - GitHub Issues (jeśli dostępne)

### Informacje potrzebne przy zgłaszaniu problemu:

- System operacyjny (Windows, macOS, Linux)
- Przeglądarka i wersja (Chrome 120, Firefox 115, itp.)
- Opis problemu (co się stało?)
- Kroki do odtworzenia (jak wywołać problem?)
- Komunikaty błędów (skopiuj z konsoli)

---

## 🎓 Dodatkowe Zasoby

### Oficjalne materiały:
- Podręcznik główny "Cień Władcy Demonów"
- Suplementy: Chwalebna Śmierć, Straszliwe Piękno, Rozkoszna Agonia

### Dokumentacja projektu:
- **[README.md](../README.md)** - Ogólny przegląd projektu
- **[APLIKACJA.md](APLIKACJA.md)** - Pełna dokumentacja techniczna
- **[ARCHITECTURE.md](../ARCHITECTURE.md)** - Architektura systemu

---

**Miłej zabawy w tworzeniu postaci!** 🎲⚔️🔮

*Wersja pomocy: 1.0 | Data: 6 października 2025*

