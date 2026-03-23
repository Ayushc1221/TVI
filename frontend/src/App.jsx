import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Application from "./pages/Application";
import VerifyPage from "./pages/VerifyPage";
import AuditorRegistration from "./pages/public/AuditorRegistration";
import { AdminLogin, AdminDashboard } from "./pages/admin";
import { AuditorLogin, AuditorDashboard } from "./pages/auditor";
import { ClientLogin, ClientDashboard } from "./pages/client";
import { ProtectedRoute, AuditorProtectedRoute, ClientProtectedRoute } from "./components/auth";
import { ScrollToTop } from "./components";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/apply" element={<Application />} />
          <Route path="/verify" element={<VerifyPage />} />
          <Route path="/auditor-registration" element={<AuditorRegistration />} />

          {/* Admin Routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          {/* Auditor Routes */}
          <Route path="/auditor/login" element={<AuditorLogin />} />
          <Route
            path="/auditor/dashboard"
            element={
              <AuditorProtectedRoute>
                <AuditorDashboard />
              </AuditorProtectedRoute>
            }
          />
          <Route
            path="/auditor"
            element={
              <AuditorProtectedRoute>
                <AuditorDashboard />
              </AuditorProtectedRoute>
            }
          />

          {/* Client Routes */}
          <Route path="/client/login" element={<ClientLogin />} />
          <Route
            path="/client/dashboard"
            element={
              <ClientProtectedRoute>
                <ClientDashboard />
              </ClientProtectedRoute>
            }
          />
          <Route
            path="/client"
            element={
              <ClientProtectedRoute>
                <ClientDashboard />
              </ClientProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
