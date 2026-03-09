# 🔱 SOVEREIGN OPERATIONAL STANDARDS (v4.0)

## 1. Architekturs-Philosophie: Monolithisches Kommando, Dezentrale Produktion
- **Sovereign Hub (Mainframe):** Die Zentrale. Hier lebt N.O.V.A. und managt die Swarm-Agenten. Das Dashboard dient ausschließlich der **Orchestrierung**, **Beobachtung** und **Automatisierung**.
- **Projekte/Produkte (Satelliten):** Jedes neu geschmiedete Programm (SaaS, Tools, Bots) existiert in einem **separaten Verzeichnis** unter `/PROJECTS/`. Es hat seinen eigenen Code-Stack, sein eigenes GitHub-Repo und seine eigene Deployment-Logik.

## 2. Der "Dogfooding" Lifecycle (Integrations-Schleife)
1. **Forge-Phase:** Ein Produkt wird im isolierten Projekt-Ordner generiert.
2. **Uplink-Phase:** Wenn das Produkt einen "Stable" Status erreicht, wird es per API oder Widget-Modul in den Sovereign Hub integriert.
3. **Internal Testing:** Wir nutzen das Produkt selbst im Hub, um seine Funktionalität und seinen ROI zu validieren.
4. **Market-Phase:** Erst nach erfolgreicher interner Validierung wird die öffentliche Skalierung (Marketing, Verkauf) eingeleitet.

## 3. Strategische Stopp-Order
- **Marketing-Automatisierung (SH-1500):** Pausiert. Wird erst aktiviert, wenn der Hub die "Homeostasis" (Betriebsbereitschaft nach Standard des Sovereign) erreicht hat.
- **Node Genesis (SH-1800):** Pausiert (Icebox). Physische Skalierung erfolgt erst bei Kapazitätsengpässen des Hauptknotens.
