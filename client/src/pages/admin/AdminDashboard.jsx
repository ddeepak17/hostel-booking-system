import {
  useEffect,
  useState,
} from "react";

import {
  Link,
} from "react-router-dom";

import useAuth from "../../hooks/useAuth";

import {
  getAdminOverview,
} from "../../api/adminApi";


export default function AdminDashboard() {
  const {
    user,
    logout,
  } =
    useAuth();


  const [
    overview,
    setOverview,
  ] =
    useState(
      null
    );

  const [
    loading,
    setLoading,
  ] =
    useState(
      true
    );

  const [
    error,
    setError,
  ] =
    useState(
      ""
    );


  useEffect(() => {
    let ignore =
      false;


    getAdminOverview()
      .then(
        (
          data
        ) => {
          if (
            !ignore
          ) {
            setOverview(
              data.overview
            );
          }
        }
      )
      .catch(
        (
          error
        ) => {
          if (
            !ignore
          ) {
            setError(
              error.response
                ?.data
                ?.message ||
              "Unable to load admin dashboard"
            );
          }
        }
      )
      .finally(
        () => {
          if (
            !ignore
          ) {
            setLoading(
              false
            );
          }
        }
      );


    return () => {
      ignore =
        true;
    };
  }, []);


  if (loading) {
    return (
      <main className="min-h-screen bg-slate-100 p-8">
        Loading admin dashboard...
      </main>
    );
  }


  return (
    <main className="min-h-screen bg-slate-100 p-8">

      <div className="mx-auto max-w-6xl">

        <div className="flex items-center justify-between gap-4">

          <div>

            <h1 className="text-3xl font-bold">
              Super Admin Dashboard
            </h1>

            <p className="mt-2 text-slate-600">
              Welcome, {user?.name}
            </p>

          </div>


          <button
            onClick={
              logout
            }
            className="rounded-lg bg-slate-900 px-4 py-2 font-semibold text-white"
          >
            Logout
          </button>

        </div>


        {
          error && (
            <p className="mt-5 text-red-600">
              {error}
            </p>
          )
        }


        {
          overview && (

            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

              {
                [
                  [
                    "Users",
                    overview.totalUsers,
                  ],

                  [
                    "Owners",
                    overview.totalOwners,
                  ],

                  [
                    "Properties",
                    overview.totalProperties,
                  ],

                  [
                    "Bookings",
                    overview.totalBookings,
                  ],

                  [
                    "Pending",
                    overview.pendingBookings,
                  ],

                  [
                    "Active Tenants",
                    overview.activeTenants,
                  ],

                  [
                    "Customers",
                    overview.totalCustomers,
                  ],

                  [
                    "Active Monthly Rent",
                    `$${overview.activeMonthlyRent}`,
                  ],
                ].map(
                  ([
                    label,
                    value,
                  ]) => (

                    <div
                      key={
                        label
                      }
                      className="rounded-xl bg-white p-5 shadow-sm"
                    >

                      <p className="text-sm text-slate-500">
                        {label}
                      </p>

                      <p className="mt-2 text-3xl font-bold">
                        {value}
                      </p>

                    </div>

                  )
                )
              }

            </div>

          )
        }


        <div className="mt-8 grid gap-5 md:grid-cols-2">

          {
            [
              [
                "/admin/owners",
                "Property Owners",
                "Create and manage Property Owner accounts.",
              ],

              [
                "/admin/users",
                "Users",
                "View customers and owners and control account status.",
              ],

              [
                "/admin/properties",
                "Properties",
                "Review properties across the platform.",
              ],

              [
                "/admin/bookings",
                "Bookings",
                "View platform-wide booking activity.",
              ],
            ].map(
              ([
                to,
                title,
                description,
              ]) => (

                <Link
                  key={
                    to
                  }
                  to={
                    to
                  }
                  className="rounded-xl bg-white p-6 shadow-sm hover:shadow-md"
                >

                  <h2 className="text-xl font-bold">
                    {title}
                  </h2>

                  <p className="mt-2 text-slate-600">
                    {description}
                  </p>

                  <p className="mt-4 font-semibold text-blue-600">
                    Open →
                  </p>

                </Link>

              )
            )
          }

        </div>

      </div>

    </main>
  );
}