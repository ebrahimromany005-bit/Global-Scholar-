import { useState, useEffect } from 'react';

export function usePremium() {
  const [isPremium, setIsPremium] = useState<boolean>(() => {
    const saved = localStorage.getItem('scholar_premium');
    return saved === 'true';
  });

  const setPremium = (value: boolean) => {
    localStorage.setItem('scholar_premium', String(value));
    setIsPremium(value);
  };

  return { isPremium, setPremium };
}
