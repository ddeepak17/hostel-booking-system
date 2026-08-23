import api from "./axios";


export async function updateProfile(
  data
) {
  const response =
    await api.patch(
      "/auth/me",
      data
    );

  return response.data;
}