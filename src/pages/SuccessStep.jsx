import { CheckCircle, Clock, Video, Mail } from 'lucide-react';
function SuccessStep({ bookedEvent, onNewSearch }) {
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full mb-6 shadow-lg animate-bounce">
            <CheckCircle className="w-10 h-10 text-white" />
          </div>

          <h2 className="text-3xl font-bold text-gray-900 mb-2">Meeting Booked Successfully!</h2>
          <p className="text-gray-600 mb-8">Your meeting has been scheduled and invitations sent.</p>

          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 mb-6 text-left">
            <h3 className="font-bold text-gray-900 mb-4 text-lg">{bookedEvent?.summary}</h3>
            
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-blue-600 mt-0.5" />
                <div>
                  <div className="font-medium text-gray-900">Time</div>
                  <div className="text-sm text-gray-600">
                    {new Date(bookedEvent?.start).toLocaleString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: 'numeric',
                      minute: '2-digit',
                      hour12: true
                    })}
                  </div>
                </div>
              </div>

              {bookedEvent?.meetLink && (
                <div className="flex items-start gap-3">
                  <Video className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div>
                    <div className="font-medium text-gray-900">Google Meet</div>
                    <a
                      href={bookedEvent.meetLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 hover:text-blue-700 underline"
                    >
                      Join Meeting
                    </a>
                  </div>
                </div>
              )}

              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-blue-600 mt-0.5" />
                <div>
                  <div className="font-medium text-gray-900">Attendees</div>
                  <div className="text-sm text-gray-600">
                    {bookedEvent?.attendees?.map(a => a.email).join(', ')}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-4">
            <a
              href={bookedEvent?.link}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-3 rounded-xl font-semibold hover:from-blue-600 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl"
            >
              View in Calendar
            </a>
            <button
              onClick={onNewSearch}
              className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-200 transition-all"
            >
              Book Another Meeting
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SuccessStep;