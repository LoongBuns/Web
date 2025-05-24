export default function InfoCard({ title, children }) {
  return (
    <div
      style={{
        border: "1px solid #ddd",
        borderRadius: "10px",
        padding: "2rem",
        maxWidth: "600px",
        boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
        backgroundColor: "#fff",
      }}
    >
      {title && (
        <h3 style={{ marginTop: 0, marginBottom: "1.5rem" }}>{title}</h3>
      )}
      {children}
    </div>
  );
}
