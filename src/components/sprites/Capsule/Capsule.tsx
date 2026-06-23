export type Point = [number, number];

type CapsuleProps = {
  a: Point;
  b: Point;
  width: number;
  color: string;
  cap: string;
  end?: 'hand' | 'foot';
  sock?: string;
};

// 四肢を表す太い丸線。端に手（円）または足（靴下＋足先）を付ける。
export function Capsule({ a, b, width, color, cap, end, sock }: CapsuleProps) {
  return (
    <g>
      <line
        x1={a[0]}
        y1={a[1]}
        x2={b[0]}
        y2={b[1]}
        stroke={color}
        strokeWidth={width}
        strokeLinecap="round"
      />
      {end === 'hand' && <circle cx={b[0]} cy={b[1]} r={width / 2 + 1.5} fill={cap} />}
      {end === 'foot' && (
        <>
          <circle cx={b[0]} cy={b[1]} r={width / 2 + 1} fill={sock} />
          <ellipse cx={b[0]} cy={b[1] + 1} rx={width / 2} ry={width / 2 - 1.5} fill={cap} />
        </>
      )}
    </g>
  );
}
