# PASHU SHIELD — SIH 2026 MVP

A frontend-first prototype for SIH26128: Efficient systems for early detection, prevention, and management of livestock diseases and animal health issues.

## Demo flow

1. Open the app as **Farmer / Field Worker** using the "Switch" button.
2. Open **Report Health Issue**.
3. Submit a simulated livestock health report.
4. The prototype calculates a transparent triage score.
5. The case is escalated to the **Veterinary Dashboard**.
6. Review the priority case, risk map, forecast, alerts and lab referral.

## Run locally

Requirements: Node.js 18+.

```bash
npm install
npm run dev
```

Then open the local Vite URL shown in the terminal.

## Prototype scope

- Farmer reporting
- AI-assisted/rule-based triage demonstration
- Veterinary decision dashboard
- Priority cases
- Geo-spatial risk-map simulation
- Disease trend/forecast simulation
- Lab referral
- Alerts/advisories
- Herd and health-record screens
- Offline/PWA-ready UI indicators

## Important

The triage engine is a demonstration using transparent rules and simulated data. It is not a clinical disease-diagnosis system. Veterinary confirmation should remain the final authority.

## Next engineering steps

- Connect Firebase/PostgreSQL for persistent data
- Add authentication and role-based access
- Add Leaflet/OpenStreetMap
- Implement IndexedDB service worker and auto-sync
- Connect Web Speech API for Hindi/Marathi/English
- Add validated disease datasets and a trained/validated ML model
- Add notification/SMS provider
- Add secure APIs and audit logging
