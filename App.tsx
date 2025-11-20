
import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import TechniciansPage from './pages/TechniciansPage'; // This is now the Directory Hub
import TechniciansListPage from './pages/TechniciansListPage'; // The actual list of technicians
import LocationsPage from './pages/LocationsPage';
import CostumesPage from './pages/CostumesPage';
import PropsPage from './pages/PropsPage';
import EquipmentPage from './pages/EquipmentPage';
import ContactPage from './pages/ContactPage';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import AboutPage from './pages/AboutPage';
import NewsPage from './pages/NewsPage';
import ConventionsPage from './pages/ConventionsPage';
import SalaryGridPage from './pages/SalaryGridPage';
import ContractTypesPage from './pages/ContractTypesPage';
import ImageCharterPage from './pages/ImageCharterPage';
import AnimatedPage from './components/AnimatedPage';
import JoinPage from './pages/JoinPage';
import AdminPage from './pages/AdminPage';
import LivePage from './pages/LivePage';
import DonationButton from './components/DonationButton'; // NOUVEAU

import { Member } from './types';
import apiClient from './api/client';

const AnimatedRoutes: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<Member | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const checkLoggedIn = async () => {
      try {
        const user = await apiClient.get('/api/auth/me');
        setCurrentUser(user);
      } catch (error) {
        console.log('No active session found.');
      }
      setAuthLoading(false);
    };
    checkLoggedIn();
  }, []);

  const handleLogin = async (email: string, password?: string): Promise<{user: Member, token: string}> => {
    const { user, token } = await apiClient.post('/api/auth/login', { email, password });
    setCurrentUser(user);
    return { user, token };
  };

  const handleLogout = async () => {
    await apiClient.post('/api/auth/logout', {});
    setCurrentUser(null);
  };
  
  const updateCurrentUser = (updatedUser: Member) => {
    setCurrentUser(updatedUser);
  };

  const isAdmin = currentUser?.role && currentUser.role !== 'Membre';
  const isMemberPage = location.pathname.startsWith('/dashboard') || location.pathname.startsWith('/admin');

  if (authLoading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-brand-dark">
        <div className="text-white text-xl">Chargement de l'application...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-brand-dark">
      <Header currentUser={currentUser} onLogout={handleLogout} />
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8 relative overflow-x-hidden">
         <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
              <Route path="/" element={<AnimatedPage><HomePage /></AnimatedPage>} />
              <Route path="/technicians" element={<AnimatedPage><TechniciansPage /></AnimatedPage>} />
              <Route path="/directory/technicians" element={<AnimatedPage><TechniciansListPage /></AnimatedPage>} />
              <Route path="/directory/locations" element={<AnimatedPage><LocationsPage /></AnimatedPage>} />
              <Route path="/directory/costumes" element={<AnimatedPage><CostumesPage /></AnimatedPage>} />
              <Route path="/directory/props" element={<AnimatedPage><PropsPage /></AnimatedPage>} />
              <Route path="/directory/equipment" element={<AnimatedPage><EquipmentPage /></AnimatedPage>} />
              <Route path="/about" element={<AnimatedPage><AboutPage /></AnimatedPage>} />
              <Route path="/news" element={<AnimatedPage><NewsPage /></AnimatedPage>} />
              <Route path="/conventions" element={<AnimatedPage><ConventionsPage /></AnimatedPage>} />
              <Route path="/conventions/grille-salariale" element={<AnimatedPage><SalaryGridPage /></AnimatedPage>} />
              <Route path="/conventions/contrats-types" element={<AnimatedPage><ContractTypesPage /></AnimatedPage>} />
              <Route path="/conventions/charte-image" element={<AnimatedPage><ImageCharterPage /></AnimatedPage>} />
              <Route path="/contact" element={<AnimatedPage><ContactPage /></AnimatedPage>} />
              <Route path="/join" element={<AnimatedPage><JoinPage /></AnimatedPage>} />
              <Route path="/live" element={<AnimatedPage><LivePage currentUser={currentUser} /></AnimatedPage>} />
              <Route 
                path="/login" 
                element={currentUser ? <Navigate to="/dashboard" /> : <AnimatedPage><LoginPage onLogin={handleLogin} /></AnimatedPage>} 
              />
              <Route 
                path="/dashboard" 
                element={currentUser ? <AnimatedPage><DashboardPage member={currentUser} onMemberUpdate={updateCurrentUser} /></AnimatedPage> : <Navigate to="/login" />} 
              />
               <Route 
                path="/admin" 
                element={isAdmin ? <AnimatedPage><AdminPage currentUser={currentUser} /></AnimatedPage> : <Navigate to="/" />} 
              />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
        </AnimatePresence>
      </main>
      <Footer />
      {!isMemberPage && <DonationButton />}
    </div>
  );
};

const App: React.FC = () => (
  <HashRouter>
    <AnimatedRoutes />
  </HashRouter>
);

export default App;
