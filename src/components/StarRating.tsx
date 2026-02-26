import { Star } from "lucide-react";

interface StarRatingProps {
  rating: number;
  max?: number;
  size?: number;
}

const StarRating = ({ rating, max = 3, size = 18 }: StarRatingProps) => {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: max }).map((_, i) => (
        <Star
          key={i}
          size={size}
          className={i < rating ? "fill-accent text-accent" : "text-muted-foreground/30"}
        />
      ))}
    </div>
  );
};

export default StarRating;
