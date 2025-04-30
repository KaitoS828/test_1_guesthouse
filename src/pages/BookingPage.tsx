import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BookingForm from '../components/BookingForm';
import BookingConfirmation from '../components/BookingConfirmation';
import { Booking } from '../types';
import { getAllBookings } from '../data/bookings';

const BookingPage: React.FC = () => {
  const [bookingComplete, setBookingComplete] = useState(false);
  const [booking, setBooking] = useState<Booking | null>(null);
  const navigate = useNavigate();
  
  const handleBookingComplete = (bookingId: string) => {
    // In a real app, you would fetch the booking from an API
    const newBooking = getAllBookings().find(b => b.id === bookingId) || null;
    setBooking(newBooking);
    setBookingComplete(true);
  };
  
  const handleDone = () => {
    navigate('/');
  };
  
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        {bookingComplete && booking ? (
          <BookingConfirmation 
            booking={booking}
            onDone={handleDone}
          />
        ) : (
          <>
            <div className="max-w-3xl mx-auto text-center mb-10">
              <h1 className="text-3xl font-semibold text-gray-800 mb-3">予約する</h1>
              <p className="text-lg text-gray-600">
              東京の中心部にある伝統的な日本のゲストハウスにご宿泊ください。
              </p>
            </div>
            
            <div className="max-w-3xl mx-auto">
              <BookingForm 
                onBookingComplete={handleBookingComplete}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default BookingPage;