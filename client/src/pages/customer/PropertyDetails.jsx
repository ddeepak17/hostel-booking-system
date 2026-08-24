import {
  useEffect,
  useState,
} from "react";

import {
  Link,
  useParams,
} from "react-router-dom";

import useAuth from "../../hooks/useAuth";
import SafeImage from "../../components/SafeImage";

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


const now = new Date();
const TODAY_INPUT_VALUE =
  new Date(
    now.getTime() -
      now.getTimezoneOffset() *
        60_000
  )
    .toISOString()
    .slice(0, 10);


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

  const [
    feedback,
    setFeedback,
  ] =
    useState(
      null
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
    roomId,
    {
      preserveFeedback =
        false,
    } = {}
  ) {
    try {
      if (
        !preserveFeedback
      ) {
        setFeedback(
          null
        );
      }

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
      setFeedback({
        type: "error",
        message:
          error.response
            ?.data
            ?.message ||
          "Unable to load beds",
      });
    }
  }


  async function bookBed(
    bedId,
    roomId
  ) {
    if (!user) {
      setFeedback({
        type: "info",
        message:
          "Sign in with a customer account to request this bed.",
        loginRequired: true,
      });

      return;
    }


    if (
      user.role !==
      "customer"
    ) {
      setFeedback({
        type: "error",
        message:
          "Only customer accounts can create bookings.",
      });

      return;
    }


    if (
      !checkInDate
    ) {
      setFeedback({
        type: "error",
        message:
          "Select a check-in date before requesting a bed.",
      });

      return;
    }


    try {
      const data =
        await createBooking({
          bedId,
          checkInDate,
        });


      setFeedback({
        type: "success",
        message:
          data.message ||
          "Booking request submitted",
      });


      await showBeds(
        roomId,
        {
          preserveFeedback:
            true,
        }
      );
    } catch (error) {
      setFeedback({
        type: "error",
        message:
          error.response
            ?.data
            ?.message ||
          "Unable to create booking",
      });
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


      setFeedback({
        type: "success",
        message:
          data.message ||
          "Review saved",
      });


      setComment(
        ""
      );


      await refreshReviews();
    } catch (error) {
      setFeedback({
        type: "error",
        message:
          error.response
            ?.data
            ?.message ||
          "Unable to save review",
      });
    }
  }


  if (loading) {
    return (
      <main className="min-h-[calc(100vh-65px)] bg-slate-100 px-4 py-8 sm:px-6">
        Loading property...
      </main>
    );
  }


  if (
    error ||
    !property
  ) {
    return (
      <main className="min-h-[calc(100vh-65px)] bg-slate-100 px-4 py-8 text-red-600 sm:px-6">
        {
          error ||
          "Property not found"
        }
      </main>
    );
  }


  const images =
    Array.isArray(
      property.images
    )
      ? property.images
      : [];


  const addressText =
    [
      property.address
        ?.line1,
      property.address
        ?.line2,
      property.address
        ?.city,
      property.address
        ?.state,
      property.address
        ?.postalCode,
      property.address
        ?.country,
    ]
      .filter(
        Boolean
      )
      .join(
        ", "
      );


  const coordinates =
    property.location
      ?.coordinates;


  const hasCoordinates =
    Array.isArray(
      coordinates
    ) &&
    coordinates.length ===
      2;


  const mapQuery =
    hasCoordinates
      ? `${coordinates[1]},${coordinates[0]}`
      : addressText;


  const mapEmbedUrl =
    `https://www.google.com/maps?q=${encodeURIComponent(
      mapQuery
    )}&z=15&output=embed`;


  const mapLink =
    `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
      mapQuery
    )}`;


  return (
    <main className="min-h-[calc(100vh-65px)] bg-slate-100 px-4 py-8 sm:px-6">

      <div className="mx-auto max-w-6xl">

        <Link
          to="/properties"
          className="font-semibold text-blue-600"
        >
          ← Browse Hostels
        </Link>


        {
          feedback && (
            <div
              role={
                feedback.type ===
                "error"
                  ? "alert"
                  : "status"
              }
              className={[
                "mt-4 flex flex-col gap-3 rounded-xl border p-4 sm:flex-row sm:items-center sm:justify-between",
                feedback.type ===
                "error"
                  ? "border-red-200 bg-red-50 text-red-700"
                  : feedback.type ===
                    "success"
                    ? "border-green-200 bg-green-50 text-green-800"
                    : "border-blue-200 bg-blue-50 text-blue-800",
              ].join(
                " "
              )}
            >
              <span>
                {
                  feedback.message
                }
              </span>

              <div className="flex items-center gap-3">
                {
                  feedback.loginRequired && (
                    <Link
                      to="/login"
                      className="font-bold underline underline-offset-2"
                    >
                      Sign in
                    </Link>
                  )
                }

                <button
                  type="button"
                  onClick={() =>
                    setFeedback(
                      null
                    )
                  }
                  className="text-sm font-semibold opacity-70 hover:opacity-100"
                >
                  Dismiss
                </button>
              </div>
            </div>
          )
        }


        {
          images.length ===
          1 ? (

            <SafeImage
              src={
                images[0].url
              }
              alt={
                images[0].alt ||
                property.name
              }
              className="mt-4 h-72 w-full rounded-2xl object-cover sm:h-96"
              loading="eager"
            />

          ) : images.length >
            1 ? (

            <section className="mt-4 grid gap-3 md:grid-cols-2">

              <SafeImage
                src={
                  images[0].url
                }
                alt={
                  images[0].alt ||
                  property.name
                }
                className="h-72 w-full rounded-2xl object-cover md:h-full"
                loading="eager"
              />


              <div className="grid grid-cols-2 gap-3">

                {
                  images
                    .slice(
                      1,
                      5
                    )
                    .map(
                      (
                        image,
                        index
                      ) => (

                        <SafeImage
                          key={`${image.url}-${index}`}
                          src={
                            image.url
                          }
                          alt={
                            image.alt ||
                            property.name
                          }
                          className="h-36 w-full rounded-xl object-cover sm:h-44"
                        />

                      )
                    )
                }

              </div>

            </section>

          ) : (

            <div className="mt-4 flex h-64 items-center justify-center rounded-2xl bg-gradient-to-br from-slate-200 to-slate-100 text-slate-500">
              No property photos available
            </div>

          )
        }


        <section className="mt-6 rounded-2xl bg-white p-5 shadow-sm sm:p-7">

          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">

            <div>

              <h1 className="text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
                {
                  property.name
                }
              </h1>

              {
                property.description && (
                  <p className="mt-3 max-w-3xl text-slate-600">
                    {
                      property.description
                    }
                  </p>
                )
              }


              {
                addressText && (
                  <p className="mt-3 text-sm text-slate-500">
                    {
                      addressText
                    }
                  </p>
                )
              }

            </div>


            <div className="w-fit rounded-xl bg-amber-50 px-5 py-3 text-center">

              <p className="text-xl font-black text-slate-900">
                {
                  reviews.length
                    ? `${averageRating} / 5`
                    : "New"
                }
              </p>

              <p className="text-xs text-slate-500">
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
            property.amenities
              ?.length >
              0 && (

              <div className="mt-5 flex flex-wrap gap-2">

                {
                  property.amenities.map(
                    (
                      amenity
                    ) => (

                      <span
                        key={
                          amenity
                        }
                        className="rounded-full bg-slate-100 px-3 py-1.5 text-sm font-medium text-slate-700"
                      >
                        {
                          amenity
                        }
                      </span>

                    )
                  )
                }

              </div>

            )
          }

        </section>


        <section className="mt-8">

          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">

            <div>

              <h2 className="text-2xl font-black">
                Rooms & Beds
              </h2>

              <p className="mt-1 text-slate-600">
                Select your check-in date and choose an available bed.
              </p>

            </div>


            <label>

              <span className="mb-1 block text-sm font-semibold">
                Check-in Date
              </span>

              <input
                type="date"
                min={
                  TODAY_INPUT_VALUE
                }
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
                className="rounded-lg border border-slate-300 bg-white px-3 py-2"
              />

            </label>

          </div>


          <div className="mt-5 space-y-4">

            {
              rooms.length ===
              0 ? (

                <div className="rounded-2xl bg-white p-8 text-center text-slate-500">
                  No rooms currently available.
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
                      className="rounded-2xl bg-white p-5 shadow-sm sm:p-6"
                    >

                      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">

                        <div>

                          <h3 className="text-xl font-bold">
                            Room{" "}
                            {
                              room.roomNumber
                            }
                          </h3>

                          <p className="mt-1 capitalize text-slate-500">
                            {
                              room.roomType
                            }
                          </p>

                        </div>


                        <div className="text-left sm:text-right">

                          <p className="text-xl font-black">
                            $
                            {
                              room.monthlyRent
                            }
                            <span className="text-sm font-medium text-slate-500">
                              /month
                            </span>
                          </p>

                          <p className="mt-1 text-sm text-slate-500">
                            Deposit $
                            {
                              room.securityDeposit
                            }
                          </p>

                        </div>

                      </div>


                      <p className="mt-3 text-sm text-slate-600">
                        Capacity:{" "}
                        {
                          room.capacity
                        }
                      </p>


                      <button
                        onClick={() =>
                          showBeds(
                            room._id
                          )
                        }
                        className="mt-4 rounded-lg bg-slate-900 px-4 py-2 font-semibold text-white"
                      >
                        View Beds
                      </button>


                      {
                        beds[
                          room._id
                        ] && (

                          beds[
                            room._id
                          ].length ===
                          0 ? (

                            <p
                              role="status"
                              className="mt-5 rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600"
                            >
                              No active beds are currently listed for this room.
                            </p>

                          ) : (

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
                                    className="rounded-xl border border-slate-200 p-4"
                                  >

                                    <div className="flex items-center justify-between gap-3">

                                      <p className="font-bold">
                                        Bed{" "}
                                        {
                                          bed.bedNumber
                                        }
                                      </p>

                                      <span
                                        className={
                                          bed.status ===
                                          "available"
                                            ? "rounded-full bg-green-100 px-2.5 py-1 text-xs font-bold text-green-700"
                                            : "rounded-full bg-slate-100 px-2.5 py-1 text-xs font-bold capitalize text-slate-600"
                                        }
                                      >
                                        {
                                          bed.status
                                        }
                                      </span>

                                    </div>


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
                                          className="mt-4 w-full rounded-lg bg-green-600 px-4 py-2 font-bold text-white"
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
                        )
                      }

                    </article>

                  )
                )

              )
            }

          </div>

        </section>


        <section className="mt-10 rounded-2xl bg-white p-5 shadow-sm sm:p-6">

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

            <div>

              <h2 className="text-2xl font-black">
                Location
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                {
                  addressText
                }
              </p>

            </div>


            <a
              href={
                mapLink
              }
              target="_blank"
              rel="noreferrer"
              className="w-fit rounded-lg bg-blue-600 px-4 py-2 font-bold text-white"
            >
              Open in Google Maps
            </a>

          </div>


          <div className="mt-5 overflow-hidden rounded-xl border border-slate-200">

            <iframe
              title={`${property.name} map`}
              src={
                mapEmbedUrl
              }
              loading="lazy"
              className="h-80 w-full"
            />

          </div>

        </section>


        <section className="mt-10">

          <h2 className="text-2xl font-black">
            Reviews
          </h2>


          {
            user?.role ===
            "customer" && (

              <form
                onSubmit={
                  handleReview
                }
                className="mt-5 rounded-2xl bg-white p-5 shadow-sm"
              >

                <h3 className="font-bold">
                  Leave or update your review
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                  Reviews require a completed stay.
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
                  className="mt-4 rounded-lg border border-slate-300 px-3 py-2"
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
                  className="mt-3 w-full rounded-lg border border-slate-300 px-3 py-2"
                />


                <button className="mt-3 rounded-lg bg-blue-600 px-4 py-2 font-bold text-white">
                  Save Review
                </button>

              </form>

            )
          }


          <div className="mt-5 space-y-4">

            {
              reviews.length ===
              0 ? (

                <div className="rounded-2xl bg-white p-6 text-slate-500">
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
                      className="rounded-2xl bg-white p-5 shadow-sm"
                    >

                      <div className="flex justify-between gap-3">

                        <strong>
                          {
                            review.customer
                              ?.name ||
                            "Customer"
                          }
                        </strong>

                        <span className="font-bold">
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
