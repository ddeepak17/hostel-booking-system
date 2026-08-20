import {
  useEffect,
  useState,
} from "react";

import {
  getMyBookings,
  cancelBooking,
} from "../../api/bookingApi";


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



  async function loadBookings() {

    try {

      setLoading(true);

      const data =
        await getMyBookings();


      setBookings(
        data.bookings || []
      );


    } catch(error) {

      console.error(error);

      setError(
        error.response?.data?.message ||
        "Unable to load bookings"
      );


    } finally {

      setLoading(false);

    }

  }



  useEffect(() => {

    loadBookings();

  }, []);




  async function handleCancel(
    bookingId
  ) {


    const confirmed =
      window.confirm(
        "Cancel this booking?"
      );


    if(!confirmed) {
      return;
    }


    try {

      await cancelBooking(
        bookingId,
        "Customer cancelled"
      );


      await loadBookings();


    } catch(error) {

      alert(
        error.response?.data?.message ||
        "Unable to cancel booking"
      );

    }

  }




  if(loading) {

    return (

      <div className="p-8">

        <h1 className="text-3xl font-bold">
          My Bookings
        </h1>


        <p className="mt-3 text-slate-600">
          Loading bookings...
        </p>


      </div>

    );

  }




  return (

    <div className="p-8">


      <h1 className="text-3xl font-bold">
        My Bookings
      </h1>



      {
        error && (

          <p className="mt-4 text-red-600">
            {error}
          </p>

        )
      }



      {
        bookings.length === 0 ? (

          <p className="mt-4 text-slate-600">
            You have no bookings yet.
          </p>

        ) : (


          <div className="mt-6 space-y-4">


            {
              bookings.map(
                (booking) => (

                  <div
                    key={
                      booking._id
                    }
                    className="
                      rounded-lg
                      border
                      bg-white
                      p-5
                      shadow-sm
                    "
                  >


                    <h2 className="text-xl font-bold">

                      {
                        booking.property?.name
                      }

                    </h2>



                    <p className="mt-2">

                      Room:
                      {" "}
                      {
                        booking.room?.roomNumber
                      }

                    </p>



                    <p>

                      Bed:
                      {" "}
                      {
                        booking.bed?.bedNumber
                      }

                    </p>



                    <p>

                      Check-in:
                      {" "}
                      {
                        new Date(
                          booking.checkInDate
                        )
                        .toLocaleDateString()
                      }

                    </p>



                    <p>

                      Status:
                      {" "}

                      <span className="font-semibold">

                        {
                          booking.status
                        }

                      </span>

                    </p>



                    {
                      (
                        booking.status ===
                        "pending"
                        ||
                        booking.status ===
                        "approved"
                      ) && (


                        <button

                          onClick={() =>
                            handleCancel(
                              booking._id
                            )
                          }

                          className="
                            mt-4
                            rounded
                            bg-red-600
                            px-4
                            py-2
                            text-white
                          "

                        >

                          Cancel Booking

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

  );


}