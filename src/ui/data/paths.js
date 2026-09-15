/**
 * Ścieżki postaci - system progresji
 * Źródło: Podręcznik Główny (PG), rozdział 3 (ścieżki nowicjuszy i eksperckie)
 * i rozdział 5 (ścieżki mistrzowskie)
 *
 * Każda ścieżka przechowuje swoje korzyści pod kluczem `poziom_1` -
 * niezależnie od tego, na którym faktycznym poziomie drużyny (1, 3 albo 7)
 * ścieżka zostaje wybrana - to korzyści przyznawane w chwili jej wyboru
 * (zgodnie z konwencją już używaną przez ścieżki nowicjuszy).
 *
 * Pole `jezyki_profesje` (gdy obecne) opisuje strukturalnie przyznawany
 * bonus językowy/profesyjny:
 * - typ 'wybor': jedno z dwóch - nowy język mówiony ALBO profesja z `kategorie`
 * - typ 'tylko_profesja': wyłącznie profesja z `kategorie`, bez opcji językowej
 * - typ 'oba': jednocześnie nowy język mówiony ORAZ profesja z `kategorie`
 * - typ 'automatyczne_naukowa' (tylko Magik): automatyczne czytanie/pisanie
 *   we wszystkich znanych językach + wybrana profesja naukowa
 * `kategorie` używa kluczy z PROFESSIONS.tables (naukowe/pospolite/
 * przestepcze/wojenne/koczownicze/religijne) albo ['dowolna'].
 */

