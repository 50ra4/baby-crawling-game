import type { ComponentType } from 'react';
import type { ObjectKind } from '../../../types/game';
import { Bottle } from '../Bottle/Bottle';
import { Diaper } from '../Diaper/Diaper';
import { Chair } from '../Chair/Chair';
import { Ball } from '../Ball/Ball';
import { Teddy } from '../Teddy/Teddy';
import { Duck } from '../Duck/Duck';

type SizedSprite = ComponentType<{ size?: number }>;

// kind から対応するスプライトを引く（if-elseチェーンを避ける）
const SPRITES = {
  bottle: Bottle,
  diaper: Diaper,
  chair: Chair,
  ball: Ball,
  teddy: Teddy,
  duck: Duck,
} as const satisfies Record<ObjectKind, SizedSprite>;

type ObjectSpriteProps = {
  kind: ObjectKind;
  size: number;
};

export function ObjectSprite({ kind, size }: ObjectSpriteProps) {
  const Sprite = SPRITES[kind];
  return <Sprite size={size} />;
}
