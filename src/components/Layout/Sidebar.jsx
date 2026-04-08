import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  ShoppingBag, 
  Coffee, 
  MessageSquare, 
  Users,
  Settings, 
  LogOut, 
  Star
} from 'lucide-react';
import { useAuth } from '../Context/AuthContext';
import logo from '../../assets/logo2.png'

const Sidebar = () => {
  const location = useLocation();
  const { logout } = useAuth();
  
  const navItems = [
    { 
      path: '/', 
      name: 'Dashboard', 
      icon: <LayoutDashboard size={20} /> 
    },
    { 
      path: '/orders', 
      name: 'Orders', 
      icon: <ShoppingBag size={20} /> 
    },
    { 
      path: '/food', 
      name: 'Menu Items', 
      icon: <Coffee size={20} /> 
    },
    { 
      path: '/support', 
      name: 'Support', 
      icon: <MessageSquare size={20} /> 
    },
    { 
      path: '/feedback', 
      name: 'Feedback', 
      icon: <Star size={20} /> 
    }
  ];

  const handleLogout = () => {
    logout();
  };
  
  return (
    <div className="bg-white h-full border-r border-gray-200 flex flex-col transition-all duration-300">
      <div className="p-5 border-b border-gray-200">
        <div className="flex items-center space-x-2">
          <img src={logo} style={{ height: 50, width: 50 }}/>
          <h1 className="text-xl font-bold text-gray-800">MoodNest Admin</h1>
        </div>
      </div>
      
      <nav className="flex-1 pt-5 pb-4 overflow-y-auto">
        <div className="px-2 space-y-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`
                  group flex items-center px-3 py-3 text-sm font-medium rounded-md
                  transition-all duration-200
                  ${isActive 
                    ? 'bg-amber-50 text-amber-700' 
                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'}
                `}
              >
                <div className={`mr-3 ${isActive ? 'text-amber-700' : 'text-gray-500'}`}>
                  {item.icon}
                </div>
                {item.name}
              </Link>
            );
          })}
        </div>
      </nav>
      
      <div className="p-4 border-t border-gray-200">
        <button 
          onClick={handleLogout}
          className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-50 hover:text-gray-900 w-full"
        >
          <LogOut size={20} className="mr-3 text-gray-500" />
          Sign Out
        </button>
      </div>
    </div>
  );
};

export default Sidebar;