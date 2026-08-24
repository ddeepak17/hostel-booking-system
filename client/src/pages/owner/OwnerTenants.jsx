import {
  useEffect,
  useState,
} from "react";

import {
  getOwnerTenants,
} from "../../api/ownerApi";


export default function OwnerTenants() {
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
    async function loadTenants() {
      try {
        const data =
          await getOwnerTenants();

        setTenants(
          Array.isArray(data.tenants)
            ? data.tenants
            : []
        );
      } catch (error) {
        console.error(error);

        setError(
          error.response?.data?.message ||
            "Unable to load tenants"
        );
      } finally {
        setLoading(false);
      }
    }

    loadTenants();
  }, []);


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


  return (
    <main className="min-h-[calc(100vh-65px)] bg-slate-100 px-4 py-8 sm:px-6">

      <div className="mx-auto max-w-6xl">

        <div>

          <div>
            <h1 className="text-3xl font-bold text-slate-900">
              Current Tenants
            </h1>

            <p className="mt-2 text-slate-600">
              Active approved bookings for your properties.
            </p>
          </div>
        </div>


        {
          error && (
            <div className="mt-6 rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
              {error}
            </div>
          )
        }


        {
          loading ? (

            <p className="mt-8">
              Loading tenants...
            </p>

          ) : (

            <>
              <div className="mt-8 grid gap-4 sm:grid-cols-2">

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


              {
                tenants.length === 0 ? (

                  <div className="mt-8 rounded-xl bg-white p-8 text-center shadow-sm">

                    <h2 className="text-xl font-bold">
                      No current tenants
                    </h2>

                    <p className="mt-2 text-slate-600">
                      Approved active bookings will appear here.
                    </p>

                  </div>

                ) : (

                  <div className="mt-8 grid gap-5 md:grid-cols-2">

                    {
                      tenants.map(
                        (tenant) => (

                          <article
                            key={tenant._id}
                            className="rounded-xl bg-white p-6 shadow-sm"
                          >

                            <h2 className="text-xl font-bold text-slate-900">
                              {tenant.customer?.name || "Customer"}
                            </h2>

                            <p className="mt-1 text-slate-600">
                              {tenant.customer?.email}
                            </p>

                            {
                              tenant.customer?.phone && (
                                <p className="text-sm text-slate-500">
                                  {tenant.customer.phone}
                                </p>
                              )
                            }


                            <div className="mt-5 border-t pt-4">

                              <p>
                                <strong>
                                  Property:
                                </strong>{" "}
                                {tenant.property?.name}
                              </p>

                              <p className="mt-2">
                                <strong>
                                  Room:
                                </strong>{" "}
                                {tenant.room?.roomNumber}
                              </p>

                              <p className="mt-2">
                                <strong>
                                  Bed:
                                </strong>{" "}
                                {tenant.bed?.bedNumber}
                              </p>

                              <p className="mt-2">
                                <strong>
                                  Check-in:
                                </strong>{" "}
                                {
                                  tenant.checkInDate
                                    ? new Date(
                                        tenant.checkInDate
                                      ).toLocaleDateString()
                                    : "-"
                                }
                              </p>

                              <p className="mt-2">
                                <strong>
                                  Monthly rent:
                                </strong>{" "}
                                ${tenant.monthlyRentAtBooking}
                              </p>

                              <p className="mt-2">
                                <strong>
                                  Security deposit:
                                </strong>{" "}
                                ${tenant.securityDepositAtBooking}
                              </p>

                            </div>

                          </article>

                        )
                      )
                    }

                  </div>

                )
              }

            </>

          )
        }

      </div>

    </main>
  );
}
