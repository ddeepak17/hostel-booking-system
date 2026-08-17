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
  name: Yup.string()
    .min(2, "Name is too short")
    .required("Name is required"),

  email: Yup.string()
    .email("Enter a valid email")
    .required("Email is required"),

  password: Yup.string()
    .min(
      8,
      "Password must be at least 8 characters"
    )
    .required("Password is required"),

  phone: Yup.string(),
});

function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-100 px-4">
      <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-sm">
        <h1 className="text-2xl font-bold">
          Create account
        </h1>

        <Formik
          initialValues={{
            name: "",
            email: "",
            password: "",
            phone: "",
          }}
          validationSchema={
            validationSchema
          }
          onSubmit={async (
            values,
            {
              setSubmitting,
              setStatus,
            }
          ) => {
            try {
              await register(values);

              navigate(
                "/customer/dashboard"
              );
            } catch (error) {
              setStatus(
                error.response?.data
                  ?.message ||
                  "Unable to register"
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
                <label>Name</label>
                <Field
                  name="name"
                  className="mt-1 w-full rounded-lg border p-3"
                />
                <ErrorMessage
                  name="name"
                  component="p"
                  className="mt-1 text-sm text-red-600"
                />
              </div>

              <div>
                <label>Email</label>
                <Field
                  name="email"
                  type="email"
                  className="mt-1 w-full rounded-lg border p-3"
                />
                <ErrorMessage
                  name="email"
                  component="p"
                  className="mt-1 text-sm text-red-600"
                />
              </div>

              <div>
                <label>Password</label>
                <Field
                  name="password"
                  type="password"
                  className="mt-1 w-full rounded-lg border p-3"
                />
                <ErrorMessage
                  name="password"
                  component="p"
                  className="mt-1 text-sm text-red-600"
                />
              </div>

              <div>
                <label>Phone</label>
                <Field
                  name="phone"
                  className="mt-1 w-full rounded-lg border p-3"
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
                className="w-full rounded-lg bg-slate-900 p-3 font-semibold text-white"
              >
                {isSubmitting
                  ? "Creating..."
                  : "Create account"}
              </button>
            </Form>
          )}
        </Formik>

        <p className="mt-5 text-sm">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-semibold"
          >
            Login
          </Link>
        </p>
      </div>
    </main>
  );
}

export default RegisterPage;