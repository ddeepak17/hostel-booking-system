import {
  Link,
  Route,
  Routes,
} from "react-router-dom";

import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";

import CustomerDashboard from "./pages/customer/CustomerDashboard";
import CustomerProfile from "./pages/customer/CustomerProfile";
import MyBookings from "./pages/customer/MyBookings";
import PropertyList from "./pages/customer/PropertyList";
import PropertyDetails from "./pages/customer/PropertyDetails";

import OwnerDashboard from "./pages/owner/OwnerDashboard";
import OwnerBookings from "./pages/owner/OwnerBookings";
import OwnerTenants from "./pages/owner/OwnerTenants";
import OwnerProperties from "./pages/owner/OwnerProperties";
import OwnerPropertyManager from "./pages/owner/OwnerPropertyManager";

import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminOwners from "./pages/admin/AdminOwners";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminProperties from "./pages/admin/AdminProperties";
import AdminBookings from "./pages/admin/AdminBookings";

import ProtectedRoute from "./routes/ProtectedRoute";


function HomePage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-100 px-4">

      <div className="text-center">

        <h1 className="text-4xl font-bold">
          PG / Hostel Room Booking System
        </h1>

        <p className="mt-3 text-slate-600">
          Find and book accommodation.
        </p>


        <div className="mt-6 flex justify-center gap-3">

          <Link
            to="/properties"
            className="rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white"
          >
            Browse Hostels
          </Link>


          <Link
            to="/login"
            className="rounded-lg bg-slate-900 px-5 py-3 font-semibold text-white"
          >
            Login
          </Link>


          <Link
            to="/register"
            className="rounded-lg border bg-white px-5 py-3 font-semibold"
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
        path="/customer/profile"
        element={
          <ProtectedRoute
            allowedRoles={[
              "customer",
            ]}
          >
            <CustomerProfile />
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
        path="/owner/properties"
        element={
          <ProtectedRoute
            allowedRoles={[
              "owner",
            ]}
          >
            <OwnerProperties />
          </ProtectedRoute>
        }
      />

      <Route
        path="/owner/properties/:propertyId/manage"
        element={
          <ProtectedRoute
            allowedRoles={[
              "owner",
            ]}
          >
            <OwnerPropertyManager />
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

      <Route
        path="/admin/owners"
        element={
          <ProtectedRoute
            allowedRoles={[
              "superAdmin",
            ]}
          >
            <AdminOwners />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/users"
        element={
          <ProtectedRoute
            allowedRoles={[
              "superAdmin",
            ]}
          >
            <AdminUsers />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/properties"
        element={
          <ProtectedRoute
            allowedRoles={[
              "superAdmin",
            ]}
          >
            <AdminProperties />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/bookings"
        element={
          <ProtectedRoute
            allowedRoles={[
              "superAdmin",
            ]}
          >
            <AdminBookings />
          </ProtectedRoute>
        }
      />


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