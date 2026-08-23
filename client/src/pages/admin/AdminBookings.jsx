import {
  useEffect,
  useState,
} from "react";

import {
  Link,
} from "react-router-dom";

import {
  getAdminBookings,
} from "../../api/adminApi";


const STATUSES = [
  "",
  "pending",
  "approved",
  "rejected",
  "cancelled",
  "completed",
];


export default function AdminBookings() {
  const [
    bookings,
    setBookings,
  ] =
    useState(
      []
    );

  const [
    status,
    setStatus,
  ] =
    useState(
      ""
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


    getAdminBookings(
      status
    )
      .then(
        (
          data
        ) => {
          if (
            !ignore
          ) {
            setBookings(
              Array.isArray(
                data.bookings
              )
                ? data.bookings
                : []
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
              "Unable to load bookings"
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
  }, [status]);


  function handleStatusChange(
    event
  ) {
    setLoading(
      true
    );

    setError(
      ""
    );

    setStatus(
      event.target.value
    );
  }


  return (
    <main className="min-h-screen bg-slate-100 p-8">

      <div className="mx-auto max-w-6xl">

        <Link
          to="/admin/dashboard"
          className="font-semibold text-blue-600"
        >
          ← Dashboard
        </Link>


        <div className="mt-3 flex flex-wrap items-center justify-between gap-3">

          <h1 className="text-3xl font-bold">
            Platform Bookings
          </h1>


          <select
            value={
              status
            }
            onChange={
              handleStatusChange
            }
            className="rounded border bg-white px-3 py-2"
          >

            {
              STATUSES.map(
                (
                  item
                ) => (

                  <option
                    key={
                      item ||
                      "all"
                    }
                    value={
                      item
                    }
                  >
                    {
                      item
                        ? item
                            .charAt(
                              0
                            )
                            .toUpperCase() +
                          item.slice(
                            1
                          )

                        : "All"
                    }
                  </option>

                )
              )
            }

          </select>

        </div>


        {
          error && (
            <p className="mt-4 text-red-600">
              {error}
            </p>
          )
        }


        {
          loading ? (

            <p className="mt-6">
              Loading bookings...
            </p>

          ) : bookings.length ===
            0 ? (

            <div className="mt-6 rounded-xl bg-white p-8 text-center shadow-sm">

              <p className="text-slate-600">
                No bookings found.
              </p>

            </div>

          ) : (

            <div className="mt-6 space-y-4">

              {
                bookings.map(
                  (
                    booking
                  ) => (

                    <article
                      key={
                        booking._id
                      }
                      className="rounded-xl bg-white p-5 shadow-sm"
                    >

                      <div className="flex flex-col gap-3 sm:flex-row sm:justify-between">

                        <div>

                          <h2 className="font-bold">
                            {
                              booking.property
                                ?.name
                            }
                          </h2>

                          <p className="mt-1 text-slate-600">
                            Customer:{" "}
                            {
                              booking.customer
                                ?.name
                            }
                          </p>

                          <p className="text-sm text-slate-500">
                            Owner:{" "}
                            {
                              booking.owner
                                ?.name
                            }
                          </p>

                        </div>


                        <span className="h-fit rounded-full bg-slate-100 px-3 py-1 font-semibold capitalize">
                          {
                            booking.status
                          }
                        </span>

                      </div>


                      <p className="mt-4">
                        Room{" "}
                        {
                          booking.room
                            ?.roomNumber
                        }
                        {" • "}
                        Bed{" "}
                        {
                          booking.bed
                            ?.bedNumber
                        }
                      </p>

                      <p>
                        $
                        {
                          booking.monthlyRentAtBooking
                        }
                        /month
                      </p>

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