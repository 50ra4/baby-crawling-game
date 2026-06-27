import type { MouseEvent as ReactMouseEvent, RefObject } from 'react';
import { KINDS, OBJECT_META } from '../../../constants/gameConfig';

type HelpDialogProps = {
  onClose: () => void;
  // 開いたときにフォーカスを移すため、パネル要素への参照を受け取る
  panelRef?: RefObject<HTMLDivElement | null>;
};

// 背景クリックで閉じるため、パネル内クリックは伝播を止める（モジュール定数で安定参照）。
const stopPropagation = (event: ReactMouseEvent<HTMLDivElement>): void =>
  event.stopPropagation();

// ラベルは OBJECT_META から引いて表記のずれを防ぐ
const labelsOf = (kinds: readonly (keyof typeof OBJECT_META)[]): string =>
  kinds.map((kind) => OBJECT_META[kind].label).join('・');

const OBSTACLE_LABELS = labelsOf(KINDS.obstacle);
const TOY_LABELS = labelsOf(KINDS.toy);

// あそびかた／ルール説明ダイアログ（操作・パラメータ・障害物・アイテム）
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
            <li>
              <b>きょり(m)</b>：どこまで すすめるかが スコア。
            </li>
          </ul>
        </section>

        <section className="help-section">
          <h3>きをつけて</h3>
          <ul>
            <li>
              <b>障害物（{OBSTACLE_LABELS}）</b>：ぶつかると 体力 -10「いたっ！」
            </li>
            <li>
              <b>おもちゃ（{TOY_LABELS}）</b>：さわると 体力 -10、でも
              あそんじゃう「遊んじゃった！」
            </li>
          </ul>
        </section>

        <section className="help-section">
          <h3>アイテム</h3>
          <ul>
            <li>
              <b>{OBJECT_META.bottle.label}</b>：体力を +20% かいふく
            </li>
            <li>
              <b>{OBJECT_META.diaper.label}</b>：おむつを 0% に リセット
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
