import { SPRITE_SOURCE_URLS } from './spriteSources';

describe('spriteSources', () => {
  it('SPRITE_SOURCE_URLSが9件になる', () => {
    expect(SPRITE_SOURCE_URLS).toHaveLength(9);
  });

  it('SPRITE_SOURCE_URLSに重複がない', () => {
    expect(new Set(SPRITE_SOURCE_URLS).size).toBe(SPRITE_SOURCE_URLS.length);
  });

  it('SPRITE_SOURCE_URLSの全要素がtruthyになる', () => {
    expect(SPRITE_SOURCE_URLS.every((url) => Boolean(url))).toBe(true);
  });
});
