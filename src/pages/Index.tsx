import React, { useState } from 'react';
import { VoterLogin } from '@/components/VoterLogin';
import { VoterRegistration } from '@/components/VoterRegistration';
import { VotingInterface } from '@/components/VotingInterface';
import { AdminDashboard } from '@/components/AdminDashboard';
import { useVoting } from '@/contexts/VotingContext';

const Index = () => {
  const [currentView, setCurrentView] = useState<'login' | 'register'>('login');
  const { currentUser } = useVoting();

  // Show appropriate interface based on user state
  if (currentUser) {
    if (currentUser.role === 'admin') {
      return <AdminDashboard />;
    } else {
      return <VotingInterface />;
    }
  }

  // Show login or registration based on current view
  if (currentView === 'register') {
    return <VoterRegistration />;
  }

  return (
    <VoterLogin onRegisterClick={() => setCurrentView('register')} />
  );
};

export default Index;