const PATHS = {
  // Ścieżki nowicjuszy (poziom 1) - PG rozdział 3
  sciezki_nowicjuszy: {
    kleryk: {
      id: 'kleryk',
      nazwa: 'Kleryk',
      opis: 'Sługa bóstwa, leczy i wspiera sojuszników modlitwą.',
      poziom_1: {
        zdrowie: '+3',
        magia: '3 wybory tradycji/zaklęć związanych z religią',
        talenty: ['Modlitwa', 'Wspólna odnowa']
      },
      poziom_2: {
        zdrowie: '+4',
        magia: '2 wybory tradycji/zaklęć'
      },
      poziom_5: {
        zdrowie: '+4',
        moc: '+1',
        magia: '1 wybór',
        talenty: ['Boskie uderzenie']
      },
      poziom_8: {
        zdrowie: '+4',
        magia: '1 wybór',
        talenty: ['Inspirująca modlitwa', 'Udoskonalona wspólna odnowa']
      },
      strona_zrodlowa: 58
    },

    lotr: {
      id: 'lotr',
      nazwa: 'Łotr',
      opis: 'Skrytobójca i złodziej, specjalizujący się w atakach z zaskoczenia.',
      poziom_1: {
        zdrowie: '+3',
        jezyki_profesje: {
          typ: 'wybor',
          kategorie: ['pospolite', 'przestepcze', 'koczownicze'],
          opis: 'Uczysz się mówić jednym językiem lub zyskujesz jedną profesję pospolitą, przestępczą lub koczowniczą.'
        },
        talenty: ['Szybka odnowa', 'Podstęp']
      },
      poziom_2: {
        zdrowie: '+3',
        talenty: ['Wykorzystanie okazji', 'Łotrowski talent']
      },
      poziom_5: {
        zdrowie: '+3',
        talenty: ['Nieczyste zagrania', 'Łotrowski spryt']
      },
      poziom_8: {
        zdrowie: '+3',
        talenty: ['Łotrowski talent']
      },
      strona_zrodlowa: 59
    },

    mag: {
      id: 'mag',
      nazwa: 'Magik',
      opis: 'Użytkownik magii, specjalizujący się w zaklęciach.',
      poziom_1: {
        atrybuty_glowne: {
          typ: 'wybor',
          ilosc: 2,
          wartosc: 1,
          dostepne: ['sila', 'zrecznosc', 'intelekt', 'wola']
        },
        zdrowie: '+2',
        moc: '+1',
        jezyki_profesje: {
          typ: 'automatyczne_naukowa',
          kategorie: ['naukowe'],
          opis: 'Umiesz czytać i pisać we wszystkich znanych ci językach. Zyskujesz także wybraną przez siebie profesję naukową.'
        },
        magia: '1 tradycja + 3 wybory',
        talenty: ['Sztuczki', 'Wyczucie magii']
      },
      poziom_2: {
        zdrowie: '+2',
        magia: '2 wybory',
        talenty: ['Odzyskanie zaklęcia']
      },
      poziom_5: {
        zdrowie: '+2',
        moc: '+1',
        magia: '1 wybór',
        talenty: ['Kontrmagia']
      },
      poziom_8: {
        zdrowie: '+2',
        magia: '1 wybór',
        talenty: ['Udoskonalone odzyskanie zaklęcia']
      },
      strona_zrodlowa: 60
    },

    wojownik: {
      id: 'wojownik',
      nazwa: 'Wojownik',
      opis: 'Mistrz walki wręcz i bronią białą.',
      poziom_1: {
        atrybuty_glowne: {
          typ: 'wybor',
          ilosc: 2,
          wartosc: 1,
          dostepne: ['sila', 'zrecznosc', 'intelekt', 'wola']
        },
        zdrowie: '+5',
        jezyki_profesje: {
          typ: 'tylko_profesja',
          kategorie: ['pospolite', 'wojenne', 'koczownicze'],
          opis: 'Zyskujesz jedną profesję pospolitą, wojenną lub koczowniczą.'
        },
        talenty: ['Chwila wytchnienia', 'Wyszkolenie w walce']
      },
      poziom_2: {
        zdrowie: '+5',
        talenty: ['Sprawność bojowa', 'Potężne uderzenie']
      },
      poziom_5: {
        obrona: '+1',
        zdrowie: '+5',
        talenty: ['Doświadczenie bojowe']
      },
      poziom_8: {
        zdrowie: '+5',
        talenty: ['Wytrwałość', 'Mistrzostwo bojowe']
      },
      strona_zrodlowa: 56
    }
  },

  // Ścieżki eksperckie (poziom 3) - PG rozdział 4, 16 ścieżek w 4 kategoriach
  sciezki_ekspertow: {
    berserker: {
      id: 'berserker',
      nazwa: 'Berserker',
      opis: 'Wojownik ogarnięty gniewem, wpadający w berserk podczas walki.',
      poziom_1: {
        zdrowie: '+6',
        talenty: ['Berserk', 'Żelazna skóra']
      },
      strona_zrodlowa: 64
    },

    czarnoksiężnik: {
      id: 'czarnoksiężnik',
      nazwa: 'Czarnoksiężnik',
      opis: 'Złodziej magii, potrafiący wydzierać zaklęcia z cudzych umysłów.',
      poziom_1: {
        zdrowie: '+2',
        moc: '+1',
        jezyki_profesje: {
          typ: 'wybor',
          kategorie: ['przestepcze'],
          opis: 'Uczysz się mówić nowym językiem bądź zyskujesz profesję przestępczą.'
        },
        magia: '1 tradycja lub 1 zaklęcie',
        talenty: ['Kradzież zaklęcia', 'Zniknięcie']
      },
      strona_zrodlowa: 65
    },

    czarodziej: {
      id: 'czarodziej',
      nazwa: 'Czarodziej',
      opis: 'Naukowiec wśród magików, gromadzący wiedzę w grymuarach.',
      poziom_1: {
        zdrowie: '+2',
        moc: '+1',
        jezyki_profesje: {
          typ: 'wybor',
          kategorie: ['naukowe'],
          opis: 'Uczysz się mówić nowym językiem bądź zyskujesz profesję naukową.'
        },
        magia: '1 tradycja lub 1 zaklęcie',
        talenty: ['Grymuar']
      },
      strona_zrodlowa: 66
    },

    czarownik: {
      id: 'czarownik',
      nazwa: 'Czarownik',
      opis: 'Włada niesamowitymi pokładami magicznej energii kosztem ryzyka.',
      poziom_1: {
        zdrowie: '+2',
        moc: '+1',
        magia: '1 tradycja lub 1 zaklęcie',
        talenty: ['Czarownictwo', 'Eksplozja mocy']
      },
      strona_zrodlowa: 67
    },

    druid: {
      id: 'druid',
      nazwa: 'Druid',
      opis: 'Zaprzysiężony sługa natury, władający jej pradawnymi tajemnicami.',
      poziom_1: {
        zdrowie: '+4',
        moc: '+1',
        jezyki_profesje: {
          typ: 'wybor',
          kategorie: ['religijne', 'koczownicze'],
          opis: 'Uczysz się mówić nowym językiem bądź zyskujesz profesję religijną lub koczowniczą.'
        },
        magia: 'Życie, Natura lub Magia Pierwotna - tradycja lub zaklęcie',
        talenty: ['Tajemnice druidów']
      },
      strona_zrodlowa: 68
    },

    kaplan: {
      id: 'kaplan',
      nazwa: 'Kapłan',
      opis: 'Religijny lider zapewniający duchowe przewodnictwo.',
      poziom_1: {
        zdrowie: '+4',
        moc: '+1',
        jezyki_profesje: {
          typ: 'wybor',
          kategorie: ['naukowe', 'religijne'],
          opis: 'Uczysz się mówić nowym językiem bądź zyskujesz profesję naukową lub religijną.'
        },
        magia: 'Tradycja religijna lub zaklęcie',
        talenty: ['Niezłomny', 'Symbol wiary']
      },
      strona_zrodlowa: 69
    },

    lowca: {
      id: 'lowca',
      nazwa: 'Łowca',
      opis: 'Tropiciel i myśliwy, niezrównany w wyśledzeniu zdobyczy.',
      poziom_1: {
        zdrowie: '+8',
        percepcja: '+1',
        jezyki_profesje: {
          typ: 'tylko_profesja',
          kategorie: ['koczownicze'],
          opis: 'Wybierz dodatkową profesję koczowniczą.'
        },
        talenty: ['Czujność', 'Polowanie', 'Tajniki natury']
      },
      strona_zrodlowa: 70
    },

    paladyn: {
      id: 'paladyn',
      nazwa: 'Paladyn',
      opis: 'Wojownik łączący siłę fizyczną z mocą bożą.',
      poziom_1: {
        zdrowie: '+4',
        moc: '+1',
        magia: 'Tradycja religijna lub zaklęcie',
        talenty: ['Boskie powołanie', 'Boskie porażenie', 'Uzdrawiająca wiara']
      },
      strona_zrodlowa: 71
    },

    skrytobojca: {
      id: 'skrytobojca',
      nazwa: 'Skrytobójca',
      opis: 'Do perfekcji opanował sztukę zabijania z zaskoczenia.',
      poziom_1: {
        zdrowie: '+3',
        talenty: ['Wprawna charakteryzacja', 'Dobry refleks']
      },
      strona_zrodlowa: 72
    },

    wiedzma: {
      id: 'wiedzma',
      nazwa: 'Wiedźma',
      opis: 'Władczyni starej magii, nauczonej dawno temu od Pięknego Ludu.',
      poziom_1: {
        atrybuty_glowne: { typ: 'wybor', ilosc: 2, wartosc: 1, dostepne: ['sila', 'zrecznosc', 'intelekt', 'wola'] },
        zdrowie: '+2',
        moc: '+1',
        jezyki_profesje: {
          typ: 'wybor',
          kategorie: ['naukowe', 'pospolite', 'koczownicze'],
          opis: 'Uczysz się mówić nowym językiem bądź zyskujesz profesję naukową, pospolitą lub koczowniczą.'
        },
        magia: '1 tradycja lub 1 zaklęcie',
        talenty: ['Wsparcie', 'Wiedźmi ogień']
      },
      strona_zrodlowa: 73
    },

    wynalazca: {
      id: 'wynalazca',
      nazwa: 'Wynalazca',
      opis: 'Łączy naukę i magię, konstruując mechaniczne osobliwości.',
      poziom_1: {
        zdrowie: '+2',
        moc: '+1',
        jezyki_profesje: {
          typ: 'wybor',
          kategorie: ['naukowe'],
          opis: 'Uczysz się mówić nowym językiem lub zyskujesz jedną profesję naukową.'
        },
        magia: '1 tradycja lub 1 zaklęcie',
        talenty: ['Sakwa wynalazcy']
      },
      strona_zrodlowa: 74
    },

    wyrocznia: {
      id: 'wyrocznia',
      nazwa: 'Wyrocznia',
      opis: 'Nawiedzona przez nadprzyrodzoną istotę, przemawiającą przez jej ciało.',
      poziom_1: {
        zdrowie: '+3',
        moc: '+1',
        jezyki_profesje: {
          typ: 'wybor',
          kategorie: ['dowolna'],
          opis: 'Uczysz się mówić nowym językiem bądź zyskujesz profesję.'
        },
        talenty: ['Nawiedzenie']
      },
      strona_zrodlowa: 75
    },

    zaklinacz: {
      id: 'zaklinacz',
      nazwa: 'Zaklinacz',
      opis: 'Nasyca oręż magiczną mocą przy użyciu zaklętej broni.',
      poziom_1: {
        zdrowie: '+3',
        moc: '+1',
        magia: '1 tradycja lub 1 zaklęcie + zaklęta broń',
        talenty: ['Zaklęta broń']
      },
      strona_zrodlowa: 76
    },

    zbrojny: {
      id: 'zbrojny',
      nazwa: 'Zbrojny',
      opis: 'Wszechstronny wojownik, dla którego wszystko jest bronią.',
      poziom_1: {
        zdrowie: '+5',
        jezyki_profesje: {
          typ: 'wybor',
          kategorie: ['dowolna'],
          opis: 'Uczysz się mówić nowym językiem bądź zyskujesz profesję.'
        },
        talenty: ['Wszystko jest bronią', 'Talent zbrojnego']
      },
      strona_zrodlowa: 77
    },

    zlodziej: {
      id: 'zlodziej',
      nazwa: 'Złodziej',
      opis: 'Zręczny kieszonkowiec, specjalista od zamków i pułapek.',
      poziom_1: {
        percepcja: '+1',
        zdrowie: '+3',
        jezyki_profesje: {
          typ: 'wybor',
          kategorie: ['przestepcze'],
          opis: 'Uczysz się mówić nowym językiem bądź zyskujesz profesję przestępczą.'
        },
        talenty: ['Dobry refleks', 'Złodziejski talent']
      },
      strona_zrodlowa: 78
    },

    zwiadowca: {
      id: 'zwiadowca',
      nazwa: 'Zwiadowca',
      opis: 'Zbiera informacje dla sojuszników, wyśmienicie tropiąc dziczy.',
      poziom_1: {
        percepcja: '+1',
        zdrowie: '+3',
        predkosc: '+2',
        jezyki_profesje: {
          typ: 'wybor',
          kategorie: ['koczownicze'],
          opis: 'Uczysz się mówić nowym językiem bądź zyskujesz profesję koczowniczą.'
        },
        talenty: ['Czujność']
      },
      strona_zrodlowa: 79
    }
  },

  // Ścieżki mistrzowskie (poziom 7) - PG rozdział 5, 64 ścieżki w porządku alfabetycznym
  sciezki_mistrzow: {
    aeromanta: {
      id: 'aeromanta',
      nazwa: 'Aeromanta',
      opis: 'Wzmacnia więź z dżinnami powietrza, by władać jego mocą.',
      poziom_1: {
        zdrowie: '+2', predkosc: '+2', moc: '+1',
        jezyki_profesje: { typ: 'wybor', kategorie: ['dowolna'], opis: 'Uczysz się mówić nowym językiem bądź zyskujesz profesję.' },
        magia: 'Tradycja Powietrza lub zaklęcie',
        talenty: ['Powietrzny krok', 'Lot']
      },
      strona_zrodlowa: 82
    },
    akrobata: {
      id: 'akrobata',
      nazwa: 'Akrobata',
      opis: 'Rozwija mobilność i szybkość, by wymanewrowywać przeciwników.',
      poziom_1: {
        zdrowie: '+3', predkosc: '+2',
        jezyki_profesje: { typ: 'wybor', kategorie: ['dowolna'], opis: 'Uczysz się mówić nowym językiem bądź zyskujesz profesję.' },
        talenty: ['Akrobatyka', 'Mobilność']
      },
      strona_zrodlowa: 82
    },
    astromanta: {
      id: 'astromanta',
      nazwa: 'Astromanta',
      opis: 'Studiuje magię krain niebiańskich, czerpiąc moc ze światła.',
      poziom_1: {
        zdrowie: '+2', moc: '+1',
        jezyki_profesje: { typ: 'wybor', kategorie: ['dowolna'], opis: 'Uczysz się mówić nowym językiem bądź zyskujesz profesję.' },
        magia: 'Tradycja Magii Niebiańskiej lub zaklęcie',
        talenty: ['Wewnętrzny blask', 'Palące światło']
      },
      strona_zrodlowa: 83
    },
    bard: {
      id: 'bard',
      nazwa: 'Bard',
      opis: 'Zdolny artysta, wplatający w muzykę magię Pieśni.',
      poziom_1: {
        zdrowie: '+3', moc: '+1',
        jezyki_profesje: {
          typ: 'oba',
          kategorie: ['pospolite'],
          opis: 'Uczysz się mówić nowym językiem i zyskujesz profesję muzyka lub artysty rozrywkowego.'
        },
        magia: 'Tradycja Pieśni lub zaklęcie',
        talenty: ['Wiedza ezoteryczna', 'Przyśpiewka']
      },
      strona_zrodlowa: 83
    },
    chronomanta: {
      id: 'chronomanta',
      nazwa: 'Chronomanta',
      opis: 'Zgłębia arkana magii Czasu, manipulując jego przepływem.',
      poziom_1: {
        zdrowie: '+2', moc: '+1',
        jezyki_profesje: { typ: 'wybor', kategorie: ['dowolna'], opis: 'Uczysz się mówić nowym językiem bądź zyskujesz profesję.' },
        magia: 'Tradycja Czasu lub zaklęcie',
        talenty: ['Pęd', 'Prekognicja']
      },
      strona_zrodlowa: 84
    },
    cudotworca: {
      id: 'cudotworca',
      nazwa: 'Cudotwórca',
      opis: 'Wierzy tak silnie, że czynione przez niego cuda przekraczają zwykłe czary.',
      poziom_1: {
        zdrowie: '+6',
        talenty: ['Stygmaty', 'Dar języków']
      },
      strona_zrodlowa: 84
    },
    czempion: {
      id: 'czempion',
      nazwa: 'Czempion',
      opis: 'Doskonali techniki bitewne, by walczyć w obronie ważnych spraw.',
      poziom_1: {
        zdrowie: '+5',
        jezyki_profesje: { typ: 'wybor', kategorie: ['dowolna'], opis: 'Uczysz się mówić nowym językiem bądź zyskujesz profesję.' },
        talenty: ['Postawa bojowa', 'Wytrwałość czempiona']
      },
      strona_zrodlowa: 85
    },
    derwisz: {
      id: 'derwisz',
      nazwa: 'Derwisz',
      opis: 'Tańczy po polu bitwy, władając bronią w obu rękach.',
      poziom_1: {
        zdrowie: '+5',
        jezyki_profesje: { typ: 'wybor', kategorie: ['dowolna'], opis: 'Uczysz się mówić nowym językiem bądź zyskujesz profesję.' },
        talenty: ['Oburęczność', 'Oburęczna obrona']
      },
      strona_zrodlowa: 85
    },
    dyplomata: {
      id: 'dyplomata',
      nazwa: 'Dyplomata',
      opis: 'Mistrz negocjacji, rozwiązujący konflikty pokojowo.',
      poziom_1: {
        zdrowie: '+3',
        jezyki_profesje: { typ: 'wybor', kategorie: ['dowolna'], opis: 'Uczysz się mówić nowym językiem bądź zyskujesz profesję.' },
        talenty: ['Mistrz dyplomacji', 'Litość']
      },
      strona_zrodlowa: 85
    },
    egzekutor: {
      id: 'egzekutor',
      nazwa: 'Egzekutor',
      opis: 'Traktuje zabijanie jak sztukę, znając czułe punkty ofiar.',
      poziom_1: {
        zdrowie: '+3',
        jezyki_profesje: { typ: 'wybor', kategorie: ['dowolna'], opis: 'Uczysz się mówić nowym językiem bądź zyskujesz profesję.' },
        talenty: ['Egzekucja', 'Wyćwiczony atak']
      },
      strona_zrodlowa: 85
    },
    egzorcysta: {
      id: 'egzorcysta',
      nazwa: 'Egzorcysta',
      opis: 'Specjalizuje się w wypędzaniu i niszczeniu demonów oraz duchów.',
      poziom_1: {
        zdrowie: '+4', moc: '+1',
        jezyki_profesje: { typ: 'wybor', kategorie: ['religijne'], opis: 'Uczysz się mówić nowym językiem bądź zyskujesz profesję religijną.' },
        magia: 'Zaklęcie egzorcyzm',
        talenty: ['Magia egzorcysty', 'Żelazna wola']
      },
      strona_zrodlowa: 86
    },
    fechtmistrz: {
      id: 'fechtmistrz',
      nazwa: 'Fechtmistrz',
      opis: 'Specjalizuje się w pojedynkach jeden na jednego.',
      poziom_1: {
        zdrowie: '+4',
        jezyki_profesje: { typ: 'wybor', kategorie: ['dowolna'], opis: 'Uczysz się mówić nowym językiem bądź zyskujesz profesję.' },
        talenty: ['Wyzwanie', 'Riposta']
      },
      strona_zrodlowa: 86
    },
    geomanta: {
      id: 'geomanta',
      nazwa: 'Geomanta',
      opis: 'Zacieśnia więź z dżinnami ziemi, zyskując kontrolę nad skałami.',
      poziom_1: {
        zdrowie: '+4', moc: '+1',
        magia: 'Tradycja Ziemi lub zaklęcie',
        talenty: ['Kamienna ochrona', 'Przejście przez ziemię']
      },
      strona_zrodlowa: 86
    },
    gladiator: {
      id: 'gladiator',
      nazwa: 'Gladiator',
      opis: 'Mistrz aren, gotowy na wszystko, by przetrwać kolejne starcie.',
      poziom_1: {
        zdrowie: '+5',
        jezyki_profesje: { typ: 'wybor', kategorie: ['wojenne'], opis: 'Uczysz się mówić nowym językiem bądź zyskujesz profesję wojenną.' },
        talenty: ['Nieczysta walka', 'Za wszelką cenę']
      },
      strona_zrodlowa: 87
    },
    goliat: {
      id: 'goliat',
      nazwa: 'Goliat',
      opis: 'Poświęca niezliczone godziny budowaniu siły i witalności.',
      poziom_1: {
        zdrowie: '+8',
        talenty: ['Krzepa', 'Potężne muskuły']
      },
      strona_zrodlowa: 87
    },
    hydromanta: {
      id: 'hydromanta',
      nazwa: 'Hydromanta',
      opis: 'Pogłębia więź z dżinnami wody, wzmacniając zaklęcia Wody.',
      poziom_1: {
        zdrowie: '+3', moc: '+1',
        magia: 'Tradycja Wody lub zaklęcie',
        talenty: ['Płynność', 'Wprawny pływak']
      },
      strona_zrodlowa: 87
    },
    iluzjonista: {
      id: 'iluzjonista',
      nazwa: 'Iluzjonista',
      opis: 'Zaciera granice między prawdą a urojeniem magią Iluzji.',
      poziom_1: {
        zdrowie: '+2', moc: '+1',
        jezyki_profesje: { typ: 'wybor', kategorie: ['dowolna'], opis: 'Uczysz się mówić nowym językiem bądź zyskujesz profesję.' },
        magia: 'Tradycja Iluzji lub zaklęcie',
        talenty: ['Wiarygodne iluzje', 'Iluzoryczny duplikat']
      },
      strona_zrodlowa: 88
    },
    infiltrator: {
      id: 'infiltrator',
      nazwa: 'Infiltrator',
      opis: 'Dostaje się w najlepiej strzeżone miejsca dzięki charakteryzacji.',
      poziom_1: {
        percepcja: '+1', zdrowie: '+3',
        jezyki_profesje: { typ: 'wybor', kategorie: ['przestepcze'], opis: 'Uczysz się mówić nowym językiem bądź zyskujesz profesję przestępczą.' },
        talenty: ['Bez twarzy', 'Zdradziecki cios']
      },
      strona_zrodlowa: 88
    },
    inkwizytor: {
      id: 'inkwizytor',
      nazwa: 'Inkwizytor',
      opis: 'Tropi splugawienie i wypleniania niegodziwców w imię wiary.',
      poziom_1: {
        zdrowie: '+3',
        jezyki_profesje: { typ: 'wybor', kategorie: ['dowolna'], opis: 'Uczysz się mówić nowym językiem bądź zyskujesz profesję.' },
        talenty: ['Straszliwa groźba', 'Lustracja']
      },
      strona_zrodlowa: 88
    },
    inzynier: {
      id: 'inzynier',
      nazwa: 'Inżynier',
      opis: 'Zyskuje renomę, konstruując cudowne urządzenia i eidolony.',
      poziom_1: {
        zdrowie: '+3',
        jezyki_profesje: { typ: 'wybor', kategorie: ['naukowe'], opis: 'Uczysz się mówić nowym językiem bądź zyskujesz profesję naukową.' },
        talenty: ['Eidolon', 'Kokpit']
      },
      strona_zrodlowa: 89
    },
    jasnowidz: {
      id: 'jasnowidz',
      nazwa: 'Jasnowidz',
      opis: 'Odkrywa przyszłość, widząc i słysząc odległe miejsca.',
      poziom_1: {
        obrona: '+1', zdrowie: '+1', moc: '+1',
        jezyki_profesje: { typ: 'wybor', kategorie: ['dowolna'], opis: 'Uczysz się mówić nowym językiem bądź zyskujesz profesję.' },
        magia: 'Tradycja Jasnowidzenia lub zaklęcie',
        talenty: ['Omeny', 'Przeczucie']
      },
      strona_zrodlowa: 89
    },
    kapelan: {
      id: 'kapelan',
      nazwa: 'Kapelan',
      opis: 'Zapewnia sojusznikom duchowe przewodnictwo w bitwie.',
      poziom_1: {
        zdrowie: '+4',
        jezyki_profesje: { typ: 'wybor', kategorie: ['wojenne', 'religijne'], opis: 'Uczysz się mówić nowym językiem bądź zyskujesz profesję wojenną lub religijną.' },
        talenty: ['Hymn bitewny', 'Sukurs']
      },
      strona_zrodlowa: 90
    },
    kawalerzysta: {
      id: 'kawalerzysta',
      nazwa: 'Kawalerzysta',
      opis: 'Wykorzystuje przewagę walki z grzbietu wierzchowca.',
      poziom_1: {
        zdrowie: '+5',
        jezyki_profesje: { typ: 'wybor', kategorie: ['pospolite', 'wojenne', 'koczownicze'], opis: 'Uczysz się mówić nowym językiem bądź zyskujesz profesję pospolitą, wojenną lub koczowniczą.' },
        talenty: ['Jeździectwo bojowe', 'Niszczycielska szarża']
      },
      strona_zrodlowa: 90
    },
    klatwiarz: {
      id: 'klatwiarz',
      nazwa: 'Klątwiarz',
      opis: 'Napawa się mocą magii Klątw, pozbawiając wrogów sił życiowych.',
      poziom_1: {
        zdrowie: '+2', moc: '+1',
        jezyki_profesje: { typ: 'wybor', kategorie: ['dowolna'], opis: 'Uczysz się mówić nowym językiem bądź zyskujesz profesję.' },
        magia: 'Tradycja Klątw lub zaklęcie',
        talenty: ['Złe oko', 'Okrutna klątwa']
      },
      strona_zrodlowa: 90
    },
    kowal_run: {
      id: 'kowal_run',
      nazwa: 'Kowal run',
      opis: 'Zdobi broń i zbroję runami nasyconymi magiczną mocą.',
      poziom_1: {
        zdrowie: '+2', moc: '+1',
        jezyki_profesje: { typ: 'wybor', kategorie: ['dowolna'], opis: 'Uczysz się mówić nowym językiem bądź zyskujesz profesję.' },
        magia: 'Tradycja Magii Runicznej lub zaklęcie',
        talenty: ['Pieczęcie mocy', 'Potężne pieczęcie']
      },
      strona_zrodlowa: 90
    },
    lesny_duch: {
      id: 'lesny_duch',
      nazwa: 'Leśny duch',
      opis: 'Zaprzysiężony obrońca dziczy, coraz bardziej przypominający rośliny.',
      poziom_1: {
        zdrowie: '+2', moc: '+1',
        jezyki_profesje: { typ: 'wybor', kategorie: ['koczownicze'], opis: 'Uczysz się mówić nowym językiem bądź zyskujesz profesję koczowniczą.' },
        magia: 'Tradycja Natury lub zaklęcie',
        talenty: ['Potęga natury', 'Dziecię lasu']
      },
      strona_zrodlowa: 91
    },
    lupiezca: {
      id: 'lupiezca',
      nazwa: 'Łupieżca',
      opis: 'Rzuca się w bój z szaleńczym ferworem, nie zważając na niebezpieczeństwo.',
      poziom_1: {
        zdrowie: '+5', predkosc: '+2',
        talenty: ['Potężna szarża', 'Żądza krwi', 'Siła z bólu']
      },
      strona_zrodlowa: 91
    },
    mag_bitewny: {
      id: 'mag_bitewny',
      nazwa: 'Mag bitewny',
      opis: 'Wspomaga umiejętności bojowe zaklęciami Magii Bitewnej.',
      poziom_1: {
        zdrowie: '+2', moc: '+1',
        jezyki_profesje: { typ: 'wybor', kategorie: ['wojenne'], opis: 'Uczysz się mówić nowym językiem bądź zyskujesz profesję wojenną.' },
        magia: 'Tradycja Magii Bitewnej lub zaklęcie',
        talenty: ['Eskalacja przemocy', 'Magia i miecz']
      },
      strona_zrodlowa: 91
    },
    mag_zaglady: {
      id: 'mag_zaglady',
      nazwa: 'Mag zagłady',
      opis: 'Zgłębia mroczne tajniki Sztuk Zakazanych, nie zważając na koszt.',
      poziom_1: {
        zdrowie: '+2', splugawienie: '+1', moc: '+1',
        jezyki_profesje: { typ: 'wybor', kategorie: ['dowolna'], opis: 'Uczysz się mówić nowym językiem bądź zyskujesz profesję.' },
        magia: 'Tradycja Sztuk Zakazanych lub zaklęcie',
        talenty: ['Przerażające gesty', 'Rychła zguba']
      },
      strona_zrodlowa: 92
    },
    magus: {
      id: 'magus',
      nazwa: 'Magus',
      opis: 'Członek sekretnego zgromadzenia, rozpoznawany po magicznym kosturze.',
      poziom_1: {
        zdrowie: '+2', moc: '+1',
        jezyki_profesje: { typ: 'wybor', kategorie: ['naukowe'], opis: 'Uczysz się mówić nowym językiem bądź zyskujesz profesję naukową.' },
        magia: 'Nowa tradycja lub zaklęcie',
        talenty: ['Magiczny kostur', 'Kostur mocy']
      },
      strona_zrodlowa: 92
    },
    medrzec: {
      id: 'medrzec',
      nazwa: 'Mędrzec',
      opis: 'Skupia się na poznawaniu wielu zaklęć kosztem ogólnej Mocy.',
      poziom_1: {
        zdrowie: '+2',
        jezyki_profesje: { typ: 'wybor', kategorie: ['dowolna'], opis: 'Uczysz się mówić nowym językiem bądź zyskujesz profesję.' },
        magia: '2 wybory tradycji/zaklęć',
        talenty: ['Preferowane tradycje']
      },
      strona_zrodlowa: 92
    },
    mistrz_oreza: {
      id: 'mistrz_oreza',
      nazwa: 'Mistrz oręża',
      opis: 'Osiąga prestiżowy status, skupiając szkolenie na jednym rodzaju broni.',
      poziom_1: {
        zdrowie: '+5',
        jezyki_profesje: { typ: 'wybor', kategorie: ['dowolna'], opis: 'Uczysz się mówić nowym językiem bądź zyskujesz profesję.' },
        talenty: ['Ulubiona broń', 'Specjalizacja w broni']
      },
      strona_zrodlowa: 92
    },
    mistrz_przemian: {
      id: 'mistrz_przemian',
      nazwa: 'Mistrz Przemian',
      opis: 'Bada płynną naturę wszechrzeczy magią Przemiany.',
      poziom_1: {
        zdrowie: '+2', moc: '+1',
        jezyki_profesje: { typ: 'wybor', kategorie: ['dowolna'], opis: 'Uczysz się mówić nowym językiem bądź zyskujesz profesję.' },
        magia: 'Tradycja Przemian lub zaklęcie',
        talenty: ['Optymalizacja']
      },
      strona_zrodlowa: 93
    },
    mistrz_sztuk_tajemnych: {
      id: 'mistrz_sztuk_tajemnych',
      nazwa: 'Mistrz Sztuk Tajemnych',
      opis: 'Zgłębia magię Sztuk Tajemnych, by wzmacniać własne zaklęcia.',
      poziom_1: {
        zdrowie: '+2', moc: '+1',
        jezyki_profesje: { typ: 'wybor', kategorie: ['dowolna'], opis: 'Uczysz się mówić nowym językiem bądź zyskujesz profesję.' },
        magia: 'Tradycja Sztuk Tajemnych lub zaklęcie',
        talenty: ['Mistrzostwo w Sztukach Tajemnych', 'Odzyskanie czaru']
      },
      strona_zrodlowa: 93
    },
    mistrz_urokow: {
      id: 'mistrz_urokow',
      nazwa: 'Mistrz Uroków',
      opis: 'Do perfekcji opanowuje magię kontrolującą innych jak marionetki.',
      poziom_1: {
        zdrowie: '+2', moc: '+1',
        jezyki_profesje: { typ: 'wybor', kategorie: ['dowolna'], opis: 'Uczysz się mówić nowym językiem bądź zyskujesz profesję.' },
        magia: 'Tradycja Uroków lub zaklęcie',
        talenty: ['Obrona przed urokami', 'Subtelny urok']
      },
      strona_zrodlowa: 93
    },
    msciciel: {
      id: 'msciciel',
      nazwa: 'Mściciel',
      opis: 'Walczy z niesprawiedliwością, czerpiąc moc z przysiąg zemsty.',
      poziom_1: {
        zdrowie: '+5',
        jezyki_profesje: { typ: 'wybor', kategorie: ['dowolna'], opis: 'Uczysz się mówić nowym językiem bądź zyskujesz profesję.' },
        talenty: ['Przysięga zemsty', 'Gniew mściciela']
      },
      strona_zrodlowa: 94
    },
    myrmidon: {
      id: 'myrmidon',
      nazwa: 'Myrmidon',
      opis: 'Specjalizuje się w walce z użyciem tarczy.',
      poziom_1: {
        zdrowie: '+5',
        jezyki_profesje: { typ: 'wybor', kategorie: ['wojenne'], opis: 'Uczysz się mówić nowym językiem bądź zyskujesz profesję wojenną.' },
        talenty: ['Odepchnięcie tarczą', 'Blok tarczą']
      },
      strona_zrodlowa: 94
    },
    negator: {
      id: 'negator',
      nazwa: 'Negator',
      opis: 'Dąży do mistrzostwa w defensywnej magii Ochrony.',
      poziom_1: {
        zdrowie: '+2', moc: '+1',
        jezyki_profesje: { typ: 'wybor', kategorie: ['dowolna'], opis: 'Uczysz się mówić nowym językiem bądź zyskujesz profesję.' },
        magia: 'Tradycja Ochrony lub zaklęcie',
        talenty: ['Magiczna protekcja', 'Bariera']
      },
      strona_zrodlowa: 94
    },
    nekromanta: {
      id: 'nekromanta',
      nazwa: 'Nekromanta',
      opis: 'Zgłębia mroczną sztukę Nekromancji, zyskując władzę nad śmiercią.',
      poziom_1: {
        zdrowie: '+1', moc: '+1',
        jezyki_profesje: { typ: 'wybor', kategorie: ['naukowe'], opis: 'Uczysz się mówić nowym językiem bądź zyskujesz profesję naukową.' },
        magia: 'Tradycja Nekromancji lub zaklęcie',
        talenty: ['Obyty ze śmiercią', 'Władanie nieumarłymi']
      },
      strona_zrodlowa: 94
    },
    niszczyciel: {
      id: 'niszczyciel',
      nazwa: 'Niszczyciel',
      opis: 'Poskramia ryzykowne czary Zniszczenia, przekierowując ich efekty.',
      poziom_1: {
        zdrowie: '+3', moc: '+1',
        magia: 'Tradycja Zniszczenia lub zaklęcie',
        talenty: ['Okiełznać zniszczenie', 'Doszczętne zniszczenie']
      },
      strona_zrodlowa: 95
    },
    nozownik: {
      id: 'nozownik',
      nazwa: 'Nożownik',
      opis: 'Mistrz walki na ostrza, zadający precyzyjne, krwawiące rany.',
      poziom_1: {
        zdrowie: '+4',
        jezyki_profesje: { typ: 'wybor', kategorie: ['dowolna'], opis: 'Uczysz się mówić nowym językiem bądź zyskujesz profesję.' },
        talenty: ['Krwotok', 'Szybkie cięcie']
      },
      strona_zrodlowa: 95
    },
    obronca: {
      id: 'obronca',
      nazwa: 'Obrońca',
      opis: 'Chroni sojuszników, przyjmując na siebie ciosy przeznaczone dla innych.',
      poziom_1: {
        zdrowie: '+6',
        talenty: ['Asekuracja', 'Cios wyprzedzający', 'Odwet']
      },
      strona_zrodlowa: 95
    },
    odkrywca: {
      id: 'odkrywca',
      nazwa: 'Odkrywca',
      opis: 'Znosi trudy dalekich podróży, nie bacząc na niebezpieczne ekspedycje.',
      poziom_1: {
        percepcja: '+1', zdrowie: '+3', predkosc: '+2',
        jezyki_profesje: { typ: 'wybor', kategorie: ['koczownicze'], opis: 'Uczysz się mówić nowym językiem bądź zyskujesz profesję koczowniczą.' },
        talenty: ['Nadludzkie zmysły', 'Niezłomność', 'Wytchnienie']
      },
      strona_zrodlowa: 96
    },
    pancerniak: {
      id: 'pancerniak',
      nazwa: 'Pancerniak',
      opis: 'Zakuty w ciężki pancerz, niemal niezniszczalny.',
      poziom_1: {
        zdrowie: '+5',
        jezyki_profesje: { typ: 'wybor', kategorie: ['wojenne'], opis: 'Uczysz się mówić nowym językiem bądź zyskujesz profesję wojenną.' },
        talenty: ['Zakuty w stal', 'Niewzruszony', 'Odporność na broń']
      },
      strona_zrodlowa: 96
    },
    piromanta: {
      id: 'piromanta',
      nazwa: 'Piromanta',
      opis: 'Posiada niezrównaną władzę nad żywiołem ognia.',
      poziom_1: {
        zdrowie: '+2', moc: '+1',
        jezyki_profesje: { typ: 'wybor', kategorie: ['dowolna'], opis: 'Uczysz się mówić nowym językiem bądź zyskujesz profesję.' },
        magia: 'Tradycja Ognia lub zaklęcie',
        talenty: ['Błogosławieństwo ognia', 'Zapalające płomienie']
      },
      strona_zrodlowa: 96
    },
    podroznik: {
      id: 'podroznik',
      nazwa: 'Podróżnik',
      opis: 'Opanował magię Teleportacji, przemieszczając się z impetem.',
      poziom_1: {
        zdrowie: '+2', predkosc: '+2', moc: '+1',
        magia: 'Tradycja Teleportacji lub zaklęcie',
        talenty: ['Pośpieszna ucieczka', 'Daleka podróż']
      },
      strona_zrodlowa: 96
    },
    przywolywacz: {
      id: 'przywolywacz',
      nazwa: 'Przywoływacz',
      opis: 'Tworzy potężniejsze i przerażające potwory magią Przywołań.',
      poziom_1: {
        zdrowie: '+2', moc: '+1',
        jezyki_profesje: { typ: 'wybor', kategorie: ['dowolna'], opis: 'Uczysz się mówić nowym językiem bądź zyskujesz profesję.' },
        magia: 'Tradycja Przywołań lub zaklęcie',
        talenty: ['Przywołanie drobnego potwora', 'Potężne wynaturzenia']
      },
      strona_zrodlowa: 97
    },
    rewolwerowiec: {
      id: 'rewolwerowiec',
      nazwa: 'Rewolwerowiec',
      opis: 'Ekspert broni palnej, modyfikujący oręż dla większej celności.',
      poziom_1: {
        zdrowie: '+3',
        jezyki_profesje: { typ: 'wybor', kategorie: ['dowolna'], opis: 'Uczysz się mówić nowym językiem bądź zyskujesz profesję.' },
        talenty: ['Sześciostrzałowiec', 'Sokole oko']
      },
      strona_zrodlowa: 97
    },
    strzelec_wyborowy: {
      id: 'strzelec_wyborowy',
      nazwa: 'Strzelec wyborowy',
      opis: 'Specjalizuje się w łukach i kuszach, oddając strzał za strzałem z celnością.',
      poziom_1: {
        percepcja: '+1', zdrowie: '+4',
        jezyki_profesje: { typ: 'wybor', kategorie: ['dowolna'], opis: 'Uczysz się mówić nowym językiem bądź zyskujesz profesję.' },
        talenty: ['Przycelowanie', 'Perfekcyjny strzał']
      },
      strona_zrodlowa: 97
    },
    szelma: {
      id: 'szelma',
      nazwa: 'Szelma',
      opis: 'Zna się po trochu na wszystkim, nie będąc ekspertem w żadnej dziedzinie.',
      poziom_1: {
        zdrowie: '+3',
        jezyki_profesje: {
          typ: 'oba',
          kategorie: ['dowolna'],
          opis: 'Uczysz się mówić nowym językiem, a także zyskujesz profesję.'
        },
        talenty: ['Biegłość', 'Elastyczne kwalifikacje', 'Magiczne olśnienie']
      },
      strona_zrodlowa: 98
    },
    taumaturg: {
      id: 'taumaturg',
      nazwa: 'Taumaturg',
      opis: 'Wita nieprzewidywalną magię Chaosu z otwartymi ramionami.',
      poziom_1: {
        zdrowie: '+2', moc: '+1',
        jezyki_profesje: { typ: 'wybor', kategorie: ['dowolna'], opis: 'Uczysz się mówić nowym językiem bądź zyskujesz profesję.' },
        magia: 'Tradycja Chaosu lub zaklęcie',
        talenty: ['Okiełznanie chaosu', 'Płynna magia']
      },
      strona_zrodlowa: 98
    },
    technomanta: {
      id: 'technomanta',
      nazwa: 'Technomanta',
      opis: 'Łączy magię i technologię, budując potężne urządzenia.',
      poziom_1: {
        zdrowie: '+2', moc: '+1',
        jezyki_profesje: { typ: 'wybor', kategorie: ['dowolna'], opis: 'Uczysz się mówić nowym językiem bądź zyskujesz profesję.' },
        magia: 'Tradycja Technomancji lub zaklęcie',
        talenty: ['Wynalazek', 'Ożywienie obiektu']
      },
      strona_zrodlowa: 98
    },
    templariusz: {
      id: 'templariusz',
      nazwa: 'Templariusz',
      opis: 'Strzeże ważnych dla wiary miejsc i przedmiotów przed profanatorami.',
      poziom_1: {
        percepcja: '+1', zdrowie: '+4',
        jezyki_profesje: { typ: 'wybor', kategorie: ['religijne'], opis: 'Uczysz się mówić nowym językiem bądź zyskujesz profesję religijną.' },
        talenty: ['Bastion wiary', 'Strażnik świątyni']
      },
      strona_zrodlowa: 99
    },
    tenebrysta: {
      id: 'tenebrysta',
      nazwa: 'Tenebrysta',
      opis: 'Przyjmuje wszystkie dary Cienia, mimo złowieszczej reputacji tej magii.',
      poziom_1: {
        zdrowie: '+2', moc: '+1',
        jezyki_profesje: { typ: 'wybor', kategorie: ['dowolna'], opis: 'Uczysz się mówić nowym językiem bądź zyskujesz profesję.' },
        magia: 'Tradycja Cienia lub zaklęcie',
        talenty: ['Cienisty płaszcz', 'Cienista postać']
      },
      strona_zrodlowa: 99
    },
    teurg: {
      id: 'teurg',
      nazwa: 'Teurg',
      opis: 'Posiada bezpośrednią więź z Nowym Bogiem, na którego moc się powołuje.',
      poziom_1: {
        zdrowie: '+2', moc: '+1',
        jezyki_profesje: { typ: 'wybor', kategorie: ['religijne'], opis: 'Uczysz się mówić nowym językiem bądź zyskujesz profesję religijną.' },
        magia: 'Tradycja Teurgii lub zaklęcie',
        talenty: ['Rozkwit wiary', 'Inwokacja']
      },
      strona_zrodlowa: 99
    },
    truciciel: {
      id: 'truciciel',
      nazwa: 'Truciciel',
      opis: 'Wyrabia najbardziej śmiercionośne trucizny, zdolne powalić każdego.',
      poziom_1: {
        zdrowie: '+2',
        jezyki_profesje: { typ: 'wybor', kategorie: ['dowolna'], opis: 'Uczysz się mówić nowym językiem bądź zyskujesz profesję.' },
        talenty: ['Mistrz trucizn', 'Zatruty dotyk']
      },
      strona_zrodlowa: 100
    },
    uzdrowiciel: {
      id: 'uzdrowiciel',
      nazwa: 'Uzdrowiciel',
      opis: 'Poświęca się bez reszty pomaganiu innym magią Życia.',
      poziom_1: {
        zdrowie: '+4', moc: '+1',
        magia: 'Tradycja Życia lub zaklęcie',
        talenty: ['Leczenie na odległość', 'Wzmocnione leczenie', 'Siła życiowa']
      },
      strona_zrodlowa: 100
    },
    wartownik: {
      id: 'wartownik',
      nazwa: 'Wartownik',
      opis: 'Wyostrzone zmysły pozwalają mu wykrywać to, co niedostrzegalne.',
      poziom_1: {
        percepcja: '+1', zdrowie: '+5',
        talenty: ['Świadomość otoczenia', 'Warta']
      },
      strona_zrodlowa: 100
    },
    wladca_bestii: {
      id: 'wladca_bestii',
      nazwa: 'Władca bestii',
      opis: 'Tworzy więzi z zauroczonymi zwierzętami dzięki Magii Pierwotnej.',
      poziom_1: {
        zdrowie: '+2', moc: '+1',
        jezyki_profesje: { typ: 'wybor', kategorie: ['koczownicze'], opis: 'Uczysz się mówić nowym językiem bądź zyskujesz profesję koczowniczą.' },
        magia: 'Tradycja Magii Pierwotnej lub zaklęcie',
        talenty: ['Pierwotna bestia', 'Pierwotna więź', 'Pierwotna potęga']
      },
      strona_zrodlowa: 101
    },
    wladca_burz: {
      id: 'wladca_burz',
      nazwa: 'Władca burz',
      opis: 'Kontroluje moc nawałnicy, ciskając pioruny i wywołując grzmoty.',
      poziom_1: {
        zdrowie: '+2', predkosc: '+2', moc: '+1',
        jezyki_profesje: { typ: 'wybor', kategorie: ['dowolna'], opis: 'Uczysz się mówić nowym językiem bądź zyskujesz profesję.' },
        magia: 'Tradycja Burzy lub zaklęcie',
        talenty: ['Błysk przed oczami', 'Siła nawałnicy']
      },
      strona_zrodlowa: 101
    },
    zabijaka: {
      id: 'zabijaka',
      nazwa: 'Zabijaka',
      opis: 'Preferuje wielką, ciężką broń, zdolną wyrządzać poważne szkody.',
      poziom_1: {
        zdrowie: '+6',
        talenty: ['Brutalny zamach', 'Góra trupów']
      },
      strona_zrodlowa: 101
    },
    zdobywca: {
      id: 'zdobywca',
      nazwa: 'Zdobywca',
      opis: 'Urodzony dowódca, kierujący sojusznikami dla taktycznej korzyści.',
      poziom_1: {
        zdrowie: '+5',
        jezyki_profesje: { typ: 'wybor', kategorie: ['wojenne'], opis: 'Uczysz się mówić nowym językiem bądź zyskujesz profesję wojenną.' },
        talenty: ['Rozkaz ataku', 'Manewr taktyczny', 'Dowodzenie bitwą']
      },
      strona_zrodlowa: 101
    },
    zelota: {
      id: 'zelota',
      nazwa: 'Zelota',
      opis: 'Wędrowny kaznodzieja, odmawiający sobie wygód, by zbliżyć się do bogów.',
      poziom_1: {
        zdrowie: '+6',
        jezyki_profesje: { typ: 'wybor', kategorie: ['religijne'], opis: 'Uczysz się mówić nowym językiem bądź zyskujesz profesję religijną.' },
        talenty: ['Żarliwość', 'Niepohamowany obłęd']
      },
      strona_zrodlowa: 102
    },
    zmiennoksztaltny: {
      id: 'zmiennoksztaltny',
      nazwa: 'Zmiennokształtny',
      opis: 'Przybiera potężniejsze formy dzięki znajomości magii Transformacji.',
      poziom_1: {
        zdrowie: '+2', moc: '+1',
        jezyki_profesje: { typ: 'wybor', kategorie: ['dowolna'], opis: 'Uczysz się mówić nowym językiem bądź zyskujesz profesję.' },
        magia: 'Tradycja Transformacji lub zaklęcie',
        talenty: ['Ulepszona transformacja', 'Przyspieszenie transformacji']
      },
      strona_zrodlowa: 102
    }
  }
};

export default PATHS;
