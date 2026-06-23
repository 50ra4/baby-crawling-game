import { backgroundStyle, centerRunnerStyle } from './backgroundStyle';

describe('backgroundStyle', () => {
  it('おへやテーマははちみつ色の木目を含む', () => {
    const style = backgroundStyle('room', 0);
    expect(style.background).toContain('#d8a667');
  });

  it('こうえんテーマは草地グラデを含む', () => {
    const style = backgroundStyle('park', 0);
    expect(style.background).toContain('#bfe3a0');
  });

  it('よるテーマは紺色グラデを含む', () => {
    const style = backgroundStyle('night', 0);
    expect(style.background).toContain('#191d45');
  });

  it('スクロール量で背景のループ位置が変わる', () => {
    const at0 = backgroundStyle('room', 0);
    const at100 = backgroundStyle('room', 100);
    expect(at0.background).not.toBe(at100.background);
  });

  it('150pxのループ境界では同じ位置に戻る', () => {
    const at0 = backgroundStyle('room', 0);
    const at150 = backgroundStyle('room', 150);
    expect(at0.background).toBe(at150.background);
  });
});

describe('centerRunnerStyle', () => {
  it('テーマごとに異なる中央帯の模様を返す', () => {
    const room = centerRunnerStyle('room').background;
    const park = centerRunnerStyle('park').background;
    const night = centerRunnerStyle('night').background;
    expect(room).not.toBe(park);
    expect(park).not.toBe(night);
  });
});
