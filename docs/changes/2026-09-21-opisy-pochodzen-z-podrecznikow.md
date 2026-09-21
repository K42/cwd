# Krok 1: opisy pochodzeń oparte na faktach z podręczników

**Data:** 2026-09-21
**Dotyczy:** `createShortCollapsedDescription()` i `createExtendedDescription()` (Krok 1, opisy w kafelkach pochodzeń)

## Co się zmieniło

Opisy pochodzeń (krótki - stan zwinięty, rozszerzony - stan rozwinięty)
były generycznymi fantasy sztampkami niezweryfikowanymi wobec podręczników
("Ich społeczeństwa są chaotyczne i oparte na sile, gdzie tylko najsilniejsi
przetrwają", "Ich społeczeństwa cenią współpracę, uczciwość i dbałość o
szczegóły" - te same, wymienne frazy dla różnych ras). Oba opisy dla
wszystkich 17 pochodzeń napisane na nowo na podstawie realnych fragmentów
podręczników (`sources/*.md` dla sześciu ksiąg z transkrypcją; dla Chwalebnej
Śmierci - bez transkrypcji - bezpośredni odczyt stron 6-8 PDF-a):

- **Krótki opis** - jedno, nieco dłuższe zdanie niż poprzednio, wciąż
  eliptyczne (bez czasownika-kopuły, jak podpis pod ilustracją), ale oparte
  na konkretnym fakcie z podręcznika, nie ogólniku.
- **Rozszerzony opis** - 2-3 zdania, w każdym opisie co najmniej jedna
  konkretna ciekawostka z podręcznika (nie sparafrazowana zasada mechaniczna,
  ale fragment fabularny/fluffowy). Przykłady: automatony trzeba nakręcać
  kluczem, inaczej zapadają w uśpienie; chochliki są niewidzialne dla
  większości stworzeń, ale widzą je dzieci i szaleńcy; hobgobliny wierzą, że
  dzielą jedną duszę, więc się nie boją śmierci; orki powstały z pojmanych
  jotunów, których Imperium czarną magią odarło z człowieczeństwa - fakt
  połączony też z opisem jotunów, żeby czytelnik zobaczył tę samą historię
  z obu stron.

## Dlaczego

Prośba użytkownika: "popraw opisy pochodzeń. krótkie niech będą jednym
nieco dłuższym zdaniem natomiast w długich zawsze dodaj kilka ciekawostek z
podręcznika. postaraj się o poprawną polszczyznę i zachowanie klimatu
podręcznika."

## Jak przetestowano

- **Jednostkowo / lint**: `npm test` (155/155), `npm run lint` (czysto) -
  zmiana dotyczy tylko literalnych stringów opisów, żaden test nie sprawdza
  ich treści (istniejący test `origins_extended.test.js` sprawdza inne pole
  danych - `HUMAN_EXTENDED.opis`/`opis_pelny` z `data/origins.js`, nie te
  funkcje).
- **Empirycznie (Playwright)**: odczytano wszystkie 17 krótkich opisów w
  stanie zwiniętym oraz rozszerzone opisy czterech pochodzeń o różnym
  charakterze (ork, jotunn, inkarnacja, chochlik) po rozwinięciu - treść
  renderuje się poprawnie w obu miejscach, zero błędów konsoli.

## Wpływ na eksport/import

Brak - opisy są generowane statycznie z id pochodzenia, nie są zapisywane
w danych postaci.
