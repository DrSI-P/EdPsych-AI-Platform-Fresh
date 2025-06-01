import React from 'react';
import Avatar from './Avatar';
import AvatarVideoPlayer from './AvatarVideoPlayer';

// Export all components for easy imports
export {
  Avatar,
  AvatarVideoPlayer
};

// Main component that wraps everything
interface AvatarSystemProps {
  children: React.ReactNode;
}

const AvatarSystem: React.FC<AvatarSystemProps> = ({
  children
}) => {
  return (
    <div className="avatar-system">
      {children}
    </div>
  );
};

export default AvatarSystem;
