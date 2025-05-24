import "./styles/InfoRow.css";

export default function InfoRow({ label, value, isLink = false }) {
  const content = isLink ? (
    <a
      href={value}
      target="_blank"
      rel="noopener noreferrer"
      className="info-row-link"
    >
      {value}
    </a>
  ) : (
    value
  );

  return (
    <div className="info-row">
      <div className="info-row-label">{label}:</div>
      <div className="info-row-value">{content}</div>
    </div>
  );
}
