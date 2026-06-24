import type { Popup } from '../../types/game';

const POPUP_LIFETIME = 1.1;
const RISE_SPEED = 46;

type PopupTextProps = {
  popup: Popup;
};

// 上昇しながらフェードアウトする数値演出テキスト
export function PopupText({ popup }: PopupTextProps) {
  return (
    <div
      className="popup"
      style={{
        left: popup.x,
        top: popup.y - popup.t * RISE_SPEED,
        opacity: 1 - popup.t / POPUP_LIFETIME,
        color: popup.color,
      }}
    >
      {popup.text}
    </div>
  );
}
