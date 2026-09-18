/**
 * Opisy talentów przyznawanych przez ścieżki i pochodzenia
 */

const TALENT_DESCRIPTIONS = {
  'Modlitwa': 'Możesz użyć akcji, by uleczyć tyle obrażeń, ile wynosi twoja Szybkość Zdrowienia.',
  'Wspólna odnowa': 'Gdy leczysz siebie, możesz uleczyć dodatkowe obrażenia równe twojej Szybkości Zdrowienia u sojusznika w zasięgu 1,5 metra.',
  'Szybka odnowa': 'Możesz użyć akcji, by uleczyć tyle obrażeń, ile wynosi twoja Szybkość Zdrowienia.',
  'Podstęp': 'Ataki z zaskoczenia zadają dodatkowe obrażenia równe twojej Zręczności.',
  'Wykorzystanie okazji': 'Gdy atakujesz z zaskoczenia, możesz wykonać dodatkowy atak.',
  'Nieczyste zagrania': 'Możesz wykonać atak z zaskoczenia jako reakcja.',
  'Furia': 'Gdy twoje Zdrowie spadnie poniżej połowy maksymalnej wartości, wszystkie twoje ataki zadają dodatkowe obrażenia równe twojej Sile.',
  'Wysokie obroty': 'Możesz wykonać dodatkową akcję w swojej turze. Po wykorzystaniu tego talentu musisz odbyć pełny odpoczynek, zanim zdołasz użyć go ponownie.',
  'Determinacja': 'Gdy wyrzucisz 1 na kości ułatwienia, możesz rzucić ponownie i wybrać, którego wyniku użyć.',
  'Odskok': 'Gdy stworzenie, które widzisz, chybi, atakując twoją Obronę lub Zręczność, możesz użyć reakcji, by wykonać odwrót.',
  'Nie do zdarcia': 'Możesz użyć akcji, by uleczyć tyle obrażeń, ile wynosi twoja Szybkość Zdrowienia, a także pozbyć się jednego z następujących stanów: wyczerpanie, osłabienie lub zatrucie.',
  'Prymat sobowtóra': 'W trakcie swojej tury możesz użyć Kradzieży tożsamości jako reakcji. Ponadto gdy skradniesz tożsamość jakiejś istoty, to dopóki naśladujesz jej wygląd, wszelkie ataki przeciw niej wykonujesz z 1 ułatwieniem.',
  'Kontrolowany szał': 'Możesz wpaść w szał bojowy jako akcję. W szał bojowy otrzymujesz +2 do ataków, ale -2 do Obrony. Szał trwa do końca walki lub do momentu, gdy zdecydujesz się go zakończyć jako akcję.',
  'Boskie uderzenie': 'Możesz użyć akcji, by twoje następne uderzenie zadaje dodatkowe obrażenia równe twojej Woli.',
  'Barbarzyński szał': 'Możesz wpaść w szał bojowy jako akcję. W szał bojowy otrzymujesz +2 do ataków, ale -2 do Obrony. Szał trwa do końca walki lub do momentu, gdy zdecydujesz się go zakończyć jako akcję.',
  'Boska ekstaza': 'Możesz wykorzystać akcję, by osiągnąć stan boskiej ekstazy, który trwa 1 minutę. W tym czasie zyskujesz +10 Zdrowia, jesteś niewrażliwy na zauroczenie, zniewolenie i przestraszenie, a także nie możesz otrzymywać punktów Szaleństwa.',
  'Skrytobójstwo': 'Gdy istota zaskoczona lub taka, przed którą jesteś ukryty, otrzymuje obrażenia wskutek twojego ataku, musi wykonać test Siły (z 1 ułatwieniem za każdy Rozmiar, o który jest od ciebie większa). Porażka oznacza, że otrzymuje obrażenia równe swojemu Zdrowiu.',
  'Wprawna charakteryzacja': 'Jeśli masz zestaw do charakteryzacji, możesz wykorzystać akcję i jedno użycie zestawu, by zmienić swój wygląd.',
  'Czujność': 'Zyskujesz 1 ułatwienie we wszystkich testach Percepcji. Dodatkowo nie możesz zostać zaskoczony, o ile tylko jesteś przytomny.',
  'Przednia straż': 'Gdy wykonujesz test, by się ukryć lub skradać, i znajdujesz się dalej niż w bliskim zasięgu od reszty drużyny, zyskujesz 1 ułatwienie.',
  'Bez śladu': 'Poruszając się po twardym podłożu, nie zostawiasz śladów, jeśli nie chcesz.',
  'Potęga zagnana w kozi róg':'Kiedy fomor jest przestraszony, jego ataki z użyciem broni zadają dodatkowe 1k6 obrażeń.',
  'Niedźwiedzi uścisk': 'Niedźwiedzidło może w swojej turze wykorzystać reakcję, aby pochwycić stworzenie w swoim bezpośrednim zasięgu.'
};

/**
 * Pobiera opis talentu z bazy danych
 * @param {string} talentName - Nazwa talentu
 * @returns {string} Opis talentu
 */
function getTalentDescription(talentName) {
  return TALENT_DESCRIPTIONS[talentName] || 'Opis talentu nie jest dostępny.';
}

export { getTalentDescription };
