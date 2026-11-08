import { formatDate } from "./codes.js";
import { INSTITUTION } from "../config/institution.js";

export const LETTER_TITLES = {
  transcript: "Official Transcript Release Letter",
  recommendation: "Letter of Recommendation",
  registration: "Proof of Registration Letter",
};

// Default letter text. Staff can edit it per request before/after approval.
export function defaultLetterBody(r) {
  const requested = formatDate(r.date);
  const issued = formatDate(r.issuedAt);
  switch (r.serviceId) {
    case "transcript":
      return `This letter confirms that ${r.name} (Student ID: ${r.studentId}) requested an official academic transcript on ${requested}. The request was reviewed and approved by the Registry on ${issued}, and the transcript has been released to the student.\n\nStated purpose of the request: ${r.description}`;
    case "recommendation":
      return `${r.name} (Student ID: ${r.studentId}) is a student of ${INSTITUTION.name} and is in good standing with the institution.\n\nThis letter is issued in support of the following request: ${r.description}\n\nWe recommend ${r.name} for your kind consideration.`;
    case "registration":
      return `This letter confirms that ${r.name} (Student ID: ${r.studentId}) requested registration assistance on ${requested}, which was approved by the Registry on ${issued}.\n\nDetails of the request: ${r.description}`;
    default:
      return "";
  }
}
