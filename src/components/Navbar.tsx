import { useState, useEffect } from 'react';
import { Menu, X, Shield, Search, UserCheck, ChevronDown, Sparkles, PhoneCall } from 'lucide-react';
import { UserRole } from '../types';

interface NavbarProps {
  activeView: string;
  setActiveView: (view: string) => void;
  currentRole: UserRole;
  setCurrentRole: (role: UserRole) => void;
  setSelectedInstitutionSlug: (slug: string | null) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export default function Navbar({
  activeView,
  setActiveView,
  currentRole,
  setCurrentRole,
  setSelectedInstitutionSlug,
  searchQuery,
  setSearchQuery
}: NavbarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);
  const [showSearchInput, setShowSearchInput] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (view: string) => {
    setActiveView(view);
    setSelectedInstitutionSlug(null);
    setIsMobileMenuOpen(false);
  };

  const selectRole = (role: UserRole) => {
    setCurrentRole(role);
    setIsRoleDropdownOpen(false);
    if (role === 'super_admin' || role === 'institution_admin') {
      setActiveView('admin');
    } else {
      setActiveView('home');
    }
  };

  return (
    <nav
      id="main-navbar"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/80 dark:bg-black/80 backdrop-blur-md border-b border-neutral-100 dark:border-neutral-900 shadow-sm'
          : 'bg-transparent border-b border-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div
            id="navbar-logo"
            className="flex items-center gap-2 cursor-pointer group"
            onClick={() => handleNavClick('home')}
          >
            <div className="w-10 h-10 bg-black dark:bg-white text-white dark:text-black rounded-lg flex items-center justify-center font-bold text-lg tracking-wider transition-transform duration-300 group-hover:scale-105 shadow-md">
              ZW
            </div>
            <div className="hidden sm:block">
              <span className="font-sans font-bold text-lg tracking-wider text-neutral-900 dark:text-white block leading-none">
                ZESTWEAR
              </span>
              <span className="text-[10px] font-mono tracking-[0.3em] text-neutral-400 block mt-0.5 uppercase">
                UNIFORMS
              </span>
            </div>
          </div>

          {/* Center Links */}
          <div id="navbar-links" className="hidden md:flex items-center gap-8">
            <button
              onClick={() => handleNavClick('home')}
              className={`text-sm font-medium tracking-tight transition-colors hover:text-black dark:hover:text-white ${
                activeView === 'home' ? 'text-black dark:text-white font-semibold' : 'text-neutral-500'
              }`}
            >
              Home
            </button>
            <button
              onClick={() => handleNavClick('institutions')}
              className={`text-sm font-medium tracking-tight transition-colors hover:text-black dark:hover:text-white ${
                activeView === 'institutions' ? 'text-black dark:text-white font-semibold' : 'text-neutral-500'
              }`}
            >
              Institutions
            </button>
            <button
              onClick={() => handleNavClick('uniforms')}
              className={`text-sm font-medium tracking-tight transition-colors hover:text-black dark:hover:text-white ${
                activeView === 'uniforms' ? 'text-black dark:text-white font-semibold' : 'text-neutral-500'
              }`}
            >
              Uniforms
            </button>
            <button
              onClick={() => handleNavClick('how-it-works')}
              className={`text-sm font-medium tracking-tight transition-colors hover:text-black dark:hover:text-white ${
                activeView === 'how-it-works' ? 'text-black dark:text-white font-semibold' : 'text-neutral-500'
              }`}
            >
              How It Works
            </button>
            <button
              onClick={() => handleNavClick('about')}
              className={`text-sm font-medium tracking-tight transition-colors hover:text-black dark:hover:text-white ${
                activeView === 'about' ? 'text-black dark:text-white font-semibold' : 'text-neutral-500'
              }`}
            >
              About Us
            </button>
            <button
              onClick={() => handleNavClick('contact')}
              className={`text-sm font-medium tracking-tight transition-colors hover:text-black dark:hover:text-white ${
                activeView === 'contact' ? 'text-black dark:text-white font-semibold' : 'text-neutral-500'
              }`}
            >
              Contact
            </button>
          </div>

          {/* Right Actions */}
          <div id="navbar-actions" className="flex items-center gap-3">
            {/* Search Trigger */}
            <div className="relative flex items-center">
              {showSearchInput && (
                <input
                  type="text"
                  placeholder="Search uniforms, colleges..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="mr-2 px-3 py-1.5 w-40 sm:w-56 text-sm bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-lg focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-white text-neutral-800 dark:text-neutral-100"
                  autoFocus
                />
              )}
              <button
                onClick={() => {
                  setShowSearchInput(!showSearchInput);
                  if (showSearchInput) setSearchQuery('');
                }}
                className="p-2 text-neutral-500 hover:text-black dark:hover:text-white rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors"
                title="Search"
              >
                <Search className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Role Simulation Switcher / Login simulation */}
            <div className="relative">
              <button
                onClick={() => setIsRoleDropdownOpen(!isRoleDropdownOpen)}
                className="flex items-center gap-1.5 px-3 py-2 text-xs font-mono font-medium border border-neutral-200 dark:border-neutral-800 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-900 text-neutral-700 dark:text-neutral-300 transition-all shadow-xs"
              >
                <UserCheck className="w-3.5 h-3.5" />
                <span className="hidden lg:inline capitalize">
                  {currentRole.replace('_', ' ')}
                </span>
                <ChevronDown className="w-3 h-3" />
              </button>

