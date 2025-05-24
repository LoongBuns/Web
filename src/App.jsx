import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import AuthProvider from "./providers/AuthProvider";
import useAuth from "./hooks/useAuth";
import { DeviceProvider } from "./context/DeviceContext";
import { GroupProvider } from "./context/GroupContext";
import { RegionProvider } from "./context/RegionContext";
import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import GroupDetail from "./pages/GroupDetail";
import RegionDetail from "./pages/RegionDetail";
import DeviceDetail from "./pages/DeviceDetail";
import RootLayout from "./layout/RootLayout";
import Panel from "./pages/Panel";

const PrivateRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ padding: "2rem", textAlign: "center", fontSize: "1.2rem" }}>
        LOADING...
      </div>
    );
  }

  return isAuthenticated ? children : <Navigate to="/login" />;
};

export default function App() {
  return (
    <AuthProvider>
      <GroupProvider>
        <RegionProvider>
          <DeviceProvider>
            <Router>
              <Routes>
                <Route path="/login" element={<Login />} />

                <Route
                  path="/dashboard"
                  element={
                    <PrivateRoute>
                      <RootLayout>
                        <Dashboard />
                      </RootLayout>
                    </PrivateRoute>
                  }
                />

                <Route
                  path="/panel"
                  element={
                    <PrivateRoute>
                      <RootLayout>
                        <Panel />
                      </RootLayout>
                    </PrivateRoute>
                  }
                />

                <Route
                  path="/group/:id"
                  element={
                    <PrivateRoute>
                      <RootLayout>
                        <GroupDetail />
                      </RootLayout>
                    </PrivateRoute>
                  }
                />

                <Route
                  path="/region/:id"
                  element={
                    <PrivateRoute>
                      <RootLayout>
                        <RegionDetail />
                      </RootLayout>
                    </PrivateRoute>
                  }
                />

                <Route
                  path="/device/:id"
                  element={
                    <PrivateRoute>
                      <RootLayout>
                        <DeviceDetail />
                      </RootLayout>
                    </PrivateRoute>
                  }
                />

                <Route path="*" element={<Navigate to="/login" />} />
              </Routes>
            </Router>
          </DeviceProvider>
        </RegionProvider>
      </GroupProvider>
    </AuthProvider>
  );
}
