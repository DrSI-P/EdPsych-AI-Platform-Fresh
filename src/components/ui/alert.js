import React from 'react';

export function Alert({ variant = 'default', title, children }) {
  const variantClasses = {
    default: 'bg-gray-100 border-gray-300 text-gray-800',
    destructive: 'bg-red-100 border-red-300 text-red-800',
    success: 'bg-green-100 border-green-300 text-green-800',
    warning: 'bg-yellow-100 border-yellow-300 text-yellow-800',
    info: 'bg-blue-100 border-blue-300 text-blue-800',
  };

  return (
    <div className={`p-4 mb-4 border rounded-md ${variantClasses[variant]}`}>
      {title && <h5 className="font-medium mb-2">{title}</h5>}
      <div>{children}</div>
    </div>
  );
}

export function AlertTitle({ children }) {
  return <h5 className="font-medium mb-2">{children}</h5>;
}

export function AlertDescription({ children }) {
  return <div className="text-sm">{children}</div>;
}

export default Alert;
