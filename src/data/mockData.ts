import { Candidate, Election } from '@/types/voting';
import aliceJohnsonImg from '@/assets/alice-johnson.jpg';
import bobMartinezImg from '@/assets/bob-martinez.jpg';
import carolWilliamsImg from '@/assets/carol-williams.jpg';
import davidChenImg from '@/assets/david-chen.jpg';

export const mockCandidates: Candidate[] = [
  {
    id: '1',
    name: 'Alice Johnson',
    party: 'Progressive Party',
    image: aliceJohnsonImg,
    description: 'Experienced leader focused on education reform and environmental sustainability.',
    votes: 0
  },
  {
    id: '2',
    name: 'Bob Martinez',
    party: 'Economic Growth Alliance',
    image: bobMartinezImg,
    description: 'Business-oriented candidate promoting job creation and technological innovation.',
    votes: 0
  },
  {
    id: '3',
    name: 'Carol Williams',
    party: 'Social Justice Coalition',
    image: carolWilliamsImg,
    description: 'Healthcare advocate committed to expanding access and reducing costs.',
    votes: 0
  },
  {
    id: '4',
    name: 'David Chen',
    party: 'Technology Forward',
    image: davidChenImg,
    description: 'Former tech executive focused on digital infrastructure and cybersecurity.',
    votes: 0
  }
];

export const mockElection: Election = {
  id: '2024-presidential',
  title: '2024 Presidential Election',
  description: 'Choose the next president from qualified candidates representing different political perspectives.',
  startDate: new Date('2024-01-01'),
  endDate: new Date('2024-12-31'),
  candidates: mockCandidates,
  isActive: true,
  totalVotes: 0
};