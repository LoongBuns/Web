import useAuth from "../hooks/useAuth";
import "../styles/layout.css";

export default function Header() {
  const { user, logout } = useAuth();
  return (
    <header className="header">
      {user && (
        <span style={{ marginLeft: "auto", marginRight: "1rem" }}>
          Hi, {user.email}
        </span>
      )}
      <button onClick={logout}>Logout</button>
    </header>
  );
}
