import React from 'react';
import { Check } from 'lucide-react';
import { Booking } from '../types';
import { getRoomById } from '../data/rooms';

interface BookingConfirmationProps {
  booking: Booking;
  onDone: () => void;
}

const BookingConfirmation: React.FC<BookingConfirmationProps> = ({ booking, onDone }) => {
  const room = getRoomById(booking.roomId);
  
  // Calculate number of nights
  const checkIn = new Date(booking.checkIn);
  const checkOut = new Date(booking.checkOut);
  const nights = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));
  
  // Calculate total price
  const totalPrice = room ? room.price * nights : 0;
  
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden max-w-2xl mx-auto">
      <div className="px-6 py-8 bg-emerald-50 border-b border-emerald-100 text-center">
        <div className="mx-auto w-16 h-16 bg-emerald-500 rounded-full flex items-center justify-center mb-4">
          <Check size={32} className="text-white" />
        </div>
        
        <h2 className="text-2xl font-semibold text-gray-800">予約確定しました！</h2>
        <p className="mt-2 text-gray-600">
          
当ゲストハウスをご利用いただきありがとうございます。ご予約が完了しました。
        </p>
      </div>
      
      <div className="p-6">
        <div className="bg-gray-50 p-4 rounded-md mb-6">
          <h3 className="font-medium text-lg text-gray-800 mb-4">Booking Details</h3>
          
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Booking ID:</span>
              <span className="font-medium">{booking.id}</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-gray-600">お名前:</span>
              <span className="font-medium">{booking.guestName}</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-gray-600">Eメール:</span>
              <span className="font-medium">{booking.guestEmail}</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-gray-600">部屋タイプ:</span>
              <span className="font-medium">{room?.name}</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-gray-600">ゲスト:</span>
              <span className="font-medium">
                {booking.guestCount} {booking.guestCount === 1 ? 'guest' : 'guests'}
              </span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-gray-600">チェックイン:</span>
              <span className="font-medium">
                {new Date(booking.checkIn).toLocaleDateString('en-US', { 
                  weekday: 'short', 
                  year: 'numeric', 
                  month: 'short', 
                  day: 'numeric' 
                })}
              </span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-gray-600">チェックアウト:</span>
              <span className="font-medium">
                {new Date(booking.checkOut).toLocaleDateString('en-US', { 
                  weekday: 'short', 
                  year: 'numeric', 
                  month: 'short', 
                  day: 'numeric' 
                })}
              </span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-gray-600">間隔:</span>
              <span className="font-medium">{nights} {nights === 1 ? 'night' : 'nights'}</span>
            </div>
            
            <div className="pt-2 mt-2 border-t border-gray-200">
              <div className="flex justify-between font-medium">
                <span>Total:</span>
                <span className="text-emerald-600">¥{totalPrice.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-blue-50 border border-blue-200 rounded-md p-4 mb-6">
          <h4 className="font-medium text-blue-800 mb-2">重要な情報</h4>
          <ul className="list-disc pl-5 text-sm text-blue-700 space-y-1">
            <li>チェックイン時間は午後3時から午後8時までです.</li>
            <li>チェックイン時間外に到着する場合はご連絡ください。.</li>
            <li>確認メールがあなたのメールアドレスに送信されました。</li>
            <li>皆様のお越しをお待ちしております！</li>
          </ul>
        </div>
        
        <div className="flex justify-center">
          <button
            onClick={onDone}
            className="px-6 py-2.5 bg-emerald-500 text-white rounded-md font-medium hover:bg-emerald-600 transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookingConfirmation;