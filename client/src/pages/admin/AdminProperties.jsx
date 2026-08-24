import {
  useEffect,
  useState,
} from "react";

import {
  getAdminProperties,
} from "../../api/adminApi";


export default function AdminProperties() {
  const [
    properties,
    setProperties,
  ] =
    useState(
      []
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


    getAdminProperties()
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


  return (
    <main className="min-h-[calc(100vh-65px)] bg-slate-100 px-4 py-8 sm:px-6">

      <div className="mx-auto max-w-6xl">

        <h1 className="text-3xl font-bold">
          Platform Properties
        </h1>


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
              Loading properties...
            </p>

          ) : (

            properties.length === 0 ? (

              <div className="mt-6 rounded-xl bg-white p-8 text-center text-slate-600 shadow-sm">
                No properties are currently registered on the platform.
              </div>

            ) : (

            <div className="mt-6 grid gap-4 md:grid-cols-2">

              {
                properties.map(
                  (
                    property
                  ) => (

                    <article
                      key={
                        property._id
                      }
                      className="rounded-xl bg-white p-5 shadow-sm"
                    >

                      <h2 className="text-xl font-bold">
                        {property.name}
                      </h2>

                      <p className="mt-2 text-slate-600">
                        Owner:{" "}
                        {
                          property.owner
                            ?.name ||
                          "Unknown"
                        }
                      </p>

                      <p className="text-sm text-slate-500">
                        {
                          property.owner
                            ?.email
                        }
                      </p>

                      <div className="mt-3">
                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-sm font-semibold capitalize ${
                            property.isActive &&
                            property.status === "published"
                              ? "bg-green-100 text-green-800"
                              : property.isActive
                                ? "bg-amber-100 text-amber-800"
                                : "bg-red-100 text-red-800"
                          }`}
                        >
                          {
                            property.isActive
                              ? property.status
                              : "inactive"
                          }
                        </span>
                      </div>

                      <p className="mt-2 text-sm text-slate-600">
                        {
                          [
                            property.address
                              ?.city,
                            property.address
                              ?.state,
                            property.address
                              ?.country,
                          ]
                            .filter(
                              Boolean
                            )
                            .join(
                              ", "
                            )
                        }
                      </p>

                    </article>

                  )
                )
              }

            </div>

            )

          )
        }

      </div>

    </main>
  );
}
