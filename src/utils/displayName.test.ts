import { displayName } from './displayName';

describe('displayName', () => {
  it('名前が空なら性別に関わらず「あかちゃん」を返す', () => {
    expect(displayName('', 'boy')).toBe('あかちゃん');
    expect(displayName('', 'girl')).toBe('あかちゃん');
  });

  it('名前が空白のみでも「あかちゃん」を返す', () => {
    expect(displayName('   ', 'girl')).toBe('あかちゃん');
  });

  it('男の子は名前に「くん」を付ける', () => {
    expect(displayName('たろう', 'boy')).toBe('たろうくん');
  });

  it('女の子は名前に「ちゃん」を付ける', () => {
    expect(displayName('はな', 'girl')).toBe('はなちゃん');
  });

  it('前後の空白を取り除いてから敬称を付ける', () => {
    expect(displayName('  たろう  ', 'boy')).toBe('たろうくん');
  });
});
