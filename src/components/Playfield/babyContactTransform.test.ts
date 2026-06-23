import { babyContactTransform } from './babyContactTransform';
import { DEFAULT_CONFIG } from '../../constants/gameConfig';
import type { Contact } from '../../types/game';

describe('babyContactTransform', () => {
  it('接触がなければ空文字を返す', () => {
    expect(babyContactTransform(null, DEFAULT_CONFIG)).toBe('');
  });

  it('被弾(flash)では横ジッターのtranslateXを返す', () => {
    const contact: Contact = { type: 'hurt', t: 0.3, dur: 0.6 };
    expect(babyContactTransform(contact, DEFAULT_CONFIG)).toContain(
      'translateX',
    );
  });

  it('被弾(tumble)では回転を返す', () => {
    const contact: Contact = { type: 'hurt', t: 0.3, dur: 0.6 };
    const result = babyContactTransform(contact, {
      ...DEFAULT_CONFIG,
      hurtStyle: 'tumble',
    });
    expect(result).toContain('rotate');
  });

  it('遊ぶ(bounce)では上下移動のtranslateYを返す', () => {
    const contact: Contact = { type: 'play', t: 0.3, dur: 0.6 };
    expect(babyContactTransform(contact, DEFAULT_CONFIG)).toContain(
      'translateY',
    );
  });

  it('遊ぶ(spin)では一回転の回転を返す', () => {
    const contact: Contact = { type: 'play', t: 1, dur: 1 };
    const result = babyContactTransform(contact, {
      ...DEFAULT_CONFIG,
      playStyle: 'spin',
    });
    expect(result).toBe('rotate(360deg)');
  });
});
