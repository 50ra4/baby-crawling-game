import type { Contact } from '../types/game';

// 接触フリーズの経過を進める。持続時間に達したら解除（null）。
export const updateContact = (
  contact: Contact | null,
  dt: number,
): Contact | null => {
  if (!contact) {
    return null;
  }
  const t = contact.t + dt;
  if (t >= contact.dur) {
    return null;
  }
  return { ...contact, t };
};
