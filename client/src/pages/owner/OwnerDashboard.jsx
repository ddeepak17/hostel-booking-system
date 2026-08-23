import {
  useEffect,
  useState,
} from "react";

import {
  Link,
} from "react-router-dom";

import useAuth from "../../hooks/useAuth";

import {
  getOwnerBookings,
  getOwnerProperties,
  getOwnerTenants,
} from "../../api/ownerApi";


export default function OwnerDashboard() {
  const {
    user,
    logout,
  } = useAuth();

  const [
    properties,
    setProperties,
  ] = useState([]);

  const [
    bookings,
    setBookings,
  ] = useState([]);

  const [
    tenants,
    setTenants,
  ] = useState([]);

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    error,
    setError,
  ] = useState("");


  useEffect(() => {
    let ignore = false;

    Promise.all([
      getOwnerProperties(),
      getOwnerBookings(),
      getOwnerTenants(),
    ])
      .then(
        ([
          propertyData,
          bookingData,
          tenantData,
        ]) => {
          if (ignore) {
            return;
          }

          setProperties(
            Array.isArray(
              propertyData.properties
            )
              ? propertyData.properties
              : []
          );

          setBookings(
            Array.isArray(
              bookingData.bookings
            )
              ? bookingData.bookings
              : []
          );

          setTenants(
            Array.isArray(
              tenantData.tenants
            )
              ? tenantData.tenants
              : []
          );
        }
      )
      .catch((error) => {
        if (ignore) {
          return;
        }

        console.error(error);

        setError(
          error.response?.data?.message ||
            "Unable to load owner dashboard"
        );
      })
      .finally(() => {
        if (!ignore) {
          setLoading(false);
        }
      });

    return () => {
      ignore = true;
    };
  }, []);


  const pendingBookings =
    bookings.filter(
      (booking) =>
        booking.status ===
        "pending"
    );

  const approvedBookings =
    bookings.filter(
      (booking) =>
        booking.status ===
        "approved"
    );

  const activeMonthlyRent =
    tenants.reduce(
      (
        total,
        tenant
      ) =>
        total +
        (
          tenant.monthlyRentAtBooking ||
          0
        ),
      0
    );


  if (loading) {
    return (
      <main className="min-h-screen bg-slate-100 p-8">

        <div className="mx-auto max-w-6xl">
          Loading owner dashboard...
        </div>

      </main>
    );
  }


  return (
    <main className="min-h-screen bg-slate-100 p-8">

      <div className="mx-auto max-w-6xl">

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

          <div>

            <h1 className="text-3xl font-bold text-slate-900">
              Property Owner Dashboard
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
            <div className="mt-6 rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
              {error}
            </div>
          )
        }


        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">

          <div className="rounded-xl bg-white p-5 shadow-sm">

            <p className="text-sm text-slate-500">
              Properties
            </p>

            <p className="mt-2 text-3xl font-bold">
              {properties.length}
            </p>

          </div>


          <div className="rounded-xl bg-white p-5 shadow-sm">

            <p className="text-sm text-slate-500">
              Pending Requests
            </p>

            <p className="mt-2 text-3xl font-bold">
              {
                pendingBookings.length
              }
            </p>

          </div>


          <div className="rounded-xl bg-white p-5 shadow-sm">

            <p className="text-sm text-slate-500">
              Approved Bookings
            </p>

            <p className="mt-2 text-3xl font-bold">
              {
                approvedBookings.length
              }
            </p>

          </div>


          <div className="rounded-xl bg-white p-5 shadow-sm">

            <p className="text-sm text-slate-500">
              Current Tenants
            </p>

            <p className="mt-2 text-3xl font-bold">
              {tenants.length}
            </p>

          </div>


          <div className="rounded-xl bg-white p-5 shadow-sm">

            <p className="text-sm text-slate-500">
              Active Monthly Rent
            </p>

            <p className="mt-2 text-3xl font-bold">
              ${activeMonthlyRent}
            </p>

          </div>

        </div>


        <div className="mt-8 grid gap-6 md:grid-cols-3">

          <Link
            to="/owner/properties"
            className="rounded-xl bg-white p-6 shadow-sm transition hover:shadow-md"
          >

            <h2 className="text-xl font-bold">
              Manage Properties
            </h2>

            <p className="mt-2 text-slate-600">
              Configure properties, buildings, floors, rooms, beds, pricing, and availability.
            </p>

            <p className="mt-4 font-semibold text-blue-600">
              Open properties →
            </p>

          </Link>


          <Link
            to="/owner/bookings"
            className="rounded-xl bg-white p-6 shadow-sm transition hover:shadow-md"
          >

            <h2 className="text-xl font-bold">
              Manage Bookings
            </h2>

            <p className="mt-2 text-slate-600">
              Review requests, approve or reject bookings, and complete stays.
            </p>

            <p className="mt-4 font-semibold text-blue-600">
              Open bookings →
            </p>

          </Link>


          <Link
            to="/owner/tenants"
            className="rounded-xl bg-white p-6 shadow-sm transition hover:shadow-md"
          >

            <h2 className="text-xl font-bold">
              Current Tenants
            </h2>

            <p className="mt-2 text-slate-600">
              View customers with active approved bookings.
            </p>

            <p className="mt-4 font-semibold text-blue-600">
              View tenants →
            </p>

          </Link>

        </div>


        <div className="mt-8 rounded-xl bg-white p-6 shadow-sm">

          <h2 className="text-xl font-bold">
            Account
          </h2>

          <p className="mt-4">
            <strong>
              Email:
            </strong>{" "}
            {user?.email}
          </p>

          <p className="mt-2">
            <strong>
              Role:
            </strong>{" "}
            {user?.role}
          </p>

        </div>

      </div>

    </main>
  );
}