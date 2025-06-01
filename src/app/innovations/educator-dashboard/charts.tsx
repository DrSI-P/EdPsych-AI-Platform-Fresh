'use client';

import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line
} from 'recharts';

// Props for student progress chart
interface StudentProgressChartProps {
  studentData: any[];
}

// Props for attendance chart
interface AttendanceChartProps {
  attendanceData: any[];
}

// Student Progress Chart Component
export const StudentProgressChart: React.FC<StudentProgressChartProps> = ({ studentData }) => {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart
        data={studentData}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="previous" fill="#94a3b8" name="Previous Term" />
        <Bar dataKey="current" fill="#3b82f6" name="Current Level" />
        <Bar dataKey="target" fill="#10b981" name="Target Level" />
      </BarChart>
    </ResponsiveContainer>
  );
};

// Attendance Chart Component
export const AttendanceChart: React.FC<AttendanceChartProps> = ({ attendanceData }) => {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <LineChart
        data={attendanceData}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" />
        <YAxis domain={[90, 100]} />
        <Tooltip />
        <Legend />
        <Line
          type="monotone"
          dataKey="attendance"
          stroke="#8884d8"
          activeDot={{ r: 8 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

// Default export for dynamic import
const Charts = {
  StudentProgressChart,
  AttendanceChart
};

export default Charts;