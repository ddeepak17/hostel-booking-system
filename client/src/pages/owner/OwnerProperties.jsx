import {
  useEffect,
  useState,
} from "react";

import {
  Link,
} from "react-router-dom";

import {
  createOwnerProperty,
  getOwnerProperties,
} from "../../api/ownerApi";


const EMPTY_FORM = {
  name: "",
  description: "",
  line1: "",
  line2: "",
  city: "",
  state: "",
  postalCode: "",
  country: "Canada",
  amenities: "",
  status: "draft",
};


function getErrorMessage(
  error,
  fallback
) {
  return (
    error.response?.data?.message ||
    fallback
  );
}


export default function OwnerProperties() {
  const [
    properties,
    setProperties,
  ] =
    useState(
      []
    );

  const [
    form,
    setForm,
  ] =
    useState(
      EMPTY_FORM
    );

  const [
    showCreateForm,
    setShowCreateForm,
  ] =
    useState(
      false
    );

  const [
    loading,
    setLoading,
  ] =
    useState(
      true
    );

  const [
    saving,
    setSaving,
  ] =
    useState(
      false
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


    getOwnerProperties()
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
              getErrorMessage(
                error,
                "Unable to load properties"
              )
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


  async function refreshProperties() {
    const data =
      await getOwnerProperties();


    setProperties(
      Array.isArray(
        data.properties
      )
        ? data.properties
        : []
    );
  }


  function handleChange(
    event
  ) {
    const {
      name,
      value,
    } =
      event.target;


    setForm(
      (
        current
      ) => ({
        ...current,
        [name]:
          value,
      })
    );
  }


  async function handleCreateProperty(
    event
  ) {
    event.preventDefault();


    if (
      !form.name.trim() ||
      !form.line1.trim() ||
      !form.city.trim() ||
      !form.state.trim() ||
      !form.postalCode.trim() ||
      !form.country.trim()
    ) {
      setError(
        "Property name and complete address are required."
      );

      return;
    }


    try {
      setSaving(
        true
      );

      setError(
        ""
      );


      await createOwnerProperty({
        name:
          form.name.trim(),

        description:
          form.description.trim(),

        address: {
          line1:
            form.line1.trim(),

          line2:
            form.line2.trim(),

          city:
            form.city.trim(),

          state:
            form.state.trim(),

          postalCode:
            form.postalCode.trim(),

          country:
            form.country.trim(),
        },

        amenities:
          form.amenities
            .split(",")
            .map(
              (
                item
              ) =>
                item.trim()
            )
            .filter(
              Boolean
            ),

        status:
          form.status,
      });


      setForm(
        EMPTY_FORM
      );


      setShowCreateForm(
        false
      );


      await refreshProperties();
    } catch (error) {
      setError(
        getErrorMessage(
          error,
          "Unable to create property"
        )
      );
    } finally {
      setSaving(
        false
      );
    }
  }


  return (
    <main className="min-h-screen bg-slate-100 p-4 sm:p-8">

      <div className="mx-auto max-w-7xl">

        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">

          <div>

            <h1 className="text-3xl font-black tracking-tight text-slate-900">
              My Properties
            </h1>

            <p className="mt-2 text-slate-600">
              Manage accommodation, pricing, availability, images, and location.
            </p>

          </div>


          <button
            onClick={() => {
              setShowCreateForm(
                (
                  current
                ) =>
                  !current
              );

              setError(
                ""
              );
            }}
            className="rounded-xl bg-slate-900 px-5 py-2.5 font-bold text-white shadow-sm"
          >
            {
              showCreateForm
                ? "Close Form"
                : "Add Property"
            }
          </button>

        </div>


        {
          error && (
            <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">
              {error}
            </div>
          )
        }


        {
          showCreateForm && (

            <form
              onSubmit={
                handleCreateProperty
              }
              className="mt-8 rounded-2xl bg-white p-5 shadow-sm sm:p-6"
            >

              <h2 className="text-xl font-bold">
                Create Property
              </h2>


              <div className="mt-5 grid gap-4 md:grid-cols-2">

                <label>

                  <span className="mb-1 block text-sm font-semibold">
                    Property Name
                  </span>

                  <input
                    name="name"
                    value={
                      form.name
                    }
                    onChange={
                      handleChange
                    }
                    required
                    className="w-full rounded-lg border border-slate-300 px-3 py-2"
                  />

                </label>


                <label>

                  <span className="mb-1 block text-sm font-semibold">
                    Status
                  </span>

                  <select
                    name="status"
                    value={
                      form.status
                    }
                    onChange={
                      handleChange
                    }
                    className="w-full rounded-lg border border-slate-300 px-3 py-2"
                  >
                    <option value="draft">
                      Draft
                    </option>

                    <option value="published">
                      Published
                    </option>
                  </select>

                </label>


                <label className="md:col-span-2">

                  <span className="mb-1 block text-sm font-semibold">
                    Description
                  </span>

                  <textarea
                    name="description"
                    value={
                      form.description
                    }
                    onChange={
                      handleChange
                    }
                    rows="3"
                    className="w-full rounded-lg border border-slate-300 px-3 py-2"
                  />

                </label>


                {
                  [
                    [
                      "line1",
                      "Address Line 1",
                    ],
                    [
                      "line2",
                      "Address Line 2",
                    ],
                    [
                      "city",
                      "City",
                    ],
                    [
                      "state",
                      "State / Province",
                    ],
                    [
                      "postalCode",
                      "Postal Code",
                    ],
                    [
                      "country",
                      "Country",
                    ],
                  ].map(
                    ([
                      field,
                      label,
                    ]) => (

                      <label
                        key={
                          field
                        }
                      >

                        <span className="mb-1 block text-sm font-semibold">
                          {
                            label
                          }
                        </span>

                        <input
                          name={
                            field
                          }
                          value={
                            form[
                              field
                            ]
                          }
                          onChange={
                            handleChange
                          }
                          required={
                            field !==
                            "line2"
                          }
                          className="w-full rounded-lg border border-slate-300 px-3 py-2"
                        />

                      </label>

                    )
                  )
                }


                <label className="md:col-span-2">

                  <span className="mb-1 block text-sm font-semibold">
                    Amenities
                  </span>

                  <input
                    name="amenities"
                    value={
                      form.amenities
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="WiFi, Laundry, Study Room"
                    className="w-full rounded-lg border border-slate-300 px-3 py-2"
                  />

                </label>

              </div>


              <button
                disabled={
                  saving
                }
                className="mt-6 rounded-xl bg-green-600 px-5 py-2.5 font-bold text-white disabled:opacity-50"
              >
                {
                  saving
                    ? "Creating..."
                    : "Create Property"
                }
              </button>

            </form>

          )
        }


        {
          loading ? (

            <p className="mt-8">
              Loading properties...
            </p>

          ) : properties.length ===
            0 ? (

            <div className="mt-8 rounded-2xl bg-white p-10 text-center shadow-sm">

              <h2 className="text-xl font-bold">
                No properties yet
              </h2>

              <p className="mt-2 text-slate-600">
                Add your first property to begin.
              </p>

            </div>

          ) : (

            <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">

              {
                properties.map(
                  (
                    property
                  ) => {

                    const heroImage =
                      property.images?.[0];


                    return (

                      <article
                        key={
                          property._id
                        }
                        className="overflow-hidden rounded-2xl bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                      >

                        {
                          heroImage ? (

                            <img
                              src={
                                heroImage.url
                              }
                              alt={
                                heroImage.alt ||
                                property.name
                              }
                              className="h-48 w-full object-cover"
                            />

                          ) : (

                            <div className="flex h-48 items-center justify-center bg-gradient-to-br from-slate-200 to-slate-100 text-sm font-semibold text-slate-500">
                              No property image
                            </div>

                          )
                        }


                        <div className="p-5">

                          <div className="flex items-start justify-between gap-3">

                            <div>

                              <h2 className="text-xl font-bold">
                                {
                                  property.name
                                }
                              </h2>

                              <p className="mt-1 text-sm text-slate-500">
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

                            </div>


                            <span
                              className={
                                property.isActive
                                  ? "rounded-full bg-green-100 px-3 py-1 text-xs font-bold capitalize text-green-800"
                                  : "rounded-full bg-red-100 px-3 py-1 text-xs font-bold text-red-800"
                              }
                            >
                              {
                                property.isActive
                                  ? property.status
                                  : "Inactive"
                              }
                            </span>

                          </div>


                          {
                            property.description && (
                              <p className="mt-4 line-clamp-3 text-sm text-slate-600">
                                {
                                  property.description
                                }
                              </p>
                            )
                          }


                          <div className="mt-5 flex flex-wrap gap-2">

                            <Link
                              to={`/owner/properties/${property._id}/manage`}
                              className="rounded-lg bg-blue-600 px-3 py-2 text-sm font-bold text-white"
                            >
                              Manage
                            </Link>


                            <Link
                              to={`/owner/properties/${property._id}/media`}
                              className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-bold text-slate-700"
                            >
                              Media & Location
                            </Link>

                          </div>

                        </div>

                      </article>

                    );
                  }
                )
              }

            </div>

          )
        }

      </div>

    </main>
  );
}