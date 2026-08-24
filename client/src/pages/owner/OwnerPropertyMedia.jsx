import {
  useEffect,
  useState,
} from "react";

import {
  Link,
  useParams,
} from "react-router-dom";

import {
  getOwnerProperty,
  updateOwnerProperty,
} from "../../api/ownerApi";

import {
  isCloudinaryConfigured,
  uploadPropertyImage,
} from "../../api/cloudinaryApi";


function getErrorMessage(
  error,
  fallback
) {
  return (
    error.response?.data?.message ||
    error.message ||
    fallback
  );
}


export default function OwnerPropertyMedia() {
  const {
    propertyId,
  } =
    useParams();


  const [
    property,
    setProperty,
  ] =
    useState(
      null
    );

  const [
    images,
    setImages,
  ] =
    useState(
      []
    );

  const [
    newImageUrl,
    setNewImageUrl,
  ] =
    useState(
      ""
    );

  const [
    newImageAlt,
    setNewImageAlt,
  ] =
    useState(
      ""
    );

  const [
    longitude,
    setLongitude,
  ] =
    useState(
      ""
    );

  const [
    latitude,
    setLatitude,
  ] =
    useState(
      ""
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
    uploading,
    setUploading,
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

  const [
    message,
    setMessage,
  ] =
    useState(
      ""
    );


  useEffect(() => {
    let ignore =
      false;


    getOwnerProperty(
      propertyId
    )
      .then(
        (
          data
        ) => {
          if (
            ignore
          ) {
            return;
          }


          const loaded =
            data.property;


          setProperty(
            loaded
          );


          setImages(
            Array.isArray(
              loaded.images
            )
              ? loaded.images
              : []
          );


          const coordinates =
            loaded.location
              ?.coordinates;


          if (
            Array.isArray(
              coordinates
            ) &&
            coordinates.length ===
              2
          ) {
            setLongitude(
              String(
                coordinates[
                  0
                ]
              )
            );

            setLatitude(
              String(
                coordinates[
                  1
                ]
              )
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
                "Unable to load property"
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
  }, [propertyId]);


  function addImageUrl(
    event
  ) {
    event.preventDefault();


    const url =
      newImageUrl.trim();


    if (
      !/^https?:\/\//i.test(
        url
      )
    ) {
      setError(
        "Enter a valid http or https image URL."
      );

      return;
    }


    setImages(
      (
        current
      ) => [
        ...current,
        {
          url,
          publicId:
            "",
          alt:
            newImageAlt.trim(),
        },
      ]
    );


    setNewImageUrl(
      ""
    );

    setNewImageAlt(
      ""
    );

    setError(
      ""
    );

    setMessage(
      "Image added locally. Click Save Media & Location to persist it."
    );
  }


  async function handleFileUpload(
    event
  ) {
    const file =
      event.target
        .files?.[0];


    event.target.value =
      "";


    if (!file) {
      return;
    }


    try {
      setUploading(
        true
      );

      setError(
        ""
      );

      setMessage(
        ""
      );


      const uploadedImage =
        await uploadPropertyImage(
          file
        );


      setImages(
        (
          current
        ) => [
          ...current,
          {
            ...uploadedImage,

            alt:
              property?.name
                ? `${property.name} property image`
                : "Property image",
          },
        ]
      );


      setMessage(
        "Cloudinary upload complete. Save the property to persist the image."
      );
    } catch (error) {
      setError(
        getErrorMessage(
          error,
          "Unable to upload image"
        )
      );
    } finally {
      setUploading(
        false
      );
    }
  }


  function removeImage(
    index
  ) {
    setImages(
      (
        current
      ) =>
        current.filter(
          (
            _,
            currentIndex
          ) =>
            currentIndex !==
            index
        )
    );


    setMessage(
      "Image removed locally. Save to persist the change."
    );
  }


  async function handleSave() {
    const payload = {
      images,
    };


    const hasLongitude =
      longitude.trim() !==
      "";

    const hasLatitude =
      latitude.trim() !==
      "";


    if (
      hasLongitude !==
      hasLatitude
    ) {
      setError(
        "Enter both longitude and latitude."
      );

      return;
    }


    if (
      hasLongitude &&
      hasLatitude
    ) {
      const lng =
        Number(
          longitude
        );

      const lat =
        Number(
          latitude
        );


      if (
        !Number.isFinite(
          lng
        ) ||
        !Number.isFinite(
          lat
        ) ||
        lng < -180 ||
        lng > 180 ||
        lat < -90 ||
        lat > 90
      ) {
        setError(
          "Longitude must be between -180 and 180, and latitude between -90 and 90."
        );

        return;
      }


      payload.location = {
        type:
          "Point",

        coordinates: [
          lng,
          lat,
        ],
      };
    }


    try {
      setSaving(
        true
      );

      setError(
        ""
      );

      setMessage(
        ""
      );


      const data =
        await updateOwnerProperty(
          propertyId,
          payload
        );


      setProperty(
        data.property
      );


      setImages(
        Array.isArray(
          data.property.images
        )
          ? data.property.images
          : []
      );


      setMessage(
        "Media and location saved."
      );
    } catch (error) {
      setError(
        getErrorMessage(
          error,
          "Unable to save media and location"
        )
      );
    } finally {
      setSaving(
        false
      );
    }
  }


  if (loading) {
    return (
      <main className="min-h-screen bg-slate-100 p-6">
        Loading property media...
      </main>
    );
  }


  if (!property) {
    return (
      <main className="min-h-screen bg-slate-100 p-6">
        Property not found.
      </main>
    );
  }


  const hasCoordinates =
    longitude !== "" &&
    latitude !== "";


  const mapQuery =
    hasCoordinates
      ? `${latitude},${longitude}`
      : [
          property.address
            ?.line1,
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
          );


  const mapEmbedUrl =
    `https://www.google.com/maps?q=${encodeURIComponent(
      mapQuery
    )}&z=15&output=embed`;


  return (
    <main className="min-h-screen bg-slate-100 p-4 sm:p-8">

      <div className="mx-auto max-w-6xl">

        <Link
          to="/owner/properties"
          className="font-semibold text-blue-600"
        >
          ← My Properties
        </Link>


        <div className="mt-3">

          <h1 className="text-3xl font-bold text-slate-900">
            Media & Location
          </h1>

          <p className="mt-2 text-slate-600">
            {
              property.name
            }
          </p>

        </div>


        {
          error && (
            <div className="mt-5 rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">
              {error}
            </div>
          )
        }


        {
          message && (
            <div className="mt-5 rounded-xl border border-green-200 bg-green-50 p-4 text-green-700">
              {message}
            </div>
          )
        }


        <section className="mt-8 rounded-2xl bg-white p-5 shadow-sm sm:p-6">

          <h2 className="text-xl font-bold">
            Property Images
          </h2>


          <p className="mt-2 text-sm text-slate-500">
            Add direct image URLs or upload through Cloudinary when configured.
          </p>


          <form
            onSubmit={
              addImageUrl
            }
            className="mt-5 grid gap-3 md:grid-cols-[2fr_1fr_auto]"
          >

            <input
              value={
                newImageUrl
              }
              onChange={(
                event
              ) =>
                setNewImageUrl(
                  event.target.value
                )
              }
              placeholder="https://example.com/property.jpg"
              className="rounded-lg border border-slate-300 px-3 py-2"
            />


            <input
              value={
                newImageAlt
              }
              onChange={(
                event
              ) =>
                setNewImageAlt(
                  event.target.value
                )
              }
              placeholder="Image description"
              className="rounded-lg border border-slate-300 px-3 py-2"
            />


            <button
              className="rounded-lg bg-slate-900 px-4 py-2 font-semibold text-white"
            >
              Add URL
            </button>

          </form>


          <div className="mt-4">

            {
              isCloudinaryConfigured() ? (

                <label className="inline-flex cursor-pointer items-center rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white">

                  {
                    uploading
                      ? "Uploading..."
                      : "Upload Image"
                  }

                  <input
                    type="file"
                    accept="image/*"
                    disabled={
                      uploading
                    }
                    onChange={
                      handleFileUpload
                    }
                    className="hidden"
                  />

                </label>

              ) : (

                <p className="text-sm text-slate-500">
                  Cloudinary is not configured. URL images still work normally.
                </p>

              )
            }

          </div>


          {
            images.length ===
            0 ? (

              <div className="mt-6 rounded-xl border border-dashed border-slate-300 p-8 text-center text-slate-500">
                No property images yet.
              </div>

            ) : (

              <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">

                {
                  images.map(
                    (
                      image,
                      index
                    ) => (

                      <article
                        key={`${image.url}-${index}`}
                        className="overflow-hidden rounded-xl border border-slate-200"
                      >

                        <img
                          src={
                            image.url
                          }
                          alt={
                            image.alt ||
                            `${property.name} image`
                          }
                          className="h-48 w-full object-cover"
                        />


                        <div className="p-3">

                          <p className="truncate text-sm text-slate-500">
                            {
                              image.alt ||
                              "Property image"
                            }
                          </p>


                          <button
                            type="button"
                            onClick={() =>
                              removeImage(
                                index
                              )
                            }
                            className="mt-2 text-sm font-semibold text-red-600"
                          >
                            Remove
                          </button>

                        </div>

                      </article>

                    )
                  )
                }

              </div>

            )
          }

        </section>


        <section className="mt-8 rounded-2xl bg-white p-5 shadow-sm sm:p-6">

          <h2 className="text-xl font-bold">
            Property Location
          </h2>


          <p className="mt-2 text-sm text-slate-500">
            Longitude and latitude are optional. The address is used as the map fallback.
          </p>


          <div className="mt-5 grid gap-4 sm:grid-cols-2">

            <label>

              <span className="mb-1 block text-sm font-semibold">
                Longitude
              </span>

              <input
                type="number"
                step="any"
                value={
                  longitude
                }
                onChange={(
                  event
                ) =>
                  setLongitude(
                    event.target.value
                  )
                }
                placeholder="-63.5752"
                className="w-full rounded-lg border border-slate-300 px-3 py-2"
              />

            </label>


            <label>

              <span className="mb-1 block text-sm font-semibold">
                Latitude
              </span>

              <input
                type="number"
                step="any"
                value={
                  latitude
                }
                onChange={(
                  event
                ) =>
                  setLatitude(
                    event.target.value
                  )
                }
                placeholder="44.6488"
                className="w-full rounded-lg border border-slate-300 px-3 py-2"
              />

            </label>

          </div>


          <div className="mt-6 overflow-hidden rounded-xl border border-slate-200">

            <iframe
              title={`${property.name} location`}
              src={
                mapEmbedUrl
              }
              className="h-80 w-full"
              loading="lazy"
            />

          </div>

        </section>


        <button
          type="button"
          onClick={
            handleSave
          }
          disabled={
            saving
          }
          className="mt-8 rounded-xl bg-green-600 px-6 py-3 font-bold text-white shadow-sm disabled:opacity-50"
        >
          {
            saving
              ? "Saving..."
              : "Save Media & Location"
          }
        </button>

      </div>

    </main>
  );
}