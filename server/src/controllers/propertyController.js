import Property from "../models/Property.js";

import {
  getOwnedProperty,
} from "../utils/propertyOwnership.js";

function sendError(
  res,
  error,
  fallbackMessage
) {
  if (
    error.name ===
    "ValidationError"
  ) {
    const messages =
      Object.values(
        error.errors
      ).map(
        (item) => item.message
      );

    return res.status(400).json({
      success: false,
      message: messages[0],
    });
  }

  if (error.name === "CastError") {
    return res.status(400).json({
      success: false,
      message: "Invalid identifier",
    });
  }

  console.error(
    fallbackMessage,
    error
  );

  return res.status(500).json({
    success: false,
    message: fallbackMessage,
  });
}

export async function createProperty(
  req,
  res
) {
  try {
    const property =
      await Property.create({
        ...req.body,
        owner: req.user._id,
      });

    return res.status(201).json({
      success: true,
      property,
    });
  } catch (error) {
    return sendError(
      res,
      error,
      "Unable to create property"
    );
  }
}

export async function getMyProperties(
  req,
  res
) {
  try {
    const properties =
      await Property.find({
        owner: req.user._id,
      }).sort({
        createdAt: -1,
      });

    return res.status(200).json({
      success: true,
      count: properties.length,
      properties,
    });
  } catch (error) {
    return sendError(
      res,
      error,
      "Unable to retrieve properties"
    );
  }
}

export async function getMyProperty(
  req,
  res
) {
  try {
    const property =
      await getOwnedProperty(
        req.params.propertyId,
        req.user._id
      );

    if (!property) {
      return res.status(404).json({
        success: false,
        message:
          "Property not found",
      });
    }

    return res.status(200).json({
      success: true,
      property,
    });
  } catch (error) {
    return sendError(
      res,
      error,
      "Unable to retrieve property"
    );
  }
}

export async function updateProperty(
  req,
  res
) {
  try {
    const property =
      await getOwnedProperty(
        req.params.propertyId,
        req.user._id
      );

    if (!property) {
      return res.status(404).json({
        success: false,
        message:
          "Property not found",
      });
    }

    const allowedFields = [
      "name",
      "description",
      "address",
      "location",
      "amenities",
      "images",
      "status",
      "isActive",
    ];

    for (const field of allowedFields) {
      if (
        Object.hasOwn(
          req.body,
          field
        )
      ) {
        property[field] =
          req.body[field];
      }
    }

    await property.save();

    return res.status(200).json({
      success: true,
      property,
    });
  } catch (error) {
    return sendError(
      res,
      error,
      "Unable to update property"
    );
  }
}

export async function deactivateProperty(
  req,
  res
) {
  try {
    const property =
      await getOwnedProperty(
        req.params.propertyId,
        req.user._id
      );

    if (!property) {
      return res.status(404).json({
        success: false,
        message:
          "Property not found",
      });
    }

    property.isActive = false;
    property.status = "inactive";

    await property.save();

    return res.status(200).json({
      success: true,
      message:
        "Property deactivated",
    });
  } catch (error) {
    return sendError(
      res,
      error,
      "Unable to deactivate property"
    );
  }
}