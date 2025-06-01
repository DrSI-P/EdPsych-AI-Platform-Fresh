'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Calendar, Clock, MapPin, Users } from 'lucide-react';
import { format } from 'date-fns';
import { PeerSession } from '@/lib/collaborative-learning/types';

/**
 * Peer Session Card Component
 * 
 * Displays information about a peer learning session
 */
export function PeerSessionCard({ session, currentUserId, onJoinSession }) {
  // Format date and times
  const sessionDate = format(new Date(session.date), 'PPP');
  
  // Check if current user is the host
  const isHost = session.hostId === currentUserId;
  
  // Check if current user is a participant
  const isParticipant = session.participants.some(p => p.userId === currentUserId);
  
  // Check if session is full
  const isFull = session.participants.length >= session.maxParticipants;
  
  // Get session status color
  const getStatusColor = () => {
    switch (session.status) {
      case 'scheduled':
        return 'bg-blue-500';
      case 'in_progress':
        return 'bg-green-500';
      case 'completed':
        return 'bg-gray-500';
      case 'cancelled':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };
  
  // Handle join session
  const handleJoin = () => {
    if (onJoinSession && !isParticipant && !isFull) {
      onJoinSession(session.id);
    }
  };
  
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Session status indicator */}
          <div className="flex-shrink-0 flex flex-col items-center">
            <div className={`w-3 h-3 rounded-full ${getStatusColor()} mb-2`}></div>
            <Badge>{session.status.replace('_', ' ')}</Badge>
          </div>
          
          {/* Session content */}
          <div className="flex-1">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 mb-2">
              <h3 className="font-semibold text-lg">{session.title}</h3>
              <Badge variant="outline">{session.subject}</Badge>
            </div>
            
            <p className="text-muted-foreground mb-4">
              {session.description}
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4">
              <div className="flex items-center text-sm">
                <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                <span>{sessionDate}</span>
              </div>
              
              <div className="flex items-center text-sm">
                <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                <span>{session.startTime} - {session.endTime}</span>
              </div>
              
              <div className="flex items-center text-sm">
                <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                <span>{session.location}</span>
              </div>
              
              <div className="flex items-center text-sm">
                <Users className="h-4 w-4 mr-2 text-muted-foreground" />
                <span>{session.participants.length} / {session.maxParticipants} participants</span>
              </div>
            </div>
            
            <div className="flex flex-wrap items-center justify-between">
              <div className="flex items-center">
                <span className="text-xs text-muted-foreground mr-2">Hosted by:</span>
                <Avatar className="h-6 w-6 mr-1">
                  <AvatarImage src={`/avatars/${session.hostId}.png`} alt="Host avatar" />
                  <AvatarFallback>{session.hostId.substring(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <span className="text-xs">
                  {isHost ? 'You' : `User ${session.hostId.substring(0, 4)}`}
                </span>
              </div>
              
              <div className="mt-2 sm:mt-0">
                {isHost ? (
                  <Button variant="outline" size="sm">
                    Manage Session
                  </Button>
                ) : isParticipant ? (
                  <Button variant="outline" size="sm">
                    View Details
                  </Button>
                ) : isFull ? (
                  <Button variant="outline" size="sm" disabled>
                    Session Full
                  </Button>
                ) : (
                  <Button size="sm" onClick={handleJoin}>
                    Join Session
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
