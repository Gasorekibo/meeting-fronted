import { useEffect, useState } from 'react';
import SearchStep from './pages/SearchStep.jsx'
import SlotsStep from './pages/SlotsStep.jsx'
import BookingStep from './pages/BookingStep.jsx'
import SuccessStep from './pages/SuccessStep.jsx'

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL
console.log('API_BASE_URL:', API_BASE_URL);
export default function MeetingScheduler() {
  const [step, setStep] = useState('search');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [availabilityData, setAvailabilityData] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [allEmployees, setAllEmployees] = useState([]);
  const [bookingDetails, setBookingDetails] = useState({
    title: '',
    description: '',
    attendeeEmail: ''
  });
  const [bookedEvent, setBookedEvent] = useState(null);
  const handleGetAllEmployees = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/employees`);
      const data = await response.json();
      setAllEmployees(data);
    } catch (error) {
      console.error('Error fetching employees:', error);
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    handleGetAllEmployees();
  }, [])
  const handleSearchAvailability = async () => {
    if (!message.trim()) return;
    
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/request-meeting`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message })
      });
      
      const data = await response.json();
      setAvailabilityData(data);
      setStep('slots');
      console.log('message:', message);
      console.log('Availability Data:', data);
    } catch (error) {
      console.error('Error fetching availability:', error);
      alert('Failed to fetch availability. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSlotSelect = (slot) => {
    setSelectedSlot(slot);
    setStep('booking');
  };

  const handleBookMeeting = async () => {
    if (!bookingDetails.title || !bookingDetails.attendeeEmail) {
      alert('Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      const startTime = new Date(selectedSlot.start);
      const endTime = new Date(startTime.getTime() + 60 * 60 * 1000);

      const response = await fetch(`${API_BASE_URL}/book-meeting`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          employeeEmail: availabilityData?.employee?.email,
          meetingTitle: bookingDetails.title,
          startTime: startTime.toISOString(),
          endTime: endTime.toISOString(),
          description: bookingDetails.description,
          attendees: [bookingDetails.attendeeEmail]
        })
      });

      const data = await response.json();
      if (data.success) {
        setBookedEvent(data.event);
        setStep('success');
      } else {
        alert('Failed to book meeting: ' + (data.error || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error booking meeting:', error);
      alert('Failed to book meeting. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleNewSearch = () => {
    setStep('search');
    setMessage('');
    setAvailabilityData(null);
    setSelectedSlot(null);
    setBookingDetails({ title: '', description: '', attendeeEmail: '' });
    setBookedEvent(null);
  };

  return (
    <>
      {step === 'search' && (
        <SearchStep
          message={message}
          allEmployees={allEmployees}
          setMessage={setMessage}
          loading={loading}
          onSearch={handleSearchAvailability}
        />
      )}
      {step === 'slots' && (
        <SlotsStep
          availabilityData={availabilityData}
          onSlotSelect={handleSlotSelect}
          onBack={handleNewSearch}
        />
      )}
      {step === 'booking' && (
        <BookingStep
          selectedSlot={selectedSlot}
          bookingDetails={bookingDetails}
          setBookingDetails={setBookingDetails}
          loading={loading}
          onBook={handleBookMeeting}
          onBack={() => setStep('slots')}
        />
      )}
      {step === 'success' && (
        <SuccessStep
          bookedEvent={bookedEvent}
          onNewSearch={handleNewSearch}
        />
      )}
    </>
  );
}