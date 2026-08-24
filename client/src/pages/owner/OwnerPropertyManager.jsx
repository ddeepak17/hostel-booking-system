import {
  useEffect,
  useState,
} from "react";

import {
  Link,
  useParams,
} from "react-router-dom";

import {
  createOwnerBed,
  createOwnerBuilding,
  createOwnerFloor,
  createOwnerRoom,
  deactivateOwnerBed,
  deactivateOwnerBuilding,
  deactivateOwnerFloor,
  deactivateOwnerProperty,
  deactivateOwnerRoom,
  getOwnerBeds,
  getOwnerBuildings,
  getOwnerFloors,
  getOwnerProperty,
  getOwnerRooms,
  updateOwnerBed,
  updateOwnerBuilding,
  updateOwnerFloor,
  updateOwnerProperty,
  updateOwnerRoom,
} from "../../api/ownerApi";


function getErrorMessage(
  error,
  fallback
) {
  return (
    error.response?.data?.message ||
    fallback
  );
}


function emptyRoom() {
  return {
    roomNumber: "",
    roomType: "double",
    capacity: "1",
    monthlyRent: "",
    securityDeposit: "0",
    amenities: "",
  };
}


export default function OwnerPropertyManager() {
  const {
    propertyId,
  } = useParams();


  const [
    property,
    setProperty,
  ] = useState(null);

  const [
    buildings,
    setBuildings,
  ] = useState([]);

  const [
    floorsByBuilding,
    setFloorsByBuilding,
  ] = useState({});

  const [
    roomsByFloor,
    setRoomsByFloor,
  ] = useState({});

  const [
    bedsByRoom,
    setBedsByRoom,
  ] = useState({});


  const [
    propertyForm,
    setPropertyForm,
  ] = useState({
    name: "",
    description: "",
    line1: "",
    line2: "",
    city: "",
    state: "",
    postalCode: "",
    country: "",
    amenities: "",
    status: "draft",
  });


  const [
    buildingForm,
    setBuildingForm,
  ] = useState({
    name: "",
    code: "",
  });


  const [
    floorDrafts,
    setFloorDrafts,
  ] = useState({});

  const [
    roomDrafts,
    setRoomDrafts,
  ] = useState({});

  const [
    bedDrafts,
    setBedDrafts,
  ] = useState({});


  const [
    expandedBuildings,
    setExpandedBuildings,
  ] = useState({});

  const [
    expandedFloors,
    setExpandedFloors,
  ] = useState({});

  const [
    expandedRooms,
    setExpandedRooms,
  ] = useState({});


  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    error,
    setError,
  ] = useState("");

  const [
    success,
    setSuccess,
  ] = useState("");

  const [
    actionLoading,
    setActionLoading,
  ] = useState(false);


  useEffect(() => {
    let ignore = false;

    Promise.all([
      getOwnerProperty(
        propertyId
      ),
      getOwnerBuildings(
        propertyId
      ),
    ])
      .then(
        ([
          propertyData,
          buildingData,
        ]) => {
          if (ignore) {
            return;
          }

          const loadedProperty =
            propertyData.property;

          setProperty(
            loadedProperty
          );

          setBuildings(
            Array.isArray(
              buildingData.buildings
            )
              ? buildingData.buildings
              : []
          );

          setPropertyForm({
            name:
              loadedProperty.name ||
              "",

            description:
              loadedProperty.description ||
              "",

            line1:
              loadedProperty.address
                ?.line1 || "",

            line2:
              loadedProperty.address
                ?.line2 || "",

            city:
              loadedProperty.address
                ?.city || "",

            state:
              loadedProperty.address
                ?.state || "",

            postalCode:
              loadedProperty.address
                ?.postalCode || "",

            country:
              loadedProperty.address
                ?.country || "",

            amenities:
              Array.isArray(
                loadedProperty.amenities
              )
                ? loadedProperty.amenities.join(
                    ", "
                  )
                : "",

            status:
              loadedProperty.status ===
              "inactive"
                ? "draft"
                : loadedProperty.status,
          });
        }
      )
      .catch((error) => {
        if (ignore) {
          return;
        }

        console.error(error);

        setError(
          getErrorMessage(
            error,
            "Unable to load property"
          )
        );
      })
      .finally(() => {
        if (!ignore) {
          setLoading(false);
        }
      });

    return () => {
      ignore = true;
    };
  }, [propertyId]);


  async function refreshProperty() {
    const data =
      await getOwnerProperty(
        propertyId
      );

    setProperty(
      data.property
    );
  }


  async function refreshBuildings() {
    const data =
      await getOwnerBuildings(
        propertyId
      );

    setBuildings(
      Array.isArray(
        data.buildings
      )
        ? data.buildings
        : []
    );
  }


  async function refreshFloors(
    buildingId
  ) {
    const data =
      await getOwnerFloors(
        buildingId
      );

    setFloorsByBuilding(
      (current) => ({
        ...current,

        [buildingId]:
          Array.isArray(
            data.floors
          )
            ? data.floors
            : [],
      })
    );
  }


  async function refreshRooms(
    floorId
  ) {
    const data =
      await getOwnerRooms(
        floorId
      );

    setRoomsByFloor(
      (current) => ({
        ...current,

        [floorId]:
          Array.isArray(
            data.rooms
          )
            ? data.rooms
            : [],
      })
    );
  }


  async function refreshBeds(
    roomId
  ) {
    const data =
      await getOwnerBeds(
        roomId
      );

    setBedsByRoom(
      (current) => ({
        ...current,

        [roomId]:
          Array.isArray(
            data.beds
          )
            ? data.beds
            : [],
      })
    );
  }


  function changePropertyField(
    event
  ) {
    const {
      name,
      value,
    } = event.target;

    setPropertyForm(
      (current) => ({
        ...current,
        [name]: value,
      })
    );
  }


  async function handleSaveProperty(
    event
  ) {
    event.preventDefault();

    try {
      setActionLoading(true);
      setError("");
      setSuccess("");

      await updateOwnerProperty(
        propertyId,
        {
          name:
            propertyForm.name.trim(),

          description:
            propertyForm.description.trim(),

          address: {
            line1:
              propertyForm.line1.trim(),

            line2:
              propertyForm.line2.trim(),

            city:
              propertyForm.city.trim(),

            state:
              propertyForm.state.trim(),

            postalCode:
              propertyForm.postalCode.trim(),

            country:
              propertyForm.country.trim(),
          },

          amenities:
            propertyForm.amenities
              .split(",")
              .map(
                (item) =>
                  item.trim()
              )
              .filter(Boolean),

          status:
            propertyForm.status,
        }
      );

      await refreshProperty();

      setSuccess(
        "Property updated."
      );
    } catch (error) {
      console.error(error);

      setError(
        getErrorMessage(
          error,
          "Unable to update property"
        )
      );
    } finally {
      setActionLoading(false);
    }
  }


  async function handleDeactivateProperty() {
    const confirmed =
      window.confirm(
        "Deactivate this property? It will no longer be bookable."
      );

    if (!confirmed) {
      return;
    }

    try {
      setActionLoading(true);
      setError("");
      setSuccess("");

      await deactivateOwnerProperty(
        propertyId
      );

      await refreshProperty();

      setSuccess(
        "Property deactivated."
      );
    } catch (error) {
      setError(
        getErrorMessage(
          error,
          "Unable to deactivate property"
        )
      );
    } finally {
      setActionLoading(false);
    }
  }


  async function handleReactivateProperty() {
    try {
      setActionLoading(true);
      setError("");

      await updateOwnerProperty(
        propertyId,
        {
          isActive: true,
          status: "draft",
        }
      );

      await refreshProperty();

      setPropertyForm(
        (current) => ({
          ...current,
          status: "draft",
        })
      );
    } catch (error) {
      setError(
        getErrorMessage(
          error,
          "Unable to reactivate property"
        )
      );
    } finally {
      setActionLoading(false);
    }
  }


  async function handleCreateBuilding(
    event
  ) {
    event.preventDefault();

    if (
      !buildingForm.name.trim()
    ) {
      setError(
        "Building name is required."
      );

      return;
    }

    try {
      setActionLoading(true);
      setError("");

      await createOwnerBuilding(
        propertyId,
        {
          name:
            buildingForm.name.trim(),

          code:
            buildingForm.code.trim(),
        }
      );

      setBuildingForm({
        name: "",
        code: "",
      });

      await refreshBuildings();
    } catch (error) {
      setError(
        getErrorMessage(
          error,
          "Unable to create building"
        )
      );
    } finally {
      setActionLoading(false);
    }
  }


  async function toggleBuilding(
    building
  ) {
    const buildingId =
      building._id;

    const willExpand =
      !expandedBuildings[
        buildingId
      ];

    setExpandedBuildings(
      (current) => ({
        ...current,
        [buildingId]:
          willExpand,
      })
    );

    if (
      willExpand &&
      !Object.hasOwn(
        floorsByBuilding,
        buildingId
      )
    ) {
      try {
        await refreshFloors(
          buildingId
        );
      } catch (error) {
        setError(
          getErrorMessage(
            error,
            "Unable to load floors"
          )
        );
      }
    }
  }


  async function editBuilding(
    building
  ) {
    const name =
      window.prompt(
        "Building name:",
        building.name
      );

    if (name === null) {
      return;
    }

    const code =
      window.prompt(
        "Building code:",
        building.code || ""
      );

    if (code === null) {
      return;
    }

    try {
      await updateOwnerBuilding(
        building._id,
        {
          name:
            name.trim(),

          code:
            code.trim(),
        }
      );

      await refreshBuildings();
    } catch (error) {
      setError(
        getErrorMessage(
          error,
          "Unable to update building"
        )
      );
    }
  }


  async function setBuildingActive(
    building,
    isActive
  ) {
    try {
      if (!isActive) {
        await deactivateOwnerBuilding(
          building._id
        );
      } else {
        await updateOwnerBuilding(
          building._id,
          {
            isActive: true,
          }
        );
      }

      await refreshBuildings();
    } catch (error) {
      setError(
        getErrorMessage(
          error,
          "Unable to update building"
        )
      );
    }
  }


  function getFloorDraft(
    buildingId
  ) {
    return (
      floorDrafts[
        buildingId
      ] || {
        floorNumber: "",
        name: "",
      }
    );
  }


  function changeFloorDraft(
    buildingId,
    field,
    value
  ) {
    setFloorDrafts(
      (current) => ({
        ...current,

        [buildingId]: {
          ...(
            current[
              buildingId
            ] || {
              floorNumber: "",
              name: "",
            }
          ),

          [field]:
            value,
        },
      })
    );
  }


  async function createFloor(
    buildingId
  ) {
    const draft =
      getFloorDraft(
        buildingId
      );

    if (
      draft.floorNumber ===
      ""
    ) {
      setError(
        "Floor number is required."
      );

      return;
    }

    try {
      await createOwnerFloor(
        buildingId,
        {
          floorNumber:
            Number(
              draft.floorNumber
            ),

          name:
            draft.name.trim(),
        }
      );

      setFloorDrafts(
        (current) => ({
          ...current,

          [buildingId]: {
            floorNumber: "",
            name: "",
          },
        })
      );

      await refreshFloors(
        buildingId
      );
    } catch (error) {
      setError(
        getErrorMessage(
          error,
          "Unable to create floor"
        )
      );
    }
  }


  async function toggleFloor(
    floor
  ) {
    const floorId =
      floor._id;

    const willExpand =
      !expandedFloors[
        floorId
      ];

    setExpandedFloors(
      (current) => ({
        ...current,
        [floorId]:
          willExpand,
      })
    );

    if (
      willExpand &&
      !Object.hasOwn(
        roomsByFloor,
        floorId
      )
    ) {
      try {
        await refreshRooms(
          floorId
        );
      } catch (error) {
        setError(
          getErrorMessage(
            error,
            "Unable to load rooms"
          )
        );
      }
    }
  }


  async function editFloor(
    floor,
    buildingId
  ) {
    const floorNumber =
      window.prompt(
        "Floor number:",
        String(
          floor.floorNumber
        )
      );

    if (
      floorNumber === null
    ) {
      return;
    }

    const name =
      window.prompt(
        "Floor name:",
        floor.name || ""
      );

    if (name === null) {
      return;
    }

    try {
      await updateOwnerFloor(
        floor._id,
        {
          floorNumber:
            Number(
              floorNumber
            ),

          name:
            name.trim(),
        }
      );

      await refreshFloors(
        buildingId
      );
    } catch (error) {
      setError(
        getErrorMessage(
          error,
          "Unable to update floor"
        )
      );
    }
  }


  async function setFloorActive(
    floor,
    buildingId,
    isActive
  ) {
    try {
      if (!isActive) {
        await deactivateOwnerFloor(
          floor._id
        );
      } else {
        await updateOwnerFloor(
          floor._id,
          {
            isActive: true,
          }
        );
      }

      await refreshFloors(
        buildingId
      );
    } catch (error) {
      setError(
        getErrorMessage(
          error,
          "Unable to update floor"
        )
      );
    }
  }


  function getRoomDraft(
    floorId
  ) {
    return (
      roomDrafts[
        floorId
      ] ||
      emptyRoom()
    );
  }


  function changeRoomDraft(
    floorId,
    field,
    value
  ) {
    setRoomDrafts(
      (current) => ({
        ...current,

        [floorId]: {
          ...(
            current[
              floorId
            ] ||
            emptyRoom()
          ),

          [field]:
            value,
        },
      })
    );
  }


  async function createRoom(
    floorId
  ) {
    const draft =
      getRoomDraft(
        floorId
      );

    try {
      await createOwnerRoom(
        floorId,
        {
          roomNumber:
            draft.roomNumber.trim(),

          roomType:
            draft.roomType,

          capacity:
            Number(
              draft.capacity
            ),

          monthlyRent:
            Number(
              draft.monthlyRent
            ),

          securityDeposit:
            Number(
              draft.securityDeposit
            ),

          amenities:
            draft.amenities
              .split(",")
              .map(
                (item) =>
                  item.trim()
              )
              .filter(Boolean),
        }
      );

      setRoomDrafts(
        (current) => ({
          ...current,
          [floorId]:
            emptyRoom(),
        })
      );

      await refreshRooms(
        floorId
      );
    } catch (error) {
      setError(
        getErrorMessage(
          error,
          "Unable to create room"
        )
      );
    }
  }


  async function toggleRoom(
    room
  ) {
    const roomId =
      room._id;

    const willExpand =
      !expandedRooms[
        roomId
      ];

    setExpandedRooms(
      (current) => ({
        ...current,

        [roomId]:
          willExpand,
      })
    );

    if (
      willExpand &&
      !Object.hasOwn(
        bedsByRoom,
        roomId
      )
    ) {
      try {
        await refreshBeds(
          roomId
        );
      } catch (error) {
        setError(
          getErrorMessage(
            error,
            "Unable to load beds"
          )
        );
      }
    }
  }


  async function editRoom(
    room,
    floorId
  ) {
    const roomNumber =
      window.prompt(
        "Room number:",
        room.roomNumber
      );

    if (
      roomNumber === null
    ) {
      return;
    }


    const roomType =
      window.prompt(
        "Room type (single, double, triple, shared, dormitory):",
        room.roomType
      );

    if (
      roomType === null
    ) {
      return;
    }


    const capacity =
      window.prompt(
        "Capacity:",
        String(
          room.capacity
        )
      );

    if (
      capacity === null
    ) {
      return;
    }


    const monthlyRent =
      window.prompt(
        "Monthly rent:",
        String(
          room.monthlyRent
        )
      );

    if (
      monthlyRent === null
    ) {
      return;
    }


    const securityDeposit =
      window.prompt(
        "Security deposit:",
        String(
          room.securityDeposit
        )
      );

    if (
      securityDeposit ===
      null
    ) {
      return;
    }


    const amenities =
      window.prompt(
        "Amenities, separated by commas:",
        Array.isArray(
          room.amenities
        )
          ? room.amenities.join(
              ", "
            )
          : ""
      );

    if (
      amenities === null
    ) {
      return;
    }


    try {
      await updateOwnerRoom(
        room._id,
        {
          roomNumber:
            roomNumber.trim(),

          roomType:
            roomType.trim(),

          capacity:
            Number(
              capacity
            ),

          monthlyRent:
            Number(
              monthlyRent
            ),

          securityDeposit:
            Number(
              securityDeposit
            ),

          amenities:
            amenities
              .split(",")
              .map(
                (item) =>
                  item.trim()
              )
              .filter(Boolean),
        }
      );

      await refreshRooms(
        floorId
      );
    } catch (error) {
      setError(
        getErrorMessage(
          error,
          "Unable to update room"
        )
      );
    }
  }


  async function setRoomActive(
    room,
    floorId,
    isActive
  ) {
    try {
      if (!isActive) {
        await deactivateOwnerRoom(
          room._id
        );
      } else {
        await updateOwnerRoom(
          room._id,
          {
            isActive: true,
          }
        );
      }

      await refreshRooms(
        floorId
      );
    } catch (error) {
      setError(
        getErrorMessage(
          error,
          "Unable to update room"
        )
      );
    }
  }


  function getBedDraft(
    roomId
  ) {
    return (
      bedDrafts[
        roomId
      ] || ""
    );
  }


  function changeBedDraft(
    roomId,
    value
  ) {
    setBedDrafts(
      (current) => ({
        ...current,

        [roomId]:
          value,
      })
    );
  }


  async function createBed(
    roomId
  ) {
    const bedNumber =
      getBedDraft(
        roomId
      ).trim();

    if (!bedNumber) {
      setError(
        "Bed number is required."
      );

      return;
    }

    try {
      await createOwnerBed(
        roomId,
        {
          bedNumber,
        }
      );

      setBedDrafts(
        (current) => ({
          ...current,
          [roomId]: "",
        })
      );

      await refreshBeds(
        roomId
      );
    } catch (error) {
      setError(
        getErrorMessage(
          error,
          "Unable to create bed"
        )
      );
    }
  }


  async function renameBed(
    bed,
    roomId
  ) {
    const bedNumber =
      window.prompt(
        "Bed number:",
        bed.bedNumber
      );

    if (
      bedNumber === null
    ) {
      return;
    }

    try {
      await updateOwnerBed(
        bed._id,
        {
          bedNumber:
            bedNumber.trim(),
        }
      );

      await refreshBeds(
        roomId
      );
    } catch (error) {
      setError(
        getErrorMessage(
          error,
          "Unable to rename bed"
        )
      );
    }
  }


  async function changeBedStatus(
    bed,
    roomId,
    status
  ) {
    try {
      await updateOwnerBed(
        bed._id,
        {
          status,
        }
      );

      await refreshBeds(
        roomId
      );
    } catch (error) {
      setError(
        getErrorMessage(
          error,
          "Unable to update bed status"
        )
      );
    }
  }


  async function deactivateBed(
    bed,
    roomId
  ) {
    const confirmed =
      window.confirm(
        `Deactivate Bed ${bed.bedNumber}?`
      );

    if (!confirmed) {
      return;
    }

    try {
      await deactivateOwnerBed(
        bed._id
      );

      await refreshBeds(
        roomId
      );
    } catch (error) {
      setError(
        getErrorMessage(
          error,
          "Unable to deactivate bed"
        )
      );
    }
  }


  if (loading) {
    return (
      <main className="min-h-[calc(100vh-65px)] bg-slate-100 px-4 py-8 sm:px-6">

        <div className="mx-auto max-w-7xl">
          Loading property management...
        </div>

      </main>
    );
  }


  if (!property) {
    return (
      <main className="min-h-[calc(100vh-65px)] bg-slate-100 px-4 py-8 sm:px-6">

        <div className="mx-auto max-w-7xl">
          Property not found.
        </div>

      </main>
    );
  }


  return (
    <main className="min-h-[calc(100vh-65px)] bg-slate-100 px-4 py-8 sm:px-6">

      <div className="mx-auto max-w-7xl">

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

          <div>

            <Link
              to="/owner/properties"
              className="font-semibold text-blue-600"
            >
              ← My Properties
            </Link>

            <h1 className="mt-2 text-3xl font-bold text-slate-900">
              Manage {property.name}
            </h1>

          </div>


          <span
            className={
              property.isActive
                ? "w-fit rounded-full bg-green-100 px-3 py-1 text-sm font-semibold capitalize text-green-800"
                : "w-fit rounded-full bg-red-100 px-3 py-1 text-sm font-semibold text-red-800"
            }
          >
            {
              property.isActive
                ? property.status
                : "Inactive"
            }
          </span>

        </div>


        {
          error && (
            <div className="mt-6 rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">

              <div className="flex items-start justify-between gap-4">

                <span>
                  {error}
                </span>

                <button
                  onClick={() =>
                    setError("")
                  }
                  className="font-bold"
                >
                  ×
                </button>

              </div>

            </div>
          )
        }


        {
          success && (
            <div
              role="status"
              className="mt-6 rounded-lg border border-green-200 bg-green-50 p-4 text-green-800"
            >
              <div className="flex items-start justify-between gap-4">
                <span>
                  {success}
                </span>
                <button
                  type="button"
                  onClick={() =>
                    setSuccess("")
                  }
                  className="font-bold"
                  aria-label="Dismiss message"
                >
                  ×
                </button>
              </div>
            </div>
          )
        }


        <section className="mt-8 rounded-xl bg-white p-6 shadow-sm">

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

            <h2 className="text-2xl font-bold text-slate-900">
              Property Information
            </h2>


            {
              property.isActive ? (

                <button
                  type="button"
                  onClick={
                    handleDeactivateProperty
                  }
                  disabled={
                    actionLoading
                  }
                  className="rounded-lg bg-red-600 px-4 py-2 font-semibold text-white disabled:opacity-50"
                >
                  Deactivate Property
                </button>

              ) : (

                <button
                  type="button"
                  onClick={
                    handleReactivateProperty
                  }
                  disabled={
                    actionLoading
                  }
                  className="rounded-lg bg-green-600 px-4 py-2 font-semibold text-white disabled:opacity-50"
                >
                  Reactivate Property
                </button>

              )
            }

          </div>


          <form
            onSubmit={
              handleSaveProperty
            }
            className="mt-6 grid gap-4 md:grid-cols-2"
          >

            <label>
              <span className="mb-1 block text-sm font-semibold">
                Name
              </span>

              <input
                name="name"
                value={
                  propertyForm.name
                }
                onChange={
                  changePropertyField
                }
                className="w-full rounded-lg border border-slate-300 px-3 py-2"
              />
            </label>


            <label>
              <span className="mb-1 block text-sm font-semibold">
                Status
              </span>

              <select
                name="status"
                value={
                  propertyForm.status
                }
                onChange={
                  changePropertyField
                }
                className="w-full rounded-lg border border-slate-300 px-3 py-2"
                disabled={
                  !property.isActive
                }
              >
                <option value="draft">
                  Draft
                </option>

                <option value="published">
                  Published
                </option>
              </select>
            </label>


            <label className="md:col-span-2">
              <span className="mb-1 block text-sm font-semibold">
                Description
              </span>

              <textarea
                name="description"
                value={
                  propertyForm.description
                }
                onChange={
                  changePropertyField
                }
                rows="3"
                className="w-full rounded-lg border border-slate-300 px-3 py-2"
              />
            </label>


            <label>
              <span className="mb-1 block text-sm font-semibold">
                Address Line 1
              </span>

              <input
                name="line1"
                value={
                  propertyForm.line1
                }
                onChange={
                  changePropertyField
                }
                className="w-full rounded-lg border border-slate-300 px-3 py-2"
              />
            </label>


            <label>
              <span className="mb-1 block text-sm font-semibold">
                Address Line 2
              </span>

              <input
                name="line2"
                value={
                  propertyForm.line2
                }
                onChange={
                  changePropertyField
                }
                className="w-full rounded-lg border border-slate-300 px-3 py-2"
              />
            </label>


            <label>
              <span className="mb-1 block text-sm font-semibold">
                City
              </span>

              <input
                name="city"
                value={
                  propertyForm.city
                }
                onChange={
                  changePropertyField
                }
                className="w-full rounded-lg border border-slate-300 px-3 py-2"
              />
            </label>


            <label>
              <span className="mb-1 block text-sm font-semibold">
                State / Province
              </span>

              <input
                name="state"
                value={
                  propertyForm.state
                }
                onChange={
                  changePropertyField
                }
                className="w-full rounded-lg border border-slate-300 px-3 py-2"
              />
            </label>


            <label>
              <span className="mb-1 block text-sm font-semibold">
                Postal Code
              </span>

              <input
                name="postalCode"
                value={
                  propertyForm.postalCode
                }
                onChange={
                  changePropertyField
                }
                className="w-full rounded-lg border border-slate-300 px-3 py-2"
              />
            </label>


            <label>
              <span className="mb-1 block text-sm font-semibold">
                Country
              </span>

              <input
                name="country"
                value={
                  propertyForm.country
                }
                onChange={
                  changePropertyField
                }
                className="w-full rounded-lg border border-slate-300 px-3 py-2"
              />
            </label>


            <label className="md:col-span-2">
              <span className="mb-1 block text-sm font-semibold">
                Amenities
              </span>

              <input
                name="amenities"
                value={
                  propertyForm.amenities
                }
                onChange={
                  changePropertyField
                }
                className="w-full rounded-lg border border-slate-300 px-3 py-2"
              />
            </label>


            <div className="md:col-span-2">

              <button
                type="submit"
                disabled={
                  actionLoading ||
                  !property.isActive
                }
                className="rounded-lg bg-blue-600 px-5 py-2 font-semibold text-white disabled:opacity-50"
              >
                Save Property
              </button>

            </div>

          </form>

        </section>


        <section className="mt-8">

          <h2 className="text-2xl font-bold text-slate-900">
            Buildings
          </h2>


          <form
            onSubmit={
              handleCreateBuilding
            }
            className="mt-4 grid gap-3 rounded-xl bg-white p-5 shadow-sm sm:grid-cols-[1fr_1fr_auto]"
          >

            <input
              value={
                buildingForm.name
              }
              onChange={(
                event
              ) =>
                setBuildingForm(
                  (current) => ({
                    ...current,
                    name:
                      event.target.value,
                  })
                )
              }
              aria-label="Building name"
              placeholder="Building name"
              className="rounded-lg border border-slate-300 px-3 py-2"
            />


            <input
              value={
                buildingForm.code
              }
              onChange={(
                event
              ) =>
                setBuildingForm(
                  (current) => ({
                    ...current,
                    code:
                      event.target.value,
                  })
                )
              }
              aria-label="Building code"
              placeholder="Code, e.g. A"
              className="rounded-lg border border-slate-300 px-3 py-2"
            />


            <button
              type="submit"
              disabled={
                !property.isActive
              }
              className="rounded-lg bg-green-600 px-4 py-2 font-semibold text-white disabled:opacity-50"
            >
              Add Building
            </button>

          </form>


          <div className="mt-5 space-y-5">

            {
              buildings.map(
                (building) => {

                  const floors =
                    floorsByBuilding[
                      building._id
                    ] || [];

                  const floorDraft =
                    getFloorDraft(
                      building._id
                    );

                  return (

                    <article
                      key={
                        building._id
                      }
                      className="rounded-xl bg-white p-5 shadow-sm"
                    >

                      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                        <div>

                          <h3 className="text-xl font-bold">
                            {
                              building.name
                            }
                          </h3>

                          <p className="mt-1 text-sm text-slate-500">
                            Code:{" "}
                            {
                              building.code ||
                              "—"
                            }
                          </p>

                        </div>


                        <div className="flex flex-wrap gap-2">

                          <button
                            onClick={() =>
                              toggleBuilding(
                                building
                              )
                            }
                            className="rounded-lg bg-slate-900 px-3 py-2 text-sm font-semibold text-white"
                          >
                            {
                              expandedBuildings[
                                building._id
                              ]
                                ? "Hide Floors"
                                : "Manage Floors"
                            }
                          </button>


                          <button
                            onClick={() =>
                              editBuilding(
                                building
                              )
                            }
                            className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold"
                          >
                            Edit
                          </button>


                          <button
                            onClick={() =>
                              setBuildingActive(
                                building,
                                !building.isActive
                              )
                            }
                            className={
                              building.isActive
                                ? "rounded-lg bg-red-100 px-3 py-2 text-sm font-semibold text-red-700"
                                : "rounded-lg bg-green-100 px-3 py-2 text-sm font-semibold text-green-700"
                            }
                          >
                            {
                              building.isActive
                                ? "Deactivate"
                                : "Reactivate"
                            }
                          </button>

                        </div>

                      </div>


                      {
                        expandedBuildings[
                          building._id
                        ] && (

                          <div className="mt-5 border-t pt-5">

                            <h4 className="font-bold">
                              Floors
                            </h4>


                            <div className="mt-3 grid gap-3 sm:grid-cols-[1fr_2fr_auto]">

                              <input
                                type="number"
                                value={
                                  floorDraft.floorNumber
                                }
                                onChange={(
                                  event
                                ) =>
                                  changeFloorDraft(
                                    building._id,
                                    "floorNumber",
                                    event.target.value
                                  )
                                }
                                aria-label={`Floor number for ${building.name}`}
                                placeholder="Floor number"
                                className="rounded-lg border border-slate-300 px-3 py-2"
                              />


                              <input
                                value={
                                  floorDraft.name
                                }
                                onChange={(
                                  event
                                ) =>
                                  changeFloorDraft(
                                    building._id,
                                    "name",
                                    event.target.value
                                  )
                                }
                                aria-label={`Floor name for ${building.name}`}
                                placeholder="Floor name"
                                className="rounded-lg border border-slate-300 px-3 py-2"
                              />


                              <button
                                onClick={() =>
                                  createFloor(
                                    building._id
                                  )
                                }
                                disabled={
                                  !building.isActive
                                }
                                className="rounded-lg bg-green-600 px-4 py-2 font-semibold text-white disabled:opacity-50"
                              >
                                Add Floor
                              </button>

                            </div>


                            <div className="mt-5 space-y-4">

                              {
                                floors.map(
                                  (floor) => {

                                    const rooms =
                                      roomsByFloor[
                                        floor._id
                                      ] ||
                                      [];

                                    const roomDraft =
                                      getRoomDraft(
                                        floor._id
                                      );

                                    return (

                                      <div
                                        key={
                                          floor._id
                                        }
                                        className="rounded-lg border border-slate-200 p-4"
                                      >

                                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

                                          <div>

                                            <p className="font-bold">
                                              Floor{" "}
                                              {
                                                floor.floorNumber
                                              }
                                            </p>

                                            <p className="text-sm text-slate-500">
                                              {
                                                floor.name ||
                                                "No name"
                                              }
                                            </p>

                                          </div>


                                          <div className="flex flex-wrap gap-2">

                                            <button
                                              onClick={() =>
                                                toggleFloor(
                                                  floor
                                                )
                                              }
                                              className="rounded bg-slate-800 px-3 py-1.5 text-sm font-semibold text-white"
                                            >
                                              {
                                                expandedFloors[
                                                  floor._id
                                                ]
                                                  ? "Hide Rooms"
                                                  : "Manage Rooms"
                                              }
                                            </button>


                                            <button
                                              onClick={() =>
                                                editFloor(
                                                  floor,
                                                  building._id
                                                )
                                              }
                                              className="rounded border px-3 py-1.5 text-sm font-semibold"
                                            >
                                              Edit
                                            </button>


                                            <button
                                              onClick={() =>
                                                setFloorActive(
                                                  floor,
                                                  building._id,
                                                  !floor.isActive
                                                )
                                              }
                                              className="rounded bg-slate-100 px-3 py-1.5 text-sm font-semibold"
                                            >
                                              {
                                                floor.isActive
                                                  ? "Deactivate"
                                                  : "Reactivate"
                                              }
                                            </button>

                                          </div>

                                        </div>


                                        {
                                          expandedFloors[
                                            floor._id
                                          ] && (

                                            <div className="mt-4 border-t pt-4">

                                              <h5 className="font-bold">
                                                Rooms
                                              </h5>


                                              <div className="mt-3 grid gap-2 md:grid-cols-3">

                                                <input
                                                  value={
                                                    roomDraft.roomNumber
                                                  }
                                                  onChange={(
                                                    event
                                                  ) =>
                                                    changeRoomDraft(
                                                      floor._id,
                                                      "roomNumber",
                                                      event.target.value
                                                    )
                                                  }
                                                  aria-label={`Room number for floor ${floor.floorNumber}`}
                                                  placeholder="Room number"
                                                  className="rounded border px-3 py-2"
                                                />


                                                <select
                                                  value={
                                                    roomDraft.roomType
                                                  }
                                                  onChange={(
                                                    event
                                                  ) =>
                                                    changeRoomDraft(
                                                      floor._id,
                                                      "roomType",
                                                      event.target.value
                                                    )
                                                  }
                                                  className="rounded border px-3 py-2"
                                                >
                                                  <option value="single">
                                                    Single
                                                  </option>

                                                  <option value="double">
                                                    Double
                                                  </option>

                                                  <option value="triple">
                                                    Triple
                                                  </option>

                                                  <option value="shared">
                                                    Shared
                                                  </option>

                                                  <option value="dormitory">
                                                    Dormitory
                                                  </option>
                                                </select>


                                                <input
                                                  type="number"
                                                  min="1"
                                                  value={
                                                    roomDraft.capacity
                                                  }
                                                  onChange={(
                                                    event
                                                  ) =>
                                                    changeRoomDraft(
                                                      floor._id,
                                                      "capacity",
                                                      event.target.value
                                                    )
                                                  }
                                                  aria-label="Room capacity"
                                                  placeholder="Capacity"
                                                  className="rounded border px-3 py-2"
                                                />


                                                <input
                                                  type="number"
                                                  min="0"
                                                  value={
                                                    roomDraft.monthlyRent
                                                  }
                                                  onChange={(
                                                    event
                                                  ) =>
                                                    changeRoomDraft(
                                                      floor._id,
                                                      "monthlyRent",
                                                      event.target.value
                                                    )
                                                  }
                                                  aria-label="Monthly rent"
                                                  placeholder="Monthly rent"
                                                  className="rounded border px-3 py-2"
                                                />


                                                <input
                                                  type="number"
                                                  min="0"
                                                  value={
                                                    roomDraft.securityDeposit
                                                  }
                                                  onChange={(
                                                    event
                                                  ) =>
                                                    changeRoomDraft(
                                                      floor._id,
                                                      "securityDeposit",
                                                      event.target.value
                                                    )
                                                  }
                                                  aria-label="Security deposit"
                                                  placeholder="Security deposit"
                                                  className="rounded border px-3 py-2"
                                                />


                                                <input
                                                  value={
                                                    roomDraft.amenities
                                                  }
                                                  onChange={(
                                                    event
                                                  ) =>
                                                    changeRoomDraft(
                                                      floor._id,
                                                      "amenities",
                                                      event.target.value
                                                    )
                                                  }
                                                  aria-label="Room amenities"
                                                  placeholder="Amenities"
                                                  className="rounded border px-3 py-2"
                                                />

                                              </div>


                                              <button
                                                onClick={() =>
                                                  createRoom(
                                                    floor._id
                                                  )
                                                }
                                                disabled={
                                                  !floor.isActive
                                                }
                                                className="mt-3 rounded bg-green-600 px-4 py-2 font-semibold text-white disabled:opacity-50"
                                              >
                                                Add Room
                                              </button>


                                              <div className="mt-5 space-y-3">

                                                {
                                                  rooms.map(
                                                    (
                                                      room
                                                    ) => {

                                                      const beds =
                                                        bedsByRoom[
                                                          room._id
                                                        ] ||
                                                        [];

                                                      return (

                                                        <div
                                                          key={
                                                            room._id
                                                          }
                                                          className="rounded-lg border bg-slate-50 p-4"
                                                        >

                                                          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">

                                                            <div>

                                                              <p className="font-bold">
                                                                Room{" "}
                                                                {
                                                                  room.roomNumber
                                                                }
                                                              </p>

                                                              <p className="mt-1 text-sm capitalize text-slate-600">
                                                                {
                                                                  room.roomType
                                                                }
                                                                {" • "}
                                                                Capacity{" "}
                                                                {
                                                                  room.capacity
                                                                }
                                                              </p>

                                                              <p className="mt-1 text-sm text-slate-600">
                                                                $
                                                                {
                                                                  room.monthlyRent
                                                                }
                                                                /month
                                                                {" • "}
                                                                Deposit $
                                                                {
                                                                  room.securityDeposit
                                                                }
                                                              </p>

                                                            </div>


                                                            <div className="flex flex-wrap gap-2">

                                                              <button
                                                                onClick={() =>
                                                                  toggleRoom(
                                                                    room
                                                                  )
                                                                }
                                                                className="rounded bg-slate-800 px-3 py-1.5 text-sm font-semibold text-white"
                                                              >
                                                                {
                                                                  expandedRooms[
                                                                    room._id
                                                                  ]
                                                                    ? "Hide Beds"
                                                                    : "Manage Beds"
                                                                }
                                                              </button>


                                                              <button
                                                                onClick={() =>
                                                                  editRoom(
                                                                    room,
                                                                    floor._id
                                                                  )
                                                                }
                                                                className="rounded border px-3 py-1.5 text-sm font-semibold"
                                                              >
                                                                Edit
                                                              </button>


                                                              <button
                                                                onClick={() =>
                                                                  setRoomActive(
                                                                    room,
                                                                    floor._id,
                                                                    !room.isActive
                                                                  )
                                                                }
                                                                className="rounded bg-white px-3 py-1.5 text-sm font-semibold"
                                                              >
                                                                {
                                                                  room.isActive
                                                                    ? "Deactivate"
                                                                    : "Reactivate"
                                                                }
                                                              </button>

                                                            </div>

                                                          </div>


                                                          {
                                                            expandedRooms[
                                                              room._id
                                                            ] && (

                                                              <div className="mt-4 border-t pt-4">

                                                                <h6 className="font-bold">
                                                                  Beds
                                                                </h6>


                                                                <div className="mt-3 flex flex-col gap-2 sm:flex-row">

                                                                  <input
                                                                    value={
                                                                      getBedDraft(
                                                                        room._id
                                                                      )
                                                                    }
                                                                    onChange={(
                                                                      event
                                                                    ) =>
                                                                      changeBedDraft(
                                                                        room._id,
                                                                        event.target.value
                                                                      )
                                                                    }
                                                                    aria-label={`New bed number for room ${room.roomNumber}`}
                                                                    placeholder="Bed number"
                                                                    className="rounded border px-3 py-2"
                                                                  />


                                                                  <button
                                                                    onClick={() =>
                                                                      createBed(
                                                                        room._id
                                                                      )
                                                                    }
                                                                    disabled={
                                                                      !room.isActive
                                                                    }
                                                                    className="rounded bg-green-600 px-4 py-2 font-semibold text-white disabled:opacity-50"
                                                                  >
                                                                    Add Bed
                                                                  </button>

                                                                </div>


                                                                <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">

                                                                  {
                                                                    beds.map(
                                                                      (
                                                                        bed
                                                                      ) => {

                                                                        const bookingControlled =
                                                                          [
                                                                            "reserved",
                                                                            "occupied",
                                                                          ].includes(
                                                                            bed.status
                                                                          );

                                                                        return (

                                                                          <div
                                                                            key={
                                                                              bed._id
                                                                            }
                                                                            className="rounded-lg bg-white p-4 shadow-sm"
                                                                          >

                                                                            <div className="flex items-start justify-between gap-2">

                                                                              <div>

                                                                                <p className="font-bold">
                                                                                  Bed{" "}
                                                                                  {
                                                                                    bed.bedNumber
                                                                                  }
                                                                                </p>

                                                                                <p className="mt-1 text-sm capitalize text-slate-600">
                                                                                  {
                                                                                    bed.status
                                                                                  }
                                                                                </p>

                                                                                {
                                                                                  !bed.isActive && (
                                                                                    <p className="mt-1 text-xs font-semibold text-red-600">
                                                                                      Inactive
                                                                                    </p>
                                                                                  )
                                                                                }

                                                                              </div>

                                                                            </div>


                                                                            <div className="mt-3 flex flex-wrap gap-2">

                                                                              <button
                                                                                onClick={() =>
                                                                                  renameBed(
                                                                                    bed,
                                                                                    room._id
                                                                                  )
                                                                                }
                                                                                className="rounded border px-2 py-1 text-xs font-semibold"
                                                                              >
                                                                                Rename
                                                                              </button>


                                                                              {
                                                                                !bookingControlled &&
                                                                                bed.isActive && (

                                                                                  <button
                                                                                    onClick={() =>
                                                                                      changeBedStatus(
                                                                                        bed,
                                                                                        room._id,
                                                                                        bed.status ===
                                                                                        "available"
                                                                                          ? "unavailable"
                                                                                          : "available"
                                                                                      )
                                                                                    }
                                                                                    className="rounded bg-blue-100 px-2 py-1 text-xs font-semibold text-blue-800"
                                                                                  >
                                                                                    {
                                                                                      bed.status ===
                                                                                      "available"
                                                                                        ? "Make Unavailable"
                                                                                        : "Make Available"
                                                                                    }
                                                                                  </button>

                                                                                )
                                                                              }


                                                                              {
                                                                                bookingControlled && (
                                                                                  <span className="rounded bg-amber-100 px-2 py-1 text-xs font-semibold text-amber-800">
                                                                                    Booking controlled
                                                                                  </span>
                                                                                )
                                                                              }


                                                                              {
                                                                                bed.isActive &&
                                                                                !bookingControlled && (

                                                                                  <button
                                                                                    onClick={() =>
                                                                                      deactivateBed(
                                                                                        bed,
                                                                                        room._id
                                                                                      )
                                                                                    }
                                                                                    className="rounded bg-red-100 px-2 py-1 text-xs font-semibold text-red-700"
                                                                                  >
                                                                                    Deactivate
                                                                                  </button>

                                                                                )
                                                                              }

                                                                            </div>

                                                                          </div>

                                                                        );
                                                                      }
                                                                    )
                                                                  }

                                                                </div>

                                                              </div>

                                                            )
                                                          }

                                                        </div>

                                                      );
                                                    }
                                                  )
                                                }

                                              </div>

                                            </div>

                                          )
                                        }

                                      </div>

                                    );
                                  }
                                )
                              }

                            </div>

                          </div>

                        )
                      }

                    </article>

                  );
                }
              )
            }

          </div>

        </section>

      </div>

    </main>
  );
}
