// Service layer (acts as "middleware"): all Firestore calls go through here
// so errors are caught and converted to friendly messages in one place.
import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, limit, orderBy, query, serverTimestamp, updateDoc, where } from "firebase/firestore";
import { db } from "../firebase";
import { services } from "../data/services.js";
import { VIRTUAL_CARD_DAYS } from "../config/institution.js";
import { makeCode } from "../utils/codes.js";

const COLLECTION = "requests";
const addDays = (date, n) => new Date(date.getTime() + n * 86400000).toISOString();

const friendly = (action, err) => {
  console.error(`Firestore error while ${action}:`, err);
  if (err?.code === "permission-denied") return new Error("Permission denied. Check your Firestore security rules.");
  if (err?.code === "unavailable") return new Error("Cannot reach the server. Check your internet connection.");
  return new Error(`Something went wrong while ${action}. Please try again.`);
};

async function run(action, fn) {
  try {
    return await fn();
  } catch (err) {
    throw friendly(action, err);
  }
}

// CREATE
export const createRequest = (data) =>
  run("submitting your request", async () => {
    const ref = await addDoc(collection(db, COLLECTION), { ...data, status: "Pending", createdAt: serverTimestamp() });
    return ref.id;
  });

// READ (all)
export const fetchRequests = () =>
  run("loading requests", async () => {
    const snap = await getDocs(query(collection(db, COLLECTION), orderBy("createdAt", "desc")));
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  });

// READ (one)
export const fetchRequest = (id) =>
  run("loading the request", async () => {
    const snap = await getDoc(doc(db, COLLECTION, id));
    return snap.exists() ? { id: snap.id, ...snap.data() } : null;
  });

// READ (by verification code, used by the Verify page)
export const findByCode = (code) =>
  run("checking the code", async () => {
    const snap = await getDocs(query(collection(db, COLLECTION), where("verifyCode", "==", code), limit(1)));
    return snap.empty ? null : { id: snap.docs[0].id, ...snap.docs[0].data() };
  });

// UPDATE status. When a letter/card service is set to Completed for the first time,
// the electronic document is issued automatically (verification code, date, card validity).
export const updateRequestStatus = (request, status) =>
  run("updating the status", async () => {
    const changes = { status };
    const service = services.find((s) => s.id === request.serviceId);
    if (status === "Completed" && service?.issues && !request.verifyCode) {
      const now = new Date();
      changes.verifyCode = makeCode();
      changes.issuedAt = now.toISOString();
      if (service.issues === "card") {
        changes.cardNo = `TMP-${makeCode(6).replace("-", "")}`;
        changes.validUntil = addDays(now, VIRTUAL_CARD_DAYS);
      }
    }
    await updateDoc(doc(db, COLLECTION, request.id), changes);
    return changes;
  });

// UPDATE: extend a temporary card while the student still waits for the physical one
export const extendVirtualCard = (id) =>
  run("extending the card", async () => {
    const now = new Date();
    const changes = { issuedAt: now.toISOString(), validUntil: addDays(now, VIRTUAL_CARD_DAYS) };
    await updateDoc(doc(db, COLLECTION, id), changes);
    return changes;
  });

export const updateLetterBody = (id, letterBody) =>
  run("saving the letter text", async () => {
    await updateDoc(doc(db, COLLECTION, id), { letterBody });
    return { letterBody };
  });

export const updatePayment = (id, paymentConfirmed) =>
  run("updating the payment", async () => {
    await updateDoc(doc(db, COLLECTION, id), { paymentConfirmed });
    return { paymentConfirmed };
  });

// DELETE
export const deleteRequest = (id) =>
  run("deleting the request", () => deleteDoc(doc(db, COLLECTION, id)));
