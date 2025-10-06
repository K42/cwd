# 🩸 Dark Horror Theme - Plan Implementacji

## 📋 Przegląd Architektury

### **Cel**
Transformacja UI aplikacji kreatora postaci "Cień Władcy Demonów" w dark horror theme z zachowaniem pełnej funkcjonalności.

### **Zasady Projektowe**
- **Brudny Horror**: Ostre krawędzie, ciemne kolory, nieprzyjemne ramki
- **Przezroczystość**: Modals, selected states, overlays
- **Zachowanie Funkcjonalności**: Zero zmian w logice biznesowej
- **Modularność**: CSS zmienne dla łatwej konserwacji

## 🎨 Color Palette

### **Główne Kolory**
```css
:root {
  /* Backgrounds */
  --bg-900: #0a0a0a;        /* Głęboka czerń */
  --bg-800: #1a1a1a;        /* Ciemny grafit */
  --bg-700: #2a2a2a;        /* Średni ciemny */
  --bg-600: #3a3a3a;        /* Lżejszy ciemny */
  
  /* Text */
  --fg-100: #f5f5f5;        /* Jasny tekst */
  --fg-200: #e0e0e0;        /* Średni jasny */
  --fg-300: #b0b0b0;        /* Średni szary */
  --fg-400: #808080;        /* Ciemny szary */
  
  /* Horror Accents */
  --acc-red: #dc2626;       /* Jasna czerwień */
  --acc-red-dark: #991b1b;  /* Ciemna czerwień */
  --acc-orange: #ea580c;    /* Pomarańcz */
  --acc-orange-dark: #c2410c; /* Ciemny pomarańcz */
  
  /* Borders */
  --border-color: #404040;  /* Ciemne ramki */
  --border-light: #606060;  /* Jaśniejsze ramki */
  
  /* Effects */
  --shadow-glow: 0 0 20px rgba(220, 38, 38, 0.3);
  --shadow-dark: 0 4px 12px rgba(0, 0, 0, 0.8);
}
```

## 🏗️ Struktura Implementacji

### **Krok 1: Przygotowanie CSS Architecture**
```
src/ui/styles/
├── theme.css      # CSS zmienne i design tokens
├── base.css       # Globalne style, reset, typography
├── components.css # Komponenty UI (buttons, tiles, modals)
├── utilities.css  # Utility classes (display, spacing)
└── modals.css     # Modal system i overlays
```

### **Krok 2: HTML Modifications**
- Dodanie `data-theme="dark-horror"` do `<html>`
- Linkowanie nowych CSS files
- Usunięcie inline styles
- Zachowanie wszystkich ID i class names

### **Krok 3: JavaScript Refactoring**
- Zamiana `style.display` na `classList.toggle`
- Zamiana `style.opacity` na `classList.toggle`
- Dodanie utility classes: `.is-hidden`, `.is-dim`, `.u-no-scroll`

## 🎯 Komponenty do Stylowania

### **1. Global Layout**
- **Body**: Ciemny background z grain overlay
- **Header**: Gradient background z czerwonymi akcentami
- **Sections**: Ciemne tło z ostrymi ramkami

### **2. Interactive Elements**
- **Buttons**: Czerwone/pomarańczowe z glow effects
- **Inputs**: Ciemne tło z czerwonymi focus states
- **Tiles**: Hover effects z shadow i transform

### **3. Modal System**
- **Backdrop**: Blur + dark overlay
- **Content**: Ciemne tło z przezroczystością
- **Close buttons**: Czerwone akcenty

### **4. Origin Tiles**
- **Collapsed**: Kompaktowy widok z podstawowymi info
- **Expanded**: Pełny widok z tabelami losowania
- **Selected**: Czerwone podświetlenie z glow

## 🔧 Implementation Plan

### **Phase 1: Foundation (AC-UI-001)**
1. Stworzenie CSS zmiennych w `theme.css`
2. Implementacja base styles w `base.css`
3. Dodanie HTML attributes i linków CSS
4. **Test**: Weryfikacja że wszystkie style się ładują

### **Phase 2: Components (AC-UI-002)**
1. Stylowanie buttons i inputs
2. Implementacja tile system
3. Modal system z przezroczystością
4. **Test**: Weryfikacja interakcji

### **Phase 3: Advanced Effects (AC-UI-003)**
1. Background effects (grain, vignette)
2. Hover animations
3. Glow effects
4. **Test**: Weryfikacja performance

### **Phase 4: Polish (AC-UI-004)**
1. Fine-tuning kolorów
2. Spacing adjustments
3. Typography refinements
4. **Test**: Cross-browser compatibility

## 🧪 Testing Strategy

### **Functional Testing**
- [ ] Wszystkie buttons działają
- [ ] Form inputs zachowują funkcjonalność
- [ ] Modal system działa
- [ ] Origin tiles expand/collapse
- [ ] API calls nie są przerwane

### **Visual Testing**
- [ ] Dark theme applied globally
- [ ] Sharp edges (no border-radius)
- [ ] Horror color palette
- [ ] Transparency effects
- [ ] Responsive design

### **Performance Testing**
- [ ] CSS load time < 100ms
- [ ] No layout shifts
- [ ] Smooth animations
- [ ] Memory usage stable

## 🚨 Risk Mitigation

### **Backup Strategy**
```bash
# Przed rozpoczęciem
git checkout -b feature/dark-horror-theme
git add .
git commit -m "Backup: Before dark theme implementation"
```

### **Incremental Changes**
- Jeden plik CSS na raz
- Test po każdej zmianie
- Rollback plan dla każdego kroku

### **Validation Points**
- Po każdym kroku: `npm start` + manual testing
- Po każdej fazie: full functional test
- Przed commitem: visual regression test

## 📝 Acceptance Criteria

### **AC-UI-001: Global Theme**
- [ ] Wszystkie elementy używają dark horror palette
- [ ] Zero border-radius w całej aplikacji
- [ ] CSS zmienne zdefiniowane i używane
- [ ] HTML structure niezmieniona

### **AC-UI-002: Component Styling**
- [ ] Buttons: czerwone/pomarańczowe z glow
- [ ] Inputs: ciemne tło z czerwonym focus
- [ ] Tiles: hover effects z shadow
- [ ] Modals: blur backdrop + przezroczystość

### **AC-UI-003: Advanced Effects**
- [ ] Background grain overlay
- [ ] Vignette effects
- [ ] Glow animations
- [ ] Smooth transitions

### **AC-UI-004: Polish & Performance**
- [ ] Cross-browser compatibility
- [ ] Mobile responsive
- [ ] Performance metrics maintained
- [ ] Zero functional regressions

## 🎯 Success Metrics

- **Functional**: 100% feature parity z oryginalną wersją
- **Visual**: Dark horror theme applied consistently
- **Performance**: No degradation in load times
- **Maintainability**: CSS zmienne dla łatwej modyfikacji
- **Accessibility**: Contrast ratios maintained

---

**Status**: 📋 Planned  
**Priority**: High  
**Estimated Time**: 4-6 hours  
**Dependencies**: None  
**Risk Level**: Medium (due to scope of changes)
