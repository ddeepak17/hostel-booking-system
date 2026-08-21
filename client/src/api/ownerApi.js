import api from "./axios";


export async function getOwnerProperties() {
  const response =
    await api.get(
      "/owner/properties"
    );

  return response.data;
}


export async function getOwnerBookings(
  status = ""
) {
  const query =
    status
      ? `?status=${encodeURIComponent(status)}`
      : "";

  const response =
    await api.get(
      `/owner/bookings${query}`
    );

  return response.data;
}


export async function getOwnerBooking(
  bookingId
) {
  const response =
    await api.get(
      `/owner/bookings/${bookingId}`
    );

  return response.data;
}


export async function approveOwnerBooking(
  bookingId,
  note = ""
) {
  const response =
    await api.patch(
      `/owner/bookings/${bookingId}/approve`,
      {
        note,
      }
    );

  return response.data;
}


export async function rejectOwnerBooking(
  bookingId,
  note = ""
) {
  const response =
    await api.patch(
      `/owner/bookings/${bookingId}/reject`,
      {
        note,
      }
    );

  return response.data;
}


export async function completeOwnerBooking(
  bookingId
) {
  const response =
    await api.patch(
      `/owner/bookings/${bookingId}/complete`
    );

  return response.data;
}


export async function getOwnerTenants() {
  const response =
    await api.get(
      "/owner/tenants"
    );

  return response.data;
}