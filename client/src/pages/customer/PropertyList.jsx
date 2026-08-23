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


const EMPTY_FILTERS = {
  q: "",
  city: "",
  amenity: "",
  roomType: "",
  minPrice: "",
  maxPrice: "",
  availability: false,
};


export default function PropertyList() {
  const [
    properties,
    setProperties,
  ] =
    useState(
      []
    );

  const [
    filters,
    setFilters,
  ] =
    useState(
      EMPTY_FILTERS
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


    getProperties()
      .then(
        (
          data
        ) => {
          if (
            !ignore
          ) {
            setProperties(
              Array.isArray(
                data.properties
              )
                ? data.properties
                : []
            );
          }
        }
      )
      .catch(
        () => {
          if (
            !ignore
          ) {
            setError(
              "Unable to load properties"
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
  }, []);


  function handleChange(
    event
  ) {
    const {
      name,
      value,
      type,
      checked,
    } =
      event.target;


    setFilters(
      (
        current
      ) => ({
        ...current,

        [name]:
          type ===
          "checkbox"
            ? checked
            : value,
      })
    );
  }


  async function searchProperties(
    event
  ) {
    event.preventDefault();


    try {
      setLoading(
        true
      );

      setError(
        ""
      );


      const data =
        await getProperties(
          filters
        );


      setProperties(
        Array.isArray(
          data.properties
        )
          ? data.properties
          : []
      );
    } catch {
      setError(
        "Unable to search properties"
      );
    } finally {
      setLoading(
        false
      );
    }
  }


  async function clearFilters() {
    setFilters(
      EMPTY_FILTERS
    );


    try {
      setLoading(
        true
      );


      const data =
        await getProperties();


      setProperties(
        Array.isArray(
          data.properties
        )
          ? data.properties
          : []
      );
    } finally {
      setLoading(
        false
      );
    }
  }


  return (
    <main className="min-h-screen bg-slate-100 p-8">

      <div className="mx-auto max-w-6xl">

        <h1 className="text-3xl font-bold">
          Available Hostels
        </h1>


        <form
          onSubmit={
            searchProperties
          }
          className="mt-6 rounded-xl bg-white p-5 shadow-sm"
        >

          <div className="grid gap-3 md:grid-cols-3">

            <input
              name="q"
              value={
                filters.q
              }
              onChange={
                handleChange
              }
              placeholder="Search name or location"
              className="rounded border px-3 py-2"
            />


            <input
              name="city"
              value={
                filters.city
              }
              onChange={
                handleChange
              }
              placeholder="City"
              className="rounded border px-3 py-2"
            />


            <input
              name="amenity"
              value={
                filters.amenity
              }
              onChange={
                handleChange
              }
              placeholder="Amenity, e.g. WiFi"
              className="rounded border px-3 py-2"
            />


            <select
              name="roomType"
              value={
                filters.roomType
              }
              onChange={
                handleChange
              }
              className="rounded border px-3 py-2"
            >

              <option value="">
                Any room type
              </option>

              <option value="single">
                Single
              </option>

              <option value="double">
                Double
              </option>

              <option value="triple">
                Triple
              </option>

              <option value="shared">
                Shared
              </option>

              <option value="dormitory">
                Dormitory
              </option>

            </select>


            <input
              type="number"
              min="0"
              name="minPrice"
              value={
                filters.minPrice
              }
              onChange={
                handleChange
              }
              placeholder="Minimum monthly rent"
              className="rounded border px-3 py-2"
            />


            <input
              type="number"
              min="0"
              name="maxPrice"
              value={
                filters.maxPrice
              }
              onChange={
                handleChange
              }
              placeholder="Maximum monthly rent"
              className="rounded border px-3 py-2"
            />

          </div>


          <label className="mt-4 flex items-center gap-2">

            <input
              type="checkbox"
              name="availability"
              checked={
                filters.availability
              }
              onChange={
                handleChange
              }
            />

            Only properties with an available bed

          </label>


          <div className="mt-5 flex gap-3">

            <button
              type="submit"
              className="rounded bg-slate-900 px-5 py-2 font-semibold text-white"
            >
              Search
            </button>


            <button
              type="button"
              onClick={
                clearFilters
              }
              className="rounded border px-5 py-2 font-semibold"
            >
              Clear
            </button>

          </div>

        </form>


        {
          error && (
            <p className="mt-5 text-red-600">
              {error}
            </p>
          )
        }


        {
          loading ? (

            <p className="mt-8">
              Loading properties...
            </p>

          ) : properties.length ===
            0 ? (

            <div className="mt-8 rounded-xl bg-white p-8 text-center shadow-sm">
              No properties match your search.
            </div>

          ) : (

            <div className="mt-8 grid gap-6 md:grid-cols-2">

              {
                properties.map(
                  (
                    property
                  ) => (

                    <Link
                      key={
                        property._id
                      }
                      to={`/properties/${property._id}`}
                      className="rounded-xl bg-white p-6 shadow-sm hover:shadow-md"
                    >

                      <h2 className="text-xl font-bold">
                        {
                          property.name
                        }
                      </h2>

                      <p className="mt-2 text-slate-600">
                        {
                          property.description
                        }
                      </p>

                      <p className="mt-3 text-sm text-slate-500">
                        {
                          [
                            property.address
                              ?.city,
                            property.address
                              ?.state,
                          ]
                            .filter(
                              Boolean
                            )
                            .join(
                              ", "
                            )
                        }
                      </p>


                      <div className="mt-4 flex flex-wrap gap-2">

                        {
                          property.amenities
                            ?.slice(
                              0,
                              4
                            )
                            .map(
                              (
                                amenity
                              ) => (

                                <span
                                  key={
                                    amenity
                                  }
                                  className="rounded-full bg-slate-100 px-3 py-1 text-xs"
                                >
                                  {
                                    amenity
                                  }
                                </span>

                              )
                            )
                        }

                      </div>

                    </Link>

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