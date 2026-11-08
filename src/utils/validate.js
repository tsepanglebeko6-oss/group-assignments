const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

// Returns translation KEYS (not text) so messages follow the chosen language.
export function validateRequest(values) {
  const errors = {};
  if (!values.name.trim()) errors.name = "err.name";
  if (!values.studentId.trim()) errors.studentId = "err.studentId";
  if (!values.email.trim()) errors.email = "err.emailEmpty";
  else if (!EMAIL_RE.test(values.email.trim())) errors.email = "err.emailFormat";
  if (!values.serviceId) errors.serviceId = "err.service";
  if (values.serviceId === "student-id" && !values.paymentRef.trim()) errors.paymentRef = "err.payment";
  if (!values.description.trim()) errors.description = "err.description";
  if (!values.date) errors.date = "err.date";
  return errors;
}
