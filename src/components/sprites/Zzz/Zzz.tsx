type ZzzProps = {
  t?: number;
  x?: number;
  y?: number;
};

// 浮遊する ZZZ（上昇＋拡大＋フェードでループ）。SVGの内側に置く。
export function Zzz({ t = 0, x = 0, y = 0 }: ZzzProps) {
  return (
    <g>
      {[0, 1, 2].map((i) => {
        const local = (t * 0.45 + i * 0.34) % 1;
        const opacity = Math.sin(local * Math.PI);
        const yy = y - local * 56;
        const xx = x + i * 15 + Math.sin(local * 6 + i) * 4;
        const fontSize = 14 + i * 6 + local * 4;
        return (
          <text
            key={i}
            x={xx}
            y={yy}
            fontSize={fontSize}
            fill="#8b9bd4"
            opacity={opacity}
            fontWeight="800"
            fontFamily="'Baloo 2', sans-serif"
            transform={`rotate(${12 + i * 5} ${xx} ${yy})`}
          >
            Z
          </text>
        );
      })}
    </g>
  );
}
