import React, { useState, useEffect } from 'react';
import { Room, DateRange } from '../types';
import { isRoomAvailable, addBooking } from '../data/bookings';
import GuestPicker from './GuestPicker';
import Calendar from './Calendar';
import RoomCard from './RoomCard';

interface BookingFormProps {
  onBookingComplete: (bookingId: string) => void;
}

const BookingForm: React.FC<BookingFormProps> = ({ onBookingComplete }) => {
  const [guestCount, setGuestCount] = useState<number>(1);
  const [selectedDates, setSelectedDates] = useState<DateRange>({
    startDate: null,
    endDate: null
  });
  const [availableRooms, setAvailableRooms] = useState<Room[]>([]);
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);
  const [guestName, setGuestName] = useState('');
  const [guestEmail, setGuestEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState<'dates' | 'room' | 'details'>('dates');
  
  // Fetch all rooms from your data
  const [allRooms, setAllRooms] = useState<Room[]>([]);
  
  useEffect(() => {
    // In a real app, this would be an API call
    import('../data/rooms').then(module => {
      setAllRooms(module.rooms);
    });
  }, []);

  // When guest count or dates change, update available rooms
  useEffect(() => {
    if (!selectedDates.startDate || !selectedDates.endDate) {
      return;
    }
    
    // Filter rooms based on guest count and availability
    const rooms = allRooms.filter(room => {
      // Filter by capacity
      if (room.capacity < guestCount) {
        return false;
      }
      
      // Special handling for the guesthouse room configurations
      if (guestCount === 3) {
        // Only full room is available for 3 guests
        return room.id === 'full';
      }
      
      // Check availability based on selected dates
      return isRoomAvailable(
        room.id, 
        selectedDates.startDate!.toISOString().split('T')[0], 
        selectedDates.endDate!.toISOString().split('T')[0]
      );
    });
    
    setAvailableRooms(rooms);
    
    // If the previously selected room is no longer available, reset selection
    if (selectedRoomId && !rooms.some(room => room.id === selectedRoomId)) {
      setSelectedRoomId(null);
    }
  }, [guestCount, selectedDates, allRooms, selectedRoomId]);

  const handleDateChange = (range: DateRange) => {
    setSelectedDates(range);
    
    // If both dates are selected, automatically move to the next step
    if (range.startDate && range.endDate) {
      setStep('room');
    }
  };

  const handleRoomSelect = (roomId: string) => {
    setSelectedRoomId(roomId);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedDates.startDate || !selectedDates.endDate || !selectedRoomId) {
      setError('Please select dates and a room before proceeding.');
      return;
    }
    
    if (!guestName.trim() || !guestEmail.trim()) {
      setError('Please fill in all guest details.');
      return;
    }
    
    setIsSubmitting(true);
    setError(null);
    
    try {
      // In a real app, this would be an API call to create a booking
      const booking = addBooking({
        roomId: selectedRoomId,
        guestName,
        guestEmail,
        guestCount,
        checkIn: selectedDates.startDate.toISOString().split('T')[0],
        checkOut: selectedDates.endDate.toISOString().split('T')[0]
      });
      
      // Simulate API delay
      setTimeout(() => {
        setIsSubmitting(false);
        onBookingComplete(booking.id);
      }, 1000);
    } catch (err) {
      setIsSubmitting(false);
      setError('Failed to create booking. Please try again.');
    }
  };

  const goToNextStep = () => {
    if (step === 'dates' && selectedDates.startDate && selectedDates.endDate) {
      setStep('room');
    } else if (step === 'room' && selectedRoomId) {
      setStep('details');
    }
  };

  const goToPreviousStep = () => {
    if (step === 'room') {
      setStep('dates');
    } else if (step === 'details') {
      setStep('room');
    }
  };

  // Calculate total nights and price
  const calculateTotalPrice = (): number => {
    if (!selectedDates.startDate || !selectedDates.endDate || !selectedRoomId) {
      return 0;
    }
    
    const room = allRooms.find(r => r.id === selectedRoomId);
    if (!room) return 0;
    
    const startDate = new Date(selectedDates.startDate);
    const endDate = new Date(selectedDates.endDate);
    const nights = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    
    return room.price * nights;
  };
  
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="px-6 py-4 bg-emerald-50 border-b border-emerald-100">
        <h2 className="text-xl font-medium text-gray-800">Make a Reservation</h2>
        
        {/* Step indicators */}
        <div className="mt-4 flex items-center">
          <StepIndicator 
            number={1} 
            title="Dates" 
            isActive={step === 'dates'} 
            isCompleted={step === 'room' || step === 'details'}
          />
          <div className="flex-1 h-0.5 bg-gray-200">
            <div 
              className={`h-full bg-emerald-500 transition-all duration-300 ${
                step === 'dates' ? 'w-0' : step === 'room' ? 'w-1/2' : 'w-full'
              }`}
            ></div>
          </div>
          <StepIndicator 
            number={2} 
            title="Room" 
            isActive={step === 'room'} 
            isCompleted={step === 'details'}
          />
          <div className="flex-1 h-0.5 bg-gray-200">
            <div 
              className={`h-full bg-emerald-500 transition-all duration-300 ${
                step === 'details' ? 'w-full' : 'w-0'
              }`}
            ></div>
          </div>
          <StepIndicator 
            number={3} 
            title="Details" 
            isActive={step === 'details'} 
            isCompleted={false}
          />
        </div>
      </div>
      
      <form onSubmit={handleSubmit} className="p-6">
        {/* Step 1: Dates and Guest Count */}
        {step === 'dates' && (
          <div className="space-y-6">
            <GuestPicker 
              guestCount={guestCount} 
              setGuestCount={setGuestCount} 
            />
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                日付を選択
              </label>
              <Calendar 
                selectedDates={selectedDates} 
                onDateChange={handleDateChange} 
              />
            </div>
            
            <div className="flex justify-end">
              <button
                type="button"
                onClick={goToNextStep}
                disabled={!selectedDates.startDate || !selectedDates.endDate}
                className={`
                  px-4 py-2 rounded-md font-medium transition-colors
                  ${(!selectedDates.startDate || !selectedDates.endDate) 
                    ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
                    : 'bg-emerald-500 text-white hover:bg-emerald-600'}
                `}
              >
                部屋の選択に進む
              </button>
            </div>
          </div>
        )}
        
        {/* Step 2: Room Selection */}
        {step === 'room' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-800 mb-2">Select a Room</h3>
              <p className="text-sm text-gray-600 mb-4">
                Based on your selection of {guestCount} {guestCount === 1 ? 'guest' : 'guests'} 
                for {
                  selectedDates.startDate && selectedDates.endDate 
                    ? Math.ceil((selectedDates.endDate.getTime() - selectedDates.startDate.getTime()) / (1000 * 60 * 60 * 24)) 
                    : 0
                } nights.
              </p>
              
              {availableRooms.length === 0 ? (
                <div className="p-4 border rounded-md bg-yellow-50 border-yellow-200 text-yellow-800">
                  選択された日付と宿泊人数では空室がありません。別の日付を試すか、宿泊人数を調整してください。
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {allRooms.map(room => {
                    const isAvailable = availableRooms.some(r => r.id === room.id);
                    
                    // Show only full room for 3 guests
                    if (guestCount === 3 && room.id !== 'full') {
                      return null;
                    }
                    
                    return (
                      <RoomCard
                        key={room.id}
                        room={room}
                        isAvailable={isAvailable}
                        onSelect={() => handleRoomSelect(room.id)}
                        selected={selectedRoomId === room.id}
                      />
                    );
                  })}
                </div>
              )}
            </div>
            
            <div className="flex justify-between">
              <button
                type="button"
                onClick={goToPreviousStep}
                className="px-4 py-2 rounded-md border border-gray-300 font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Back
              </button>
              
              <button
                type="button"
                onClick={goToNextStep}
                disabled={!selectedRoomId}
                className={`
                  px-4 py-2 rounded-md font-medium transition-colors
                  ${!selectedRoomId 
                    ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
                    : 'bg-emerald-500 text-white hover:bg-emerald-600'}
                `}
              >
                ゲスト詳細へ進む
              </button>
            </div>
          </div>
        )}
        
        {/* Step 3: Guest Details */}
        {step === 'details' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-800 mb-4">ゲスト詳細</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label 
                    htmlFor="guest-name" 
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Full Name
                  </label>
                  <input
                    id="guest-name"
                    type="text"
                    value={guestName}
                    onChange={(e) => setGuestName(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    required
                  />
                </div>
                
                <div>
                  <label 
                    htmlFor="guest-email" 
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Email Address
                  </label>
                  <input
                    id="guest-email"
                    type="email"
                    value={guestEmail}
                    onChange={(e) => setGuestEmail(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>
            </div>
            
            {/* Booking summary */}
            <div className="bg-gray-50 p-4 rounded-md">
              <h4 className="font-medium text-gray-800 mb-2">Booking Summary</h4>
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Check-in:</span>
                  <span className="font-medium">
                    {selectedDates.startDate?.toLocaleDateString()}
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Check-out:</span>
                  <span className="font-medium">
                    {selectedDates.endDate?.toLocaleDateString()}
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Guests:</span>
                  <span className="font-medium">
                    {guestCount} {guestCount === 1 ? 'guest' : 'guests'}
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Room:</span>
                  <span className="font-medium">
                    {allRooms.find(r => r.id === selectedRoomId)?.name}
                  </span>
                </div>
                
                <div className="pt-2 mt-2 border-t border-gray-200">
                  <div className="flex justify-between font-medium">
                    <span>Total Price:</span>
                    <span className="text-emerald-600">
                      ¥{calculateTotalPrice().toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
                {error}
              </div>
            )}
            
            <div className="flex justify-between">
              <button
                type="button"
                onClick={goToPreviousStep}
                className="px-4 py-2 rounded-md border border-gray-300 font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Back
              </button>
              
              <button
                type="submit"
                disabled={isSubmitting}
                className={`
                  px-4 py-2 rounded-md font-medium transition-colors
                  ${isSubmitting 
                    ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
                    : 'bg-emerald-500 text-white hover:bg-emerald-600'}
                `}
              >
                {isSubmitting ? 'Processing...' : 'Complete Booking'}
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};

// Step indicator component
interface StepIndicatorProps {
  number: number;
  title: string;
  isActive: boolean;
  isCompleted: boolean;
}

const StepIndicator: React.FC<StepIndicatorProps> = ({
  number,
  title,
  isActive,
  isCompleted
}) => {
  let bgColor = 'bg-gray-200 text-gray-700';
  
  if (isActive) {
    bgColor = 'bg-emerald-500 text-white';
  } else if (isCompleted) {
    bgColor = 'bg-emerald-600 text-white';
  }
  
  return (
    <div className="flex flex-col items-center relative">
      <div className={`w-8 h-8 rounded-full ${bgColor} flex items-center justify-center font-medium text-sm transition-all duration-300`}>
        {number}
      </div>
      <span className={`mt-1 text-xs ${isActive ? 'text-emerald-600 font-medium' : 'text-gray-600'}`}>
        {title}
      </span>
    </div>
  );
};

export default BookingForm;