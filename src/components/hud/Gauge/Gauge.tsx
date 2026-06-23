type GaugeProps = {
  icon: string;
  ratio: number;
  color: string;
  warn?: string;
};

// 体力・不快度を表す横バー。ratio(0..1)で塗り幅が決まる。
export function Gauge({ icon, ratio, color, warn }: GaugeProps) {
  const widthPct = Math.max(0, Math.min(1, ratio)) * 100;
  return (
    <div className="gauge">
      <span className="g-ic">{icon}</span>
      <div className="g-track">
        <div
          className="g-fill"
          style={{ width: `${widthPct}%`, background: color }}
        />
      </div>
      {warn !== undefined && <span className="g-warn">{warn}</span>}
    </div>
  );
}
