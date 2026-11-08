# Limkokwing Student Service Request System

DIWP3110 Web Design II group assignment. A React.js app with Firebase Firestore where students browse university services, submit requests, and staff track them (Create, Read, Update, Delete).

## Tech
React 18 · Create React App · React Router v6 · Firebase Firestore (NoSQL)

## Run locally
1. `npm install`
2. Create a Firebase project, enable **Firestore Database**, and add a web app to get your config.
3. Copy `.env.example` to `.env` and paste your Firebase values.
4. `npm start` (opens http://localhost:3000).

During development, set Firestore rules to allow read/write for the `requests` collection (test mode).

## Routes
| Path | Page |
|---|---|
| `/` | Home |
| `/services` | Services list (nested route) |
| `/services/:serviceId` | Service details (dynamic route) |
| `/request` | Request form |
| `/confirmation/:requestId` | Confirmation (after programmatic navigation) |
| `/requests` | All requests: update status, delete |
| `*` | 404 page |

## Electronic letters and virtual student card
- When staff set a **letter** request (transcript, recommendation, registration) to *Completed*, the system issues an official letter with an electronic stamp, an automatic signature and a verification code. Staff can edit the letter text first (Requests page). Students open it from their confirmation page and print or save it as PDF.
- When a **Student ID replacement** is set to *Completed*, a temporary virtual student card is issued, valid for 3 days (`VIRTUAL_CARD_DAYS`). Staff can extend it while the physical card is awaited. The new card fee (M100) is recorded as a payment reference that staff confirm.
- **Verify page** (`/verify`, or `/verify/CODE`): anyone can check a letter or card; shows Valid, Expired, or Not valid.
- **Track page** (`/track`): students look up a request by reference number.
- Signatory names, fee, card validity and institution details live in `src/config/institution.js` (the signatory names are placeholders: replace them).
- Not included: login for staff, online payment, and student grades (the transcript letter confirms release only).

## Languages
English and Sesotho, switchable from the navbar (choice is remembered). Text lives in `src/i18n/en.js` and `src/i18n/st.js`; `LanguageContext.jsx` provides `t("key")`. Firestore always stores the English status value; only the label is translated.

## Firestore
Collection `requests`: `name, studentId, email, serviceId, serviceName, description, date, status, createdAt`

## Structure
```
src/
  components/  Navbar, Layout, ServiceCard, FormField, StatusBadge, Message, ErrorBoundary, Faq, LanguageSwitcher
  pages/       Home, Services, ServiceList, ServiceDetails, RequestPage, Confirmation, Requests, NotFound
  services/    requestService.js (Firestore CRUD + error handling)
  i18n/        translations.js (English + Sesotho UI text)
  context/     LanguageContext.jsx (language state, t() and pick())
  data/        services.js (array of service objects), faqs.js
  utils/       validate.js (form validation)
  i18n/        en.js, st.js, LanguageContext.jsx
  firebase.js  Firebase initialisation
```

## Languages
English and Sesotho, switched from the navbar and remembered in the browser. Interface text is in `src/i18n/translations.js`; service and FAQ text is stored as `{ en, st }` in `src/data/`. Have a Sesotho speaker review the translations before submitting.

## Group members
- Add names and student IDs here
