import { Booking } from '../types';

// Sample bookings data for demonstration
export const sampleBookings: Booking[] = [
  {
    id: '1',
    roomId: 'full',
    guestName: 'Tanaka Hiroshi',
    guestEmail: 'tanaka@example.com',
    guestCount: 3,
    checkIn: '2025-02-01',
    checkOut: '2025-02-03',
    status: 'confirmed',
    createdAt: '2024-12-15T12:00:00Z'
  },
  {
    id: '2',
    roomId: 'z',
    guestName: 'Smith John',
    guestEmail: 'smith@example.com',
    guestCount: 1,
    checkIn: '2025-02-05',
    checkOut: '2025-02-07',
    status: 'confirmed',
    createdAt: '2024-12-16T14:30:00Z'
  }
];

// In a real app, this would be fetched from an API
let bookings: Booking[] = [...sampleBookings];

export const getAllBookings = (): Booking[] => {
  return bookings;
};

export const addBooking = (booking: Omit<Booking, 'id' | 'createdAt' | 'status'>): Booking => {
  const newBooking: Booking = {
    ...booking,
    id: Date.now().toString(),
    status: 'pending',
    createdAt: new Date().toISOString()
  };
  
  bookings.push(newBooking);
  return newBooking;
};

export const updateBookingStatus = (id: string, status: Booking['status']): Booking | null => {
  const index = bookings.findIndex(booking => booking.id === id);
  if (index === -1) return null;
  
  bookings[index] = {
    ...bookings[index],
    status
  };
  
  return bookings[index];
};

export const deleteBooking = (id: string): boolean => {
  const initialLength = bookings.length;
  bookings = bookings.filter(booking => booking.id !== id);
  return bookings.length < initialLength;
};

export const isRoomAvailable = (
  roomId: string, 
  checkIn: string, 
  checkOut: string
): boolean => {
  // Convert string dates to Date objects for comparison
  const checkInDate = new Date(checkIn);
  const checkOutDate = new Date(checkOut);
  
  // Check if the room is already booked during the requested period
  return !bookings.some(booking => {
    if (booking.status === 'cancelled') return false;
    
    // If this is a booking for a different room, it doesn't affect availability
    if (booking.roomId !== roomId && 
       !(roomId === 'full' && (booking.roomId === 'z' || booking.roomId === 'y')) && 
       !(booking.roomId === 'full' && (roomId === 'z' || roomId === 'y'))) {
      return false;
    }
    
    const bookingCheckIn = new Date(booking.checkIn);
    const bookingCheckOut = new Date(booking.checkOut);
    
    // Check if there's an overlap in dates
    return (
      (checkInDate < bookingCheckOut && checkOutDate > bookingCheckIn) ||
      (checkInDate.getTime() === bookingCheckIn.getTime()) ||
      (checkOutDate.getTime() === bookingCheckOut.getTime())
    );
  });
};

export const getBookingsForDateRange = (
  startDate: Date,
  endDate: Date
): Booking[] => {
  return bookings.filter(booking => {
    const bookingCheckIn = new Date(booking.checkIn);
    const bookingCheckOut = new Date(booking.checkOut);
    
    return (
      (bookingCheckIn >= startDate && bookingCheckIn <= endDate) ||
      (bookingCheckOut >= startDate && bookingCheckOut <= endDate) ||
      (bookingCheckIn <= startDate && bookingCheckOut >= endDate)
    );
  });
};