              {isRoleDropdownOpen && (
                <div className="absolute right-0 mt-2 w-52 bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-lg z-50 p-1">
                  <div className="px-3 py-2 text-[10px] font-mono text-neutral-400 capitalize border-b border-neutral-100 dark:border-neutral-900">
                    SaaS Portal Mock Auth
                  </div>
                  <button
                    onClick={() => selectRole('guest')}
                    className={`w-full text-left px-3 py-2 text-xs rounded-lg flex items-center justify-between transition-colors ${
                      currentRole === 'guest'
                        ? 'bg-neutral-50 dark:bg-neutral-900 font-semibold text-black dark:text-white'
                        : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-900'
                    }`}
                  >
                    <span>Guest Student View</span>
                    {currentRole === 'guest' && <span className="w-1.5 h-1.5 bg-green-500 rounded-full" />}
                  </button>
                  <button
                    onClick={() => selectRole('institution_admin')}
                    className={`w-full text-left px-3 py-2 text-xs rounded-lg flex items-center justify-between transition-colors ${
                      currentRole === 'institution_admin'
                        ? 'bg-neutral-50 dark:bg-neutral-900 font-semibold text-black dark:text-white'
                        : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-900'
                    }`}
                  >
                    <span className="flex items-center gap-1.5">
                      <Shield className="w-3 h-3 text-amber-500" />
                      Inst. Admin (Jorhat)
                    </span>
                    {currentRole === 'institution_admin' && <span className="w-1.5 h-1.5 bg-green-500 rounded-full" />}
                  </button>
                  <button
                    onClick={() => selectRole('super_admin')}
                    className={`w-full text-left px-3 py-2 text-xs rounded-lg flex items-center justify-between transition-colors ${
                      currentRole === 'super_admin'
                        ? 'bg-neutral-50 dark:bg-neutral-900 font-semibold text-black dark:text-white'
                        : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-900'
                    }`}
                  >
                    <span className="flex items-center gap-1.5">
                      <Shield className="w-3 h-3 text-red-500" />
                      Super Admin (Full)
                    </span>
                    {currentRole === 'super_admin' && <span className="w-1.5 h-1.5 bg-green-500 rounded-full" />}
                  </button>
                </div>
              )}
            </div>

            {/* Partner Button */}
            <button
              onClick={() => handleNavClick('contact')}
              className="hidden lg:flex items-center gap-1.5 px-4 py-2 bg-black hover:bg-neutral-800 dark:bg-white dark:hover:bg-neutral-100 text-white dark:text-black rounded-lg text-sm font-semibold tracking-tight transition-all duration-300 shadow-sm"
            >
              <Sparkles className="w-3.5 h-3.5" />
              Partner With Us
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isMobileMenuOpen && (
        <div id="mobile-navigation-drawer" className="md:hidden bg-white dark:bg-black border-b border-neutral-100 dark:border-neutral-900 px-4 pt-2 pb-6 space-y-2 animate-fadeIn shadow-lg">
          <button
            onClick={() => handleNavClick('home')}
            className={`w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
              activeView === 'home' ? 'bg-neutral-50 dark:bg-neutral-900 text-black dark:text-white font-bold' : 'text-neutral-600 dark:text-neutral-400'
            }`}
          >
            Home
          </button>
          <button
            onClick={() => handleNavClick('institutions')}
            className={`w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
              activeView === 'institutions' ? 'bg-neutral-50 dark:bg-neutral-900 text-black dark:text-white font-bold' : 'text-neutral-600 dark:text-neutral-400'
            }`}
          >
            Institutions Portals
          </button>
          <button
            onClick={() => handleNavClick('uniforms')}
            className={`w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
              activeView === 'uniforms' ? 'bg-neutral-50 dark:bg-neutral-900 text-black dark:text-white font-bold' : 'text-neutral-600 dark:text-neutral-400'
            }`}
          >
            Browse Uniforms
          </button>
          <button
            onClick={() => handleNavClick('how-it-works')}
            className={`w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
              activeView === 'how-it-works' ? 'bg-neutral-50 dark:bg-neutral-900 text-black dark:text-white font-bold' : 'text-neutral-600 dark:text-neutral-400'
            }`}
          >
            How It Works
          </button>
          <button
            onClick={() => handleNavClick('about')}
            className={`w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
              activeView === 'about' ? 'bg-neutral-50 dark:bg-neutral-900 text-black dark:text-white font-bold' : 'text-neutral-600 dark:text-neutral-400'
            }`}
          >
            About Us
          </button>
          <button
            onClick={() => handleNavClick('contact')}
            className={`w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
              activeView === 'contact' ? 'bg-neutral-50 dark:bg-neutral-900 text-black dark:text-white font-bold' : 'text-neutral-600 dark:text-neutral-400'
            }`}
          >
            Contact
          </button>

          <div className="pt-4 border-t border-neutral-100 dark:border-neutral-900 flex justify-between items-center px-4">
            <span className="text-xs font-mono text-neutral-400">Current Simulation:</span>
            <span className="text-xs font-bold capitalize text-neutral-800 dark:text-neutral-200">
              {currentRole.replace('_', ' ')}
            </span>
          </div>
        </div>
      )}
    </nav>
  );
}
