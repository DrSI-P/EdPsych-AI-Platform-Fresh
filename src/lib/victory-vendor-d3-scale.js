// This file provides a compatibility layer for Recharts to use our custom implementations
// instead of the missing exports from victory-vendor/d3-scale

// Import our compatibility implementations
import * as compatibilityExports from './victory-vendor-compatibility';

// Mock the victory-vendor/d3-scale module
module.exports = {
  ...compatibilityExports
};
