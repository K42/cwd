/**
 * Ścieżki postaci - system progresji
 * Źródło: Podręcznik główny + suplementy
 */

const PATHS = {
  // Ścieżki nowicjuszy - zgodne z Podręcznikiem Głównym
  sciezki_nowicjuszy: {
    kleryk: {
      id: 'kleryk',
      nazwa: 'Kleryk',
      opis: 'Sługa bóstwa, leczy i wspiera sojuszników.',
      poziom_1: {
        zdrowie: '+3',
        magia: '3 wybory tradycji/zaklęć',
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
        talent: 'Boskie uderzenie'
      },
      poziom_8: {
        zdrowie: '+4',
        magia: '1 wybór'
      },
      strona_zrodlowa: 58
    },

    lotr: {
      id: 'lotr',
      nazwa: 'Łotr',
      opis: 'Skrytobójca i złodziej, specjalizujący się w atakach z zaskoczenia.',
      poziom_1: {
        zdrowie: '+3',
        jezyki_profesje: '1 język lub profesja',
        talenty: ['Szybka odnowa', 'Podstęp']
      },
      poziom_2: {
        zdrowie: '+3',
        talent: 'Wykorzystanie okazji'
      },
      poziom_5: {
        zdrowie: '+3',
        talent: 'Nieczyste zagrania'
      },
      poziom_8: {
        zdrowie: '+3',
        talent: 'Łotrowski talent'
      },
      strona_zrodlowa: 59
    },

    mag: {
      id: 'mag',
      nazwa: 'Mag',
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
        jezyki_profesje: 'Profesja naukowa, czytanie/pisanie',
        magia: '1 tradycja + 3 wybory',
        talenty: ['Sztuczki', 'Wyczucie magii']
      },
      poziom_2: {
        zdrowie: '+2',
        magia: '2 wybory'
      },
      poziom_5: {
        zdrowie: '+2',
        moc: '+1',
        magia: '1 wybór',
        talent: 'Kontrmagia'
      },
      poziom_8: {
        zdrowie: '+2',
        magia: '1 wybór',
        talent: 'Udoskonalone odzyskanie zaklęcia'
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
        jezyki_profesje: '1 profesja',
        talenty: ['Chwila wytchnienia', 'Wyszkolenie w walce']
      },
      poziom_2: {
        zdrowie: '+5',
        talent: 'Sprawność bojowa'
      },
      poziom_5: {
        obrona: '+1',
        zdrowie: '+5',
        talent: 'Doświadczenie bojowe'
      },
      poziom_8: {
        zdrowie: '+5',
        talent: 'Wytrwałość'
      },
      strona_zrodlowa: 56
    }
  },

  // Ścieżki ekspertów (poziom 3)
  sciezki_ekspertow: {
    berserker: {
      id: 'berserker',
      nazwa: 'Berserker',
      opis: 'Wojownik ogarnięty furią, zadający większe obrażenia.',
      poziom_1: {
        zdrowie: '+6',
        talent: 'Furia'
      },
      strona_zrodlowa: 100
    },

    czarodziej: {
      id: 'czarodziej',
      nazwa: 'Czarodziej',
      opis: 'Mistrz magii ofensywnej, specjalizujący się w zaklęciach niszczących.',
      poziom_1: {
        moc: '+2',
        talent: 'Moc magiczna'
      },
      strona_zrodlowa: 104
    },

    uzdrowiciel: {
      id: 'uzdrowiciel',
      nazwa: 'Uzdrowiciel',
      opis: 'Kapłan specjalizujący się w uzdrawianiu i ochronie.',
      poziom_1: {
        moc: '+2',
        talent: 'Wzmocnione uzdrawianie'
      },
      strona_zrodlowa: 108
    },

    zabojca: {
      id: 'zabojca',
      nazwa: 'Zabójca',
      opis: 'Łotr specjalizujący się w zabójstwach i atakach z zaskoczenia.',
      poziom_1: {
        zdrowie: '+4',
        talent: 'Atak z zaskoczenia'
      },
      strona_zrodlowa: 112
    },

    strzelec: {
      id: 'strzelec',
      nazwa: 'Strzelec',
      opis: 'Wojownik specjalizujący się w broni dystansowej.',
      poziom_1: {
        zdrowie: '+5',
        talent: 'Celny strzał'
      },
      strona_zrodlowa: 116
    },

    iluzjonista: {
      id: 'iluzjonista',
      nazwa: 'Iluzjonista',
      opis: 'Mag specjalizujący się w zaklęciach iluzji.',
      poziom_1: {
        moc: '+2',
        talent: 'Mistrz iluzji'
      },
      strona_zrodlowa: 120
    },

    paladyn: {
      id: 'paladyn',
      nazwa: 'Paladyn',
      opis: 'Kapłan wojownik, łączący siłę fizyczną z mocą bożą.',
      poziom_1: {
        zdrowie: '+6',
        moc: '+1',
        talent: 'Święte uderzenie'
      },
      strona_zrodlowa: 124
    },

    szpieg: {
      id: 'szpieg',
      nazwa: 'Szpieg',
      opis: 'Łotr specjalizujący się w szpiegowstwie i infiltracji.',
      poziom_1: {
        zdrowie: '+4',
        talent: 'Mistrz szpiegostwa'
      },
      strona_zrodlowa: 128
    }
  },

  // Ścieżki mistrzów (poziom 5)
  sciezki_mistrzow: {
    barbarzynca: {
      id: 'barbarzynca',
      nazwa: 'Barbarzyńca',
      opis: 'Berserker z dzikich krain, niezwykle wytrzymały.',
      poziom_1: {
        zdrowie: '+8',
        talent: 'Dzika furia'
      },
      strona_zrodlowa: 150
    },

    arcymag: {
      id: 'arcymag',
      nazwa: 'Arcymag',
      opis: 'Czarodziej posiadający dostęp do wielu tradycji magicznych.',
      poziom_1: {
        moc: '+3',
        talent: 'Wielkie zaklęcia'
      },
      strona_zrodlowa: 154
    },

    swiety: {
      id: 'swiety',
      nazwa: 'Święty',
      opis: 'Uzdrowiciel o wielkiej mocy bożej.',
      poziom_1: {
        moc: '+3',
        talent: 'Cuda uzdrawiania'
      },
      strona_zrodlowa: 158
    },

    cien: {
      id: 'cien',
      nazwa: 'Cień',
      opis: 'Zabójca o nadprzyrodzonych zdolnościach.',
      poziom_1: {
        zdrowie: '+6',
        talent: 'Niewidzialność'
      },
      strona_zrodlowa: 162
    },

    mistrz_luku: {
      id: 'mistrz_luku',
      nazwa: 'Mistrz Łuku',
      opis: 'Strzelec o niezwykłej precyzji.',
      poziom_1: {
        zdrowie: '+7',
        talent: 'Szybki strzał'
      },
      strona_zrodlowa: 166
    },

    mistrz_iluzji: {
      id: 'mistrz_iluzji',
      nazwa: 'Mistrz Iluzji',
      opis: 'Iluzjonista tworzący rzeczywiste złudzenia.',
      poziom_1: {
        moc: '+3',
        talent: 'Rzeczywiste iluzje'
      },
      strona_zrodlowa: 170
    },

    mistrz_swiatla: {
      id: 'mistrz_swiatla',
      nazwa: 'Mistrz Światła',
      opis: 'Paladyn o wielkiej mocy świętej.',
      poziom_1: {
        zdrowie: '+8',
        moc: '+2',
        talent: 'Aura świętości'
      },
      strona_zrodlowa: 174
    },

    mistrz_cienia: {
      id: 'mistrz_cienia',
      nazwa: 'Mistrz Cienia',
      opis: 'Szpieg o nadprzyrodzonych zdolnościach.',
      poziom_1: {
        zdrowie: '+6',
        talent: 'Przechodzenie przez cienie'
      },
      strona_zrodlowa: 178
    }
  },

  // Ścieżki legend (poziom 7)
  sciezki_legend: {
    wladca_wojny: {
      id: 'wladca_wojny',
      nazwa: 'Władca Wojny',
      opis: 'Barbarzyńca o legendarnych umiejętnościach bojowych.',
      poziom_1: {
        zdrowie: '+10',
        talent: 'Władca bitew'
      },
      strona_zrodlowa: 200
    },

    wladca_magii: {
      id: 'wladca_magii',
      nazwa: 'Władca Magii',
      opis: 'Arcymag posiadający wiedzę o wszystkich tradycjach.',
      poziom_1: {
        moc: '+4',
        talent: 'Mistrz wszystkich tradycji'
      },
      strona_zrodlowa: 204
    },

    wladca_zycia: {
      id: 'wladca_zycia',
      nazwa: 'Władca Życia',
      opis: 'Święty o mocy wskrzeszania zmarłych.',
      poziom_1: {
        moc: '+4',
        talent: 'Wskrzeszanie'
      },
      strona_zrodlowa: 208
    },

    wladca_smierci: {
      id: 'wladca_smierci',
      nazwa: 'Władca Śmierci',
      opis: 'Cień o mocy zabijania jednym spojrzeniem.',
      poziom_1: {
        zdrowie: '+8',
        talent: 'Dotyk śmierci'
      },
      strona_zrodlowa: 212
    },

    wladca_luku: {
      id: 'wladca_luku',
      nazwa: 'Władca Łuku',
      opis: 'Mistrz łuku strzelający przez czas i przestrzeń.',
      poziom_1: {
        zdrowie: '+9',
        talent: 'Strzał przez wymiary'
      },
      strona_zrodlowa: 216
    },

    wladca_iluzji: {
      id: 'wladca_iluzji',
      nazwa: 'Władca Iluzji',
      opis: 'Mistrz iluzji tworzący alternatywne rzeczywistości.',
      poziom_1: {
        moc: '+4',
        talent: 'Tworzenie rzeczywistości'
      },
      strona_zrodlowa: 220
    },

    wladca_swiatla: {
      id: 'wladca_swiatla',
      nazwa: 'Władca Światła',
      opis: 'Mistrz światła o boskiej mocy.',
      poziom_1: {
        zdrowie: '+10',
        moc: '+3',
        talent: 'Boska moc'
      },
      strona_zrodlowa: 224
    },

    wladca_cienia: {
      id: 'wladca_cienia',
      nazwa: 'Władca Cienia',
      opis: 'Mistrz cienia o mocy panowania nad ciemnością.',
      poziom_1: {
        zdrowie: '+8',
        talent: 'Panowanie nad ciemnością'
      },
      strona_zrodlowa: 228
    }
  },

  // Ścieżki kontynuacji (poziomy 2, 4, 6, 8)
  sciezki_kontynuacji: {
    kontynuacja_nowicjusza: {
      id: 'kontynuacja_nowicjusza',
      nazwa: 'Kontynuacja Nowicjusza',
      opis: 'Dalszy rozwój ścieżki nowicjusza.',
      poziom_1: {
        zdrowie: '+3',
        talent: 'Dodatkowy talent nowicjusza'
      },
      strona_zrodlowa: 52
    },

    kontynuacja_eksperta: {
      id: 'kontynuacja_eksperta',
      nazwa: 'Kontynuacja Eksperta',
      opis: 'Dalszy rozwój ścieżki eksperta.',
      poziom_1: {
        zdrowie: '+4',
        talent: 'Dodatkowy talent eksperta'
      },
      strona_zrodlowa: 104
    },

    kontynuacja_mistrza: {
      id: 'kontynuacja_mistrza',
      nazwa: 'Kontynuacja Mistrza',
      opis: 'Dalszy rozwój ścieżki mistrza.',
      poziom_1: {
        zdrowie: '+5',
        talent: 'Dodatkowy talent mistrza'
      },
      strona_zrodlowa: 154
    },

    kontynuacja_legendy: {
      id: 'kontynuacja_legendy',
      nazwa: 'Kontynuacja Legendy',
      opis: 'Dalszy rozwój ścieżki legendy.',
      poziom_1: {
        zdrowie: '+6',
        talent: 'Dodatkowy talent legendy'
      },
      strona_zrodlowa: 204
    }
  }
};

module.exports = PATHS;
