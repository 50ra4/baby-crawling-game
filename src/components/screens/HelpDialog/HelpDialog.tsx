import type { MouseEvent as ReactMouseEvent, RefObject } from 'react';
import { ObjectSprite } from '../../sprites/ObjectSprite/ObjectSprite';
import { KINDS, OBJECT_META } from '../../../constants/gameConfig';
import type { ObjectKind } from '../../../types/game';

type HelpDialogProps = {
  onClose: () => void;
  // 開いたときにフォーカスを移すため、パネル要素への参照を受け取る
  panelRef?: RefObject<HTMLDivElement | null>;
};

// 背景クリックで閉じるため、パネル内クリックは伝播を止める（モジュール定数で安定参照）。
const stopPropagation = (event: ReactMouseEvent<HTMLDivElement>): void =>
  event.stopPropagation();

// あそびかたダイアログ内のスプライト表示サイズ（アイコン用途）
const SPRITE_SIZE = 40;

// 画像つきオブジェクトのチップ（スプライト＋ラベル）。ラベルは OBJECT_META から引いて表記ずれを防ぐ
function ObjectChip({ kind }: { kind: ObjectKind }) {
  return (
    <span className="help-obj">
      <ObjectSprite kind={kind} size={SPRITE_SIZE} />
      <b>{OBJECT_META[kind].label}</b>
    </span>
  );
}

// あそびかた／ルール説明ダイアログ（操作・ステータス・スコア・障害物・アイテム）
export function HelpDialog({ onClose, panelRef }: HelpDialogProps) {
  return (
    <div className="help-backdrop" onClick={onClose}>
      <div
        ref={panelRef}
        className="help-panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby="help-title"
        onClick={stopPropagation}
      >
        <h2 id="help-title" className="help-title">
          あそびかた
        </h2>

        <section className="help-section">
          <h3>そうさ</h3>
          <p>← → / A D で よけてね。タップ・ドラッグでも すすむよ。</p>
        </section>

        <section className="help-section">
          <h3>ステータス</h3>
          <ul>
            <li>
              <b>体力</b>：100からスタート。時間でへって、0になると おしまい。
            </li>
            <li>
              <b>おむつ</b>：時間でたまる。100%になると むずがって 体力のへりが
              はやくなる。
            </li>
          </ul>
        </section>

        <section className="help-section">
          <h3>スコア</h3>
          <p>
            <b>きょり(m)</b>：どこまで すすめたかが スコア。とおくまで すすもう！
          </p>
        </section>

        <section className="help-section">
          <h3>きをつけて</h3>
          <div className="help-group">
            <p>
              <b>障害物</b>：ぶつかると 体力 -10「いたっ！」
            </p>
            <div className="help-objs">
              {KINDS.obstacle.map((kind) => (
                <ObjectChip key={kind} kind={kind} />
              ))}
            </div>
          </div>
          <div className="help-group">
            <p>
              <b>おもちゃ</b>：さわると 体力 -10、でも あそんじゃう「遊んじゃった！」
            </p>
            <div className="help-objs">
              {KINDS.toy.map((kind) => (
                <ObjectChip key={kind} kind={kind} />
              ))}
            </div>
          </div>
        </section>

        <section className="help-section">
          <h3>アイテム</h3>
          <ul className="help-items">
            <li>
              <ObjectSprite kind="bottle" size={SPRITE_SIZE} />
              <span>
                <b>{OBJECT_META.bottle.label}</b>：体力を +20% かいふく
              </span>
            </li>
            <li>
              <ObjectSprite kind="diaper" size={SPRITE_SIZE} />
              <span>
                <b>{OBJECT_META.diaper.label}</b>：おむつを 0% に リセット
              </span>
            </li>
          </ul>
        </section>

        <button
          type="button"
          className="t-start ghost help-close"
          onClick={onClose}
        >
          とじる
        </button>
      </div>
    </div>
  );
}
