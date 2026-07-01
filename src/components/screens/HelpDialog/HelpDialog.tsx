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
    <span className="flex w-14 flex-col items-center gap-0.5 text-center">
      <ObjectSprite kind={kind} size={SPRITE_SIZE} />
      <b className="text-[11px] leading-[1.2] font-bold">
        {OBJECT_META[kind].label}
      </b>
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
        <h2
          id="help-title"
          className="font-latin text-primary m-0 mb-3 text-center text-[24px] font-extrabold"
        >
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
            <b>きょり(m)</b>：どこまで すすめたかが スコア。とおくまで
            すすもう！
          </p>
        </section>

        <section className="help-section">
          <h3>きをつけて</h3>
          <div className="mb-2 last:mb-0">
            <p>
              <b>障害物</b>：ぶつかると 体力 -10「いたっ！」
            </p>
            <div className="mt-1.5 flex flex-wrap gap-3">
              {KINDS.obstacle.map((kind) => (
                <ObjectChip key={kind} kind={kind} />
              ))}
            </div>
          </div>
          <div className="mb-2 last:mb-0">
            <p>
              <b>おもちゃ</b>：さわると 体力 -10、でも
              あそんじゃう「遊んじゃった！」
            </p>
            <div className="mt-1.5 flex flex-wrap gap-3">
              {KINDS.toy.map((kind) => (
                <ObjectChip key={kind} kind={kind} />
              ))}
            </div>
          </div>
        </section>

        <section className="help-section">
          <h3>アイテム</h3>
          <ul className="m-0 flex list-none flex-col gap-2.5 p-0">
            <li className="flex items-center gap-2.5">
              <ObjectSprite kind="bottle" size={SPRITE_SIZE} />
              <span className="flex-1">
                <b>{OBJECT_META.bottle.label}</b>：体力を +20% かいふく
              </span>
            </li>
            <li className="flex items-center gap-2.5">
              <ObjectSprite kind="diaper" size={SPRITE_SIZE} />
              <span className="flex-1">
                <b>{OBJECT_META.diaper.label}</b>：おむつを 0% に リセット
              </span>
            </li>
          </ul>
        </section>

        <button
          type="button"
          className="t-start ghost mx-auto mt-1.5 block"
          onClick={onClose}
        >
          とじる
        </button>
      </div>
    </div>
  );
}
