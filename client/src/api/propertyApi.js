import api from "./axios";


export async function getProperties(){

  const response =
    await api.get("/properties");

  return response.data;

}



export async function getProperty(id){

  const response =
    await api.get(`/properties/${id}`);

  return response.data;

}



export async function getPropertyRooms(propertyId){

  const response =
    await api.get(
      `/rooms/property/${propertyId}/rooms`
    );

  return response.data;

}

export async function getRoomBeds(roomId){

  const response =
    await api.get(
      `/beds/room/${roomId}/beds`
    );

  return response.data;

}

export async function createBooking(data){

  const response =
    await api.post(
      "/customer/bookings",
      data
    );

  return response.data;

}