import React from 'react';
import { Menu, X } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const location = useLocation();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-10 bg-white/90 backdrop-blur-sm shadow-sm">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="flex items-center space-x-2">
          <span className="text-2xl font-semibold text-gray-800">東京ゲストハウス(黒岩)</span>
          <span className="text-sm font-light text-gray-600">Tokyo Guesthouse(kuroiwa)</span>
        </Link>
        
        {/* Mobile menu button */}
        <button 
          className="md:hidden p-2 rounded-md hover:bg-gray-100 transition-colors"
          onClick={toggleMenu}
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
        
        {/* Desktop navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          <NavLink to="/" isActive={location.pathname === "/"} onClick={closeMenu}>
            ホーム
          </NavLink>
          <NavLink to="/rooms" isActive={location.pathname === "/rooms"} onClick={closeMenu}>
            お部屋
          </NavLink>
          <NavLink to="/booking" isActive={location.pathname === "/booking"} onClick={closeMenu}>
            ご予約
          </NavLink>
          <NavLink to="/admin" isActive={location.pathname.startsWith("/admin")} onClick={closeMenu}>
            管理画面
          </NavLink>
        </nav>
      </div>
      
      {/* Mobile navigation */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-white shadow-md animate-fadeDown">
          <nav className="flex flex-col py-4">
            <NavLink to="/" isActive={location.pathname === "/"} onClick={closeMenu} mobile>
              ホーム
            </NavLink>
            <NavLink to="/rooms" isActive={location.pathname === "/rooms"} onClick={closeMenu} mobile>
              お部屋
            </NavLink>
            <NavLink to="/booking" isActive={location.pathname === "/booking"} onClick={closeMenu} mobile>
              ご予約
            </NavLink>
            <NavLink to="/admin" isActive={location.pathname.startsWith("/admin")} onClick={closeMenu} mobile>
              管理画面
            </NavLink>
          </nav>
        </div>
      )}
    </header>
  );
};

interface NavLinkProps {
  to: string;
  isActive: boolean;
  onClick: () => void;
  mobile?: boolean;
  children: React.ReactNode;
}

const NavLink: React.FC<NavLinkProps> = ({ 
  to, 
  isActive, 
  onClick, 
  mobile = false, 
  children 
}) => {
  const baseClasses = "transition-colors duration-200";
  const mobileClasses = mobile 
    ? "py-3 px-6 hover:bg-gray-50" 
    : "hover:text-emerald-600";
  
  const activeClasses = isActive 
    ? "text-emerald-600 font-medium" 
    : "text-gray-700";
    
  return (
    <Link 
      to={to} 
      className={`${baseClasses} ${mobileClasses} ${activeClasses}`}
      onClick={onClick}
    >
      {children}
    </Link>
  );
};

export default Header;