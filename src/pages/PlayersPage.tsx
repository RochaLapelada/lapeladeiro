import { useState } from "react";
import { Plus, Search, UserCircle, Star, Pencil, Trash2 } from "lucide-react";
import AppHeader from "@/components/AppHeader";
import StarRating from "@/components/StarRating";
import PositionBadge from "@/components/PositionBadge";
import { getPlayers, addPlayer, deletePlayer, updatePlayer } from "@/lib/data";
import { Player, PlayerPosition } from "@/lib/types";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
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
  const [newStar, setNewStar] = useState(false);

  // Edit state
  const [editPlayer, setEditPlayer] = useState<Player | null>(null);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [editName, setEditName] = useState("");
  const [editPosition, setEditPosition] = useState<PlayerPosition>("Linha");
  const [editDetailPos, setEditDetailPos] = useState("VOL");
  const [editRating, setEditRating] = useState("3");
  const [editStar, setEditStar] = useState(false);

  // Action menu / delete confirm
  const [actionPlayer, setActionPlayer] = useState<Player | null>(null);
  const [showActions, setShowActions] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const filtered = players
    .filter(p => p.name.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      if (a.star && !b.star) return -1;
      if (!a.star && b.star) return 1;
      return a.name.localeCompare(b.name);
    });

  const handleAdd = () => {
    if (!newName.trim()) return;
    addPlayer({
      name: newName.trim(),
      rating: parseInt(newRating),
      position: newPosition,
      positions: newPosition === "Goleiro" ? ["GL"] : [newDetailPos],
      status: "active",
      star: newStar,
    });
    setPlayers(getPlayers());
    setNewName("");
    setNewPosition("Linha");
    setNewDetailPos("VOL");
    setNewStar(false);
    setShowAdd(false);
  };

  const openActions = (player: Player) => {
    setActionPlayer(player);
    setShowActions(true);
  };

  const openEdit = () => {
    if (!actionPlayer) return;
    setEditPlayer(actionPlayer);
    setEditName(actionPlayer.name);
    setEditPosition(actionPlayer.position);
    setEditDetailPos(actionPlayer.positions[0] || "VOL");
    setEditRating(actionPlayer.rating.toString());
    setEditStar(actionPlayer.star);
    setShowActions(false);
    setShowEditDialog(true);
  };

  const handleEdit = () => {
    if (!editPlayer || !editName.trim()) return;
    updatePlayer(editPlayer.id, {
      name: editName.trim(),
      position: editPosition,
      positions: editPosition === "Goleiro" ? ["GL"] : [editDetailPos],
      rating: parseInt(editRating),
      star: editStar,
    });
    setPlayers(getPlayers());
    setShowEditDialog(false);
    setEditPlayer(null);
  };

  const handleDelete = () => {
    if (!actionPlayer) return;
    deletePlayer(actionPlayer.id);
    setPlayers(getPlayers());
    setShowDeleteConfirm(false);
    setActionPlayer(null);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col max-w-lg mx-auto">
      <AppHeader
        title="Jogadores"
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

      {/* Add button at top */}
      <div className="px-4 pt-4">
        <Button onClick={() => setShowAdd(true)} className="w-full gap-2">
          <Plus size={18} /> Cadastrar Novo Jogador
        </Button>
      </div>

      <main className="flex-1 divide-y divide-border mt-2">
        {filtered.map((player) => {
          const isGoalkeeper = player.position === "Goleiro";
          return (
            <button
              key={player.id}
              onClick={() => openActions(player)}
              className={`w-full flex items-center gap-3 px-4 py-3 transition-colors text-left ${
                isGoalkeeper ? "bg-accent/20" : "bg-card"
              } hover:bg-secondary/50`}
            >
              <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 overflow-hidden ${
                isGoalkeeper ? "bg-accent/30" : "bg-muted"
              }`}>
                {isGoalkeeper ? (
                  <span className="text-xl">🧤</span>
                ) : (
                  <UserCircle className="text-muted-foreground" size={36} />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <p className="font-bold text-card-foreground truncate">{player.name}</p>
                  {player.star && <Star className="text-yellow-500 fill-yellow-500 shrink-0" size={16} />}
                  {isGoalkeeper && (
                    <span className="text-[10px] font-black px-1.5 py-0.5 rounded bg-accent text-accent-foreground shrink-0">
                      GOLEIRO
                    </span>
                  )}
                </div>
                <StarRating rating={player.rating} />
              </div>
              <div className="flex gap-1">
                {player.positions.map((pos) => (
                  <PositionBadge key={pos} position={pos} />
                ))}
              </div>
            </button>
          );
        })}
      </main>

      {/* Add Dialog */}
      <Dialog open={showAdd} onOpenChange={setShowAdd}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Cadastrar Novo Jogador</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            <Input placeholder="Nome do jogador" value={newName} onChange={(e) => setNewName(e.target.value)} />
            <div>
              <label className="text-sm font-semibold text-card-foreground mb-1 block">Posição</label>
              <div className="flex gap-2">
                {(["Linha", "Goleiro"] as PlayerPosition[]).map((pos) => (
                  <button key={pos} onClick={() => setNewPosition(pos)}
                    className={`flex-1 py-3 rounded-lg border-2 font-bold text-sm transition-colors ${
                      newPosition === pos
                        ? pos === "Goleiro" ? "border-accent bg-accent/20 text-accent-foreground" : "border-primary bg-primary/10 text-primary"
                        : "border-border bg-card text-muted-foreground"
                    }`}>{pos === "Goleiro" ? "🧤 Goleiro" : "⚽ Linha"}</button>
                ))}
              </div>
            </div>
            {newPosition === "Linha" && (
              <Select value={newDetailPos} onValueChange={setNewDetailPos}>
                <SelectTrigger><SelectValue placeholder="Posição detalhada" /></SelectTrigger>
                <SelectContent>
                  {DETAIL_POSITIONS.filter(p => p !== "GL").map((pos) => (
                    <SelectItem key={pos} value={pos}>{pos}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
            <Select value={newRating} onValueChange={setNewRating}>
              <SelectTrigger><SelectValue placeholder="Nível" /></SelectTrigger>
              <SelectContent>
                {[1, 2, 3].map((r) => (
                  <SelectItem key={r} value={r.toString()}>{"⭐".repeat(r)}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div>
              <label className="text-sm font-semibold text-card-foreground mb-1 block">Estrela (Destaque)</label>
              <div className="flex gap-2">
                <button onClick={() => setNewStar(false)}
                  className={`flex-1 py-3 rounded-lg border-2 font-bold text-sm transition-colors ${!newStar ? "border-primary bg-primary/10 text-primary" : "border-border bg-card text-muted-foreground"}`}>Não</button>
                <button onClick={() => setNewStar(true)}
                  className={`flex-1 py-3 rounded-lg border-2 font-bold text-sm transition-colors ${newStar ? "border-yellow-500 bg-yellow-500/10 text-yellow-600" : "border-border bg-card text-muted-foreground"}`}>⭐ Sim</button>
              </div>
            </div>
            <Button onClick={handleAdd} className="w-full">Salvar</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Action Menu */}
      <Dialog open={showActions} onOpenChange={setShowActions}>
        <DialogContent className="max-w-xs">
          <DialogHeader>
            <DialogTitle>Jogador: {actionPlayer?.name}</DialogTitle>
          </DialogHeader>
          <div className="space-y-2 pt-2">
            <Button variant="outline" className="w-full justify-start gap-2" onClick={openEdit}>
              <Pencil size={16} /> Editar
            </Button>
            <Button variant="destructive" className="w-full justify-start gap-2" onClick={() => { setShowActions(false); setShowDeleteConfirm(true); }}>
              <Trash2 size={16} /> Remover Jogador
            </Button>
            <Button variant="ghost" className="w-full" onClick={() => setShowActions(false)}>
              Cancelar
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Editar Jogador</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            <Input placeholder="Nome do jogador" value={editName} onChange={(e) => setEditName(e.target.value)} />
            <div>
              <label className="text-sm font-semibold text-card-foreground mb-1 block">Posição</label>
              <div className="flex gap-2">
                {(["Linha", "Goleiro"] as PlayerPosition[]).map((pos) => (
                  <button key={pos} onClick={() => setEditPosition(pos)}
                    className={`flex-1 py-3 rounded-lg border-2 font-bold text-sm transition-colors ${
                      editPosition === pos
                        ? pos === "Goleiro" ? "border-accent bg-accent/20 text-accent-foreground" : "border-primary bg-primary/10 text-primary"
                        : "border-border bg-card text-muted-foreground"
                    }`}>{pos === "Goleiro" ? "🧤 Goleiro" : "⚽ Linha"}</button>
                ))}
              </div>
            </div>
            {editPosition === "Linha" && (
              <Select value={editDetailPos} onValueChange={setEditDetailPos}>
                <SelectTrigger><SelectValue placeholder="Posição detalhada" /></SelectTrigger>
                <SelectContent>
                  {DETAIL_POSITIONS.filter(p => p !== "GL").map((pos) => (
                    <SelectItem key={pos} value={pos}>{pos}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
            <Select value={editRating} onValueChange={setEditRating}>
              <SelectTrigger><SelectValue placeholder="Nível" /></SelectTrigger>
              <SelectContent>
                {[1, 2, 3].map((r) => (
                  <SelectItem key={r} value={r.toString()}>{"⭐".repeat(r)}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div>
              <label className="text-sm font-semibold text-card-foreground mb-1 block">Estrela (Destaque)</label>
              <div className="flex gap-2">
                <button onClick={() => setEditStar(false)}
                  className={`flex-1 py-3 rounded-lg border-2 font-bold text-sm transition-colors ${!editStar ? "border-primary bg-primary/10 text-primary" : "border-border bg-card text-muted-foreground"}`}>Não</button>
                <button onClick={() => setEditStar(true)}
                  className={`flex-1 py-3 rounded-lg border-2 font-bold text-sm transition-colors ${editStar ? "border-yellow-500 bg-yellow-500/10 text-yellow-600" : "border-border bg-card text-muted-foreground"}`}>⭐ Sim</button>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="flex-1" onClick={() => setShowEditDialog(false)}>Cancelar</Button>
              <Button className="flex-1" onClick={handleEdit}>Salvar Alterações</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remover Jogador</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja remover <strong>{actionPlayer?.name}</strong>?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => { setShowDeleteConfirm(false); setActionPlayer(null); }}>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Confirmar</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default PlayersPage;
