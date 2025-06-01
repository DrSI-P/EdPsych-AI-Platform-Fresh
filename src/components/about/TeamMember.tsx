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
  socialLinks: SocialLinks;
  specialties: any[];
}

export function TeamMember({
  name,
  title,
  qualifications,
  bio,
  imageSrc,
  socialLinks,
  specialties
}: TeamMemberProps) {
  return (
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg">
      <div className="relative h-64 w-full overflow-hidden">
        <Image
          src={imageSrc}
          alt={name}
          fill
          className="object-cover transition-transform duration-500 hover:scale-105"
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
        {socialLinks.linkedin && (
          <Button variant="ghost" size="icon" asChild>
            <a href={socialLinks.linkedin} target="_blank" rel="noopener noreferrer" aria-label={`${name}'s LinkedIn profile`}>
              <Linkedin className="h-5 w-5" />
            </a>
          </Button>
        )}
        {socialLinks.email && (
          <Button variant="ghost" size="icon" asChild>
            <a href={`mailto:${socialLinks.email}`} aria-label={`Email ${name}`}>
              <Mail className="h-5 w-5" />
            </a>
          </Button>
        )}
        {socialLinks.publications && (
          <Button variant="ghost" size="icon" asChild>
            <a href={socialLinks.publications} aria-label={`${name}'s publications`}>
              <BookOpen className="h-5 w-5" />
            </a>
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
