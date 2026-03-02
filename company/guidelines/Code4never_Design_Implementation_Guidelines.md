# 📋 Code4never Design & UI Implementation Guidelines

Diese Guidelines erweitern die **Visual Guidelines 3.0** um spezifische Implementierungsvorgaben für Web-Interfaces, basierend auf modernen Web-Standards und Vercel Web Interface Guidelines.

## ♿ Barrierefreiheit (Accessibility)

- **Interaktive Elemente:**
  - Jedes Icon-only Button-Element benötigt ein explizites `aria-label`.
  - Formularfelder müssen über ein zugehöriges `<label>` oder ein `aria-label` verfügen.
  - Verwende semantisches HTML: `<button>` für Aktionen, `<a>` oder `<Link>` für Navigation. Keinen `onClick`-Event auf `<div>` oder `<span>` legen.
  - Bilder benötigen immer ein `alt`-Attribut (leer (`alt=""`), wenn rein dekorativ).
- **Fokus-Management:**
  - Nutze `:focus-visible` statt `:focus`, um Fokusringe nur bei Tastaturbedienung anzuzeigen.
  - Entferne niemals den Standard-Fokus-Ring (`outline-none`), ohne einen gleichwertigen, kontrastreichen Ersatz (`focus-visible:ring-*`) zu bieten.
- **Hierarchie:** Überschriften müssen eine logische Hierarchie von `<h1>` zu `<h6>` einhalten.

## 폼 Formular-Design (Forms)

- **Eingabefelder:**
  - Nutze das `autocomplete`-Attribut sinnvoll (z.B. `email`, `tel`, `current-password`).
  - Deaktiviere die Rechtschreibprüfung (`spellCheck={false}`) bei E-Mail-Adressen, Benutzernamen oder Codes.
  - Blockiere niemals das Einfügen von Inhalten (`onPaste` preventDefault ist untersagt).
- **Zustände:**
  - Submit-Buttons müssen während eines API-Requests deaktiviert sein und einen Spinner/Ladeindikator zeigen.
  - Fehlermeldungen müssen direkt beim betroffenen Feld angezeigt werden.
  - Placeholders enden immer mit `…` (z.B. "Name eingeben…").

## ✨ Animationen

- **Performance:** Animiere ausschließlich `transform` und `opacity` (Compositor-friendly).
- **Best Practices:**
  - Vermeide `transition: all`. Liste die Eigenschaften explizit auf (z.B. `transition-colors`, `transition-transform`).
  - Berücksichtige `prefers-reduced-motion` (Animationen bei Bedarf reduzieren oder deaktivieren).
  - Animationen müssen unterbrechbar sein und sofort auf Benutzereingaben reagieren.

## ✍️ Typografie & Content

- **Sonderzeichen:** Verwende echte Ellipsen `…` statt drei Punkten `...` und geschwungene Anführungszeichen.
- **Zahlen:** Nutze `font-variant-numeric: tabular-nums` für Tabellen oder Timer, um flackernde Breitenänderungen zu vermeiden.
- **Ladezustände:** Bezeichnungen für laufende Prozesse enden auf `…` (z.B. "Lädt…", "Speichert…").
- **Klarheit:** Nutze Aktiv-Formulierungen ("Installiere die CLI" statt "Die CLI wird installiert").

## 🎨 UI & Theming (Ergänzung zu 3.0)

- **Dark Mode:** Setze `color-scheme: dark` auf das `<html>`-Tag, damit Browser-Scrollbars und native Inputs korrekt dargestellt werden.
- **Touch-Optimierung:** Nutze `touch-action: manipulation`, um den Double-Tap-Zoom-Delay zu verhindern.
- **Kanten & Schatten:** Befolge das "Luminance-Bleeding Protocol" aus den Visual Guidelines 3.0 für goldene Elemente auf schwarzem Grund (keine 100% harten Kanten).

## 🚫 Nicht zulässige Praktiken (Anti-Patterns)

- Deaktivieren des Nutzer-Zooms (`user-scalable=no`).
- Inline-Styles für Layout-Zwecke (verwende Tailwind/CSS).
- Fehlende `width`/`height` Angaben bei Bildern (verhindert Layout-Shifts).
- Hardcodierte Datums- oder Zahlenformate (nutze `Intl.DateTimeFormat` / `Intl.NumberFormat`).

---
*Status: Aktualisiert basierend auf Web Interface Guidelines 2026 | Autor: Nova Orchestrator*
