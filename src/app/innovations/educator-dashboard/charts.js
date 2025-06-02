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

// Optimized student progress chart component
export const StudentProgressChart = ({ studentData }) => {
  // Limit data processing to avoid stack overflow
  const limitedData = Array.isArray(studentData) ? studentData.slice(0, 10) : [];
  
  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart
        data={limitedData}
        margin={{
          top: 20,
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
        <Bar dataKey="previous" name="Previous" fill="#8884d8" />
        <Bar dataKey="current" name="Current" fill="#82ca9d" />
        <Bar dataKey="target" name="Target" fill="#ffc658" />
      </BarChart>
    </ResponsiveContainer>
  );
};

// Optimized attendance chart component
export const AttendanceChart = ({ attendanceData }) => {
  // Limit data processing to avoid stack overflow
  const limitedData = Array.isArray(attendanceData) ? attendanceData.slice(0, 12) : [];
  
  return (
    <ResponsiveContainer width="100%" height={350}>
      <LineChart
        data={limitedData}
        margin={{
          top: 20,
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
          name="Attendance %"
          stroke="#8884d8"
          activeDot={{ r: 8 }}
          strokeWidth={2}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};