export default function BlockHashCurve() {
  return (
    <svg
      className="absolute pointer-events-none -left-5 top-14 z-[-1] overflow-visible"
      width="200"
      height="100"
    >
      <defs>
        <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="var(--color-secondary)" />
          <stop offset="100%" stopColor="var(--color-primary)" />
        </linearGradient>
      </defs>
      <path
        d="M 2 0 C 23 0 2 21 23 21"
        stroke="url(#lineGradient)"
        strokeWidth="3px"
        fill="none"
      />
    </svg>
  );
}
