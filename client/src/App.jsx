import {
  Link,
  Route,
  Routes,
} from "react-router-dom";

import AppHeader from "./components/AppHeader";

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
import OwnerPropertyMedia from "./pages/owner/OwnerPropertyMedia";

import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminOwners from "./pages/admin/AdminOwners";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminProperties from "./pages/admin/AdminProperties";
import AdminBookings from "./pages/admin/AdminBookings";

import ProtectedRoute from "./routes/ProtectedRoute";


function HomePage() {
  return (
    <main className="min-h-[calc(100vh-65px)] bg-slate-950 px-4 py-16 text-white">

      <div className="mx-auto flex max-w-6xl flex-col items-center justify-center py-16 text-center sm:py-28">

        <p className="rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-slate-200">
          Student accommodation made simpler
        </p>


        <h1 className="mt-6 max-w-4xl text-4xl font-black tracking-tight sm:text-6xl">
          Find the right hostel.
          Book the right bed.
        </h1>


        <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
          Discover properties, compare rooms and pricing, reserve available beds, and manage your stay from one platform.
        </p>


        <div className="mt-9 flex flex-wrap justify-center gap-3">

          <Link
            to="/properties"
            className="rounded-xl bg-blue-600 px-6 py-3 font-bold text-white shadow-lg"
          >
            Browse Hostels
          </Link>


          <Link
            to="/register"
            className="rounded-xl bg-white px-6 py-3 font-bold text-slate-900"
          >
            Create Account
          </Link>

        </div>

      </div>

    </main>
  );
}


function App() {
  return (
    <>

      <AppHeader />


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
          path="/owner/properties/:propertyId/media"
          element={
            <ProtectedRoute
              allowedRoles={[
                "owner",
              ]}
            >
              <OwnerPropertyMedia />
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
            <main className="min-h-[calc(100vh-65px)] bg-slate-100 p-8">

              <div className="mx-auto max-w-2xl rounded-2xl bg-white p-10 text-center shadow-sm">

                <p className="text-sm font-bold uppercase tracking-widest text-slate-400">
                  404
                </p>

                <h1 className="mt-2 text-3xl font-black">
                  Page Not Found
                </h1>

                <Link
                  to="/"
                  className="mt-6 inline-block rounded-lg bg-slate-900 px-4 py-2 font-bold text-white"
                >
                  Return Home
                </Link>

              </div>

            </main>
          }
        />

      </Routes>

    </>
  );
}


export default App;