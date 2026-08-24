import {
  useEffect,
  useState,
} from "react";

import {
  getAdminUsers,
  setAdminUserStatus,
} from "../../api/adminApi";


export default function AdminUsers() {
  const [
    users,
    setUsers,
  ] =
    useState(
      []
    );

  const [
    role,
    setRole,
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
    error,
    setError,
  ] =
    useState(
      ""
    );


  async function refreshUsers(
    selectedRole =
      role
  ) {
    const data =
      await getAdminUsers(
        selectedRole
      );


    setUsers(
      Array.isArray(
        data.users
      )
        ? data.users
        : []
    );
  }


  useEffect(() => {
    let ignore =
      false;


    getAdminUsers(
      role
    )
      .then(
        (
          data
        ) => {
          if (
            !ignore
          ) {
            setUsers(
              Array.isArray(
                data.users
              )
                ? data.users
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
              "Unable to load users"
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
  }, [role]);


  function handleRoleChange(
    event
  ) {
    setLoading(
      true
    );

    setError(
      ""
    );

    setRole(
      event.target.value
    );
  }


  async function toggleUser(
    user
  ) {
    try {
      setError(
        ""
      );


      await setAdminUserStatus(
        user._id,
        !user.isActive
      );


      await refreshUsers();
    } catch (error) {
      setError(
        error.response
          ?.data
          ?.message ||
        "Unable to update user"
      );
    }
  }


  return (
    <main className="min-h-[calc(100vh-65px)] bg-slate-100 px-4 py-8 sm:px-6">

      <div className="mx-auto max-w-6xl">

        <div className="flex flex-wrap items-center justify-between gap-3">

          <h1 className="text-3xl font-bold">
            Users
          </h1>


          <select
            aria-label="Filter users by role"
            value={
              role
            }
            onChange={
              handleRoleChange
            }
            className="rounded border bg-white px-3 py-2"
          >
            <option value="">
              All Users
            </option>

            <option value="customer">
              Customers
            </option>

            <option value="owner">
              Owners
            </option>
          </select>

        </div>


        {
          error && (
            <p className="mt-5 text-red-600">
              {error}
            </p>
          )
        }


        {
          loading ? (

            <p className="mt-6">
              Loading users...
            </p>

          ) : users.length ===
            0 ? (

            <div className="mt-6 rounded-xl bg-white p-8 text-center shadow-sm">

              <p className="text-slate-600">
                No users found.
              </p>

            </div>

          ) : (

            <div className="mt-6 space-y-3">

              {
                users.map(
                  (
                    user
                  ) => (

                    <div
                      key={
                        user._id
                      }
                      className="rounded-xl bg-white p-5 shadow-sm"
                    >

                      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                        <div>

                          <h2 className="font-bold">
                            {user.name}
                          </h2>

                          <p className="text-slate-600">
                            {user.email}
                          </p>

                          <p className="text-sm capitalize text-slate-500">
                            {user.role}
                          </p>

                          {
                            user.phone && (

                              <p className="text-sm text-slate-500">
                                {user.phone}
                              </p>

                            )
                          }

                        </div>


                        <div className="flex items-center gap-3">

                          <span
                            className={
                              user.isActive
                                ? "rounded-full bg-green-100 px-3 py-1 text-sm font-semibold text-green-800"
                                : "rounded-full bg-red-100 px-3 py-1 text-sm font-semibold text-red-800"
                            }
                          >
                            {
                              user.isActive
                                ? "Active"
                                : "Disabled"
                            }
                          </span>


                          <button
                            onClick={() =>
                              toggleUser(
                                user
                              )
                            }
                            className={
                              user.isActive
                                ? "rounded bg-red-100 px-3 py-2 font-semibold text-red-700"
                                : "rounded bg-green-100 px-3 py-2 font-semibold text-green-700"
                            }
                          >
                            {
                              user.isActive
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

          )
        }

      </div>

    </main>
  );
}
