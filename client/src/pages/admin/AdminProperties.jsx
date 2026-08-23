import {
  useEffect,
  useState,
} from "react";

import {
  Link,
} from "react-router-dom";

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
    <main className="min-h-screen bg-slate-100 p-8">

      <div className="mx-auto max-w-6xl">

        <Link
          to="/admin/dashboard"
          className="font-semibold text-blue-600"
        >
          ← Dashboard
        </Link>


        <h1 className="mt-3 text-3xl font-bold">
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

                      <p className="mt-3 capitalize">
                        Status:{" "}
                        <strong>
                          {
                            property.isActive
                              ? property.status
                              : "inactive"
                          }
                        </strong>
                      </p>

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
        }

      </div>

    </main>
  );
}