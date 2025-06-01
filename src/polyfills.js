/**
 * Enhanced polyfills for browser globals in Node.js environment
 *
 * This file provides robust polyfills for browser-specific globals
 * that might be used by dependencies but are not available in Node.js
 *
 * These polyfills are critical for server-side rendering in Next.js
 */

// Console message to track polyfill loading
console.log('Loading server-side polyfills...');

// Create a shared memory store for storage polyfills
const memoryStore = {
  localStorage: {},
  sessionStorage: {}
};

// Polyfill for 'self' global variable
if (typeof global.self === 'undefined') {
  Object.defineProperty(global, 'self', {
    value: global,
    writable: false,
    configurable: false
  });
}

// Polyfill for 'window' global variable
if (typeof global.window === 'undefined') {
  // Create a window object with location property
  const windowPolyfill = {
    ...global,
    location: {
      protocol: 'https:',
      host: 'edpsychconnect.com',
      hostname: 'edpsychconnect.com',
      port: '',
      pathname: '/',
      search: '',
      hash: '',
      href: 'https://edpsychconnect.com/',
      origin: 'https://edpsychconnect.com',
      assign: (url) => console.log(`[Polyfill] window.location.assign: ${url}`),
      replace: (url) => console.log(`[Polyfill] window.location.replace: ${url}`),
      reload: () => console.log('[Polyfill] window.location.reload'),
      toString: () => 'https://edpsychconnect.com/'
    }
  };
  
  Object.defineProperty(global, 'window', {
    value: windowPolyfill,
    writable: false,
    configurable: false
  });
}

// Polyfill for 'document' global variable
if (typeof global.document === 'undefined') {
  const documentPolyfill = {
    createElement: () => ({}),
    getElementsByTagName: () => [],
    querySelector: () => null,
    querySelectorAll: () => [],
    getElementById: () => null,
    documentElement: {
      style: {},
      clientWidth: 1280,
      clientHeight: 800
    },
    head: { appendChild: () => {} },
    body: { appendChild: () => {} }
  };
  
  Object.defineProperty(global, 'document', {
    value: documentPolyfill,
    writable: false,
    configurable: false
  });
}

// Polyfill for 'localStorage'
if (typeof global.localStorage === 'undefined') {
  const localStoragePolyfill = {
    _data: memoryStore.localStorage,
    getItem(key) {
      return this._data[key] || null;
    },
    setItem(key, value) {
      this._data[key] = value.toString();
    },
    removeItem(key) {
      delete this._data[key];
    },
    clear() {
      this._data = {};
    },
    key(index) {
      const keys = Object.keys(this._data);
      return keys[index] || null;
    },
    get length() {
      return Object.keys(this._data).length;
    }
  };
  
  Object.defineProperty(global, 'localStorage', {
    value: localStoragePolyfill,
    writable: false,
    configurable: false
  });
}

// Polyfill for 'sessionStorage'
if (typeof global.sessionStorage === 'undefined') {
  const sessionStoragePolyfill = {
    _data: memoryStore.sessionStorage,
    getItem(key) {
      return this._data[key] || null;
    },
    setItem(key, value) {
      this._data[key] = value.toString();
    },
    removeItem(key) {
      delete this._data[key];
    },
    clear() {
      this._data = {};
    },
    key(index) {
      const keys = Object.keys(this._data);
      return keys[index] || null;
    },
    get length() {
      return Object.keys(this._data).length;
    }
  };
  
  Object.defineProperty(global, 'sessionStorage', {
    value: sessionStoragePolyfill,
    writable: false,
    configurable: false
  });
}

// Polyfill for 'navigator'
if (typeof global.navigator === 'undefined') {
  const navigatorPolyfill = {
    userAgent: 'node',
    clipboard: {
      writeText: () => Promise.resolve(),
      readText: () => Promise.resolve('')
    },
    language: 'en-US',
    languages: ['en-US', 'en'],
    onLine: true,
    platform: 'server'
  };
  
  Object.defineProperty(global, 'navigator', {
    value: navigatorPolyfill,
    writable: false,
    configurable: false
  });
}

// Console message to confirm polyfills are loaded
console.log('Server-side polyfills applied successfully');