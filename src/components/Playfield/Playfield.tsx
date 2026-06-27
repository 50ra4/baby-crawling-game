import type { GameConfig, GameScreen, GameState } from '../../types/game';
import {
  BABY_WIDTH,
  BABY_Y,
  OBJECT_META,
  PX_PER_M,
} from '../../constants/gameConfig';
import { clamp } from '../../utils/math';
import { displayName as resolveName } from '../../utils/displayName';
import {
  backgroundStyle,
  centerRunnerStyle,
} from '../backgrounds/backgroundStyle';
import { Baby } from '../sprites/Baby/Baby';
import { ObjectSprite } from '../sprites/ObjectSprite/ObjectSprite';
import { ContactBurst } from '../ContactBurst/ContactBurst';
import { PopupText } from '../PopupText/PopupText';
import { Hud } from '../hud/Hud/Hud';
import { babyContactTransform } from './babyContactTransform';

const BLINK_RATE = 12;
const MAX_TILT = 22;

type PlayfieldProps = {
  game: GameState;
  config: GameConfig;
  screen: GameScreen;
  bestDistance: number;
};

// ゲーム盤面の描画。背景・オブジェクト・赤ちゃん・演出・HUDを論理座標で重ねる。
export function Playfield({
  game,
  config,
  screen,
  bestDistance,
}: PlayfieldProps) {
  // 被弾(hurt)無敵中のみ点滅。おもちゃ(play)では点滅しない。
  const blinking =
    game.invincibleType === 'hurt' &&
    game.elapsed < game.invincibleUntil &&
    Math.floor(game.elapsed * BLINK_RATE) % 2 === 0;

  const shakeAmount = game.shake > 0 ? config.shakeIntensity * game.shake : 0;
  const shakeX = shakeAmount > 0 ? (Math.random() - 0.5) * 2 * shakeAmount : 0;
  const shakeY = shakeAmount > 0 ? (Math.random() - 0.5) * 2 * shakeAmount : 0;

  const distance = Math.floor(game.distancePx / PX_PER_M);

  return (
    <div
      className="playfield"
      style={{ transform: `translate(${shakeX}px, ${shakeY}px)` }}
    >
      <div
        className="bg"
        style={backgroundStyle(config.theme, game.distancePx)}
      />
      <div className="runner" style={centerRunnerStyle(config.theme)} />

      {game.objects.map((object) => {
        const meta = OBJECT_META[object.kind];
        const size = meta.base * object.scale;
        const tilt = meta.dynamic
          ? clamp(object.vx / 12, -MAX_TILT, MAX_TILT)
          : 0;
        return (
          <div
            key={object.id}
            className="obj"
            style={{
              left: object.x,
              top: object.y,
              width: size,
              height: size,
              opacity: object.hit ? 0 : 1,
              transform: `translate(-50%,-50%) rotate(${tilt}deg)`,
              transition: object.hit ? 'opacity .2s' : 'none',
            }}
          >
            <ObjectSprite kind={object.kind} size={size} />
          </div>
        );
      })}

      <div
        className="baby"
        style={{
          left: game.babyX,
          top: BABY_Y,
          width: BABY_WIDTH,
          height: BABY_WIDTH * 1.18,
          opacity: blinking ? 0.35 : 1,
          transform: `translate(-50%,-58%) ${babyContactTransform(game.contact, config)}`,
        }}
      >
        <Baby
          phase={game.phase}
          crawlStyle={config.crawlStyle}
          bounce={config.bounceHeight}
          mood={game.discomfort / 100}
          hurt={game.contact?.type === 'hurt'}
          play={game.contact?.type === 'play'}
          size={BABY_WIDTH}
        />
      </div>

      {game.contact && (
        <ContactBurst type={game.contact.type} x={game.babyX} y={BABY_Y - 70} />
      )}

      {game.popups.map((popup) => (
        <PopupText key={popup.id} popup={popup} />
      ))}

      {screen === 'playing' && (
        <Hud
          stamina={game.stamina}
          maxStamina={game.maxStamina}
          discomfort={game.discomfort}
          distance={distance}
          bestDistance={bestDistance}
          displayName={resolveName(config.name, config.gender)}
        />
      )}
    </div>
  );
}
