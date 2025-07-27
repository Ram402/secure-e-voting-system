export interface Voter {
  id: string;
  name: string;
  voterID: string;
  email: string;
  faceImage?: string;
  faceEncoding?: number[];
  isVerified: boolean;
  hasVoted: boolean;
  registrationDate: Date;
}

export interface Candidate {
  id: string;
  name: string;
  party: string;
  image: string;
  description: string;
  votes: number;
}

export interface Vote {
  id: string;
  voterID: string;
  candidateID: string;
  timestamp: Date;
  blockchainHash: string;
  transactionID: string;
  isConfirmed: boolean;
}

export interface Election {
  id: string;
  title: string;
  description: string;
  startDate: Date;
  endDate: Date;
  candidates: Candidate[];
  isActive: boolean;
  totalVotes: number;
}

export interface BlockchainTransaction {
  hash: string;
  block: number;
  timestamp: Date;
  from: string;
  to: string;
  gasUsed: number;
  gasPrice: string;
  value: string;
  data: string;
}

export interface FaceRecognitionResult {
  isMatch: boolean;
  confidence: number;
  timestamp: Date;
  voterID: string;
}

export type UserRole = 'voter' | 'admin';

export interface User {
  id: string;
  role: UserRole;
  voter?: Voter;
}

export interface VotingStats {
  totalRegisteredVoters: number;
  totalVotesCast: number;
  turnoutPercentage: number;
  votingTrend: { hour: number; votes: number }[];
  candidateStats: { candidateID: string; votes: number; percentage: number }[];
}