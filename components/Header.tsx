
import React from 'react';

interface HeaderProps {
  isAuthenticated: boolean;
  onLoginClick: () => void;
  onLogoutClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ isAuthenticated, onLoginClick, onLogoutClick }) => {
  return (
    <header className="bg-[#763C96] shadow-md">
      <div className="container mx-auto px-4 py-2 flex justify-between items-center">
        <div className="w-1/3"></div>
        <div className="w-1/3 flex justify-center">
            <img src="/cat_logo_v03-01.png" alt="לוגו החתולייה - בית להצלת חתולים" className="h-20 w-auto" />
        </div>
        <div className="w-1/3 flex justify-end">
            {isAuthenticated ? (
                <button
                    onClick={onLogoutClick}
                    className="bg-white text-[#763C96] font-bold py-2 px-4 rounded-lg shadow-md hover:bg-purple-100 transition-colors"
                >
                    התנתק
                </button>
            ) : (
                <button
                    onClick={onLoginClick}
                    className="bg-white text-[#763C96] font-bold py-2 px-4 rounded-lg shadow-md hover:bg-purple-100 transition-colors"
                >
                    כניסת מתנדבים
                </button>
            )}
        </div>
      </div>
    </header>
  );
};

export default Header;