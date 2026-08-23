import api from "./axios";


/*
  --------------------------------
  Properties
  --------------------------------
*/

export async function getOwnerProperties() {
  const response =
    await api.get(
      "/owner/properties"
    );

  return response.data;
}


export async function getOwnerProperty(
  propertyId
) {
  const response =
    await api.get(
      `/owner/properties/${propertyId}`
    );

  return response.data;
}


export async function createOwnerProperty(
  propertyData
) {
  const response =
    await api.post(
      "/owner/properties",
      propertyData
    );

  return response.data;
}


export async function updateOwnerProperty(
  propertyId,
  propertyData
) {
  const response =
    await api.patch(
      `/owner/properties/${propertyId}`,
      propertyData
    );

  return response.data;
}


export async function deactivateOwnerProperty(
  propertyId
) {
  const response =
    await api.delete(
      `/owner/properties/${propertyId}`
    );

  return response.data;
}


/*
  --------------------------------
  Buildings
  --------------------------------
*/

export async function getOwnerBuildings(
  propertyId
) {
  const response =
    await api.get(
      `/owner/properties/${propertyId}/buildings`
    );

  return response.data;
}


export async function createOwnerBuilding(
  propertyId,
  buildingData
) {
  const response =
    await api.post(
      `/owner/properties/${propertyId}/buildings`,
      buildingData
    );

  return response.data;
}


export async function updateOwnerBuilding(
  buildingId,
  buildingData
) {
  const response =
    await api.patch(
      `/owner/buildings/${buildingId}`,
      buildingData
    );

  return response.data;
}


export async function deactivateOwnerBuilding(
  buildingId
) {
  const response =
    await api.delete(
      `/owner/buildings/${buildingId}`
    );

  return response.data;
}


/*
  --------------------------------
  Floors
  --------------------------------
*/

export async function getOwnerFloors(
  buildingId
) {
  const response =
    await api.get(
      `/owner/buildings/${buildingId}/floors`
    );

  return response.data;
}


export async function createOwnerFloor(
  buildingId,
  floorData
) {
  const response =
    await api.post(
      `/owner/buildings/${buildingId}/floors`,
      floorData
    );

  return response.data;
}


export async function updateOwnerFloor(
  floorId,
  floorData
) {
  const response =
    await api.patch(
      `/owner/floors/${floorId}`,
      floorData
    );

  return response.data;
}


export async function deactivateOwnerFloor(
  floorId
) {
  const response =
    await api.delete(
      `/owner/floors/${floorId}`
    );

  return response.data;
}


/*
  --------------------------------
  Rooms
  --------------------------------
*/

export async function getOwnerRooms(
  floorId
) {
  const response =
    await api.get(
      `/owner/floors/${floorId}/rooms`
    );

  return response.data;
}


export async function createOwnerRoom(
  floorId,
  roomData
) {
  const response =
    await api.post(
      `/owner/floors/${floorId}/rooms`,
      roomData
    );

  return response.data;
}


export async function updateOwnerRoom(
  roomId,
  roomData
) {
  const response =
    await api.patch(
      `/owner/rooms/${roomId}`,
      roomData
    );

  return response.data;
}


export async function deactivateOwnerRoom(
  roomId
) {
  const response =
    await api.delete(
      `/owner/rooms/${roomId}`
    );

  return response.data;
}


/*
  --------------------------------
  Beds
  --------------------------------
*/

export async function getOwnerBeds(
  roomId
) {
  const response =
    await api.get(
      `/owner/rooms/${roomId}/beds`
    );

  return response.data;
}


export async function createOwnerBed(
  roomId,
  bedData
) {
  const response =
    await api.post(
      `/owner/rooms/${roomId}/beds`,
      bedData
    );

  return response.data;
}


export async function updateOwnerBed(
  bedId,
  bedData
) {
  const response =
    await api.patch(
      `/owner/beds/${bedId}`,
      bedData
    );

  return response.data;
}


export async function deactivateOwnerBed(
  bedId
) {
  const response =
    await api.delete(
      `/owner/beds/${bedId}`
    );

  return response.data;
}


/*
  --------------------------------
  Bookings
  --------------------------------
*/

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


/*
  --------------------------------
  Tenants
  --------------------------------
*/

export async function getOwnerTenants() {
  const response =
    await api.get(
      "/owner/tenants"
    );

  return response.data;
}