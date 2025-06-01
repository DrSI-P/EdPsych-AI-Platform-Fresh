'use client';

import React from 'react';
import { 
  Chart as ChartJS, 
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  RadialLinearScale,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line, Bar, Pie, Radar, Scatter } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  RadialLinearScale,
  Title,
  Tooltip,
  Legend,
  Filler
);

// Define chart props interface
interface ChartProps {
  data: any;
  options?: any;
  height?: number;
  width?: number;
  className?: string;
}

// Line Chart Component
export function LineChart({ data, options, height, width, className }: ChartProps) {
  const defaultOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      tooltip: {
        mode: 'index' as const,
        intersect: false,
      }
    },
    scales: {
      y: {
        beginAtZero: true,
      }
    }
  };

  const mergedOptions = { ...defaultOptions, ...options };

  return (
    <div className={className} style={{ height: height || '100%', width: width || '100%' }}>
      <Line data={data} options={mergedOptions} />
    </div>
  );
}

// Bar Chart Component
export function BarChart({ data, options, height, width, className }: ChartProps) {
  const defaultOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      tooltip: {
        mode: 'index' as const,
        intersect: false,
      }
    },
    scales: {
      y: {
        beginAtZero: true,
      }
    }
  };

  const mergedOptions = { ...defaultOptions, ...options };

  return (
    <div className={className} style={{ height: height || '100%', width: width || '100%' }}>
      <Bar data={data} options={mergedOptions} />
    </div>
  );
}

// Pie Chart Component
export function PieChart({ data, options, height, width, className }: ChartProps) {
  const defaultOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      }
    }
  };

  const mergedOptions = { ...defaultOptions, ...options };

  return (
    <div className={className} style={{ height: height || '100%', width: width || '100%' }}>
      <Pie data={data} options={mergedOptions} />
    </div>
  );
}

// Radar Chart Component
export function RadarChart({ data, options, height, width, className }: ChartProps) {
  const defaultOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      }
    },
    scales: {
      r: {
        beginAtZero: true,
      }
    }
  };

  const mergedOptions = { ...defaultOptions, ...options };

  return (
    <div className={className} style={{ height: height || '100%', width: width || '100%' }}>
      <Radar data={data} options={mergedOptions} />
    </div>
  );
}

// Scatter Chart Component
export function ScatterChart({ data, options, height, width, className }: ChartProps) {
  const defaultOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      }
    },
    scales: {
      x: {
        beginAtZero: true,
      },
      y: {
        beginAtZero: true,
      }
    }
  };

  const mergedOptions = { ...defaultOptions, ...options };

  return (
    <div className={className} style={{ height: height || '100%', width: width || '100%' }}>
      <Scatter data={data} options={mergedOptions} />
    </div>
  );
}
