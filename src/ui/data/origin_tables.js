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
      typ: 'k20',
      opis: 'Tabela określająca wygląd chochlika',
      wyniki: {
        1: { wynik: 'Masz nogi konika polnego lub świerszcza.', efekt: 'Brak efektu mechanicznego' },
        2: { wynik: 'Twoje włosy wyglądają jak puch dmuchawca.', efekt: 'Brak efektu mechanicznego' },
        3: { wynik: 'Masz duże, szpiczaste uszy.', efekt: 'Brak efektu mechanicznego' },
        4: { wynik: 'Gdy jesteś widzialny i się poruszasz, zostawiasz za sobą ślad ze złotych iskier.', efekt: 'Brak efektu mechanicznego' },
        5: { wynik: 'Masz szpiczastą głowę.', efekt: 'Brak efektu mechanicznego' },
        6: { wynik: 'Masz szeroki, uzębiony uśmiech.', efekt: 'Brak efektu mechanicznego' },
        7: { wynik: 'Zawsze jesteś brudny, nieważne, jak bardzo się szorujesz.', efekt: 'Brak efektu mechanicznego' },
        8: { wynik: 'Masz głowę ptaka lub insekta.', efekt: 'Brak efektu mechanicznego' },
        9: { wynik: 'Masz płatki kwiatów zamiast włosów.', efekt: 'Brak efektu mechanicznego' },
        10: { wynik: 'Nie możesz ustać w miejscu i nieustannie się wiercisz.', efekt: 'Brak efektu mechanicznego' },
        11: { wynik: 'Kiedy stajesz się widzialny, wyglądasz, jakbyś płonął.', efekt: 'Brak efektu mechanicznego' },
        12: { wynik: 'Powietrze wokół ciebie pachnie świeżo ściętą trawą, miodem lub kwiatami.', efekt: 'Brak efektu mechanicznego' },
        13: { wynik: 'Dźwięk drobnych dzwonków rozbrzmiewa za każdym razem, kiedy stajesz się widzialny.', efekt: 'Brak efektu mechanicznego' },
        14: { wynik: 'Kiedy stajesz się niewidzialny, z miejsca, w którym się znajdujesz, odlatuje 1k6 baniek.', efekt: 'Brak efektu mechanicznego' },
        15: { wynik: 'Twoja skóra wygląda niczym plecionka z trawy.', efekt: 'Brak efektu mechanicznego' },
        16: { wynik: 'Nie lubisz nosić ubrań.', efekt: 'Brak efektu mechanicznego' },
        17: { wynik: 'Nosisz kolorowe wstążki we włosach.', efekt: 'Brak efektu mechanicznego' },
        18: { wynik: 'Masz wiele blizn na dłoniach i stopach z czasów, gdy trzymano cię w żelaznej klatce.', efekt: 'Brak efektu mechanicznego' },
        19: { wynik: 'Twoje skrzydła są postrzępione i podniszczone. (Jeśli nie masz skrzydeł, zdajesz się być stworzony z płótna i mieć drobne guziki zamiast oczu).', efekt: 'Brak efektu mechanicznego' },
        20: { wynik: 'Twoja skóra ma niespotykany kolor lub widnieje na niej wielokolorowy wzór.', efekt: 'Brak efektu mechanicznego' }
      }
    },
    wiek: {
      nazwa: 'Wiek',
      typ: 'k3',
      opis: 'Tabela określająca wiek chochlika',
      wyniki: {
        1: { wynik: 'Jesteś młody, nie starszy niż 5 lat.', efekt: 'Brak efektu mechanicznego' },
        2: { wynik: 'Jesteś dorosły, masz 1k20 × 5 lat.', efekt: 'Za każdą przeżytą dekadę zyskujesz albo jedną profesję faerie, albo uczysz się mówić jednym językiem.' },
        3: { wynik: 'Jesteś dorosły, masz 1k20 × 5 lat.', efekt: 'Za każdą przeżytą dekadę zyskujesz albo jedną profesję faerie, albo uczysz się mówić jednym językiem.' }
      }
    },
    przeszlosc: {
      nazwa: 'Przeszłość',
      typ: 'k20',
      opis: 'Tabela określająca przeszłość chochlika',
      wyniki: {
        1: { wynik: 'Elf trzymał cię w złotej klatce przez połowę twojego życia. Niedawno zbiegłeś.', efekt: 'Brak efektu mechanicznego' },
        2: { wynik: 'Ukochałeś śmiertelne dziecko, które zostało przeklęte, aby nigdy nie dorosnąć.', efekt: 'Brak efektu mechanicznego' },
        3: { wynik: 'Spędziłeś wiele nocy, wodząc podróżników na manowce.', efekt: 'Brak efektu mechanicznego' },
        4: { wynik: 'Służyłeś jędzy i pomagałeś jej porywać dzieci.', efekt: 'Brak efektu mechanicznego' },
        5: { wynik: 'Zawsze miałeś wielką słabość do koni. Zwykłeś wplątywać się w ich grzywy i skłaniać je, aby galopowały z dala od właścicieli.', efekt: 'Brak efektu mechanicznego' },
        6: { wynik: 'Byłeś wielkim odkrywcą i zwiedziłeś wiele oceanicznych jaskiń.', efekt: 'Brak efektu mechanicznego' },
        7: { wynik: 'Kochasz tworzyć i reperować buty.', efekt: 'Brak efektu mechanicznego' },
        8: { wynik: 'Zwykłeś wkradać się do domów śmiertelników, aby podkradać im wstążki.', efekt: 'Brak efektu mechanicznego' },
        9: { wynik: 'Pomogłeś goblinom zinfiltrować ukryte królestwo, z którego pochodzisz.', efekt: 'Brak efektu mechanicznego' },
        10: { wynik: 'Spędziłeś lata, spełniając wszelkie swoje pragnienia.', efekt: 'Brak efektu mechanicznego' },
        11: { wynik: 'Pewnego razu skradłeś oczy dziecka. Wciąż je masz.', efekt: 'Brak efektu mechanicznego' },
        12: { wynik: 'Kiedyś wyświadczałeś śmiertelnikom przysługi w zamian za jakieś cudeńko, podarek lub spodek śmietany.', efekt: 'Brak efektu mechanicznego' },
        13: { wynik: 'Skradłeś kiedyś ważnej damie obrączkę ślubną, ale już zdążyłeś ją zgubić.', efekt: 'Brak efektu mechanicznego' },
        14: { wynik: 'Byłeś cenionym sługą elfiego pana lub damy, dopóki nie zostałeś zwolniony ze służby.', efekt: 'Brak efektu mechanicznego' },
        15: { wynik: 'Dawno temu zaprzyjaźniłeś się ze śmiertelnikiem i chroniłeś przyjaciela, dopóki nie dorósł.', efekt: 'Osoba ta jest w stanie cię zobaczyć, nawet kiedy jesteś niewidzialny.' },
        16: { wynik: 'Skradłeś złotą monetę od Wielkiego Smoka i wydałeś ją na wino.', efekt: 'Brak efektu mechanicznego' },
        17: { wynik: 'Zakochałeś się w nimfie i wciąż za nią tęsknisz.', efekt: 'Brak efektu mechanicznego' },
        18: { wynik: 'Zaprzyjaźniłeś się niegdyś z dzikim mężem i pomogłeś mu uratować jego panią i dwa jednorożce z Piekieł.', efekt: 'Brak efektu mechanicznego' },
        19: { wynik: 'Figiel, jaki spłatałeś śmiertelnikowi, zakończył się śmiercią. Możesz czuć się winny, ale nie musisz.', efekt: 'Brak efektu mechanicznego' },
        20: { wynik: 'Spędziłeś życie w Piekle i niedawno zbiegłeś.', efekt: 'Zyskujesz 1k3 punktów Splugawienia.' }
      }
    },
    budowa_ciala: {
      nazwa: 'Budowa ciała',
      typ: '3k6',
      opis: 'Tabela określająca budowę ciała chochlika',
      wyniki: {
        3: { wynik: 'Jesteś zaledwie cieniem faerie, niskim i niewielkim jak na swój rodzaj.', efekt: 'Brak efektu mechanicznego' },
        4: { wynik: 'Masz krągłe lub pulchne ciało.', efekt: 'Brak efektu mechanicznego' },
        5: { wynik: 'Masz krągłe lub pulchne ciało.', efekt: 'Brak efektu mechanicznego' },
        6: { wynik: 'Jesteś dość niewielki jak na chochlika.', efekt: 'Brak efektu mechanicznego' },
        7: { wynik: 'Jesteś dość niewielki jak na chochlika.', efekt: 'Brak efektu mechanicznego' },
        8: { wynik: 'Jesteś dość niewielki jak na chochlika.', efekt: 'Brak efektu mechanicznego' },
        9: { wynik: 'Jesteś przeciętny jak na chochlika, zarówno wzrostem, jak i wagą.', efekt: 'Brak efektu mechanicznego' },
        10: { wynik: 'Jesteś przeciętny jak na chochlika, zarówno wzrostem, jak i wagą.', efekt: 'Brak efektu mechanicznego' },
        11: { wynik: 'Jesteś przeciętny jak na chochlika, zarówno wzrostem, jak i wagą.', efekt: 'Brak efektu mechanicznego' },
        12: { wynik: 'Jesteś przeciętny jak na chochlika, zarówno wzrostem, jak i wagą.', efekt: 'Brak efektu mechanicznego' },
        13: { wynik: 'Jesteś nieco wyższy niż inne chochliki.', efekt: 'Brak efektu mechanicznego' },
        14: { wynik: 'Jesteś nieco wyższy niż inne chochliki.', efekt: 'Brak efektu mechanicznego' },
        15: { wynik: 'Jesteś nieco wyższy niż inne chochliki.', efekt: 'Brak efektu mechanicznego' },
        16: { wynik: 'Zdajesz się być rozciągnięty, wysoki i smukły.', efekt: 'Brak efektu mechanicznego' },
        17: { wynik: 'Zdajesz się być rozciągnięty, wysoki i smukły.', efekt: 'Brak efektu mechanicznego' },
        18: { wynik: 'Jak na chochlika jesteś wysoki i masz umięśnione ciało.', efekt: 'Brak efektu mechanicznego' }
      }
    },
    osobowosc: {
      nazwa: 'Osobowość',
      typ: '3k6',
      opis: 'Tabela określająca osobowość chochlika',
      wyniki: {
        3: { wynik: 'Jesteś tak niecny, że prawdopodobnie twoje miejsce jest w Piekle. Karmisz się niezgodą, którą siejesz, przyjemność sprawia ci okaleczanie niewinnych, a dokądkolwiek się nie udasz, pozostawiasz za sobą zniszczenie.', efekt: 'Brak efektu mechanicznego' },
        4: { wynik: 'Uwielbiasz się śmiać, chociaż rzeczy, które uznajesz za zabawne, inni uważają za przerażające. Nic nie cieszy cię tak bardzo, jak obserwowanie wyrazu zaskoczenia na twarzy stworzenia, kiedy pierwszy strumień krwi tryska z jego ciała.', efekt: 'Brak efektu mechanicznego' },
        5: { wynik: 'Uwielbiasz się śmiać, chociaż rzeczy, które uznajesz za zabawne, inni uważają za przerażające. Nic nie cieszy cię tak bardzo, jak obserwowanie wyrazu zaskoczenia na twarzy stworzenia, kiedy pierwszy strumień krwi tryska z jego ciała.', efekt: 'Brak efektu mechanicznego' },
        6: { wynik: 'Żyjesz dla przyjemności. Sięgasz po to, czego chcesz, robisz to, na co masz ochotę, i udajesz się wszędzie tam, gdzie przyjdzie ci do głowy.', efekt: 'Brak efektu mechanicznego' },
        7: { wynik: 'Żyjesz dla przyjemności. Sięgasz po to, czego chcesz, robisz to, na co masz ochotę, i udajesz się wszędzie tam, gdzie przyjdzie ci do głowy.', efekt: 'Brak efektu mechanicznego' },
        8: { wynik: 'Żyjesz dla przyjemności. Sięgasz po to, czego chcesz, robisz to, na co masz ochotę, i udajesz się wszędzie tam, gdzie przyjdzie ci do głowy.', efekt: 'Brak efektu mechanicznego' },
        9: { wynik: 'Jesteś kapryśny i samowolny; robisz i mówisz, co chcesz. Trudno przychodzi ci dotrzymywanie obietnic i łatwo się rozpraszasz.', efekt: 'Brak efektu mechanicznego' },
        10: { wynik: 'Jesteś kapryśny i samowolny; robisz i mówisz, co chcesz. Trudno przychodzi ci dotrzymywanie obietnic i łatwo się rozpraszasz.', efekt: 'Brak efektu mechanicznego' },
        11: { wynik: 'Jesteś kapryśny i samowolny; robisz i mówisz, co chcesz. Trudno przychodzi ci dotrzymywanie obietnic i łatwo się rozpraszasz.', efekt: 'Brak efektu mechanicznego' },
        12: { wynik: 'Jesteś kapryśny i samowolny; robisz i mówisz, co chcesz. Trudno przychodzi ci dotrzymywanie obietnic i łatwo się rozpraszasz.', efekt: 'Brak efektu mechanicznego' },
        13: { wynik: 'Jesteś wolnym duchem, niezwiązanym z nikim przysięgą ani powinnością. Cechuje cię jednak niewinne usposobienie i wolisz nie szkodzić innym. Nie masz jednak nic przeciwko, aby płatać figle osobom, które uznajesz za zbyt poważne.', efekt: 'Brak efektu mechanicznego' },
        14: { wynik: 'Jesteś wolnym duchem, niezwiązanym z nikim przysięgą ani powinnością. Cechuje cię jednak niewinne usposobienie i wolisz nie szkodzić innym. Nie masz jednak nic przeciwko, aby płatać figle osobom, które uznajesz za zbyt poważne.', efekt: 'Brak efektu mechanicznego' },
        15: { wynik: 'Jesteś wolnym duchem, niezwiązanym z nikim przysięgą ani powinnością. Cechuje cię jednak niewinne usposobienie i wolisz nie szkodzić innym. Nie masz jednak nic przeciwko, aby płatać figle osobom, które uznajesz za zbyt poważne.', efekt: 'Brak efektu mechanicznego' },
        16: { wynik: 'Brakuje ci dzikości typowej dla twojego ludu. Jesteś bardziej skupiony i oddany swoim celom. Dążysz do czynienia dobra we wszystkim, co robisz.', efekt: 'Brak efektu mechanicznego' },
        17: { wynik: 'Brakuje ci dzikości typowej dla twojego ludu. Jesteś bardziej skupiony i oddany swoim celom. Dążysz do czynienia dobra we wszystkim, co robisz.', efekt: 'Brak efektu mechanicznego' },
        18: { wynik: 'Jesteś dość poważny. Nie masz czasu na gierki, w które bawią się twoi pobratymcy; uważasz je za głupie i rozpraszające.', efekt: 'Brak efektu mechanicznego' }
      }
    },
    skrzydla: {
      nazwa: 'Skrzydła',
      typ: '3k6',
      opis: 'Tabela określająca rodzaj skrzydeł chochlika',
      wyniki: {
        3: { wynik: 'Nie masz skrzydeł.', efekt: 'Brak efektu mechanicznego' },
        4: { wynik: 'Masz skrzydła ważki.', efekt: 'Brak efektu mechanicznego' },
        5: { wynik: 'Masz skrzydła ważki.', efekt: 'Brak efektu mechanicznego' },
        6: { wynik: 'Masz skrzydła ćmy.', efekt: 'Brak efektu mechanicznego' },
        7: { wynik: 'Masz skrzydła ćmy.', efekt: 'Brak efektu mechanicznego' },
        8: { wynik: 'Masz skrzydła ćmy.', efekt: 'Brak efektu mechanicznego' },
        9: { wynik: 'Masz skrzydła motyla.', efekt: 'Brak efektu mechanicznego' },
        10: { wynik: 'Masz skrzydła motyla.', efekt: 'Brak efektu mechanicznego' },
        11: { wynik: 'Masz skrzydła motyla.', efekt: 'Brak efektu mechanicznego' },
        12: { wynik: 'Masz skrzydła motyla.', efekt: 'Brak efektu mechanicznego' },
        13: { wynik: 'Masz skrzydła osy.', efekt: 'Brak efektu mechanicznego' },
        14: { wynik: 'Masz skrzydła osy.', efekt: 'Brak efektu mechanicznego' },
        15: { wynik: 'Masz skrzydła osy.', efekt: 'Brak efektu mechanicznego' },
        16: { wynik: 'Masz pierzaste skrzydła.', efekt: 'Brak efektu mechanicznego' },
        17: { wynik: 'Masz pierzaste skrzydła.', efekt: 'Brak efektu mechanicznego' },
        18: { wynik: 'Masz skórzaste skrzydła.', efekt: 'Brak efektu mechanicznego' }
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
    wiek: {
      nazwa: 'Wiek',
      typ: '3k6',
      opis: 'Tabela określająca wiek goblina',
      wyniki: {
        3: { wynik: 'Dziecko, 6 lat lub mniej.', efekt: 'Brak efektu mechanicznego' },
        4: { wynik: 'Młodociany, 7–10 lat.', efekt: 'Brak efektu mechanicznego' },
        5: { wynik: 'Młodociany, 7–10 lat.', efekt: 'Brak efektu mechanicznego' },
        6: { wynik: 'Młodociany, 7–10 lat.', efekt: 'Brak efektu mechanicznego' },
        7: { wynik: 'Młodociany, 7–10 lat.', efekt: 'Brak efektu mechanicznego' },
        8: { wynik: 'Młody dorosły, 11–25 lat.', efekt: 'Brak efektu mechanicznego' },
        9: { wynik: 'Młody dorosły, 11–25 lat.', efekt: 'Brak efektu mechanicznego' },
        10: { wynik: 'Młody dorosły, 11–25 lat.', efekt: 'Brak efektu mechanicznego' },
        11: { wynik: 'Młody dorosły, 11–25 lat.', efekt: 'Brak efektu mechanicznego' },
        12: { wynik: 'Młody dorosły, 11–25 lat.', efekt: 'Brak efektu mechanicznego' },
        13: { wynik: 'Dorosły w średnim wieku, 26–50 lat.', efekt: 'Brak efektu mechanicznego' },
        14: { wynik: 'Dorosły w średnim wieku, 26–50 lat.', efekt: 'Brak efektu mechanicznego' },
        15: { wynik: 'Dorosły w średnim wieku, 26–50 lat.', efekt: 'Brak efektu mechanicznego' },
        16: { wynik: 'Starszy dorosły, 51–75 lat.', efekt: 'Brak efektu mechanicznego' },
        17: { wynik: 'Starszy dorosły, 51–75 lat.', efekt: 'Brak efektu mechanicznego' },
        18: { wynik: 'Sędziwy dorosły, 76 lat lub więcej.', efekt: 'Brak efektu mechanicznego' }
      }
    },
    budowa_ciala: {
      nazwa: 'Budowa ciała',
      typ: '3k6',
      opis: 'Tabela określająca budowę ciała goblina',
      wyniki: {
        3: { wynik: 'Jesteś niski i szczapowaty.', efekt: 'Brak efektu mechanicznego' },
        4: { wynik: 'Jesteś niski i krągły.', efekt: 'Brak efektu mechanicznego' },
        5: { wynik: 'Jesteś niski.', efekt: 'Brak efektu mechanicznego' },
        6: { wynik: 'Jesteś niski.', efekt: 'Brak efektu mechanicznego' },
        7: { wynik: 'Jesteś żylasty.', efekt: 'Brak efektu mechanicznego' },
        8: { wynik: 'Jesteś żylasty.', efekt: 'Brak efektu mechanicznego' },
        9: { wynik: 'Jesteś średniego jak na goblina wzrostu i wagi.', efekt: 'Brak efektu mechanicznego' },
        10: { wynik: 'Jesteś średniego jak na goblina wzrostu i wagi.', efekt: 'Brak efektu mechanicznego' },
        11: { wynik: 'Jesteś średniego jak na goblina wzrostu i wagi.', efekt: 'Brak efektu mechanicznego' },
        12: { wynik: 'Jesteś średniego jak na goblina wzrostu i wagi.', efekt: 'Brak efektu mechanicznego' },
        13: { wynik: 'Jesteś pulchny.', efekt: 'Brak efektu mechanicznego' },
        14: { wynik: 'Jesteś pulchny.', efekt: 'Brak efektu mechanicznego' },
        15: { wynik: 'Jesteś wysoki.', efekt: 'Brak efektu mechanicznego' },
        16: { wynik: 'Jesteś wysoki.', efekt: 'Brak efektu mechanicznego' },
        17: { wynik: 'Jesteś wysoki i chudy.', efekt: 'Brak efektu mechanicznego' },
        18: { wynik: 'Jesteś bardzo wysoki i masywny.', efekt: 'Brak efektu mechanicznego' }
      }
    },
    cecha_szczegolna: {
      nazwa: 'Cecha szczególna',
      typ: 'k20',
      opis: 'Tabela określająca unikalną cechę fizyczną goblina',
      wyniki: {
        1: { wynik: 'Masz długi, ostro zakończony nos.', efekt: 'Brak efektu mechanicznego' },
        2: { wynik: 'Masz jaskrawozieloną lub jaskrawopomarańczową skórę.', efekt: 'Brak efektu mechanicznego' },
        3: { wynik: 'Twoja głowa przypomina psią.', efekt: 'Brak efektu mechanicznego' },
        4: { wynik: 'Masz jaszczurzy wygląd i niewielkie rogi na czubku głowy.', efekt: 'Brak efektu mechanicznego' },
        5: { wynik: 'Masz szeroki, cwaniacki uśmiech.', efekt: 'Brak efektu mechanicznego' },
        6: { wynik: 'Zamiast nosa masz świński ryj.', efekt: 'Brak efektu mechanicznego' },
        7: { wynik: 'Masz długie, smukłe palce.', efekt: 'Brak efektu mechanicznego' },
        8: { wynik: 'Na środku czoła wyrósł ci ząb.', efekt: 'Brak efektu mechanicznego' },
        9: { wynik: 'Masz ogon.', efekt: 'Brak efektu mechanicznego' },
        10: { wynik: 'Twoje ręce i nogi pokrywa gęste futro.', efekt: 'Brak efektu mechanicznego' },
        11: { wynik: 'Jesteś całkowicie bezwłosy.', efekt: 'Brak efektu mechanicznego' },
        12: { wynik: 'Od stóp do głów jesteś pokryty kurzajkami.', efekt: 'Brak efektu mechanicznego' },
        13: { wynik: 'Na plecach masz ogromną torbiel.', efekt: 'Brak efektu mechanicznego' },
        14: { wynik: 'Masz niesamowicie długi i ostry podbródek.', efekt: 'Brak efektu mechanicznego' },
        15: { wynik: 'Z boku głowy wyrasta ci pojedynczy róg.', efekt: 'Brak efektu mechanicznego' },
        16: { wynik: 'Masz tylko jedno oko.', efekt: 'Brak efektu mechanicznego' },
        17: { wynik: 'Posiadasz dodatkowe 1k6 palców, które wyrosły w wybranych przez ciebie miejscach na twoim ciele.', efekt: 'Brak efektu mechanicznego' },
        18: { wynik: 'Masz olbrzymie uszy.', efekt: 'Brak efektu mechanicznego' },
        19: { wynik: 'Masz komicznie krótkie nogi.', efekt: 'Brak efektu mechanicznego' },
        20: { wynik: 'Wymyśl coś!', efekt: 'Brak efektu mechanicznego' }
      }
    },
    dziwny_nawyk: {
      nazwa: 'Dziwny nawyk',
      typ: 'k20',
      opis: 'Tabela określająca dziwny nawyk goblina',
      wyniki: {
        1: { wynik: 'Wszystkie swoje wydzieliny zamykasz w małych buteleczkach, którymi obdarowujesz tych, których polubisz.', efekt: 'Brak efektu mechanicznego' },
        2: { wynik: 'Nigdy się nie myjesz.', efekt: 'Brak efektu mechanicznego' },
        3: { wynik: 'Spluwasz po każdym wypowiedzianym zdaniu.', efekt: 'Brak efektu mechanicznego' },
        4: { wynik: 'Bezustannie puszczasz monstrualne wiatry, ale zdajesz się tego nie zauważać.', efekt: 'Brak efektu mechanicznego' },
        5: { wynik: 'Żywisz się wyłącznie słodyczami.', efekt: 'Brak efektu mechanicznego' },
        6: { wynik: 'Kolekcjonujesz genitalia pokonanych stworzeń, którymi obwieszasz się jak biżuterią.', efekt: 'Brak efektu mechanicznego' },
        7: { wynik: 'Liżesz przedmioty, by zaznaczyć, że są twoje.', efekt: 'Brak efektu mechanicznego' },
        8: { wynik: 'Ubierasz się bardzo elegancko.', efekt: 'Brak efektu mechanicznego' },
        9: { wynik: 'Nigdy nie nosisz butów.', efekt: 'Brak efektu mechanicznego' },
        10: { wynik: 'Jako zwierzęta domowe hodujesz karaluchy.', efekt: 'Brak efektu mechanicznego' },
        11: { wynik: 'Zawsze badasz zawartość swoich odchodów, rozsmarowując je palcami.', efekt: 'Brak efektu mechanicznego' },
        12: { wynik: 'Zawsze masz przy sobie kawałek żelaza.', efekt: 'Brak efektu mechanicznego' },
        13: { wynik: 'Podśpiewujesz zamiast mówić.', efekt: 'Brak efektu mechanicznego' },
        14: { wynik: 'Z każdej zabitej przez siebie istoty odkrawasz i zjadasz kawałek ciała.', efekt: 'Brak efektu mechanicznego' },
        15: { wynik: 'Płaczesz z byle powodu.', efekt: 'Brak efektu mechanicznego' },
        16: { wynik: 'W najmniej odpowiednich momentach opowiadasz sprośne dowcipy.', efekt: 'Brak efektu mechanicznego' },
        17: { wynik: 'Nosisz dziecięce ubranka i odmawiasz założenia czegokolwiek innego.', efekt: 'Brak efektu mechanicznego' },
        18: { wynik: 'Masz bogatą kolekcję łyżek.', efekt: 'Brak efektu mechanicznego' },
        19: { wynik: 'Lubisz się chować.', efekt: 'Brak efektu mechanicznego' },
        20: { wynik: 'Wymyśl coś!', efekt: 'Brak efektu mechanicznego' }
      }
    },
    przeszlosc: {
      nazwa: 'Przeszłość',
      typ: 'k20',
      opis: 'Tabela określająca przeszłość goblina',
      wyniki: {
        1: { wynik: 'Ostatnie 1k6 lat spędziłeś kompletnie zalany. Nie jesteś z tego dumny.', efekt: 'Brak efektu mechanicznego' },
        2: { wynik: 'Król goblinów zamienił cię w ropuchę. Udało ci się przekonać elfią pannę, by cię odczarowała pocałunkiem. Gdy przerażona twoim prawdziwym wyglądem zaczęła krzyczeć, zabiłeś ją.', efekt: 'Zaczynasz grę z 1 punktem Splugawienia.' },
        3: { wynik: 'Przypadkiem spowodowałeś śmierć całego swojego plemienia.', efekt: 'Brak efektu mechanicznego' },
        4: { wynik: 'Zostałeś osierocony. Wychowałeś się wśród olbrzymich szczurów.', efekt: 'Brak efektu mechanicznego' },
        5: { wynik: 'Niechcący sprowadziłeś na świat demona.', efekt: 'Brak efektu mechanicznego' },
        6: { wynik: 'Przez dwa dni wydawało ci się, że jesteś wściekłym psem.', efekt: 'Zaczynasz grę z 1 punktem Szaleństwa.' },
        7: { wynik: 'Przez 1k6 lat byłeś seksualnym niewolnikiem pewnej jędzy.', efekt: 'Brak efektu mechanicznego' },
        8: { wynik: 'Twoje plemię zostało niemal całkowicie wybite przez krasnoludy. Jesteś jednym z 1k6 osobników, którzy przeżyli.', efekt: 'Brak efektu mechanicznego' },
        9: { wynik: 'Prawie utonąłeś, gdy wylały ścieki.', efekt: 'Brak efektu mechanicznego' },
        10: { wynik: 'Utrzymujesz się z pracy w swojej profesji.', efekt: 'Brak efektu mechanicznego' },
        11: { wynik: 'Wybierz postać z drużyny. Osoba ta uratowała ci życie i masz wobec niej dług wdzięczności.', efekt: 'Brak efektu mechanicznego' },
        12: { wynik: 'Jesteś niereformowalnym przestępcą.', efekt: 'Zyskujesz jedną losową profesję przestępczą.' },
        13: { wynik: 'Odbyłeś wiele podróży w różne strony świata.', efekt: 'Umiesz mówić w jednym dodatkowym języku.' },
        14: { wynik: 'Ukradłeś nóż pewnemu pięknemu rycerzowi.', efekt: 'Brak efektu mechanicznego' },
        15: { wynik: 'Zakradłeś się do Alfheimu i zwędziłeś kosmyk włosów Królowej Faerie.', efekt: 'Brak efektu mechanicznego' },
        16: { wynik: 'Zabiłeś i zjadłeś setkę chorych szczurów.', efekt: 'Brak efektu mechanicznego' },
        17: { wynik: 'Byłeś pomocnikiem potężnego czarodzieja.', efekt: 'Brak efektu mechanicznego' },
        18: { wynik: 'W ściekach znalazłeś szlachecki sygnet.', efekt: 'Brak efektu mechanicznego' },
        19: { wynik: 'Jesteś siedemnastym dzieckiem króla goblinów.', efekt: 'Brak efektu mechanicznego' },
        20: { wynik: 'Odziedziczyłeś w spadku pieniądze.', efekt: 'Zaczynasz grę z 2k6 miedziaków.' }
      }
    },
    osobowosc: {
      nazwa: 'Osobowość',
      typ: '3k6',
      opis: 'Tabela określająca osobowość goblina',
      wyniki: {
        3: { wynik: 'Jesteś zbirem i lubisz nękać słabszych od siebie.', efekt: 'Brak efektu mechanicznego' },
        4: { wynik: 'Lubisz przemoc, zwłaszcza bezsensowną.', efekt: 'Brak efektu mechanicznego' },
        5: { wynik: 'Starasz się porzucić umiłowanie brudu typowe dla twojego ludu i czynić na świecie dobro.', efekt: 'Brak efektu mechanicznego' },
        6: { wynik: 'Starasz się porzucić umiłowanie brudu typowe dla twojego ludu i czynić na świecie dobro.', efekt: 'Brak efektu mechanicznego' },
        7: { wynik: 'Uwielbiasz płatać innym złośliwe figle. Ich niedola bawi cię do rozpuku!', efekt: 'Brak efektu mechanicznego' },
        8: { wynik: 'Uwielbiasz płatać innym złośliwe figle. Ich niedola bawi cię do rozpuku!', efekt: 'Brak efektu mechanicznego' },
        9: { wynik: 'Martwisz się tylko o siebie. Do diabła z innymi!', efekt: 'Brak efektu mechanicznego' },
        10: { wynik: 'Martwisz się tylko o siebie. Do diabła z innymi!', efekt: 'Brak efektu mechanicznego' },
        11: { wynik: 'Martwisz się tylko o siebie. Do diabła z innymi!', efekt: 'Brak efektu mechanicznego' },
        12: { wynik: 'Martwisz się tylko o siebie. Do diabła z innymi!', efekt: 'Brak efektu mechanicznego' },
        13: { wynik: 'Ty tylko starasz się przeżyć!', efekt: 'Brak efektu mechanicznego' },
        14: { wynik: 'Ty tylko starasz się przeżyć!', efekt: 'Brak efektu mechanicznego' },
        15: { wynik: 'Twój lud nie zasługiwał na wygnanie. Wierzysz, że odnajdziecie swoje miejsce w świecie i udowodnicie tym przebrzydłym elfom, że się myliły.', efekt: 'Brak efektu mechanicznego' },
        16: { wynik: 'Twój lud nie zasługiwał na wygnanie. Wierzysz, że odnajdziecie swoje miejsce w świecie i udowodnicie tym przebrzydłym elfom, że się myliły.', efekt: 'Brak efektu mechanicznego' },
        17: { wynik: 'Żyjesz, by służyć tym silnym i wpływowym.', efekt: 'Brak efektu mechanicznego' },
        18: { wynik: 'Swoimi czynami chcesz sprawić, że twój lud wróci do łask Królowej Faerie.', efekt: 'Brak efektu mechanicznego' }
      }
    }
  },

  // ========== KRASNOLUD ==========
  krasnolud: {
    wiek: {
      nazwa: 'Wiek',
      typ: '3k6',
      opis: 'Tabela określająca wiek krasnoluda',
      wyniki: {
        3: { wynik: 'Dziecko, 20 lat lub mniej.', efekt: 'Brak efektu mechanicznego' },
        4: { wynik: 'Młodociany, 20–30 lat.', efekt: 'Brak efektu mechanicznego' },
        5: { wynik: 'Młodociany, 20–30 lat.', efekt: 'Brak efektu mechanicznego' },
        6: { wynik: 'Młodociany, 20–30 lat.', efekt: 'Brak efektu mechanicznego' },
        7: { wynik: 'Młodociany, 20–30 lat.', efekt: 'Brak efektu mechanicznego' },
        8: { wynik: 'Młody dorosły, 31–50 lat.', efekt: 'Brak efektu mechanicznego' },
        9: { wynik: 'Młody dorosły, 31–50 lat.', efekt: 'Brak efektu mechanicznego' },
        10: { wynik: 'Młody dorosły, 31–50 lat.', efekt: 'Brak efektu mechanicznego' },
        11: { wynik: 'Młody dorosły, 31–50 lat.', efekt: 'Brak efektu mechanicznego' },
        12: { wynik: 'Młody dorosły, 31–50 lat.', efekt: 'Brak efektu mechanicznego' },
        13: { wynik: 'Dorosły w średnim wieku, 51–100 lat.', efekt: 'Brak efektu mechanicznego' },
        14: { wynik: 'Dorosły w średnim wieku, 51–100 lat.', efekt: 'Brak efektu mechanicznego' },
        15: { wynik: 'Dorosły w średnim wieku, 51–100 lat.', efekt: 'Brak efektu mechanicznego' },
        16: { wynik: 'Starszy dorosły, 101–150 lat.', efekt: 'Brak efektu mechanicznego' },
        17: { wynik: 'Starszy dorosły, 101–150 lat.', efekt: 'Brak efektu mechanicznego' },
        18: { wynik: 'Sędziwy dorosły, 151 lat lub więcej.', efekt: 'Brak efektu mechanicznego' }
      }
    },
    budowa_ciala: {
      nazwa: 'Budowa ciała',
      typ: '3k6',
      opis: 'Tabela określająca budowę ciała krasnoluda',
      wyniki: {
        3: { wynik: 'Jesteś niski i szczupły.', efekt: 'Brak efektu mechanicznego' },
        4: { wynik: 'Jesteś niski i gruby.', efekt: 'Brak efektu mechanicznego' },
        5: { wynik: 'Jesteś niski i gruby.', efekt: 'Brak efektu mechanicznego' },
        6: { wynik: 'Jesteś niski i gruby.', efekt: 'Brak efektu mechanicznego' },
        7: { wynik: 'Jesteś odrobinę niższy niż inne krasnoludy.', efekt: 'Brak efektu mechanicznego' },
        8: { wynik: 'Jesteś odrobinę niższy niż inne krasnoludy.', efekt: 'Brak efektu mechanicznego' },
        9: { wynik: 'Jesteś średniego wzrostu i wagi.', efekt: 'Brak efektu mechanicznego' },
        10: { wynik: 'Jesteś średniego wzrostu i wagi.', efekt: 'Brak efektu mechanicznego' },
        11: { wynik: 'Jesteś średniego wzrostu i wagi.', efekt: 'Brak efektu mechanicznego' },
        12: { wynik: 'Jesteś średniego wzrostu i wagi.', efekt: 'Brak efektu mechanicznego' },
        13: { wynik: 'Masz imponujący brzuch.', efekt: 'Brak efektu mechanicznego' },
        14: { wynik: 'Masz imponujący brzuch.', efekt: 'Brak efektu mechanicznego' },
        15: { wynik: 'Masz imponujący brzuch.', efekt: 'Brak efektu mechanicznego' },
        16: { wynik: 'Jesteś wysoki.', efekt: 'Brak efektu mechanicznego' },
        17: { wynik: 'Jesteś wysoki.', efekt: 'Brak efektu mechanicznego' },
        18: { wynik: 'Jesteś wysoki i masywny.', efekt: 'Brak efektu mechanicznego' }
      }
    },
    wyglad: {
      nazwa: 'Wygląd',
      typ: '3k6',
      opis: 'Tabela określająca wygląd krasnoluda',
      wyniki: {
        3: { wynik: 'Wyglądasz jak maszkara, prawdopodobnie przez trudy życia i liczne spotkania z niebezpieczeństwem. Twoja twarz to jedna wielka blizna, pewnie brakuje ci również ucha, oka czy nosa. Masz też jakiś nietypowy nawyk, na przykład wbijanie ćwieków we własną czaszkę lub nacieranie skóry sadłem trolla.', efekt: 'Brak efektu mechanicznego' },
        4: { wynik: 'Wyglądasz jak maszkara, prawdopodobnie przez trudy życia i liczne spotkania z niebezpieczeństwem. Twoja twarz to jedna wielka blizna, pewnie brakuje ci również ucha, oka czy nosa. Masz też jakiś nietypowy nawyk, na przykład wbijanie ćwieków we własną czaszkę lub nacieranie skóry sadłem trolla.', efekt: 'Brak efektu mechanicznego' },
        5: { wynik: 'Masz kilka ciekawych cech, które sprawiają, że wyglądasz jak naprawdę paskudny zakapior. Brud z kopalni, wszy we włosach, skóra poorana bliznami czy też ostry zapach wymiocin – wszystko to składa się na twój wyjątkowy styl.', efekt: 'Brak efektu mechanicznego' },
        6: { wynik: 'Masz kilka ciekawych cech, które sprawiają, że wyglądasz jak naprawdę paskudny zakapior. Brud z kopalni, wszy we włosach, skóra poorana bliznami czy też ostry zapach wymiocin – wszystko to składa się na twój wyjątkowy styl.', efekt: 'Brak efektu mechanicznego' },
        7: { wynik: 'Jesteś krępy, włochaty i niechlujny.', efekt: 'Brak efektu mechanicznego' },
        8: { wynik: 'Jesteś krępy, włochaty i niechlujny.', efekt: 'Brak efektu mechanicznego' },
        9: { wynik: 'Wyglądasz jak typowy krasnolud – krępy, włochaty, ale zadbany.', efekt: 'Brak efektu mechanicznego' },
        10: { wynik: 'Wyglądasz jak typowy krasnolud – krępy, włochaty, ale zadbany.', efekt: 'Brak efektu mechanicznego' },
        11: { wynik: 'Wyglądasz jak typowy krasnolud – krępy, włochaty, ale zadbany.', efekt: 'Brak efektu mechanicznego' },
        12: { wynik: 'Twój wygląd jest dla ciebie powodem do dumy. Często się myjesz, a swój zarost nacierasz olejkami, zaplatasz i zdobisz pierścieniami.', efekt: 'Brak efektu mechanicznego' },
        13: { wynik: 'Twój wygląd jest dla ciebie powodem do dumy. Często się myjesz, a swój zarost nacierasz olejkami, zaplatasz i zdobisz pierścieniami.', efekt: 'Brak efektu mechanicznego' },
        14: { wynik: 'Twój wygląd jest dla ciebie powodem do dumy. Często się myjesz, a swój zarost nacierasz olejkami, zaplatasz i zdobisz pierścieniami.', efekt: 'Brak efektu mechanicznego' },
        15: { wynik: 'Twój wygląd jest dla ciebie powodem do dumy. Często się myjesz, a swój zarost nacierasz olejkami, zaplatasz i zdobisz pierścieniami.', efekt: 'Brak efektu mechanicznego' },
        16: { wynik: 'Jak na krasnoluda jesteś całkiem pociągający. Masz szlachetne rysy twarzy, głęboki głos i dobrze się nosisz.', efekt: 'Brak efektu mechanicznego' },
        17: { wynik: 'Jak na krasnoluda jesteś całkiem pociągający. Masz szlachetne rysy twarzy, głęboki głos i dobrze się nosisz.', efekt: 'Brak efektu mechanicznego' },
        18: { wynik: 'Jak na krasnoluda jesteś całkiem pociągający. Masz szlachetne rysy twarzy, głęboki głos i dobrze się nosisz.', efekt: 'Brak efektu mechanicznego' }
      }
    },
    znienawidzone_stworzenia: {
      nazwa: 'Znienawidzone stworzenia',
      typ: 'k20',
      opis: 'Tabela używana z cechą specjalną Znienawidzony wróg',
      wyniki: {
        1: { wynik: 'Ogry', efekt: 'Brak efektu mechanicznego' },
        2: { wynik: 'Ogry', efekt: 'Brak efektu mechanicznego' },
        3: { wynik: 'Troglodyci', efekt: 'Brak efektu mechanicznego' },
        4: { wynik: 'Troglodyci', efekt: 'Brak efektu mechanicznego' },
        5: { wynik: 'Zwierzoludzie', efekt: 'Brak efektu mechanicznego' },
        6: { wynik: 'Zwierzoludzie', efekt: 'Brak efektu mechanicznego' },
        7: { wynik: 'Orki', efekt: 'Brak efektu mechanicznego' },
        8: { wynik: 'Orki', efekt: 'Brak efektu mechanicznego' },
        9: { wynik: 'Gobliny', efekt: 'Brak efektu mechanicznego' },
        10: { wynik: 'Gobliny', efekt: 'Brak efektu mechanicznego' },
        11: { wynik: 'Elfy', efekt: 'Brak efektu mechanicznego' },
        12: { wynik: 'Elfy', efekt: 'Brak efektu mechanicznego' },
        13: { wynik: 'Trolle', efekt: 'Brak efektu mechanicznego' },
        14: { wynik: 'Trolle', efekt: 'Brak efektu mechanicznego' },
        15: { wynik: 'Olbrzymy', efekt: 'Brak efektu mechanicznego' },
        16: { wynik: 'Olbrzymy', efekt: 'Brak efektu mechanicznego' },
        17: { wynik: 'Smoki', efekt: 'Brak efektu mechanicznego' },
        18: { wynik: 'Smoki', efekt: 'Brak efektu mechanicznego' },
        19: { wynik: 'Demony', efekt: 'Brak efektu mechanicznego' },
        20: { wynik: 'Demony', efekt: 'Brak efektu mechanicznego' }
      }
    },
    przeszlosc: {
      nazwa: 'Przeszłość',
      typ: 'k20',
      opis: 'Tabela określająca przeszłość krasnoluda',
      wyniki: {
        1: { wynik: 'Dla bogactwa zaprzedałeś duszę diabłu, który oszukał cię i zostawił bez grosza.', efekt: 'Zaczynasz grę z 1 punktem Splugawienia.' },
        2: { wynik: 'W sennej wizji ukazali ci się przodkowie i nakazali odszukać legendarny artefakt.', efekt: 'Brak efektu mechanicznego' },
        3: { wynik: 'Przez przypadek zabiłeś kogoś ci bliskiego.', efekt: 'Brak efektu mechanicznego' },
        4: { wynik: 'Zhańbiłeś swoje imię, kradnąc złoto należące do innego klanu.', efekt: 'Brak efektu mechanicznego' },
        5: { wynik: 'Walczyłeś przeciw znienawidzonym stworzeniom i poniosłeś porażkę.', efekt: 'Brak efektu mechanicznego' },
        6: { wynik: 'Zhańbiłeś siebie i swój klan. Żyjesz na wygnaniu, poszukując odkupienia, nawet jeśli ma nim być chwalebna śmierć.', efekt: 'Brak efektu mechanicznego' },
        7: { wynik: 'Zostałeś pojmany przez znienawidzone stworzenia. Przez 2k6 lat byłeś ich niewolnikiem.', efekt: 'Brak efektu mechanicznego' },
        8: { wynik: 'Znienawidzone przez ciebie stworzenia najechały twój dom i wybiły twój klan.', efekt: 'Brak efektu mechanicznego' },
        9: { wynik: 'Przeżyłeś tąpnięcie w kopalni; od tamtej pory przebywanie pod ziemią wywołuje w tobie niepokój.', efekt: 'Brak efektu mechanicznego' },
        10: { wynik: 'Utrzymujesz się z pracy w swojej profesji.', efekt: 'Brak efektu mechanicznego' },
        11: { wynik: 'Jesteś zaprzysiężonym poddanym króla krasnoludów.', efekt: 'Brak efektu mechanicznego' },
        12: { wynik: 'Jesteś utalentowanym rzemieślnikiem.', efekt: 'Zyskujesz jedną profesję powiązaną z dowolnym rzemiosłem.' },
        13: { wynik: 'Odbyłeś wiele podróży w różne strony świata.', efekt: 'Umiesz mówić w jednym dodatkowym języku.' },
        14: { wynik: 'Odziedziczyłeś po przodku topór lub młot bojowy.', efekt: 'Brak efektu mechanicznego' },
        15: { wynik: 'Pod swoim domem we wnętrzu góry odkryłeś żyłę złota.', efekt: 'Brak efektu mechanicznego' },
        16: { wynik: 'Wytropiłeś i pomogłeś zabić jedno ze swoich znienawidzonych stworzeń.', efekt: 'Brak efektu mechanicznego' },
        17: { wynik: 'Dokonałeś wielkich czynów i jesteś bohaterem swojego klanu.', efekt: 'Brak efektu mechanicznego' },
        18: { wynik: 'Posiadasz klucz do dawno zaginionego krasnoludzkiego skarbca.', efekt: 'Brak efektu mechanicznego' },
        19: { wynik: 'Jesteś prawowitym dziedzicem twierdzy, która obecnie znajduje się w rękach wrogów twojego ludu.', efekt: 'Brak efektu mechanicznego' },
        20: { wynik: 'Odziedziczyłeś w spadku pieniądze.', efekt: 'Zaczynasz grę z 2k6 miedziaków.' }
      }
    },
    osobowosc: {
      nazwa: 'Osobowość',
      typ: '3k6',
      opis: 'Tabela określająca osobowość krasnoluda',
      wyniki: {
        3: { wynik: 'Twoja nienawiść jest niemalże sensem twojego życia. Motywuje cię, daje ci siłę i pomaga zwyciężać wrogów.', efekt: 'Brak efektu mechanicznego' },
        4: { wynik: 'Poszukujesz chwalebnej śmierci w walce z wrogiem.', efekt: 'Brak efektu mechanicznego' },
        5: { wynik: 'Ponad wszystko kochasz złoto. Jego dotyk, smak i dźwięk, jaki wydaje.', efekt: 'Brak efektu mechanicznego' },
        6: { wynik: 'Ponad wszystko kochasz złoto. Jego dotyk, smak i dźwięk, jaki wydaje.', efekt: 'Brak efektu mechanicznego' },
        7: { wynik: 'Jesteś przekonany, że inni pożądają twojego bogactwa. Twoim obowiązkiem jest chronić je za wszelką cenę.', efekt: 'Brak efektu mechanicznego' },
        8: { wynik: 'Jesteś przekonany, że inni pożądają twojego bogactwa. Twoim obowiązkiem jest chronić je za wszelką cenę.', efekt: 'Brak efektu mechanicznego' },
        9: { wynik: 'Twoim życiem kieruje honor. Nigdy nie zrobiłbyś czegoś, co przyniosłoby hańbę twojemu ludowi.', efekt: 'Brak efektu mechanicznego' },
        10: { wynik: 'Twoim życiem kieruje honor. Nigdy nie zrobiłbyś czegoś, co przyniosłoby hańbę twojemu ludowi.', efekt: 'Brak efektu mechanicznego' },
        11: { wynik: 'Twoim życiem kieruje honor. Nigdy nie zrobiłbyś czegoś, co przyniosłoby hańbę twojemu ludowi.', efekt: 'Brak efektu mechanicznego' },
        12: { wynik: 'Twoim życiem kieruje honor. Nigdy nie zrobiłbyś czegoś, co przyniosłoby hańbę twojemu ludowi.', efekt: 'Brak efektu mechanicznego' },
        13: { wynik: 'W życiu kierujesz się wolą przodków, tradycjami swojego ludu i dobrem ogółu.', efekt: 'Brak efektu mechanicznego' },
        14: { wynik: 'W życiu kierujesz się wolą przodków, tradycjami swojego ludu i dobrem ogółu.', efekt: 'Brak efektu mechanicznego' },
        15: { wynik: 'Uważasz, że krasnoludy powinny wyzbyć się chciwości i nieufności. W tych mrocznych czasach wszyscy muszą stanąć ramię w ramię, by stawić czoła nadciągającej zagładzie.', efekt: 'Brak efektu mechanicznego' },
        16: { wynik: 'Uważasz, że krasnoludy powinny wyzbyć się chciwości i nieufności. W tych mrocznych czasach wszyscy muszą stanąć ramię w ramię, by stawić czoła nadciągającej zagładzie.', efekt: 'Brak efektu mechanicznego' },
        17: { wynik: 'Nie lubisz przedstawicieli innych ras i nie ufasz im, choć czasem są przydatni.', efekt: 'Brak efektu mechanicznego' },
        18: { wynik: 'Nie jesteś szczególnie przywiązany do krasnoludzkich tradycji. Nadszedł czas, by twój lud opuścił zakurzone jaskinie i zaczął budować swą przyszłość gdzieś indziej.', efekt: 'Brak efektu mechanicznego' }
      }
    }
  },

  // ========== ODMINIEC ==========
  odmieniec: {
    prawdziwy_wiek: {
      nazwa: 'Prawdziwy wiek',
      typ: '3k6',
      opis: 'Tabela określająca prawdziwy wiek odmieńca (pod przybraną postacią)',
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
    pozorna_plec: {
      nazwa: 'Pozorna płeć',
      typ: 'k6',
      opis: 'Tabela określająca początkową przybraną formę odmieńca',
      wyniki: {
        1: { wynik: 'Masz postać mężczyzny.', efekt: 'Brak efektu mechanicznego' },
        2: { wynik: 'Masz postać mężczyzny.', efekt: 'Brak efektu mechanicznego' },
        3: { wynik: 'Masz postać mężczyzny.', efekt: 'Brak efektu mechanicznego' },
        4: { wynik: 'Masz postać kobiety.', efekt: 'Brak efektu mechanicznego' },
        5: { wynik: 'Masz postać kobiety.', efekt: 'Brak efektu mechanicznego' },
        6: { wynik: 'Masz postać kobiety.', efekt: 'Brak efektu mechanicznego' }
      }
    },
    pozorne_pochodzenie: {
      nazwa: 'Pozorne pochodzenie',
      typ: '3k6',
      opis: 'Tabela określająca początkową przybraną formę odmieńca',
      wyniki: {
        3: { wynik: 'Masz postać goblina. Przejdź do opisu goblińskiego pochodzenia, by ustalić swój wiek, budowę ciała i wygląd.', efekt: 'Brak efektu mechanicznego' },
        4: { wynik: 'Masz postać goblina. Przejdź do opisu goblińskiego pochodzenia, by ustalić swój wiek, budowę ciała i wygląd.', efekt: 'Brak efektu mechanicznego' },
        5: { wynik: 'Masz postać krasnoluda. Przejdź do opisu krasnoludzkiego pochodzenia, by ustalić swój wiek, budowę ciała i wygląd.', efekt: 'Brak efektu mechanicznego' },
        6: { wynik: 'Masz postać krasnoluda. Przejdź do opisu krasnoludzkiego pochodzenia, by ustalić swój wiek, budowę ciała i wygląd.', efekt: 'Brak efektu mechanicznego' },
        7: { wynik: 'Masz postać krasnoluda. Przejdź do opisu krasnoludzkiego pochodzenia, by ustalić swój wiek, budowę ciała i wygląd.', efekt: 'Brak efektu mechanicznego' },
        8: { wynik: 'Masz postać człowieka. Przejdź do opisu ludzkiego pochodzenia, by ustalić swój wiek, budowę ciała i wygląd.', efekt: 'Brak efektu mechanicznego' },
        9: { wynik: 'Masz postać człowieka. Przejdź do opisu ludzkiego pochodzenia, by ustalić swój wiek, budowę ciała i wygląd.', efekt: 'Brak efektu mechanicznego' },
        10: { wynik: 'Masz postać człowieka. Przejdź do opisu ludzkiego pochodzenia, by ustalić swój wiek, budowę ciała i wygląd.', efekt: 'Brak efektu mechanicznego' },
        11: { wynik: 'Masz postać człowieka. Przejdź do opisu ludzkiego pochodzenia, by ustalić swój wiek, budowę ciała i wygląd.', efekt: 'Brak efektu mechanicznego' },
        12: { wynik: 'Masz postać człowieka. Przejdź do opisu ludzkiego pochodzenia, by ustalić swój wiek, budowę ciała i wygląd.', efekt: 'Brak efektu mechanicznego' },
        13: { wynik: 'Masz postać człowieka. Przejdź do opisu ludzkiego pochodzenia, by ustalić swój wiek, budowę ciała i wygląd.', efekt: 'Brak efektu mechanicznego' },
        14: { wynik: 'Masz postać człowieka. Przejdź do opisu ludzkiego pochodzenia, by ustalić swój wiek, budowę ciała i wygląd.', efekt: 'Brak efektu mechanicznego' },
        15: { wynik: 'Masz postać człowieka. Przejdź do opisu ludzkiego pochodzenia, by ustalić swój wiek, budowę ciała i wygląd.', efekt: 'Brak efektu mechanicznego' },
        16: { wynik: 'Masz postać orka. Przejdź do opisu orczego pochodzenia, by ustalić swój wiek, budowę ciała i wygląd.', efekt: 'Brak efektu mechanicznego' },
        17: { wynik: 'Masz postać orka. Przejdź do opisu orczego pochodzenia, by ustalić swój wiek, budowę ciała i wygląd.', efekt: 'Brak efektu mechanicznego' },
        18: { wynik: 'Twój wiek, budowę ciała i wygląd ustala MG.', efekt: 'Brak efektu mechanicznego' }
      }
    },
    przeszlosc: {
      nazwa: 'Przeszłość',
      typ: 'k20',
      opis: 'Tabela określająca przeszłość odmieńca',
      wyniki: {
        1: { wynik: 'Dopiero niedawno odkryłeś swoją prawdziwą naturę i masz trudności z zaakceptowaniem nowego stanu rzeczy.', efekt: 'Zaczynasz grę z 1 punktem Szaleństwa.' },
        2: { wynik: 'Pozostajesz nieświadomy tego, że jesteś odmieńcem. Uważasz swoje przybrane pochodzenie za prawdziwe. Dopóki nie zostaniesz obezwładniony lub nie dotkniesz po raz pierwszy żelaza, nie możesz korzystać z Kradzieży tożsamości.', efekt: 'Zyskujesz dodatkową losową profesję.' },
        3: { wynik: 'Byłeś niewolnikiem jędzy, która zmuszała cię do czynienia niewysłowionego zła.', efekt: 'Zaczynasz grę z 1 punktem Splugawienia.' },
        4: { wynik: 'Zabiłeś osobę, której tożsamość skradłeś, aby żyć jej życiem.', efekt: 'Zaczynasz grę z 1 punktem Splugawienia.' },
        5: { wynik: 'Gdy twoi „rodzice" zdali sobie sprawę z tego, czym jesteś, wygnali cię z domu. Od tamtej pory musiałeś radzić sobie sam.', efekt: 'Brak efektu mechanicznego' },
        6: { wynik: 'Uciekłeś z domu, gdy dowiedziałeś się, czym jesteś, i przez długie lata żyłeś wśród faerie.', efekt: 'Brak efektu mechanicznego' },
        7: { wynik: 'Ściga cię łowca czarownic. Jeśli wasze drogi kiedyś się zejdą, będzie próbował cię zabić.', efekt: 'Brak efektu mechanicznego' },
        8: { wynik: 'Zostałeś wygnany z rodzinnego miasteczka przez przerażonych twoją prawdziwą naturą mieszkańców. Znienawidziłeś ich za to i szukasz sposobu, by się zemścić.', efekt: 'Brak efektu mechanicznego' },
        9: { wynik: 'Gdy po raz pierwszy skradłeś czyjąś tożsamość, poznałeś także kilka wspomnień tej osoby.', efekt: 'Brak efektu mechanicznego' },
        10: { wynik: 'Utrzymujesz się z pracy w swojej profesji.', efekt: 'Brak efektu mechanicznego' },
        11: { wynik: 'Zakochałeś się, ale obiekt twoich uczuć nie wie, kim naprawdę jesteś.', efekt: 'Brak efektu mechanicznego' },
        12: { wynik: 'Wygnano cię z domu, ale zostałeś przygarnięty przez druida lub wiedźmę. Zawsze masz dokąd wrócić.', efekt: 'Brak efektu mechanicznego' },
        13: { wynik: 'Pracowałeś dla inkwizycji jako informator.', efekt: 'Brak efektu mechanicznego' },
        14: { wynik: 'Posiadasz formalne wykształcenie.', efekt: 'Umiesz czytać i pisać w języku wspólnym.' },
        15: { wynik: 'Podszywając się pod kogoś, poznałeś straszliwy sekret. Ustal jego naturę wspólnie z mistrzem gry.', efekt: 'Brak efektu mechanicznego' },
        16: { wynik: 'Rodzice wychowali cię mimo tego, że znali twoją prawdziwą naturę. Ich miłość i wsparcie pomogły ci ukształtować własną, dojrzałą osobowość.', efekt: 'Brak efektu mechanicznego' },
        17: { wynik: 'Zostałeś niedawno odnaleziony przez swojego elfiego stwórcę. Zaprzyjaźniliście się; możesz raz poprosić o przysługę, mówiąc do muszli, którą otrzymałeś od niego w darze. Wielkość tej przysługi zależy od MG.', efekt: 'Brak efektu mechanicznego' },
        18: { wynik: 'Przyjąłeś postać kogoś znanego, ważnego i wpływowego.', efekt: 'Brak efektu mechanicznego' },
        19: { wynik: 'Zostałeś zwerbowany przez organizację przestępczą z uwagi na swój magiczny dar.', efekt: 'Brak efektu mechanicznego' },
        20: { wynik: 'Odziedziczyłeś w spadku pieniądze.', efekt: 'Zaczynasz grę z 2k6 miedziaków.' }
      }
    },
    dziwactwo: {
      nazwa: 'Dziwactwo',
      typ: 'k20',
      opis: 'Tabela określająca dziwactwo odmieńca',
      wyniki: {
        1: { wynik: 'Zawsze mówisz o sobie w trzeciej osobie.', efekt: 'Brak efektu mechanicznego' },
        2: { wynik: 'W ciemności twoje oczy świecą na zielono.', efekt: 'Brak efektu mechanicznego' },
        3: { wynik: 'Zwierzęta są podenerwowane, gdy jesteś w pobliżu.', efekt: 'Brak efektu mechanicznego' },
        4: { wynik: 'Możesz przybierać tylko męskie lub tylko żeńskie formy.', efekt: 'Brak efektu mechanicznego' },
        5: { wynik: 'Jesteś nieokrzesany i impulsywny.', efekt: 'Brak efektu mechanicznego' },
        6: { wynik: 'Zawsze powracasz do pierwszej postaci, jaką przybrałeś.', efekt: 'Brak efektu mechanicznego' },
        7: { wynik: 'Zapach żelaza przyprawia cię o mdłości.', efekt: 'Brak efektu mechanicznego' },
        8: { wynik: 'Nękają cię okropne koszmary.', efekt: 'Brak efektu mechanicznego' },
        9: { wynik: 'Czasem wydaje ci się, że słyszysz głosy.', efekt: 'Brak efektu mechanicznego' },
        10: { wynik: 'Często gubisz drobne, nieważne przedmioty.', efekt: 'Brak efektu mechanicznego' },
        11: { wynik: 'Co roku na jedną noc tracisz swój talent Kradzież tożsamości.', efekt: 'Brak efektu mechanicznego' },
        12: { wynik: 'Możesz przybierać postać wyłącznie martwych osób.', efekt: 'Brak efektu mechanicznego' },
        13: { wynik: 'Zawsze mówisz szeptem.', efekt: 'Brak efektu mechanicznego' },
        14: { wynik: 'Roztaczasz wokół siebie osobliwy, ziemisty zapach.', efekt: 'Brak efektu mechanicznego' },
        15: { wynik: 'Twoje ubrania są wiecznie brudne.', efekt: 'Brak efektu mechanicznego' },
        16: { wynik: 'Nie jesteś w stanie się upić.', efekt: 'Brak efektu mechanicznego' },
        17: { wynik: 'Zawsze mówisz prawdę (lub to, co uważasz za prawdę).', efekt: 'Brak efektu mechanicznego' },
        18: { wynik: 'Brzydzisz się mięsa.', efekt: 'Brak efektu mechanicznego' },
        19: { wynik: 'Śmiejesz się w najmniej odpowiednich momentach.', efekt: 'Brak efektu mechanicznego' },
        20: { wynik: 'Formy, które przybierasz, nie mają włosów i paznokci.', efekt: 'Brak efektu mechanicznego' }
      }
    },
    osobowosc: {
      nazwa: 'Osobowość',
      typ: '3k6',
      opis: 'Tabela określająca osobowość odmieńca',
      wyniki: {
        3: { wynik: 'Kradniesz cudzą tożsamość, by móc robić, co chcesz, i nie zważać na konsekwencje. Nie obchodzi cię, jak odbija się to na innych.', efekt: 'Brak efektu mechanicznego' },
        4: { wynik: 'Lubisz przybierać formy, które pozwalają ci psocić.', efekt: 'Brak efektu mechanicznego' },
        5: { wynik: 'Lubisz przybierać formy, które pozwalają ci psocić.', efekt: 'Brak efektu mechanicznego' },
        6: { wynik: 'Przybierasz formy, które dają ci władzę nad innymi. Władza zapewnia ci bezpieczeństwo.', efekt: 'Brak efektu mechanicznego' },
        7: { wynik: 'Zmieniasz postać dla zysku, zwykle, by dostać się w miejsca, które inaczej byłyby dla ciebie niedostępne.', efekt: 'Brak efektu mechanicznego' },
        8: { wynik: 'Zmieniasz postać dla zysku, zwykle, by dostać się w miejsca, które inaczej byłyby dla ciebie niedostępne.', efekt: 'Brak efektu mechanicznego' },
        9: { wynik: 'Zmieniasz postać dla zysku, zwykle, by dostać się w miejsca, które inaczej byłyby dla ciebie niedostępne.', efekt: 'Brak efektu mechanicznego' },
        10: { wynik: 'Zmieniasz postać dla zysku, zwykle, by dostać się w miejsca, które inaczej byłyby dla ciebie niedostępne.', efekt: 'Brak efektu mechanicznego' },
        11: { wynik: 'Jesteś bardzo ostrożny w kwestii zmiany postaci. Starasz się trzymać z dala od kłopotów i chronić swoje sekrety.', efekt: 'Brak efektu mechanicznego' },
        12: { wynik: 'Jesteś bardzo ostrożny w kwestii zmiany postaci. Starasz się trzymać z dala od kłopotów i chronić swoje sekrety.', efekt: 'Brak efektu mechanicznego' },
        13: { wynik: 'Jesteś bardzo ostrożny w kwestii zmiany postaci. Starasz się trzymać z dala od kłopotów i chronić swoje sekrety.', efekt: 'Brak efektu mechanicznego' },
        14: { wynik: 'Chcesz czynić dobro, a swoje zdolności wykorzystywać, by pomagać innym i chronić się przed wrogami.', efekt: 'Brak efektu mechanicznego' },
        15: { wynik: 'Swoją naturę widzisz jako dar, który wykorzystujesz, by czynić to, co uważasz za słuszne, nawet jeśli ma ci to przysporzyć wrogów.', efekt: 'Brak efektu mechanicznego' },
        16: { wynik: 'Swoją naturę widzisz jako dar, który wykorzystujesz, by czynić to, co uważasz za słuszne, nawet jeśli ma ci to przysporzyć wrogów.', efekt: 'Brak efektu mechanicznego' },
        17: { wynik: 'Starasz się trzymać jednej i tej samej postaci tak długo, jak to możliwe. Pragniesz stabilizacji i zrobiłbyś wszystko, by być „normalny".', efekt: 'Brak efektu mechanicznego' },
        18: { wynik: 'Swoje talenty wykorzystujesz, by pomagać innym, naprawiać krzywdy i czynić świat lepszym.', efekt: 'Brak efektu mechanicznego' }
      }
    }
  },

  // ========== ORK ==========
  ork: {
    wiek: {
      nazwa: 'Wiek',
      typ: '3k6',
      opis: 'Tabela określająca wiek orka',
      wyniki: {
        3: { wynik: 'Dziecko, 8 lat lub mniej.', efekt: 'Brak efektu mechanicznego' },
        4: { wynik: 'Młodociany, 8–12 lat.', efekt: 'Brak efektu mechanicznego' },
        5: { wynik: 'Młodociany, 8–12 lat.', efekt: 'Brak efektu mechanicznego' },
        6: { wynik: 'Młodociany, 8–12 lat.', efekt: 'Brak efektu mechanicznego' },
        7: { wynik: 'Młodociany, 8–12 lat.', efekt: 'Brak efektu mechanicznego' },
        8: { wynik: 'Młody dorosły, 13–18 lat.', efekt: 'Brak efektu mechanicznego' },
        9: { wynik: 'Młody dorosły, 13–18 lat.', efekt: 'Brak efektu mechanicznego' },
        10: { wynik: 'Młody dorosły, 13–18 lat.', efekt: 'Brak efektu mechanicznego' },
        11: { wynik: 'Młody dorosły, 13–18 lat.', efekt: 'Brak efektu mechanicznego' },
        12: { wynik: 'Młody dorosły, 13–18 lat.', efekt: 'Brak efektu mechanicznego' },
        13: { wynik: 'Dorosły w średnim wieku, 19–26 lat.', efekt: 'Brak efektu mechanicznego' },
        14: { wynik: 'Dorosły w średnim wieku, 19–26 lat.', efekt: 'Brak efektu mechanicznego' },
        15: { wynik: 'Dorosły w średnim wieku, 19–26 lat.', efekt: 'Brak efektu mechanicznego' },
        16: { wynik: 'Starszy dorosły, 27–32 lata.', efekt: 'Brak efektu mechanicznego' },
        17: { wynik: 'Starszy dorosły, 27–32 lata.', efekt: 'Brak efektu mechanicznego' },
        18: { wynik: 'Sędziwy dorosły, 33 lata lub więcej.', efekt: 'Brak efektu mechanicznego' }
      }
    },
    budowa_ciala: {
      nazwa: 'Budowa ciała',
      typ: '3k6',
      opis: 'Tabela określająca budowę ciała orka',
      wyniki: {
        3: { wynik: 'Jesteś niski i żylasty.', efekt: 'Brak efektu mechanicznego' },
        4: { wynik: 'Jesteś niski i muskularny.', efekt: 'Brak efektu mechanicznego' },
        5: { wynik: 'Jesteś niski.', efekt: 'Brak efektu mechanicznego' },
        6: { wynik: 'Jesteś niski.', efekt: 'Brak efektu mechanicznego' },
        7: { wynik: 'Jesteś chudy.', efekt: 'Brak efektu mechanicznego' },
        8: { wynik: 'Jesteś chudy.', efekt: 'Brak efektu mechanicznego' },
        9: { wynik: 'Jesteś średniego wzrostu i wagi.', efekt: 'Brak efektu mechanicznego' },
        10: { wynik: 'Jesteś średniego wzrostu i wagi.', efekt: 'Brak efektu mechanicznego' },
        11: { wynik: 'Jesteś średniego wzrostu i wagi.', efekt: 'Brak efektu mechanicznego' },
        12: { wynik: 'Jesteś średniego wzrostu i wagi.', efekt: 'Brak efektu mechanicznego' },
        13: { wynik: 'Jesteś otyły.', efekt: 'Brak efektu mechanicznego' },
        14: { wynik: 'Jesteś otyły.', efekt: 'Brak efektu mechanicznego' },
        15: { wynik: 'Jesteś wysoki.', efekt: 'Brak efektu mechanicznego' },
        16: { wynik: 'Jesteś wysoki.', efekt: 'Brak efektu mechanicznego' },
        17: { wynik: 'Jesteś wysoki i chudy.', efekt: 'Brak efektu mechanicznego' },
        18: { wynik: 'Jesteś olbrzymem wśród orków.', efekt: 'Brak efektu mechanicznego' }
      }
    },
    wyglad: {
      nazwa: 'Wygląd',
      typ: '3k6',
      opis: 'Tabela określająca wygląd orka',
      wyniki: {
        3: { wynik: 'Jesteś chodzącą groteską. Twoja twarz to jedna wielka blizna. Na całym ciele masz głębokie szramy, poszywane niewprawnie rzemykami. Z otwartych ran leje się ropa. Cuchniesz kałem, krwią i zgnilizną.', efekt: 'Brak efektu mechanicznego' },
        4: { wynik: 'Jesteś chodzącą groteską. Twoja twarz to jedna wielka blizna. Na całym ciele masz głębokie szramy, poszywane niewprawnie rzemykami. Z otwartych ran leje się ropa. Cuchniesz kałem, krwią i zgnilizną.', efekt: 'Brak efektu mechanicznego' },
        5: { wynik: 'Jesteś chodzącą groteską. Twoja twarz to jedna wielka blizna. Na całym ciele masz głębokie szramy, poszywane niewprawnie rzemykami. Z otwartych ran leje się ropa. Cuchniesz kałem, krwią i zgnilizną.', efekt: 'Brak efektu mechanicznego' },
        6: { wynik: 'Wyglądasz jak monstrum o twardych, prymitywnych rysach twarzy. Twoją grubą, twardą skórę pokrywają dziwne wykwity i paskudne, poszarpane blizny.', efekt: 'Brak efektu mechanicznego' },
        7: { wynik: 'Wyglądasz jak monstrum o twardych, prymitywnych rysach twarzy. Twoją grubą, twardą skórę pokrywają dziwne wykwity i paskudne, poszarpane blizny.', efekt: 'Brak efektu mechanicznego' },
        8: { wynik: 'Wyglądasz jak monstrum o twardych, prymitywnych rysach twarzy. Twoją grubą, twardą skórę pokrywają dziwne wykwity i paskudne, poszarpane blizny.', efekt: 'Brak efektu mechanicznego' },
        9: { wynik: 'Jesteś brzydki. Masz szeroką żuchwę, wystające kły, wydatne czoło i małe, głęboko osadzone oczy.', efekt: 'Brak efektu mechanicznego' },
        10: { wynik: 'Jesteś brzydki. Masz szeroką żuchwę, wystające kły, wydatne czoło i małe, głęboko osadzone oczy.', efekt: 'Brak efektu mechanicznego' },
        11: { wynik: 'Jesteś brzydki. Masz szeroką żuchwę, wystające kły, wydatne czoło i małe, głęboko osadzone oczy.', efekt: 'Brak efektu mechanicznego' },
        12: { wynik: 'Jesteś brzydki. Masz szeroką żuchwę, wystające kły, wydatne czoło i małe, głęboko osadzone oczy.', efekt: 'Brak efektu mechanicznego' },
        13: { wynik: 'Masz typowy dla orka wygląd, jesteś brudny i zaniedbany.', efekt: 'Brak efektu mechanicznego' },
        14: { wynik: 'Masz typowy dla orka wygląd, jesteś brudny i zaniedbany.', efekt: 'Brak efektu mechanicznego' },
        15: { wynik: 'Masz typowy dla orka wygląd, jesteś brudny i zaniedbany.', efekt: 'Brak efektu mechanicznego' },
        16: { wynik: 'Masz trochę mniej bestialskie rysy, choć wyróżniasz się nietypowym kolorem skóry, gęstszą sierścią czy grubo ciosaną twarzą.', efekt: 'Brak efektu mechanicznego' },
        17: { wynik: 'Masz trochę mniej bestialskie rysy, choć wyróżniasz się nietypowym kolorem skóry, gęstszą sierścią czy grubo ciosaną twarzą.', efekt: 'Brak efektu mechanicznego' },
        18: { wynik: 'Zdecydowanie różnisz się od innych orków. Na twoim ciele nie ma charakterystycznych dla twoich współbraci blizn i ran, nie nękają cię też żadne choroby.', efekt: 'Brak efektu mechanicznego' }
      }
    },
    przeszlosc: {
      nazwa: 'Przeszłość',
      typ: 'k20',
      opis: 'Tabela określająca przeszłość orka',
      wyniki: {
        1: { wynik: 'Z zimną krwią mordowałeś bezbronnych ludzi.', efekt: 'Zyskaj 2 punkty Splugawienia.' },
        2: { wynik: 'Przez krótki czas byłeś opętany przez demona.', efekt: 'Zyskaj 1 punkt Splugawienia.' },
        3: { wynik: 'Przez 1k6 lat ku uciesze tłumów walczyłeś przeciw innym orkom na arenie.', efekt: 'Brak efektu mechanicznego' },
        4: { wynik: 'Pozostałeś lojalny wobec Imperium i walczyłeś przeciw innym orkom. Zostałeś naznaczony piętnem zdrajcy i wygnany.', efekt: 'Brak efektu mechanicznego' },
        5: { wynik: 'Wskutek choroby straciłeś uszy i nos.', efekt: 'Brak efektu mechanicznego' },
        6: { wynik: 'Przez 1k6 lat służyłeś przykuty do wioseł na galerze.', efekt: 'Brak efektu mechanicznego' },
        7: { wynik: 'Zostałeś wykastrowany i postawiony na straży konkubin cesarza.', efekt: 'Brak efektu mechanicznego' },
        8: { wynik: 'Połowę twojego ciała pokrywają blizny po oparzeniu magicznym ogniem.', efekt: 'Brak efektu mechanicznego' },
        9: { wynik: 'Uciekłeś z niewoli i od tamtej pory żyłeś w dziczy.', efekt: 'Brak efektu mechanicznego' },
        10: { wynik: 'Utrzymujesz się z pracy w swojej profesji.', efekt: 'Brak efektu mechanicznego' },
        11: { wynik: 'Zakochałeś się w człowieku i twoja miłość została odtrącona.', efekt: 'Brak efektu mechanicznego' },
        12: { wynik: 'Dorobiłeś się 3k6 dzieci. Rzuć jeszcze raz 3k6 i odejmij wynik od poprzedniego rzutu, by ustalić, ile z nich przeżyło (minimum 0).', efekt: 'Brak efektu mechanicznego' },
        13: { wynik: 'Odbyłeś wiele podróży w różne strony świata.', efekt: 'Umiesz mówić jednym dodatkowym językiem.' },
        14: { wynik: 'Posiadasz formalne wykształcenie.', efekt: 'Umiesz czytać i pisać w języku wspólnym.' },
        15: { wynik: 'Walczyłeś dzielnie w imię cesarza i za swoją odwagę zostałeś odznaczony.', efekt: 'Brak efektu mechanicznego' },
        16: { wynik: 'Obroniłeś ważnego dygnitarza przed próbą zabójstwa.', efekt: 'Brak efektu mechanicznego' },
        17: { wynik: 'Zostałeś oswobodzony przez człowieka, który darował ci wolność, byś szukał szczęścia w szerokim świecie.', efekt: 'Brak efektu mechanicznego' },
        18: { wynik: 'Jednemu z zabitych wrogów zabrałeś miecz.', efekt: 'Brak efektu mechanicznego' },
        19: { wynik: 'W snach nawiedzają cię Bogowie Krwi i Żelaza.', efekt: 'Zaczynasz grę z 1 punktem Splugawienia.' },
        20: { wynik: 'Odziedziczyłeś w spadku pieniądze.', efekt: 'Zaczynasz grę z 2k6 miedziaków.' }
      }
    },
    osobowosc: {
      nazwa: 'Osobowość',
      typ: '3k6',
      opis: 'Tabela określająca osobowość orka',
      wyniki: {
        3: { wynik: 'Walczysz o oswobodzenie swojego ludu z niewoli.', efekt: 'Brak efektu mechanicznego' },
        4: { wynik: 'Orki są kimś więcej niż tylko zabójcami, jakimi uczynił ich cesarz. Mają serca, dusze, marzenia i ambicje. Wierzysz, że musicie porzucić swą dziką naturę i odnaleźć własne miejsce w świecie.', efekt: 'Brak efektu mechanicznego' },
        5: { wynik: 'Świat zmierza ku zagładzie. I dobrze.', efekt: 'Brak efektu mechanicznego' },
        6: { wynik: 'Świat zmierza ku zagładzie. I dobrze.', efekt: 'Brak efektu mechanicznego' },
        7: { wynik: 'Dbasz tylko o siebie; robisz, co chcesz, i bierzesz, co chcesz.', efekt: 'Brak efektu mechanicznego' },
        8: { wynik: 'Dbasz tylko o siebie; robisz, co chcesz, i bierzesz, co chcesz.', efekt: 'Brak efektu mechanicznego' },
        9: { wynik: 'Przepełnia cię żądza mordu!', efekt: 'Brak efektu mechanicznego' },
        10: { wynik: 'Przepełnia cię żądza mordu!', efekt: 'Brak efektu mechanicznego' },
        11: { wynik: 'Przepełnia cię żądza mordu!', efekt: 'Brak efektu mechanicznego' },
        12: { wynik: 'Przepełnia cię żądza mordu!', efekt: 'Brak efektu mechanicznego' },
        13: { wynik: 'Nigdy nie kwestionujesz rozkazów i wypełniasz je co do joty.', efekt: 'Brak efektu mechanicznego' },
        14: { wynik: 'Nigdy nie kwestionujesz rozkazów i wypełniasz je co do joty.', efekt: 'Brak efektu mechanicznego' },
        15: { wynik: 'Szukasz zemsty; zabijesz każdego, kto stanie ci na drodze.', efekt: 'Brak efektu mechanicznego' },
        16: { wynik: 'Szukasz zemsty; zabijesz każdego, kto stanie ci na drodze.', efekt: 'Brak efektu mechanicznego' },
        17: { wynik: 'Wierzysz, że powstałeś w określonym celu. Uwolniony z łańcuchów straciłeś sens życia.', efekt: 'Brak efektu mechanicznego' },
        18: { wynik: 'Wierzysz, że twój lud dokonał w imię Imperium wielkiego zła. Starasz się naprawić te krzywdy.', efekt: 'Brak efektu mechanicznego' }
      }
    }
  }
};

export default ORIGIN_TABLES;
