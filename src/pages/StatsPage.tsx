import { useState } from "react";
import { UserCircle } from "lucide-react";
import AppHeader from "@/components/AppHeader";
import { getPlayers } from "@/lib/data";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const StatsPage = () => {
  const players = getPlayers();

  const totalGoals = players.reduce((s, p) => s + p.goals, 0);
  const totalYellows = players.reduce((s, p) => s + p.yellowCards, 0);
  const totalReds = players.reduce((s, p) => s + p.redCards, 0);

  const topScorers = [...players].sort((a, b) => b.goals - a.goals).slice(0, 5);
  const mostPlayed = [...players].sort((a, b) => b.matches - a.matches).slice(0, 5);
  const mostWins = [...players].sort((a, b) => b.wins - a.wins).slice(0, 5);
  const mostLosses = [...players].sort((a, b) => b.losses - a.losses).slice(0, 5);

  return (
    <div className="min-h-screen bg-background flex flex-col max-w-lg mx-auto">
      <AppHeader title="Estatísticas" showBack />

      <Tabs defaultValue="totals" className="flex-1">
        <TabsList className="w-full rounded-none header-gradient border-none h-12">
          <TabsTrigger value="totals" className="flex-1 text-primary-foreground data-[state=active]:bg-primary-foreground/20 data-[state=active]:text-primary-foreground font-bold">
            TOTAIS
          </TabsTrigger>
          <TabsTrigger value="scorers" className="flex-1 text-primary-foreground data-[state=active]:bg-primary-foreground/20 data-[state=active]:text-primary-foreground font-bold">
            ARTILHARIA
          </TabsTrigger>
        </TabsList>

        <TabsContent value="totals" className="mt-0">
          {/* Summary cards */}
          <div className="bg-card border-b border-border p-6">
            <div className="grid grid-cols-3 text-center">
              <div>
                <span className="text-3xl">⚽</span>
                <p className="text-3xl font-black text-card-foreground">{totalGoals}</p>
              </div>
              <div>
                <div className="w-6 h-8 bg-accent mx-auto rounded-sm" />
                <p className="text-3xl font-black text-card-foreground mt-1">{totalYellows}</p>
              </div>
              <div>
                <div className="w-6 h-8 bg-destructive mx-auto rounded-sm" />
                <p className="text-3xl font-black text-card-foreground mt-1">{totalReds}</p>
              </div>
            </div>
          </div>

          {/* Player stats sections */}
          <div className="p-4 space-y-4">
            <StatSection title="Jogador que mais jogou" players={mostPlayed} stat={(p) => `${p.matches} Partidas`} />
            <StatSection title="Jogador que mais venceu" players={mostWins} stat={(p) => `${p.wins} Vitórias`} />
            <StatSection title="Jogador que mais perdeu" players={mostLosses} stat={(p) => `${p.losses} Derrotas`} />
          </div>
        </TabsContent>

        <TabsContent value="scorers" className="mt-0 p-4 space-y-2">
          {topScorers.map((p, i) => (
            <div key={p.id} className="bg-card rounded-lg border border-border p-4 flex items-center gap-3">
              <span className="text-xl font-black text-primary w-8 text-center">{i + 1}º</span>
              <UserCircle className="text-muted-foreground shrink-0" size={40} />
              <div className="flex-1">
                <p className="font-bold text-card-foreground">{p.name}</p>
                {p.favoriteTeam && <p className="text-[10px] font-semibold text-muted-foreground flex items-center gap-1"><TeamBadgeByName name={p.favoriteTeam} /> {p.favoriteTeam}</p>}
                <p className="text-sm text-muted-foreground">{p.goals} gols</p>
              </div>
            </div>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
};

interface StatSectionProps {
  title: string;
  players: ReturnType<typeof getPlayers>;
  stat: (p: ReturnType<typeof getPlayers>[0]) => string;
}

const StatSection = ({ title, players, stat }: StatSectionProps) => {
  const top = players[0];
  if (!top) return null;

  return (
    <div className="bg-card rounded-lg border border-border p-4">
      <h3 className="font-bold text-lg text-card-foreground mb-3">{title}</h3>
      <div className="flex items-center gap-3">
        <UserCircle className="text-muted-foreground shrink-0" size={48} />
        <div>
          <p className="font-bold text-card-foreground">{top.name}</p>
          {top.favoriteTeam && <p className="text-[10px] font-semibold text-primary">🛡️ {top.favoriteTeam}</p>}
          <p className="text-sm text-muted-foreground">{stat(top)}</p>
        </div>
      </div>
    </div>
  );
};

export default StatsPage;
