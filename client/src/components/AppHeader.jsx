import {
  Link,
  NavLink,
} from "react-router-dom";

import useAuth from "../hooks/useAuth";


function linkClass({
  isActive,
}) {
  return [
    "rounded-lg px-3 py-2 text-sm font-semibold transition",
    isActive
      ? "bg-slate-900 text-white"
      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900",
  ].join(" ");
}


export default function AppHeader() {
  const {
    user,
    logout,
  } =
    useAuth();


  const roleLinks = {
    customer: [
      [
        "/customer/dashboard",
        "Dashboard",
      ],
      [
        "/properties",
        "Browse",
      ],
      [
        "/customer/bookings",
        "Bookings",
      ],
      [
        "/customer/profile",
        "Profile",
      ],
    ],

    owner: [
      [
        "/owner/dashboard",
        "Dashboard",
      ],
      [
        "/owner/properties",
        "Properties",
      ],
      [
        "/owner/bookings",
        "Bookings",
      ],
      [
        "/owner/tenants",
        "Tenants",
      ],
    ],

    superAdmin: [
      [
        "/admin/dashboard",
        "Dashboard",
      ],
      [
        "/admin/owners",
        "Owners",
      ],
      [
        "/admin/users",
        "Users",
      ],
      [
        "/admin/properties",
        "Properties",
      ],
      [
        "/admin/bookings",
        "Bookings",
      ],
    ],
  };


  const links =
    user
      ? roleLinks[
          user.role
        ] || []
      : [];


  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur">

      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6">

        <Link
          to="/"
          className="text-lg font-black tracking-tight text-slate-900"
        >
          HostelHub
        </Link>


        {
          user ? (

            <div className="flex flex-wrap items-center justify-end gap-2">

              <nav className="flex flex-wrap items-center gap-1">

                {
                  links.map(
                    ([
                      to,
                      label,
                    ]) => (

                      <NavLink
                        key={
                          to
                        }
                        to={
                          to
                        }
                        className={
                          linkClass
                        }
                      >
                        {
                          label
                        }
                      </NavLink>

                    )
                  )
                }

              </nav>


              <div className="ml-1 hidden border-l border-slate-200 pl-3 sm:block">

                <p className="max-w-40 truncate text-sm font-semibold text-slate-900">
                  {
                    user.name
                  }
                </p>

                <p className="text-xs capitalize text-slate-500">
                  {
                    user.role ===
                    "superAdmin"
                      ? "Super Admin"
                      : user.role
                  }
                </p>

              </div>


              <button
                onClick={
                  logout
                }
                className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                Logout
              </button>

            </div>

          ) : (

            <nav className="flex items-center gap-2">

              <NavLink
                to="/properties"
                className={
                  linkClass
                }
              >
                Browse
              </NavLink>


              <NavLink
                to="/login"
                className={
                  linkClass
                }
              >
                Login
              </NavLink>


              <Link
                to="/register"
                className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white"
              >
                Register
              </Link>

            </nav>

          )
        }

      </div>

    </header>
  );
}