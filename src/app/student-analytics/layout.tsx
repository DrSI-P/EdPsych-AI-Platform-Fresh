"use client";

import React from "react";

export default function StudentAnalyticsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      {/* AI Avatar Video Placeholder - Layout Level */}
      <div className="bg-muted/30 border-b p-4 mb-4">
        <div className="container mx-auto flex items-center gap-4">
          <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-primary"
            >
              <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"></path>
              <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
              <line x1="12" x2="12" y1="19" y2="22"></line>
            </svg>
          </div>
          <div>
            <h2 className="text-lg font-medium">Student Analytics Assistant</h2>
            <p className="text-sm text-muted-foreground">
              I can help you understand your progress data and suggest personalized learning strategies
            </p>
          </div>
        </div>
      </div>
      {children}
    </div>
  );
}
