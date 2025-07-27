import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useVoting } from '@/contexts/VotingContext';
import { toast } from '@/hooks/use-toast';
import { Vote, CheckCircle, Clock, Shield, LogOut, User } from 'lucide-react';
import { Candidate } from '@/types/voting';

export const VotingInterface: React.FC = () => {
  const [selectedCandidate, setSelectedCandidate] = useState<string>('');
  const [isVoting, setIsVoting] = useState(false);
  const [voteConfirmed, setVoteConfirmed] = useState(false);
  const [blockchainHash, setBlockchainHash] = useState('');
  
  const { currentUser, currentElection, castVote, logout } = useVoting();

  const handleVote = async () => {
    if (!selectedCandidate) {
      toast({
        title: "No Candidate Selected",
        description: "Please select a candidate before voting.",
        variant: "destructive"
      });
      return;
    }

    setIsVoting(true);
    try {
      const transactionHash = await castVote(selectedCandidate);
      setBlockchainHash(transactionHash);
      setVoteConfirmed(true);
      
      toast({
        title: "Vote Cast Successfully!",
        description: "Your vote has been recorded on the blockchain.",
        variant: "default"
      });
    } catch (error) {
      toast({
        title: "Voting Failed",
        description: error instanceof Error ? error.message : "An error occurred while casting your vote.",
        variant: "destructive"
      });
    } finally {
      setIsVoting(false);
    }
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  if (voteConfirmed) {
    return (
      <div className="min-h-screen bg-gradient-secure flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl shadow-secure text-center">
          <CardContent className="p-8">
            <div className="w-20 h-20 bg-gradient-accent rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-accent-foreground" />
            </div>
            
            <h2 className="text-2xl font-bold mb-4">Vote Successfully Cast!</h2>
            <p className="text-muted-foreground mb-6">
              Your vote has been securely recorded on the blockchain and cannot be changed.
            </p>
            
            <div className="bg-muted/50 rounded-lg p-4 mb-6">
              <h3 className="font-semibold mb-2">Blockchain Transaction</h3>
              <p className="text-sm font-mono break-all text-muted-foreground">
                {blockchainHash}
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 text-sm">
              <div className="flex items-center justify-center gap-2">
                <Shield className="w-4 h-4 text-vote-secure" />
                <span>Encrypted</span>
              </div>
              <div className="flex items-center justify-center gap-2">
                <CheckCircle className="w-4 h-4 text-vote-verified" />
                <span>Verified</span>
              </div>
              <div className="flex items-center justify-center gap-2">
                <Clock className="w-4 h-4 text-vote-blockchain" />
                <span>Immutable</span>
              </div>
            </div>
            
            <Button onClick={logout} variant="outline" className="w-full">
              <LogOut className="w-4 h-4 mr-2" />
              Exit Voting System
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (currentUser?.voter?.hasVoted) {
    return (
      <div className="min-h-screen bg-gradient-secure flex items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-secure text-center">
          <CardContent className="p-8">
            <div className="w-16 h-16 bg-gradient-accent rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-accent-foreground" />
            </div>
            
            <h2 className="text-xl font-bold mb-4">Already Voted</h2>
            <p className="text-muted-foreground mb-6">
              You have already cast your vote in this election. Each voter can only vote once.
            </p>
            
            <Button onClick={logout} variant="outline" className="w-full">
              <LogOut className="w-4 h-4 mr-2" />
              Exit Voting System
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-secure p-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">{currentElection.title}</h1>
            <p className="text-muted-foreground">{currentElection.description}</p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm">
              <User className="w-4 h-4" />
              <span>{currentUser?.voter?.name}</span>
            </div>
            <Button onClick={logout} variant="outline" size="sm">
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 mb-8">
          {currentElection.candidates.map((candidate: Candidate) => (
            <Card 
              key={candidate.id}
              className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
                selectedCandidate === candidate.id 
                  ? 'ring-2 ring-primary shadow-secure' 
                  : 'hover:ring-1 hover:ring-primary/50'
              }`}
              onClick={() => setSelectedCandidate(candidate.id)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center gap-4">
                  <Avatar className="w-16 h-16">
                    <AvatarImage src={candidate.image} alt={candidate.name} />
                    <AvatarFallback className="text-lg font-semibold">
                      {getInitials(candidate.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <CardTitle className="text-xl">{candidate.name}</CardTitle>
                    <Badge variant="secondary" className="mt-1">
                      {candidate.party}
                    </Badge>
                  </div>
                  {selectedCandidate === candidate.id && (
                    <CheckCircle className="w-6 h-6 text-primary" />
                  )}
                </div>
              </CardHeader>
              
              <CardContent>
                <p className="text-muted-foreground text-sm">
                  {candidate.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="shadow-secure">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold mb-2">Cast Your Vote</h3>
                <p className="text-muted-foreground text-sm">
                  {selectedCandidate 
                    ? `You have selected: ${currentElection.candidates.find(c => c.id === selectedCandidate)?.name}`
                    : 'Please select a candidate to proceed'
                  }
                </p>
              </div>
              
              <Button
                onClick={handleVote}
                disabled={!selectedCandidate || isVoting}
                variant="vote"
                size="lg"
                className="min-w-[140px]"
              >
                <Vote className="w-5 h-5 mr-2" />
                {isVoting ? 'Casting Vote...' : 'Cast Vote'}
              </Button>
            </div>
            
            <div className="mt-4 pt-4 border-t border-border">
              <div className="flex items-center justify-center gap-6 text-xs text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  <span>Blockchain Secured</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  <span>Anonymous Voting</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>Immutable Record</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};