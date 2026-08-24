import {
  useState,
} from "react";

import useAuth from "../../hooks/useAuth";

import {
  updateProfile,
} from "../../api/profileApi";


export default function CustomerProfile() {
  const {
    user,
    refreshUser,
  } =
    useAuth();


  const [
    form,
    setForm,
  ] =
    useState(
      () => ({
        name:
          user?.name || "",

        phone:
          user?.phone || "",

        avatar:
          user?.avatar || "",
      })
    );


  const [
    message,
    setMessage,
  ] =
    useState(
      ""
    );

  const [
    error,
    setError,
  ] =
    useState(
      ""
    );

  const [
    saving,
    setSaving,
  ] =
    useState(
      false
    );


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


  async function handleSubmit(
    event
  ) {
    event.preventDefault();


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
        await updateProfile({
          name:
            form.name.trim(),

          phone:
            form.phone.trim(),

          avatar:
            form.avatar.trim(),
        });


      setMessage(
        data.message ||
        "Profile updated"
      );


      const updatedUser =
        await refreshUser();


      setForm({
        name:
          updatedUser?.name ||
          "",

        phone:
          updatedUser?.phone ||
          "",

        avatar:
          updatedUser?.avatar ||
          "",
      });
    } catch (error) {
      setError(
        error.response
          ?.data
          ?.message ||
        "Unable to update profile"
      );
    } finally {
      setSaving(
        false
      );
    }
  }


  return (
    <main className="min-h-[calc(100vh-65px)] bg-slate-100 px-4 py-8 sm:px-6">

      <div className="mx-auto max-w-2xl">

        <div className="rounded-xl bg-white p-6 shadow-sm">

          <h1 className="text-3xl font-bold">
            My Profile
          </h1>


          <p className="mt-2 text-slate-600">
            {user?.email}
          </p>


          {
            form.avatar && (

              <div className="mt-5">

                <img
                  src={
                    form.avatar
                  }
                  alt="Profile"
                  className="h-20 w-20 rounded-full border object-cover"
                />

              </div>

            )
          }


          {
            message && (
              <p className="mt-4 text-green-600">
                {message}
              </p>
            )
          }


          {
            error && (
              <p className="mt-4 text-red-600">
                {error}
              </p>
            )
          }


          <form
            onSubmit={
              handleSubmit
            }
            className="mt-6 space-y-4"
          >

            <label className="block">

              <span className="mb-1 block font-semibold">
                Name
              </span>

              <input
                name="name"
                value={
                  form.name
                }
                onChange={
                  handleChange
                }
                className="w-full rounded border px-3 py-2"
                required
              />

            </label>


            <label className="block">

              <span className="mb-1 block font-semibold">
                Email
              </span>

              <input
                value={
                  user?.email ||
                  ""
                }
                disabled
                className="w-full rounded border bg-slate-100 px-3 py-2 text-slate-500"
              />

              <span className="mt-1 block text-xs text-slate-500">
                Email cannot currently be changed.
              </span>

            </label>


            <label className="block">

              <span className="mb-1 block font-semibold">
                Phone
              </span>

              <input
                name="phone"
                value={
                  form.phone
                }
                onChange={
                  handleChange
                }
                className="w-full rounded border px-3 py-2"
              />

            </label>


            <label className="block">

              <span className="mb-1 block font-semibold">
                Avatar URL
              </span>

              <input
                name="avatar"
                value={
                  form.avatar
                }
                onChange={
                  handleChange
                }
                placeholder="https://example.com/photo.jpg"
                className="w-full rounded border px-3 py-2"
              />

            </label>


            <button
              disabled={
                saving
              }
              type="submit"
              className="rounded bg-blue-600 px-5 py-2 font-semibold text-white disabled:opacity-50"
            >
              {
                saving
                  ? "Saving..."
                  : "Save Profile"
              }
            </button>

          </form>

        </div>

      </div>

    </main>
  );
}
