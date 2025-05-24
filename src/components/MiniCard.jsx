import "./styles/MiniCard.css";

export default function MiniCard({ title, value, unit }) {
  return (
    <div className="mini-card">
      <div className="mini-card-title">{title}</div>
      <div className="mini-card-value">
        {value} <span className="mini-card-unit">{unit}</span>
      </div>
    </div>
  );
}
