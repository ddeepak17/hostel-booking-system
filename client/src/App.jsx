import {
  Link,
  Route,
  Routes,
} from "react-router-dom";


import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";


import CustomerDashboard from "./pages/customer/CustomerDashboard";
import MyBookings from "./pages/customer/MyBookings";

import PropertyList from "./pages/customer/PropertyList";
import PropertyDetails from "./pages/customer/PropertyDetails";


import OwnerDashboard from "./pages/owner/OwnerDashboard";
import OwnerBookings from "./pages/owner/OwnerBookings";
import OwnerTenants from "./pages/owner/OwnerTenants";


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

      {/* Public */}

      <Route
        path="/"
        element={
          <HomePage />
        }
      />


      <Route
        path="/login"
        element={
          <LoginPage />
        }
      />


      <Route
        path="/register"
        element={
          <RegisterPage />
        }
      />


      <Route
        path="/properties"
        element={
          <PropertyList />
        }
      />


      <Route
        path="/properties/:propertyId"
        element={
          <PropertyDetails />
        }
      />


      {/* Customer */}

      <Route
        path="/customer/dashboard"
        element={
          <ProtectedRoute
            allowedRoles={[
              "customer",
            ]}
          >
            <CustomerDashboard />
          </ProtectedRoute>
        }
      />


      <Route
        path="/customer/bookings"
        element={
          <ProtectedRoute
            allowedRoles={[
              "customer",
            ]}
          >
            <MyBookings />
          </ProtectedRoute>
        }
      />


      {/* Owner */}

      <Route
        path="/owner/dashboard"
        element={
          <ProtectedRoute
            allowedRoles={[
              "owner",
            ]}
          >
            <OwnerDashboard />
          </ProtectedRoute>
        }
      />


      <Route
        path="/owner/bookings"
        element={
          <ProtectedRoute
            allowedRoles={[
              "owner",
            ]}
          >
            <OwnerBookings />
          </ProtectedRoute>
        }
      />


      <Route
        path="/owner/tenants"
        element={
          <ProtectedRoute
            allowedRoles={[
              "owner",
            ]}
          >
            <OwnerTenants />
          </ProtectedRoute>
        }
      />


      {/* Super Admin */}

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


      {/* Fallback */}

      <Route
        path="*"
        element={
          <main className="min-h-screen bg-slate-100 p-8">

            <div className="mx-auto max-w-4xl rounded-xl bg-white p-8 shadow-sm">

              <h1 className="text-3xl font-bold">
                Page Not Found
              </h1>

              <Link
                to="/"
                className="mt-4 inline-block font-semibold text-blue-600"
              >
                Return home
              </Link>

            </div>

          </main>
        }
      />

    </Routes>
  );
}


export default App;