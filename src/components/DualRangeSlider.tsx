import { useCallback, useRef } from 'react';

export default function DualRangeSlider({
  min, max, valueMin, valueMax, onChange, prefix = '', suffix = '',
}: {
  min: number; max: number; valueMin: number; valueMax: number;
  onChange: (lo: number, hi: number) => void; prefix?: string; suffix?: string;
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
      <div ref={trackRef} className="relative h-1.5 bg-gray-200 rounded-full select-none touch-none">
        {/* Filled range */}
        <div
          className="absolute h-full bg-indigo-500 rounded-full"
          style={{ left: `${pct(valueMin)}%`, width: `${pct(valueMax) - pct(valueMin)}%` }}
        />
        {/* Min thumb */}
        <div
          onPointerDown={handlePointer('min')}
          className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-white border-2 border-indigo-500 rounded-full cursor-grab active:cursor-grabbing shadow"
          style={{ left: `${pct(valueMin)}%`, marginLeft: '-8px' }}
        />
        {/* Max thumb */}
        <div
          onPointerDown={handlePointer('max')}
          className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-white border-2 border-indigo-500 rounded-full cursor-grab active:cursor-grabbing shadow"
          style={{ left: `${pct(valueMax)}%`, marginLeft: '-8px' }}
        />
      </div>
      <div className="flex justify-between text-xs text-gray-500 mt-2 font-medium">
        <span>{prefix}{valueMin}{suffix}</span>
        <span>{prefix}{valueMax}{suffix}</span>
      </div>
    </div>
  );
}