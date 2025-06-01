import React from 'react';

interface ToggleProps {
  pressed?: boolean;
  defaultPressed?: boolean;
  onPressedChange?: (pressed: boolean) => void;
  children: React.ReactNode;
  className?: string;
}

export function Toggle({
  pressed,
  defaultPressed = false,
  onPressedChange,
  children,
  className = '',
}: ToggleProps) {
  const [isPressed, setIsPressed] = React.useState(defaultPressed);
  
  const handleClick = () => {
    const newState = !isPressed;
    setIsPressed(newState);
    onPressedChange?.(newState);
  };
  
  const buttonPressed = pressed !== undefined ? pressed : isPressed;
  
  return (
    <button
      type="button"
      aria-pressed={buttonPressed}
      data-state={buttonPressed ? 'on' : 'off'}
      className={`inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors 
        data-[state=on]:bg-blue-100 data-[state=on]:text-blue-900
        hover:bg-gray-100 hover:text-gray-900
        focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500
        disabled:pointer-events-none disabled:opacity-50
        ${className}`}
      onClick={handleClick}
    >
      {children}
    </button>
  );
}

export default Toggle;
