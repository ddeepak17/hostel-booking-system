import {
  useEffect,
  useState,
} from "react";

import {
  Link,
} from "react-router-dom";

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


      await createAdminOwner(
        form
      );


      setForm(
        EMPTY_FORM
      );


      await refreshOwners();
    } catch (error) {
      setError(
        error.response
          ?.data
          ?.message ||
        "Unable to create owner"
      );
    }
  }


  async function toggleOwner(
    owner
  ) {
    try {
      await setAdminUserStatus(
        owner._id ||
          owner.id,
        !owner.isActive
      );


      await refreshOwners();
    } catch (error) {
      setError(
        error.response
          ?.data
          ?.message ||
        "Unable to update owner"
      );
    }
  }


  if (loading) {
    return (
      <main className="p-8">
        Loading owners...
      </main>
    );
  }


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
          Property Owners
        </h1>


        {
          error && (
            <p className="mt-4 text-red-600">
              {error}
            </p>
          )
        }


        <form
          onSubmit={
            handleCreate
          }
          className="mt-6 grid gap-3 rounded-xl bg-white p-6 shadow-sm md:grid-cols-2"
        >

          <input
            value={
              form.name
            }
            onChange={(
              event
            ) =>
              setForm(
                (
                  current
                ) => ({
                  ...current,
                  name:
                    event.target.value,
                })
              )
            }
            placeholder="Name"
            className="rounded border px-3 py-2"
            required
          />


          <input
            type="email"
            value={
              form.email
            }
            onChange={(
              event
            ) =>
              setForm(
                (
                  current
                ) => ({
                  ...current,
                  email:
                    event.target.value,
                })
              )
            }
            placeholder="Email"
            className="rounded border px-3 py-2"
            required
          />


          <input
            type="password"
            value={
              form.password
            }
            onChange={(
              event
            ) =>
              setForm(
                (
                  current
                ) => ({
                  ...current,
                  password:
                    event.target.value,
                })
              )
            }
            placeholder="Temporary password"
            className="rounded border px-3 py-2"
            minLength="8"
            required
          />


          <input
            value={
              form.phone
            }
            onChange={(
              event
            ) =>
              setForm(
                (
                  current
                ) => ({
                  ...current,
                  phone:
                    event.target.value,
                })
              )
            }
            placeholder="Phone"
            className="rounded border px-3 py-2"
          />


          <button
            type="submit"
            className="rounded bg-green-600 px-4 py-2 font-semibold text-white md:col-span-2"
          >
            Create Property Owner
          </button>

        </form>


        <div className="mt-8 space-y-4">

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
                        onClick={() =>
                          toggleOwner(
                            owner
                          )
                        }
                        className="rounded border px-3 py-2 font-semibold"
                      >
                        {
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