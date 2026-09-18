/**
 * Moduł z treścią pomocy dla lightboxa
 * Zawiera wszystkie teksty i strukturę pomocy
 */

/**
 * Generuje treść zakładki "Szybki Start"
 * @returns {string} HTML z treścią
 */
function getStartContent() {
  return `
    <h4><svg class="icon"><use href="#icon-torch"></use></svg> Jak utworzyć postać?</h4>
    
    <div class="help-step">
      <div class="help-step-header">
        <span class="help-step-number">1</span>
        <h5>Wybierz Pochodzenie</h5>
      </div>
      <p><strong>Pochodzenie</strong> to rasa Twojej postaci - człowiek, elf, krasnolud, goblin i wiele innych (17 opcji).</p>
      <ul>
        <li><strong>Przeglądaj kafelki</strong> - Kliknij dowolny kafelek aby zobaczyć szczegóły</li>
        <li><strong>Czytaj opisy</strong> - Każde pochodzenie ma unikalny opis, atrybuty i cechy specjalne</li>
        <li><strong>Wybierz</strong> - Kliknij przycisk "Wybierz [Nazwa]" na rozwiniętym kafelku</li>
        <li><strong>Idź dalej</strong> - Kliknij "Dalej <svg class="icon"><use href="#icon-chevron-right"></use></svg>" na dole strony</li>
      </ul>
      <div class="help-tip">
        <strong><svg class="icon"><use href="#icon-tip"></use></svg> Rekomendacje dla początkujących:</strong><br>
        <svg class="icon"><use href="#icon-person"></use></svg> <strong>Człowiek</strong> - Wszechstronny, bez skomplikowanych zasad<br>
        <svg class="icon"><use href="#icon-swords"></use></svg> <strong>Krasnolud</strong> - Odporny, świetny dla wojowników<br>
        <svg class="icon"><use href="#icon-sparkle"></use></svg> <strong>Elf</strong> - Magiczny, dobry dla magów i łuczników
      </div>
    </div>

    <div class="help-step">
      <div class="help-step-header">
        <span class="help-step-number">2</span>
        <h5>Określ Atrybuty i Poziom</h5>
      </div>
      <p><strong>Poziom</strong> określa doświadczenie postaci (0-10):</p>
      <ul>
        <li><strong>Poziom 0 (Start)</strong> - Zupełnie nowa postać, bez ścieżek</li>
        <li><strong>Poziom 1 (Nowicjusz)</strong> - Wybierasz pierwszą ścieżkę (Wojownik, Mag, Kapłan, Łotr)</li>
        <li><strong>Poziom 3 (Ekspert)</strong> - Wybierasz drugą, ekspercką ścieżkę</li>
        <li><strong>Poziom 7 (Mistrz)</strong> - Wybierasz trzecią, mistrzowską ścieżkę</li>
      </ul>
      <p><strong>Atrybuty</strong> możesz ustawić na dwa sposoby:</p>
      <ul>
        <li><strong>Domyślne</strong> (zalecane) - Wartości bazowe wynikające z pochodzenia, bez żadnych zmian</li>
        <li><strong>Zmiana wartości</strong> (opcjonalna) - Jeden raz możesz obniżyć jeden atrybut o 1 i podnieść inny o 1 (odblokuje się po odznaczeniu "Użyj domyślnych wartości")</li>
      </ul>
    </div>

    <div class="help-step">
      <div class="help-step-header">
        <span class="help-step-number">3</span>
        <h5>Ścieżki</h5>
      </div>
      <p>Na poziomach 1, 3 i 7 wybierasz ścieżkę - kolejne sekcje (Nowicjusza, Ekspercka, Mistrzowska) odblokowują się w miarę zwiększania poziomu w Kroku 2.</p>
    </div>

    <div class="help-step">
      <div class="help-step-header">
        <span class="help-step-number">4</span>
        <h5>Rozwój Atrybutów</h5>
      </div>
      <p>Niektóre wybrane ścieżki pozwalają dodatkowo zwiększyć atrybuty:</p>
      <ul>
        <li><strong>Ścieżki eksperckie</strong> (poziom 3) dają zawsze 2 punkty, <strong>mistrzowskie</strong> (poziom 7) - 3 punkty</li>
        <li>Punkty możesz rozłożyć na różne atrybuty albo połączyć na jednym (np. +2 do Siły z jednej ścieżki)</li>
        <li>Ten krok pojawia się zawsze, ale jeśli żadna wybrana ścieżka nie daje punktów, wystarczy kliknąć "Dalej"</li>
      </ul>
    </div>

    <div class="help-step">
      <div class="help-step-header">
        <span class="help-step-number">5</span>
        <h5>Profesje, Języki i Kurioza</h5>
      </div>
      <p>Rozdzielasz sloty przyznane przez pochodzenie i ścieżki - każdy pokazuje w nawiasie, z jakiego wyboru pochodzi (np. "Ścieżka: Łotr (poziom 1)"). Zależnie od slotu możesz wybrać profesję z określonej kategorii, nowy język do mówienia albo pismo w już znanym języku.</p>
      <ul>
        <li><strong><svg class="icon"><use href="#icon-dice"></use></svg> Losuj pozostałe</strong> - losuje tylko nierozdane sloty; jeśli już wybrałeś tryb (np. "Nowy język") bez wskazania wartości, losowanie dobierze wartość w tym trybie, nie zmieni go</li>
        <li><strong>Wyczyść</strong> - mały przycisk przy każdej karcie/sekcji czyści tylko jej wybór, nie wpływając na resztę</li>
      </ul>
    </div>

    <div class="help-step">
      <div class="help-step-header">
        <span class="help-step-number">6</span>
        <h5>Magia - tradycje i zaklęcia (opcjonalnie)</h5>
      </div>
      <p>Jeśli twoje pochodzenie lub wybrane ścieżki przyznają magię, ten krok pokazuje wyłącznie te korzyści, na które faktycznie zasługuje twoja postać - każda karta to jeden wybór (nowa tradycja i/lub zaklęcie), zgodny z zasadami podręcznika.</p>
      <ul>
        <li>Ten krok jest <strong>całkowicie opcjonalny</strong> - "Dalej" nigdy nie jest zablokowane, więc postać bez magii może go pominąć bez wybierania niczego</li>
        <li>Przyciski <strong>"Wybierz tradycję"</strong>/<strong>"Wybierz zaklęcie"</strong> otwierają popup z wyszukiwaniem i kafelkami do wyboru, ograniczonymi do tego, co faktycznie dostępne (znane tradycje, krąg nie wyższy niż Moc)</li>
        <li>Poznanie nowej tradycji pozwala też wybrać jej darmowe zaklęcie kręgu 0</li>
        <li>Każde zaklęcie ma etykietę źródła (np. "PG" - Podręcznik Główny) z podpowiedzią pełnej nazwy podręcznika po najechaniu</li>
      </ul>
    </div>

    <div class="help-step">
      <div class="help-step-header">
        <span class="help-step-number">7</span>
        <h5>Ekwipunek</h5>
      </div>
      <p>Ustalasz początkowe wyposażenie postaci zgodnie z zasadami podręcznika głównego (kurioza są ustalane osobno, w Kroku 5):</p>
      <ul>
        <li><strong>Zamożność</strong> - wybierz kafelek ręcznie albo kliknij <strong>"<svg class="icon"><use href="#icon-dice"></use></svg> Losuj (3k6)"</strong>, by wylosować ją zgodnie z tabelą z podręcznika. Każdy poziom Zamożności przyznaje inny zestaw sprzętu i losową startową gotówkę</li>
        <li><strong>Wyposażenie startowe</strong> - gwarantowane pozycje pojawiają się automatycznie; tam, gdzie podręcznik daje wybór (np. kostur / pałka / proca), klikasz jedną z kafelkowych opcji. Jedna z opcji wyższych poziomów Zamożności to zwój z zaklęciem kręgu 0 - otwiera ten sam popup wyboru tradycji/zaklęcia co Krok 6</li>
        <li><strong>Sklep</strong> - po otrzymaniu wyposażenia startowego możesz sprzedać dowolną pozycję za połowę jej ceny bazowej albo kliknąć <strong>"<svg class="icon"><use href="#icon-cart"></use></svg> Przeglądaj katalog"</strong>, by kupić cokolwiek innego z pełnej listy przedmiotów (z filtrami na kategorię i rzadkość). Gotówka uwzględnia startową sakiewkę, wpływy ze sprzedaży oraz srebrniki wylosowane w Kroku 2 (jeśli poziom postaci jest wyższy niż 0)</li>
        <li>Zakupione przedmioty można w każdej chwili zwrócić za pełną cenę przyciskiem "Zwróć"</li>
      </ul>
    </div>

    <div class="help-step">
      <div class="help-step-header">
        <span class="help-step-number">8</span>
        <h5>Podgląd i Eksport</h5>
      </div>
      <p>Ostatni krok pokazuje kompletną kartę postaci ze wszystkimi wybranymi opcjami:</p>
      <ul>
        <li>Podgląd aktualizuje się na bieżąco - nie trzeba niczego "zatwierdzać"</li>
        <li>Kliknij <strong>"<svg class="icon"><use href="#icon-page"></use></svg> Eksportuj do JSON"</strong> aby zapisać postać na dysku</li>
      </ul>
    </div>
  `;
}

