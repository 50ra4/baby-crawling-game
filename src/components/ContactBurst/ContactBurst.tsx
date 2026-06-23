import type { ContactType } from '../../types/game';

const BURST_TEXT: Record<ContactType, string> = {
  hurt: 'いたっ！',
  play: 'わーい！',
};

type ContactBurstProps = {
  type: ContactType;
  x: number;
  y: number;
};

// 被弾・遊ぶ時に赤ちゃん頭上へ大きくスケールイン表示するテキスト
export function ContactBurst({ type, x, y }: ContactBurstProps) {
  return (
    <div className={`contact-burst ${type}`} style={{ left: x, top: y }}>
      {BURST_TEXT[type]}
    </div>
  );
}
