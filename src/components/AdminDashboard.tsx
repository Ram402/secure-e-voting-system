import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useVoting } from '@/contexts/VotingContext';
import { 
  Users, 
  Vote, 
  TrendingUp, 
  Shield, 
  LogOut, 
  Clock,
  CheckCircle,
  BarChart3,
  Activity,
  Crown
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const { 
    currentElection, 
    voters, 
    votes, 
    votingStats, 
    blockchainTransactions, 
    logout 
  } = useVoting();
  
  const [realTimeStats, setRealTimeStats] = useState(votingStats);

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setRealTimeStats(prevStats => ({
        ...prevStats,
        totalVotesCast: votes.length,
        turnoutPercentage: voters.length > 0 ? (votes.length / voters.length) * 100 : 0
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, [votes.length, voters.length]);

  const getTopCandidate = () => {
    if (realTimeStats.candidateStats.length === 0) return null;
    return realTimeStats.candidateStats.reduce((max, candidate) => 
      candidate.votes > max.votes ? candidate : max
    );
  };

  const formatBlockchainHash = (hash: string) => {
    return `${hash.slice(0, 8)}...${hash.slice(-8)}`;
  };

  return (
    <div className="min-h-screen bg-gradient-secure p-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center">
              <Crown className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Admin Dashboard</h1>
              <p className="text-muted-foreground">Real-time election monitoring and management</p>
            </div>
          </div>
          
          <Button onClick={logout} variant="outline">
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="shadow-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Registered Voters</p>
                  <p className="text-2xl font-bold">{realTimeStats.totalRegisteredVoters}</p>
                </div>
                <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center">
                  <Users className="w-6 h-6 text-primary-foreground" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Votes Cast</p>
                  <p className="text-2xl font-bold">{realTimeStats.totalVotesCast}</p>
                </div>
                <div className="w-12 h-12 bg-gradient-accent rounded-full flex items-center justify-center">
                  <Vote className="w-6 h-6 text-accent-foreground" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Turnout</p>
                  <p className="text-2xl font-bold">{realTimeStats.turnoutPercentage.toFixed(1)}%</p>
                </div>
                <div className="w-12 h-12 bg-gradient-blockchain rounded-full flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-primary-foreground" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Blockchain Txns</p>
                  <p className="text-2xl font-bold">{blockchainTransactions.length}</p>
                </div>
                <div className="w-12 h-12 bg-vote-blockchain rounded-full flex items-center justify-center">
                  <Shield className="w-6 h-6 text-primary-foreground" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="results">Live Results</TabsTrigger>
            <TabsTrigger value="voters">Voters</TabsTrigger>
            <TabsTrigger value="blockchain">Blockchain</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="w-5 h-5" />
                    Voting Activity
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {realTimeStats.votingTrend.slice(-12).map((trend, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">
                          {trend.hour}:00
                        </span>
                        <div className="flex items-center gap-2">
                          <div className="w-20 bg-muted rounded-full h-2">
                            <div 
                              className="bg-gradient-primary h-2 rounded-full"
                              style={{ width: `${Math.min((trend.votes / 70) * 100, 100)}%` }}
                            />
                          </div>
                          <span className="text-sm font-medium w-8">{trend.votes}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="w-5 h-5" />
                    Election Status
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Election Status</span>
                    <Badge variant={currentElection.isActive ? 'default' : 'secondary'}>
                      {currentElection.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Security Level</span>
                    <Badge variant="default" className="bg-vote-secure">
                      Maximum
                    </Badge>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Face Recognition</span>
                    <Badge variant="default" className="bg-vote-verified">
                      95%+ Accuracy
                    </Badge>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Blockchain Network</span>
                    <Badge variant="default" className="bg-vote-blockchain">
                      Ethereum
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="results" className="space-y-6">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle>Live Election Results</CardTitle>
                <p className="text-muted-foreground">Real-time vote tallies and candidate standings</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {currentElection.candidates.map((candidate, index) => {
                    const candidateVotes = realTimeStats.candidateStats.find(
                      stat => stat.candidateID === candidate.id
                    );
                    const votes = candidateVotes?.votes || 0;
                    const percentage = candidateVotes?.percentage || 0;
                    
                    return (
                      <div key={candidate.id} className="flex items-center gap-4 p-4 rounded-lg border">
                        <div className="flex items-center gap-3 flex-1">
                          <div className="w-8 h-8 rounded-full bg-gradient-primary flex items-center justify-center text-primary-foreground font-bold">
                            {index + 1}
                          </div>
                          <div>
                            <h3 className="font-semibold">{candidate.name}</h3>
                            <p className="text-sm text-muted-foreground">{candidate.party}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <p className="text-lg font-bold">{votes}</p>
                            <p className="text-sm text-muted-foreground">{percentage.toFixed(1)}%</p>
                          </div>
                          <div className="w-24 bg-muted rounded-full h-2">
                            <div 
                              className="bg-gradient-accent h-2 rounded-full"
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="voters" className="space-y-6">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle>Registered Voters</CardTitle>
                <p className="text-muted-foreground">Voter registration and verification status</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {voters.map((voter) => (
                    <div key={voter.id} className="flex items-center justify-between p-3 rounded-lg border">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-secondary flex items-center justify-center">
                          <Users className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="font-medium">{voter.name}</h4>
                          <p className="text-sm text-muted-foreground">ID: {voter.voterID}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Badge variant={voter.isVerified ? 'default' : 'secondary'}>
                          {voter.isVerified ? 'Verified' : 'Pending'}
                        </Badge>
                        <Badge variant={voter.hasVoted ? 'default' : 'outline'}>
                          {voter.hasVoted ? 'Voted' : 'Not Voted'}
                        </Badge>
                      </div>
                    </div>
                  ))}
                  
                  {voters.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      No registered voters yet
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="blockchain" className="space-y-6">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Blockchain Transactions
                </CardTitle>
                <p className="text-muted-foreground">Immutable voting records on the blockchain</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {blockchainTransactions.map((tx) => (
                    <div key={tx.hash} className="flex items-center justify-between p-4 rounded-lg border">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-blockchain flex items-center justify-center">
                          <Shield className="w-5 h-5 text-primary-foreground" />
                        </div>
                        <div>
                          <h4 className="font-mono text-sm">{formatBlockchainHash(tx.hash)}</h4>
                          <p className="text-xs text-muted-foreground">
                            Block #{tx.block} • Gas: {tx.gasUsed.toLocaleString()}
                          </p>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-vote-verified" />
                          <span className="text-sm font-medium">Confirmed</span>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {tx.timestamp.toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  ))}
                  
                  {blockchainTransactions.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      No blockchain transactions yet
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};