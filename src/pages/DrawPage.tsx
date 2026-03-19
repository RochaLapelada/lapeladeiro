import { useState } from "react";
import { Shuffle, UserCircle } from "lucide-react";
import AppHeader from "@/components/AppHeader";
import { getPlayers, sortTeams } from "@/lib/data";
import { Player } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const DrawPage = () => {
  const players = getPlayers();
  const [selected, setSelected] = useState<string[]>(players.map((p) => p.id));
  const [mode, setMode] = useState<"random" | "position" | "rating">("random");
  const [teams, setTeams] = useState<[string[], string[]] | null>(null);

  const toggle = (id: string) => {
    setSelected((s) => s.includes(id) ? s.filter((x) => x !== id) : [...s, id]);
  };

  const handleDraw = () => {
    if (selected.length < 2) return;
    setTeams(sortTeams(selected, mode));
  };

  const getPlayer = (id: string) => players.find((p) => p.id === id)!;

  return (
    <div className="min-h-screen bg-background flex flex-col max-w-lg mx-auto">
      <AppHeader title="Sorteio de Times" showBack />

      <div className="p-4 space-y-4">
        <div className="flex gap-3 items-end">
          <div className="flex-1">
            <label className="text-sm font-semibold text-card-foreground mb-1 block">Modo de sorteio</label>
            <Select value={mode} onValueChange={(v) => setMode(v as any)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="random">Ordem de chegada</SelectItem>
                <SelectItem value="position">Por posição</SelectItem>
                <SelectItem value="rating">Por nível técnico</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button onClick={handleDraw} className="gap-2" disabled={selected.length < 2}>
            <Shuffle size={18} />
            Sortear
          </Button>
        </div>

        {!teams && (
          <>
            <p className="text-sm text-muted-foreground">
              Selecione os jogadores ({selected.length} selecionados)
            </p>
            <div className="space-y-1">
              {players.map((p) => (
                <label
                  key={p.id}
                  className="flex items-center gap-3 px-3 py-2.5 bg-card rounded-md border border-border cursor-pointer hover:bg-secondary/50 transition-colors"
                >
                  <Checkbox
                    checked={selected.includes(p.id)}
                    onCheckedChange={() => toggle(p.id)}
                  />
                   <UserCircle className="text-muted-foreground shrink-0" size={28} />
                   <div className="flex-1 min-w-0">
                     <span className="font-semibold text-card-foreground">{p.name}</span>
                     {p.favoriteTeam && <p className="text-[10px] font-semibold text-muted-foreground truncate flex items-center gap-1"><TeamBadgeByName name={p.favoriteTeam} /> {p.favoriteTeam}</p>}
                   </div>
                   <span className="text-xs text-muted-foreground">{p.positions.join(", ")}</span>
                </label>
              ))}
            </div>
          </>
        )}

        {teams && (
          <div className="grid grid-cols-2 gap-4">
            {teams.map((team, idx) => (
              <div key={idx} className="bg-card rounded-lg border border-border overflow-hidden">
                <div className={`px-3 py-2 font-bold text-primary-foreground text-center ${idx === 0 ? "bg-destructive" : "header-gradient"}`}>
                  Time {idx === 0 ? "A" : "B"}
                </div>
                <div className="divide-y divide-border">
                  {team.map((id) => {
                    const p = getPlayer(id);
                    return (
                      <div key={id} className="px-3 py-2 flex items-center gap-2">
                        <UserCircle className="text-muted-foreground shrink-0" size={24} />
                        <div>
                          <p className="text-sm font-semibold text-card-foreground">{p.name}</p>
                          {p.favoriteTeam && <p className="text-[10px] font-semibold text-primary truncate">🛡️ {p.favoriteTeam}</p>}
                          <p className="text-xs text-muted-foreground">{p.positions.join(", ")}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
            <div className="col-span-2">
              <Button onClick={() => setTeams(null)} variant="outline" className="w-full">
                Novo Sorteio
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DrawPage;
