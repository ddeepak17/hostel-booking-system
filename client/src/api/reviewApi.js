import api from "./axios";


export async function getPropertyReviews(
  propertyId
) {
  const response =
    await api.get(
      `/reviews/property/${propertyId}`
    );

  return response.data;
}


export async function savePropertyReview(
  propertyId,
  data
) {
  const response =
    await api.post(
      `/reviews/property/${propertyId}`,
      data
    );

  return response.data;
}