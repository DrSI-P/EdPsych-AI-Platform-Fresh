'use client';

import React from 'react';
import Image from 'next/image';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Linkedin, Mail, BookOpen } from 'lucide-react';

interface SocialLinks {
  linkedin?: string;
  email?: string;
  publications?: string;
  [key: string]: string | undefined;
}

interface TeamMemberProps {
  name: string;
  title: string;
  qualifications: string;
  bio: string;
  imageSrc: string;
  specialties: any[];
  imagePosition?: string;
}

export function TeamMember({
  name,
  title,
  qualifications,
  bio,
  imageSrc,
  specialties,
  imagePosition = 'center 20%'
}: TeamMemberProps) {
  return (
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg">
      <div className="relative h-80 w-full overflow-hidden bg-gray-100">
        <Image
          src={imageSrc}
          alt={name}
          fill
          className="object-cover object-center transition-transform duration-500 hover:scale-105"
          style={{ 
            objectPosition: imagePosition,
            objectFit: 'cover'
          }}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>
      <CardHeader>
        <div className="space-y-1">
          <h3 className="text-2xl font-bold">{name}</h3>
          <p className="text-muted-foreground">{title}</p>
          <p className="text-sm text-muted-foreground">{qualifications}</p>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4">{bio}</p>
        <div className="flex flex-wrap gap-2 mt-4">
          {specialties.map((specialty, index) => (
            <Badge key={index} variant="outline" className="bg-primary/10">
              {specialty}
            </Badge>
          ))}
        </div>
      </CardContent>
      <CardFooter className="flex justify-start gap-2 border-t pt-4">
        <div className="text-sm text-muted-foreground">
          Connect with {name.split(' ')[0]} via the platform
        </div>
      </CardFooter>
    </Card>
  );
}
