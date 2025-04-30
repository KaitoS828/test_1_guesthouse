import React from 'react';
import { Room } from '../types';

interface RoomCardProps {
  room: Room;
  isAvailable: boolean;
  onSelect: () => void;
  selected: boolean;
}

const RoomCard: React.FC<RoomCardProps> = ({ 
  room, 
  isAvailable, 
  onSelect, 
  selected 
}) => {
  return (
    <div 
      className={`
        relative overflow-hidden rounded-lg shadow-md transition-all duration-300
        ${isAvailable ? 'bg-white hover:shadow-lg' : 'bg-gray-100 opacity-70'}
        ${selected ? 'ring-2 ring-emerald-500' : ''}
      `}
    >
      <div className="h-48 overflow-hidden">
        <img 
          src={room.imageUrl} 
          alt={room.name} 
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
        />
      </div>
      
      <div className="p-4">
        <h3 className="text-lg font-medium text-gray-900">{room.name}</h3>
        <p className="mt-1 text-sm text-gray-600">{room.description}</p>
        
        <div className="mt-3 flex justify-between items-center">
          <span className="text-lg font-semibold text-gray-900">
            ¥{room.price.toLocaleString()} <span className="text-sm font-normal">/ night</span>
          </span>
          
          <span className="text-sm">Up to {room.capacity} {room.capacity === 1 ? 'guest' : 'guests'}</span>
        </div>
        
        <button
          onClick={onSelect}
          disabled={!isAvailable}
          className={`
            mt-4 w-full py-2 rounded-md transition-colors duration-200 font-medium
            ${isAvailable 
              ? selected 
                ? 'bg-emerald-600 text-white hover:bg-emerald-700' 
                : 'bg-emerald-500 text-white hover:bg-emerald-600'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }
          `}
        >
          {selected 
            ? 'Selected' 
            : isAvailable 
              ? 'Select Room' 
              : 'Unavailable'
          }
        </button>
      </div>
      
      {/* Availability badge */}
      {!isAvailable && (
        <div className="absolute top-4 right-4 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full">
          Unavailable
        </div>
      )}
      
      {selected && (
        <div className="absolute top-4 right-4 bg-emerald-500 text-white text-xs font-bold px-3 py-1 rounded-full">
          Selected
        </div>
      )}
    </div>
  );
};

export default RoomCard;