// Fix for React import in AvatarProvider
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

// Add React import to fix the useQuickAvatar hook
const React = require('react');

