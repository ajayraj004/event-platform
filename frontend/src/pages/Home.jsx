import { useEffect, useState } from "react";
import api from "../services/api";

export default function Home() {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);

  useEffect(() => {
    api.get("/events").then(res => setEvents(res.data));
  }, []);

  const submitLead = async () => {
    if (!email || !consent) {
      alert("Email and consent are required");
      return;
    }

    await api.post("/leads", {
      email,
      consent,
      eventId: selectedEvent._id,
    });

    window.location.href = selectedEvent.sourceUrl;
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">
        Events in Sydney
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {events.map(event => (
          <div
            key={event._id}
            className="border rounded p-4 shadow-sm"
          >
            <h2 className="text-xl font-semibold">
              {event.title}
            </h2>

            <p className="text-sm text-gray-600">
              {new Date(event.datetime).toDateString()} · {event.venue}
            </p>

            <p className="mt-2 text-sm">
              {event.description}
            </p>

            <p className="mt-2 text-xs text-gray-500">
              Source: {event.source}
            </p>

            <button
              className="mt-3 bg-black text-white px-4 py-2"
              onClick={() => setSelectedEvent(event)}
            >
              GET TICKETS
            </button>
          </div>
        ))}
      </div>

      {/* EMAIL MODAL */}
      {selectedEvent && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-white p-6 w-96 rounded">
            <h3 className="text-lg font-bold mb-2">
              Get tickets for {selectedEvent.title}
            </h3>

            <input
              type="email"
              placeholder="Your email"
              className="border p-2 w-full mb-2"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />

            <label className="text-sm flex items-center gap-2 mb-4">
              <input
                type="checkbox"
                checked={consent}
                onChange={e => setConsent(e.target.checked)}
              />
              I agree to receive event updates
            </label>

            <div className="flex justify-end gap-2">
              <button
                className="px-3 py-1 border"
                onClick={() => setSelectedEvent(null)}
              >
                Cancel
              </button>

              <button
                className="px-3 py-1 bg-black text-white"
                onClick={submitLead}
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