/**
 * Generuje treść zakładki "Słownik"
 * @returns {string} HTML z treścią
 */
function getGlossaryContent() {
  return `
    <h4><svg class="icon"><use href="#icon-book"></use></svg> Słownik Pojęć</h4>

    <div class="glossary-section">
      <h5>Atrybuty Podstawowe</h5>
      
      <div class="glossary-item">
        <div class="glossary-term">Siła (STR)</div>
        <div class="glossary-def">
          <p><strong>Co określa:</strong> Fizyczna moc, zdolność do noszenia, obrażenia wręcz</p>
          <p><strong>Przykłady:</strong> Podnoszenie ciężarów, walka mieczem, łamanie przedmiotów</p>
          <p><strong>Obliczenia:</strong></p>
          <ul>
            <li>Zdrowie = Siła</li>
            <li>Szybkość Zdrowienia = Siła ÷ 4 (zaokrąglone w dół, min. 1)</li>
          </ul>
        </div>
      </div>

      <div class="glossary-item">
        <div class="glossary-term">Zręczność (DEX)</div>
        <div class="glossary-def">
          <p><strong>Co określa:</strong> Zwinność, refleks, precyzja ataków dystansowych</p>
          <p><strong>Przykłady:</strong> Uniki, strzały z łuku, akrobacje, skradanie</p>
          <p><strong>Obliczenia:</strong></p>
          <ul>
            <li>Obrona = Zręczność</li>
            <li>Inicjatywa = Zręczność</li>
          </ul>
        </div>
      </div>

      <div class="glossary-item">
        <div class="glossary-term">Intelekt (INT)</div>
        <div class="glossary-def">
          <p><strong>Co określa:</strong> Inteligencja, wiedza, moc zaklęć</p>
          <p><strong>Przykłady:</strong> Rozwiązywanie zagadek, znajomość języków, rzucanie czarów</p>
          <p><strong>Obliczenia:</strong></p>
          <ul>
            <li>Percepcja = Intelekt</li>
            <li>Moc zaklęć = Intelekt (dla niektórych tradycji)</li>
          </ul>
        </div>
      </div>

      <div class="glossary-item">
        <div class="glossary-term">Wola (WIL)</div>
        <div class="glossary-def">
          <p><strong>Co określa:</strong> Siła woli, odporność mentalna, charyzma</p>
          <p><strong>Przykłady:</strong> Opieranie się urokom, przekonywanie, odporność na strach</p>
          <p><strong>Obliczenia:</strong></p>
          <ul>
            <li>Odporność na zaklęcia = Wola</li>
          </ul>
        </div>
      </div>
    </div>

    <div class="glossary-section">
      <h5>Atrybuty Drugorzędne</h5>
      
      <div class="glossary-item">
        <div class="glossary-term"><svg class="icon"><use href="#icon-heart"></use></svg> Zdrowie</div>
        <div class="glossary-def">
          <p><strong>Wzór:</strong> Siła + bonusy ze ścieżek</p>
          <p><strong>Co to znaczy:</strong> Ile obrażeń możesz przyjąć zanim upadniesz</p>
          <p><strong>Przykład:</strong> Siła 12 + Wojownik (+6) = 18 Zdrowia</p>
        </div>
      </div>

      <div class="glossary-item">
        <div class="glossary-term"><svg class="icon"><use href="#icon-shield"></use></svg> Obrona</div>
        <div class="glossary-def">
          <p><strong>Wzór:</strong> Zręczność</p>
          <p><strong>Co to znaczy:</strong> Jak trudno Cię trafić w walce (cel dla rzutów ataku)</p>
          <p><strong>Przykład:</strong> Zręczność 14 = Obrona 14</p>
        </div>
      </div>

      <div class="glossary-item">
        <div class="glossary-term"><svg class="icon"><use href="#icon-eye"></use></svg> Percepcja</div>
        <div class="glossary-def">
          <p><strong>Wzór:</strong> Intelekt</p>
          <p><strong>Co to znaczy:</strong> Jak dobrze zauważasz ukryte rzeczy</p>
          <p><strong>Przykład:</strong> Intelekt 11 = Percepcja 11</p>
        </div>
      </div>

      <div class="glossary-item">
        <div class="glossary-term"><svg class="icon"><use href="#icon-pulse"></use></svg> Szybkość Zdrowienia</div>
        <div class="glossary-def">
          <p><strong>Wzór:</strong> Siła ÷ 4 (zaokrąglone w dół, minimum 1)</p>
          <p><strong>Co to znaczy:</strong> Ile punktów zdrowia odzyskujesz po odpoczynku</p>
          <p><strong>Przykład:</strong> Siła 12 → 12÷4 = 3 punkty zdrowienia</p>
        </div>
      </div>

      <div class="glossary-item">
        <div class="glossary-term"><svg class="icon"><use href="#icon-speed"></use></svg> Prędkość</div>
        <div class="glossary-def">
          <p><strong>Źródło:</strong> Pochodzenie (zwykle 10)</p>
          <p><strong>Co to znaczy:</strong> Ile metrów możesz przejść w jednej rundzie (6 sekund)</p>
          <p><strong>Przykład:</strong> Człowiek: 10 m/rundę, Jotun: 12 m/rundę</p>
        </div>
      </div>

      <div class="glossary-item">
        <div class="glossary-term"><svg class="icon"><use href="#icon-ruler"></use></svg> Rozmiar</div>
        <div class="glossary-def">
          <p><strong>Opcje:</strong> 1/4 (malutki), 1/2 (mały), 1 (normalny), 2 (duży)</p>
          <p><strong>Co to znaczy:</strong> Fizyczny rozmiar postaci</p>
          <p><strong>Wpływ:</strong> Może modyfikować niektóre mechaniki (ukrywanie, cel ataku)</p>
        </div>
      </div>

      <div class="glossary-item">
        <div class="glossary-term"><svg class="icon"><use href="#icon-sparkle"></use></svg> Moc</div>
        <div class="glossary-def">
          <p><strong>Źródło:</strong> Ścieżki magiczne</p>
          <p><strong>Co to znaczy:</strong> Punkty magii do rzucania zaklęć</p>
          <p><strong>Przykład:</strong> Mag (poziom 1) = 1 punkt mocy</p>
        </div>
      </div>
    </div>

    <div class="glossary-section">
      <h5>Pozostałe Terminy</h5>
      
      <div class="glossary-item">
        <div class="glossary-term">Pochodzenie</div>
        <div class="glossary-def">
          <p>Rasa postaci (człowiek, elf, krasnolud, itp.). Określa początkowe atrybuty, języki, profesje i cechy specjalne.</p>
        </div>
      </div>

      <div class="glossary-item">
        <div class="glossary-term">Ścieżka</div>
        <div class="glossary-def">
          <p>Klasa/profesja postaci. Wybierana na poziomach: 1 (Nowicjusz), 3 (Ekspert), 7 (Mistrz). Przykłady: Wojownik, Mag, Kapłan.</p>
        </div>
      </div>

      <div class="glossary-item">
        <div class="glossary-term">Poziom</div>
        <div class="glossary-def">
          <p>Doświadczenie postaci (0-10). Każdy poziom daje nowe korzyści: atrybuty, talenty, zaklęcia.</p>
        </div>
      </div>
    </div>
  `;
}

