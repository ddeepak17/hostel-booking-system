import {
  useEffect,
  useState,
} from "react";

import {
  Link,
} from "react-router-dom";

import {
  approveOwnerBooking,
  completeOwnerBooking,
  getOwnerBookings,
  rejectOwnerBooking,
} from "../../api/ownerApi";


const FILTERS = [
  "all",
  "pending",
  "approved",
  "rejected",
  "cancelled",
  "completed",
];


function statusClasses(
  status
) {
  switch (status) {
    case "pending":
      return "bg-amber-100 text-amber-800";

    case "approved":
      return "bg-green-100 text-green-800";

    case "rejected":
      return "bg-red-100 text-red-800";

    case "cancelled":
      return "bg-slate-200 text-slate-700";

    case "completed":
      return "bg-blue-100 text-blue-800";

    default:
      return "bg-slate-100 text-slate-700";
  }
}


export default function OwnerBookings() {
  const [
    bookings,
    setBookings,
  ] = useState([]);

  const [
    filter,
    setFilter,
  ] = useState("all");

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    error,
    setError,
  ] = useState("");

  const [
    actionBookingId,
    setActionBookingId,
  ] = useState(null);


  useEffect(() => {
    let ignore = false;

    const status =
      filter === "all"
        ? ""
        : filter;

    getOwnerBookings(
      status
    )
      .then((data) => {
        if (ignore) {
          return;
        }

        setBookings(
          Array.isArray(
            data.bookings
          )
            ? data.bookings
            : []
        );
      })
      .catch((error) => {
        if (ignore) {
          return;
        }

        console.error(error);

        setError(
          error.response?.data?.message ||
            "Unable to load owner bookings"
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
  }, [filter]);


  function handleFilterChange(
    nextFilter
  ) {
    if (
      nextFilter === filter
    ) {
      return;
    }

    setError("");
    setLoading(true);
    setFilter(nextFilter);
  }


  async function refreshBookings() {
    const data =
      await getOwnerBookings(
        filter === "all"
          ? ""
          : filter
      );

    setBookings(
      Array.isArray(
        data.bookings
      )
        ? data.bookings
        : []
    );
  }


  async function handleApprove(
    bookingId
  ) {
    const confirmed =
      window.confirm(
        "Approve this booking?"
      );

    if (!confirmed) {
      return;
    }

    const note =
      window.prompt(
        "Optional note for the customer:",
        ""
      );

    if (note === null) {
      return;
    }

    try {
      setActionBookingId(
        bookingId
      );

      await approveOwnerBooking(
        bookingId,
        note
      );

      await refreshBookings();
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Unable to approve booking"
      );
    } finally {
      setActionBookingId(null);
    }
  }


  async function handleReject(
    bookingId
  ) {
    const confirmed =
      window.confirm(
        "Reject this booking?"
      );

    if (!confirmed) {
      return;
    }

    const note =
      window.prompt(
        "Optional rejection note:",
        ""
      );

    if (note === null) {
      return;
    }

    try {
      setActionBookingId(
        bookingId
      );

      await rejectOwnerBooking(
        bookingId,
        note
      );

      await refreshBookings();
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Unable to reject booking"
      );
    } finally {
      setActionBookingId(null);
    }
  }


  async function handleComplete(
    bookingId
  ) {
    const confirmed =
      window.confirm(
        "Mark this stay as completed? The bed will become available again."
      );

    if (!confirmed) {
      return;
    }

    try {
      setActionBookingId(
        bookingId
      );

      await completeOwnerBooking(
        bookingId
      );

      await refreshBookings();
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Unable to complete booking"
      );
    } finally {
      setActionBookingId(null);
    }
  }


  return (
    <main className="min-h-screen bg-slate-100 p-8">

      <div className="mx-auto max-w-6xl">

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

          <div>

            <h1 className="text-3xl font-bold text-slate-900">
              Owner Bookings
            </h1>

            <p className="mt-2 text-slate-600">
              Review and manage booking requests.
            </p>

          </div>


          <Link
            to="/owner/dashboard"
            className="font-semibold text-blue-600"
          >
            ← Dashboard
          </Link>

        </div>


        <div className="mt-6 flex flex-wrap gap-2">

          {
            FILTERS.map(
              (item) => (

                <button
                  key={item}
                  onClick={() =>
                    handleFilterChange(
                      item
                    )
                  }
                  className={
                    filter === item
                      ? "rounded-lg bg-slate-900 px-4 py-2 font-semibold capitalize text-white"
                      : "rounded-lg bg-white px-4 py-2 font-semibold capitalize text-slate-700 shadow-sm"
                  }
                >
                  {item}
                </button>

              )
            )
          }

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
              Loading bookings...
            </p>

          ) : bookings.length ===
            0 ? (

            <div className="mt-8 rounded-xl bg-white p-8 text-center shadow-sm">

              <h2 className="text-xl font-bold">
                No bookings found
              </h2>

              <p className="mt-2 text-slate-600">
                There are no{" "}
                {
                  filter === "all"
                    ? ""
                    : filter
                }{" "}
                bookings to display.
              </p>

            </div>

          ) : (

            <div className="mt-8 space-y-5">

              {
                bookings.map(
                  (booking) => (

                    <article
                      key={booking._id}
                      className="rounded-xl bg-white p-6 shadow-sm"
                    >

                      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">

                        <div>

                          <h2 className="text-xl font-bold text-slate-900">
                            {
                              booking.property?.name ||
                              "Property"
                            }
                          </h2>

                          <p className="mt-2 text-slate-600">
                            {
                              booking.customer?.name ||
                              "Customer"
                            }
                          </p>

                          <p className="text-sm text-slate-500">
                            {
                              booking.customer?.email
                            }
                          </p>

                          {
                            booking.customer?.phone && (
                              <p className="text-sm text-slate-500">
                                {
                                  booking.customer.phone
                                }
                              </p>
                            )
                          }

                        </div>


                        <span
                          className={`w-fit rounded-full px-3 py-1 text-sm font-semibold capitalize ${statusClasses(
                            booking.status
                          )}`}
                        >
                          {booking.status}
                        </span>

                      </div>


                      <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">

                        <div>
                          <p className="text-xs uppercase tracking-wide text-slate-400">
                            Room
                          </p>

                          <p className="font-semibold">
                            {
                              booking.room?.roomNumber ||
                              "-"
                            }
                          </p>
                        </div>


                        <div>
                          <p className="text-xs uppercase tracking-wide text-slate-400">
                            Bed
                          </p>

                          <p className="font-semibold">
                            {
                              booking.bed?.bedNumber ||
                              "-"
                            }
                          </p>
                        </div>


                        <div>
                          <p className="text-xs uppercase tracking-wide text-slate-400">
                            Check-in
                          </p>

                          <p className="font-semibold">
                            {
                              booking.checkInDate
                                ? new Date(
                                    booking.checkInDate
                                  ).toLocaleDateString()
                                : "-"
                            }
                          </p>
                        </div>


                        <div>
                          <p className="text-xs uppercase tracking-wide text-slate-400">
                            Rent
                          </p>

                          <p className="font-semibold">
                            $
                            {
                              booking.monthlyRentAtBooking
                            }
                            /month
                          </p>
                        </div>

                      </div>


                      <div className="mt-4">

                        <p className="text-sm text-slate-600">
                          Security deposit:{" "}
                          <strong>
                            $
                            {
                              booking.securityDepositAtBooking
                            }
                          </strong>
                        </p>


                        {
                          booking.customerNote && (
                            <p className="mt-2 text-sm text-slate-600">
                              <strong>
                                Customer note:
                              </strong>{" "}
                              {
                                booking.customerNote
                              }
                            </p>
                          )
                        }


                        {
                          booking.ownerNote && (
                            <p className="mt-2 text-sm text-slate-600">
                              <strong>
                                Owner note:
                              </strong>{" "}
                              {
                                booking.ownerNote
                              }
                            </p>
                          )
                        }

                      </div>


                      {
                        booking.status ===
                          "pending" && (

                          <div className="mt-5 flex flex-wrap gap-3">

                            <button
                              disabled={
                                actionBookingId ===
                                booking._id
                              }
                              onClick={() =>
                                handleApprove(
                                  booking._id
                                )
                              }
                              className="rounded-lg bg-green-600 px-4 py-2 font-semibold text-white disabled:opacity-50"
                            >
                              Approve
                            </button>


                            <button
                              disabled={
                                actionBookingId ===
                                booking._id
                              }
                              onClick={() =>
                                handleReject(
                                  booking._id
                                )
                              }
                              className="rounded-lg bg-red-600 px-4 py-2 font-semibold text-white disabled:opacity-50"
                            >
                              Reject
                            </button>

                          </div>

                        )
                      }


                      {
                        booking.status ===
                          "approved" && (

                          <div className="mt-5">

                            <button
                              disabled={
                                actionBookingId ===
                                booking._id
                              }
                              onClick={() =>
                                handleComplete(
                                  booking._id
                                )
                              }
                              className="rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white disabled:opacity-50"
                            >
                              Complete Stay
                            </button>

                          </div>

                        )
                      }

                    </article>

                  )
                )
              }

            </div>

          )
        }

      </div>

    </main>
  );
}