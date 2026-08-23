import {
  useEffect,
  useState,
} from "react";

import {
  Link,
  useParams,
} from "react-router-dom";

import useAuth from "../../hooks/useAuth";

import {
  getProperty,
  getPropertyRooms,
  getRoomBeds,
  createBooking,
} from "../../api/propertyApi";

import {
  getPropertyReviews,
  savePropertyReview,
} from "../../api/reviewApi";


export default function PropertyDetails() {
  const {
    propertyId,
  } =
    useParams();


  const {
    user,
  } =
    useAuth();


  const [
    property,
    setProperty,
  ] =
    useState(
      null
    );

  const [
    rooms,
    setRooms,
  ] =
    useState(
      []
    );

  const [
    beds,
    setBeds,
  ] =
    useState(
      {}
    );

  const [
    reviews,
    setReviews,
  ] =
    useState(
      []
    );

  const [
    averageRating,
    setAverageRating,
  ] =
    useState(
      0
    );

  const [
    rating,
    setRating,
  ] =
    useState(
      "5"
    );

  const [
    comment,
    setComment,
  ] =
    useState(
      ""
    );

  const [
    checkInDate,
    setCheckInDate,
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


  async function refreshReviews() {
    const data =
      await getPropertyReviews(
        propertyId
      );


    setReviews(
      Array.isArray(
        data.reviews
      )
        ? data.reviews
        : []
    );


    setAverageRating(
      data.averageRating ||
      0
    );
  }


  useEffect(() => {
    let ignore =
      false;


    Promise.all([
      getProperty(
        propertyId
      ),

      getPropertyRooms(
        propertyId
      ),

      getPropertyReviews(
        propertyId
      ),
    ])
      .then(
        ([
          propertyData,
          roomsData,
          reviewData,
        ]) => {
          if (
            ignore
          ) {
            return;
          }


          setProperty(
            propertyData.property
          );


          setRooms(
            Array.isArray(
              roomsData.rooms
            )
              ? roomsData.rooms
              : []
          );


          setReviews(
            Array.isArray(
              reviewData.reviews
            )
              ? reviewData.reviews
              : []
          );


          setAverageRating(
            reviewData.averageRating ||
            0
          );
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
              "Unable to load property"
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
  }, [propertyId]);


  async function showBeds(
    roomId
  ) {
    try {
      const data =
        await getRoomBeds(
          roomId
        );


      setBeds(
        (
          current
        ) => ({
          ...current,

          [roomId]:
            Array.isArray(
              data.beds
            )
              ? data.beds
              : [],
        })
      );
    } catch (error) {
      alert(
        error.response
          ?.data
          ?.message ||
        "Unable to load beds"
      );
    }
  }


  async function bookBed(
    bedId,
    roomId
  ) {
    if (
      !user
    ) {
      alert(
        "Please log in as a customer to book."
      );

      return;
    }


    if (
      user.role !==
      "customer"
    ) {
      alert(
        "Only customer accounts can create bookings."
      );

      return;
    }


    if (
      !checkInDate
    ) {
      alert(
        "Please select a check-in date."
      );

      return;
    }


    try {
      const data =
        await createBooking({
          bedId,
          checkInDate,
        });


      alert(
        data.message ||
        "Booking request submitted"
      );


      await showBeds(
        roomId
      );
    } catch (error) {
      alert(
        error.response
          ?.data
          ?.message ||
        "Unable to create booking"
      );
    }
  }


  async function handleReview(
    event
  ) {
    event.preventDefault();


    try {
      const data =
        await savePropertyReview(
          propertyId,
          {
            rating:
              Number(
                rating
              ),

            comment,
          }
        );


      alert(
        data.message ||
        "Review saved"
      );


      setComment(
        ""
      );


      await refreshReviews();
    } catch (error) {
      alert(
        error.response
          ?.data
          ?.message ||
        "Unable to save review"
      );
    }
  }


  if (loading) {
    return (
      <main className="p-8">
        Loading property...
      </main>
    );
  }


  if (
    error ||
    !property
  ) {
    return (
      <main className="p-8 text-red-600">
        {
          error ||
          "Property not found"
        }
      </main>
    );
  }


  return (
    <main className="min-h-screen bg-slate-100 p-8">

      <div className="mx-auto max-w-5xl">

        <Link
          to="/properties"
          className="font-semibold text-blue-600"
        >
          ← Browse Hostels
        </Link>


        <section className="mt-4 rounded-xl bg-white p-6 shadow-sm">

          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">

            <div>

              <h1 className="text-3xl font-bold">
                {
                  property.name
                }
              </h1>

              <p className="mt-3 text-slate-600">
                {
                  property.description
                }
              </p>

            </div>


            <div className="rounded-lg bg-amber-50 px-4 py-2 text-center">

              <p className="text-xl font-bold">
                {
                  reviews.length
                    ? `${averageRating} / 5`
                    : "New"
                }
              </p>

              <p className="text-xs text-slate-600">
                {
                  reviews.length
                }{" "}
                review
                {
                  reviews.length ===
                  1
                    ? ""
                    : "s"
                }
              </p>

            </div>

          </div>


          {
            property.address && (

              <p className="mt-4 text-sm text-slate-500">
                {
                  [
                    property.address.line1,
                    property.address.city,
                    property.address.state,
                    property.address.postalCode,
                    property.address.country,
                  ]
                    .filter(
                      Boolean
                    )
                    .join(
                      ", "
                    )
                }
              </p>

            )
          }


          <div className="mt-5 flex flex-wrap gap-2">

            {
              property.amenities?.map(
                (
                  amenity
                ) => (

                  <span
                    key={
                      amenity
                    }
                    className="rounded-full bg-slate-100 px-3 py-1 text-sm"
                  >
                    {
                      amenity
                    }
                  </span>

                )
              )
            }

          </div>

        </section>


        <section className="mt-8">

          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">

            <div>

              <h2 className="text-2xl font-bold">
                Rooms
              </h2>

              <p className="mt-1 text-slate-600">
                Choose a check-in date and select an available bed.
              </p>

            </div>


            <label>

              <span className="mb-1 block text-sm font-semibold">
                Check-in Date
              </span>

              <input
                type="date"
                value={
                  checkInDate
                }
                onChange={(
                  event
                ) =>
                  setCheckInDate(
                    event.target.value
                  )
                }
                className="rounded border bg-white px-3 py-2"
              />

            </label>

          </div>


          {
            rooms.length ===
            0 ? (

              <div className="mt-5 rounded-xl bg-white p-6">
                No rooms available.
              </div>

            ) : (

              rooms.map(
                (
                  room
                ) => (

                  <article
                    key={
                      room._id
                    }
                    className="mt-5 rounded-xl bg-white p-6 shadow-sm"
                  >

                    <h3 className="text-xl font-bold">
                      Room{" "}
                      {
                        room.roomNumber
                      }
                    </h3>


                    <div className="mt-3 grid gap-2 sm:grid-cols-4">

                      <p className="capitalize">
                        {
                          room.roomType
                        }
                      </p>

                      <p>
                        Capacity{" "}
                        {
                          room.capacity
                        }
                      </p>

                      <p>
                        $
                        {
                          room.monthlyRent
                        }
                        /month
                      </p>

                      <p>
                        Deposit $
                        {
                          room.securityDeposit
                        }
                      </p>

                    </div>


                    <button
                      onClick={() =>
                        showBeds(
                          room._id
                        )
                      }
                      className="mt-5 rounded bg-slate-900 px-4 py-2 font-semibold text-white"
                    >
                      View Beds
                    </button>


                    {
                      beds[
                        room._id
                      ] && (

                        <div className="mt-5 grid gap-3 sm:grid-cols-2">

                          {
                            beds[
                              room._id
                            ].map(
                              (
                                bed
                              ) => (

                                <div
                                  key={
                                    bed._id
                                  }
                                  className="rounded border p-4"
                                >

                                  <p className="font-bold">
                                    Bed{" "}
                                    {
                                      bed.bedNumber
                                    }
                                  </p>

                                  <p className="mt-1 capitalize text-slate-600">
                                    {
                                      bed.status
                                    }
                                  </p>


                                  {
                                    bed.status ===
                                    "available" && (

                                      <button
                                        onClick={() =>
                                          bookBed(
                                            bed._id,
                                            room._id
                                          )
                                        }
                                        className="mt-3 rounded bg-green-600 px-4 py-2 font-semibold text-white"
                                      >
                                        Book Now
                                      </button>

                                    )
                                  }

                                </div>

                              )
                            )
                          }

                        </div>

                      )
                    }

                  </article>

                )
              )

            )
          }

        </section>


        <section className="mt-10">

          <h2 className="text-2xl font-bold">
            Reviews
          </h2>


          {
            user?.role ===
            "customer" && (

              <form
                onSubmit={
                  handleReview
                }
                className="mt-5 rounded-xl bg-white p-5 shadow-sm"
              >

                <p className="font-semibold">
                  Leave or update your review
                </p>

                <p className="mt-1 text-sm text-slate-500">
                  Reviews are available after a completed stay.
                </p>


                <select
                  value={
                    rating
                  }
                  onChange={(
                    event
                  ) =>
                    setRating(
                      event.target.value
                    )
                  }
                  className="mt-4 rounded border px-3 py-2"
                >

                  <option value="5">
                    5 — Excellent
                  </option>

                  <option value="4">
                    4 — Very Good
                  </option>

                  <option value="3">
                    3 — Good
                  </option>

                  <option value="2">
                    2 — Fair
                  </option>

                  <option value="1">
                    1 — Poor
                  </option>

                </select>


                <textarea
                  value={
                    comment
                  }
                  onChange={(
                    event
                  ) =>
                    setComment(
                      event.target.value
                    )
                  }
                  placeholder="Share your experience"
                  rows="4"
                  className="mt-3 w-full rounded border px-3 py-2"
                />


                <button
                  className="mt-3 rounded bg-blue-600 px-4 py-2 font-semibold text-white"
                >
                  Save Review
                </button>

              </form>

            )
          }


          <div className="mt-5 space-y-4">

            {
              reviews.length ===
              0 ? (

                <div className="rounded-xl bg-white p-6 text-slate-600">
                  No reviews yet.
                </div>

              ) : (

                reviews.map(
                  (
                    review
                  ) => (

                    <article
                      key={
                        review._id
                      }
                      className="rounded-xl bg-white p-5 shadow-sm"
                    >

                      <div className="flex justify-between gap-3">

                        <strong>
                          {
                            review.customer
                              ?.name ||
                            "Customer"
                          }
                        </strong>

                        <span className="font-semibold">
                          {
                            review.rating
                          }
                          /5
                        </span>

                      </div>


                      {
                        review.comment && (

                          <p className="mt-3 text-slate-600">
                            {
                              review.comment
                            }
                          </p>

                        )
                      }

                    </article>

                  )
                )

              )
            }

          </div>

        </section>

      </div>

    </main>
  );
}