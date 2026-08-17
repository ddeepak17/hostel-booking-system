import useAuth from "../../hooks/useAuth";

function CustomerDashboard() {
  const { user, logout } = useAuth();

  return (
    <main className="min-h-screen bg-slate-100 p-8">
      <div className="mx-auto max-w-5xl">
        <h1 className="text-3xl font-bold text-slate-900">
          Customer Dashboard
        </h1>

        <p className="mt-2 text-slate-600">
          Welcome, {user.name}
        </p>

        <div className="mt-6 rounded-xl bg-white p-6 shadow-sm">
          <p>
            <strong>Email:</strong>{" "}
            {user.email}
          </p>

          <p className="mt-2">
            <strong>Role:</strong>{" "}
            {user.role}
          </p>
        </div>

        <button
          onClick={logout}
          className="mt-6 rounded-lg bg-slate-900 px-4 py-2 font-semibold text-white"
        >
          Logout
        </button>
      </div>
    </main>
  );
}

export default CustomerDashboard;