import { useState } from "react";
import { Plus, Search, UserCircle } from "lucide-react";
import AppHeader from "@/components/AppHeader";
import StarRating from "@/components/StarRating";
import PositionBadge from "@/components/PositionBadge";
import { getPlayers, addPlayer } from "@/lib/data";
import { Player, PlayerPosition } from "@/lib/types";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const DETAIL_POSITIONS = ["GL", "ZG", "LD", "LE", "VOL", "MD", "MO", "ME", "PD", "CA", "SA", "ATA"];

const PlayersPage = () => {
  const [players, setPlayers] = useState<Player[]>(getPlayers());
  const [search, setSearch] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [newName, setNewName] = useState("");
  const [newRating, setNewRating] = useState("3");
  const [newPosition, setNewPosition] = useState<PlayerPosition>("Linha");
  const [newDetailPos, setNewDetailPos] = useState("VOL");

  const filtered = players.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleAdd = () => {
    if (!newName.trim()) return;
    addPlayer({
      name: newName.trim(),
      rating: parseInt(newRating),
      position: newPosition,
      positions: newPosition === "Goleiro" ? ["GL"] : [newDetailPos],
      status: "active",
    });
    setPlayers(getPlayers());
    setNewName("");
    setNewPosition("Linha");
    setNewDetailPos("VOL");
    setShowAdd(false);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col max-w-lg mx-auto">
      <AppHeader
        title="Peladeiros"
        showBack
        rightAction={
          <button onClick={() => setShowSearch(!showSearch)} className="text-primary-foreground">
            <Search size={22} />
          </button>
        }
      />

      {showSearch && (
        <div className="px-4 pt-3">
          <Input
            placeholder="Buscar jogador..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            autoFocus
            className="bg-card"
          />
        </div>
      )}

      <main className="flex-1 divide-y divide-border">
        {filtered.map((player) => {
          const isGoalkeeper = player.position === "Goleiro";
          return (
            <div
              key={player.id}
              className={`flex items-center gap-3 px-4 py-3 transition-colors ${
                isGoalkeeper ? "bg-accent/20" : "bg-card"
              } hover:bg-secondary/50`}
            >
              <div className={`w-14 h-14 rounded-full flex items-center justify-center shrink-0 overflow-hidden ${
                isGoalkeeper ? "bg-accent/30" : "bg-muted"
              }`}>
                {isGoalkeeper ? (
                  <span className="text-2xl">🧤</span>
                ) : (
                  <UserCircle className="text-muted-foreground" size={40} />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-bold text-card-foreground truncate">{player.name}</p>
                  {isGoalkeeper && (
                    <span className="text-[10px] font-black px-1.5 py-0.5 rounded bg-accent text-accent-foreground shrink-0">
                      GOLEIRO
                    </span>
                  )}
                </div>
                <StarRating rating={player.rating} />
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs text-primary font-semibold">
                  {player.status === "active" ? "Ativo" : "Inativo"}
                </span>
              </div>
              <div className="flex gap-1">
                {player.positions.map((pos) => (
                  <PositionBadge key={pos} position={pos} />
                ))}
              </div>
            </div>
          );
        })}
      </main>

      <Dialog open={showAdd} onOpenChange={setShowAdd}>
        <DialogTrigger asChild>
          <button className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-primary text-primary-foreground shadow-lg flex items-center justify-center hover:opacity-90 transition-opacity z-50">
            <Plus size={28} />
          </button>
        </DialogTrigger>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Novo Peladeiro</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            <Input
              placeholder="Nome do jogador"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
            />
            <div>
              <label className="text-sm font-semibold text-card-foreground mb-1 block">Posição</label>
              <div className="flex gap-2">
                {(["Linha", "Goleiro"] as PlayerPosition[]).map((pos) => (
                  <button
                    key={pos}
                    onClick={() => setNewPosition(pos)}
                    className={`flex-1 py-3 rounded-lg border-2 font-bold text-sm transition-colors ${
                      newPosition === pos
                        ? pos === "Goleiro"
                          ? "border-accent bg-accent/20 text-accent-foreground"
                          : "border-primary bg-primary/10 text-primary"
                        : "border-border bg-card text-muted-foreground"
                    }`}
                  >
                    {pos === "Goleiro" ? "🧤 Goleiro" : "⚽ Linha"}
                  </button>
                ))}
              </div>
            </div>
            {newPosition === "Linha" && (
              <Select value={newDetailPos} onValueChange={setNewDetailPos}>
                <SelectTrigger>
                  <SelectValue placeholder="Posição detalhada" />
                </SelectTrigger>
                <SelectContent>
                  {DETAIL_POSITIONS.filter(p => p !== "GL").map((pos) => (
                    <SelectItem key={pos} value={pos}>{pos}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
            <Select value={newRating} onValueChange={setNewRating}>
              <SelectTrigger>
                <SelectValue placeholder="Nível" />
              </SelectTrigger>
              <SelectContent>
                {[1, 2, 3].map((r) => (
                  <SelectItem key={r} value={r.toString()}>{"⭐".repeat(r)}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button onClick={handleAdd} className="w-full">Adicionar</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PlayersPage;
