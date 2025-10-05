/**
 * Ścieżki postaci - system progresji
 * Źródło: Podręcznik główny + suplementy
 */

const PATHS = {
  // Ścieżki nowicjuszy
  sciezki_nowicjuszy: {
    wojownik: {
      id: 'wojownik',
      nazwa: 'Wojownik', 
      opis: 'Mistrz broni i walki, specjalizuje się w zadawaniu i przyjmowaniu obrażeń.',
      poziom_1: {
        zdrowie: '+5',
        talenty: ['Walka bronią', 'Blok tarczą']
      },
      poziom_2: {
        zdrowie: '+5',
        talent: 'Atak okazji'
      },
      poziom_5: {
        zdrowie: '+5', 
        talent: 'Seria ataków'
      },
      strona_zrodlowa: 52
    },

    mag: {
      id: 'mag',
      nazwa: 'Mag',
      opis: 'Użytkownik magii, posiadający dostęp do zaklęć różnych tradycji.',
      poziom_1: {
        moc: '+1',
        magia: 'Jedna tradycja magiczna + 1 zaklęcie',
        talenty: ['Kontratakt', 'Zaklęcie mocy']
      },
      poziom_2: {
        moc: '+1',
        talent: 'Dodatkowe zaklęcie'
      },
      poziom_5: {
        moc: '+1',
        talent: 'Mistrz magii'
      },
      strona_zrodlowa: 56
    },

    kapłan: {
      id: 'kapłan',
      nazwa: 'Kapłan',
      opis: 'Sługus bogów, posiadający moc uzdrawiania i błogosławieństw.',
      poziom_1: {
        moc: '+1',
        magia: 'Jedna tradycja magiczna + 1 zaklęcie',
        talenty: ['Uzdrawianie', 'Błogosławieństwo']
      },
      poziom_2: {
        moc: '+1',
        talent: 'Dodatkowe zaklęcie'
      },
      poziom_5: {
        moc: '+1',
        talent: 'Mistrz kapłaństwa'
      },
      strona_zrodlowa: 60
    },

    łotr: {
      id: 'łotr',
      nazwa: 'Łotr',
      opis: 'Złodziej i szpieg, specjalizujący się w skradaniu się i unikaniu.',
      poziom_1: {
        zdrowie: '+3',
        talenty: ['Skradanie się', 'Złodziejstwo']
      },
      poziom_2: {
        zdrowie: '+3',
        talent: 'Atak z zaskoczenia'
      },
      poziom_5: {
        zdrowie: '+3',
        talent: 'Mistrz łotrowstwa'
      },
      strona_zrodlowa: 64
    }
  },

  // Ścieżki ekspertów (przykładowe - do rozszerzenia)
  sciezki_ekspertow: {
    berserker: {
      id: 'berserker',
      nazwa: 'Berserker',
      opis: 'Wojownik ogarnięty furią, zadający większe obrażenia.',
      poziom_1: {
        zdrowie: '+6',
        talent: 'Furia'
      },
      poziom_2: {
        zdrowie: '+6',
        talent: 'Niepohamowana wściekłość'
      },
      poziom_5: {
        zdrowie: '+6',
        talent: 'Mistrz furii'
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
      poziom_2: {
        moc: '+2',
        talent: 'Zaklęcia niszczące'
      },
      poziom_5: {
        moc: '+2',
        talent: 'Arcymag'
      },
      strona_zrodlowa: 104
    }
  },

  // Ścieżki mistrzów (przykładowe - do rozszerzenia)
  sciezki_mistrzow: {
    paladyn: {
      id: 'paladyn',
      nazwa: 'Paladyn',
      opis: 'Święty wojownik, łączący siłę fizyczną z mocą bożą.',
      poziom_1: {
        zdrowie: '+8',
        moc: '+1',
        talent: 'Święte uderzenie'
      },
      poziom_2: {
        zdrowie: '+8',
        moc: '+1',
        talent: 'Aura ochronna'
      },
      poziom_5: {
        zdrowie: '+8',
        moc: '+1',
        talent: 'Mistrz świętości'
      },
      strona_zrodlowa: 150
    }
  },

  // Ścieżki legend (przykładowe - do rozszerzenia)
  sciezki_legend: {
    arcymag: {
      id: 'arcymag',
      nazwa: 'Arcymag',
      opis: 'Mistrz wszystkich tradycji magicznych, posiadający niesamowitą moc.',
      poziom_1: {
        moc: '+3',
        talent: 'Wszystkie tradycje'
      },
      poziom_2: {
        moc: '+3',
        talent: 'Tworzenie zaklęć'
      },
      poziom_5: {
        moc: '+3',
        talent: 'Mistrz magii'
      },
      strona_zrodlowa: 200
    }
  }
};

module.exports = PATHS;
