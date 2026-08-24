export function getBookingStatusClasses(
  status
) {
  switch (status) {
    case "pending":
      return "bg-amber-100 text-amber-800";

    case "approved":
      return "bg-green-100 text-green-800";

    case "rejected":
      return "bg-red-100 text-red-800";

    case "cancelled":
      return "bg-slate-200 text-slate-700";

    case "completed":
      return "bg-blue-100 text-blue-800";

    default:
      return "bg-slate-100 text-slate-700";
  }
}
