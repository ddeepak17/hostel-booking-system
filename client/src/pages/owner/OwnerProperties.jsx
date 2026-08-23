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
  ] = useState([]);

  const [
    form,
    setForm,
  ] = useState(EMPTY_FORM);

  const [
    showCreateForm,
    setShowCreateForm,
  ] = useState(false);

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    saving,
    setSaving,
  ] = useState(false);

  const [
    error,
    setError,
  ] = useState("");


  useEffect(() => {
    let ignore = false;

    getOwnerProperties()
      .then((data) => {
        if (ignore) {
          return;
        }

        setProperties(
          Array.isArray(
            data.properties
          )
            ? data.properties
            : []
        );
      })
      .catch((error) => {
        if (ignore) {
          return;
        }

        console.error(error);

        setError(
          getErrorMessage(
            error,
            "Unable to load properties"
          )
        );
      })
      .finally(() => {
        if (!ignore) {
          setLoading(false);
        }
      });

    return () => {
      ignore = true;
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
    } = event.target;

    setForm(
      (current) => ({
        ...current,
        [name]: value,
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
      setSaving(true);
      setError("");

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
              (item) =>
                item.trim()
            )
            .filter(Boolean),

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
      console.error(error);

      setError(
        getErrorMessage(
          error,
          "Unable to create property"
        )
      );
    } finally {
      setSaving(false);
    }
  }


  return (
    <main className="min-h-screen bg-slate-100 p-8">

      <div className="mx-auto max-w-6xl">

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

          <div>

            <h1 className="text-3xl font-bold text-slate-900">
              My Properties
            </h1>

            <p className="mt-2 text-slate-600">
              Manage properties, buildings, floors, rooms, beds, pricing, and availability.
            </p>

          </div>


          <div className="flex flex-wrap gap-3">

            <Link
              to="/owner/dashboard"
              className="rounded-lg border border-slate-300 bg-white px-4 py-2 font-semibold text-slate-700"
            >
              ← Dashboard
            </Link>


            <button
              onClick={() => {
                setShowCreateForm(
                  (current) =>
                    !current
                );

                setError("");
              }}
              className="rounded-lg bg-slate-900 px-4 py-2 font-semibold text-white"
            >
              {
                showCreateForm
                  ? "Close Form"
                  : "Add Property"
              }
            </button>

          </div>

        </div>


        {
          error && (
            <div className="mt-6 rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
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
              className="mt-8 rounded-xl bg-white p-6 shadow-sm"
            >

              <h2 className="text-xl font-bold text-slate-900">
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
                    className="w-full rounded-lg border border-slate-300 px-3 py-2"
                    required
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


                <label>
                  <span className="mb-1 block text-sm font-semibold">
                    Address Line 1
                  </span>

                  <input
                    name="line1"
                    value={
                      form.line1
                    }
                    onChange={
                      handleChange
                    }
                    className="w-full rounded-lg border border-slate-300 px-3 py-2"
                    required
                  />
                </label>


                <label>
                  <span className="mb-1 block text-sm font-semibold">
                    Address Line 2
                  </span>

                  <input
                    name="line2"
                    value={
                      form.line2
                    }
                    onChange={
                      handleChange
                    }
                    className="w-full rounded-lg border border-slate-300 px-3 py-2"
                  />
                </label>


                <label>
                  <span className="mb-1 block text-sm font-semibold">
                    City
                  </span>

                  <input
                    name="city"
                    value={
                      form.city
                    }
                    onChange={
                      handleChange
                    }
                    className="w-full rounded-lg border border-slate-300 px-3 py-2"
                    required
                  />
                </label>


                <label>
                  <span className="mb-1 block text-sm font-semibold">
                    State / Province
                  </span>

                  <input
                    name="state"
                    value={
                      form.state
                    }
                    onChange={
                      handleChange
                    }
                    className="w-full rounded-lg border border-slate-300 px-3 py-2"
                    required
                  />
                </label>


                <label>
                  <span className="mb-1 block text-sm font-semibold">
                    Postal Code
                  </span>

                  <input
                    name="postalCode"
                    value={
                      form.postalCode
                    }
                    onChange={
                      handleChange
                    }
                    className="w-full rounded-lg border border-slate-300 px-3 py-2"
                    required
                  />
                </label>


                <label>
                  <span className="mb-1 block text-sm font-semibold">
                    Country
                  </span>

                  <input
                    name="country"
                    value={
                      form.country
                    }
                    onChange={
                      handleChange
                    }
                    className="w-full rounded-lg border border-slate-300 px-3 py-2"
                    required
                  />
                </label>


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

                  <span className="mt-1 block text-xs text-slate-500">
                    Separate amenities with commas.
                  </span>
                </label>

              </div>


              <button
                type="submit"
                disabled={
                  saving
                }
                className="mt-6 rounded-lg bg-green-600 px-5 py-2 font-semibold text-white disabled:opacity-50"
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

            <div className="mt-8 rounded-xl bg-white p-8 text-center shadow-sm">

              <h2 className="text-xl font-bold">
                No properties yet
              </h2>

              <p className="mt-2 text-slate-600">
                Create your first property to begin configuring accommodation.
              </p>

            </div>

          ) : (

            <div className="mt-8 grid gap-5 md:grid-cols-2">

              {
                properties.map(
                  (property) => (

                    <article
                      key={
                        property._id
                      }
                      className="rounded-xl bg-white p-6 shadow-sm"
                    >

                      <div className="flex items-start justify-between gap-4">

                        <div>

                          <h2 className="text-xl font-bold text-slate-900">
                            {
                              property.name
                            }
                          </h2>

                          <p className="mt-1 text-sm text-slate-500">
                            {
                              [
                                property.address?.city,
                                property.address?.state,
                                property.address?.country,
                              ]
                                .filter(Boolean)
                                .join(", ")
                            }
                          </p>

                        </div>


                        <span
                          className={
                            property.isActive
                              ? "rounded-full bg-green-100 px-3 py-1 text-xs font-semibold capitalize text-green-800"
                              : "rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-800"
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
                          <p className="mt-4 text-slate-600">
                            {
                              property.description
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

                          <div className="mt-4 flex flex-wrap gap-2">

                            {
                              property.amenities.map(
                                (
                                  amenity
                                ) => (

                                  <span
                                    key={
                                      amenity
                                    }
                                    className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-700"
                                  >
                                    {
                                      amenity
                                    }
                                  </span>

                                )
                              )
                            }

                          </div>

                        )
                      }


                      <Link
                        to={`/owner/properties/${property._id}/manage`}
                        className="mt-6 inline-block rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white"
                      >
                        Manage Property
                      </Link>

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