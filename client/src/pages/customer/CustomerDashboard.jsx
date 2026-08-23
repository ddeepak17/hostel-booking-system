import {
  Link,
} from "react-router-dom";

import useAuth from "../../hooks/useAuth";


export default function CustomerDashboard() {
  const {
    user,
    logout,
  } =
    useAuth();


  return (
    <main className="min-h-screen bg-slate-100 p-8">

      <div className="mx-auto max-w-5xl">

        <div className="rounded-xl bg-white p-6 shadow-sm">

          <div className="flex items-center justify-between gap-4">

            <div>

              <h1 className="text-3xl font-bold">
                Customer Dashboard
              </h1>

              <p className="mt-3 text-slate-600">
                Welcome,{" "}
                {user?.name}
              </p>

              <p className="mt-1 text-slate-500">
                {user?.email}
              </p>

            </div>


            <button
              onClick={
                logout
              }
              className="rounded bg-slate-900 px-4 py-2 font-semibold text-white"
            >
              Logout
            </button>

          </div>


          <div className="mt-8 grid gap-4 md:grid-cols-3">

            <Link
              to="/properties"
              className="rounded-xl border p-5 hover:shadow"
            >

              <h2 className="font-bold">
                Browse Hostels
              </h2>

              <p className="mt-2 text-sm text-slate-600">
                Search and filter available properties.
              </p>

            </Link>


            <Link
              to="/customer/bookings"
              className="rounded-xl border p-5 hover:shadow"
            >

              <h2 className="font-bold">
                My Bookings
              </h2>

              <p className="mt-2 text-sm text-slate-600">
                View booking status and history.
              </p>

            </Link>


            <Link
              to="/customer/profile"
              className="rounded-xl border p-5 hover:shadow"
            >

              <h2 className="font-bold">
                My Profile
              </h2>

              <p className="mt-2 text-sm text-slate-600">
                Update your account information.
              </p>

            </Link>

          </div>

        </div>

      </div>

    </main>
  );
}