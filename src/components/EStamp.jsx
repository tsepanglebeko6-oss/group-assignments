// Electronic stamp drawn as SVG (no image files needed).
export default function EStamp({ office, date }) {
  const label = office.toUpperCase();
  return (
    <svg className="estamp" viewBox="0 0 200 200" role="img" aria-label="Electronic stamp">
      <defs>
        <path id="stamp-top" d="M 30,100 A 70,70 0 0,1 170,100" />
        <path id="stamp-bottom" d="M 30,100 A 70,70 0 0,0 170,100" />
      </defs>
      <circle cx="100" cy="100" r="94" fill="none" stroke="currentColor" strokeWidth="4" />
      <circle cx="100" cy="100" r="88" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="100" cy="100" r="54" fill="none" stroke="currentColor" strokeWidth="2" />
      <text fontSize="12" fontWeight="800" letterSpacing="1" fill="currentColor">
        <textPath href="#stamp-top" startOffset="50%" textAnchor="middle">LIMKOKWING UNIVERSITY</textPath>
      </text>
      <text fontSize="11" fontWeight="800" letterSpacing="2" fill="currentColor">
        <textPath href="#stamp-bottom" startOffset="50%" textAnchor="middle">ELECTRONIC STAMP</textPath>
      </text>
      <text x="100" y="98" textAnchor="middle" fontSize={label.length > 10 ? 9 : 13} fontWeight="800" fill="currentColor">{label}</text>
      <text x="100" y="114" textAnchor="middle" fontSize="9" fontWeight="600" fill="currentColor">{date}</text>
      <text x="22" y="104" fontSize="10" fill="currentColor">★</text>
      <text x="170" y="104" fontSize="10" fill="currentColor">★</text>
    </svg>
  );
}
