interface PositionBadgeProps {
  position: string;
}

const PositionBadge = ({ position }: PositionBadgeProps) => {
  return (
    <span className="inline-flex items-center justify-center w-9 h-7 rounded-full bg-primary text-primary-foreground text-xs font-bold">
      {position}
    </span>
  );
};

export default PositionBadge;
