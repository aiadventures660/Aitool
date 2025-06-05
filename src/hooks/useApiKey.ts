
import { useState, useEffect } from 'react';

const API_KEY_STORAGE_KEY = 'gemini_api_key';
const DEFAULT_API_KEY = 'AIzaSyAhyUzCAbapXc35NuvAK7Tp9tWev-7axew';

export const useApiKey = () => {
  const [apiKey, setApiKey] = useState<string>('');

  useEffect(() => {
    const storedKey = localStorage.getItem(API_KEY_STORAGE_KEY) || DEFAULT_API_KEY;
    setApiKey(storedKey);
  }, []);

  const saveApiKey = (key: string) => {
    localStorage.setItem(API_KEY_STORAGE_KEY, key);
    setApiKey(key);
  };

  return {
    apiKey,
    saveApiKey,
    hasApiKey: !!apiKey
  };
};
