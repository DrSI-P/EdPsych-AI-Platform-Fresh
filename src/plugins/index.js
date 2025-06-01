/**
 * EdPsych-AI-Education-Platform Plugins Directory
 * 
 * This directory contains plugin modules that can be dynamically loaded by the platform.
 * Each plugin should be in its own subdirectory with a consistent structure.
 * 
 * This file serves as a placeholder to ensure the plugins directory is included in the build.
 */

// Export a dummy plugin registry to satisfy imports during build
export default {
  getPlugins: () => [],
  registerPlugin: () => false,
  loadPlugin: () => null
};
