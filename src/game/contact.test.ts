import { updateContact } from './contact';
import type { Contact } from '../types/game';

describe('updateContact', () => {
  it('接触がなければ null を返す', () => {
    expect(updateContact(null, 0.1)).toBeNull();
  });

  it('経過時間 t が dt 分進む', () => {
    const contact: Contact = { type: 'hurt', t: 0, dur: 0.6 };
    const result = updateContact(contact, 0.1);
    expect(result?.t).toBeCloseTo(0.1);
  });

  it('持続時間に達したら null に解除される', () => {
    const contact: Contact = { type: 'hurt', t: 0.55, dur: 0.6 };
    expect(updateContact(contact, 0.1)).toBeNull();
  });

  it('持続時間ちょうどでも解除される', () => {
    const contact: Contact = { type: 'play', t: 0.5, dur: 0.6 };
    expect(updateContact(contact, 0.1)).toBeNull();
  });
});