/**
 * Generuje treść zakładki "FAQ"
 * @returns {string} HTML z treścią
 */
function getFAQContent() {
  return `
    <h4><svg class="icon"><use href="#icon-question"></use></svg> Często Zadawane Pytania</h4>

    <div class="faq-section">
      <h5>Podstawy</h5>
      
      <div class="faq-item">
        <div class="faq-question">Jak zmienić wybrane pochodzenie?</div>
        <div class="faq-answer">
          Kliknij przycisk <strong>"<svg class="icon"><use href="#icon-chevron-left"></use></svg> Wstecz"</strong> na dole strony aby wrócić do kroku 1, albo skorzystaj z małego przycisku <strong>"Wyczyść wybór"</strong> nad kafelkami pochodzenia.
        </div>
      </div>

      <div class="faq-item">
        <div class="faq-question">Jak wyczyścić tylko jeden wybór, bez resetowania całej postaci?</div>
        <div class="faq-answer">
          Każda sekcja wyboru (pochodzenie, poziom, ścieżka, atrybuty, profesja, język, kurioza) ma własny, mały przycisk <strong>"Wyczyść"</strong> - czyści tylko tę jedną sekcję, nie wpływając na resztę postaci.
        </div>
      </div>

      <div class="faq-item">
        <div class="faq-question">Czy mogę zapisać postać w trakcie tworzenia?</div>
        <div class="faq-answer">
          Musisz najpierw dotrzeć do Kroku 8 (co wymaga ukończenia wymaganych wyborów po drodze), ale stamtąd możesz w każdej chwili wyeksportować postać do pliku JSON - podgląd aktualizuje się na bieżąco, bez osobnego "zatwierdzania". Zapisany plik możesz później wczytać przyciskiem "<svg class="icon"><use href="#icon-folder"></use></svg> Importuj postać" w Kroku 1, żeby kontynuować od tego samego miejsca.
        </div>
      </div>

      <div class="faq-item">
        <div class="faq-question">Czy mogę edytować postać po utworzeniu?</div>
        <div class="faq-answer">
          Tak - wyeksportuj postać do JSON (Krok 8), a następnie zaimportuj ją ponownie przyciskiem "<svg class="icon"><use href="#icon-folder"></use></svg> Importuj postać" w Kroku 1. Wszystkie wybory zostaną odtworzone i możesz przejść przez dowolny krok, żeby je zmienić.
        </div>
      </div>

      <div class="faq-item">
        <div class="faq-question">Muszę wybrać magię w Kroku 6?</div>
        <div class="faq-answer">
          Nie. Krok 6 jest w pełni opcjonalny - możesz kliknąć "Dalej" bez rozwiązania żadnej karty, niezależnie od tego, czy twoja postać posługuje się magią. Wybrane tradycje i zaklęcia trafiają do Karty Postaci jako lista informacyjna.
        </div>
      </div>
    </div>

    <div class="faq-section">
      <h5>Pochodzenie</h5>
      
      <div class="faq-item">
        <div class="faq-question">Które pochodzenie jest najlepsze?</div>
        <div class="faq-answer">
          Nie ma "najlepszego" - każde ma swoje mocne strony:<br>
          • <strong>Dla początkujących:</strong> Człowiek (wszechstronny)<br>
          • <strong>Dla wojowników:</strong> Krasnolud, Ork, Jotun<br>
          • <strong>Dla magów:</strong> Elf, Odmieniec<br>
          • <strong>Dla skrytych:</strong> Goblin, Nizioł, Chochlik
        </div>
      </div>

      <div class="faq-item">
        <div class="faq-question">Co znaczy "Rozmiar 2"?</div>
        <div class="faq-answer">
          Postać jest większa od normalnej (np. Jotun to gigant). Większy rozmiar może dawać bonusy do siły, ale utrudnia ukrywanie się.
        </div>
      </div>

      <div class="faq-item">
        <div class="faq-question">Czy mogę zmienić pochodzenie w trakcie gry?</div>
        <div class="faq-answer">
          Nie, pochodzenie jest stałe. To podstawowa cecha postaci określona przy narodzinach.
        </div>
      </div>
    </div>

    <div class="faq-section">
      <h5>Atrybuty</h5>
      
      <div class="faq-item">
        <div class="faq-question">Jakie atrybuty wybrać dla wojownika?</div>
        <div class="faq-answer">
          Priorytet: <strong>Siła</strong> (obrażenia, zdrowie) i <strong>Zręczność</strong> (obrona). Wola też jest ważna dla odporności.
        </div>
      </div>

      <div class="faq-item">
        <div class="faq-question">Jakie atrybuty wybrać dla maga?</div>
        <div class="faq-answer">
          Priorytet: <strong>Intelekt</strong> (moc zaklęć) i <strong>Wola</strong> (odporność). Zręczność pomaga w obronie.
        </div>
      </div>

      <div class="faq-item">
        <div class="faq-question">Jak działa "domyślne atrybuty"?</div>
        <div class="faq-answer">
          System ustawia atrybuty bazowe Twojego pochodzenia bez żadnych zmian - to najprostszy sposób dla początkujących.
        </div>
      </div>

      <div class="faq-item">
        <div class="faq-question">Czy mogę zmienić wartości atrybutów?</div>
        <div class="faq-answer">
          Tak, ale tylko raz: odznacz "Użyj domyślnych wartości", a następnie wybierz jeden atrybut do obniżenia o 1 i jeden inny do podniesienia o 1. Suma atrybutów (pula pochodzenia) zawsze zostaje taka sama - nie da się wybrać tego samego atrybutu w obu polach.
        </div>
      </div>

      <div class="faq-item">
        <div class="faq-question">Skąd biorą się dodatkowe punkty do atrybutów w Kroku 4?</div>
        <div class="faq-answer">
          Z wybranych ścieżek: każda ścieżka ekspercka (poziom 3) daje 2 punkty, a każda mistrzowska (poziom 7) - 3 punkty (ścieżki nowicjusza Mag i Wojownik dają 2, Kleryk i Łotr - żadnego). Punkty można rozdzielić na różne atrybuty albo połączyć wszystkie na jednym.
        </div>
      </div>
    </div>

    <div class="faq-section">
      <h5>Poziomy i Ścieżki</h5>
      
      <div class="faq-item">
        <div class="faq-question">Czy mogę mieć więcej niż jedną ścieżkę?</div>
        <div class="faq-answer">
          Tak! To sedno rozwoju postaci:<br>
          • <strong>Poziom 1:</strong> 1. ścieżka (Nowicjusz)<br>
          • <strong>Poziom 3:</strong> 2. ścieżka (Ekspert)<br>
          • <strong>Poziom 7:</strong> 3. ścieżka (Mistrz)
        </div>
      </div>

      <div class="faq-item">
        <div class="faq-question">Co to znaczy "Kontynuacja Nowicjusza"?</div>
        <div class="faq-answer">
          Na poziomie 2 otrzymujesz dodatkowe korzyści ze ścieżki nowicjusza (więcej zdrowia, talentów).
        </div>
      </div>

      <div class="faq-item">
        <div class="faq-question">Którą ścieżkę wybrać jako pierwszą?</div>
        <div class="faq-answer">
          Zależy od stylu gry:<br>
          • <strong>Wojownik</strong> - Walka wręcz, wysoka obrona<br>
          • <strong>Mag</strong> - Zaklęcia atakujące i użytkowe<br>
          • <strong>Kapłan</strong> - Uzdrawianie, wsparcie drużyny<br>
          • <strong>Łotr</strong> - Skradanie, zaskakiwanie
        </div>
      </div>
    </div>

    <div class="faq-section">
      <h5>Eksport i Zapis</h5>
      
      <div class="faq-item">
        <div class="faq-question">Jak działa eksport postaci?</div>
        <div class="faq-answer">
          Po kliknięciu "<svg class="icon"><use href="#icon-page"></use></svg> Eksportuj JSON" pobierze się plik tekstowy (JSON) z wszystkimi danymi postaci. Możesz go otworzyć w notatniku, zachować jako backup lub udostępnić Mistrzowi Gry.
        </div>
      </div>

      <div class="faq-item">
        <div class="faq-question">Czy mogę importować zapisane postacie?</div>
        <div class="faq-answer">
          Tak. Kliknij <strong>"<svg class="icon"><use href="#icon-folder"></use></svg> Importuj postać"</strong> obok przycisku losowania w Kroku 1 i wskaż plik JSON wyeksportowany wcześniej z tego kreatora. Jeśli plik jest uszkodzony, ma złą strukturę albo odwołuje się do pochodzeń/ścieżek/zaklęć, których nie ma w bieżącej bazie danych, zobaczysz czytelny komunikat z listą konkretnych problemów zamiast cichego niepowodzenia.
        </div>
      </div>

      <div class="faq-item">
        <div class="faq-question">Czy jest eksport do PDF?</div>
        <div class="faq-answer">
          Jeszcze nie, ale funkcja eksportu PDF jest planowana w wersji 1.1.
        </div>
      </div>
    </div>
  `;
}

