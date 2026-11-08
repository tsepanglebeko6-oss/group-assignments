import { useState } from "react";
import { useLang } from "../context/LanguageContext.jsx";

// Expandable list: one item open at a time (useState + conditional rendering)
export default function Faq({ items }) {
  const [openIndex, setOpenIndex] = useState(null);
  const { pick } = useLang();
  return (
    <ul className="faq">
      {items.map((item, i) => {
        const open = openIndex === i;
        return (
          <li key={item.q.en}>
            <button className="faq-q" aria-expanded={open} onClick={() => setOpenIndex(open ? null : i)}>
              <span className="faq-mark">{open ? "−" : "+"}</span>
              {pick(item.q)}
            </button>
            {open && <p className="faq-a">{pick(item.a)}</p>}
          </li>
        );
      })}
    </ul>
  );
}
