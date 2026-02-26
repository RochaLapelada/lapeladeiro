import { useState } from "react";
import { Plus, Search, UserCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import AppHeader from "@/components/AppHeader";
import StarRating from "@/components/StarRating";
import PositionBadge from "@/components/PositionBadge";
import { getPlayers, addPlayer, deletePlayer } from "@/lib/data";
import { Player } from "@/lib/types";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const POSITIONS = ["GL", "ZG", "LD", "LE", "VOL", "MD", "MO", "ME", "PD", "CA", "SA", "ATA"];

const PlayersPage = () => {
  const [players, setPlayers] = useState<Player[]>(getPlayers());
  const [search, setSearch] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [newName, setNewName] = useState("");
  const [newRating, setNewRating] = useState("3");
  const [newPosition, setNewPosition] = useState("VOL");

  const filtered = players.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleAdd = () => {
    if (!newName.trim()) return;
    addPlayer({
      name: newName.trim(),
      rating: parseInt(newRating),
      positions: [newPosition],
      status: "active",
    });
    setPlayers(getPlayers());
    setNewName("");
    setShowAdd(false);
  };

  const handleDelete = (id: string) => {
    deletePlayer(id);
    setPlayers(getPlayers());
  };

  return (
    <div className="min-h-screen bg-background flex flex-col max-w-lg mx-auto">
      <AppHeader
        title="Peladeiros"
        showBack
        rightAction={
          <button onClick={() => setSearch(s => s ? "" : " ")} className="text-primary-foreground">
            <Search size={22} />
          </button>
        }
      />

      {search !== "" && (
        <div className="px-4 pt-3">
          <Input
            placeholder="Buscar jogador..."
            value={search.trim()}
            onChange={(e) => setSearch(e.target.value)}
            autoFocus
            className="bg-card"
          />
        </div>
      )}

      <main className="flex-1 divide-y divide-border">
        {filtered.map((player) => (
          <div
            key={player.id}
            className="flex items-center gap-3 px-4 py-3 bg-card hover:bg-secondary/50 transition-colors"
          >
            <div className="w-14 h-14 rounded-full bg-muted flex items-center justify-center shrink-0 overflow-hidden">
              <UserCircle className="text-muted-foreground" size={40} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-card-foreground truncate">{player.name}</p>
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
        ))}
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
            <Select value={newPosition} onValueChange={setNewPosition}>
              <SelectTrigger>
                <SelectValue placeholder="Posição" />
              </SelectTrigger>
              <SelectContent>
                {POSITIONS.map((pos) => (
                  <SelectItem key={pos} value={pos}>{pos}</SelectItem>
                ))}
              </SelectContent>
            </Select>
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
