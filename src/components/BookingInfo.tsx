import React from 'react';
import { CalendarDays, User, Home } from 'lucide-react';
import { Room, Booking } from '../types';

interface BookingInfoProps {
  booking: Booking;
  room: Room | undefined;
  onEdit?: () => void;
  onDelete?: () => void;
  isAdmin?: boolean;
}

const BookingInfo: React.FC<BookingInfoProps> = ({ 
  booking, 
  room, 
  onEdit, 
  onDelete,
  isAdmin = false
}) => {
  // Calculate number of nights
  const checkIn = new Date(booking.checkIn);
  const checkOut = new Date(booking.checkOut);
  const nights = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));
  
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-4 border-b border-gray-200 flex justify-between items-center">
        <h3 className="font-medium text-gray-800">Booking #{booking.id.slice(0, this.length > 8 ? 8 : this.length)}</h3>
        
        <div className="flex space-x-2">
          <span 
            className={`
              px-2 py-1 text-xs font-medium rounded-full
              ${booking.status === 'confirmed' 
                ? 'bg-green-100 text-green-800' 
                : booking.status === 'cancelled' 
                  ? 'bg-red-100 text-red-800' 
                  : 'bg-yellow-100 text-yellow-800'}
            `}
          >
            {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
          </span>
        </div>
      </div>
      
      <div className="p-4">
        <div className="space-y-4">
          {/* Room info */}
          <div className="flex items-start">
            <Home className="w-5 h-5 text-gray-500 mt-0.5 mr-3" />
            <div>
              <h4 className="font-medium text-gray-800">{room?.name || 'Unknown Room'}</h4>
              <p className="text-sm text-gray-600">
                {booking.guestCount} {booking.guestCount === 1 ? 'guest' : 'guests'} · 
                {nights} {nights === 1 ? 'night' : 'nights'}
              </p>
            </div>
          </div>
          
          {/* Dates */}
          <div className="flex items-start">
            <CalendarDays className="w-5 h-5 text-gray-500 mt-0.5 mr-3" />
            <div>
              <div className="text-sm">
                <span className="font-medium">Check-in:</span> {' '}
                <span className="text-gray-700">
                  {new Date(booking.checkIn).toLocaleDateString('en-US', { 
                    weekday: 'short',
                    month: 'short', 
                    day: 'numeric'
                  })}
                </span>
              </div>
              <div className="text-sm">
                <span className="font-medium">Check-out:</span> {' '}
                <span className="text-gray-700">
                  {new Date(booking.checkOut).toLocaleDateString('en-US', { 
                    weekday: 'short',
                    month: 'short', 
                    day: 'numeric'
                  })}
                </span>
              </div>
            </div>
          </div>
          
          {/* Guest info */}
          <div className="flex items-start">
            <User className="w-5 h-5 text-gray-500 mt-0.5 mr-3" />
            <div>
              <h4 className="font-medium text-gray-800">{booking.guestName}</h4>
              <p className="text-sm text-gray-600">{booking.guestEmail}</p>
            </div>
          </div>
          
          {/* Price */}
          <div className="pt-3 border-t border-gray-200">
            <div className="flex justify-between font-medium">
              <span>Total:</span>
              <span className="text-emerald-600">
                ¥{room ? (room.price * nights).toLocaleString() : '---'}
              </span>
            </div>
          </div>
        </div>
        
        {/* Admin controls */}
        {isAdmin && (
          <div className="mt-4 pt-4 border-t border-gray-200 flex justify-between">
            {onEdit && (
              <button
                onClick={onEdit}
                className="px-3 py-1.5 bg-blue-500 text-white text-sm rounded hover:bg-blue-600 transition-colors"
              >
                Edit
              </button>
            )}
            {onDelete && (
              <button
                onClick={onDelete}
                className="px-3 py-1.5 bg-red-500 text-white text-sm rounded hover:bg-red-600 transition-colors"
              >
                Delete
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingInfo;