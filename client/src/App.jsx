import {
  Link,
  Route,
  Routes,
} from "react-router";

import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";

import CustomerDashboard from "./pages/customer/CustomerDashboard";
import OwnerDashboard from "./pages/owner/OwnerDashboard";
import AdminDashboard from "./pages/admin/AdminDashboard";

import ProtectedRoute from "./routes/ProtectedRoute";

function HomePage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-100 px-4">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-slate-900">
          PG / Hostel Room Booking System
        </h1>

        <p className="mt-3 text-slate-600">
          Find and book accommodation.
        </p>

        <div className="mt-6 flex justify-center gap-3">
          <Link
            to="/login"
            className="rounded-lg bg-slate-900 px-5 py-3 font-semibold text-white"
          >
            Login
          </Link>

          <Link
            to="/register"
            className="rounded-lg border border-slate-300 bg-white px-5 py-3 font-semibold text-slate-900"
          >
            Register
          </Link>
        </div>
      </div>
    </main>
  );
}

function App() {
  return (
    <Routes>
      <Route
        path="/"
        element={<HomePage />}
      />

      <Route
        path="/login"
        element={<LoginPage />}
      />

      <Route
        path="/register"
        element={<RegisterPage />}
      />

      <Route
        path="/customer/dashboard"
        element={
          <ProtectedRoute
            allowedRoles={["customer"]}
          >
            <CustomerDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/owner/dashboard"
        element={
          <ProtectedRoute
            allowedRoles={["owner"]}
          >
            <OwnerDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute
            allowedRoles={[
              "superAdmin",
            ]}
          >
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;