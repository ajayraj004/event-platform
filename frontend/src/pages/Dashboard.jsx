import { useEffect, useState } from "react";
import api from "../services/api";

export default function Dashboard() {
  const [events, setEvents] = useState([]);
  const [selected, setSelected] = useState(null);
  const [search, setSearch] = useState("");

  const loadEvents = async () => {
    const res = await api.get("/events");
    setEvents(res.data);
  };

  useEffect(() => {
    loadEvents();
  }, []);

  const filtered = events.filter(e =>
    `${e.title} ${e.venue} ${e.description}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div className="flex h-screen">
      {/* LEFT: TABLE */}
      <div className="w-2/3 p-4">
        <input
          className="border p-2 w-full mb-3"
          placeholder="Search events..."
          onChange={e => setSearch(e.target.value)}
        />

        <table className="w-full border">
          <thead className="bg-gray-100">
            <tr>
              <th>Title</th>
              <th>City</th>
              <th>Date</th>
              <th>Status</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {filtered.map(e => (
              <tr
                key={e._id}
                onClick={() => setSelected(e)}
                className="cursor-pointer hover:bg-gray-50"
              >
                <td>{e.title}</td>
                <td>{e.city}</td>
                <td>{new Date(e.datetime).toDateString()}</td>
                <td>
                  <span className="px-2 py-1 bg-gray-200 rounded">
                    {e.status}
                  </span>
                </td>
                <td>
                  {e.status !== "imported" && (
                    <button
                      className="bg-black text-white px-2 py-1"
                      onClick={async ev => {
                        ev.stopPropagation();
                        await api.patch(`/events/${e._id}/import`);
                        loadEvents();
                      }}
                    >
                      Import
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* RIGHT: PREVIEW */}
      <div className="w-1/3 border-l p-4">
        {selected ? (
          <>
            <h2 className="text-xl font-bold">{selected.title}</h2>
            <p className="mt-2">{selected.description}</p>
            <p className="mt-1 text-sm">{selected.venue}</p>
            <p className="text-sm">{selected.address}</p>
          </>
        ) : (
          <p>Select an event to preview</p>
        )}
      </div>
    </div>
  );
}
