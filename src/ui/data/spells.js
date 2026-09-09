/**
 * Zaklęcia i magia
 * Źródło: Podręcznik główny + suplementy
 */

const SPELLS = {
  // Tradycje magiczne
  tradycje: {
    animizm: {
      id: 'animizm',
      nazwa: 'Animizm',
      opis: 'Magia związana z duchami i naturą.',
      poziom_0: ['Przywołanie zwierzęcia', 'Rozmowa z naturą'],
      poziom_1: ['Przywołanie wilka', 'Uzdrowienie lekkie'],
      poziom_2: ['Przywołanie niedźwiedzia', 'Uzdrowienie średnie'],
      poziom_3: ['Przywołanie smoka', 'Uzdrowienie poważne'],
      poziom_4: ['Przywołanie ducha natury', 'Uzdrowienie krytyczne']
    },

    chaos: {
      id: 'chaos',
      nazwa: 'Chaos',
      opis: 'Nieprzewidywalna magia chaotyczna.',
      poziom_0: ['Chaos błysk', 'Losowy efekt'],
      poziom_1: ['Chaos wybuch', 'Chaotyczne błogosławieństwo'],
      poziom_2: ['Chaos burza', 'Chaotyczne przekleństwo'],
      poziom_3: ['Chaos apokalipsa', 'Chaotyczna transformacja'],
      poziom_4: ['Chaos końca', 'Chaotyczna nieśmiertelność']
    },

    śmierć: {
      id: 'śmierć',
      nazwa: 'Śmierć',
      opis: 'Magia związana ze śmiercią i umarłymi.',
      poziom_0: ['Wykrywanie umarłych', 'Rozmowa z duchami'],
      poziom_1: ['Przywołanie szkieleta', 'Obrażenia śmierci'],
      poziom_2: ['Przywołanie zombie', 'Kontrola umarłych'],
      poziom_3: ['Przywołanie licza', 'Masa śmierci'],
      poziom_4: ['Przywołanie demona śmierci', 'Apokalipsa umarłych']
    },

    iluzja: {
      id: 'iluzja',
      nazwa: 'Iluzja',
      opis: 'Magia tworząca złudzenia i iluzje.',
      poziom_0: ['Mała iluzja', 'Ukrycie dźwięku'],
      poziom_1: ['Iluzja obrazu', 'Niewidzialność'],
      poziom_2: ['Iluzja dźwięku', 'Halucynacje'],
      poziom_3: ['Iluzja dotyku', 'Masa iluzji'],
      poziom_4: ['Iluzja rzeczywistości', 'Mistrz iluzji']
    },

    życie: {
      id: 'życie',
      nazwa: 'Życie',
      opis: 'Magia uzdrawiania i przywracania życia.',
      poziom_0: ['Leczenie lekkie', 'Wykrywanie choroby'],
      poziom_1: ['Leczenie średnie', 'Uzdrowienie choroby'],
      poziom_2: ['Leczenie poważne', 'Wskrzeszenie'],
      poziom_3: ['Leczenie krytyczne', 'Masowe uzdrowienie'],
      poziom_4: ['Leczenie masowe', 'Prawdziwe wskrzeszenie']
    },

    natury: {
      id: 'natury',
      nazwa: 'Natury',
      opis: 'Magia związana z siłami natury.',
      poziom_0: ['Rozmowa z roślinami', 'Wyczuwanie zwierząt'],
      poziom_1: ['Kontrola roślin', 'Przywołanie burzy'],
      poziom_2: ['Transformacja w zwierzę', 'Kontrola pogody'],
      poziom_3: ['Transformacja w drzewo', 'Masa natury'],
      poziom_4: ['Transformacja w smoka', 'Mistrz natury']
    },

    ochrony: {
      id: 'ochrony',
      nazwa: 'Ochrony',
      opis: 'Magia obronna i ochronna.',
      poziom_0: ['Tarcza mniejsza', 'Wykrywanie magii'],
      poziom_1: ['Tarcza większa', 'Ochrona przed magią'],
      poziom_2: ['Tarcza masowa', 'Ochrona przed śmiercią'],
      poziom_3: ['Tarcza niezniszczalna', 'Ochrona przed demonami'],
      poziom_4: ['Tarcza absolutna', 'Mistrz ochrony']
    },

    telekinezy: {
      id: 'telekinezy',
      nazwa: 'Telekinezy',
      opis: 'Magia kontroli umysłu i ruchu.',
      poziom_0: ['Ruch mały', 'Czytanie myśli'],
      poziom_1: ['Ruch średni', 'Kontrola umysłu'],
      poziom_2: ['Ruch duży', 'Lot'],
      poziom_3: ['Ruch masowy', 'Kontrola masowa'],
      poziom_4: ['Ruch absolutny', 'Mistrz telekinezy']
    },

    transformacji: {
      id: 'transformacji',
      nazwa: 'Transformacji',
      opis: 'Magia zmiany formy i właściwości.',
      poziom_0: ['Mała transformacja', 'Zmiana koloru'],
      poziom_1: ['Transformacja kształtu', 'Zmiana rozmiaru'],
      poziom_2: ['Transformacja materiału', 'Zmiana właściwości'],
      poziom_3: ['Transformacja masowa', 'Zmiana rzeczywistości'],
      poziom_4: ['Transformacja absolutna', 'Mistrz transformacji']
    },

    wojny: {
      id: 'wojny',
      nazwa: 'Wojny',
      opis: 'Magia wojenna i bojowa.',
      poziom_0: ['Wykrywanie wroga', 'Wzmocnienie ataku'],
      poziom_1: ['Przywołanie broni', 'Błogosławieństwo wojny'],
      poziom_2: ['Przywołanie armii', 'Kontrola bitwy'],
      poziom_3: ['Przywołanie tytana', 'Masa wojny'],
      poziom_4: ['Przywołanie boga wojny', 'Mistrz wojny']
    }
  },

  // Szczegółowe zaklęcia
  zaklecia: {
    'przywołanie zwierzęcia': {
      id: 'przywołanie zwierzęcia',
      nazwa: 'Przywołanie zwierzęcia',
      tradycja: 'animizm',
      poziom: 0,
      koszt: 0,
      czas_rzucania: '1 akcja',
      zasieg: '30 stóp',
      czas_trwania: '1 godzina',
      opis: 'Przywołuje małe zwierzę, które wykonuje jedno polecenie.'
    },

    'przywołanie wilka': {
      id: 'przywołanie wilka',
      nazwa: 'Przywołanie wilka',
      tradycja: 'animizm',
      poziom: 1,
      koszt: 1,
      czas_rzucania: '1 akcja',
      zasieg: '30 stóp',
      czas_trwania: '1 godzina',
      opis: 'Przywołuje wilka, który walczy po Twojej stronie.'
    },

    'leczenie lekkie': {
      id: 'leczenie lekkie',
      nazwa: 'Leczenie lekkie',
      tradycja: 'życie',
      poziom: 0,
      koszt: 0,
      czas_rzucania: '1 akcja',
      zasieg: 'Dotyk',
      czas_trwania: 'Natychmiastowe',
      opis: 'Przywraca 1k6 punktów zdrowia.'
    },

    'leczenie średnie': {
      id: 'leczenie średnie',
      nazwa: 'Leczenie średnie',
      tradycja: 'życie',
      poziom: 1,
      koszt: 1,
      czas_rzucania: '1 akcja',
      zasieg: 'Dotyk',
      czas_trwania: 'Natychmiastowe',
      opis: 'Przywraca 2k6 punktów zdrowia.'
    },

    'tarcza mniejsza': {
      id: 'tarcza mniejsza',
      nazwa: 'Tarcza mniejsza',
      tradycja: 'ochrony',
      poziom: 0,
      koszt: 0,
      czas_rzucania: '1 akcja',
      zasieg: 'Osobiste',
      czas_trwania: '1 minuta',
      opis: 'Tworzy magiczną tarczę dającą +1 do obrony.'
    },

    'tarcza większa': {
      id: 'tarcza większa',
      nazwa: 'Tarcza większa',
      tradycja: 'ochrony',
      poziom: 1,
      koszt: 1,
      czas_rzucania: '1 akcja',
      zasieg: 'Osobiste',
      czas_trwania: '10 minut',
      opis: 'Tworzy magiczną tarczę dającą +2 do obrony.'
    },

    'chaos błysk': {
      id: 'chaos błysk',
      nazwa: 'Chaos błysk',
      tradycja: 'chaos',
      poziom: 0,
      koszt: 0,
      czas_rzucania: '1 akcja',
      zasieg: '60 stóp',
      czas_trwania: 'Natychmiastowe',
      opis: 'Wystrzeliwuje chaotyczny błysk zadający 1k4 obrażeń.'
    },

    'chaos wybuch': {
      id: 'chaos wybuch',
      nazwa: 'Chaos wybuch',
      tradycja: 'chaos',
      poziom: 1,
      koszt: 1,
      czas_rzucania: '1 akcja',
      zasieg: '30 stóp',
      czas_trwania: 'Natychmiastowe',
      opis: 'Wybuch chaosu zadający 2k6 obrażeń w promieniu 10 stóp.'
    }
  }
};

export default SPELLS;
