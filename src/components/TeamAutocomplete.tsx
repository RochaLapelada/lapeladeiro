import { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { BRAZILIAN_TEAMS, searchTeams, BrazilianTeam } from "@/lib/teams";

interface TeamAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
}

const TeamBadge = ({ team, size = 24 }: { team: BrazilianTeam; size?: number }) => (
  <div
    className="rounded-full flex items-center justify-center shrink-0 font-black"
    style={{
      width: size,
      height: size,
      backgroundColor: team.color,
      color: team.textColor,
      fontSize: size * 0.35,
    }}
  >
    {team.abbr.slice(0, 2)}
  </div>
);

export const TeamBadgeByName = ({ name, size = 14 }: { name: string; size?: number }) => {
  const team = BRAZILIAN_TEAMS.find(t => t.name.toLowerCase() === name.toLowerCase());
  if (!team) return <span className="text-[10px]">🛡️</span>;
  return <TeamBadge team={team} size={size} />;
};

const TeamAutocomplete = ({ value, onChange }: TeamAutocompleteProps) => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState(value);
  const containerRef = useRef<HTMLDivElement>(null);
  const results = searchTeams(query);

  useEffect(() => {
    setQuery(value);
  }, [value]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const select = (team: BrazilianTeam) => {
    onChange(team.name);
    setQuery(team.name);
    setOpen(false);
  };

  return (
    <div ref={containerRef} className="relative">
      <Input
        placeholder="Time que torce (opcional)"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          onChange(e.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
      />
      {open && results.length > 0 && (
        <div className="absolute z-50 w-full mt-1 max-h-48 overflow-y-auto rounded-lg border border-border bg-card shadow-lg">
          {results.map((team) => (
            <button
              key={team.name}
              type="button"
              onClick={() => select(team)}
              className="w-full flex items-center gap-2.5 px-3 py-2 text-left text-sm hover:bg-secondary/60 transition-colors"
            >
              <TeamBadge team={team} size={22} />
              <span className="font-semibold text-card-foreground">{team.name}</span>
              <span className="text-[10px] text-muted-foreground ml-auto">Série {team.serie}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default TeamAutocomplete;
