import { useState } from 'react';

export function useGuestUserId() {
  const [userId] = useState<string>(() => {
    const saved = localStorage.getItem('scholar_guest_id');
    if (saved) return saved;
    const newId = 'guest-' + crypto.randomUUID();
    localStorage.setItem('scholar_guest_id', newId);
    return newId;
  });

  return userId;
}
