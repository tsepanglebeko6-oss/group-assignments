import { REPLACEMENT_FEE } from "../config/institution.js";

// Services stored as an array of objects and rendered dynamically.
// Text fields hold both languages: { en, st }.
// issues: "letter" = e-stamped letter, "card" = temporary virtual student card.
export const services = [
  { id: "transcript", issues: "letter",
    name: { en: "Academic transcript request", st: "Kopo ea tlaleho ea maemo a thuto" },
    description: { en: "Request an official record of your courses and grades, stamped by the Registry.", st: "Kopa tlaleho ea semmuso ea lithuto le likhahla tsa hau, e tiisitsoeng ke Ofisi ea Ngoliso." },
    processingTime: { en: "3–5 working days", st: "Matsatsi a mosebetsi a 3–5" },
    department: { en: "Registry", st: "Ofisi ea Ngoliso" } },
  { id: "recommendation", issues: "letter",
    name: { en: "Letter of recommendation", st: "Lengolo la tlhahiso" },
    description: { en: "Ask a lecturer or department head for a letter supporting a job or scholarship application.", st: "Kopa morupeli kapa hlooho ea lefapha lengolo le tšehetsang kopo ea mosebetsi kapa ea lithuso-lichelete." },
    processingTime: { en: "5–7 working days", st: "Matsatsi a mosebetsi a 5–7" },
    department: { en: "Academic Affairs", st: "Litaba tsa Thuto" } },
  { id: "registration", issues: "letter",
    name: { en: "Registration assistance", st: "Thuso ea ngoliso" },
    description: { en: "Get help with course registration, late registration, or changes to your module selection.", st: "Fumana thuso ka ngoliso ea lithuto, ngoliso e liehang, kapa liphetoho khethong ea hau ea limodule." },
    processingTime: { en: "1–2 working days", st: "Matsatsi a mosebetsi a 1–2" },
    department: { en: "Registry", st: "Ofisi ea Ngoliso" } },
  { id: "student-id", issues: "card", fee: REPLACEMENT_FEE,
    name: { en: "Student ID replacement", st: "Ho nkeloa sebaka ha karete ea moithuti" },
    description: { en: "Replace a lost, stolen, or damaged student ID card.", st: "Nkela sebaka karete ea moithuti e lahlehileng, e utsoitsoeng kapa e senyehileng." },
    processingTime: { en: "2–3 working days", st: "Matsatsi a mosebetsi a 2–3" },
    department: { en: "Student Affairs", st: "Litaba tsa Baithuti" } },
  { id: "tech-support",
    name: { en: "Technical support", st: "Tšehetso ea thekenoloji" },
    description: { en: "Report problems with campus Wi-Fi, student portal access, lab computers, or email.", st: "Tlaleha mathata a Wi-Fi ea khamphase, ho kena portal ea baithuti, likhomphutha tsa lab kapa imeile." },
    processingTime: { en: "Within 24 hours", st: "Nakong ea lihora tse 24" },
    department: { en: "ICT Services", st: "Litšebeletso tsa ICT" } },
  { id: "general",
    name: { en: "General enquiry", st: "Potso ea kakaretso" },
    description: { en: "Ask any question that does not fit another service and we will route it to the right office.", st: "Botsa potso efe kapa efe e sa lekanang le tšebeletso e 'ngoe 'me re tla e isa ofising e nepahetseng." },
    processingTime: { en: "2–4 working days", st: "Matsatsi a mosebetsi a 2–4" },
    department: { en: "Student Affairs", st: "Litaba tsa Baithuti" } },
];

// Status values are stored in Firestore in English; shown translated in the UI.
export const STATUSES = ["Pending", "In Progress", "Completed", "Rejected"];
