import api from "./axios";


export async function getMyBookings() {

  const response =
    await api.get(
      "/customer/bookings"
    );

  return response.data;

}


export async function cancelBooking(
  bookingId,
  reason = ""
) {

  const response =
    await api.patch(
      `/customer/bookings/${bookingId}/cancel`,
      {
        reason,
      }
    );

  return response.data;

}