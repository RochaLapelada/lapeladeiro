import { Shield } from "lucide-react";

interface PlayerNameDisplayProps {
  name: string;
  favoriteTeam?: string;
  nameClassName?: string;
  teamClassName?: string;
}

const PlayerNameDisplay = ({ name, favoriteTeam, nameClassName, teamClassName }: PlayerNameDisplayProps) => {
  return (
    <div className="min-w-0">
      <p className={nameClassName || "font-bold text-card-foreground truncate"}>{name}</p>
      {favoriteTeam && (
        <span className={teamClassName || "text-[10px] font-semibold text-muted-foreground flex items-center gap-0.5"}>
          <Shield size={10} className="shrink-0 text-primary" />
          {favoriteTeam}
        </span>
      )}
    </div>
  );
};

export default PlayerNameDisplay;
