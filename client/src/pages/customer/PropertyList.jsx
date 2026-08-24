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
import SafeImage from "../../components/SafeImage";


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
    <main className="min-h-[calc(100vh-65px)] bg-slate-100 px-4 py-8 sm:px-6">

      <div className="mx-auto max-w-6xl">

        <h1 className="text-3xl font-bold">
          Available Hostels
        </h1>

        <p className="mt-2 text-slate-600">
          Compare locations, amenities, room types, and live bed availability.
        </p>


        <form
          onSubmit={
            searchProperties
          }
          className="mt-6 rounded-xl bg-white p-5 shadow-sm"
        >

          <div className="grid gap-3 md:grid-cols-3">

            <input
              name="q"
              aria-label="Search by name or location"
              value={
                filters.q
              }
              onChange={
                handleChange
              }
              aria-label="Search by property name or location"
              placeholder="Search name or location"
              className="rounded border px-3 py-2"
            />


            <input
              name="city"
              aria-label="Filter by city"
              value={
                filters.city
              }
              onChange={
                handleChange
              }
              aria-label="Filter by city"
              placeholder="City"
              className="rounded border px-3 py-2"
            />


            <input
              name="amenity"
              aria-label="Filter by amenity"
              value={
                filters.amenity
              }
              onChange={
                handleChange
              }
              aria-label="Filter by amenity"
              placeholder="Amenity, e.g. WiFi"
              className="rounded border px-3 py-2"
            />


            <select
              aria-label="Filter by room type"
              name="roomType"
              aria-label="Filter by room type"
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
              aria-label="Minimum monthly rent"
              value={
                filters.minPrice
              }
              onChange={
                handleChange
              }
              aria-label="Minimum monthly rent"
              placeholder="Minimum monthly rent"
              className="rounded border px-3 py-2"
            />


            <input
              type="number"
              min="0"
              name="maxPrice"
              aria-label="Maximum monthly rent"
              value={
                filters.maxPrice
              }
              onChange={
                handleChange
              }
              aria-label="Maximum monthly rent"
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
            <p
              role="alert"
              className="mt-5 rounded-lg border border-red-200 bg-red-50 p-4 text-red-700"
            >
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
                      className="group overflow-hidden rounded-2xl bg-white shadow-sm hover:-translate-y-0.5 hover:shadow-lg"
                    >

                      <SafeImage
                        src={
                          property.images
                            ?.[0]
                            ?.url
                        }
                        alt={
                          property.images
                            ?.[0]
                            ?.alt ||
                          `${property.name} property`
                        }
                        className="h-52 w-full object-cover"
                        fallbackLabel="Photo not available"
                      />


                      <div className="p-6">

                      <h2 className="text-xl font-bold">
                        {
                          property.name
                        }
                      </h2>

                      {
                        property.description && (
                          <p className="mt-2 line-clamp-2 text-slate-600">
                            {
                              property.description
                            }
                          </p>
                        )
                      }

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


                      <p className="mt-5 font-semibold text-blue-600">
                        View rooms and availability →
                      </p>

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
