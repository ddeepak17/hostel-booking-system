import {
  Formik,
  Form,
  Field,
  ErrorMessage,
} from "formik";

import * as Yup from "yup";

import {
  Link,
  useNavigate,
} from "react-router";

import useAuth from "../../hooks/useAuth";

const validationSchema = Yup.object({
  email: Yup.string()
    .email("Enter a valid email")
    .required("Email is required"),

  password: Yup.string()
    .required("Password is required"),
});

function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();

  return (
    <main className="flex min-h-[calc(100vh-65px)] items-center justify-center bg-slate-100 px-4 py-10">
      <div className="w-full max-w-md rounded-2xl bg-white p-7 shadow-sm sm:p-8">
        <h1 className="text-2xl font-bold text-slate-900">
          Welcome back
        </h1>

        <p className="mt-2 text-sm text-slate-600">
          Sign in to manage your HostelHub account.
        </p>

        <Formik
          initialValues={{
            email: "",
            password: "",
          }}
          validationSchema={validationSchema}
          onSubmit={async (
            values,
            {
              setSubmitting,
              setStatus,
            }
          ) => {
            try {
              const user =
                await login(values);

              if (user.role === "customer") {
                navigate(
                  "/customer/dashboard"
                );
              } else if (
                user.role === "owner"
              ) {
                navigate(
                  "/owner/dashboard"
                );
              } else if (
                user.role === "superAdmin"
              ) {
                navigate(
                  "/admin/dashboard"
                );
              }
            } catch (error) {
              setStatus(
                error.response?.data
                  ?.message ||
                  "Unable to login"
              );
            } finally {
              setSubmitting(false);
            }
          }}
        >
          {({
            isSubmitting,
            status,
          }) => (
            <Form className="mt-6 space-y-4">
              <div>
                <label
                  htmlFor="email"
                  className="text-sm font-medium text-slate-700"
                >
                  Email
                </label>

                <Field
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  className="mt-1 w-full rounded-lg border border-slate-300 p-3 outline-none focus:border-slate-500"
                />

                <ErrorMessage
                  name="email"
                  component="p"
                  className="mt-1 text-sm text-red-600"
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="text-sm font-medium text-slate-700"
                >
                  Password
                </label>

                <Field
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  className="mt-1 w-full rounded-lg border border-slate-300 p-3 outline-none focus:border-slate-500"
                />

                <ErrorMessage
                  name="password"
                  component="p"
                  className="mt-1 text-sm text-red-600"
                />
              </div>

              {status && (
                <p className="text-sm text-red-600">
                  {status}
                </p>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full rounded-lg bg-slate-900 p-3 font-semibold text-white disabled:opacity-60"
              >
                {isSubmitting
                  ? "Signing in..."
                  : "Sign in"}
              </button>
            </Form>
          )}
        </Formik>

        <p className="mt-5 text-sm text-slate-600">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="font-semibold text-slate-900"
          >
            Create account
          </Link>
        </p>
      </div>
    </main>
  );
}

export default LoginPage;
