// Edit this file to change institution details, signatories and card rules.
export const INSTITUTION = {
  name: "Limkokwing University of Creative Technology",
  shortName: "LIMKOKWING",
};

export const VIRTUAL_CARD_DAYS = 3; // temporary virtual card validity (2–3 days)
export const REPLACEMENT_FEE = 100; // fee for a new physical student card
export const CURRENCY = "M";

// Automatic signature printed on letters. REPLACE these placeholder names with the
// real signatories, and only after the university has authorised their e-signature.
export const SIGNATORIES = {
  transcript: { name: "Registrar Name", title: "Registrar", office: "Registry" },
  recommendation: { name: "Head of Academic Affairs", title: "Head of Academic Affairs", office: "Academic Affairs" },
  registration: { name: "Registrar Name", title: "Registrar", office: "Registry" },
  "student-id": { name: "Student Affairs Officer", title: "Student Affairs", office: "Student Affairs" },
};
