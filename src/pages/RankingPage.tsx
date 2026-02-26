import { UserCircle, Trophy } from "lucide-react";
import AppHeader from "@/components/AppHeader";
import { getPlayers } from "@/lib/data";

const RankingPage = () => {
  const players = getPlayers();

  // Ranking: 3pts per win, 1pt per draw
  const ranked = [...players]
    .map((p) => ({ ...p, points: p.wins * 3 + p.draws }))
    .sort((a, b) => b.points - a.points);

  return (
    <div className="min-h-screen bg-background flex flex-col max-w-lg mx-auto">
      <AppHeader title="Ranking" showBack />

      {/* Top 3 podium */}
      <div className="bg-card border-b border-border p-6">
        <div className="flex items-end justify-center gap-4">
          {[1, 0, 2].map((idx) => {
            const p = ranked[idx];
            if (!p) return null;
            const pos = idx === 0 ? 1 : idx === 1 ? 2 : 3;
            const isFirst = pos === 1;
            return (
              <div key={p.id} className="text-center flex flex-col items-center">
                <div className={`relative ${isFirst ? "mb-2" : ""}`}>
                  {isFirst && <Trophy className="text-accent absolute -top-5 left-1/2 -translate-x-1/2" size={24} />}
                  <UserCircle className="text-muted-foreground" size={isFirst ? 56 : 44} />
                </div>
                <p className="text-xs font-bold text-card-foreground mt-1 truncate max-w-[80px]">{p.name}</p>
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full mt-1 ${isFirst ? "bg-accent text-accent-foreground" : "bg-muted text-muted-foreground"}`}>
                  {pos}º
                </span>
                <p className="text-xs text-muted-foreground mt-0.5">{p.points} pts</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Full ranking */}
      <div className="flex-1 divide-y divide-border">
        {ranked.map((p, i) => (
          <div key={p.id} className="flex items-center gap-3 px-4 py-3 bg-card">
            <span className="w-8 text-center font-black text-primary">{i + 1}º</span>
            <UserCircle className="text-muted-foreground shrink-0" size={36} />
            <div className="flex-1 min-w-0">
              <p className="font-bold text-card-foreground truncate">{p.name}</p>
              <p className="text-xs text-muted-foreground">
                {p.wins}V {p.draws}E {p.losses}D
              </p>
            </div>
            <span className="font-black text-primary text-lg">{p.points}</span>
            <span className="text-xs text-muted-foreground">pts</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RankingPage;
