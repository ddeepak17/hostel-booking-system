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
    <main className="min-h-[calc(100vh-65px)] overflow-hidden bg-slate-950 text-white">

      <section className="relative px-4 py-16 sm:px-6 sm:py-24">

        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(37,99,235,0.28),transparent_38%),radial-gradient(circle_at_bottom_right,rgba(14,165,233,0.16),transparent_32%)]" />


        <div className="relative mx-auto grid max-w-6xl items-center gap-14 lg:grid-cols-[1.15fr_0.85fr]">

          <div>

            <p className="inline-flex rounded-full border border-blue-400/30 bg-blue-400/10 px-4 py-2 text-sm font-semibold text-blue-100">
              Student accommodation, all in one place
            </p>


            <h1 className="mt-6 max-w-3xl text-4xl font-black tracking-tight sm:text-6xl">
              Find a room that feels right. Reserve it with confidence.
            </h1>


            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
              Explore verified property details, compare room pricing and availability, and keep every booking update in one clear dashboard.
            </p>


            <div className="mt-9 flex flex-wrap gap-3">

              <Link
                to="/properties"
                className="rounded-xl bg-blue-600 px-6 py-3 font-bold text-white shadow-lg shadow-blue-950/40 hover:bg-blue-500"
              >
                Browse Hostels
              </Link>


              <Link
                to="/register"
                className="rounded-xl border border-white/15 bg-white px-6 py-3 font-bold text-slate-900 hover:bg-slate-100"
              >
                Create Account
              </Link>

            </div>


            <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm text-slate-400">
              <span>Room-level pricing</span>
              <span>Live bed availability</span>
              <span>Booking status tracking</span>
            </div>

          </div>


          <div className="rounded-3xl border border-white/10 bg-white/5 p-5 shadow-2xl shadow-blue-950/30 backdrop-blur sm:p-7">

            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-blue-200">
                  A simpler booking journey
                </p>
                <h2 className="mt-1 text-2xl font-black">
                  From search to move-in
                </h2>
              </div>
              <span className="rounded-full bg-emerald-400/15 px-3 py-1 text-xs font-bold text-emerald-200">
                Live availability
              </span>
            </div>


            <ol className="mt-7 space-y-4">
              {[
                [
                  "01",
                  "Discover",
                  "Filter hostels by location, price, amenities, and room type.",
                ],
                [
                  "02",
                  "Compare",
                  "Review photos, rooms, deposits, available beds, and resident feedback.",
                ],
                [
                  "03",
                  "Request",
                  "Choose a check-in date and follow the booking through approval.",
                ],
              ].map(([
                number,
                title,
                description,
              ]) => (
                <li
                  key={number}
                  className="flex gap-4 rounded-2xl border border-white/10 bg-slate-900/70 p-4"
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-sm font-black">
                    {number}
                  </span>
                  <div>
                    <h3 className="font-bold">
                      {title}
                    </h3>
                    <p className="mt-1 text-sm leading-6 text-slate-400">
                      {description}
                    </p>
                  </div>
                </li>
              ))}
            </ol>

          </div>

        </div>

      </section>


      <section className="border-t border-white/10 bg-slate-900/55 px-4 py-10 sm:px-6">
        <div className="mx-auto grid max-w-6xl gap-6 md:grid-cols-3">
          {[
            [
              "Students",
              "Search properties, request a bed, manage bookings, and review completed stays.",
            ],
            [
              "Property owners",
              "Manage inventory, availability, booking decisions, tenants, media, and location details.",
            ],
            [
              "Platform admins",
              "Oversee users, owners, properties, bookings, and high-level platform activity.",
            ],
          ].map(([
            title,
            description,
          ]) => (
            <article
              key={title}
              className="rounded-2xl border border-white/10 p-5"
            >
              <h2 className="font-bold text-white">
                {title}
              </h2>
              <p className="mt-2 text-sm leading-6 text-slate-400">
                {description}
              </p>
            </article>
          ))}
        </div>
      </section>

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
