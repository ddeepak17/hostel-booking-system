export function sendControllerError(
  res,
  error,
  fallbackMessage
) {
  if (error.name === "ValidationError") {
    const validationMessage =
      Object.values(error.errors)
        .map((item) => item.message)
        .find(Boolean);

    return res.status(400).json({
      success: false,
      message:
        validationMessage ||
        "The submitted data is invalid",
    });
  }

  console.error(fallbackMessage, error);

  return res.status(500).json({
    success: false,
    message: fallbackMessage,
  });
}
