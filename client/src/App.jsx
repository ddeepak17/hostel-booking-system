import { useEffect, useState } from "react";
import api from "./api/axios";

function App() {
  const [apiStatus, setApiStatus] = useState("Checking API...");

  useEffect(() => {
    async function checkApi() {
      try {
        const response = await api.get("/health");
        setApiStatus(response.data.message);
      } catch {
        setApiStatus("Unable to connect to API");
      }
    }

    checkApi();
  }, []);

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-100">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-slate-900">
          PG / Hostel Room Booking System
        </h1>

        <p className="mt-3 text-slate-600">
          {apiStatus}
        </p>
      </div>
    </main>
  );
}

export default App;