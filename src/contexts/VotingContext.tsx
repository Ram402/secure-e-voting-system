import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Voter, Candidate, Vote, Election, User, VotingStats, BlockchainTransaction } from '@/types/voting';
import { mockCandidates, mockElection } from '@/data/mockData';

interface VotingContextType {
  currentUser: User | null;
  currentElection: Election;
  voters: Voter[];
  votes: Vote[];
  votingStats: VotingStats;
  blockchainTransactions: BlockchainTransaction[];
  
  // Auth functions
  login: (voterID: string, role: 'voter' | 'admin') => Promise<boolean>;
  logout: () => void;
  
  // Voter functions
  registerVoter: (voter: Omit<Voter, 'id' | 'isVerified' | 'hasVoted' | 'registrationDate'>) => Promise<string>;
  verifyFace: (voterID: string, faceImage: string) => Promise<boolean>;
  
  // Voting functions
  castVote: (candidateID: string) => Promise<string>;
  
  // Admin functions
  getVotingStats: () => VotingStats;
  
  // Blockchain functions
  verifyBlockchainTransaction: (transactionID: string) => Promise<boolean>;
}

const VotingContext = createContext<VotingContextType | undefined>(undefined);

export const useVoting = () => {
  const context = useContext(VotingContext);
  if (!context) {
    throw new Error('useVoting must be used within a VotingProvider');
  }
  return context;
};

const generateMockStats = (votes: Vote[], totalVoters: number): VotingStats => {
  const totalVotes = votes.length;
  const turnoutPercentage = totalVoters > 0 ? (totalVotes / totalVoters) * 100 : 0;
  
  // Generate hourly voting trend
  const votingTrend = Array.from({ length: 24 }, (_, hour) => ({
    hour,
    votes: Math.floor(Math.random() * 50) + (hour >= 8 && hour <= 18 ? 20 : 5)
  }));
  
  // Calculate candidate stats
  const candidateVotes: { [key: string]: number } = {};
  votes.forEach(vote => {
    candidateVotes[vote.candidateID] = (candidateVotes[vote.candidateID] || 0) + 1;
  });
  
  const candidateStats = Object.entries(candidateVotes).map(([candidateID, votes]) => ({
    candidateID,
    votes,
    percentage: totalVotes > 0 ? (votes / totalVotes) * 100 : 0
  }));
  
  return {
    totalRegisteredVoters: totalVoters,
    totalVotesCast: totalVotes,
    turnoutPercentage,
    votingTrend,
    candidateStats
  };
};

export const VotingProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [voters, setVoters] = useState<Voter[]>([]);
  const [votes, setVotes] = useState<Vote[]>([]);
  const [blockchainTransactions, setBlockchainTransactions] = useState<BlockchainTransaction[]>([]);
  const [currentElection] = useState<Election>(mockElection);

  // Load data from localStorage on mount
  useEffect(() => {
    const savedVoters = localStorage.getItem('e-voting-voters');
    const savedVotes = localStorage.getItem('e-voting-votes');
    const savedTransactions = localStorage.getItem('e-voting-transactions');
    
    if (savedVoters) setVoters(JSON.parse(savedVoters));
    if (savedVotes) setVotes(JSON.parse(savedVotes));
    if (savedTransactions) setBlockchainTransactions(JSON.parse(savedTransactions));
  }, []);

  // Save data to localStorage when state changes
  useEffect(() => {
    localStorage.setItem('e-voting-voters', JSON.stringify(voters));
  }, [voters]);

  useEffect(() => {
    localStorage.setItem('e-voting-votes', JSON.stringify(votes));
  }, [votes]);

  useEffect(() => {
    localStorage.setItem('e-voting-transactions', JSON.stringify(blockchainTransactions));
  }, [blockchainTransactions]);

  const login = async (voterID: string, role: 'voter' | 'admin'): Promise<boolean> => {
    if (role === 'admin' && voterID === 'admin') {
      setCurrentUser({
        id: 'admin',
        role: 'admin'
      });
      return true;
    }
    
    const voter = voters.find(v => v.voterID === voterID);
    if (voter && voter.isVerified) {
      setCurrentUser({
        id: voter.id,
        role: 'voter',
        voter
      });
      return true;
    }
    
    return false;
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const registerVoter = async (voterData: Omit<Voter, 'id' | 'isVerified' | 'hasVoted' | 'registrationDate'>): Promise<string> => {
    const newVoter: Voter = {
      ...voterData,
      id: Date.now().toString(),
      isVerified: false,
      hasVoted: false,
      registrationDate: new Date()
    };
    
    setVoters(prev => [...prev, newVoter]);
    return newVoter.id;
  };

  const verifyFace = async (voterID: string, faceImage: string): Promise<boolean> => {
    // Simulate face recognition with 95% accuracy
    const confidence = Math.random();
    const isMatch = confidence > 0.05; // 95% accuracy
    
    if (isMatch) {
      setVoters(prev => prev.map(voter => 
        voter.voterID === voterID ? { ...voter, isVerified: true } : voter
      ));
    }
    
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    return isMatch;
  };

  const castVote = async (candidateID: string): Promise<string> => {
    if (!currentUser || !currentUser.voter) {
      throw new Error('User not authenticated');
    }

    if (currentUser.voter.hasVoted) {
      throw new Error('User has already voted');
    }

    // Create blockchain transaction
    const transaction: BlockchainTransaction = {
      hash: '0x' + Math.random().toString(16).substr(2, 64),
      block: Math.floor(Math.random() * 1000000) + 1000000,
      timestamp: new Date(),
      from: '0x' + Math.random().toString(16).substr(2, 40),
      to: '0x' + Math.random().toString(16).substr(2, 40),
      gasUsed: Math.floor(Math.random() * 50000) + 21000,
      gasPrice: (Math.random() * 20 + 10).toFixed(2),
      value: '0',
      data: JSON.stringify({ candidateID, voterID: currentUser.voter.voterID })
    };

    // Create vote record
    const newVote: Vote = {
      id: Date.now().toString(),
      voterID: currentUser.voter.voterID,
      candidateID,
      timestamp: new Date(),
      blockchainHash: transaction.hash,
      transactionID: transaction.hash,
      isConfirmed: true
    };

    // Update state
    setVotes(prev => [...prev, newVote]);
    setBlockchainTransactions(prev => [...prev, transaction]);
    setVoters(prev => prev.map(voter => 
      voter.id === currentUser.voter!.id ? { ...voter, hasVoted: true } : voter
    ));

    return transaction.hash;
  };

  const getVotingStats = (): VotingStats => {
    return generateMockStats(votes, voters.length);
  };

  const verifyBlockchainTransaction = async (transactionID: string): Promise<boolean> => {
    const transaction = blockchainTransactions.find(tx => tx.hash === transactionID);
    return !!transaction;
  };

  const votingStats = generateMockStats(votes, voters.length);

  return (
    <VotingContext.Provider value={{
      currentUser,
      currentElection,
      voters,
      votes,
      votingStats,
      blockchainTransactions,
      login,
      logout,
      registerVoter,
      verifyFace,
      castVote,
      getVotingStats,
      verifyBlockchainTransaction
    }}>
      {children}
    </VotingContext.Provider>
  );
};