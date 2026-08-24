import {
  useEffect,
  useState,
} from "react";

import {
  createAdminOwner,
  getAdminOwners,
  setAdminUserStatus,
} from "../../api/adminApi";


const EMPTY_FORM = {
  name: "",
  email: "",
  password: "",
  phone: "",
};


export default function AdminOwners() {
  const [
    owners,
    setOwners,
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

  const [
    success,
    setSuccess,
  ] = useState("");

  const [
    submitting,
    setSubmitting,
  ] = useState(false);

  const [
    actionOwnerId,
    setActionOwnerId,
  ] = useState("");


  async function refreshOwners() {
    const data =
      await getAdminOwners();


    setOwners(
      Array.isArray(
        data.owners
      )
        ? data.owners
        : []
    );
  }


  useEffect(() => {
    let ignore =
      false;


    getAdminOwners()
      .then(
        (
          data
        ) => {
          if (
            !ignore
          ) {
            setOwners(
              Array.isArray(
                data.owners
              )
                ? data.owners
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
              "Unable to load owners"
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


  async function handleCreate(
    event
  ) {
    event.preventDefault();


    try {
      setError(
        ""
      );
      setSuccess("");
      setSubmitting(true);


      await createAdminOwner(
        form
      );


      setForm(
        EMPTY_FORM
      );


      await refreshOwners();
      setSuccess(
        "Property owner created successfully."
      );
    } catch (error) {
      setError(
        error.response
          ?.data
          ?.message ||
        "Unable to create owner"
      );
    } finally {
      setSubmitting(false);
    }
  }


  async function toggleOwner(
    owner
  ) {
    const ownerId =
      owner._id || owner.id;

    if (
      owner.isActive &&
      !window.confirm(
        `Disable ${owner.name}? They will no longer be able to sign in.`
      )
    ) {
      return;
    }

    try {
      setError("");
      setSuccess("");
      setActionOwnerId(ownerId);

      await setAdminUserStatus(
        ownerId,
        !owner.isActive
      );


      await refreshOwners();
      setSuccess(
        `${owner.name} was ${
          owner.isActive
            ? "disabled"
            : "activated"
        }.`
      );
    } catch (error) {
      setError(
        error.response
          ?.data
          ?.message ||
        "Unable to update owner"
      );
    } finally {
      setActionOwnerId("");
    }
  }


  if (loading) {
    return (
      <main className="min-h-[calc(100vh-65px)] bg-slate-100 px-4 py-8 sm:px-6">
        Loading owners...
      </main>
    );
  }


  return (
    <main className="min-h-[calc(100vh-65px)] bg-slate-100 px-4 py-8 sm:px-6">

      <div className="mx-auto max-w-6xl">

        <h1 className="text-3xl font-bold">
          Property Owners
        </h1>


        {
          error && (
            <p
              className="mt-4 rounded-lg border border-red-200 bg-red-50 p-4 text-red-700"
              role="alert"
            >
              {error}
            </p>
          )
        }

        {
          success && (
            <p
              className="mt-4 rounded-lg border border-green-200 bg-green-50 p-4 text-green-800"
              role="status"
            >
              {success}
            </p>
          )
        }


        <form
          onSubmit={
            handleCreate
          }
          className="mt-6 grid gap-3 rounded-xl bg-white p-6 shadow-sm md:grid-cols-2"
        >

          <label>
            <span className="mb-1 block text-sm font-semibold text-slate-700">
              Owner name
            </span>
            <input
              value={form.name}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  name: event.target.value,
                }))
              }
              autoComplete="name"
              className="w-full rounded border px-3 py-2"
              required
            />
          </label>


          <label>
            <span className="mb-1 block text-sm font-semibold text-slate-700">
              Email address
            </span>
            <input
              type="email"
              value={form.email}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  email: event.target.value,
                }))
              }
              autoComplete="email"
              className="w-full rounded border px-3 py-2"
              required
            />
          </label>


          <label>
            <span className="mb-1 block text-sm font-semibold text-slate-700">
              Temporary password
            </span>
            <input
              type="password"
              value={form.password}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  password: event.target.value,
                }))
              }
              autoComplete="new-password"
              className="w-full rounded border px-3 py-2"
              minLength="8"
              required
            />
          </label>


          <label>
            <span className="mb-1 block text-sm font-semibold text-slate-700">
              Phone number <span className="font-normal text-slate-500">(optional)</span>
            </span>
            <input
              type="tel"
              value={form.phone}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  phone: event.target.value,
                }))
              }
              autoComplete="tel"
              className="w-full rounded border px-3 py-2"
            />
          </label>


          <button
            type="submit"
            disabled={submitting}
            className="rounded bg-green-600 px-4 py-2 font-semibold text-white disabled:opacity-60 md:col-span-2"
          >
            {submitting
              ? "Creating owner..."
              : "Create Property Owner"}
          </button>

        </form>


        <div className="mt-8 space-y-4">

          {
            owners.length === 0 && (
              <div className="rounded-xl bg-white p-8 text-center text-slate-600 shadow-sm">
                No property owners have been created yet.
              </div>
            )
          }

          {
            owners.map(
              (
                owner
              ) => (

                <div
                  key={
                    owner._id ||
                    owner.id
                  }
                  className="rounded-xl bg-white p-5 shadow-sm"
                >

                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                    <div>

                      <h2 className="font-bold">
                        {owner.name}
                      </h2>

                      <p className="text-slate-600">
                        {owner.email}
                      </p>

                      <p className="text-sm text-slate-500">
                        {
                          owner.phone ||
                          "No phone"
                        }
                      </p>

                    </div>


                    <div className="flex items-center gap-3">

                      <span
                        className={
                          owner.isActive
                            ? "rounded-full bg-green-100 px-3 py-1 text-sm font-semibold text-green-800"
                            : "rounded-full bg-red-100 px-3 py-1 text-sm font-semibold text-red-800"
                        }
                      >
                        {
                          owner.isActive
                            ? "Active"
                            : "Disabled"
                        }
                      </span>


                      <button
                        type="button"
                        onClick={() =>
                          toggleOwner(
                            owner
                          )
                        }
                        disabled={
                          actionOwnerId ===
                          (owner._id || owner.id)
                        }
                        className="rounded border px-3 py-2 font-semibold disabled:opacity-60"
                      >
                        {
                          actionOwnerId ===
                          (owner._id || owner.id)
                            ? "Updating..."
                            :
                          owner.isActive
                            ? "Disable"
                            : "Activate"
                        }
                      </button>

                    </div>

                  </div>

                </div>

              )
            )
          }

        </div>

      </div>

    </main>
  );
}
