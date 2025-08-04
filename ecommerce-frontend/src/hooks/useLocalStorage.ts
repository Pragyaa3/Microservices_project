'use client';
import { useState, useEffect } from 'react';

// Note: This hook is for demonstration. In the Claude.ai environment,
// localStorage is not available, so this will use memory storage instead.

export function useLocalStorage<T>(key: string, initialValue: T) {
  // In-memory storage for Claude.ai environment
  const [storedValue, setStoredValue] = useState<T>(initialValue);

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      
      // In a real environment, you would use:
      // if (typeof window !== 'undefined') {
      //   window.localStorage.setItem(key, JSON.stringify(valueToStore));
      // }
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  };

  return [storedValue, setValue] as const;
}