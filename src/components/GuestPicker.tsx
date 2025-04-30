import React from 'react';
import { Minus, Plus } from 'lucide-react';

interface GuestPickerProps {
  guestCount: number;
  setGuestCount: (count: number) => void;
  maxGuests?: number;
  minGuests?: number;
}

const GuestPicker: React.FC<GuestPickerProps> = ({ 
  guestCount, 
  setGuestCount, 
  maxGuests = 3, 
  minGuests = 1 
}) => {
  const decrementGuests = () => {
    if (guestCount > minGuests) {
      setGuestCount(guestCount - 1);
    }
  };

  const incrementGuests = () => {
    if (guestCount < maxGuests) {
      setGuestCount(guestCount + 1);
    }
  };

  return (
    <div className="py-4">
      <label htmlFor="guest-count" className="block text-sm font-medium text-gray-700 mb-2">
        Number of Guests
      </label>
      
      <div className="flex items-center">
        <button
          type="button"
          onClick={decrementGuests}
          disabled={guestCount <= minGuests}
          className={`
            p-2 rounded-l-md border border-gray-300
            ${guestCount <= minGuests ? 
              'bg-gray-100 text-gray-400 cursor-not-allowed' : 
              'bg-white text-gray-700 hover:bg-gray-50'}
          `}
          aria-label="Decrease guest count"
        >
          <Minus size={18} />
        </button>
        
        <div 
          id="guest-count"
          className="flex-1 text-center py-2 border-t border-b border-gray-300 min-w-16"
        >
          <span className="font-medium">{guestCount}</span>
          <span className="text-gray-500 text-sm ml-1">
            {guestCount === 1 ? 'guest' : 'guests'}
          </span>
        </div>
        
        <button
          type="button"
          onClick={incrementGuests}
          disabled={guestCount >= maxGuests}
          className={`
            p-2 rounded-r-md border border-gray-300
            ${guestCount >= maxGuests ? 
              'bg-gray-100 text-gray-400 cursor-not-allowed' : 
              'bg-white text-gray-700 hover:bg-gray-50'}
          `}
          aria-label="Increase guest count"
        >
          <Plus size={18} />
        </button>
      </div>
      
      <p className="mt-2 text-sm text-gray-500">
        Our guesthouse can accommodate up to {maxGuests} guests.
      </p>
    </div>
  );
};

export default GuestPicker;