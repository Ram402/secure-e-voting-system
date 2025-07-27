import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { WebcamCapture } from './WebcamCapture';
import { useVoting } from '@/contexts/VotingContext';
import { toast } from '@/hooks/use-toast';
import { LogIn, Shield, Camera, UserCheck, Crown } from 'lucide-react';

interface VoterLoginProps {
  onRegisterClick: () => void;
}

export const VoterLogin: React.FC<VoterLoginProps> = ({ onRegisterClick }) => {
  const [voterID, setVoterID] = useState('');
  const [loginMethod, setLoginMethod] = useState<'id' | 'face'>('id');
  const [isVerifying, setIsVerifying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const { login, verifyFace } = useVoting();

  const handleIDLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!voterID.trim()) {
      toast({
        title: "Missing Voter ID",
        description: "Please enter your voter ID.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      const success = await login(voterID.trim(), 'voter');
      if (success) {
        toast({
          title: "Login Successful",
          description: "Welcome to the secure voting system!",
          variant: "default"
        });
      } else {
        toast({
          title: "Login Failed",
          description: "Invalid voter ID or voter not verified.",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Login Error",
        description: "An error occurred during login.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAdminLogin = async () => {
    setIsLoading(true);
    try {
      const success = await login('admin', 'admin');
      if (success) {
        toast({
          title: "Admin Login Successful",
          description: "Welcome to the admin dashboard!",
          variant: "default"
        });
      }
    } catch (error) {
      toast({
        title: "Admin Login Failed",
        description: "Invalid admin credentials.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleFaceLogin = async (faceImage: string) => {
    if (!voterID.trim()) {
      toast({
        title: "Missing Voter ID",
        description: "Please enter your voter ID first.",
        variant: "destructive"
      });
      return;
    }

    setIsVerifying(true);
    try {
      const isVerified = await verifyFace(voterID.trim(), faceImage);
      if (isVerified) {
        const success = await login(voterID.trim(), 'voter');
        if (success) {
          toast({
            title: "Biometric Login Successful",
            description: "Face verification completed. Welcome!",
            variant: "default"
          });
        }
      } else {
        toast({
          title: "Face Verification Failed",
          description: "Face recognition failed. Please try again.",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Verification Error",
        description: "An error occurred during face verification.",
        variant: "destructive"
      });
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-secure flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        <Card className="shadow-secure">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-primary-foreground" />
            </div>
            <CardTitle className="text-2xl font-bold">Secure E-Voting System</CardTitle>
            <p className="text-muted-foreground">
              Blockchain-powered voting with biometric authentication
            </p>
          </CardHeader>
          
          <CardContent>
            <Tabs value={loginMethod} onValueChange={(v) => setLoginMethod(v as 'id' | 'face')}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="id" className="flex items-center gap-2">
                  <UserCheck className="w-4 h-4" />
                  Voter ID
                </TabsTrigger>
                <TabsTrigger value="face" className="flex items-center gap-2">
                  <Camera className="w-4 h-4" />
                  Biometric
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="id" className="space-y-4 mt-6">
                <form onSubmit={handleIDLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="voterID">Voter ID</Label>
                    <Input
                      id="voterID"
                      value={voterID}
                      onChange={(e) => setVoterID(e.target.value)}
                      placeholder="Enter your voter ID"
                      required
                    />
                  </div>
                  
                  <Button 
                    type="submit" 
                    variant="secure" 
                    className="w-full"
                    disabled={isLoading}
                  >
                    <LogIn className="w-4 h-4 mr-2" />
                    {isLoading ? 'Logging in...' : 'Login with Voter ID'}
                  </Button>
                </form>
              </TabsContent>
              
              <TabsContent value="face" className="space-y-4 mt-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="voterIDFace">Voter ID</Label>
                    <Input
                      id="voterIDFace"
                      value={voterID}
                      onChange={(e) => setVoterID(e.target.value)}
                      placeholder="Enter your voter ID"
                      required
                    />
                  </div>
                  
                  <WebcamCapture
                    onCapture={handleFaceLogin}
                    isCapturing={isVerifying}
                    title="Face Authentication"
                  />
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <div className="flex flex-col gap-3">
          <Button 
            variant="outline" 
            onClick={onRegisterClick}
            className="w-full"
          >
            New Voter? Register Here
          </Button>
          
          <Button 
            variant="secondary" 
            onClick={handleAdminLogin}
            className="w-full"
            disabled={isLoading}
          >
            <Crown className="w-4 h-4 mr-2" />
            Admin Access
          </Button>
        </div>

        <div className="bg-card/80 backdrop-blur-sm rounded-lg p-4 text-center">
          <h3 className="font-semibold text-sm mb-2">🔐 Security Features</h3>
          <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
            <div>✓ Face Recognition (95% accuracy)</div>
            <div>✓ Blockchain Security</div>
            <div>✓ End-to-End Encryption</div>
            <div>✓ Immutable Vote Records</div>
          </div>
        </div>
      </div>
    </div>
  );
};