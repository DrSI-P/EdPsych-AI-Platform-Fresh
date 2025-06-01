'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PlusCircle, Users, Clock, BookOpen } from 'lucide-react';
import { getUserPeerPartnerships } from '@/lib/collaborative-learning/api';
import { PeerLearningPartnership, PeerLearningStatus } from '@/lib/collaborative-learning/types';
import { CreatePartnershipDialog } from './create-partnership-dialog';
import { ScheduleSessionDialog } from './schedule-session-dialog';
import { PeerSessionCard } from './peer-session-card';

/**
 * Peer Learning Dashboard Component
 * 
 * Displays a user's peer learning partnerships, upcoming sessions,
 * and provides tools to create new partnerships and schedule sessions.
 */
export function PeerLearningDashboard() {
  const [partnerships, setPartnerships] = useState<PeerLearningPartnership[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showScheduleDialog, setShowScheduleDialog] = useState(false);
  const [selectedPartnership, setSelectedPartnership] = useState<string | null>(null);
  
  // Mock user ID - in a real implementation, this would come from authentication
  const userId = 'current-user-id';
  
  // Fetch user's peer learning partnerships
  useEffect(() => {
    const fetchPartnerships = async () => {
      try {
        setLoading(true);
        const data = await getUserPeerPartnerships(userId);
        setPartnerships(data);
        setError(null);
      } catch (err) {
        setError('Failed to load peer learning partnerships');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchPartnerships();
  }, [userId]);
  
  // Handle creating a new partnership
  const handleCreatePartnership = (newPartnership: PeerLearningPartnership) => {
    setPartnerships([...partnerships, newPartnership]);
    setShowCreateDialog(false);
  };
  
  // Handle scheduling a new session
  const handleScheduleSession = () => {
    // In a real implementation, this would update the partnerships state
    setShowScheduleDialog(false);
  };
  
  // Filter partnerships by role and status
  const tutorPartnerships = partnerships.filter(p => 
    p.tutorId === userId && p.status === PeerLearningStatus.ACTIVE
  );
  
  const tuteePartnerships = partnerships.filter(p => 
    p.tuteeId === userId && p.status === PeerLearningStatus.ACTIVE
  );
  
  // Get upcoming sessions across all partnerships
  const upcomingSessions = partnerships
    .flatMap(p => p.sessions)
    .filter(s => s.status === 'scheduled' && new Date(s.scheduledStart) > new Date())
    .sort((a, b) => new Date(a.scheduledStart).getTime() - new Date(b.scheduledStart).getTime())
    .slice(0, 5);
  
  return (
    <div className="space-y-8">
      {/* Header with actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">Peer Learning</h2>
          <p className="text-muted-foreground">Learn with and from your peers</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => setShowCreateDialog(true)}>
            <PlusCircle className="mr-2 h-4 w-4" />
            New Partnership
          </Button>
          <Button 
            variant="outline" 
            onClick={() => setShowScheduleDialog(true)}
            disabled={partnerships.length === 0}
          >
            <Clock className="mr-2 h-4 w-4" />
            Schedule Session
          </Button>
        </div>
      </div>
      
      {/* Error message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
          {error}
        </div>
      )}
      
      {/* Loading state */}
      {loading && (
        <div className="text-center py-8">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p>Loading peer learning data...</p>
        </div>
      )}
      
      {/* Main content */}
      {!loading && (
        <>
          {/* Upcoming sessions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Clock className="mr-2 h-5 w-5" />
                Upcoming Sessions
              </CardTitle>
              <CardDescription>
                Your scheduled peer learning sessions
              </CardDescription>
            </CardHeader>
            <CardContent>
              {upcomingSessions.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <p>No upcoming sessions scheduled</p>
                  <Button 
                    variant="link" 
                    onClick={() => setShowScheduleDialog(true)}
                    disabled={partnerships.length === 0}
                  >
                    Schedule a session
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {upcomingSessions.map(session => (
                    <PeerSessionCard key={session.id} session={session} />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
          
          {/* Partnerships */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="mr-2 h-5 w-5" />
                Your Partnerships
              </CardTitle>
              <CardDescription>
                Your active peer learning partnerships
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="all" className="w-full">
                <TabsList className="grid w-full grid-cols-3 mb-6">
                  <TabsTrigger value="all">All Partnerships</TabsTrigger>
                  <TabsTrigger value="tutor">As Tutor</TabsTrigger>
                  <TabsTrigger value="tutee">As Tutee</TabsTrigger>
                </TabsList>
                
                <TabsContent value="all">
                  {partnerships.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <p>You don't have any active partnerships</p>
                      <Button 
                        variant="link" 
                        onClick={() => setShowCreateDialog(true)}
                      >
                        Create a partnership
                      </Button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {partnerships.map(partnership => (
                        <PartnershipCard 
                          key={partnership.id} 
                          partnership={partnership} 
                          currentUserId={userId} 
                        />
                      ))}
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="tutor">
                  {tutorPartnerships.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <p>You're not tutoring anyone yet</p>
                      <Button 
                        variant="link" 
                        onClick={() => setShowCreateDialog(true)}
                      >
                        Offer tutoring
                      </Button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {tutorPartnerships.map(partnership => (
                        <PartnershipCard 
                          key={partnership.id} 
                          partnership={partnership} 
                          currentUserId={userId} 
                        />
                      ))}
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="tutee">
                  {tuteePartnerships.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <p>You're not being tutored by anyone yet</p>
                      <Button 
                        variant="link" 
                        onClick={() => setShowCreateDialog(true)}
                      >
                        Find a tutor
                      </Button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {tuteePartnerships.map(partnership => (
                        <PartnershipCard 
                          key={partnership.id} 
                          partnership={partnership} 
                          currentUserId={userId} 
                        />
                      ))}
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
          
          {/* Learning resources */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BookOpen className="mr-2 h-5 w-5" />
                Recommended Resources
              </CardTitle>
              <CardDescription>
                Resources to support your peer learning
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <h3 className="font-semibold mb-2">Effective Peer Teaching</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Learn strategies for explaining concepts clearly to peers
                    </p>
                    <Badge>Teaching Skills</Badge>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <h3 className="font-semibold mb-2">Active Listening</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Techniques to improve comprehension during peer learning
                    </p>
                    <Badge>Learning Skills</Badge>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <h3 className="font-semibold mb-2">Giving Constructive Feedback</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      How to provide helpful feedback to your peers
                    </p>
                    <Badge>Communication</Badge>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="link" className="ml-auto">
                View all resources
              </Button>
            </CardFooter>
          </Card>
        </>
      )}
      
      {/* Dialogs */}
      {showCreateDialog && (
        <CreatePartnershipDialog 
          open={showCreateDialog}
          onOpenChange={setShowCreateDialog}
          onCreatePartnership={handleCreatePartnership}
          userId={userId}
        />
      )}
      
      {showScheduleDialog && (
        <ScheduleSessionDialog 
          open={showScheduleDialog}
          onOpenChange={setShowScheduleDialog}
          onScheduleSession={handleScheduleSession}
          partnerships={partnerships}
          userId={userId}
        />
      )}
    </div>
  );
}

/**
 * Partnership Card Component
 * 
 * Displays information about a peer learning partnership
 */
function PartnershipCard({ partnership, currentUserId }) {
  const isTutor = partnership.tutorId === currentUserId;
  const partnerRole = isTutor ? 'Tutee' : 'Tutor';
  const partnerId = isTutor ? partnership.tuteeId : partnership.tutorId;
  
  // In a real implementation, we would fetch user details
  const partnerName = isTutor ? 'Alex Johnson' : 'Sam Taylor';
  const partnerInitials = isTutor ? 'AJ' : 'ST';
  
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center gap-4 mb-4">
          <Avatar className="h-12 w-12">
            <AvatarImage src={`/avatars/${partnerId}.png`} alt={partnerName} />
            <AvatarFallback>{partnerInitials}</AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-semibold">{partnerName}</h3>
            <p className="text-sm text-muted-foreground">{partnerRole}</p>
          </div>
          <Badge variant={isTutor ? 'default' : 'secondary'} className="ml-auto">
            {isTutor ? 'You are tutoring' : 'Tutoring you'}
          </Badge>
        </div>
        
        <div className="space-y-2 mb-4">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Subject:</span>
            <span className="font-medium">{partnership.subject}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Key Stage:</span>
            <span className="font-medium">{partnership.keyStage}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Sessions:</span>
            <span className="font-medium">{partnership.sessions?.length || 0} total</span>
          </div>
        </div>
        
        <div className="flex justify-between gap-2">
          <Button variant="outline" size="sm" className="flex-1">
            View Details
          </Button>
          <Button size="sm" className="flex-1">
            Schedule Session
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
