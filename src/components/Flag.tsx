const COUNTRY_NAMES: Record<string, string> = {
  ae: "United Arab Emirates", al: "Albania", am: "Armenia", ar: "Argentina",
  at: "Austria", au: "Australia", be: "Belgium", bf: "Burkina Faso",
  bg: "Bulgaria", bj: "Benin", bo: "Bolivia", br: "Brazil", bw: "Botswana",
  bz: "Belize", ca: "Canada", ci: "Ivory Coast", cl: "Chile", cn: "China",
  co: "Colombia", cz: "Czechia", de: "Germany", dk: "Denmark", ec: "Ecuador",
  ee: "Estonia", eg: "Egypt", es: "Spain", fr: "France", gb: "United Kingdom",
  gh: "Ghana", gr: "Greece", gt: "Guatemala", hn: "Honduras", hr: "Croatia",
  hu: "Hungary", id: "Indonesia", ie: "Ireland", il: "Israel", in: "India",
  it: "Italy", jp: "Japan", ke: "Kenya", kh: "Cambodia", kr: "South Korea",
  ky: "Cayman Islands", kz: "Kazakhstan", lb: "Lebanon", lk: "Sri Lanka",
  lu: "Luxembourg", ma: "Morocco", mc: "Monaco", mn: "Mongolia", mx: "Mexico",
  na: "Namibia", ne: "Niger", ng: "Nigeria", nl: "Netherlands", no: "Norway",
  pe: "Peru", pf: "French Polynesia", ph: "Philippines", pk: "Pakistan",
  pl: "Poland", pr: "Puerto Rico", pt: "Portugal", ro: "Romania", ru: "Russia",
  se: "Sweden", sg: "Singapore", sk: "Slovakia", sv: "El Salvador",
  th: "Thailand", tw: "Taiwan", tz: "Tanzania", ua: "Ukraine", ug: "Uganda",
  us: "United States", ve: "Venezuela", vn: "Vietnam", zw: "Zimbabwe",
};

interface FlagProps {
  countryCode: string;
  className?: string;
}

export default function Flag({ countryCode, className = "" }: FlagProps) {
  if (!countryCode) return null;
  return (
    <span
      className={`fi fi-${countryCode} ${className}`}
      title={COUNTRY_NAMES[countryCode] || countryCode.toUpperCase()}
      style={{ display: "inline-block", width: "1.2em", height: "0.9em", cursor: "default" }}
    />
  );
}
