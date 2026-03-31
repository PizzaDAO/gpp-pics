const COUNTRY_NAMES: Record<string, string> = {
  ae: "United Arab Emirates", am: "Armenia", ar: "Argentina", at: "Austria",
  au: "Australia", be: "Belgium", bo: "Bolivia", br: "Brazil", bw: "Botswana",
  ca: "Canada", cl: "Chile", cn: "China", co: "Colombia", cz: "Czechia",
  de: "Germany", dk: "Denmark", ec: "Ecuador", eg: "Egypt", es: "Spain",
  fr: "France", gr: "Greece", gt: "Guatemala", hn: "Honduras", id: "Indonesia",
  ie: "Ireland", il: "Israel", in: "India", it: "Italy", ke: "Kenya",
  ky: "Cayman Islands", kz: "Kazakhstan", lb: "Lebanon", lk: "Sri Lanka",
  ma: "Morocco", mx: "Mexico", ng: "Nigeria", pe: "Peru", pf: "French Polynesia",
  ph: "Philippines", pk: "Pakistan", pr: "Puerto Rico", pt: "Portugal",
  ro: "Romania", se: "Sweden", sv: "El Salvador", th: "Thailand", tz: "Tanzania",
  ua: "Ukraine", ug: "Uganda", us: "United States", ve: "Venezuela",
  vn: "Vietnam", zw: "Zimbabwe",
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
