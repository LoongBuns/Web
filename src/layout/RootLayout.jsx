import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import "../styles/layout.css";

export default function RootLayout({ children }) {
  return (
    <div className="layout-container">
      <Sidebar />
      <div className="main-section">
        <Header />
        <main className="content">{children}</main>
      </div>
    </div>
  );
}
