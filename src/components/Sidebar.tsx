import React, { useEffect, useState } from 'react';
import {
  Home, FileText, Users as UsersIcon, List, FolderOpen,
  BarChart3, Settings, User, ChevronDown, ChevronRight,
  LogOut, Menu, X
} from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/hooks';

interface SidebarItemProps {
  icon: React.ReactNode;
  label: string;
  isActive?: boolean;
  hasSubmenu?: boolean;
  isExpanded?: boolean;
  children?: React.ReactNode;
  onClick?: () => void;
  isMobile?: boolean;
}

const SidebarItem: React.FC<SidebarItemProps> = ({
  icon, label, isActive = false, hasSubmenu = false,
  isExpanded = false, children, onClick, isMobile = false
}) => (
  <div>
    <div
      className={`flex items-center space-x-3 px-4 py-2 cursor-pointer hover:bg-gray-100 ${isActive ? 'bg-blue-50 border-r-2 border-blue-500 text-blue-600' : 'text-gray-700'
        } ${isMobile ? 'text-base' : 'text-sm'}`}
      onClick={onClick}
    >
      <span className="w-5 h-5 flex-shrink-0">{icon}</span>
      {!isMobile && (
        <>
          <span className="flex-1">{label}</span>
          {hasSubmenu && (
            <span className="w-4 h-4 flex-shrink-0">
              {isExpanded ? <ChevronDown /> : <ChevronRight />}
            </span>
          )}
        </>
      )}
    </div>
    {isExpanded && children && (
      <div className="ml-6 border-l border-gray-200">{children}</div>
    )}
  </div>
);

const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();
  const currentPath = location.pathname;
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const planningPages = [
    '/project-methods', '/ward-office-new', '/subject-committee',
    '/city-pride-project', '/budget-committee', '/municipal-office', '/city-assembly'
  ];

  const [isPlanningExpanded, setIsPlanningExpanded] = useState(false);

  useEffect(() => {
    setIsPlanningExpanded(planningPages.includes(currentPath));
  }, [currentPath]);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  return (
    <>
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 bg-teal-700 text-white rounded-md"
        >
          {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile overlay */}
      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed lg:static top-0 left-0 h-screen bg-white border-r border-gray-200 
        w-64 z-40 transform transition-transform duration-300 ease-in-out
        lg:translate-x-0 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Close button for mobile */}
        <div className="lg:hidden flex justify-end p-4">
          <button
            onClick={() => setIsMobileMenuOpen(false)}
            className="p-1 text-gray-500 hover:text-gray-700"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <nav className="py-8 px-2 space-y-4">
          <SidebarItem
            icon={<Home />}
            label="ड्यासबोर्ड"
            isActive={currentPath === '/'}
            onClick={() => navigate('/')}
          />
          <SidebarItem
            icon={<FileText />}
            label="परियोजनाहरू"
            isActive={currentPath === '/projects'}
            onClick={() => navigate('/projects')}
          />
          <SidebarItem
            icon={<UsersIcon />}
            label="प्रमाणिकरण"
            isActive={currentPath === '/authentication'}
            onClick={() => navigate('/authentication')}
          />
          <SidebarItem
            icon={<List />}
            label="मौजुदा सूची"
            isActive={currentPath === '/inventory'}
            onClick={() => navigate('/inventory')}
          />

          <SidebarItem
            icon={<FolderOpen />}
            label="योजना तर्जुमा"
            hasSubmenu
            isExpanded={isPlanningExpanded}
            onClick={() => setIsPlanningExpanded(prev => !prev)}
          >
            {planningPages.map(path => (
              <div
                key={path}
                className={`px-4 py-2 text-sm cursor-pointer border-r-2 ${currentPath === path
                  ? 'text-blue-600 bg-blue-50 border-blue-500'
                  : 'text-gray-600 hover:bg-gray-50 border-transparent'
                  }`}
                onClick={() => navigate(path)}
              >
                {{
                  '/project-methods': 'योजना प्रविष्टी',
                  '/ward-office-new': 'वडा कार्यालय',
                  '/subject-committee': 'विषयगत समिति',
                  '/city-pride-project': 'नगर गौरव आयोजना',
                  '/budget-committee': 'बजेट तथा कार्यक्रम तर्जुमा समिति',
                  '/municipal-office': 'नगरकार्यपालिकाको कार्यालय',
                  '/city-assembly': 'नगर सभा'
                }[path]}
              </div>
            ))}
          </SidebarItem>

          <SidebarItem
            icon={<BarChart3 />}
            label="रिपोर्टहरू"
            isActive={currentPath === '/reports'}
            onClick={() => navigate('/reports')}
          />
          <SidebarItem
            icon={<Settings />}
            label="सेटिंग्स"
            isActive={currentPath === '/settings'}
            onClick={() => navigate('/settings')}
          />
          <SidebarItem
            icon={<User />}
            label="प्रयोगकर्ता"
            isActive={currentPath === '/users'}
            onClick={() => navigate('/users')}
          />
          <SidebarItem
            icon={<LogOut />}
            label="लग आउट"
            onClick={() => {
              logout();
              navigate('/login');
            }}
          />
        </nav>
      </div>
    </>
  );
};

export default Sidebar;