/**
 * Generuje treść zakładki "Skróty Klawiszowe"
 * @returns {string} HTML z treścią
 */
function getShortcutsContent() {
  return `
    <h4><svg class="icon"><use href="#icon-keyboard"></use></svg> Skróty Klawiszowe</h4>

    <div class="shortcuts-intro">
      <p>Możesz używać klawiatury do szybszej nawigacji w kreatorze:</p>
    </div>

    <table class="shortcuts-table">
      <thead>
        <tr>
          <th>Klawisz</th>
          <th>Akcja</th>
          <th>Kontekst</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><kbd>F1</kbd></td>
          <td>Otwórz pomoc</td>
          <td>Zawsze dostępne</td>
        </tr>
        <tr>
          <td><kbd>Esc</kbd></td>
          <td>Zamknij pomoc / anuluj</td>
          <td>Gdy pomoc jest otwarta</td>
        </tr>
        <tr>
          <td><kbd>Tab</kbd></td>
          <td>Przejdź do następnego pola</td>
          <td>Formularze</td>
        </tr>
        <tr>
          <td><kbd>Shift</kbd> + <kbd>Tab</kbd></td>
          <td>Przejdź do poprzedniego pola</td>
          <td>Formularze</td>
        </tr>
        <tr>
          <td><kbd>Enter</kbd></td>
          <td>Potwierdź wybór</td>
          <td>Przyciski, formularze</td>
        </tr>
        <tr>
          <td><kbd>Spacja</kbd></td>
          <td>Aktywuj przycisk</td>
          <td>Gdy przycisk ma focus</td>
        </tr>
        <tr>
          <td><kbd><svg class="icon"><use href="#icon-chevron-up"></use></svg></kbd> <kbd><svg class="icon"><use href="#icon-chevron-down"></use></svg></kbd></td>
          <td>Przewiń listę</td>
          <td>Listy rozwijane</td>
        </tr>
      </tbody>
    </table>

    <div class="help-tip" style="margin-top: 20px;">
      <strong><svg class="icon"><use href="#icon-tip"></use></svg> Wskazówka:</strong> Użyj <kbd>Tab</kbd> do nawigacji między polami formularza - to szybsze niż klikanie myszką!
    </div>

    <div class="shortcuts-section">
      <h5>Nawigacja między Krokami</h5>
      <ul>
        <li>Użyj przycisków <strong>"Dalej <svg class="icon"><use href="#icon-chevron-right"></use></svg>"</strong> i <strong>"<svg class="icon"><use href="#icon-chevron-left"></use></svg> Wstecz"</strong> na dole każdego kroku</li>
        <li>Możesz cofnąć się w dowolnym momencie bez utraty danych</li>
      </ul>
    </div>

    <div class="shortcuts-section">
      <h5>Dostępność</h5>
      <p>Kreator wspiera czytniki ekranu i nawigację klawiaturową zgodnie z WCAG 2.1 AA.</p>
      <ul>
        <li>Wszystkie interaktywne elementy dostępne z klawiatury</li>
        <li>Focus widoczny wizualnie (złota ramka)</li>
        <li>Etykiety opisowe dla czytników ekranu</li>
      </ul>
    </div>
  `;
}

// Eksport funkcji (jeśli używane jako moduł)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    getStartContent,
    getGlossaryContent,
    getFAQContent,
    getShortcutsContent
  };
}

