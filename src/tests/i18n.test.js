// @ts-check
import { describe, it, expect, beforeAll } from 'vitest';
import fs from 'fs';
import path from 'path';

// Define supported locales and namespaces
const SUPPORTED_LOCALES = ['en-GB', 'fr', 'es', 'de', 'pl', 'ur'];
const NAMESPACES = ['common']; // Add more namespaces as they are created

/**
 * Helper function to get all keys from a nested object
 * @param {object} obj - The object to extract keys from
 * @param {string} prefix - The prefix for nested keys
 * @returns {string[]} Array of all keys in dot notation
 */
function getAllKeys(obj, prefix = '') {
  return Object.keys(obj).reduce((keys, key) => {
    const newPrefix = prefix ? `${prefix}.${key}` : key;
    if (typeof obj[key] === 'object' && obj[key] !== null) {
      return [...keys, ...getAllKeys(obj[key], newPrefix)];
    }
    return [...keys, newPrefix];
  }, []);
}

/**
 * Helper function to get a nested value from an object using a dot-notation path
 * @param {object} obj - The object to extract value from
 * @param {string} path - The path in dot notation
 * @returns {*} The value at the specified path
 */
function getNestedValue(obj, path) {
  return path.split('.').reduce((o, key) => (o && o[key] !== undefined ? o[key] : undefined), obj);
}

describe('i18n Translation Tests', () => {
  // Store loaded translations
  /** @type {Record<string, Record<string, object>>} */
  const translations = {};

  // Load all translation files before tests
  beforeAll(() => {
    for (const locale of SUPPORTED_LOCALES) {
      translations[locale] = {};
      for (const namespace of NAMESPACES) {
        const filePath = path.join(process.cwd(), 'public', 'locales', locale, `${namespace}.json`);
        if (fs.existsSync(filePath)) {
          const content = fs.readFileSync(filePath, 'utf8');
          translations[locale][namespace] = JSON.parse(content);
        } else {
          // Using console.warn for test debugging is acceptable
          // eslint-disable-next-line no-console
          console.warn(`Translation file not found: ${filePath}`);
        }
      }
    }
  });

  // Test that all locales have the required namespaces
  it('should have all required namespaces for each locale', () => {
    for (const locale of SUPPORTED_LOCALES) {
      for (const namespace of NAMESPACES) {
        expect(translations[locale][namespace]).toBeDefined();
      }
    }
  });

  // Test that all keys in the base locale (en-GB) exist in other locales
  it('should have all base locale keys in other locales', () => {
    for (const namespace of NAMESPACES) {
      const baseLocale = 'en-GB';
      const baseKeys = getAllKeys(translations[baseLocale][namespace]);
      
      for (const locale of SUPPORTED_LOCALES.filter(l => l !== baseLocale)) {
        // This variable is used for debugging purposes if needed
        // eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
        const localeKeys = getAllKeys(translations[locale][namespace]);
        
        for (const key of baseKeys) {
          const baseValue = getNestedValue(translations[baseLocale][namespace], key);
          const localeValue = getNestedValue(translations[locale][namespace], key);
          
          expect(localeValue).toBeDefined();
          expect(typeof localeValue).toBe(typeof baseValue);
        }
      }
    }
  });

  // Test that no translation values are empty
  it('should not have empty translation values', () => {
    for (const locale of SUPPORTED_LOCALES) {
      for (const namespace of NAMESPACES) {
        const keys = getAllKeys(translations[locale][namespace]);
        
        for (const key of keys) {
          const value = getNestedValue(translations[locale][namespace], key);
          expect(value).not.toBe('');
        }
      }
    }
  });

  // Test that interpolation placeholders are consistent across translations
  it('should have consistent interpolation placeholders', () => {
    for (const namespace of NAMESPACES) {
      const baseLocale = 'en-GB';
      const baseKeys = getAllKeys(translations[baseLocale][namespace]);
      
      for (const key of baseKeys) {
        const baseValue = getNestedValue(translations[baseLocale][namespace], key);
        
        // Skip if not a string or doesn't contain interpolation
        if (typeof baseValue !== 'string' || !baseValue.includes('{{')) {
          continue;
        }
        
        // Extract interpolation placeholders from base value
        const basePlaceholders = [];
        const regex = /\{\{([^}]+)\}\}/g;
        let match;
        
        while ((match = regex.exec(baseValue)) !== null) {
          basePlaceholders.push(match[1]);
        }
        
        // Check that other locales have the same placeholders
        for (const locale of SUPPORTED_LOCALES.filter(l => l !== baseLocale)) {
          const localeValue = getNestedValue(translations[locale][namespace], key);
          
          if (typeof localeValue === 'string') {
            for (const placeholder of basePlaceholders) {
              expect(localeValue).toContain(`{{${placeholder}}}`);
            }
          }
        }
      }
    }
  });

  // Test for UK-specific educational terminology
  it('should have UK educational terminology in all locales', () => {
    const ukTerminologyPath = 'uk.education';
    
    for (const locale of SUPPORTED_LOCALES) {
      const ukTerminology = getNestedValue(translations[locale].common, ukTerminologyPath);
      expect(ukTerminology).toBeDefined();
      expect(ukTerminology.keyStages).toBeDefined();
      expect(ukTerminology.schoolTypes).toBeDefined();
    }
  });
});
