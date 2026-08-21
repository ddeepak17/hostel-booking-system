import {
  useEffect,
  useState,
} from "react";

import {
  useParams,
} from "react-router-dom";

import {
  getProperty,
  getPropertyRooms,
  getRoomBeds,
  createBooking,
} from "../../api/propertyApi";


export default function PropertyDetails() {
  const {
    propertyId,
  } = useParams();


  const [
    property,
    setProperty,
  ] = useState(null);

  const [
    rooms,
    setRooms,
  ] = useState([]);

  const [
    beds,
    setBeds,
  ] = useState({});

  const [
    checkInDate,
    setCheckInDate,
  ] = useState("");

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    error,
    setError,
  ] = useState("");


  useEffect(() => {
    async function loadProperty() {
      try {
        const propertyData =
          await getProperty(
            propertyId
          );

        const roomsData =
          await getPropertyRooms(
            propertyId
          );

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
      } catch (error) {
        console.error(error);

        setError(
          error.response?.data?.message ||
            "Unable to load property"
        );
      } finally {
        setLoading(false);
      }
    }

    loadProperty();
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
        (currentBeds) => ({
          ...currentBeds,

          [roomId]:
            Array.isArray(
              data.beds
            )
              ? data.beds
              : [],
        })
      );
    } catch (error) {
      console.error(error);

      alert(
        error.response?.data?.message ||
          "Unable to load beds"
      );
    }
  }


  async function bookBed(
    bedId,
    roomId
  ) {
    if (!checkInDate) {
      alert(
        "Please select a check-in date before booking."
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
          "Booking request submitted!"
      );

      await showBeds(
        roomId
      );
    } catch (error) {
      console.error(
        error.response?.data ||
          error
      );

      alert(
        error.response?.data?.message ||
          "Unable to create booking"
      );
    }
  }


  if (loading) {
    return (
      <main className="min-h-screen bg-slate-100 p-8">

        <div className="mx-auto max-w-5xl">
          Loading property...
        </div>

      </main>
    );
  }


  if (error) {
    return (
      <main className="min-h-screen bg-slate-100 p-8">

        <div className="mx-auto max-w-5xl rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
          {error}
        </div>

      </main>
    );
  }


  if (!property) {
    return (
      <main className="min-h-screen bg-slate-100 p-8">

        <div className="mx-auto max-w-5xl">
          Property not found.
        </div>

      </main>
    );
  }


  return (
    <main className="min-h-screen bg-slate-100 p-8">

      <div className="mx-auto max-w-5xl">

        <section className="rounded-xl bg-white p-6 shadow-sm">

          <h1 className="text-3xl font-bold text-slate-900">
            {property.name}
          </h1>

          <p className="mt-3 text-slate-600">
            {property.description}
          </p>


          {
            property.address && (
              <p className="mt-3 text-sm text-slate-500">
                {
                  [
                    property.address.line1,
                    property.address.city,
                    property.address.state,
                    property.address.postalCode,
                    property.address.country,
                  ]
                    .filter(Boolean)
                    .join(", ")
                }
              </p>
            )
          }


          {
            Array.isArray(
              property.amenities
            ) &&
            property.amenities.length >
              0 && (

              <div className="mt-5">

                <h2 className="font-bold text-slate-900">
                  Amenities
                </h2>

                <ul className="mt-2 flex flex-wrap gap-2">

                  {
                    property.amenities.map(
                      (amenity) => (

                        <li
                          key={amenity}
                          className="rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-700"
                        >
                          {amenity}
                        </li>

                      )
                    )
                  }

                </ul>

              </div>

            )
          }

        </section>


        <section className="mt-8">

          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">

            <div>
              <h2 className="text-2xl font-bold text-slate-900">
                Rooms
              </h2>

              <p className="mt-1 text-slate-600">
                Choose a check-in date and then select an available bed.
              </p>
            </div>


            <label className="block">

              <span className="mb-1 block text-sm font-semibold text-slate-700">
                Check-in date
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
                className="rounded-lg border border-slate-300 bg-white px-3 py-2"
              />

            </label>

          </div>


          {
            rooms.length === 0 ? (

              <div className="mt-5 rounded-xl bg-white p-6 shadow-sm">

                <p className="text-slate-600">
                  No rooms are currently available for this property.
                </p>

              </div>

            ) : (

              rooms.map(
                (room) => (

                  <article
                    key={room._id}
                    className="mt-5 rounded-xl bg-white p-6 shadow-sm"
                  >

                    <h3 className="text-xl font-bold text-slate-900">
                      Room{" "}
                      {
                        room.roomNumber
                      }
                    </h3>

                    <div className="mt-3 grid gap-2 sm:grid-cols-3">

                      <p>
                        <strong>
                          Type:
                        </strong>{" "}
                        {room.roomType}
                      </p>

                      <p>
                        <strong>
                          Capacity:
                        </strong>{" "}
                        {room.capacity}
                      </p>

                      <p>
                        <strong>
                          Rent:
                        </strong>{" "}
                        $
                        {
                          room.monthlyRent
                        }
                        /month
                      </p>

                    </div>


                    <button
                      onClick={() =>
                        showBeds(
                          room._id
                        )
                      }
                      className="mt-5 rounded-lg bg-slate-900 px-4 py-2 font-semibold text-white"
                    >
                      View Beds
                    </button>


                    {
                      beds[
                        room._id
                      ] && (

                        <div className="mt-5 border-t pt-5">

                          <h4 className="font-bold text-slate-900">
                            Beds
                          </h4>


                          {
                            beds[
                              room._id
                            ].length ===
                            0 ? (

                              <p className="mt-3 text-slate-600">
                                No beds found for this room.
                              </p>

                            ) : (

                              <div className="mt-3 grid gap-3 sm:grid-cols-2">

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
                                        className="rounded-lg border p-4"
                                      >

                                        <p className="font-semibold">
                                          Bed{" "}
                                          {
                                            bed.bedNumber
                                          }
                                        </p>

                                        <p className="mt-1 text-sm capitalize text-slate-600">
                                          Status:{" "}
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
                                              className="mt-3 rounded-lg bg-green-600 px-4 py-2 font-semibold text-white"
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

                        </div>

                      )
                    }

                  </article>

                )
              )

            )
          }

        </section>

      </div>

    </main>
  );
}