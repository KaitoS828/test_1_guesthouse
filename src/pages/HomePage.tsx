import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, CalendarClock, Home, MapPin, Star } from 'lucide-react';

const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative h-[70vh] bg-gradient-to-b from-black/50 to-black/70 overflow-hidden">
        <img 
          src="https://images.pexels.com/photos/130111/pexels-photo-130111.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" 
          alt="Tokyo Guesthouse" 
          className="absolute inset-0 w-full h-full object-cover mix-blend-overlay" 
        />
        
        <div className="relative container mx-auto px-4 h-full flex flex-col justify-center">
          <div className="max-w-2xl text-white">
            <h1 className="text-4xl md:text-5xl font-semibold mb-4 leading-tight">
            食べられる森の体験
            </h1>
            <p className="text-lg md:text-xl opacity-90 mb-8">
            居心地の良いこのゲストハウスでは、綺麗な部屋とモダンな設備を備え、静かな隠れ家のような空間をご提供しています。
            </p>
            <Link 
              to="/booking" 
              className="inline-flex items-center px-6 py-3 bg-emerald-500 text-white font-medium rounded-md hover:bg-emerald-600 transition-colors"
            >
              今すぐ予約する
              <ChevronRight size={20} className="ml-2" />
            </Link>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-semibold text-center text-gray-800 mb-12">
          当ゲストハウスを選ぶ理由
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<Home className="w-10 h-10 text-emerald-500" />}
              title="「本物の体験」"
              description="この食べられる森に泊まることで、本物の日本を体験できます。"
            />
            
            <FeatureCard 
              icon={<MapPin className="w-10 h-10 text-emerald-500" />}
              title="理想的なロケーション"
              description="主要鉄道駅、ショッピングエリア、文化的観光スポットに近い便利なロケーションです。"
            />
            
            <FeatureCard 
              icon={<Star className="w-10 h-10 text-emerald-500" />}
              title="パーソナライズされたサービス"
              description="親切なスタッフが、お客様の滞在が思い出深いものになるよう、個別のアドバイスをさせていただきます。"
            />
          </div>
        </div>
      </section>
      
      {/* Rooms Preview */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center mb-12">
            <h2 className="text-3xl font-semibold text-gray-800">
            私たちの部屋
            </h2>
            
            <Link 
              to="/rooms" 
              className="mt-4 md:mt-0 inline-flex items-center text-emerald-600 hover:text-emerald-700"
            >
              View All Rooms
              <ChevronRight size={18} className="ml-1" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <RoomPreviewCard
              imageUrl="https://images.pexels.com/photos/6186815/pexels-photo-6186815.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
              title="Full Room (Z+Y)"
              description="広々とした客室で、小グループや最大 3 名様までのご家族に最適です。"
              price={15000}
            />
            
            <RoomPreviewCard
              imageUrl="https://images.pexels.com/photos/6186811/pexels-photo-6186811.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
              title="Half Room Z"
              description="可動式間仕切りを用いて再現するハーフルーム。居心地の良い個室に快適な布団をご用意しております。お一人様の旅行に最適です。"
              price={8000}
            />
            
            <RoomPreviewCard
              imageUrl="https://images.pexels.com/photos/5490303/pexels-photo-5490303.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
              title="Half Room Y"
              description="可動式間仕切りを用いて再現するハーフルーム。居心地の良い個室に快適な布団をご用意しております。お一人様の旅行に最適です。"
              price={8000}
            />
          </div>
        </div>
      </section>
      
      {/* Call to Action */}
      <section className="py-16 bg-emerald-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-semibold mb-4">
          本物の東京を体験する準備はできていますか?
          </h2>
          <p className="text-lg opacity-90 mb-8 max-w-2xl mx-auto">
          今すぐご予約いただき、日本の美しさと文化を満喫してください。
          </p>
          <Link 
            to="/booking" 
            className="inline-flex items-center px-6 py-3 bg-white text-emerald-600 font-medium rounded-md hover:bg-gray-100 transition-colors"
          >
            <CalendarClock size={20} className="mr-2" />
            空き状況を確認する
          </Link>
        </div>
      </section>
    </div>
  );
};

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description }) => {
  return (
    <div className="bg-white p-6 rounded-lg text-center transition-all duration-300 hover:shadow-md">
      <div className="flex justify-center mb-4">
        {icon}
      </div>
      <h3 className="text-xl font-medium text-gray-800 mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
};

interface RoomPreviewCardProps {
  imageUrl: string;
  title: string;
  description: string;
  price: number;
}

const RoomPreviewCard: React.FC<RoomPreviewCardProps> = ({ imageUrl, title, description, price }) => {
  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-md transition-all duration-300 hover:shadow-lg">
      <div className="h-48 overflow-hidden">
        <img 
          src={imageUrl} 
          alt={title} 
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
        />
      </div>
      <div className="p-6">
        <h3 className="text-xl font-medium text-gray-800 mb-2">{title}</h3>
        <p className="text-gray-600 mb-4">{description}</p>
        <div className="flex justify-between items-center">
          <span className="text-lg font-semibold text-gray-900">
            ¥{price.toLocaleString()} <span className="text-sm font-normal">/ night</span>
          </span>
          <Link 
            to="/booking" 
            className="text-emerald-600 hover:text-emerald-700 font-medium"
          >
            Book Now
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HomePage;