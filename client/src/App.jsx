import { Route, Routes } from "react-router-dom";
import Home from "./components/Home";
import CitizenAuth from "./pages/citizen/CitizenAuth";
import CitizenProtectedRoute from "./pages/citizen/CitizenProtectedRoute";
import CitizenDashboard from "./pages/citizen/CitizenDashboard";
import AdminAuth from "./pages/admin/AdminAuth";
import AdminProtectedRoute from "./pages/admin/AdminProtectedRoute";
import AdminDashboard from "./pages/admin/AdminDashboard";
import ResetPassword from "./components/ResetPassword";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        <Route path="/citizen" element={<CitizenAuth />} />
        <Route element={<CitizenProtectedRoute />}>
          <Route path="/citizen/dashboard" element={<CitizenDashboard />} />
        </Route>
        
        <Route path="/admin" element={<AdminAuth />} />
        <Route element={<AdminProtectedRoute />}>
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
