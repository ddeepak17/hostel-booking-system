import api from "./axios";


export async function getAdminOverview() {
  const response =
    await api.get(
      "/admin/dashboard"
    );

  return response.data;
}


export async function getAdminOwners() {
  const response =
    await api.get(
      "/admin/owners"
    );

  return response.data;
}


export async function createAdminOwner(
  data
) {
  const response =
    await api.post(
      "/admin/owners",
      data
    );

  return response.data;
}


export async function getAdminUsers(
  role = ""
) {
  const query =
    role
      ? `?role=${encodeURIComponent(
          role
        )}`
      : "";


  const response =
    await api.get(
      `/admin/users${query}`
    );

  return response.data;
}


export async function setAdminUserStatus(
  userId,
  isActive
) {
  const response =
    await api.patch(
      `/admin/users/${userId}/status`,
      {
        isActive,
      }
    );

  return response.data;
}


export async function getAdminProperties() {
  const response =
    await api.get(
      "/admin/properties"
    );

  return response.data;
}


export async function getAdminBookings(
  status = ""
) {
  const query =
    status
      ? `?status=${encodeURIComponent(
          status
        )}`
      : "";


  const response =
    await api.get(
      `/admin/bookings${query}`
    );

  return response.data;
}