import { useCallback, useRef } from 'react';

export default function DualRangeSlider({
  min, max, valueMin, valueMax, onChange, prefix = '',
}: {
  min: number; max: number; valueMin: number; valueMax: number;
  onChange: (lo: number, hi: number) => void; prefix?: string;
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const pct = (v: number) => ((v - min) / (max - min)) * 100;

  const handlePointer = useCallback(
    (which: 'min' | 'max') => (e: React.PointerEvent) => {
      e.preventDefault();
      const track = trackRef.current;
      if (!track) return;
      const move = (ev: PointerEvent) => {
        const rect = track.getBoundingClientRect();
        const ratio = Math.min(1, Math.max(0, (ev.clientX - rect.left) / rect.width));
        const raw = Math.round(min + ratio * (max - min));
        if (which === 'min') onChange(Math.min(raw, valueMax), valueMax);
        else onChange(valueMin, Math.max(raw, valueMin));
      };
      const up = () => {
        window.removeEventListener('pointermove', move);
        window.removeEventListener('pointerup', up);
      };
      window.addEventListener('pointermove', move);
      window.addEventListener('pointerup', up);
    },
    [min, max, valueMin, valueMax, onChange],
  );

  return (
    <div className="w-full">
      <div className="flex justify-between text-xs text-indigo-500 mb-2 font-medium">
        <span>{prefix}{valueMin}</span>
        <span>{prefix}{valueMax}</span>
      </div>
      <div ref={trackRef} className="relative h-1 bg-gray-200 rounded-full select-none touch-none">
        {/* Filled range */}
        <div
          className="absolute h-full bg-indigo-400 rounded-full"
          style={{ left: `${pct(valueMin)}%`, width: `${pct(valueMax) - pct(valueMin)}%` }}
        />
        {/* Min thumb */}
        <div
          onPointerDown={handlePointer('min')}
          className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-white border-2 border-indigo-500 rounded-full cursor-grab active:cursor-grabbing shadow-sm"
          style={{ left: `${pct(valueMin)}%`, marginLeft: '-6px' }}
        />
        {/* Max thumb */}
        <div
          onPointerDown={handlePointer('max')}
          className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-white border-2 border-indigo-500 rounded-full cursor-grab active:cursor-grabbing shadow-sm"
          style={{ left: `${pct(valueMax)}%`, marginLeft: '-6px' }}
        />
      </div>
    </div>
  );
}