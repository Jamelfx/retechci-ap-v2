
import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Member } from '../types';

interface HeaderProps {
  currentUser: Member | null;
  onLogout: () => Promise<void>;
}

const Logo: React.FC = () => (
    <svg viewBox="0 0 500 150" xmlns="http://www.w3.org/2000/svg" className="h-12 w-auto" fill="white" aria-label="Logo RETECHCI">
        {/* Graphic part */}
        <g transform="translate(0, 15)">
            {/* Left shape */}
            <path d="M60 0 L40 0 L0 50 L40 100 L60 100 L20 50 Z" />
            {/* Top right shape */}
            <path d="M70 27 L180 0 L200 15 L90 42 Z" />
            {/* Bottom right shape */}
            <path d="M70 73 L90 58 L200 85 L180 100 Z" />
        </g>
        {/* Text part */}
        <text x="215" y="65" fontFamily="sans-serif" fontSize="45" fontWeight="bold">ReTechCi</text>
        <text x="215" y="93" fontFamily="sans-serif" fontSize="18" fillOpacity="0.9">Réseau des Techniciens</text>
        <text x="215" y="115" fontFamily="sans-serif" fontSize="18" fillOpacity="0.9">du Cinéma en Côte d'Ivoire</text>
    </svg>
);


const NavLinkItem: React.FC<{ to: string; children: React.ReactNode }> = ({ to, children }) => (
    <NavLink 
      to={to} 
      className={({ isActive }) => 
        `px-3 py-2 rounded-md text-sm font-medium transition-colors ${
          isActive ? 'bg-brand-red text-white' : 'text-gray-300 hover:bg-brand-gray hover:text-white'
        }`
      }
    >
      {children}
    </NavLink>
);

const DropdownNavLink: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div 
            className="relative"
            onMouseEnter={() => setIsOpen(true)}
            onMouseLeave={() => setIsOpen(false)}
        >
            <NavLink 
              to="/conventions"
              className={({ isActive }) => 
                `px-3 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer flex items-center gap-1 ${
                  isActive ? 'bg-brand-red text-white' : 'text-gray-300 hover:bg-brand-gray hover:text-white'
                }`
              }
            >
                Conventions
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
            </NavLink>
            {isOpen && (
                <div className="absolute top-full left-0 mt-2 w-48 bg-brand-gray rounded-md shadow-lg py-1 z-50">
                    <NavLink to="/conventions/grille-salariale" className={({isActive}) => `block px-4 py-2 text-sm ${isActive ? 'text-brand-red' : 'text-gray-300'} hover:bg-brand-dark`}>Grille Salariale</NavLink>
                    <NavLink to="/conventions/contrats-types" className={({isActive}) => `block px-4 py-2 text-sm ${isActive ? 'text-brand-red' : 'text-gray-300'} hover:bg-brand-dark`}>Contrats Types</NavLink>
                    <NavLink to="/conventions/charte-image" className={({isActive}) => `block px-4 py-2 text-sm ${isActive ? 'text-brand-red' : 'text-gray-300'} hover:bg-brand-dark`}>Charte de l'Image</NavLink>
                </div>
            )}
        </div>
    );
};

const MobileNavLink: React.FC<{ to: string; children: React.ReactNode; icon: React.ReactNode; onClick: () => void }> = ({ to, children, icon, onClick }) => (
    <NavLink 
      to={to} 
      onClick={onClick}
      className={({ isActive }) => 
        `flex items-center px-4 py-3 text-lg font-medium transition-colors ${
          isActive ? 'bg-brand-red text-white' : 'text-gray-300 hover:bg-brand-gray hover:text-white'
        }`
      }
    >
      {icon}
      {children}
    </NavLink>
);

