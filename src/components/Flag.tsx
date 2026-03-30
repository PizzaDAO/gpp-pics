interface FlagProps {
  countryCode: string;
  className?: string;
}

export default function Flag({ countryCode, className = "" }: FlagProps) {
  if (!countryCode) return null;
  return (
    <span
      className={`fi fi-${countryCode} ${className}`}
      style={{ display: "inline-block", width: "1.2em", height: "0.9em" }}
    />
  );
}
