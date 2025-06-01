// Security utilities for EdPsych-AI-Education-Platform
import { useState, useEffect } from 'react';
import { hash, compare } from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { AES, enc } from 'crypto-js';

/**
 * Utility for securely hashing passwords
 * @param {string} password - Plain text password
 * @returns {Promise<string>} - Hashed password
 */
export const hashPassword = async (password: string): Promise<string> => {
  return await hash(password, 12);
};

/**
 * Utility for comparing passwords with hashed versions
 * @param {string} password - Plain text password
 * @param {string} hashedPassword - Hashed password
 * @returns {Promise<boolean>} - Whether passwords match
 */
export const comparePasswords = async (
  password: string,
  hashedPassword: string
): Promise<boolean> => {
  return await compare(password, hashedPassword);
};

/**
 * Utility for generating secure tokens
 * @param {number} length - Token length
 * @returns {string} - Secure token
 */
export const generateSecureToken = (length: number = 32): string => {
  const uuid = uuidv4();
  const base64 = Buffer.from(uuid).toString('base64');
  return base64.replace(/[^a-zA-Z0-9]/g, '').substring(0, length);
};

/**
 * Utility for encrypting sensitive data
 * @param {any} data - Data to encrypt
 * @param {string} secretKey - Secret key for encryption
 * @returns {string} - Encrypted data
 */
export const encryptData = (data, secretKey: string): string => {
  const jsonString = JSON.stringify(data);
  return AES.encrypt(jsonString, secretKey).toString();
};

/**
 * Utility for decrypting sensitive data
 * @param {string} encryptedData - Encrypted data
 * @param {string} secretKey - Secret key for decryption
 * @returns {any} - Decrypted data
 */
export const decryptData = (encryptedData: string, secretKey: string) => {
  try {
    const bytes = AES.decrypt(encryptedData, secretKey);
    const decryptedString = bytes.toString(enc.Utf8);
    return JSON.parse(decryptedString);
  } catch (error) {
    console.error('Failed to decrypt data:', error);
    return null;
  }
};

/**
 * Custom hook for implementing CSRF protection
 * @returns {Object} - CSRF token and validation function
 */
export const useCsrfProtection = () => {
  const [csrfToken, setCsrfToken] = useState<string>('');

  useEffect(() => {
    // Generate a new CSRF token on component mount
    setCsrfToken(generateSecureToken());
  }, []);

  const validateCsrfToken = (token: string): boolean => {
    return token === csrfToken;
  };

  return { csrfToken, validateCsrfToken };
};

/**
 * Utility for sanitizing user input to prevent XSS attacks
 * @param {string} input - User input
 * @returns {string} - Sanitized input
 */
export const sanitizeInput = (input: string): string => {
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
};

/**
 * Utility for validating and sanitizing URLs
 * @param {string} url - URL to validate
 * @returns {string|null} - Sanitized URL or null if invalid
 */
export const sanitizeUrl = (url: string): string | null => {
  // Check if URL is valid
  try {
    const parsedUrl = new URL(url);
    // Only allow http and https protocols
    if (parsedUrl.protocol !== 'http:' && parsedUrl.protocol !== 'https:') {
      return null;
    }
    return parsedUrl.toString();
  } catch (error) {
    return null;
  }
};

/**
 * Utility for implementing rate limiting
 * @param {number} maxRequests - Maximum number of requests
 * @param {number} timeWindow - Time window in milliseconds
 * @returns {Function} - Rate limiting function
 */
export const createRateLimiter = (maxRequests: number, timeWindow: number) => {
  const requests = new Map<string, number[]>();

  return (identifier: string): boolean => {
    const now = Date.now();
    const userRequests = requests.get(identifier) || [];
    
    // Filter out requests outside the time window
    const recentRequests = userRequests.filter(time => time > now - timeWindow);
    
    // Check if user has exceeded the rate limit
    if (recentRequests.length >= maxRequests) {
      return false;
    }
    
    // Add current request to the list
    recentRequests.push(now);
    requests.set(identifier, recentRequests);
    
    return true;
  };
};

/**
 * Utility for implementing content security policy
 * @returns {Object} - CSP headers
 */
