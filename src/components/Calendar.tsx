import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { DateRange, CalendarDay } from '../types';
import { getBookingsForDateRange } from '../data/bookings';

interface CalendarProps {
  selectedDates: DateRange;
  onDateChange: (range: DateRange) => void;
  roomId?: string;
}

const Calendar: React.FC<CalendarProps> = ({ 
  selectedDates, 
  onDateChange,
  roomId
}) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [calendarDays, setCalendarDays] = useState<CalendarDay[]>([]);
  
  // Generate calendar days for the current month
  useEffect(() => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    
    // First day of month
    const firstDay = new Date(year, month, 1);
    // Last day of month
    const lastDay = new Date(year, month + 1, 0);
    
    // Get day of week of first day (0 = Sunday, 6 = Saturday)
    const firstDayOfWeek = firstDay.getDay();
    
    // Calculate days from previous month to display
    const daysFromPrevMonth = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1;
    
    // Get the relevant bookings for this time period
    const startDisplayDate = new Date(year, month, 1 - daysFromPrevMonth);
    const endDisplayDate = new Date(year, month + 1, 6);
    const bookings = getBookingsForDateRange(startDisplayDate, endDisplayDate);
    
    // Create calendar days array
    const days: CalendarDay[] = [];
    
    // Add days from previous month
    for (let i = 0; i < daysFromPrevMonth; i++) {
      const date = new Date(year, month, 1 - (daysFromPrevMonth - i));
      
      const isBooked = roomId ? bookings.some(booking => {
        if (roomId !== booking.roomId) {
          // Special case: if booking is for full room, Z and Y are also booked
          if (booking.roomId === 'full' && (roomId === 'z' || roomId === 'y')) {
            return true;
          }
          // Special case: if booking is for Z or Y, full room is also booked
          if ((booking.roomId === 'z' || booking.roomId === 'y') && roomId === 'full') {
            return true;
          }
          return false;
        }
        
        const bookingStart = new Date(booking.checkIn);
        const bookingEnd = new Date(booking.checkOut);
        
        return (
          date >= bookingStart && 
          date < bookingEnd
        );
      }) : false;
      
      days.push({
        date,
        isInRange: selectedDates.startDate && selectedDates.endDate ? 
          (date >= selectedDates.startDate && date <= selectedDates.endDate) : false,
        isBooked,
        isCheckIn: selectedDates.startDate ? 
          date.toDateString() === selectedDates.startDate.toDateString() : false,
        isCheckOut: selectedDates.endDate ? 
          date.toDateString() === selectedDates.endDate.toDateString() : false
      });
    }
    
    // Add days from current month
    for (let i = 1; i <= lastDay.getDate(); i++) {
      const date = new Date(year, month, i);
      
      const isBooked = roomId ? bookings.some(booking => {
        if (roomId !== booking.roomId) {
          // Special case: if booking is for full room, Z and Y are also booked
          if (booking.roomId === 'full' && (roomId === 'z' || roomId === 'y')) {
            return true;
          }
          // Special case: if booking is for Z or Y, full room is also booked
          if ((booking.roomId === 'z' || booking.roomId === 'y') && roomId === 'full') {
            return true;
          }
          return false;
        }
        
        const bookingStart = new Date(booking.checkIn);
        const bookingEnd = new Date(booking.checkOut);
        
        return (
          date >= bookingStart && 
          date < bookingEnd
        );
      }) : false;
      
      days.push({
        date,
        isInRange: selectedDates.startDate && selectedDates.endDate ? 
          (date >= selectedDates.startDate && date <= selectedDates.endDate) : false,
        isBooked,
        isCheckIn: selectedDates.startDate ? 
          date.toDateString() === selectedDates.startDate.toDateString() : false,
        isCheckOut: selectedDates.endDate ? 
          date.toDateString() === selectedDates.endDate.toDateString() : false
      });
    }
    
    // Add days from next month to complete the grid
    const daysToAdd = 42 - days.length; // 6 rows of 7 days
    for (let i = 1; i <= daysToAdd; i++) {
      const date = new Date(year, month + 1, i);
      
      const isBooked = roomId ? bookings.some(booking => {
        if (roomId !== booking.roomId) {
          // Special case: if booking is for full room, Z and Y are also booked
          if (booking.roomId === 'full' && (roomId === 'z' || roomId === 'y')) {
            return true;
          }
          // Special case: if booking is for Z or Y, full room is also booked
          if ((booking.roomId === 'z' || booking.roomId === 'y') && roomId === 'full') {
            return true;
          }
          return false;
        }
        
        const bookingStart = new Date(booking.checkIn);
        const bookingEnd = new Date(booking.checkOut);
        
        return (
          date >= bookingStart && 
          date < bookingEnd
        );
      }) : false;
      
      days.push({
        date,
        isInRange: selectedDates.startDate && selectedDates.endDate ? 
          (date >= selectedDates.startDate && date <= selectedDates.endDate) : false,
        isBooked,
        isCheckIn: selectedDates.startDate ? 
          date.toDateString() === selectedDates.startDate.toDateString() : false,
        isCheckOut: selectedDates.endDate ? 
          date.toDateString() === selectedDates.endDate.toDateString() : false
      });
    }
    
    setCalendarDays(days);
  }, [currentMonth, selectedDates, roomId]);
  
  const handleDateClick = (day: CalendarDay) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Prevent selecting dates in the past
    if (day.date < today) {
      return;
    }
    
    // Prevent selecting booked dates
    if (day.isBooked) {
      return;
    }
    
    if (!selectedDates.startDate || (selectedDates.startDate && selectedDates.endDate)) {
      // Start a new date range
      onDateChange({
        startDate: day.date,
        endDate: null
      });
    } else {
      // Complete the date range
      if (day.date < selectedDates.startDate) {
        // If clicked date is before start date, swap them
        onDateChange({
          startDate: day.date,
          endDate: selectedDates.startDate
        });
      } else {
        onDateChange({
          startDate: selectedDates.startDate,
          endDate: day.date
        });
      }
    }
  };

  const goToPreviousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  // Format the month and year
  const monthYearFormat = currentMonth.toLocaleString('en-US', {
    month: 'long',
    year: 'numeric'
  });
  
  // Group calendar days into weeks
  const weeks: CalendarDay[][] = [];
  for (let i = 0; i < calendarDays.length; i += 7) {
    weeks.push(calendarDays.slice(i, i + 7));
  }
  
  return (
    <div className="bg-white rounded-lg shadow p-4 transition-all duration-300 hover:shadow-md">
      <div className="flex justify-between items-center mb-4">
        <button 
          onClick={goToPreviousMonth}
          className="p-1 rounded-full hover:bg-gray-100 transition-colors"
          aria-label="Previous month"
        >
          <ChevronLeft size={20} />
        </button>
        
        <h2 className="text-lg font-medium text-gray-800">{monthYearFormat}</h2>
        
        <button 
          onClick={goToNextMonth}
          className="p-1 rounded-full hover:bg-gray-100 transition-colors"
          aria-label="Next month"
        >
          <ChevronRight size={20} />
        </button>
      </div>
      
      <div className="grid grid-cols-7 gap-1">
        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
          <div key={day} className="text-center text-sm font-medium text-gray-600 py-2">
            {day}
          </div>
        ))}
        
        {weeks.map((week, weekIdx) => (
          week.map((day, dayIdx) => {
            const isCurrentMonth = day.date.getMonth() === currentMonth.getMonth();
            const isToday = day.date.toDateString() === new Date().toDateString();
            const isPast = day.date < new Date(new Date().setHours(0, 0, 0, 0));
            
            let dayClasses = "relative h-10 flex items-center justify-center text-sm rounded-full";
            
            if (!isCurrentMonth) {
              dayClasses += " text-gray-400";
            } else if (isPast) {
              dayClasses += " text-gray-400 bg-gray-50 cursor-not-allowed";
            } else if (day.isBooked) {
              dayClasses += " text-gray-400 bg-red-50 cursor-not-allowed";
            } else if (day.isCheckIn) {
              dayClasses += " bg-emerald-500 text-white";
            } else if (day.isCheckOut) {
              dayClasses += " bg-emerald-500 text-white";
            } else if (day.isInRange) {
              dayClasses += " bg-emerald-100 text-emerald-800";
            } else {
              dayClasses += " hover:bg-gray-100 cursor-pointer";
            }
            
            if (isToday) {
              dayClasses += " font-bold";
            }
            
            return (
              <div 
                key={`${weekIdx}-${dayIdx}`}
                className={dayClasses}
                onClick={() => !isPast && !day.isBooked && handleDateClick(day)}
              >
                {day.date.getDate()}
                
                {isToday && (
                  <div className="absolute bottom-1 w-1 h-1 bg-emerald-500 rounded-full"></div>
                )}
                
                {day.isBooked && isCurrentMonth && !isPast && (
                  <div className="absolute top-1 right-1 w-1.5 h-1.5 bg-red-500 rounded-full"></div>
                )}
              </div>
            );
          })
        ))}
      </div>
      
      <div className="mt-4 flex flex-wrap gap-2">
        <div className="flex items-center">
          <div className="w-3 h-3 bg-emerald-500 rounded-full mr-1"></div>
          <span className="text-xs text-gray-600">選択済み</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 bg-red-50 rounded-full mr-1 border border-red-200"></div>
          <span className="text-xs text-gray-600">利用不可</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 bg-gray-50 rounded-full mr-1"></div>
          <span className="text-xs text-gray-600">過去</span>
        </div>
      </div>
      
      {selectedDates.startDate && (
        <div className="mt-4 p-2 bg-gray-50 rounded text-sm">
          {selectedDates.endDate ? (
            <p>
              <span className="font-medium">Selected: </span> 
              {selectedDates.startDate.toLocaleDateString()} - {selectedDates.endDate.toLocaleDateString()}
            </p>
          ) : (
            <p>
              <span className="font-medium">チェックイン: </span>
              {selectedDates.startDate.toLocaleDateString()}
              <span className="ml-2 text-gray-500">チェックアウト日を選択してください</span>
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default Calendar;