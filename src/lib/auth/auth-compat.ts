// Compatibility layer for auth
// This file provides backward compatibility for code that was using the direct auth import
import { auth as wrappedAuth } from './auth-wrapper';

export const auth = wrappedAuth;