import { useState, useEffect, useRef } from "react";
import { Play, Pause, Square, UserCircle } from "lucide-react";
import AppHeader from "@/components/AppHeader";
import { getPlayers } from "@/lib/data";
import { Player, MatchEvent } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

const MatchPage = () => {
  const [seconds, setSeconds] = useState(0);
  const [running, setRunning] = useState(false);
  const [homeScore, setHomeScore] = useState(0);
  const [awayScore, setAwayScore] = useState(0);
  const [events, setEvents] = useState<MatchEvent[]>([]);
  const [homePlayers, setHomePlayers] = useState<string[]>([]);
  const [awayPlayers, setAwayPlayers] = useState<string[]>([]);
  const [removedPlayers, setRemovedPlayers] = useState<string[]>([]);
  const [quitPlayers, setQuitPlayers] = useState<string[]>([]);
  const [selectedPlayer, setSelectedPlayer] = useState<{ id: string; team: "home" | "away" } | null>(null);
  const [showRemoveConfirm, setShowRemoveConfirm] = useState(false);
  const intervalRef = useRef<number | null>(null);
  const allPlayers = getPlayers();

  // Initialize teams from first 10 players
  useEffect(() => {
    if (homePlayers.length === 0 && awayPlayers.length === 0) {
      const active = allPlayers.filter(p => p.status === "active");
      const half = Math.ceil(active.length / 2);
      setHomePlayers(active.slice(0, half).map(p => p.id));
      setAwayPlayers(active.slice(half).map(p => p.id));
    }
  }, []);

  useEffect(() => {
    if (running) {
      intervalRef.current = window.setInterval(() => setSeconds(s => s + 1), 1000);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [running]);

  const formatTime = (s: number) => {
    const min = Math.floor(s / 60).toString().padStart(2, "0");
    const sec = (s % 60).toString().padStart(2, "0");
    return `${min}:${sec}`;
  };

  const getPlayer = (id: string) => allPlayers.find(p => p.id === id);

  const handleGoal = () => {
    if (!selectedPlayer) return;
    const { id, team } = selectedPlayer;
    const event: MatchEvent = {
      id: Date.now().toString(), type: "goal", playerId: id, team, minute: Math.floor(seconds / 60),
    };
    setEvents(prev => [...prev, event]);
    if (team === "home") setHomeScore(s => s + 1);
    else setAwayScore(s => s + 1);
    setSelectedPlayer(null);
  };

  const handleOwnGoal = () => {
    if (!selectedPlayer) return;
    const { id, team } = selectedPlayer;
    const event: MatchEvent = {
      id: Date.now().toString(), type: "own_goal", playerId: id, team, minute: Math.floor(seconds / 60),
    };
    setEvents(prev => [...prev, event]);
    // Own goal gives point to opposing team
    if (team === "home") setAwayScore(s => s + 1);
    else setHomeScore(s => s + 1);
    setSelectedPlayer(null);
  };

  const handleRemove = () => {
    setShowRemoveConfirm(true);
  };

  const confirmRemove = () => {
    if (!selectedPlayer) return;
    const { id, team } = selectedPlayer;
    setRemovedPlayers(prev => [...prev, id]);
    if (team === "home") setHomePlayers(prev => prev.filter(p => p !== id));
    else setAwayPlayers(prev => prev.filter(p => p !== id));
    const event: MatchEvent = {
      id: Date.now().toString(), type: "removed", playerId: id, team, minute: Math.floor(seconds / 60),
    };
    setEvents(prev => [...prev, event]);
    setShowRemoveConfirm(false);
    setSelectedPlayer(null);
  };

  const handleQuit = () => {
    if (!selectedPlayer) return;
    const { id, team } = selectedPlayer;
    setQuitPlayers(prev => [...prev, id]);
    if (team === "home") setHomePlayers(prev => prev.filter(p => p !== id));
    else setAwayPlayers(prev => prev.filter(p => p !== id));
    const event: MatchEvent = {
      id: Date.now().toString(), type: "quit", playerId: id, team, minute: Math.floor(seconds / 60),
    };
    setEvents(prev => [...prev, event]);
    setSelectedPlayer(null);
  };

  const reset = () => {
    setRunning(false);
    setSeconds(0);
    setHomeScore(0);
    setAwayScore(0);
    setEvents([]);
    setRemovedPlayers([]);
    setQuitPlayers([]);
    const active = allPlayers.filter(p => p.status === "active");
    const half = Math.ceil(active.length / 2);
    setHomePlayers(active.slice(0, half).map(p => p.id));
    setAwayPlayers(active.slice(half).map(p => p.id));
  };

  const renderPlayerList = (playerIds: string[], team: "home" | "away") => (
    <div className="space-y-1">
      {playerIds.map(id => {
        const p = getPlayer(id);
        if (!p) return null;
        const isGoalkeeper = p.position === "Goleiro";
        return (
          <button
            key={id}
            onClick={() => setSelectedPlayer({ id, team })}
            className={`w-full flex items-center gap-2 px-3 py-2 rounded-md text-left transition-colors hover:bg-secondary/70 ${
              isGoalkeeper ? "bg-accent/15" : "bg-card"
            } border border-border`}
          >
            {isGoalkeeper ? (
              <span className="text-lg">🧤</span>
            ) : (
              <UserCircle className="text-muted-foreground shrink-0" size={20} />
            )}
            <span className="font-semibold text-sm text-card-foreground flex-1">{p.name}</span>
            {isGoalkeeper && (
              <span className="text-[9px] font-black px-1 py-0.5 rounded bg-accent text-accent-foreground">GL</span>
            )}
          </button>
        );
      })}
    </div>
  );

  const selectedPlayerData = selectedPlayer ? getPlayer(selectedPlayer.id) : null;

  return (
    <div className="min-h-screen bg-background flex flex-col max-w-lg mx-auto">
      <AppHeader title="Partida" showBack />

      {/* Scoreboard */}
      <div className="bg-card border-b border-border p-5">
        <div className="flex items-center justify-center gap-4">
          <div className="text-center">
            <div className="w-14 h-18 bg-destructive/80 rounded-md mx-auto mb-1 flex items-center justify-center py-3">
              <span className="text-primary-foreground text-[10px] font-bold">TIME A</span>
            </div>
          </div>
          <div className="text-center">
            <div className="text-5xl font-black text-card-foreground tracking-wider">
              {homeScore} ⚽ {awayScore}
            </div>
            <div className="text-2xl font-mono font-bold text-primary mt-1 animate-pulse-soft">
              {formatTime(seconds)}
            </div>
          </div>
          <div className="text-center">
            <div className="w-14 h-18 bg-primary/80 rounded-md mx-auto mb-1 flex items-center justify-center py-3">
              <span className="text-primary-foreground text-[10px] font-bold">TIME B</span>
            </div>
          </div>
        </div>

        <div className="flex justify-center gap-3 mt-4">
          <Button onClick={() => setRunning(!running)} variant={running ? "secondary" : "default"} size="lg" className="gap-2">
            {running ? <Pause size={18} /> : <Play size={18} />}
            {running ? "Pausar" : "Iniciar"}
          </Button>
          <Button onClick={reset} variant="destructive" size="lg" className="gap-2">
            <Square size={18} /> Resetar
          </Button>
        </div>
      </div>

      {/* Teams */}
      <div className="grid grid-cols-2 gap-3 p-4">
        <div>
          <h3 className="font-bold text-sm text-destructive mb-2 text-center">Time A ({homePlayers.length})</h3>
          {renderPlayerList(homePlayers, "home")}
        </div>
        <div>
          <h3 className="font-bold text-sm text-primary mb-2 text-center">Time B ({awayPlayers.length})</h3>
          {renderPlayerList(awayPlayers, "away")}
        </div>
      </div>

      {/* Events log */}
      <div className="flex-1 px-4 pb-4 space-y-2">
        <h3 className="font-bold text-card-foreground">Eventos ({events.length})</h3>
        {events.length === 0 && (
          <p className="text-muted-foreground text-sm">Clique no nome de um jogador para registrar ações.</p>
        )}
        {[...events].reverse().map((e) => (
          <div key={e.id} className="bg-card rounded-md p-2.5 border border-border flex items-center gap-2 text-sm">
            <span className="font-mono text-muted-foreground text-xs">{e.minute}'</span>
            <span>
              {e.type === "goal" && "⚽"}
              {e.type === "own_goal" && "🔄"}
              {e.type === "yellow_card" && "🟨"}
              {e.type === "red_card" && "🟥"}
              {e.type === "removed" && "❌"}
              {e.type === "quit" && "🚪"}
            </span>
            <span className="font-semibold text-card-foreground">{getPlayer(e.playerId)?.name}</span>
            {e.type === "own_goal" && <span className="text-xs text-muted-foreground">(contra)</span>}
            <span className="text-muted-foreground ml-auto text-xs">
              {e.team === "home" ? "Time A" : "Time B"}
            </span>
          </div>
        ))}
      </div>

      {/* Player Action Menu */}
      <Dialog open={!!selectedPlayer && !showRemoveConfirm} onOpenChange={(open) => { if (!open) setSelectedPlayer(null); }}>
        <DialogContent className="max-w-xs">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {selectedPlayerData?.position === "Goleiro" && <span>🧤</span>}
              Ações para: {selectedPlayerData?.name}
            </DialogTitle>
            <DialogDescription>
              {selectedPlayer?.team === "home" ? "Time A" : "Time B"}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2 pt-1">
            <button onClick={handleGoal} className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-primary/10 hover:bg-primary/20 transition-colors text-left">
              <span className="text-xl">⚽</span>
              <span className="font-bold text-card-foreground">Gol</span>
            </button>
            <button onClick={handleOwnGoal} className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-secondary hover:bg-secondary/80 transition-colors text-left">
              <span className="text-xl">🔄</span>
              <span className="font-bold text-card-foreground">Gol Contra</span>
            </button>
            <button onClick={handleRemove} className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-destructive/10 hover:bg-destructive/20 transition-colors text-left">
              <span className="text-xl">❌</span>
              <span className="font-bold text-card-foreground">Remover da Partida</span>
            </button>
            <button onClick={handleQuit} className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-destructive/10 hover:bg-destructive/20 transition-colors text-left">
              <span className="text-xl">🚪</span>
              <span className="font-bold text-card-foreground">Desistir da Partida</span>
            </button>
            <button onClick={() => setSelectedPlayer(null)} className="w-full flex items-center justify-center py-2 text-muted-foreground text-sm">
              Cancelar
            </button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Remove Confirmation */}
      <AlertDialog open={showRemoveConfirm} onOpenChange={setShowRemoveConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remover Jogador</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja remover {selectedPlayerData?.name} da partida?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => { setShowRemoveConfirm(false); }}>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmRemove}>Confirmar</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default MatchPage;
