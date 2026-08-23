import api from "./axios";


export async function getProperties(
  filters = {}
) {
  const params =
    new URLSearchParams();


  for (
    const [
      key,
      value,
    ]
    of Object.entries(
      filters
    )
  ) {
    if (
      value !== "" &&
      value !== null &&
      value !== undefined &&
      value !== false
    ) {
      params.set(
        key,
        value
      );
    }
  }


  const query =
    params.toString();


  const response =
    await api.get(
      query
        ? `/properties?${query}`
        : "/properties"
    );


  return response.data;
}


export async function getProperty(
  id
) {
  const response =
    await api.get(
      `/properties/${id}`
    );

  return response.data;
}


export async function getPropertyRooms(
  propertyId
) {
  const response =
    await api.get(
      `/rooms/property/${propertyId}/rooms`
    );

  return response.data;
}


export async function getRoomBeds(
  roomId
) {
  const response =
    await api.get(
      `/beds/room/${roomId}/beds`
    );

  return response.data;
}


export async function createBooking(
  data
) {
  const response =
    await api.post(
      "/customer/bookings",
      data
    );

  return response.data;
}