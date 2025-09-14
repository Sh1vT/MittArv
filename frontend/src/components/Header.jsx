import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  HomeIcon, 
  PlusIcon, 
  UserIcon, 
  ArrowRightOnRectangleIcon,
  BookmarkIcon,
  Bars3Icon,
  XMarkIcon,
  BellIcon,
  MagnifyingGlassIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';
import { useState } from 'react';

const Header = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setMobileMenuOpen(false);
  };

  const closeMobileMenu = () => setMobileMenuOpen(false);

  return (
    <header className="glass sticky top-0 z-50 border-b border-white/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group" onClick={closeMobileMenu}>
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-600 via-purple-600 to-primary-700 rounded-2xl flex items-center justify-center shadow-medium group-hover:shadow-hard transition-all duration-300 group-hover:scale-105">
                <span className="text-white font-bold text-xl">M</span>
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-soft">
                <SparklesIcon className="w-2.5 h-2.5 text-white" />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-bold gradient-text">
                MittArv
              </span>
              <span className="text-xs text-secondary-500 font-medium -mt-1">
                Share Stories
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link 
              to="/" 
              className="flex items-center space-x-2 text-secondary-600 hover:text-primary-600 transition-all duration-200 font-medium hover:scale-105 group"
            >
              <HomeIcon className="w-5 h-5 group-hover:animate-bounce-subtle" />
              <span>Home</span>
            </Link>
            
            {isAuthenticated && (
              <>
                <Link 
                  to="/create" 
                  className="flex items-center space-x-2 bg-gradient-to-r from-primary-600 to-purple-600 text-white px-4 py-2 rounded-xl hover:from-primary-700 hover:to-purple-700 transition-all duration-200 font-medium hover:scale-105 hover:shadow-medium group"
                >
                  <PlusIcon className="w-5 h-5 group-hover:rotate-90 transition-transform duration-200" />
                  <span>Write</span>
                </Link>
                <Link 
                  to="/bookmarks" 
                  className="flex items-center space-x-2 text-secondary-600 hover:text-primary-600 transition-all duration-200 font-medium hover:scale-105 group"
                >
                  <BookmarkIcon className="w-5 h-5 group-hover:animate-bounce-subtle" />
                  <span>Bookmarks</span>
                </Link>
              </>
            )}
          </nav>

          {/* Desktop User Menu */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                {/* Quick Search */}
                <button className="p-2 text-secondary-500 hover:text-primary-600 hover:bg-primary-50 rounded-xl transition-all duration-200 hover:scale-105">
                  <MagnifyingGlassIcon className="w-5 h-5" />
                </button>
                
                {/* Notifications */}
                <button className="relative p-2 text-secondary-500 hover:text-primary-600 hover:bg-primary-50 rounded-xl transition-all duration-200 hover:scale-105">
                  <BellIcon className="w-5 h-5" />
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
                </button>

                {/* User Profile */}
                <div className="flex items-center space-x-3 bg-white/50 backdrop-blur-sm border border-white/20 rounded-2xl px-4 py-2 hover:bg-white/70 transition-all duration-200">
                  {user?.profilePic ? (
                    <img 
                      src={user.profilePic} 
                      alt={user.name}
                      className="w-8 h-8 rounded-xl ring-2 ring-primary-200 hover:ring-primary-300 transition-all duration-200"
                    />
                  ) : (
                    <div className="w-8 h-8 bg-gradient-to-br from-primary-400 to-purple-500 rounded-xl flex items-center justify-center shadow-soft">
                      <UserIcon className="w-5 h-5 text-white" />
                    </div>
                  )}
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold text-secondary-800">
                      {user?.name}
                    </span>
                    <span className="text-xs text-secondary-500">
                      @{user?.name?.toLowerCase().replace(' ', '')}
                    </span>
                  </div>
                </div>

                <button
                  onClick={handleLogout}
                  className="btn btn-ghost btn-sm"
                >
                  <ArrowRightOnRectangleIcon className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link 
                  to="/login" 
                  className="btn btn-ghost"
                >
                  Login
                </Link>
                <Link 
                  to="/register" 
                  className="btn btn-primary"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-secondary-600 hover:text-primary-600 hover:bg-primary-50 rounded-xl transition-all duration-200"
            >
              {mobileMenuOpen ? (
                <XMarkIcon className="w-6 h-6" />
              ) : (
                <Bars3Icon className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-white/20 py-4 animate-slide-up">
            <nav className="flex flex-col space-y-4">
              <Link 
                to="/" 
                className="flex items-center space-x-3 text-secondary-600 hover:text-primary-600 transition-all duration-200 font-medium p-2 hover:bg-primary-50 rounded-xl"
                onClick={closeMobileMenu}
              >
                <HomeIcon className="w-5 h-5" />
                <span>Home</span>
              </Link>
              
              {isAuthenticated && (
                <>
                  <Link 
                    to="/create" 
                    className="flex items-center space-x-3 bg-gradient-to-r from-primary-600 to-purple-600 text-white p-3 rounded-xl font-medium"
                    onClick={closeMobileMenu}
                  >
                    <PlusIcon className="w-5 h-5" />
                    <span>Write Story</span>
                  </Link>
                  <Link 
                    to="/bookmarks" 
                    className="flex items-center space-x-3 text-secondary-600 hover:text-primary-600 transition-all duration-200 font-medium p-2 hover:bg-primary-50 rounded-xl"
                    onClick={closeMobileMenu}
                  >
                    <BookmarkIcon className="w-5 h-5" />
                    <span>Bookmarks</span>
                  </Link>
                </>
              )}
              
              <div className="border-t border-white/20 pt-4 mt-4">
                {isAuthenticated ? (
                  <div className="flex flex-col space-y-4">
                    <div className="flex items-center space-x-3 p-3 bg-white/50 rounded-xl">
                      {user?.profilePic ? (
                        <img 
                          src={user.profilePic} 
                          alt={user.name}
                          className="w-10 h-10 rounded-xl ring-2 ring-primary-200"
                        />
                      ) : (
                        <div className="w-10 h-10 bg-gradient-to-br from-primary-400 to-purple-500 rounded-xl flex items-center justify-center">
                          <UserIcon className="w-6 h-6 text-white" />
                        </div>
                      )}
                      <div className="flex flex-col">
                        <span className="text-sm font-semibold text-secondary-800">
                          {user?.name}
                        </span>
                        <span className="text-xs text-secondary-500">
                          @{user?.name?.toLowerCase().replace(' ', '')}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="btn btn-ghost w-full justify-start"
                    >
                      <ArrowRightOnRectangleIcon className="w-5 h-5" />
                      <span>Logout</span>
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col space-y-3">
                    <Link 
                      to="/login" 
                      className="btn btn-ghost w-full justify-center"
                      onClick={closeMobileMenu}
                    >
                      Login
                    </Link>
                    <Link 
                      to="/register" 
                      className="btn btn-primary w-full justify-center"
                      onClick={closeMobileMenu}
                    >
                      Sign Up
                    </Link>
                  </div>
                )}
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
