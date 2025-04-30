import React from 'react';
import { Link } from 'react-router-dom';
import { CalendarClock, Layout } from 'lucide-react';
import { rooms } from '../data/rooms';

const RoomsPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center mb-12">
          <h1 className="text-3xl font-semibold text-gray-800 mb-4">私たちのお部屋</h1>
          <p className="text-lg text-gray-600">
          伝統的な日本の宿泊施設と現代的な快適さを兼ね備えた当ゲストハウスでは、お客様のニーズに合わせて柔軟な客室構成をご用意しております。
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {rooms.map((room) => (
            <div key={room.id} className="bg-white rounded-lg overflow-hidden shadow-md">
              <div className="relative h-64">
                <img 
                  src={room.imageUrl} 
                  alt={room.name} 
                  className="w-full h-full object-cover"
                />
              </div>
              
              <div className="p-6">
                <h2 className="text-2xl font-semibold text-gray-800 mb-2">{room.name}</h2>
                
                <div className="flex items-center text-sm text-gray-600 mb-4">
                  <Layout className="w-4 h-4 mr-1" />
                  <span>Up to {room.capacity} {room.capacity === 1 ? 'guest' : 'guests'}</span>
                </div>
                
                <p className="text-gray-600 mb-4">{room.description}</p>
                
                <div className="flex justify-between items-center">
                  <span className="text-xl font-semibold text-gray-900">
                    ¥{room.price.toLocaleString()} <span className="text-sm font-normal">/ night</span>
                  </span>
                  
                  <Link 
                    to="/booking" 
                    className="inline-flex items-center px-4 py-2 bg-emerald-500 text-white rounded-md hover:bg-emerald-600 transition-colors"
                  >
                    <CalendarClock className="w-4 h-4 mr-2" />
                    Book Now
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
          <div className="md:flex">
            <div className="md:w-1/2 p-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">部屋の構成</h2>
              <p className="text-gray-600 mb-4">
              当ゲストハウスは、移動可能な間仕切りを備えた1つの部屋を特徴としており、グループ人数に応じて3通りの配置が可能です。
              </p>
              
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start">
                  <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 font-medium text-sm mr-2">1</span>
                  <div>
                    <span className="font-medium">Full Room (Z+Y):</span> 3名様までのグループに最適です。広々として快適です
                  </div>
                </li>
                
                <li className="flex items-start">
                  <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 font-medium text-sm mr-2">2</span>
                  <div>
                    <span className="font-medium">Half Room Z:</span> お一人様でも快適にお過ごしいただける、伝統的な空間です。
                  </div>
                </li>
                
                <li className="flex items-start">
                  <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 font-medium text-sm mr-2">3</span>
                  <div>
                    <span className="font-medium">Half Room Y:</span> お一人様用のプライベートな空間。伝統的なスタイル。
                  </div>
                </li>
              </ul>
            </div>
            
            <div className="md:w-1/2 bg-gray-100 p-6">
              <h3 className="text-xl font-medium text-gray-800 mb-3">可用性ルール</h3>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-start">
                  <div className="h-5 w-5 bg-emerald-500 rounded-full mr-3 mt-0.5"></div>
                  <div>フルルーム（Z+Y）を予約すると、ハーフルームZとYは利用できなくなります。.</div>
                </li>
                
                <li className="flex items-start">
                  <div className="h-5 w-5 bg-emerald-500 rounded-full mr-3 mt-0.5"></div>
                  <div>ハーフルームZを予約すると、フルルームは利用できなくなります。</div>
                </li>
                
                <li className="flex items-start">
                  <div className="h-5 w-5 bg-emerald-500 rounded-full mr-3 mt-0.5"></div>
                  <div>ハーフルームYを予約すると、フルルームは利用できなくなります。</div>
                </li>
                
                <li className="flex items-start">
                  <div className="h-5 w-5 bg-emerald-500 rounded-full mr-3 mt-0.5"></div>
                  <div>
                  3名様の場合は、フルルームオプションのみが表示され、ご利用いただけます。.</div>
                </li>
              </ul>
              
              <div className="mt-6">
                <Link 
                  to="/booking" 
                  className="inline-flex items-center px-5 py-2.5 bg-emerald-500 text-white rounded-md hover:bg-emerald-600 transition-colors"
                >
                  空き状況を確認する
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoomsPage;