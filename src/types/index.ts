export interface Room {
  id: string;
  name: string;
  capacity: number;
  description: string;
  price: number;
  imageUrl: string;
}

export interface Booking {
  id: string;
  roomId: string;
  guestName: string;
  guestEmail: string;
  guestCount: number;
  checkIn: string; // ISO date string
  checkOut: string; // ISO date string
  status: 'pending' | 'confirmed' | 'cancelled';
  createdAt: string; // ISO date string
}

export interface DateRange {
  startDate: Date | null;
  endDate: Date | null;
}

export interface CalendarDay {
  date: Date;
  isInRange: boolean;
  isBooked: boolean;
  isCheckIn: boolean;
  isCheckOut: boolean;
}