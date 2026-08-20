import {
  Link,
} from "react-router-dom";

import useAuth from "../../hooks/useAuth";



export default function CustomerDashboard() {


  const {
    user,
  } = useAuth();




  return (

    <div className="min-h-screen bg-slate-100 p-8">



      <div className="rounded-lg bg-white p-6 shadow">


        <h1 className="text-3xl font-bold">

          Customer Dashboard

        </h1>




        <p className="mt-4 text-slate-600">

          Welcome, {user?.name}

        </p>



        <p className="mt-2 text-slate-600">

          Email: {user?.email}

        </p>




        <p className="mt-2 text-slate-600">

          Role: {user?.role}

        </p>





        <div className="mt-6 flex gap-4">


          <Link

            to="/properties"

            className="
              rounded
              bg-slate-900
              px-4
              py-2
              text-white
            "

          >

            Browse Hostels

          </Link>





          <Link

            to="/customer/bookings"

            className="
              rounded
              bg-blue-600
              px-4
              py-2
              text-white
            "

          >

            My Bookings

          </Link>



        </div>



      </div>


    </div>

  );

}