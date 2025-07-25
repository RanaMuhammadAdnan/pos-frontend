"use client";
import { useState, useEffect } from 'react';

export const useClientOnly = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return mounted;
}; 