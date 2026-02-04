export default function EventCard({ event, onGetTickets }) {
  return (
    <div className="bg-white rounded-xl border shadow-sm p-5 flex flex-col justify-between">
      <div className="space-y-2">
        <h2 className="text-lg font-semibold text-gray-900">
          {event.title}
        </h2>

        <p className="text-sm text-gray-600">
          {event.venue || "Sydney"}
        </p>

        <p className="text-sm text-gray-700">
          {event.description || "No description available"}
        </p>
      </div>

      <div className="flex items-center justify-between mt-4">
        <span className="text-xs px-2 py-1 rounded bg-gray-100 text-gray-700">
          {event.source}
        </span>

        <button
  type="button"              
  onClick={onGetTickets}
  className="bg-black text-white text-sm px-4 py-1.5 rounded hover:bg-gray-800 cursor-pointer"
>
  Get Tickets
</button>

      </div>
    </div>
  );
}