export const getContentSecurityPolicy = () => {
  return {
    'Content-Security-Policy': [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "img-src 'self' data: https://res.cloudinary.com",
      "font-src 'self' https://fonts.gstatic.com",
      "connect-src 'self' https://api.heygen.com https://api.openai.com",
      "media-src 'self' https://res.cloudinary.com",
      "object-src 'none'",
      "frame-src 'self'",
      "base-uri 'self'",
      "form-action 'self'",
      "frame-ancestors 'none'",
      "upgrade-insecure-requests"
    ].join('; ')
  };
};

/**
 * Utility for implementing secure storage
 */
export const secureStorage = {
  setItem: (key: string, value, secretKey: string): void => {
    const encryptedValue = encryptData(value, secretKey);
    localStorage.setItem(key, encryptedValue);
  },
  
  getItem: (key: string, secretKey: string) => {
    const encryptedValue = localStorage.getItem(key);
    if (!encryptedValue) return null;
    return decryptData(encryptedValue, secretKey);
  },
  
  removeItem: (key: string): void => {
    localStorage.removeItem(key);
  },
  
  clear: (): void => {
    localStorage.clear();
  }
};

/**
 * Utility for implementing secure cookies
 */
export const secureCookies = {
  set: (name: string, value: string, options = {}): void => {
    const defaultOptions = {
      path: '/',
      secure: true,
      sameSite: 'strict',
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 // 1 week
    };
    
    const cookieOptions = { ...defaultOptions, ...options };
    let cookieString = `${name}=${encodeURIComponent(value)}`;
    
    Object.entries(cookieOptions).forEach(([key, value]) => {
      if (key === 'maxAge') {
        cookieString += `; max-age=${value}`;
      } else if (value === true) {
        cookieString += `; ${key}`;
      } else if (value !== false) {
        cookieString += `; ${key}=${value}`;
      }
    });
    
    document.cookie = cookieString;
  },
  
  get: (name: string): string | null => {
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      if (cookie.startsWith(name + '=')) {
        return decodeURIComponent(cookie.substring(name.length + 1));
      }
    }
    return null;
  },
  
  remove: (name: string): void => {
    document.cookie = `${name}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; secure; sameSite=strict`;
  }
};

/**
 * Utility for implementing secure headers
 * @returns {Object} - Secure headers
 */
export const getSecureHeaders = () => {
  return {
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=(self), interest-cohort=()',
    'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
    ...getContentSecurityPolicy()
  };
};

/**
 * Utility for implementing secure file uploads
 * @param {File} file - File to validate
 * @param {Array<string>} allowedTypes - Allowed MIME types
 * @param {number} maxSize - Maximum file size in bytes
 * @returns {boolean} - Whether file is valid
 */
export const validateSecureFileUpload = (
  file: File,
  allowedTypes: any[],
  maxSize: number
): boolean => {
  // Check file type
  if (!allowedTypes.includes(file.type)) {
    console.error(`Invalid file type: ${file.type}. Allowed types: ${allowedTypes.join(', ')}`);
    return false;
  }
  
  // Check file size
  if (file.size > maxSize) {
    console.error(`File too large: ${file.size} bytes. Maximum size: ${maxSize} bytes`);
    return false;
  }
  
  return true;
};

/**
 * Utility for implementing secure API requests
 * @param {string} url - API endpoint
 * @param {Object} options - Request options
 * @param {string} csrfToken - CSRF token
 * @returns {Promise<any>} - API response
 */
export const secureApiRequest = async (
  url: string,
  options: RequestInit = {},
  csrfToken?: string
): Promise<any> => {
  const defaultOptions: RequestInit = {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...(csrfToken ? { 'X-CSRF-Token': csrfToken } : {})
    }
  };
  
  const requestOptions = {
    ...defaultOptions,
    ...options,
    headers: {
      ...defaultOptions.headers,
      ...(options.headers || {})
    }
  };
  
  try {
    const response = await fetch(url, requestOptions);
    
    if (!response.ok) {
      throw new Error(`API request failed: ${response.status} ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Secure API request failed:', error);
    throw error;
  }
};
