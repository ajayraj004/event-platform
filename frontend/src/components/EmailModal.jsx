import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import api from "../services/api";

export default function EmailModal({ event, onClose }) {
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [loading, setLoading] = useState(false);


  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  const submitHandler = async (e) => {
    e.preventDefault();

    if (!email || !consent) {
      alert("Email and consent are required");
      return;
    }

    setLoading(true);

    await api.post("/leads", {
      email,
      consent,
      eventId: event._id,
    });

    window.location.href = event.sourceUrl;
  };

  return createPortal(
    <div className="fixed inset-0 z-[9999] bg-black/60 flex items-center justify-center">
      <div className="bg-white w-[380px] rounded-xl shadow-xl p-6">
        <h2 className="text-lg font-semibold">Get Tickets</h2>
        <p className="text-sm text-gray-600 mb-4">
          {event.title}
        </p>

        <form onSubmit={submitHandler}>
          <input
            type="email"
            placeholder="Enter your email"
            className="border rounded w-full p-2 text-sm mb-3"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label className="flex items-center gap-2 text-sm mb-4">
            <input
              type="checkbox"
              checked={consent}
              onChange={(e) => setConsent(e.target.checked)}
            />
            I agree to receive event updates
          </label>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1 text-sm border rounded"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="bg-black text-white px-4 py-1 text-sm rounded hover:bg-gray-800"
            >
              {loading ? "Saving..." : "Continue"}
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
}
