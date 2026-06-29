import { useCallback, type ChangeEvent } from 'react';
import type { CrawlStyle, Gender } from '../../../types/game';
import { Baby } from '../../sprites/Baby/Baby';
import { HelpDialog } from '../HelpDialog/HelpDialog';
import { useRafTime } from '../../../hooks/useRafTime';
import { useModal } from '../../../hooks/useModal';

// 目がチカチカしないよう、プレビューはゆっくり浅く揺らす（速度・振幅とも大幅に抑える）
const PREVIEW_CRAWL_SPEED = 0.35;
const PREVIEW_BOUNCE = 2;
const NAME_MAX_LENGTH = 8;

type TitleScreenProps = {
  name: string;
  gender: Gender;
  crawlStyle: CrawlStyle;
  bestDistance: number;
  onChangeName: (name: string) => void;
  onChangeGender: (gender: Gender) => void;
  onStart: () => void;
};

// タイトル画面：ロゴ＋ハイハイプレビュー＋名前入力＋性別＋はじめる
export function TitleScreen({
  name,
  gender,
  crawlStyle,
  bestDistance,
  onChangeName,
  onChangeGender,
  onStart,
}: TitleScreenProps) {
  const time = useRafTime();
  const phase = (time * PREVIEW_CRAWL_SPEED) % 1;
  const help = useModal();

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    onChangeName(event.target.value);
  };

  const selectBoy = useCallback(() => onChangeGender('boy'), [onChangeGender]);
  const selectGirl = useCallback(
    () => onChangeGender('girl'),
    [onChangeGender],
  );

  return (
    <>
      {/* ダイアログ表示中は背景を inert にして、Tab/クリック/Enter が背後の
          「はじめる」等へ届かないようにする（モーダル背景の非活性化）。 */}
      <div className="overlay title" inert={help.isOpen}>
        <div className="font-latin text-badge mb-1 text-[12px] font-bold tracking-[0.15em] uppercase">
          Baby Crawl Run
        </div>
        <h1 className="t-title">
          はいはい！
          <br />
          ベビーラン
        </h1>
        <div className="mt-1.5 mb-3.5 drop-shadow-[0_12px_16px_rgba(120,90,60,0.18)]">
          <Baby
            phase={phase}
            crawlStyle={crawlStyle}
            bounce={PREVIEW_BOUNCE}
            size={132}
            variant="title"
          />
        </div>
        <label
          className="mb-[5px] text-[11px] font-bold tracking-[0.08em] text-[#a98]"
          htmlFor="baby-name"
        >
          あかちゃんの なまえ
        </label>
        <input
          id="baby-name"
          className="border-border-pink font-jp text-ink focus:border-primary-light w-[180px] rounded-[14px] border-[2.5px] bg-white px-3 py-[9px] text-center text-[18px] font-bold outline-none"
          value={name}
          maxLength={NAME_MAX_LENGTH}
          onChange={handleChange}
          placeholder="なまえ"
        />
        <div className="mt-2.5 flex gap-2">
          <button
            type="button"
            className={'t-gender-btn' + (gender === 'boy' ? ' active' : '')}
            aria-pressed={gender === 'boy'}
            onClick={selectBoy}
          >
            男の子
          </button>
          <button
            type="button"
            className={'t-gender-btn' + (gender === 'girl' ? ' active' : '')}
            aria-pressed={gender === 'girl'}
            onClick={selectGirl}
          >
            女の子
          </button>
        </div>
        <button className="t-start" onClick={onStart}>
          はじめる
        </button>
        <button
          type="button"
          className="font-jp text-badge mt-3 cursor-pointer border-0 bg-transparent text-[13px] font-bold underline underline-offset-[3px]"
          onClick={help.open}
        >
          あそびかたを みる
        </button>
        <div className="mt-4 text-[12px] font-bold text-[#b09] opacity-[0.55]">
          ← → / A D で よけてね ・ ドラッグでも うごくよ
        </div>
        {bestDistance > 0 && (
          <div className="font-latin text-badge mt-2 text-[14px] font-extrabold">
            ベスト {bestDistance}m
          </div>
        )}
      </div>
      {help.isOpen && (
        <HelpDialog onClose={help.close} panelRef={help.dialogRef} />
      )}
    </>
  );
}
