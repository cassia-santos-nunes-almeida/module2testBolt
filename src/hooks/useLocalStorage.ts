import { useState, useCallback } from 'react';

/**
 * Hook for safe localStorage access with error handling.
 * Falls back gracefully when localStorage is unavailable.
 */
export function useLocalStorage(key: string, initialValue = '') {
  const [value, setValue] = useState<string>(() => {
    try {
      return localStorage.getItem(key) || initialValue;
    } catch {
      return initialValue;
    }
  });

  const set = useCallback((newValue: string) => {
    setValue(newValue);
    try {
      localStorage.setItem(key, newValue);
    } catch { /* localStorage unavailable */ }
  }, [key]);

  const remove = useCallback(() => {
    setValue(initialValue);
    try {
      localStorage.removeItem(key);
    } catch { /* localStorage unavailable */ }
  }, [key, initialValue]);

  return { value, set, remove } as const;
}
