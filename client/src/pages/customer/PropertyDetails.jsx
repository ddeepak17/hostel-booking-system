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
    setProperty
  ] = useState(null);



  const [
    rooms,
    setRooms
  ] = useState([]);



  const [
    beds,
    setBeds
  ] = useState({});



  const [
    loading,
    setLoading
  ] = useState(true);



  const [
    error,
    setError
  ] = useState("");




  useEffect(() => {


    async function loadProperty() {

      try {


        const propertyData =
          await getProperty(propertyId);



        const roomsData =
          await getPropertyRooms(propertyId);



        setProperty(
          propertyData.property
        );



        setRooms(
          roomsData.rooms || []
        );


      } catch(error) {


        console.error(error);


        setError(
          "Unable to load property"
        );


      } finally {


        setLoading(false);


      }

    }



    loadProperty();


  }, [propertyId]);






  async function showBeds(roomId) {


    try {


      const data =
        await getRoomBeds(roomId);



      setBeds({

        ...beds,

        [roomId]:
          data.beds || []

      });



    } catch(error) {


      console.error(error);


      alert(
        "Unable to load beds"
      );


    }

  }






  async function bookBed(bedId, roomId) {

  try {

    const data =
      await createBooking({

        bedId,

        checkInDate:
          new Date(
            Date.now() -
            new Date().getTimezoneOffset() * 60000
          )
          .toISOString()
          .split("T")[0],

      });


    alert(
      data.message ||
      "Booking request submitted!"
    );


    await showBeds(roomId);


  } catch(error) {

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

      <div className="p-8">

        Loading property...

      </div>

    );


  }






  if (error) {


    return (

      <div className="p-8 text-red-600">

        {error}

      </div>

    );


  }







  return (


    <div className="min-h-screen bg-slate-100 p-8">


      <h1 className="text-3xl font-bold">

        {property.name}

      </h1>




      <p className="mt-3 text-slate-600">

        {property.description}

      </p>





      {
        property.amenities &&
        property.amenities.length > 0 && (


          <div className="mt-5">


            <h2 className="font-bold">

              Amenities

            </h2>



            <ul className="mt-2 list-disc pl-5">


              {
                property.amenities.map(
                  (amenity) => (

                    <li key={amenity}>

                      {amenity}

                    </li>

                  )
                )
              }


            </ul>


          </div>


        )
      }







      <h2 className="mt-8 text-2xl font-bold">

        Rooms

      </h2>







      {
        rooms.map(

          (room) => (


            <div

              key={room._id}

              className="mt-4 rounded-lg bg-white p-5 shadow"

            >


              <h3 className="text-xl font-bold">

                Room {room.roomNumber}

              </h3>



              <p>

                Type: {room.roomType}

              </p>



              <p>

                Capacity: {room.capacity}

              </p>



              <p>

                Rent: ${room.monthlyRent}/month

              </p>





              <button

                onClick={() =>
                  showBeds(room._id)
                }

                className="mt-4 rounded bg-slate-900 px-4 py-2 text-white"

              >

                View Beds

              </button>







              {
                beds[room._id] && (


                  <div className="mt-5">


                    <h4 className="font-bold">

                      Beds

                    </h4>







                    {
                      beds[room._id].map(

                        (bed) => (


                          <div

                            key={bed._id}

                            className="mt-3 rounded border bg-white p-4"

                          >



                            <p>

                              Bed {bed.bedNumber}

                            </p>




                            <p>

                              Status: {bed.status}

                            </p>







                            {
                              bed.status === "available" && (


                                <button

                                  onClick={() =>
                                    bookBed(
                                      bed._id,
                                      room._id
                                    )
                                  }

                                  className="mt-3 rounded bg-green-600 px-4 py-2 text-white"

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

        )
      }






    </div>


  );


}