const MobileDropdownNavLink: React.FC<{ onClick: () => void }> = ({ onClick }) => {
    const [isOpen, setIsOpen] = useState(false);
    
    const handleMainClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();
        setIsOpen(!isOpen);
    };

    const handleSubLinkClick = () => {
        setIsOpen(false);
        onClick();
    };

    return (
        <div>
             <NavLink 
                to="/conventions"
                onClick={handleMainClick}
                className={({ isActive }) => 
                    `flex items-center justify-between w-full px-4 py-3 text-lg font-medium transition-colors ${
                    isActive ? 'bg-brand-red text-white' : 'text-gray-300 hover:bg-brand-gray hover:text-white'
                    }`
                }
            >
                <div className="flex items-center">
                    <svg className="h-6 w-6 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                    Conventions
                </div>
                <svg className={`w-5 h-5 transition-transform ${isOpen ? 'transform rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
            </NavLink>
            <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                    className="overflow-hidden"
                >
                    <div className="pl-8 bg-black bg-opacity-20">
                         <MobileNavLink to="/conventions/grille-salariale" icon={<svg className="h-5 w-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" /></svg>} onClick={handleSubLinkClick}>Grille Salariale</MobileNavLink>
                         <MobileNavLink to="/conventions/contrats-types" icon={<svg className="h-5 w-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>} onClick={handleSubLinkClick}>Contrats Types</MobileNavLink>
                         <MobileNavLink to="/conventions/charte-image" icon={<svg className="h-5 w-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>} onClick={handleSubLinkClick}>Charte de l'Image</MobileNavLink>
                    </div>
                </motion.div>
            )}
            </AnimatePresence>
        </div>
    );
};

const Header: React.FC<HeaderProps> = ({ currentUser, onLogout }) => {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const isAdmin = currentUser?.role && currentUser.role !== 'Membre';

  const handleLogoutClick = async () => {
    await onLogout();
    setIsMobileMenuOpen(false);
    navigate('/');
  };
  
  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  return (
    <header className={`shadow-lg sticky top-0 z-50 transition-colors duration-300 ${isScrolled ? 'bg-brand-gray/80 backdrop-blur-sm' : 'bg-brand-gray'}`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* LEFT: LOGO */}
          <div className="flex-1 flex justify-start">
            <NavLink to="/" className="flex-shrink-0" onClick={closeMobileMenu}>
               <Logo />
            </NavLink>
          </div>
          
          {/* CENTER: NAVIGATION (Desktop only) */}
          <div className="hidden md:flex justify-center">
            <nav className="flex items-baseline space-x-4">
              <NavLinkItem to="/">Accueil</NavLinkItem>
              <NavLinkItem to="/technicians">Annuaire</NavLinkItem>
              <DropdownNavLink />
              <NavLinkItem to="/about">À Propos</NavLinkItem>
              <NavLinkItem to="/news">Actualités</NavLinkItem>
              <NavLinkItem to="/live">Direct</NavLinkItem>
              <NavLinkItem to="/contact">Contact</NavLinkItem>
            </nav>
          </div>

          {/* RIGHT: ACTIONS (Desktop) & HAMBURGER (Mobile) */}
          <div className="flex-1 flex justify-end">
            {/* Desktop actions */}
            <div className="hidden md:flex items-center">
              {currentUser ? (
                <div className="flex items-center space-x-4">
                    {isAdmin && <NavLinkItem to="/admin">Panel Admin</NavLinkItem>}
                    <NavLinkItem to="/dashboard">Tableau de bord</NavLinkItem>
                    <button
                      onClick={handleLogoutClick}
                      className="bg-red-600 text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-red-700 transition-colors"
                    >
                      Déconnexion
                    </button>
                  </div>
              ) : (
                  <div className="flex items-center space-x-2">
                      <NavLink to="/join" className="border border-brand-red text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-brand-red transition-colors">
                          Devenir Membre
                      </NavLink>
                      <NavLink to="/login" className="bg-brand-red text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-opacity-80 transition-colors">
                          Connexion
                      </NavLink>
                  </div>
              )}
            </div>
            
            {/* Mobile hamburger button */}
            <div className="md:hidden">
              <button
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-brand-gray focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                  aria-controls="mobile-menu"
                  aria-expanded={isMobileMenuOpen}
                >
                  <span className="sr-only">Ouvrir le menu principal</span>
                  {isMobileMenuOpen ? (
                      <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                  ) : (
                      <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" /></svg>
                  )}
              </button>
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isMobileMenuOpen && (
             <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                className="md:hidden absolute w-full bg-brand-gray shadow-lg z-40 overflow-hidden" 
                id="mobile-menu"
              >
                <div className="pt-2 pb-3 space-y-1">
                    <MobileNavLink to="/" icon={<svg className="h-6 w-6 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>} onClick={closeMobileMenu}>Accueil</MobileNavLink>
                    <MobileNavLink to="/technicians" icon={<svg className="h-6 w-6 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.653-.125-1.274-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.653.125-1.274.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>} onClick={closeMobileMenu}>Annuaire</MobileNavLink>
                    <MobileDropdownNavLink onClick={closeMobileMenu} />
                    <MobileNavLink to="/about" icon={<svg className="h-6 w-6 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>} onClick={closeMobileMenu}>À Propos</MobileNavLink>
                    <MobileNavLink to="/news" icon={<svg className="h-6 w-6 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3h3m-3 4h3m-3 4h3" /></svg>} onClick={closeMobileMenu}>Actualités</MobileNavLink>
                    <MobileNavLink to="/live" icon={<svg className="h-6 w-6 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>} onClick={closeMobileMenu}>Direct</MobileNavLink>
                    <MobileNavLink to="/contact" icon={<svg className="h-6 w-6 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>} onClick={closeMobileMenu}>Contact</MobileNavLink>
                    
                    <div className="border-t border-gray-700 pt-4 mt-4 mx-2">
                        {currentUser ? (
                            <>
                                {isAdmin && <MobileNavLink to="/admin" icon={<svg className="h-6 w-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.096 2.572-1.065z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>} onClick={closeMobileMenu}>Panel Admin</MobileNavLink>}
                                <MobileNavLink to="/dashboard" icon={<svg className="h-6 w-6 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>} onClick={closeMobileMenu}>Tableau de bord</MobileNavLink>
                                <button
                                  onClick={handleLogoutClick}
                                  className="w-full flex items-center px-4 py-3 text-lg font-medium text-gray-300 hover:bg-brand-gray hover:text-white"
                                >
                                  <svg className="h-6 w-6 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                                  Déconnexion
                                </button>
                            </>
                        ) : (
                            <div className="px-2 pt-2 space-y-2">
                                <NavLink to="/join" onClick={closeMobileMenu} className="w-full text-center block border border-brand-red text-white px-4 py-3 rounded-md text-lg font-medium hover:bg-brand-red transition-colors">
                                    Devenir Membre
                                </NavLink>
                                <NavLink to="/login" onClick={closeMobileMenu} className="w-full text-center block bg-brand-red text-white px-4 py-3 rounded-md text-lg font-medium hover:bg-opacity-80 transition-colors">
                                    Connexion
                                </NavLink>
                            </div>
                        )}
                    </div>
                </div>
            </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;