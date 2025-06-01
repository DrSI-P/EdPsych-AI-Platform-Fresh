/**
 * Global Polyfills for Server-Side Rendering
 * 
 * This file provides comprehensive polyfills for browser globals
 * that are needed during server-side rendering in Next.js
 */

// Only run this code on the server side
if (typeof window === 'undefined') {
  console.log('Applying global polyfills for server-side rendering...');
  
  // Create a global window object if it doesn't exist
  global.window = {
    // Basic window properties
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
    },
    
    // Add other window properties
    document: {
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
    },
    
    // Storage APIs
    localStorage: {
      getItem: () => null,
      setItem: () => {},
      removeItem: () => {},
      clear: () => {},
      key: () => null,
      length: 0
    },
    sessionStorage: {
      getItem: () => null,
      setItem: () => {},
      removeItem: () => {},
      clear: () => {},
      key: () => null,
      length: 0
    },
    
    // Navigator
    navigator: {
      userAgent: 'node',
      clipboard: {
        writeText: () => Promise.resolve(),
        readText: () => Promise.resolve('')
      },
      language: 'en-US',
      languages: ['en-US', 'en'],
      onLine: true,
      platform: 'server'
    },
    
    // Common window methods
    addEventListener: () => {},
    removeEventListener: () => {},
    setTimeout: global.setTimeout,
    clearTimeout: global.clearTimeout,
    setInterval: global.setInterval,
    clearInterval: global.clearInterval,
    
    // Dummy fetch implementation
    fetch: () => Promise.resolve({
      ok: true,
      json: () => Promise.resolve({}),
      text: () => Promise.resolve(''),
      blob: () => Promise.resolve(new Blob()),
      arrayBuffer: () => Promise.resolve(new ArrayBuffer(0)),
      headers: new Map()
    })
  };
  
  // Make window reference itself
  global.window.window = global.window;
  
  // Add self as an alias for window
  global.self = global.window;
  
  console.log('Global polyfills applied successfully');
}