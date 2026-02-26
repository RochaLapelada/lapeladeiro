import { UserCircle, Trophy } from "lucide-react";
import AppHeader from "@/components/AppHeader";
import { getPlayers } from "@/lib/data";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Player } from "@/lib/types";

const RankingPage = () => {
  const players = getPlayers();

  const withPoints = (list: Player[]) =>
    list.map(p => ({ ...p, points: p.wins * 3 + p.draws }))
      .sort((a, b) => b.points - a.points || b.wins - a.wins || a.name.localeCompare(b.name));

  const linhaPlayers = withPoints(players.filter(p => p.position === "Linha"));
  const goleiros = withPoints(players.filter(p => p.position === "Goleiro"));

  const Podium = ({ ranked }: { ranked: (Player & { points: number })[] }) => {
    if (ranked.length < 1) return null;
    const indices = ranked.length >= 3 ? [1, 0, 2] : ranked.length >= 2 ? [1, 0] : [0];
    return (
      <div className="bg-card border-b border-border p-6">
        <div className="flex items-end justify-center gap-4">
          {indices.map((idx) => {
            const p = ranked[idx];
            if (!p) return null;
            const pos = idx === 0 ? 1 : idx === 1 ? 2 : 3;
            const isFirst = pos === 1;
            const isGoalkeeper = p.position === "Goleiro";
            return (
              <div key={p.id} className="text-center flex flex-col items-center">
                <div className={`relative ${isFirst ? "mb-2" : ""}`}>
                  {isFirst && <Trophy className="text-accent absolute -top-5 left-1/2 -translate-x-1/2" size={24} />}
                  {isGoalkeeper ? (
                    <span className={`${isFirst ? "text-5xl" : "text-4xl"}`}>🧤</span>
                  ) : (
                    <UserCircle className="text-muted-foreground" size={isFirst ? 56 : 44} />
                  )}
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
    );
  };

  const RankList = ({ ranked }: { ranked: (Player & { points: number })[] }) => (
    <div className="divide-y divide-border">
      {ranked.map((p, i) => {
        const isGoalkeeper = p.position === "Goleiro";
        return (
          <div key={p.id} className="flex items-center gap-3 px-4 py-3 bg-card">
            <span className="w-8 text-center font-black text-primary">{i + 1}º</span>
            {isGoalkeeper ? (
              <span className="text-2xl shrink-0">🧤</span>
            ) : (
              <UserCircle className="text-muted-foreground shrink-0" size={36} />
            )}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <p className="font-bold text-card-foreground truncate">{p.name}</p>
                {isGoalkeeper && (
                  <span className="text-[9px] font-black px-1 py-0.5 rounded bg-accent text-accent-foreground">GOLEIRO</span>
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                {p.wins}V {p.draws}E {p.losses}D · {p.matches}J
              </p>
            </div>
            <span className="font-black text-primary text-lg">{p.points}</span>
            <span className="text-xs text-muted-foreground">pts</span>
          </div>
        );
      })}
      {ranked.length === 0 && (
        <p className="text-center text-muted-foreground py-8 text-sm">Nenhum jogador nesta categoria.</p>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-background flex flex-col max-w-lg mx-auto">
      <AppHeader title="Ranking" showBack />

      <Tabs defaultValue="linha" className="flex-1">
        <TabsList className="w-full rounded-none header-gradient border-none h-12">
          <TabsTrigger value="linha" className="flex-1 text-primary-foreground data-[state=active]:bg-primary-foreground/20 data-[state=active]:text-primary-foreground font-bold">
            ⚽ LINHA
          </TabsTrigger>
          <TabsTrigger value="goleiros" className="flex-1 text-primary-foreground data-[state=active]:bg-primary-foreground/20 data-[state=active]:text-primary-foreground font-bold">
            🧤 GOLEIROS
          </TabsTrigger>
        </TabsList>

        <TabsContent value="linha" className="mt-0">
          <Podium ranked={linhaPlayers} />
          <RankList ranked={linhaPlayers} />
        </TabsContent>

        <TabsContent value="goleiros" className="mt-0">
          <Podium ranked={goleiros} />
          <RankList ranked={goleiros} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default RankingPage;
