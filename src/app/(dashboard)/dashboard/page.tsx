import React from 'react';
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Dashboard(): React.ReactNode {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-centre">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <div className="flex space-x-2">
          <Button variant="outline">Refresh</Button>
          <Button>New Project</Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Recent Assessments */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Recent Assessments</h2>
          <div className="space-y-3">
            <div className="p-3 border rounded-md hover:bg-grey-50">
              <div className="font-medium">Reading Comprehension</div>
              <div className="text-sm text-grey-500">Last updated: 2 days ago</div>
            </div>
            <div className="p-3 border rounded-md hover:bg-grey-50">
              <div className="font-medium">Mathematics Year 6</div>
              <div className="text-sm text-grey-500">Last updated: 5 days ago</div>
            </div>
          </div>
          <div className="mt-4">
            <Link href="/assessment" className="text-blue-600 hover:underline text-sm">
              View all assessments →
            </Link>
          </div>
        </div>
        
        {/* Recent Resources */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Recent Resources</h2>
          <div className="space-y-3">
            <div className="p-3 border rounded-md hover:bg-grey-50">
              <div className="font-medium">Science Curriculum Guide</div>
              <div className="text-sm text-grey-500">Added: 1 day ago</div>
            </div>
            <div className="p-3 border rounded-md hover:bg-grey-50">
              <div className="font-medium">History Timeline Interactive</div>
              <div className="text-sm text-grey-500">Added: 3 days ago</div>
            </div>
          </div>
          <div className="mt-4">
            <Link href="/resources" className="text-blue-600 hover:underline text-sm">
              View all resources →
            </Link>
          </div>
        </div>
        
        {/* Student Progress */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Student Progress</h2>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium">Reading</span>
                <span className="text-sm font-medium">75%</span>
              </div>
              <div className="w-full bg-grey-200 rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full" style={{ width: "75%" }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium">Mathematics</span>
                <span className="text-sm font-medium">60%</span>
              </div>
              <div className="w-full bg-grey-200 rounded-full h-2">
                <div className="bg-green-600 h-2 rounded-full" style={{ width: "60%" }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium">Science</span>
                <span className="text-sm font-medium">85%</span>
              </div>
              <div className="w-full bg-grey-200 rounded-full h-2">
                <div className="bg-purple-600 h-2 rounded-full" style={{ width: "85%" }}></div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Upcoming Activities */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Upcoming Activities</h2>
          <div className="space-y-3">
            <div className="p-3 border rounded-md hover:bg-grey-50">
              <div className="font-medium">Mathematics Assessment</div>
              <div className="text-sm text-grey-500">Due: Tomorrow</div>
            </div>
            <div className="p-3 border rounded-md hover:bg-grey-50">
              <div className="font-medium">Science Project Submission</div>
              <div className="text-sm text-grey-500">Due: 3 days</div>
            </div>
          </div>
        </div>
        
        {/* AI Recommendations */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">AI Recommendations</h2>
          <div className="space-y-3">
            <div className="p-3 border rounded-md hover:bg-grey-50 border-blue-100 bg-blue-50">
              <div className="font-medium">Reading Comprehension Practise</div>
              <div className="text-sm text-grey-600">Based on recent assessment results</div>
            </div>
            <div className="p-3 border rounded-md hover:bg-grey-50 border-blue-100 bg-blue-50">
              <div className="font-medium">Fractions Interactive Tutorial</div>
              <div className="text-sm text-grey-600">Recommended for your learning style</div>
            </div>
          </div>
        </div>
        
        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-3">
            <Button className="h-20 flex flex-col items-centre justify-centre">
              <span>New Assessment</span>
            </Button>
            <Button className="h-20 flex flex-col items-centre justify-centre">
              <span>Upload Resource</span>
            </Button>
            <Button className="h-20 flex flex-col items-centre justify-centre">
              <span>Student Reports</span>
            </Button>
            <Button className="h-20 flex flex-col items-centre justify-centre">
              <span>Immersive Learning</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
