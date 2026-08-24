export function isCloudinaryConfigured() {
  return Boolean(
    import.meta.env
      .VITE_CLOUDINARY_CLOUD_NAME &&
      import.meta.env
        .VITE_CLOUDINARY_UPLOAD_PRESET
  );
}


export async function uploadPropertyImage(
  file
) {
  const cloudName =
    import.meta.env
      .VITE_CLOUDINARY_CLOUD_NAME;

  const uploadPreset =
    import.meta.env
      .VITE_CLOUDINARY_UPLOAD_PRESET;


  if (
    !cloudName ||
    !uploadPreset
  ) {
    throw new Error(
      "Cloudinary is not configured"
    );
  }


  if (!file) {
    throw new Error(
      "Please select an image"
    );
  }


  if (
    !file.type.startsWith(
      "image/"
    )
  ) {
    throw new Error(
      "Only image files are allowed"
    );
  }


  const maxBytes =
    8 * 1024 * 1024;


  if (
    file.size >
    maxBytes
  ) {
    throw new Error(
      "Image must be smaller than 8 MB"
    );
  }


  const formData =
    new FormData();


  formData.append(
    "file",
    file
  );


  formData.append(
    "upload_preset",
    uploadPreset
  );


  const response =
    await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      {
        method:
          "POST",

        body:
          formData,
      }
    );


  if (!response.ok) {
    const errorData =
      await response
        .json()
        .catch(
          () => ({})
        );


    throw new Error(
      errorData.error?.message ||
        "Unable to upload image"
    );
  }


  const data =
    await response.json();


  return {
    url:
      data.secure_url,

    publicId:
      data.public_id,

    alt:
      "",
  };
}