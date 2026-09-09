/**
 * Tabele losowania dla pochodzeń postaci
 * Źródło: Podręcznik Główny + suplementy
 */

const ORIGIN_TABLES = {
  // ========== CZŁOWIEK ==========
  czlowiek: {
    przeszłość: {
      nazwa: 'Przeszłość',
      typ: 'k20',
      opis: 'Tabela określająca przeszłość postaci człowieka',
      wyniki: {
        1: { wynik: 'Umarłeś i powróciłeś do żywych. Zaczynasz grę z 1k6 punktów Szaleństwa.', efekt: 'Szaleństwo +1k6' },
        2: { wynik: 'Przez krótki czas byłeś opętany przez demona. Zaczynasz grę z 1 punktem Splugawienia.', efekt: 'Splugawienie +1' },
        3: { wynik: 'Spędziłeś 1k6 lat w więzieniu.', efekt: 'Brak efektu mechanicznego' },
        4: { wynik: 'Zabiłeś kogoś z zimną krwią. Zaczynasz grę z 1 punktem Splugawienia.', efekt: 'Splugawienie +1' },
        5: { wynik: 'Przeszedłeś ciężką chorobę.', efekt: 'Brak efektu mechanicznego' },
        6: { wynik: 'Należałeś do kultu i byłeś świadkiem wielu dziwnych rzeczy. Zaczynasz grę z 1 punktem Szaleństwa.', efekt: 'Szaleństwo +1' },
        7: { wynik: 'Przez 1k20 lat byłeś więźniem faerie.', efekt: 'Brak efektu mechanicznego' },
        8: { wynik: 'Nigdy nie otrząsnąłeś się z żalu po utracie bliskiej osoby.', efekt: 'Brak efektu mechanicznego' },
        9: { wynik: 'Straciłeś palec, kilka zębów albo ucho lub nosisz bliznę.', efekt: 'Brak efektu mechanicznego' },
        10: { wynik: 'Utrzymujesz się z pracy w swojej profesji.', efekt: 'Brak efektu mechanicznego' },
        11: { wynik: 'Zakochałeś się; związek ten nadal trwa lub zakończył się dobrze.', efekt: 'Brak efektu mechanicznego' },
        12: { wynik: 'Masz żonę lub męża i 1k6 − 2 dzieci (minimum 0).', efekt: 'Brak efektu mechanicznego' },
        13: { wynik: 'Odbyłeś wiele podróży w różne strony świata. Umiesz mówić w jednym dodatkowym języku.', efekt: 'Dodatkowy język' },
        14: { wynik: 'Posiadasz formalne wykształcenie. Umiesz czytać i pisać w języku wspólnym.', efekt: 'Brak efektu mechanicznego' },
        15: { wynik: 'Obroniłeś rodzinne miasto przed okropnymi potworami.', efekt: 'Brak efektu mechanicznego' },
        16: { wynik: 'Powstrzymałeś spisek na życie ważnej persony lub schwytałeś zabójcę.', efekt: 'Brak efektu mechanicznego' },
        17: { wynik: 'Dokonałeś wielkich czynów i w swoich rodzinnych stronach jesteś bohaterem.', efekt: 'Brak efektu mechanicznego' },
        18: { wynik: 'Znalazłeś starą mapę wiodącą do skarbu.', efekt: 'Brak efektu mechanicznego' },
        19: { wynik: 'Ktoś ważny i wpływowy jest ci winien przysługę.', efekt: 'Brak efektu mechanicznego' },
        20: { wynik: 'Odziedziczyłeś w spadku pieniądze; zaczynasz grę z 2k6 miedziaków.', efekt: 'Pieniądze +2k6 miedziaków' }
      }
    },
    osobowość: {
      nazwa: 'Osobowość',
      typ: '3k6',
      opis: 'Tabela określająca osobowość postaci człowieka',
      wyniki: {
        3: { wynik: 'Jesteś okrutny, niegodziwy i samolubny. Lubisz sprawiać innym ból.', efekt: 'Brak efektu mechanicznego' },
        4: { wynik: 'Jesteś kapryśny i nieprzewidywalny. Rzadko dotrzymujesz słowa i dajesz się ponosić impulsom.', efekt: 'Brak efektu mechanicznego' },
        5: { wynik: 'Kierujesz się prawem silniejszego. Posłuszeństwo wobec władzy jest najwyższym ideałem.', efekt: 'Brak efektu mechanicznego' },
        6: { wynik: 'Kierujesz się prawem silniejszego. Posłuszeństwo wobec władzy jest najwyższym ideałem.', efekt: 'Brak efektu mechanicznego' },
        7: { wynik: 'Dbasz przede wszystkim o siebie. Jesteś w stanie zdradzić nawet przyjaciół.', efekt: 'Brak efektu mechanicznego' },
        8: { wynik: 'Dbasz przede wszystkim o siebie. Jesteś w stanie zdradzić nawet przyjaciół.', efekt: 'Brak efektu mechanicznego' },
        9: { wynik: 'Ponad wszystkim innym stawiasz dobro swoje i swoich bliskich.', efekt: 'Brak efektu mechanicznego' },
        10: { wynik: 'Ponad wszystkim innym stawiasz dobro swoje i swoich bliskich.', efekt: 'Brak efektu mechanicznego' },
        11: { wynik: 'Ponad wszystkim innym stawiasz dobro swoje i swoich bliskich.', efekt: 'Brak efektu mechanicznego' },
        12: { wynik: 'Ponad wszystkim innym stawiasz dobro swoje i swoich bliskich.', efekt: 'Brak efektu mechanicznego' },
        13: { wynik: 'Pomagasz innym, bo tak należy.', efekt: 'Brak efektu mechanicznego' },
        14: { wynik: 'Pomagasz innym, bo tak należy.', efekt: 'Brak efektu mechanicznego' },
        15: { wynik: 'Starasz się postępować słusznie, nawet jeśli jest to wbrew prawu czy normom społecznym.', efekt: 'Brak efektu mechanicznego' },
        16: { wynik: 'Starasz się postępować słusznie, nawet jeśli jest to wbrew prawu czy normom społecznym.', efekt: 'Brak efektu mechanicznego' },
        17: { wynik: 'We wszystkim kierujesz się honorem i lojalnością.', efekt: 'Brak efektu mechanicznego' },
        18: { wynik: 'Jesteś oddany dobrym i szlachetnym celom i nie zdradzisz swoich przekonań nawet za cenę życia.', efekt: 'Brak efektu mechanicznego' }
      }
    },
    religia: {
      nazwa: 'Religia',
      typ: '3k6',
      opis: 'Tabela określająca religię postaci człowieka',
      wyniki: {
        3: { wynik: 'Jesteś członkiem kultu wyznającego jakąś mroczną siłę.', efekt: 'Brak efektu mechanicznego' },
        4: { wynik: 'Należysz do sekty heretyków.', efekt: 'Brak efektu mechanicznego' },
        5: { wynik: 'Wychowałeś się na wiedźmiarskich naukach.', efekt: 'Brak efektu mechanicznego' },
        6: { wynik: 'Wychowałeś się na wiedźmiarskich naukach.', efekt: 'Brak efektu mechanicznego' },
        7: { wynik: 'Kierujesz się doktryną Starej Wiary.', efekt: 'Brak efektu mechanicznego' },
        8: { wynik: 'Kierujesz się doktryną Starej Wiary.', efekt: 'Brak efektu mechanicznego' },
        9: { wynik: 'Kierujesz się doktryną Starej Wiary.', efekt: 'Brak efektu mechanicznego' },
        10: { wynik: 'Kierujesz się doktryną Starej Wiary.', efekt: 'Brak efektu mechanicznego' },
        11: { wynik: 'Jesteś wyznawcą Nowego Boga.', efekt: 'Brak efektu mechanicznego' },
        12: { wynik: 'Jesteś wyznawcą Nowego Boga.', efekt: 'Brak efektu mechanicznego' },
        13: { wynik: 'Jesteś wyznawcą Nowego Boga.', efekt: 'Brak efektu mechanicznego' },
        14: { wynik: 'Jesteś wyznawcą Nowego Boga.', efekt: 'Brak efektu mechanicznego' },
        15: { wynik: 'Jesteś wyznawcą Nowego Boga.', efekt: 'Brak efektu mechanicznego' },
        16: { wynik: 'Nie jesteś religijny.', efekt: 'Brak efektu mechanicznego' },
        17: { wynik: 'Nie jesteś religijny.', efekt: 'Brak efektu mechanicznego' },
        18: { wynik: 'Nie jesteś religijny.', efekt: 'Brak efektu mechanicznego' }
      }
    },
    wiek: {
      nazwa: 'Wiek',
      typ: '3k6',
      opis: 'Tabela określająca wiek postaci człowieka',
      wyniki: {
        3: { wynik: 'Dziecko, 11 lat lub mniej.', efekt: 'Brak efektu mechanicznego' },
        4: { wynik: 'Młodociany, 12–17 lat.', efekt: 'Brak efektu mechanicznego' },
        5: { wynik: 'Młodociany, 12–17 lat.', efekt: 'Brak efektu mechanicznego' },
        6: { wynik: 'Młodociany, 12–17 lat.', efekt: 'Brak efektu mechanicznego' },
        7: { wynik: 'Młodociany, 12–17 lat.', efekt: 'Brak efektu mechanicznego' },
        8: { wynik: 'Młody dorosły, 18–35 lat.', efekt: 'Brak efektu mechanicznego' },
        9: { wynik: 'Młody dorosły, 18–35 lat.', efekt: 'Brak efektu mechanicznego' },
        10: { wynik: 'Młody dorosły, 18–35 lat.', efekt: 'Brak efektu mechanicznego' },
        11: { wynik: 'Młody dorosły, 18–35 lat.', efekt: 'Brak efektu mechanicznego' },
        12: { wynik: 'Młody dorosły, 18–35 lat.', efekt: 'Brak efektu mechanicznego' },
        13: { wynik: 'Dorosły w średnim wieku, 36–55 lat.', efekt: 'Brak efektu mechanicznego' },
        14: { wynik: 'Dorosły w średnim wieku, 36–55 lat.', efekt: 'Brak efektu mechanicznego' },
        15: { wynik: 'Dorosły w średnim wieku, 36–55 lat.', efekt: 'Brak efektu mechanicznego' },
        16: { wynik: 'Starszy dorosły, 56–75 lat.', efekt: 'Brak efektu mechanicznego' },
        17: { wynik: 'Starszy dorosły, 56–75 lat.', efekt: 'Brak efektu mechanicznego' },
        18: { wynik: 'Sędziwy dorosły, 76 lat lub więcej.', efekt: 'Brak efektu mechanicznego' }
      }
    },
    budowa_ciala: {
      nazwa: 'Budowa ciała',
      typ: '3k6',
      opis: 'Tabela określająca budowę ciała postaci człowieka',
      wyniki: {
        3: { wynik: 'Jesteś niski i szczupły.', efekt: 'Brak efektu mechanicznego' },
        4: { wynik: 'Jesteś niski i krępy.', efekt: 'Brak efektu mechanicznego' },
        5: { wynik: 'Jesteś niski.', efekt: 'Brak efektu mechanicznego' },
        6: { wynik: 'Jesteś niski.', efekt: 'Brak efektu mechanicznego' },
        7: { wynik: 'Jesteś smukły.', efekt: 'Brak efektu mechanicznego' },
        8: { wynik: 'Jesteś smukły.', efekt: 'Brak efektu mechanicznego' },
        9: { wynik: 'Jesteś średniego wzrostu i wagi.', efekt: 'Brak efektu mechanicznego' },
        10: { wynik: 'Jesteś średniego wzrostu i wagi.', efekt: 'Brak efektu mechanicznego' },
        11: { wynik: 'Jesteś średniego wzrostu i wagi.', efekt: 'Brak efektu mechanicznego' },
        12: { wynik: 'Jesteś średniego wzrostu i wagi.', efekt: 'Brak efektu mechanicznego' },
        13: { wynik: 'Masz lekką nadwagę.', efekt: 'Brak efektu mechanicznego' },
        14: { wynik: 'Masz lekką nadwagę.', efekt: 'Brak efektu mechanicznego' },
        15: { wynik: 'Jesteś wysoki.', efekt: 'Brak efektu mechanicznego' },
        16: { wynik: 'Jesteś wysoki.', efekt: 'Brak efektu mechanicznego' },
        17: { wynik: 'Jesteś wysoki i szczupły.', efekt: 'Brak efektu mechanicznego' },
        18: { wynik: 'Jesteś bardzo wysoki i masywny.', efekt: 'Brak efektu mechanicznego' }
      }
    },
    wyglad: {
      nazwa: 'Wygląd',
      typ: '3k6',
      opis: 'Tabela określająca wygląd postaci człowieka',
      wyniki: {
        3: { wynik: 'Jesteś szpetny. Wyglądasz jak maszkara. Dzieci płaczą na twój widok, osoby co słabszego serca mdleją, a raz ktoś nawet zwymiotował po tym, jak dokładnie przyjrzał się twojej twarzy.', efekt: 'Brak efektu mechanicznego' },
        4: { wynik: 'Jesteś brzydki; twoja twarz nie podoba się innym z powodu blizny, torbieli, krzaczastych brwi, krost, czyraków, zeza lub innych podobnych defektów.', efekt: 'Brak efektu mechanicznego' },
        5: { wynik: 'Nie jesteś brzydki, ale większość nie uważa cię za atrakcyjnego.', efekt: 'Brak efektu mechanicznego' },
        6: { wynik: 'Nie jesteś brzydki, ale większość nie uważa cię za atrakcyjnego.', efekt: 'Brak efektu mechanicznego' },
        7: { wynik: 'Jesteś z twarzy podobny zupełnie do nikogo. Inni ludzie cię zauważają, ale nie robisz szczególnego wrażenia.', efekt: 'Brak efektu mechanicznego' },
        8: { wynik: 'Jesteś z twarzy podobny zupełnie do nikogo. Inni ludzie cię zauważają, ale nie robisz szczególnego wrażenia.', efekt: 'Brak efektu mechanicznego' },
        9: { wynik: 'Masz przeciętną aparycję. Wyglądasz jak wszyscy inni.', efekt: 'Brak efektu mechanicznego' },
        10: { wynik: 'Masz przeciętną aparycję. Wyglądasz jak wszyscy inni.', efekt: 'Brak efektu mechanicznego' },
        11: { wynik: 'Masz przeciętną aparycję. Wyglądasz jak wszyscy inni.', efekt: 'Brak efektu mechanicznego' },
        12: { wynik: 'Masz przeciętną aparycję. Wyglądasz jak wszyscy inni.', efekt: 'Brak efektu mechanicznego' },
        13: { wynik: 'Posiadasz cechę, którą inni uważają za atrakcyjną. Mogą to być ładne oczy, usta lub włosy, zgrabna figura albo coś innego.', efekt: 'Brak efektu mechanicznego' },
        14: { wynik: 'Posiadasz cechę, którą inni uważają za atrakcyjną. Mogą to być ładne oczy, usta lub włosy, zgrabna figura albo coś innego.', efekt: 'Brak efektu mechanicznego' },
        15: { wynik: 'Posiadasz kilka cech fizycznych, które dodają ci atrakcyjności.', efekt: 'Brak efektu mechanicznego' },
        16: { wynik: 'Posiadasz kilka cech fizycznych, które dodają ci atrakcyjności.', efekt: 'Brak efektu mechanicznego' },
        17: { wynik: 'Jesteś bardzo atrakcyjny. Inni ludzie często się na ciebie gapią.', efekt: 'Brak efektu mechanicznego' },
        18: { wynik: 'Jesteś niezwykle piękny. Ludzie zatrzymują się, by cię podziwiać.', efekt: 'Brak efektu mechanicznego' }
      }
    }
  },

  // ========== AUTOMATON ==========
  automaton: {
    wiek: {
      nazwa: 'Wiek',
      typ: '3k6',
      opis: 'Tabela określająca wiek automatona',
      wyniki: {
        3: { wynik: 'Nowy, 5 lat lub mniej.', efekt: 'Brak efektu mechanicznego' },
        4: { wynik: 'Nowy, 5 lat lub mniej.', efekt: 'Brak efektu mechanicznego' },
        5: { wynik: 'Nowy, 5 lat lub mniej.', efekt: 'Brak efektu mechanicznego' },
        6: { wynik: 'Nowy, 5 lat lub mniej.', efekt: 'Brak efektu mechanicznego' },
        7: { wynik: 'Nowy, 5 lat lub mniej.', efekt: 'Brak efektu mechanicznego' },
        8: { wynik: 'Nowy, 5 lat lub mniej.', efekt: 'Brak efektu mechanicznego' },
        9: { wynik: 'Doświadczony, 6–10 lat.', efekt: 'Brak efektu mechanicznego' },
        10: { wynik: 'Doświadczony, 6–10 lat.', efekt: 'Brak efektu mechanicznego' },
        11: { wynik: 'Doświadczony, 6–10 lat.', efekt: 'Brak efektu mechanicznego' },
        12: { wynik: 'Doświadczony, 6–10 lat.', efekt: 'Brak efektu mechanicznego' },
        13: { wynik: 'Stary, 11–50 lat.', efekt: 'Brak efektu mechanicznego' },
        14: { wynik: 'Stary, 11–50 lat.', efekt: 'Brak efektu mechanicznego' },
        15: { wynik: 'Stary, 11–50 lat.', efekt: 'Brak efektu mechanicznego' },
        16: { wynik: 'Bardzo stary, 51–150 lat.', efekt: 'Brak efektu mechanicznego' },
        17: { wynik: 'Bardzo stary, 51–150 lat.', efekt: 'Brak efektu mechanicznego' },
        18: { wynik: 'Wiekowy, powyżej 150 lat.', efekt: 'Brak efektu mechanicznego' }
      }
    },
    funkcja: {
      nazwa: 'Funkcja',
      typ: 'k20',
      opis: 'Tabela określająca funkcję, do której automaton został stworzony',
      wyniki: {
        1: { wynik: 'Zostałeś stworzony do walki.', efekt: 'Zwiększ swoją Siłę lub Zręczność o 2.' },
        2: { wynik: 'Zostałeś stworzony do walki.', efekt: 'Zwiększ swoją Siłę lub Zręczność o 2.' },
        3: { wynik: 'Zostałeś stworzony do walki.', efekt: 'Zwiększ swoją Siłę lub Zręczność o 2.' },
        4: { wynik: 'Zostałeś stworzony do walki.', efekt: 'Zwiększ swoją Siłę lub Zręczność o 2.' },
        5: { wynik: 'Zostałeś stworzony do pracy.', efekt: 'Zwiększ swoją Siłę o 2.' },
        6: { wynik: 'Zostałeś stworzony do pracy.', efekt: 'Zwiększ swoją Siłę o 2.' },
        7: { wynik: 'Zostałeś stworzony do pracy.', efekt: 'Zwiększ swoją Siłę o 2.' },
        8: { wynik: 'Zostałeś stworzony do pracy.', efekt: 'Zwiększ swoją Siłę o 2.' },
        9: { wynik: 'Zostałeś stworzony do używania magii.', efekt: 'Zwiększ swój Intelekt lub Wolę o 2.' },
        10: { wynik: 'Zostałeś stworzony do używania magii.', efekt: 'Zwiększ swój Intelekt lub Wolę o 2.' },
        11: { wynik: 'Zostałeś stworzony do używania magii.', efekt: 'Zwiększ swój Intelekt lub Wolę o 2.' },
        12: { wynik: 'Zostałeś stworzony do używania magii.', efekt: 'Zwiększ swój Intelekt lub Wolę o 2.' },
        13: { wynik: 'Zostałeś stworzony do szpiegowania lub skrytobójstwa.', efekt: 'Zwiększ swoją Zręczność lub Intelekt o 2.' },
        14: { wynik: 'Zostałeś stworzony do szpiegowania lub skrytobójstwa.', efekt: 'Zwiększ swoją Zręczność lub Intelekt o 2.' },
        15: { wynik: 'Zostałeś stworzony do szpiegowania lub skrytobójstwa.', efekt: 'Zwiększ swoją Zręczność lub Intelekt o 2.' },
        16: { wynik: 'Zostałeś stworzony do szpiegowania lub skrytobójstwa.', efekt: 'Zwiększ swoją Zręczność lub Intelekt o 2.' },
        17: { wynik: 'Nie znasz funkcji, do której zostałeś stworzony.', efekt: 'Zwiększ jeden wybrany atrybut o 2.' },
        18: { wynik: 'Nie znasz funkcji, do której zostałeś stworzony.', efekt: 'Zwiększ jeden wybrany atrybut o 2.' },
        19: { wynik: 'Nie znasz funkcji, do której zostałeś stworzony.', efekt: 'Zwiększ jeden wybrany atrybut o 2.' },
        20: { wynik: 'Nie znasz funkcji, do której zostałeś stworzony.', efekt: 'Zwiększ jeden wybrany atrybut o 2.' }
      }
    },
    forma: {
      nazwa: 'Forma',
      typ: '3k6',
      opis: 'Tabela określająca formę fizyczną automatona',
      wyniki: {
        3: { wynik: 'Niewielki, latający automaton. Masz około 1 metra wzrostu i ważysz około 25 kilogramów. Potrafisz latać, ale musisz zakończyć ruch lądowaniem, w przeciwnym wypadku spadasz na ziemię.', efekt: 'Zdrowie -5, Rozmiar 1/2, Lot' },
        4: { wynik: 'Niewielki automaton przypominający pająka o chwytnych kończynach. Masz około 1 metra wzrostu i ważysz około 25 kilogramów. Gdy się wspinasz, ignorujesz efekty trudnego terenu.', efekt: 'Rozmiar 1/2, Wspinaczka bez utrudnień' },
        5: { wynik: 'Niewielki automaton przypominający pająka o chwytnych kończynach. Masz około 1 metra wzrostu i ważysz około 25 kilogramów. Gdy się wspinasz, ignorujesz efekty trudnego terenu.', efekt: 'Rozmiar 1/2, Wspinaczka bez utrudnień' },
        6: { wynik: 'Mały, człekopodobny automaton. Masz około 120 centymetrów wzrostu i ważysz około 30 kilogramów.', efekt: 'Rozmiar 1/2' },
        7: { wynik: 'Mały, człekopodobny automaton. Masz około 120 centymetrów wzrostu i ważysz około 30 kilogramów.', efekt: 'Rozmiar 1/2' },
        8: { wynik: 'Mały, człekopodobny automaton. Masz około 120 centymetrów wzrostu i ważysz około 30 kilogramów.', efekt: 'Rozmiar 1/2' },
        9: { wynik: 'Mały, człekopodobny automaton. Masz około 120 centymetrów wzrostu i ważysz około 30 kilogramów.', efekt: 'Rozmiar 1/2' },
        10: { wynik: 'Człekopodobny automaton. Masz około 180 centymetrów wzrostu i ważysz około 150 kilogramów.', efekt: 'Brak efektu mechanicznego' },
        11: { wynik: 'Człekopodobny automaton. Masz około 180 centymetrów wzrostu i ważysz około 150 kilogramów.', efekt: 'Brak efektu mechanicznego' },
        12: { wynik: 'Człekopodobny automaton. Masz około 180 centymetrów wzrostu i ważysz około 150 kilogramów.', efekt: 'Brak efektu mechanicznego' },
        13: { wynik: 'Człekopodobny automaton. Masz około 180 centymetrów wzrostu i ważysz około 150 kilogramów.', efekt: 'Brak efektu mechanicznego' },
        14: { wynik: 'Człekopodobny automaton. Masz około 180 centymetrów wzrostu i ważysz około 150 kilogramów.', efekt: 'Brak efektu mechanicznego' },
        15: { wynik: 'Człekopodobny automaton. Masz około 180 centymetrów wzrostu i ważysz około 150 kilogramów.', efekt: 'Brak efektu mechanicznego' },
        16: { wynik: 'Duży, człekopodobny automaton. Masz około 3 metrów wzrostu i ważysz około 300 kilogramów.', efekt: 'Rozmiar 2, Prędkość -2, Obrona -2' },
        17: { wynik: 'Duży, człekopodobny automaton. Masz około 3 metrów wzrostu i ważysz około 300 kilogramów.', efekt: 'Rozmiar 2, Prędkość -2, Obrona -2' },
        18: { wynik: 'Duży automaton od pasa w dół przypominający konia. Masz około 2 metrów wzrostu i długości, ważysz około 300 kilogramów.', efekt: 'Rozmiar 2, Prędkość +2, Obrona -3' }
      }
    },
    wyglad: {
      nazwa: 'Wygląd',
      typ: '3k6',
      opis: 'Tabela określająca wygląd automatona (bez efektów mechanicznych)',
      wyniki: {
        3: { wynik: 'Twój wygląd jest dziwaczny i niepokojący.', efekt: 'Brak efektu mechanicznego' },
        4: { wynik: 'Twoja forma wydaje się prymitywna i niewprawnie złożona.', efekt: 'Brak efektu mechanicznego' },
        5: { wynik: 'Wyglądasz na podniszczonego, poobijanego i źle utrzymanego.', efekt: 'Brak efektu mechanicznego' },
        6: { wynik: 'Wyglądasz na podniszczonego, poobijanego i źle utrzymanego.', efekt: 'Brak efektu mechanicznego' },
        7: { wynik: 'Nie masz żadnych rysów twarzy ani znaków szczególnych.', efekt: 'Brak efektu mechanicznego' },
        8: { wynik: 'Nie masz żadnych rysów twarzy ani znaków szczególnych.', efekt: 'Brak efektu mechanicznego' },
        9: { wynik: 'Twoja twarz jest ledwie zarysowana.', efekt: 'Brak efektu mechanicznego' },
        10: { wynik: 'Twoja twarz jest ledwie zarysowana.', efekt: 'Brak efektu mechanicznego' },
        11: { wynik: 'Twoja twarz jest ledwie zarysowana.', efekt: 'Brak efektu mechanicznego' },
        12: { wynik: 'Twoja twarz jest ledwie zarysowana.', efekt: 'Brak efektu mechanicznego' },
        13: { wynik: 'Wyglądasz na dobrze utrzymanego i działającego bez zarzutu.', efekt: 'Brak efektu mechanicznego' },
        14: { wynik: 'Wyglądasz na dobrze utrzymanego i działającego bez zarzutu.', efekt: 'Brak efektu mechanicznego' },
        15: { wynik: 'Twoja forma jest bogato zdobiona.', efekt: 'Brak efektu mechanicznego' },
        16: { wynik: 'Twoja forma jest bogato zdobiona.', efekt: 'Brak efektu mechanicznego' },
        17: { wynik: 'Twoja forma ozdobiona jest grawerunkami i klejnotami.', efekt: 'Brak efektu mechanicznego' },
        18: { wynik: 'Twoja forma ozdobiona jest grawerunkami i klejnotami, a do tego wykończona metalami szlachetnymi.', efekt: 'Jeśli zostaniesz rozmontowany, twoje części warte są 1k6 złotych koron.' }
      }
    },
    przeszłość: {
      nazwa: 'Przeszłość',
      typ: 'k20',
      opis: 'Tabela określająca przeszłość automatona',
      wyniki: {
        1: { wynik: 'Twoja dusza pochodzi z Piekła.', efekt: 'Zaczynasz grę z 1k3 punktów Splugawienia.' },
        2: { wynik: 'Twoja dusza została wyrwana z Zaświatów, zanim zdążyła zapomnieć swoje poprzednie życie.', efekt: 'Zaczynasz grę z 1k6 punktów Szaleństwa i zyskujesz dodatkową profesję.' },
        3: { wynik: 'Spędziłeś 1k20 lat w stanie uśpienia.', efekt: 'Brak efektu mechanicznego' },
        4: { wynik: 'Twój stwórca źle cię traktował. Uciekłeś, ale boisz się, że będzie cię szukał.', efekt: 'Brak efektu mechanicznego' },
        5: { wynik: 'Twój dom został zniszczony przez ogień, zarazę lub potwory. Tylko ty się uratowałeś.', efekt: 'Brak efektu mechanicznego' },
        6: { wynik: 'Zostałeś skradziony z warsztatu, w którym powstałeś. Przez 1k6 lat żyłeś w niewoli.', efekt: 'Brak efektu mechanicznego' },
        7: { wynik: 'Zostałeś porwany przez gobliny i prawie rozebrany na części. Brakujące elementy zastąpiłeś kawałkami drewna, starej broni i innym złomem.', efekt: 'Brak efektu mechanicznego' },
        8: { wynik: 'Twój stwórca umarł, zostawiając cię samego na świecie.', efekt: 'Brak efektu mechanicznego' },
        9: { wynik: 'Wypadłeś z pokładu statku. Dojście do brzegu zajęło ci dwa lata.', efekt: 'Brak efektu mechanicznego' },
        10: { wynik: 'Przez 1k6 lat pełniłeś funkcję, do jakiej zostałeś stworzony.', efekt: 'Brak efektu mechanicznego' },
        11: { wynik: 'Wybierz innego członka drużyny. Postać ta znalazła cię i nakręciła, przywracając do życia.', efekt: 'Masz wobec niej dług wdzięczności.' },
        12: { wynik: 'Powstałeś w tym samym czasie, co 1k6 innych automatonów. Chciałbyś je kiedyś odnaleźć.', efekt: 'Brak efektu mechanicznego' },
        13: { wynik: 'Pełniłeś funkcję tłumacza.', efekt: 'Umiesz mówić w jednym dodatkowym języku.' },
        14: { wynik: 'Pełniłeś funkcję skryby.', efekt: 'Umiesz czytać i pisać w języku wspólnym.' },
        15: { wynik: 'Twój stwórca ofiarował ci wolność, byś sam odnalazł swoje przeznaczenie.', efekt: 'Brak efektu mechanicznego' },
        16: { wynik: 'Nie pamiętasz swojej przeszłości. Nie wiesz, skąd pochodzisz ani jak trafiłeś do miejsca, w którym się obecnie znajdujesz.', efekt: 'Brak efektu mechanicznego' },
        17: { wynik: 'Brałeś udział w budowie ważnego dla twojej społeczności monumentu.', efekt: 'Brak efektu mechanicznego' },
        18: { wynik: 'Wewnątrz swojego ciała znalazłeś zakodowaną wiadomość. Jak dotąd nie udało ci się jej rozszyfrować.', efekt: 'Brak efektu mechanicznego' },
        19: { wynik: 'Do jednego z twoich ramion przymocowany jest miecz.', efekt: 'Brak efektu mechanicznego' },
        20: { wynik: 'Odziedziczyłeś w spadku pieniądze.', efekt: 'Zaczynasz grę z 2k6 miedziaków.' }
      }
    },
    osobowość: {
      nazwa: 'Osobowość',
      typ: '3k6',
      opis: 'Tabela określająca osobowość automatona',
      wyniki: {
        3: { wynik: 'Nienawidzisz żywych istot i uwielbiasz rozbierać je na części.', efekt: 'Brak efektu mechanicznego' },
        4: { wynik: 'Stan uśpienia cię przeraża.', efekt: 'Brak efektu mechanicznego' },
        5: { wynik: 'Twoja forma daje ci siłę i moc. Wykorzystujesz je, by podporządkowywać sobie innych.', efekt: 'Brak efektu mechanicznego' },
        6: { wynik: 'Twoja forma daje ci siłę i moc. Wykorzystujesz je, by podporządkowywać sobie innych.', efekt: 'Brak efektu mechanicznego' },
        7: { wynik: 'Twoja forma daje ci siłę i moc. Wykorzystujesz je, by podporządkowywać sobie innych.', efekt: 'Brak efektu mechanicznego' },
        8: { wynik: 'Nie prosiłeś się o to nowe „życie", ale starasz się jak najlepiej z niego korzystać.', efekt: 'Brak efektu mechanicznego' },
        9: { wynik: 'Poszukujesz znaczenia w świecie, w którym jesteś obcy.', efekt: 'Brak efektu mechanicznego' },
        10: { wynik: 'Poszukujesz znaczenia w świecie, w którym jesteś obcy.', efekt: 'Brak efektu mechanicznego' },
        11: { wynik: 'Poszukujesz znaczenia w świecie, w którym jesteś obcy.', efekt: 'Brak efektu mechanicznego' },
        12: { wynik: 'Poszukujesz znaczenia w świecie, w którym jesteś obcy.', efekt: 'Brak efektu mechanicznego' },
        13: { wynik: 'Poszukujesz znaczenia w świecie, w którym jesteś obcy.', efekt: 'Brak efektu mechanicznego' },
        14: { wynik: 'Zostałeś stworzony, by służyć. Swoją egzystencję poświęcasz pomocy innym.', efekt: 'Brak efektu mechanicznego' },
        15: { wynik: 'Nie znasz swojego miejsca w tym świecie, ale poświęcisz życie, by je odnaleźć.', efekt: 'Brak efektu mechanicznego' },
        16: { wynik: 'Jesteś posłuszny wobec każdego, kogo uznasz za sprawującego władzę.', efekt: 'Brak efektu mechanicznego' },
        17: { wynik: 'Jesteś posłuszny wobec każdego, kogo uznasz za sprawującego władzę.', efekt: 'Brak efektu mechanicznego' },
        18: { wynik: 'Twój stwórca wpoił ci trzy dyrektywy, do których bezwzględnie się stosujesz.', efekt: 'Brak efektu mechanicznego' }
      }
    }
  },

  // ========== CHOCHLIK ==========
  chochlik: {
    wyglad: {
      nazwa: 'Wygląd',
      typ: '3k6',
      opis: 'Tabela określająca wygląd chochlika',
      wyniki: {
        3: { wynik: 'Jesteś szpetny. Wyglądasz jak maszkara. Dzieci płaczą na twój widok, osoby co słabszego serca mdleją, a raz ktoś nawet zwymiotował po tym, jak dokładnie przyjrzał się twojej twarzy.', efekt: 'Brak efektu mechanicznego' },
        4: { wynik: 'Jesteś brzydki; twoja twarz nie podoba się innym z powodu blizny, torbieli, krzaczastych brwi, krost, czyraków, zeza lub innych podobnych defektów.', efekt: 'Brak efektu mechanicznego' },
        5: { wynik: 'Nie jesteś brzydki, ale większość nie uważa cię za atrakcyjnego.', efekt: 'Brak efektu mechanicznego' },
        6: { wynik: 'Nie jesteś brzydki, ale większość nie uważa cię za atrakcyjnego.', efekt: 'Brak efektu mechanicznego' },
        7: { wynik: 'Jesteś z twarzy podobny zupełnie do nikogo. Inni ludzie cię zauważają, ale nie robisz szczególnego wrażenia.', efekt: 'Brak efektu mechanicznego' },
        8: { wynik: 'Jesteś z twarzy podobny zupełnie do nikogo. Inni ludzie cię zauważają, ale nie robisz szczególnego wrażenia.', efekt: 'Brak efektu mechanicznego' },
        9: { wynik: 'Masz przeciętną aparycję. Wyglądasz jak wszyscy inni.', efekt: 'Brak efektu mechanicznego' },
        10: { wynik: 'Masz przeciętną aparycję. Wyglądasz jak wszyscy inni.', efekt: 'Brak efektu mechanicznego' },
        11: { wynik: 'Masz przeciętną aparycję. Wyglądasz jak wszyscy inni.', efekt: 'Brak efektu mechanicznego' },
        12: { wynik: 'Masz przeciętną aparycję. Wyglądasz jak wszyscy inni.', efekt: 'Brak efektu mechanicznego' },
        13: { wynik: 'Posiadasz cechę, którą inni uważają za atrakcyjną. Mogą to być ładne oczy, usta lub włosy, zgrabna figura albo coś innego.', efekt: 'Brak efektu mechanicznego' },
        14: { wynik: 'Posiadasz cechę, którą inni uważają za atrakcyjną. Mogą to być ładne oczy, usta lub włosy, zgrabna figura albo coś innego.', efekt: 'Brak efektu mechanicznego' },
        15: { wynik: 'Posiadasz kilka cech fizycznych, które dodają ci atrakcyjności.', efekt: 'Brak efektu mechanicznego' },
        16: { wynik: 'Posiadasz kilka cech fizycznych, które dodają ci atrakcyjności.', efekt: 'Brak efektu mechanicznego' },
        17: { wynik: 'Jesteś bardzo atrakcyjny. Inni ludzie często się na ciebie gapią.', efekt: 'Brak efektu mechanicznego' },
        18: { wynik: 'Jesteś niezwykle piękny. Ludzie zatrzymują się, by cię podziwiać.', efekt: 'Brak efektu mechanicznego' }
      }
    },
    wiek: {
      nazwa: 'Wiek',
      typ: '3k6',
      opis: 'Tabela określająca wiek chochlika',
      wyniki: {
        3: { wynik: 'Dziecko, 5 lat lub mniej.', efekt: 'Brak efektu mechanicznego' },
        4: { wynik: 'Młodociany, 6–10 lat.', efekt: 'Brak efektu mechanicznego' },
        5: { wynik: 'Młodociany, 6–10 lat.', efekt: 'Brak efektu mechanicznego' },
        6: { wynik: 'Młodociany, 6–10 lat.', efekt: 'Brak efektu mechanicznego' },
        7: { wynik: 'Młodociany, 6–10 lat.', efekt: 'Brak efektu mechanicznego' },
        8: { wynik: 'Młody dorosły, 11–20 lat.', efekt: 'Brak efektu mechanicznego' },
        9: { wynik: 'Młody dorosły, 11–20 lat.', efekt: 'Brak efektu mechanicznego' },
        10: { wynik: 'Młody dorosły, 11–20 lat.', efekt: 'Brak efektu mechanicznego' },
        11: { wynik: 'Młody dorosły, 11–20 lat.', efekt: 'Brak efektu mechanicznego' },
        12: { wynik: 'Młody dorosły, 11–20 lat.', efekt: 'Brak efektu mechanicznego' },
        13: { wynik: 'Dorosły w średnim wieku, 21–40 lat.', efekt: 'Brak efektu mechanicznego' },
        14: { wynik: 'Dorosły w średnim wieku, 21–40 lat.', efekt: 'Brak efektu mechanicznego' },
        15: { wynik: 'Dorosły w średnim wieku, 21–40 lat.', efekt: 'Brak efektu mechanicznego' },
        16: { wynik: 'Starszy dorosły, 41–60 lat.', efekt: 'Brak efektu mechanicznego' },
        17: { wynik: 'Starszy dorosły, 41–60 lat.', efekt: 'Brak efektu mechanicznego' },
        18: { wynik: 'Sędziwy dorosły, 61 lat lub więcej.', efekt: 'Brak efektu mechanicznego' }
      }
    },
    przeszlosc: {
      nazwa: 'Przeszłość',
      typ: 'k20',
      opis: 'Tabela określająca przeszłość chochlika',
      wyniki: {
        1: { wynik: 'Umarłeś i powróciłeś do żywych. Zaczynasz grę z 1k6 punktów Szaleństwa.', efekt: 'Szaleństwo +1k6' },
        2: { wynik: 'Przez krótki czas byłeś opętany przez demona. Zaczynasz grę z 1 punktem Splugawienia.', efekt: 'Splugawienie +1' },
        3: { wynik: 'Spędziłeś 1k6 lat w więzieniu.', efekt: 'Brak efektu mechanicznego' },
        4: { wynik: 'Zabiłeś kogoś z zimną krwią. Zaczynasz grę z 1 punktem Splugawienia.', efekt: 'Splugawienie +1' },
        5: { wynik: 'Przeszedłeś ciężką chorobę.', efekt: 'Brak efektu mechanicznego' },
        6: { wynik: 'Należałeś do kultu i byłeś świadkiem wielu dziwnych rzeczy. Zaczynasz grę z 1 punktem Szaleństwa.', efekt: 'Szaleństwo +1' },
        7: { wynik: 'Przez 1k20 lat byłeś więźniem faerie.', efekt: 'Brak efektu mechanicznego' },
        8: { wynik: 'Nigdy nie otrząsnąłeś się z żalu po utracie bliskiej osoby.', efekt: 'Brak efektu mechanicznego' },
        9: { wynik: 'Straciłeś palec, kilka zębów albo ucho lub nosisz bliznę.', efekt: 'Brak efektu mechanicznego' },
        10: { wynik: 'Utrzymujesz się z pracy w swojej profesji.', efekt: 'Brak efektu mechanicznego' },
        11: { wynik: 'Zakochałeś się; związek ten nadal trwa lub zakończył się dobrze.', efekt: 'Brak efektu mechanicznego' },
        12: { wynik: 'Masz żonę lub męża i 1k6 − 2 dzieci (minimum 0).', efekt: 'Brak efektu mechanicznego' },
        13: { wynik: 'Odbyłeś wiele podróży w różne strony świata. Umiesz mówić w jednym dodatkowym języku.', efekt: 'Dodatkowy język' },
        14: { wynik: 'Posiadasz formalne wykształcenie. Umiesz czytać i pisać w języku wspólnym.', efekt: 'Brak efektu mechanicznego' },
        15: { wynik: 'Obroniłeś rodzinne miasto przed okropnymi potworami.', efekt: 'Brak efektu mechanicznego' },
        16: { wynik: 'Powstrzymałeś spisek na życie ważnej persony lub schwytałeś zabójcę.', efekt: 'Brak efektu mechanicznego' },
        17: { wynik: 'Dokonałeś wielkich czynów i w swoich rodzinnych stronach jesteś bohaterem.', efekt: 'Brak efektu mechanicznego' },
        18: { wynik: 'Znalazłeś starą mapę wiodącą do skarbu.', efekt: 'Brak efektu mechanicznego' },
        19: { wynik: 'Ktoś ważny i wpływowy jest ci winien przysługę.', efekt: 'Brak efektu mechanicznego' },
        20: { wynik: 'Odziedziczyłeś w spadku pieniądze; zaczynasz grę z 2k6 miedziaków.', efekt: 'Pieniądze +2k6 miedziaków' }
      }
    },
    budowa_ciala: {
      nazwa: 'Budowa ciała',
      typ: '3k6',
      opis: 'Tabela określająca budowę ciała chochlika',
      wyniki: {
        3: { wynik: 'Jesteś niski i szczupły.', efekt: 'Brak efektu mechanicznego' },
        4: { wynik: 'Jesteś niski i krępy.', efekt: 'Brak efektu mechanicznego' },
        5: { wynik: 'Jesteś niski.', efekt: 'Brak efektu mechanicznego' },
        6: { wynik: 'Jesteś niski.', efekt: 'Brak efektu mechanicznego' },
        7: { wynik: 'Jesteś smukły.', efekt: 'Brak efektu mechanicznego' },
        8: { wynik: 'Jesteś smukły.', efekt: 'Brak efektu mechanicznego' },
        9: { wynik: 'Jesteś średniego wzrostu i wagi.', efekt: 'Brak efektu mechanicznego' },
        10: { wynik: 'Jesteś średniego wzrostu i wagi.', efekt: 'Brak efektu mechanicznego' },
        11: { wynik: 'Jesteś średniego wzrostu i wagi.', efekt: 'Brak efektu mechanicznego' },
        12: { wynik: 'Jesteś średniego wzrostu i wagi.', efekt: 'Brak efektu mechanicznego' },
        13: { wynik: 'Masz lekką nadwagę.', efekt: 'Brak efektu mechanicznego' },
        14: { wynik: 'Masz lekką nadwagę.', efekt: 'Brak efektu mechanicznego' },
        15: { wynik: 'Jesteś wysoki.', efekt: 'Brak efektu mechanicznego' },
        16: { wynik: 'Jesteś wysoki.', efekt: 'Brak efektu mechanicznego' },
        17: { wynik: 'Jesteś wysoki i szczupły.', efekt: 'Brak efektu mechanicznego' },
        18: { wynik: 'Jesteś bardzo wysoki i masywny.', efekt: 'Brak efektu mechanicznego' }
      }
    },
    osobowosc: {
      nazwa: 'Osobowość',
      typ: '3k6',
      opis: 'Tabela określająca osobowość chochlika',
      wyniki: {
        3: { wynik: 'Jesteś okrutny, niegodziwy i samolubny. Lubisz sprawiać innym ból.', efekt: 'Brak efektu mechanicznego' },
        4: { wynik: 'Jesteś kapryśny i nieprzewidywalny. Rzadko dotrzymujesz słowa i dajesz się ponosić impulsom.', efekt: 'Brak efektu mechanicznego' },
        5: { wynik: 'Kierujesz się prawem silniejszego. Posłuszeństwo wobec władzy jest najwyższym ideałem.', efekt: 'Brak efektu mechanicznego' },
        6: { wynik: 'Kierujesz się prawem silniejszego. Posłuszeństwo wobec władzy jest najwyższym ideałem.', efekt: 'Brak efektu mechanicznego' },
        7: { wynik: 'Dbasz przede wszystkim o siebie. Jesteś w stanie zdradzić nawet przyjaciół.', efekt: 'Brak efektu mechanicznego' },
        8: { wynik: 'Dbasz przede wszystkim o siebie. Jesteś w stanie zdradzić nawet przyjaciół.', efekt: 'Brak efektu mechanicznego' },
        9: { wynik: 'Ponad wszystkim innym stawiasz dobro swoje i swoich bliskich.', efekt: 'Brak efektu mechanicznego' },
        10: { wynik: 'Ponad wszystkim innym stawiasz dobro swoje i swoich bliskich.', efekt: 'Brak efektu mechanicznego' },
        11: { wynik: 'Ponad wszystkim innym stawiasz dobro swoje i swoich bliskich.', efekt: 'Brak efektu mechanicznego' },
        12: { wynik: 'Ponad wszystkim innym stawiasz dobro swoje i swoich bliskich.', efekt: 'Brak efektu mechanicznego' },
        13: { wynik: 'Pomagasz innym, bo tak należy.', efekt: 'Brak efektu mechanicznego' },
        14: { wynik: 'Pomagasz innym, bo tak należy.', efekt: 'Brak efektu mechanicznego' },
        15: { wynik: 'Starasz się postępować słusznie, nawet jeśli jest to wbrew prawu czy normom społecznym.', efekt: 'Brak efektu mechanicznego' },
        16: { wynik: 'Starasz się postępować słusznie, nawet jeśli jest to wbrew prawu czy normom społecznym.', efekt: 'Brak efektu mechanicznego' },
        17: { wynik: 'We wszystkim kierujesz się honorem i lojalnością.', efekt: 'Brak efektu mechanicznego' },
        18: { wynik: 'Jesteś oddany dobrym i szlachetnym celom i nie zdradzisz swoich przekonań nawet za cenę życia.', efekt: 'Brak efektu mechanicznego' }
      }
    }
  },

  // ========== ELF ==========
  elf: {
    przeszlosc: {
      nazwa: 'Przeszłość',
      typ: 'k20',
      opis: 'Tabela określająca przeszłość elfa',
      wyniki: {
        1: { wynik: 'Umarłeś i powróciłeś do żywych. Zaczynasz grę z 1k6 punktów Szaleństwa.', efekt: 'Szaleństwo +1k6' },
        2: { wynik: 'Przez krótki czas byłeś opętany przez demona. Zaczynasz grę z 1 punktem Splugawienia.', efekt: 'Splugawienie +1' },
        3: { wynik: 'Spędziłeś 1k6 lat w więzieniu.', efekt: 'Brak efektu mechanicznego' },
        4: { wynik: 'Zabiłeś kogoś z zimną krwią. Zaczynasz grę z 1 punktem Splugawienia.', efekt: 'Splugawienie +1' },
        5: { wynik: 'Przeszedłeś ciężką chorobę.', efekt: 'Brak efektu mechanicznego' },
        6: { wynik: 'Należałeś do kultu i byłeś świadkiem wielu dziwnych rzeczy. Zaczynasz grę z 1 punktem Szaleństwa.', efekt: 'Szaleństwo +1' },
        7: { wynik: 'Przez 1k20 lat byłeś więźniem faerie.', efekt: 'Brak efektu mechanicznego' },
        8: { wynik: 'Nigdy nie otrząsnąłeś się z żalu po utracie bliskiej osoby.', efekt: 'Brak efektu mechanicznego' },
        9: { wynik: 'Straciłeś palec, kilka zębów albo ucho lub nosisz bliznę.', efekt: 'Brak efektu mechanicznego' },
        10: { wynik: 'Utrzymujesz się z pracy w swojej profesji.', efekt: 'Brak efektu mechanicznego' },
        11: { wynik: 'Zakochałeś się; związek ten nadal trwa lub zakończył się dobrze.', efekt: 'Brak efektu mechanicznego' },
        12: { wynik: 'Masz żonę lub męża i 1k6 − 2 dzieci (minimum 0).', efekt: 'Brak efektu mechanicznego' },
        13: { wynik: 'Odbyłeś wiele podróży w różne strony świata. Umiesz mówić w jednym dodatkowym języku.', efekt: 'Dodatkowy język' },
        14: { wynik: 'Posiadasz formalne wykształcenie. Umiesz czytać i pisać w języku wspólnym.', efekt: 'Brak efektu mechanicznego' },
        15: { wynik: 'Obroniłeś rodzinne miasto przed okropnymi potworami.', efekt: 'Brak efektu mechanicznego' },
        16: { wynik: 'Powstrzymałeś spisek na życie ważnej persony lub schwytałeś zabójcę.', efekt: 'Brak efektu mechanicznego' },
        17: { wynik: 'Dokonałeś wielkich czynów i w swoich rodzinnych stronach jesteś bohaterem.', efekt: 'Brak efektu mechanicznego' },
        18: { wynik: 'Znalazłeś starą mapę wiodącą do skarbu.', efekt: 'Brak efektu mechanicznego' },
        19: { wynik: 'Ktoś ważny i wpływowy jest ci winien przysługę.', efekt: 'Brak efektu mechanicznego' },
        20: { wynik: 'Odziedziczyłeś w spadku pieniądze; zaczynasz grę z 2k6 miedziaków.', efekt: 'Pieniądze +2k6 miedziaków' }
      }
    },
    wiek: {
      nazwa: 'Wiek',
      typ: '3k6',
      opis: 'Tabela określająca wiek elfa',
      wyniki: {
        3: { wynik: 'Dziecko, 11 lat lub mniej.', efekt: 'Brak efektu mechanicznego' },
        4: { wynik: 'Młodociany, 12–17 lat.', efekt: 'Brak efektu mechanicznego' },
        5: { wynik: 'Młodociany, 12–17 lat.', efekt: 'Brak efektu mechanicznego' },
        6: { wynik: 'Młodociany, 12–17 lat.', efekt: 'Brak efektu mechanicznego' },
        7: { wynik: 'Młodociany, 12–17 lat.', efekt: 'Brak efektu mechanicznego' },
        8: { wynik: 'Młody dorosły, 18–35 lat.', efekt: 'Brak efektu mechanicznego' },
        9: { wynik: 'Młody dorosły, 18–35 lat.', efekt: 'Brak efektu mechanicznego' },
        10: { wynik: 'Młody dorosły, 18–35 lat.', efekt: 'Brak efektu mechanicznego' },
        11: { wynik: 'Młody dorosły, 18–35 lat.', efekt: 'Brak efektu mechanicznego' },
        12: { wynik: 'Młody dorosły, 18–35 lat.', efekt: 'Brak efektu mechanicznego' },
        13: { wynik: 'Dorosły w średnim wieku, 36–55 lat.', efekt: 'Brak efektu mechanicznego' },
        14: { wynik: 'Dorosły w średnim wieku, 36–55 lat.', efekt: 'Brak efektu mechanicznego' },
        15: { wynik: 'Dorosły w średnim wieku, 36–55 lat.', efekt: 'Brak efektu mechanicznego' },
        16: { wynik: 'Starszy dorosły, 56–75 lat.', efekt: 'Brak efektu mechanicznego' },
        17: { wynik: 'Starszy dorosły, 56–75 lat.', efekt: 'Brak efektu mechanicznego' },
        18: { wynik: 'Sędziwy dorosły, 76 lat lub więcej.', efekt: 'Brak efektu mechanicznego' }
      }
    }
  },

  // ========== HOBGOBLIN ==========
  hobgoblin: {
    przeszlosc: {
      nazwa: 'Przeszłość',
      typ: 'k20',
      opis: 'Tabela określająca przeszłość hobgoblina',
      wyniki: {
        1: { wynik: 'Umarłeś i powróciłeś do żywych. Zaczynasz grę z 1k6 punktów Szaleństwa.', efekt: 'Szaleństwo +1k6' },
        2: { wynik: 'Przez krótki czas byłeś opętany przez demona. Zaczynasz grę z 1 punktem Splugawienia.', efekt: 'Splugawienie +1' },
        3: { wynik: 'Spędziłeś 1k6 lat w więzieniu.', efekt: 'Brak efektu mechanicznego' },
        4: { wynik: 'Zabiłeś kogoś z zimną krwią. Zaczynasz grę z 1 punktem Splugawienia.', efekt: 'Splugawienie +1' },
        5: { wynik: 'Przeszedłeś ciężką chorobę.', efekt: 'Brak efektu mechanicznego' },
        6: { wynik: 'Należałeś do kultu i byłeś świadkiem wielu dziwnych rzeczy. Zaczynasz grę z 1 punktem Szaleństwa.', efekt: 'Szaleństwo +1' },
        7: { wynik: 'Przez 1k20 lat byłeś więźniem faerie.', efekt: 'Brak efektu mechanicznego' },
        8: { wynik: 'Nigdy nie otrząsnąłeś się z żalu po utracie bliskiej osoby.', efekt: 'Brak efektu mechanicznego' },
        9: { wynik: 'Straciłeś palec, kilka zębów albo ucho lub nosisz bliznę.', efekt: 'Brak efektu mechanicznego' },
        10: { wynik: 'Utrzymujesz się z pracy w swojej profesji.', efekt: 'Brak efektu mechanicznego' },
        11: { wynik: 'Zakochałeś się; związek ten nadal trwa lub zakończył się dobrze.', efekt: 'Brak efektu mechanicznego' },
        12: { wynik: 'Masz żonę lub męża i 1k6 − 2 dzieci (minimum 0).', efekt: 'Brak efektu mechanicznego' },
        13: { wynik: 'Odbyłeś wiele podróży w różne strony świata. Umiesz mówić w jednym dodatkowym języku.', efekt: 'Dodatkowy język' },
        14: { wynik: 'Posiadasz formalne wykształcenie. Umiesz czytać i pisać w języku wspólnym.', efekt: 'Brak efektu mechanicznego' },
        15: { wynik: 'Obroniłeś rodzinne miasto przed okropnymi potworami.', efekt: 'Brak efektu mechanicznego' },
        16: { wynik: 'Powstrzymałeś spisek na życie ważnej persony lub schwytałeś zabójcę.', efekt: 'Brak efektu mechanicznego' },
        17: { wynik: 'Dokonałeś wielkich czynów i w swoich rodzinnych stronach jesteś bohaterem.', efekt: 'Brak efektu mechanicznego' },
        18: { wynik: 'Znalazłeś starą mapę wiodącą do skarbu.', efekt: 'Brak efektu mechanicznego' },
        19: { wynik: 'Ktoś ważny i wpływowy jest ci winien przysługę.', efekt: 'Brak efektu mechanicznego' },
        20: { wynik: 'Odziedziczyłeś w spadku pieniądze; zaczynasz grę z 2k6 miedziaków.', efekt: 'Pieniądze +2k6 miedziaków' }
      }
    },
    wiek: {
      nazwa: 'Wiek',
      typ: '3k6',
      opis: 'Tabela określająca wiek hobgoblina',
      wyniki: {
        3: { wynik: 'Dziecko, 8 lat lub mniej.', efekt: 'Brak efektu mechanicznego' },
        4: { wynik: 'Młodociany, 9–14 lat.', efekt: 'Brak efektu mechanicznego' },
        5: { wynik: 'Młodociany, 9–14 lat.', efekt: 'Brak efektu mechanicznego' },
        6: { wynik: 'Młodociany, 9–14 lat.', efekt: 'Brak efektu mechanicznego' },
        7: { wynik: 'Młodociany, 9–14 lat.', efekt: 'Brak efektu mechanicznego' },
        8: { wynik: 'Młody dorosły, 15–25 lat.', efekt: 'Brak efektu mechanicznego' },
        9: { wynik: 'Młody dorosły, 15–25 lat.', efekt: 'Brak efektu mechanicznego' },
        10: { wynik: 'Młody dorosły, 15–25 lat.', efekt: 'Brak efektu mechanicznego' },
        11: { wynik: 'Młody dorosły, 15–25 lat.', efekt: 'Brak efektu mechanicznego' },
        12: { wynik: 'Młody dorosły, 15–25 lat.', efekt: 'Brak efektu mechanicznego' },
        13: { wynik: 'Dorosły w średnim wieku, 26–40 lat.', efekt: 'Brak efektu mechanicznego' },
        14: { wynik: 'Dorosły w średnim wieku, 26–40 lat.', efekt: 'Brak efektu mechanicznego' },
        15: { wynik: 'Dorosły w średnim wieku, 26–40 lat.', efekt: 'Brak efektu mechanicznego' },
        16: { wynik: 'Starszy dorosły, 41–60 lat.', efekt: 'Brak efektu mechanicznego' },
        17: { wynik: 'Starszy dorosły, 41–60 lat.', efekt: 'Brak efektu mechanicznego' },
        18: { wynik: 'Sędziwy dorosły, 61 lat lub więcej.', efekt: 'Brak efektu mechanicznego' }
      }
    },
    osobowosc: {
      nazwa: 'Osobowość',
      typ: '3k6',
      opis: 'Tabela określająca osobowość hobgoblina',
      wyniki: {
        3: { wynik: 'Jesteś okrutny, niegodziwy i samolubny. Lubisz sprawiać innym ból.', efekt: 'Brak efektu mechanicznego' },
        4: { wynik: 'Jesteś kapryśny i nieprzewidywalny. Rzadko dotrzymujesz słowa i dajesz się ponosić impulsom.', efekt: 'Brak efektu mechanicznego' },
        5: { wynik: 'Kierujesz się prawem silniejszego. Posłuszeństwo wobec władzy jest najwyższym ideałem.', efekt: 'Brak efektu mechanicznego' },
        6: { wynik: 'Kierujesz się prawem silniejszego. Posłuszeństwo wobec władzy jest najwyższym ideałem.', efekt: 'Brak efektu mechanicznego' },
        7: { wynik: 'Dbasz przede wszystkim o siebie. Jesteś w stanie zdradzić nawet przyjaciół.', efekt: 'Brak efektu mechanicznego' },
        8: { wynik: 'Dbasz przede wszystkim o siebie. Jesteś w stanie zdradzić nawet przyjaciół.', efekt: 'Brak efektu mechanicznego' },
        9: { wynik: 'Ponad wszystkim innym stawiasz dobro swoje i swoich bliskich.', efekt: 'Brak efektu mechanicznego' },
        10: { wynik: 'Ponad wszystkim innym stawiasz dobro swoje i swoich bliskich.', efekt: 'Brak efektu mechanicznego' },
        11: { wynik: 'Ponad wszystkim innym stawiasz dobro swoje i swoich bliskich.', efekt: 'Brak efektu mechanicznego' },
        12: { wynik: 'Ponad wszystkim innym stawiasz dobro swoje i swoich bliskich.', efekt: 'Brak efektu mechanicznego' },
        13: { wynik: 'Pomagasz innym, bo tak należy.', efekt: 'Brak efektu mechanicznego' },
        14: { wynik: 'Pomagasz innym, bo tak należy.', efekt: 'Brak efektu mechanicznego' },
        15: { wynik: 'Starasz się postępować słusznie, nawet jeśli jest to wbrew prawu czy normom społecznym.', efekt: 'Brak efektu mechanicznego' },
        16: { wynik: 'Starasz się postępować słusznie, nawet jeśli jest to wbrew prawu czy normom społecznym.', efekt: 'Brak efektu mechanicznego' },
        17: { wynik: 'We wszystkim kierujesz się honorem i lojalnością.', efekt: 'Brak efektu mechanicznego' },
        18: { wynik: 'Jesteś oddany dobrym i szlachetnym celom i nie zdradzisz swoich przekonań nawet za cenę życia.', efekt: 'Brak efektu mechanicznego' }
      }
    }
  },

  // ========== GOBLIN ==========
  goblin: {
    przeszlosc: {
      nazwa: 'Przeszłość',
      typ: 'k20',
      opis: 'Tabela określająca przeszłość goblina',
      wyniki: {
        1: { wynik: 'Umarłeś i powróciłeś do żywych. Zaczynasz grę z 1k6 punktów Szaleństwa.', efekt: 'Szaleństwo +1k6' },
        2: { wynik: 'Przez krótki czas byłeś opętany przez demona. Zaczynasz grę z 1 punktem Splugawienia.', efekt: 'Splugawienie +1' },
        3: { wynik: 'Spędziłeś 1k6 lat w więzieniu.', efekt: 'Brak efektu mechanicznego' },
        4: { wynik: 'Zabiłeś kogoś z zimną krwią. Zaczynasz grę z 1 punktem Splugawienia.', efekt: 'Splugawienie +1' },
        5: { wynik: 'Przeszedłeś ciężką chorobę.', efekt: 'Brak efektu mechanicznego' },
        6: { wynik: 'Należałeś do kultu i byłeś świadkiem wielu dziwnych rzeczy. Zaczynasz grę z 1 punktem Szaleństwa.', efekt: 'Szaleństwo +1' },
        7: { wynik: 'Przez 1k20 lat byłeś więźniem faerie.', efekt: 'Brak efektu mechanicznego' },
        8: { wynik: 'Nigdy nie otrząsnąłeś się z żalu po utracie bliskiej osoby.', efekt: 'Brak efektu mechanicznego' },
        9: { wynik: 'Straciłeś palec, kilka zębów albo ucho lub nosisz bliznę.', efekt: 'Brak efektu mechanicznego' },
        10: { wynik: 'Utrzymujesz się z pracy w swojej profesji.', efekt: 'Brak efektu mechanicznego' },
        11: { wynik: 'Zakochałeś się; związek ten nadal trwa lub zakończył się dobrze.', efekt: 'Brak efektu mechanicznego' },
        12: { wynik: 'Masz żonę lub męża i 1k6 − 2 dzieci (minimum 0).', efekt: 'Brak efektu mechanicznego' },
        13: { wynik: 'Odbyłeś wiele podróży w różne strony świata. Umiesz mówić w jednym dodatkowym języku.', efekt: 'Dodatkowy język' },
        14: { wynik: 'Posiadasz formalne wykształcenie. Umiesz czytać i pisać w języku wspólnym.', efekt: 'Brak efektu mechanicznego' },
        15: { wynik: 'Obroniłeś rodzinne miasto przed okropnymi potworami.', efekt: 'Brak efektu mechanicznego' },
        16: { wynik: 'Powstrzymałeś spisek na życie ważnej persony lub schwytałeś zabójcę.', efekt: 'Brak efektu mechanicznego' },
        17: { wynik: 'Dokonałeś wielkich czynów i w swoich rodzinnych stronach jesteś bohaterem.', efekt: 'Brak efektu mechanicznego' },
        18: { wynik: 'Znalazłeś starą mapę wiodącą do skarbu.', efekt: 'Brak efektu mechanicznego' },
        19: { wynik: 'Ktoś ważny i wpływowy jest ci winien przysługę.', efekt: 'Brak efektu mechanicznego' },
        20: { wynik: 'Odziedziczyłeś w spadku pieniądze; zaczynasz grę z 2k6 miedziaków.', efekt: 'Pieniądze +2k6 miedziaków' }
      }
    },
    wiek: {
      nazwa: 'Wiek',
      typ: '3k6',
      opis: 'Tabela określająca wiek goblina',
      wyniki: {
        3: { wynik: 'Dziecko, 5 lat lub mniej.', efekt: 'Brak efektu mechanicznego' },
        4: { wynik: 'Młodociany, 6–10 lat.', efekt: 'Brak efektu mechanicznego' },
        5: { wynik: 'Młodociany, 6–10 lat.', efekt: 'Brak efektu mechanicznego' },
        6: { wynik: 'Młodociany, 6–10 lat.', efekt: 'Brak efektu mechanicznego' },
        7: { wynik: 'Młodociany, 6–10 lat.', efekt: 'Brak efektu mechanicznego' },
        8: { wynik: 'Młody dorosły, 11–20 lat.', efekt: 'Brak efektu mechanicznego' },
        9: { wynik: 'Młody dorosły, 11–20 lat.', efekt: 'Brak efektu mechanicznego' },
        10: { wynik: 'Młody dorosły, 11–20 lat.', efekt: 'Brak efektu mechanicznego' },
        11: { wynik: 'Młody dorosły, 11–20 lat.', efekt: 'Brak efektu mechanicznego' },
        12: { wynik: 'Młody dorosły, 11–20 lat.', efekt: 'Brak efektu mechanicznego' },
        13: { wynik: 'Dorosły w średnim wieku, 21–40 lat.', efekt: 'Brak efektu mechanicznego' },
        14: { wynik: 'Dorosły w średnim wieku, 21–40 lat.', efekt: 'Brak efektu mechanicznego' },
        15: { wynik: 'Dorosły w średnim wieku, 21–40 lat.', efekt: 'Brak efektu mechanicznego' },
        16: { wynik: 'Starszy dorosły, 41–60 lat.', efekt: 'Brak efektu mechanicznego' },
        17: { wynik: 'Starszy dorosły, 41–60 lat.', efekt: 'Brak efektu mechanicznego' },
        18: { wynik: 'Sędziwy dorosły, 61 lat lub więcej.', efekt: 'Brak efektu mechanicznego' }
      }
    },
    osobowosc: {
      nazwa: 'Osobowość',
      typ: '3k6',
      opis: 'Tabela określająca osobowość goblina',
      wyniki: {
        3: { wynik: 'Jesteś okrutny, niegodziwy i samolubny. Lubisz sprawiać innym ból.', efekt: 'Brak efektu mechanicznego' },
        4: { wynik: 'Jesteś kapryśny i nieprzewidywalny. Rzadko dotrzymujesz słowa i dajesz się ponosić impulsom.', efekt: 'Brak efektu mechanicznego' },
        5: { wynik: 'Kierujesz się prawem silniejszego. Posłuszeństwo wobec władzy jest najwyższym ideałem.', efekt: 'Brak efektu mechanicznego' },
        6: { wynik: 'Kierujesz się prawem silniejszego. Posłuszeństwo wobec władzy jest najwyższym ideałem.', efekt: 'Brak efektu mechanicznego' },
        7: { wynik: 'Dbasz przede wszystkim o siebie. Jesteś w stanie zdradzić nawet przyjaciół.', efekt: 'Brak efektu mechanicznego' },
        8: { wynik: 'Dbasz przede wszystkim o siebie. Jesteś w stanie zdradzić nawet przyjaciół.', efekt: 'Brak efektu mechanicznego' },
        9: { wynik: 'Ponad wszystkim innym stawiasz dobro swoje i swoich bliskich.', efekt: 'Brak efektu mechanicznego' },
        10: { wynik: 'Ponad wszystkim innym stawiasz dobro swoje i swoich bliskich.', efekt: 'Brak efektu mechanicznego' },
        11: { wynik: 'Ponad wszystkim innym stawiasz dobro swoje i swoich bliskich.', efekt: 'Brak efektu mechanicznego' },
        12: { wynik: 'Ponad wszystkim innym stawiasz dobro swoje i swoich bliskich.', efekt: 'Brak efektu mechanicznego' },
        13: { wynik: 'Pomagasz innym, bo tak należy.', efekt: 'Brak efektu mechanicznego' },
        14: { wynik: 'Pomagasz innym, bo tak należy.', efekt: 'Brak efektu mechanicznego' },
        15: { wynik: 'Starasz się postępować słusznie, nawet jeśli jest to wbrew prawu czy normom społecznym.', efekt: 'Brak efektu mechanicznego' },
        16: { wynik: 'Starasz się postępować słusznie, nawet jeśli jest to wbrew prawu czy normom społecznym.', efekt: 'Brak efektu mechanicznego' },
        17: { wynik: 'We wszystkim kierujesz się honorem i lojalnością.', efekt: 'Brak efektu mechanicznego' },
        18: { wynik: 'Jesteś oddany dobrym i szlachetnym celom i nie zdradzisz swoich przekonań nawet za cenę życia.', efekt: 'Brak efektu mechanicznego' }
      }
    }
  },

  // ========== KRASNOLUD ==========
  krasnolud: {
    przeszlosc: {
      nazwa: 'Przeszłość',
      typ: 'k20',
      opis: 'Tabela określająca przeszłość krasnoluda',
      wyniki: {
        1: { wynik: 'Umarłeś i powróciłeś do żywych. Zaczynasz grę z 1k6 punktów Szaleństwa.', efekt: 'Szaleństwo +1k6' },
        2: { wynik: 'Przez krótki czas byłeś opętany przez demona. Zaczynasz grę z 1 punktem Splugawienia.', efekt: 'Splugawienie +1' },
        3: { wynik: 'Spędziłeś 1k6 lat w więzieniu.', efekt: 'Brak efektu mechanicznego' },
        4: { wynik: 'Zabiłeś kogoś z zimną krwią. Zaczynasz grę z 1 punktem Splugawienia.', efekt: 'Splugawienie +1' },
        5: { wynik: 'Przeszedłeś ciężką chorobę.', efekt: 'Brak efektu mechanicznego' },
        6: { wynik: 'Należałeś do kultu i byłeś świadkiem wielu dziwnych rzeczy. Zaczynasz grę z 1 punktem Szaleństwa.', efekt: 'Szaleństwo +1' },
        7: { wynik: 'Przez 1k20 lat byłeś więźniem faerie.', efekt: 'Brak efektu mechanicznego' },
        8: { wynik: 'Nigdy nie otrząsnąłeś się z żalu po utracie bliskiej osoby.', efekt: 'Brak efektu mechanicznego' },
        9: { wynik: 'Straciłeś palec, kilka zębów albo ucho lub nosisz bliznę.', efekt: 'Brak efektu mechanicznego' },
        10: { wynik: 'Utrzymujesz się z pracy w swojej profesji.', efekt: 'Brak efektu mechanicznego' },
        11: { wynik: 'Zakochałeś się; związek ten nadal trwa lub zakończył się dobrze.', efekt: 'Brak efektu mechanicznego' },
        12: { wynik: 'Masz żonę lub męża i 1k6 − 2 dzieci (minimum 0).', efekt: 'Brak efektu mechanicznego' },
        13: { wynik: 'Odbyłeś wiele podróży w różne strony świata. Umiesz mówić w jednym dodatkowym języku.', efekt: 'Dodatkowy język' },
        14: { wynik: 'Posiadasz formalne wykształcenie. Umiesz czytać i pisać w języku wspólnym.', efekt: 'Brak efektu mechanicznego' },
        15: { wynik: 'Obroniłeś rodzinne miasto przed okropnymi potworami.', efekt: 'Brak efektu mechanicznego' },
        16: { wynik: 'Powstrzymałeś spisek na życie ważnej persony lub schwytałeś zabójcę.', efekt: 'Brak efektu mechanicznego' },
        17: { wynik: 'Dokonałeś wielkich czynów i w swoich rodzinnych stronach jesteś bohaterem.', efekt: 'Brak efektu mechanicznego' },
        18: { wynik: 'Znalazłeś starą mapę wiodącą do skarbu.', efekt: 'Brak efektu mechanicznego' },
        19: { wynik: 'Ktoś ważny i wpływowy jest ci winien przysługę.', efekt: 'Brak efektu mechanicznego' },
        20: { wynik: 'Odziedziczyłeś w spadku pieniądze; zaczynasz grę z 2k6 miedziaków.', efekt: 'Pieniądze +2k6 miedziaków' }
      }
    },
    wiek: {
      nazwa: 'Wiek',
      typ: '3k6',
      opis: 'Tabela określająca wiek krasnoluda',
      wyniki: {
        3: { wynik: 'Dziecko, 10 lat lub mniej.', efekt: 'Brak efektu mechanicznego' },
        4: { wynik: 'Młodociany, 11–20 lat.', efekt: 'Brak efektu mechanicznego' },
        5: { wynik: 'Młodociany, 11–20 lat.', efekt: 'Brak efektu mechanicznego' },
        6: { wynik: 'Młodociany, 11–20 lat.', efekt: 'Brak efektu mechanicznego' },
        7: { wynik: 'Młodociany, 11–20 lat.', efekt: 'Brak efektu mechanicznego' },
        8: { wynik: 'Młody dorosły, 21–40 lat.', efekt: 'Brak efektu mechanicznego' },
        9: { wynik: 'Młody dorosły, 21–40 lat.', efekt: 'Brak efektu mechanicznego' },
        10: { wynik: 'Młody dorosły, 21–40 lat.', efekt: 'Brak efektu mechanicznego' },
        11: { wynik: 'Młody dorosły, 21–40 lat.', efekt: 'Brak efektu mechanicznego' },
        12: { wynik: 'Młody dorosły, 21–40 lat.', efekt: 'Brak efektu mechanicznego' },
        13: { wynik: 'Dorosły w średnim wieku, 41–80 lat.', efekt: 'Brak efektu mechanicznego' },
        14: { wynik: 'Dorosły w średnim wieku, 41–80 lat.', efekt: 'Brak efektu mechanicznego' },
        15: { wynik: 'Dorosły w średnim wieku, 41–80 lat.', efekt: 'Brak efektu mechanicznego' },
        16: { wynik: 'Starszy dorosły, 81–120 lat.', efekt: 'Brak efektu mechanicznego' },
        17: { wynik: 'Starszy dorosły, 81–120 lat.', efekt: 'Brak efektu mechanicznego' },
        18: { wynik: 'Sędziwy dorosły, 121 lat lub więcej.', efekt: 'Brak efektu mechanicznego' }
      }
    },
    osobowosc: {
      nazwa: 'Osobowość',
      typ: '3k6',
      opis: 'Tabela określająca osobowość krasnoluda',
      wyniki: {
        3: { wynik: 'Jesteś okrutny, niegodziwy i samolubny. Lubisz sprawiać innym ból.', efekt: 'Brak efektu mechanicznego' },
        4: { wynik: 'Jesteś kapryśny i nieprzewidywalny. Rzadko dotrzymujesz słowa i dajesz się ponosić impulsom.', efekt: 'Brak efektu mechanicznego' },
        5: { wynik: 'Kierujesz się prawem silniejszego. Posłuszeństwo wobec władzy jest najwyższym ideałem.', efekt: 'Brak efektu mechanicznego' },
        6: { wynik: 'Kierujesz się prawem silniejszego. Posłuszeństwo wobec władzy jest najwyższym ideałem.', efekt: 'Brak efektu mechanicznego' },
        7: { wynik: 'Dbasz przede wszystkim o siebie. Jesteś w stanie zdradzić nawet przyjaciół.', efekt: 'Brak efektu mechanicznego' },
        8: { wynik: 'Dbasz przede wszystkim o siebie. Jesteś w stanie zdradzić nawet przyjaciół.', efekt: 'Brak efektu mechanicznego' },
        9: { wynik: 'Ponad wszystkim innym stawiasz dobro swoje i swoich bliskich.', efekt: 'Brak efektu mechanicznego' },
        10: { wynik: 'Ponad wszystkim innym stawiasz dobro swoje i swoich bliskich.', efekt: 'Brak efektu mechanicznego' },
        11: { wynik: 'Ponad wszystkim innym stawiasz dobro swoje i swoich bliskich.', efekt: 'Brak efektu mechanicznego' },
        12: { wynik: 'Ponad wszystkim innym stawiasz dobro swoje i swoich bliskich.', efekt: 'Brak efektu mechanicznego' },
        13: { wynik: 'Pomagasz innym, bo tak należy.', efekt: 'Brak efektu mechanicznego' },
        14: { wynik: 'Pomagasz innym, bo tak należy.', efekt: 'Brak efektu mechanicznego' },
        15: { wynik: 'Starasz się postępować słusznie, nawet jeśli jest to wbrew prawu czy normom społecznym.', efekt: 'Brak efektu mechanicznego' },
        16: { wynik: 'Starasz się postępować słusznie, nawet jeśli jest to wbrew prawu czy normom społecznym.', efekt: 'Brak efektu mechanicznego' },
        17: { wynik: 'We wszystkim kierujesz się honorem i lojalnością.', efekt: 'Brak efektu mechanicznego' },
        18: { wynik: 'Jesteś oddany dobrym i szlachetnym celom i nie zdradzisz swoich przekonań nawet za cenę życia.', efekt: 'Brak efektu mechanicznego' }
      }
    }
  },

  // ========== ODMINIEC ==========
  odmieniec: {
    przeszlosc: {
      nazwa: 'Przeszłość',
      typ: 'k20',
      opis: 'Tabela określająca przeszłość odmienca',
      wyniki: {
        1: { wynik: 'Umarłeś i powróciłeś do żywych. Zaczynasz grę z 1k6 punktów Szaleństwa.', efekt: 'Szaleństwo +1k6' },
        2: { wynik: 'Przez krótki czas byłeś opętany przez demona. Zaczynasz grę z 1 punktem Splugawienia.', efekt: 'Splugawienie +1' },
        3: { wynik: 'Spędziłeś 1k6 lat w więzieniu.', efekt: 'Brak efektu mechanicznego' },
        4: { wynik: 'Zabiłeś kogoś z zimną krwią. Zaczynasz grę z 1 punktem Splugawienia.', efekt: 'Splugawienie +1' },
        5: { wynik: 'Przeszedłeś ciężką chorobę.', efekt: 'Brak efektu mechanicznego' },
        6: { wynik: 'Należałeś do kultu i byłeś świadkiem wielu dziwnych rzeczy. Zaczynasz grę z 1 punktem Szaleństwa.', efekt: 'Szaleństwo +1' },
        7: { wynik: 'Przez 1k20 lat byłeś więźniem faerie.', efekt: 'Brak efektu mechanicznego' },
        8: { wynik: 'Nigdy nie otrząsnąłeś się z żalu po utracie bliskiej osoby.', efekt: 'Brak efektu mechanicznego' },
        9: { wynik: 'Straciłeś palec, kilka zębów albo ucho lub nosisz bliznę.', efekt: 'Brak efektu mechanicznego' },
        10: { wynik: 'Utrzymujesz się z pracy w swojej profesji.', efekt: 'Brak efektu mechanicznego' },
        11: { wynik: 'Zakochałeś się; związek ten nadal trwa lub zakończył się dobrze.', efekt: 'Brak efektu mechanicznego' },
        12: { wynik: 'Masz żonę lub męża i 1k6 − 2 dzieci (minimum 0).', efekt: 'Brak efektu mechanicznego' },
        13: { wynik: 'Odbyłeś wiele podróży w różne strony świata. Umiesz mówić w jednym dodatkowym języku.', efekt: 'Dodatkowy język' },
        14: { wynik: 'Posiadasz formalne wykształcenie. Umiesz czytać i pisać w języku wspólnym.', efekt: 'Brak efektu mechanicznego' },
        15: { wynik: 'Obroniłeś rodzinne miasto przed okropnymi potworami.', efekt: 'Brak efektu mechanicznego' },
        16: { wynik: 'Powstrzymałeś spisek na życie ważnej persony lub schwytałeś zabójcę.', efekt: 'Brak efektu mechanicznego' },
        17: { wynik: 'Dokonałeś wielkich czynów i w swoich rodzinnych stronach jesteś bohaterem.', efekt: 'Brak efektu mechanicznego' },
        18: { wynik: 'Znalazłeś starą mapę wiodącą do skarbu.', efekt: 'Brak efektu mechanicznego' },
        19: { wynik: 'Ktoś ważny i wpływowy jest ci winien przysługę.', efekt: 'Brak efektu mechanicznego' },
        20: { wynik: 'Odziedziczyłeś w spadku pieniądze; zaczynasz grę z 2k6 miedziaków.', efekt: 'Pieniądze +2k6 miedziaków' }
      }
    },
    wiek: {
      nazwa: 'Wiek',
      typ: '3k6',
      opis: 'Tabela określająca wiek odmienca',
      wyniki: {
        3: { wynik: 'Dziecko, 8 lat lub mniej.', efekt: 'Brak efektu mechanicznego' },
        4: { wynik: 'Młodociany, 9–14 lat.', efekt: 'Brak efektu mechanicznego' },
        5: { wynik: 'Młodociany, 9–14 lat.', efekt: 'Brak efektu mechanicznego' },
        6: { wynik: 'Młodociany, 9–14 lat.', efekt: 'Brak efektu mechanicznego' },
        7: { wynik: 'Młodociany, 9–14 lat.', efekt: 'Brak efektu mechanicznego' },
        8: { wynik: 'Młody dorosły, 15–25 lat.', efekt: 'Brak efektu mechanicznego' },
        9: { wynik: 'Młody dorosły, 15–25 lat.', efekt: 'Brak efektu mechanicznego' },
        10: { wynik: 'Młody dorosły, 15–25 lat.', efekt: 'Brak efektu mechanicznego' },
        11: { wynik: 'Młody dorosły, 15–25 lat.', efekt: 'Brak efektu mechanicznego' },
        12: { wynik: 'Młody dorosły, 15–25 lat.', efekt: 'Brak efektu mechanicznego' },
        13: { wynik: 'Dorosły w średnim wieku, 26–40 lat.', efekt: 'Brak efektu mechanicznego' },
        14: { wynik: 'Dorosły w średnim wieku, 26–40 lat.', efekt: 'Brak efektu mechanicznego' },
        15: { wynik: 'Dorosły w średnim wieku, 26–40 lat.', efekt: 'Brak efektu mechanicznego' },
        16: { wynik: 'Starszy dorosły, 41–60 lat.', efekt: 'Brak efektu mechanicznego' },
        17: { wynik: 'Starszy dorosły, 41–60 lat.', efekt: 'Brak efektu mechanicznego' },
        18: { wynik: 'Sędziwy dorosły, 61 lat lub więcej.', efekt: 'Brak efektu mechanicznego' }
      }
    },
    osobowosc: {
      nazwa: 'Osobowość',
      typ: '3k6',
      opis: 'Tabela określająca osobowość odmienca',
      wyniki: {
        3: { wynik: 'Jesteś okrutny, niegodziwy i samolubny. Lubisz sprawiać innym ból.', efekt: 'Brak efektu mechanicznego' },
        4: { wynik: 'Jesteś kapryśny i nieprzewidywalny. Rzadko dotrzymujesz słowa i dajesz się ponosić impulsom.', efekt: 'Brak efektu mechanicznego' },
        5: { wynik: 'Kierujesz się prawem silniejszego. Posłuszeństwo wobec władzy jest najwyższym ideałem.', efekt: 'Brak efektu mechanicznego' },
        6: { wynik: 'Kierujesz się prawem silniejszego. Posłuszeństwo wobec władzy jest najwyższym ideałem.', efekt: 'Brak efektu mechanicznego' },
        7: { wynik: 'Dbasz przede wszystkim o siebie. Jesteś w stanie zdradzić nawet przyjaciół.', efekt: 'Brak efektu mechanicznego' },
        8: { wynik: 'Dbasz przede wszystkim o siebie. Jesteś w stanie zdradzić nawet przyjaciół.', efekt: 'Brak efektu mechanicznego' },
        9: { wynik: 'Ponad wszystkim innym stawiasz dobro swoje i swoich bliskich.', efekt: 'Brak efektu mechanicznego' },
        10: { wynik: 'Ponad wszystkim innym stawiasz dobro swoje i swoich bliskich.', efekt: 'Brak efektu mechanicznego' },
        11: { wynik: 'Ponad wszystkim innym stawiasz dobro swoje i swoich bliskich.', efekt: 'Brak efektu mechanicznego' },
        12: { wynik: 'Ponad wszystkim innym stawiasz dobro swoje i swoich bliskich.', efekt: 'Brak efektu mechanicznego' },
        13: { wynik: 'Pomagasz innym, bo tak należy.', efekt: 'Brak efektu mechanicznego' },
        14: { wynik: 'Pomagasz innym, bo tak należy.', efekt: 'Brak efektu mechanicznego' },
        15: { wynik: 'Starasz się postępować słusznie, nawet jeśli jest to wbrew prawu czy normom społecznym.', efekt: 'Brak efektu mechanicznego' },
        16: { wynik: 'Starasz się postępować słusznie, nawet jeśli jest to wbrew prawu czy normom społecznym.', efekt: 'Brak efektu mechanicznego' },
        17: { wynik: 'We wszystkim kierujesz się honorem i lojalnością.', efekt: 'Brak efektu mechanicznego' },
        18: { wynik: 'Jesteś oddany dobrym i szlachetnym celom i nie zdradzisz swoich przekonań nawet za cenę życia.', efekt: 'Brak efektu mechanicznego' }
      }
    }
  },

  // ========== ORK ==========
  ork: {
    przeszlosc: {
      nazwa: 'Przeszłość',
      typ: 'k20',
      opis: 'Tabela określająca przeszłość orka',
      wyniki: {
        1: { wynik: 'Umarłeś i powróciłeś do żywych. Zaczynasz grę z 1k6 punktów Szaleństwa.', efekt: 'Szaleństwo +1k6' },
        2: { wynik: 'Przez krótki czas byłeś opętany przez demona. Zaczynasz grę z 1 punktem Splugawienia.', efekt: 'Splugawienie +1' },
        3: { wynik: 'Spędziłeś 1k6 lat w więzieniu.', efekt: 'Brak efektu mechanicznego' },
        4: { wynik: 'Zabiłeś kogoś z zimną krwią. Zaczynasz grę z 1 punktem Splugawienia.', efekt: 'Splugawienie +1' },
        5: { wynik: 'Przeszedłeś ciężką chorobę.', efekt: 'Brak efektu mechanicznego' },
        6: { wynik: 'Należałeś do kultu i byłeś świadkiem wielu dziwnych rzeczy. Zaczynasz grę z 1 punktem Szaleństwa.', efekt: 'Szaleństwo +1' },
        7: { wynik: 'Przez 1k20 lat byłeś więźniem faerie.', efekt: 'Brak efektu mechanicznego' },
        8: { wynik: 'Nigdy nie otrząsnąłeś się z żalu po utracie bliskiej osoby.', efekt: 'Brak efektu mechanicznego' },
        9: { wynik: 'Straciłeś palec, kilka zębów albo ucho lub nosisz bliznę.', efekt: 'Brak efektu mechanicznego' },
        10: { wynik: 'Utrzymujesz się z pracy w swojej profesji.', efekt: 'Brak efektu mechanicznego' },
        11: { wynik: 'Zakochałeś się; związek ten nadal trwa lub zakończył się dobrze.', efekt: 'Brak efektu mechanicznego' },
        12: { wynik: 'Masz żonę lub męża i 1k6 − 2 dzieci (minimum 0).', efekt: 'Brak efektu mechanicznego' },
        13: { wynik: 'Odbyłeś wiele podróży w różne strony świata. Umiesz mówić w jednym dodatkowym języku.', efekt: 'Dodatkowy język' },
        14: { wynik: 'Posiadasz formalne wykształcenie. Umiesz czytać i pisać w języku wspólnym.', efekt: 'Brak efektu mechanicznego' },
        15: { wynik: 'Obroniłeś rodzinne miasto przed okropnymi potworami.', efekt: 'Brak efektu mechanicznego' },
        16: { wynik: 'Powstrzymałeś spisek na życie ważnej persony lub schwytałeś zabójcę.', efekt: 'Brak efektu mechanicznego' },
        17: { wynik: 'Dokonałeś wielkich czynów i w swoich rodzinnych stronach jesteś bohaterem.', efekt: 'Brak efektu mechanicznego' },
        18: { wynik: 'Znalazłeś starą mapę wiodącą do skarbu.', efekt: 'Brak efektu mechanicznego' },
        19: { wynik: 'Ktoś ważny i wpływowy jest ci winien przysługę.', efekt: 'Brak efektu mechanicznego' },
        20: { wynik: 'Odziedziczyłeś w spadku pieniądze; zaczynasz grę z 2k6 miedziaków.', efekt: 'Pieniądze +2k6 miedziaków' }
      }
    },
    wiek: {
      nazwa: 'Wiek',
      typ: '3k6',
      opis: 'Tabela określająca wiek orka',
      wyniki: {
        3: { wynik: 'Dziecko, 8 lat lub mniej.', efekt: 'Brak efektu mechanicznego' },
        4: { wynik: 'Młodociany, 9–14 lat.', efekt: 'Brak efektu mechanicznego' },
        5: { wynik: 'Młodociany, 9–14 lat.', efekt: 'Brak efektu mechanicznego' },
        6: { wynik: 'Młodociany, 9–14 lat.', efekt: 'Brak efektu mechanicznego' },
        7: { wynik: 'Młodociany, 9–14 lat.', efekt: 'Brak efektu mechanicznego' },
        8: { wynik: 'Młody dorosły, 15–25 lat.', efekt: 'Brak efektu mechanicznego' },
        9: { wynik: 'Młody dorosły, 15–25 lat.', efekt: 'Brak efektu mechanicznego' },
        10: { wynik: 'Młody dorosły, 15–25 lat.', efekt: 'Brak efektu mechanicznego' },
        11: { wynik: 'Młody dorosły, 15–25 lat.', efekt: 'Brak efektu mechanicznego' },
        12: { wynik: 'Młody dorosły, 15–25 lat.', efekt: 'Brak efektu mechanicznego' },
        13: { wynik: 'Dorosły w średnim wieku, 26–40 lat.', efekt: 'Brak efektu mechanicznego' },
        14: { wynik: 'Dorosły w średnim wieku, 26–40 lat.', efekt: 'Brak efektu mechanicznego' },
        15: { wynik: 'Dorosły w średnim wieku, 26–40 lat.', efekt: 'Brak efektu mechanicznego' },
        16: { wynik: 'Starszy dorosły, 41–60 lat.', efekt: 'Brak efektu mechanicznego' },
        17: { wynik: 'Starszy dorosły, 41–60 lat.', efekt: 'Brak efektu mechanicznego' },
        18: { wynik: 'Sędziwy dorosły, 61 lat lub więcej.', efekt: 'Brak efektu mechanicznego' }
      }
    },
    osobowosc: {
      nazwa: 'Osobowość',
      typ: '3k6',
      opis: 'Tabela określająca osobowość orka',
      wyniki: {
        3: { wynik: 'Jesteś okrutny, niegodziwy i samolubny. Lubisz sprawiać innym ból.', efekt: 'Brak efektu mechanicznego' },
        4: { wynik: 'Jesteś kapryśny i nieprzewidywalny. Rzadko dotrzymujesz słowa i dajesz się ponosić impulsom.', efekt: 'Brak efektu mechanicznego' },
        5: { wynik: 'Kierujesz się prawem silniejszego. Posłuszeństwo wobec władzy jest najwyższym ideałem.', efekt: 'Brak efektu mechanicznego' },
        6: { wynik: 'Kierujesz się prawem silniejszego. Posłuszeństwo wobec władzy jest najwyższym ideałem.', efekt: 'Brak efektu mechanicznego' },
        7: { wynik: 'Dbasz przede wszystkim o siebie. Jesteś w stanie zdradzić nawet przyjaciół.', efekt: 'Brak efektu mechanicznego' },
        8: { wynik: 'Dbasz przede wszystkim o siebie. Jesteś w stanie zdradzić nawet przyjaciół.', efekt: 'Brak efektu mechanicznego' },
        9: { wynik: 'Ponad wszystkim innym stawiasz dobro swoje i swoich bliskich.', efekt: 'Brak efektu mechanicznego' },
        10: { wynik: 'Ponad wszystkim innym stawiasz dobro swoje i swoich bliskich.', efekt: 'Brak efektu mechanicznego' },
        11: { wynik: 'Ponad wszystkim innym stawiasz dobro swoje i swoich bliskich.', efekt: 'Brak efektu mechanicznego' },
        12: { wynik: 'Ponad wszystkim innym stawiasz dobro swoje i swoich bliskich.', efekt: 'Brak efektu mechanicznego' },
        13: { wynik: 'Pomagasz innym, bo tak należy.', efekt: 'Brak efektu mechanicznego' },
        14: { wynik: 'Pomagasz innym, bo tak należy.', efekt: 'Brak efektu mechanicznego' },
        15: { wynik: 'Starasz się postępować słusznie, nawet jeśli jest to wbrew prawu czy normom społecznym.', efekt: 'Brak efektu mechanicznego' },
        16: { wynik: 'Starasz się postępować słusznie, nawet jeśli jest to wbrew prawu czy normom społecznym.', efekt: 'Brak efektu mechanicznego' },
        17: { wynik: 'We wszystkim kierujesz się honorem i lojalnością.', efekt: 'Brak efektu mechanicznego' },
        18: { wynik: 'Jesteś oddany dobrym i szlachetnym celom i nie zdradzisz swoich przekonań nawet za cenę życia.', efekt: 'Brak efektu mechanicznego' }
      }
    }
  }
};

export default ORIGIN_TABLES;
