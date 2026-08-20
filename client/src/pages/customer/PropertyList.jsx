import {
  useEffect,
  useState,
} from "react";

import {
  Link,
} from "react-router-dom";

import {
  getProperties,
} from "../../api/propertyApi";


export default function PropertyList() {

  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");


  useEffect(() => {

    async function loadProperties() {

      try {

        const data = await getProperties();

        setProperties(
          Array.isArray(data.properties)
            ? data.properties
            : []
        );

      } catch(error) {

        console.error(error);

        setError(
          "Unable to load properties"
        );

      } finally {

        setLoading(false);

      }

    }


    loadProperties();

  }, []);



  if (loading) {

    return (
      <div className="p-8">
        Loading properties...
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

      <h1 className="mb-6 text-3xl font-bold">
        Available Hostels
      </h1>


      {
        properties.length === 0 ? (

          <p>
            No properties available.
          </p>

        ) : (

          <div className="grid gap-6 md:grid-cols-2">

            {
              properties.map((property)=>(

                <Link
                  key={property._id}
                  to={`/properties/${property._id}`}
                  className="rounded-xl bg-white p-6 shadow hover:shadow-lg"
                >

                  <h2 className="text-xl font-bold">
                    {property.name}
                  </h2>


                  <p className="mt-2 text-slate-600">
                    {property.description}
                  </p>


                  <p className="mt-3 text-sm">
                    {property.address?.city}
                  </p>


                </Link>

              ))
            }

          </div>

        )
      }


    </div>

  );

}