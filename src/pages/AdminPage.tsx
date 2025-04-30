import React, { useState, useEffect } from 'react';
import { User, FileText, X } from 'lucide-react';
import BookingInfo from '../components/BookingInfo';
import Calendar from '../components/Calendar';
import { Booking, DateRange } from '../types';
import { getAllBookings, updateBookingStatus, deleteBooking } from '../data/bookings';
import { getRoomById } from '../data/rooms';

const AdminPage: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [dateFilter, setDateFilter] = useState<DateRange>({
    startDate: null,
    endDate: null
  });
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [view, setView] = useState<'list' | 'calendar'>('list');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  
  // Fetch bookings on component mount
  useEffect(() => {
    // In a real app, this would be an API call
    const fetchedBookings = getAllBookings();
    setBookings(fetchedBookings);
  }, []);
  
  // Filter bookings based on selected filters
  const filteredBookings = bookings.filter(booking => {
    // Filter by status
    if (statusFilter !== 'all' && booking.status !== statusFilter) {
      return false;
    }
    
    // Filter by date range
    if (dateFilter.startDate && dateFilter.endDate) {
      const bookingStart = new Date(booking.checkIn);
      const bookingEnd = new Date(booking.checkOut);
      
      // Check if there's an overlap between the booking dates and the filter dates
      return (
        (bookingStart <= dateFilter.endDate && bookingEnd >= dateFilter.startDate)
      );
    }
    
    return true;
  });
  
  const handleStatusChange = (bookingId: string, status: Booking['status']) => {
    // Update booking status
    const updatedBooking = updateBookingStatus(bookingId, status);
    
    if (updatedBooking) {
      // Update the local state
      setBookings(prevBookings => 
        prevBookings.map(booking => 
          booking.id === bookingId ? updatedBooking : booking
        )
      );
      
      // If the selected booking was updated, update it too
      if (selectedBooking && selectedBooking.id === bookingId) {
        setSelectedBooking(updatedBooking);
      }
    }
  };
  
  const handleDeleteBooking = () => {
    if (!selectedBooking) return;
    
    // Delete the booking
    const success = deleteBooking(selectedBooking.id);
    
    if (success) {
      // Update the local state
      setBookings(prevBookings => 
        prevBookings.filter(booking => booking.id !== selectedBooking.id)
      );
      
      // Close the modal and clear selection
      setShowDeleteModal(false);
      setSelectedBooking(null);
    }
  };
  
  const handleDateFilterChange = (range: DateRange) => {
    setDateFilter(range);
  };
  
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <h1 className="text-3xl font-semibold text-gray-800 mb-4 md:mb-0">Admin Dashboard</h1>
          
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setView('list')}
              className={`
                px-4 py-2 rounded-md font-medium transition-colors flex items-center
                ${view === 'list' 
                  ? 'bg-emerald-500 text-white' 
                  : 'bg-white text-gray-700 hover:bg-gray-100'}
              `}
            >
              <FileText size={18} className="mr-2" />
              List View
            </button>
            
            <button
              onClick={() => setView('calendar')}
              className={`
                px-4 py-2 rounded-md font-medium transition-colors flex items-center
                ${view === 'calendar' 
                  ? 'bg-emerald-500 text-white' 
                  : 'bg-white text-gray-700 hover:bg-gray-100'}
              `}
            >
              <FileText size={18} className="mr-2" />
              Calendar View
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Filters */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-4 mb-6">
              <h3 className="text-lg font-medium text-gray-800 mb-4">Filters</h3>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Booking Status
                </label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                >
                  <option value="all">All Statuses</option>
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date Range
                </label>
                <Calendar 
                  selectedDates={dateFilter}
                  onDateChange={handleDateFilterChange}
                />
              </div>
            </div>
            
            {/* Booking Details */}
            {selectedBooking && (
              <div className="bg-white rounded-lg shadow-md p-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium text-gray-800">Booking Details</h3>
                  <button
                    onClick={() => setSelectedBooking(null)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <X size={18} />
                  </button>
                </div>
                
                <BookingInfo
                  booking={selectedBooking}
                  room={getRoomById(selectedBooking.roomId)}
                  isAdmin={true}
                  onDelete={() => setShowDeleteModal(true)}
                />
                
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Update Status
                  </label>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleStatusChange(selectedBooking.id, 'confirmed')}
                      disabled={selectedBooking.status === 'confirmed'}
                      className={`
                        px-3 py-1.5 rounded-md text-sm font-medium flex-1
                        ${selectedBooking.status === 'confirmed' 
                          ? 'bg-gray-100 text-gray-500 cursor-not-allowed' 
                          : 'bg-green-500 text-white hover:bg-green-600'}
                      `}
                    >
                      Confirm
                    </button>
                    
                    <button
                      onClick={() => handleStatusChange(selectedBooking.id, 'cancelled')}
                      disabled={selectedBooking.status === 'cancelled'}
                      className={`
                        px-3 py-1.5 rounded-md text-sm font-medium flex-1
                        ${selectedBooking.status === 'cancelled' 
                          ? 'bg-gray-100 text-gray-500 cursor-not-allowed' 
                          : 'bg-red-500 text-white hover:bg-red-600'}
                      `}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {/* Bookings List/Calendar */}
          <div className="md:col-span-2">
            {view === 'list' ? (
              <>
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                  <h3 className="p-4 border-b border-gray-200 font-medium text-gray-800">
                    Bookings ({filteredBookings.length})
                  </h3>
                  
                  {filteredBookings.length === 0 ? (
                    <div className="p-6 text-center text-gray-500">
                      No bookings found matching your filters.
                    </div>
                  ) : (
                    <div className="divide-y divide-gray-200">
                      {filteredBookings.map(booking => (
                        <div 
                          key={booking.id}
                          className={`
                            p-4 hover:bg-gray-50 cursor-pointer transition-colors
                            ${selectedBooking?.id === booking.id ? 'bg-gray-50' : ''}
                          `}
                          onClick={() => setSelectedBooking(booking)}
                        >
                          <div className="flex justify-between">
                            <div className="flex items-center">
                              <User className="w-5 h-5 text-gray-500 mr-3" />
                              <div>
                                <h4 className="font-medium text-gray-800">{booking.guestName}</h4>
                                <p className="text-sm text-gray-600">{booking.guestEmail}</p>
                              </div>
                            </div>
                            
                            <div className="text-right">
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
                              <p className="text-sm text-gray-600 mt-1">
                                {new Date(booking.checkIn).toLocaleDateString()} - {new Date(booking.checkOut).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="bg-white rounded-lg shadow-md p-4">
                <h3 className="font-medium text-gray-800 mb-4">Calendar View (Coming Soon)</h3>
                <p className="text-gray-600">
                  Calendar view functionality will be implemented in the next update. 
                  Please use the list view for now.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-xl font-medium text-gray-800 mb-4">Delete Booking</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this booking? This action cannot be undone.
            </p>
            
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-md font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              
              <button
                onClick={handleDeleteBooking}
                className="px-4 py-2 bg-red-500 text-white rounded-md font-medium hover:bg-red-600 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPage;