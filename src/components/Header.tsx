import React, { type FC } from 'react';
import { Bell, User, ChevronDown, LogOut } from 'lucide-react';
import toplogo from '../assets/toplogo.png';
import { useAuth } from '../context/hooks';

const Header: FC = () => {
  const { user } = useAuth();
  console.log(user)
  return (
    <header className="bg-teal-700 text-white px-6 py-3 flex items-center justify-between">
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 rounded-full flex items-center justify-center">
          <img src={toplogo} alt="toplogo" />
        </div>
        <div>
          <h1 className="text-lg font-semibold">परियोजना</h1>
          <p className="text-sm opacity-90">व्यवस्थापन प्रणाली</p>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <div className="relative">
          <Bell className="w-5 h-5" />
          <span className="absolute -top-1 -right-1 bg-red-500 text-xs rounded-full w-4 h-4 flex items-center justify-center">
            11
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <User className="w-6 h-6" />
          <span className="text-sm">{user?.full_name}</span>
          <ChevronDown className="w-4 h-4" />
        </div>
      </div>
    </header>
  );
};

export default Header;