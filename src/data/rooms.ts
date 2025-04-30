import { Room } from '../types';

export const rooms: Room[] = [
  {
    id: 'full',
    name: 'Full Room (Z+Y)',
    capacity: 3,
    description: '広々とした伝統的な客室には、布団と小さなリビングエリアが備わります。少人数のグループやご家族に最適です。',
    price: 15000, // JPY per night
    imageUrl: 'https://images.pexels.com/photos/6186815/pexels-photo-6186815.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
  },
  {
    id: 'z',
    name: 'Half Room Z',
    capacity: 1,
    description: '伝統的な半個室。快適な布団をご用意しております。お一人様の旅行に最適です。',
    price: 8000, // JPY per night
    imageUrl: 'https://images.pexels.com/photos/6186811/pexels-photo-6186811.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
  },
  {
    id: 'y',
    name: 'Half Room Y',
    capacity: 1,
    description: '居心地の良い伝統的な半個室。快適な布団をご用意しております。お一人様の旅行に最適です。',
    price: 8000, // JPY per night
    imageUrl: 'https://images.pexels.com/photos/5490303/pexels-photo-5490303.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
  }
];

export const getRoomById = (id: string): Room | undefined => {
  return rooms.find(room => room.id === id);
};

export const getAvailableRooms = (guestCount: number, bookings: Booking[]): Room[] => {
  // If there are 3 guests, only full room is available
  if (guestCount === 3) {
    return rooms.filter(room => room.id === 'full');
  }
  
  // For 1-2 guests, all rooms are technically available
  // But we need to check if the rooms are already booked
  return rooms.filter(room => room.capacity >= guestCount);
};