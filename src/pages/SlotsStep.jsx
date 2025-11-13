import { User, Clock } from 'lucide-react';
function SlotsStep({ availabilityData, onSlotSelect, onBack }) {
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4">
      <div className="max-w-5xl mx-auto py-8">
        <button
          onClick={onBack}
          className="mb-6 text-blue-600 hover:text-blue-700 font-medium flex items-center gap-2"
        >
          ← Back to Search
        </button>

        <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
              <User className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{availabilityData?.employee?.name}</h2>
              <p className="text-gray-600">{availabilityData?.message}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-green-50 rounded-xl p-4 border-2 border-green-200">
              <div className="text-3xl font-bold text-green-600">{availabilityData?.stats.freeSlots}</div>
              <div className="text-sm text-green-700">Available Slots</div>
            </div>
            <div className="bg-red-50 rounded-xl p-4 border-2 border-red-200">
              <div className="text-3xl font-bold text-red-600">{availabilityData?.stats.busySlots}</div>
              <div className="text-sm text-red-700">Busy Slots</div>
            </div>
            <div className="bg-blue-50 rounded-xl p-4 border-2 border-blue-200">
              <div className="text-3xl font-bold text-blue-600">{availabilityData?.stats.events}</div>
              <div className="text-sm text-blue-700">Total Events</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <Clock className="w-6 h-6 text-blue-600" />
            Available Time Slots
          </h3>

          <div className="space-y-6">
            {Object.entries(
              availabilityData?.freeSlots.reduce((acc, slot) => {
                if (!acc[slot.day]) acc[slot.day] = [];
                acc[slot.day].push(slot);
                return acc;
              }, {}) || {}
            ).map(([day, slots]) => (
              <div key={day}>
                <h4 className="font-semibold text-gray-700 mb-3">{day}, {slots[0].date}</h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                  {slots.map((slot, idx) => (
                    <button
                      key={idx}
                      onClick={() => onSlotSelect(slot)}
                      className="bg-gradient-to-br from-green-50 to-emerald-50 hover:from-green-100 hover:to-emerald-100 border-2 border-green-200 hover:border-green-400 rounded-xl p-3 text-center transition-all hover:shadow-md"
                    >
                      <div className="text-sm font-bold text-green-700">{slot.time}</div>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default SlotsStep;