interface JerseyIconProps {
  color: string;
  size?: number;
}

const JerseyIcon = ({ color, size = 80 }: JerseyIconProps) => (
  <svg width={size} height={size * 1.1} viewBox="0 0 100 110" fill="none">
    {/* Sleeves */}
    <path d="M10 15 L0 35 L15 45 L25 30 Z" fill={color} stroke="hsl(var(--border))" strokeWidth="1.5" />
    <path d="M90 15 L100 35 L85 45 L75 30 Z" fill={color} stroke="hsl(var(--border))" strokeWidth="1.5" />
    {/* Body */}
    <path d="M25 15 L25 100 L75 100 L75 15 L65 5 L55 12 L50 14 L45 12 L35 5 Z" fill={color} stroke="hsl(var(--border))" strokeWidth="1.5" />
    {/* Collar */}
    <path d="M35 5 L45 12 L50 14 L55 12 L65 5 L55 0 L45 0 Z" fill={color} opacity="0.8" stroke="hsl(var(--border))" strokeWidth="1" />
  </svg>
);

export default JerseyIcon;
