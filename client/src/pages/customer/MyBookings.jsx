import {
  useEffect,
  useState,
} from "react";

import {
  getMyBookings,
  cancelBooking,
} from "../../api/bookingApi";
import {
  getBookingStatusClasses,
} from "../../utils/statusStyles";


export default function MyBookings() {
  const [
    bookings,
    setBookings,
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

    getMyBookings()
      .then((data) => {
        if (ignore) {
          return;
        }

        setBookings(
          Array.isArray(data.bookings)
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
            "Unable to load bookings"
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


  async function handleCancel(
    bookingId
  ) {
    const confirmed =
      window.confirm(
        "Cancel this booking?"
      );

    if (!confirmed) {
      return;
    }

    try {
      await cancelBooking(
        bookingId,
        "Customer cancelled"
      );

      const data =
        await getMyBookings();

      setBookings(
        Array.isArray(data.bookings)
          ? data.bookings
          : []
      );

      setError("");
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Unable to cancel booking"
      );
    }
  }


  if (loading) {
    return (
      <main className="min-h-[calc(100vh-65px)] bg-slate-100 px-4 py-8 sm:px-6">

        <div className="mx-auto max-w-5xl">

          <h1 className="text-3xl font-bold text-slate-900">
            My Bookings
          </h1>

          <p className="mt-3 text-slate-600">
            Loading bookings...
          </p>

        </div>

      </main>
    );
  }


  return (
    <main className="min-h-[calc(100vh-65px)] bg-slate-100 px-4 py-8 sm:px-6">

      <div className="mx-auto max-w-5xl">

        <h1 className="text-3xl font-bold text-slate-900">
          My Bookings
        </h1>


        {
          error && (
            <div className="mt-5 rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
              {error}
            </div>
          )
        }


        {
          bookings.length === 0 ? (

            <div className="mt-6 rounded-xl bg-white p-8 text-center shadow-sm">

              <h2 className="text-xl font-bold text-slate-900">
                No bookings yet
              </h2>

              <p className="mt-2 text-slate-600">
                Your booking requests will appear here.
              </p>

            </div>

          ) : (

            <div className="mt-6 space-y-4">

              {
                bookings.map(
                  (booking) => (

                    <article
                      key={booking._id}
                      className="rounded-xl border bg-white p-5 shadow-sm"
                    >

                      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">

                        <div>

                          <h2 className="text-xl font-bold text-slate-900">
                            {booking.property?.name}
                          </h2>

                          <p className="mt-2 text-slate-600">
                            Room{" "}
                            {booking.room?.roomNumber}
                            {" • "}
                            Bed{" "}
                            {booking.bed?.bedNumber}
                          </p>

                        </div>


                        <span
                          className={`w-fit rounded-full px-3 py-1 text-sm font-semibold capitalize ${getBookingStatusClasses(
                            booking.status
                          )}`}
                        >
                          {booking.status}
                        </span>

                      </div>


                      <div className="mt-4 grid gap-3 sm:grid-cols-2">

                        <p>
                          <strong>
                            Check-in:
                          </strong>{" "}
                          {
                            booking.checkInDate
                              ? new Date(
                                  booking.checkInDate
                                ).toLocaleDateString()
                              : "-"
                          }
                        </p>

                        <p>
                          <strong>
                            Monthly rent:
                          </strong>{" "}
                          $
                          {
                            booking.monthlyRentAtBooking
                          }
                        </p>

                        <p>
                          <strong>
                            Security deposit:
                          </strong>{" "}
                          $
                          {
                            booking.securityDepositAtBooking
                          }
                        </p>

                      </div>


                      {
                        booking.ownerNote && (
                          <p className="mt-3 text-sm text-slate-600">
                            <strong>
                              Owner note:
                            </strong>{" "}
                            {booking.ownerNote}
                          </p>
                        )
                      }


                      {
                        booking.cancellationReason && (
                          <p className="mt-3 text-sm text-slate-600">
                            <strong>
                              Cancellation reason:
                            </strong>{" "}
                            {
                              booking.cancellationReason
                            }
                          </p>
                        )
                      }


                      {
                        (
                          booking.status ===
                            "pending" ||
                          booking.status ===
                            "approved"
                        ) && (

                          <button
                            onClick={() =>
                              handleCancel(
                                booking._id
                              )
                            }
                            className="mt-5 rounded-lg bg-red-600 px-4 py-2 font-semibold text-white"
                          >
                            Cancel Booking
                          </button>

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
