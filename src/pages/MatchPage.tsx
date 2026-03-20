import { useState, useEffect, useRef } from "react";
import { UserCircle, Play, Pause, Square } from "lucide-react";
import { TeamBadgeByName } from "@/components/TeamAutocomplete";
import AppHeader from "@/components/AppHeader";
import { getPlayers, sortTeams } from "@/lib/data";
import { Player, MatchEvent } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import JerseyIcon from "@/components/match/JerseyIcon";
import HistoryDots from "@/components/match/HistoryDots";
import GoldenGoalBadge from "@/components/match/GoldenGoalBadge";
import ColorPicker from "@/components/match/ColorPicker";
import FloatingActionButton from "@/components/match/FloatingActionButton";

type TabId = "chegada" | "partida" | "proximos";

const MatchPage = () => {
  const [activeTab, setActiveTab] = useState<TabId>("chegada");
  const [seconds, setSeconds] = useState(0);
  const [running, setRunning] = useState(false);
  const [homeScore, setHomeScore] = useState(0);
  const [awayScore, setAwayScore] = useState(0);
  const [events, setEvents] = useState<MatchEvent[]>([]);
  const [arrivedPlayers, setArrivedPlayers] = useState<string[]>([]);
  const [homePlayers, setHomePlayers] = useState<string[]>([]);
  const [awayPlayers, setAwayPlayers] = useState<string[]>([]);
  const [waitingPlayers, setWaitingPlayers] = useState<string[]>([]);
  const [homeColor, setHomeColor] = useState("#dc2626");
  const [awayColor, setAwayColor] = useState("#eab308");
  const [homeHistory, setHomeHistory] = useState<("win" | "loss" | "draw")[]>([]);
  const [awayHistory, setAwayHistory] = useState<("win" | "loss" | "draw")[]>([]);
  const [colorPickerTeam, setColorPickerTeam] = useState<"home" | "away" | null>(null);
  const [selectedPlayer, setSelectedPlayer] = useState<{ id: string; team: "home" | "away" } | null>(null);
  const [showRemoveConfirm, setShowRemoveConfirm] = useState(false);
  const [showAddPlayer, setShowAddPlayer] = useState(false);
  const [showDrawDialog, setShowDrawDialog] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const intervalRef = useRef<number | null>(null);
  const allPlayers = getPlayers();

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

  const hasGoldenGoal = (history: ("win" | "loss" | "draw")[]) => {
    const last3 = history.slice(-3);
    return last3.length === 3 && last3.every(r => r === "win");
  };

  // Add player to arrived list
  const handleAddPlayer = () => setShowAddPlayer(true);
  const addPlayerToList = (id: string) => {
    if (!arrivedPlayers.includes(id)) {
      setArrivedPlayers(prev => [...prev, id]);
    }
  };

  // Draw teams from arrived players
  const handleDrawTeams = () => {
    if (arrivedPlayers.length < 2) return;
    setShowDrawDialog(true);
  };

  const executeDraw = (mode: "random" | "position" | "rating") => {
    const [t1, t2] = sortTeams(arrivedPlayers, mode);
    setHomePlayers(t1);
    setAwayPlayers(t2);
    setWaitingPlayers([]);
    setShowDrawDialog(false);
    setActiveTab("partida");
  };

  const handleClearList = () => setShowClearConfirm(true);
  const confirmClear = () => {
    setArrivedPlayers([]);
    setHomePlayers([]);
    setAwayPlayers([]);
    setWaitingPlayers([]);
    setShowClearConfirm(false);
  };

  // Match actions
  const handleGoal = () => {
    if (!selectedPlayer) return;
    const { id, team } = selectedPlayer;
    setEvents(prev => [...prev, { id: Date.now().toString(), type: "goal", playerId: id, team, minute: Math.floor(seconds / 60) }]);
    if (team === "home") setHomeScore(s => s + 1); else setAwayScore(s => s + 1);
    setSelectedPlayer(null);
  };

  const handleOwnGoal = () => {
    if (!selectedPlayer) return;
    const { id, team } = selectedPlayer;
    setEvents(prev => [...prev, { id: Date.now().toString(), type: "own_goal", playerId: id, team, minute: Math.floor(seconds / 60) }]);
    if (team === "home") setAwayScore(s => s + 1); else setHomeScore(s => s + 1);
    setSelectedPlayer(null);
  };

  const handleRemove = () => setShowRemoveConfirm(true);
  const confirmRemove = () => {
    if (!selectedPlayer) return;
    const { id, team } = selectedPlayer;
    if (team === "home") setHomePlayers(prev => prev.filter(p => p !== id));
    else setAwayPlayers(prev => prev.filter(p => p !== id));
    setEvents(prev => [...prev, { id: Date.now().toString(), type: "removed", playerId: id, team, minute: Math.floor(seconds / 60) }]);
    setShowRemoveConfirm(false);
    setSelectedPlayer(null);
  };

  const handleQuit = () => {
    if (!selectedPlayer) return;
    const { id, team } = selectedPlayer;
    if (team === "home") setHomePlayers(prev => prev.filter(p => p !== id));
    else setAwayPlayers(prev => prev.filter(p => p !== id));
    setEvents(prev => [...prev, { id: Date.now().toString(), type: "quit", playerId: id, team, minute: Math.floor(seconds / 60) }]);
    setSelectedPlayer(null);
  };

  const endMatch = () => {
    setRunning(false);
    if (homeScore > awayScore) {
      setHomeHistory(prev => [...prev, "win"]);
      setAwayHistory(prev => [...prev, "loss"]);
    } else if (awayScore > homeScore) {
      setHomeHistory(prev => [...prev, "loss"]);
      setAwayHistory(prev => [...prev, "win"]);
    } else {
      setHomeHistory(prev => [...prev, "draw"]);
      setAwayHistory(prev => [...prev, "draw"]);
    }
    setHomeScore(0);
    setAwayScore(0);
    setSeconds(0);
    setEvents([]);
  };

  const availablePlayers = allPlayers.filter(p => p.status === "active" && !arrivedPlayers.includes(p.id));
  const selectedPlayerData = selectedPlayer ? getPlayer(selectedPlayer.id) : null;

  const tabs: { id: TabId; label: string }[] = [
    { id: "chegada", label: "ORDEM\nCHEGADA" },
    { id: "partida", label: "PARTIDA" },
    { id: "proximos", label: "PRÓXIMOS\nTIMES" },
  ];

  const renderPlayerRow = (id: string, team?: "home" | "away") => {
    const p = getPlayer(id);
    if (!p) return null;
    return (
      <button
        key={id}
        onClick={() => team ? setSelectedPlayer({ id, team }) : undefined}
        className="w-full flex items-center gap-2 px-3 py-2 rounded-md text-left transition-colors hover:bg-secondary/70 bg-card border border-border"
      >
        {p.position === "Goleiro" ? (
          <span className="text-lg">🧤</span>
        ) : (
          <UserCircle className="text-muted-foreground shrink-0" size={20} />
        )}
        <div className="flex-1 min-w-0">
          <span className="font-semibold text-sm text-card-foreground">{p.name}</span>
          {p.favoriteTeam && (
            <p className="text-[10px] font-semibold text-muted-foreground truncate flex items-center gap-1">
              <TeamBadgeByName name={p.favoriteTeam} /> {p.favoriteTeam}
            </p>
          )}
        </div>
        {p.position === "Goleiro" && (
          <span className="text-[9px] font-black px-1 py-0.5 rounded bg-accent text-accent-foreground">GL</span>
        )}
      </button>
    );
  };

  return (
    <div className="min-h-screen bg-background flex flex-col max-w-lg mx-auto pb-24">
      <AppHeader title="Partida" showBack />

      {/* Scoreboard with Jerseys */}
      <div className="bg-card border-b border-border p-4">
        <div className="flex items-center justify-center gap-3">
          {/* Home Jersey */}
          <div className="flex flex-col items-center gap-1">
            <HistoryDots results={homeHistory} />
            {hasGoldenGoal(homeHistory) && <GoldenGoalBadge />}
            <button onClick={() => setColorPickerTeam("home")} className="hover:scale-105 transition-transform">
              <JerseyIcon color={homeColor} size={70} />
            </button>
            <span className="text-xs font-bold text-card-foreground uppercase">Vermelho</span>
          </div>

          {/* Score */}
          <div className="text-center px-2">
            <div className="text-4xl font-black text-card-foreground tracking-wider">
              {homeScore} ⚽ {awayScore}
            </div>
            <div className="text-xl font-mono font-bold text-primary mt-1">
              {formatTime(seconds)}
            </div>
          </div>

          {/* Away Jersey */}
          <div className="flex flex-col items-center gap-1">
            <HistoryDots results={awayHistory} />
            {hasGoldenGoal(awayHistory) && <GoldenGoalBadge />}
            <button onClick={() => setColorPickerTeam("away")} className="hover:scale-105 transition-transform">
              <JerseyIcon color={awayColor} size={70} />
            </button>
            <span className="text-xs font-bold text-card-foreground uppercase">Amarelo</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-border bg-card">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 py-3 text-[11px] font-bold text-center whitespace-pre-line transition-colors ${
              activeTab === tab.id
                ? "text-primary border-b-2 border-primary"
                : "text-muted-foreground"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="flex-1 p-4">
        {activeTab === "chegada" && (
          <div>
            {arrivedPlayers.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <span className="text-5xl mb-3">⚽</span>
                <h3 className="text-lg font-bold text-primary">Ninguém chegou</h3>
                <p className="text-sm text-muted-foreground">Clique em adicionar para começar</p>
              </div>
            ) : (
              <div className="space-y-1">
                {arrivedPlayers.map((id, i) => {
                  const p = getPlayer(id);
                  if (!p) return null;
                  return (
                    <div key={id} className="flex items-center gap-2 px-3 py-2 rounded-md bg-card border border-border">
                      <span className="text-xs font-bold text-muted-foreground w-5">{i + 1}</span>
                      {p.position === "Goleiro" ? <span>🧤</span> : <UserCircle className="text-muted-foreground" size={18} />}
                      <span className="font-semibold text-sm text-card-foreground flex-1">{p.name}</span>
                      {p.position === "Goleiro" && (
                        <span className="text-[9px] font-black px-1 py-0.5 rounded bg-accent text-accent-foreground">GL</span>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {activeTab === "partida" && (
          <div>
            {homePlayers.length === 0 && awayPlayers.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <span className="text-5xl mb-3">🏟️</span>
                <h3 className="text-lg font-bold text-primary">Nenhum time formado</h3>
                <p className="text-sm text-muted-foreground">Adicione jogadores e sorteie os times</p>
              </div>
            ) : (
              <>
                {/* Match controls */}
                <div className="flex justify-center gap-3 mb-4">
                  <Button onClick={() => setRunning(!running)} variant={running ? "secondary" : "default"} size="sm" className="gap-1">
                    {running ? <Pause size={16} /> : <Play size={16} />}
                    {running ? "Pausar" : "Iniciar"}
                  </Button>
                  <Button onClick={endMatch} variant="destructive" size="sm" className="gap-1" disabled={!running && seconds === 0}>
                    <Square size={16} /> Finalizar
                  </Button>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <h3 className="font-bold text-sm mb-2 text-center" style={{ color: homeColor }}>
                      Time A ({homePlayers.length})
                    </h3>
                    <div className="space-y-1">
                      {homePlayers.map(id => renderPlayerRow(id, "home"))}
                    </div>
                  </div>
                  <div>
                    <h3 className="font-bold text-sm mb-2 text-center" style={{ color: awayColor }}>
                      Time B ({awayPlayers.length})
                    </h3>
                    <div className="space-y-1">
                      {awayPlayers.map(id => renderPlayerRow(id, "away"))}
                    </div>
                  </div>
                </div>

                {/* Events */}
                {events.length > 0 && (
                  <div className="mt-4 space-y-1">
                    <h3 className="font-bold text-card-foreground text-sm">Eventos ({events.length})</h3>
                    {[...events].reverse().map(e => (
                      <div key={e.id} className="bg-card rounded-md p-2 border border-border flex items-center gap-2 text-xs">
                        <span className="font-mono text-muted-foreground">{e.minute}'</span>
                        <span>
                          {e.type === "goal" && "⚽"}{e.type === "own_goal" && "🔄"}
                          {e.type === "removed" && "❌"}{e.type === "quit" && "🚪"}
                        </span>
                        <span className="font-semibold text-card-foreground">{getPlayer(e.playerId)?.name}</span>
                        {e.type === "own_goal" && <span className="text-muted-foreground">(contra)</span>}
                        <span className="text-muted-foreground ml-auto">{e.team === "home" ? "A" : "B"}</span>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {activeTab === "proximos" && (
          <div>
            {waitingPlayers.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <span className="text-5xl mb-3">⏳</span>
                <h3 className="text-lg font-bold text-primary">Sem próximos times</h3>
                <p className="text-sm text-muted-foreground">Jogadores extras aparecerão aqui</p>
              </div>
            ) : (
              <div className="space-y-1">
                {waitingPlayers.map(id => renderPlayerRow(id))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* FAB */}
      <FloatingActionButton
        onAddPlayer={handleAddPlayer}
        onDrawTeams={handleDrawTeams}
        onClearList={handleClearList}
      />

      {/* Color Picker */}
      <ColorPicker
        open={!!colorPickerTeam}
        onOpenChange={() => setColorPickerTeam(null)}
        onSelect={(c) => colorPickerTeam === "home" ? setHomeColor(c) : setAwayColor(c)}
        title={colorPickerTeam === "home" ? "Cor Time A" : "Cor Time B"}
      />

      {/* Add Player Dialog */}
      <Dialog open={showAddPlayer} onOpenChange={setShowAddPlayer}>
        <DialogContent className="max-w-xs max-h-[70vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Adicionar Jogador</DialogTitle>
            <DialogDescription>Selecione quem chegou para jogar</DialogDescription>
          </DialogHeader>
          <div className="space-y-1">
            {availablePlayers.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-4">Todos os jogadores já foram adicionados</p>
            )}
            {availablePlayers.map(p => (
              <button
                key={p.id}
                onClick={() => { addPlayerToList(p.id); }}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-md hover:bg-secondary/70 bg-card border border-border text-left"
              >
                {p.position === "Goleiro" ? <span>🧤</span> : <UserCircle className="text-muted-foreground" size={18} />}
                <span className="font-semibold text-sm text-card-foreground">{p.name}</span>
              </button>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      {/* Draw Dialog */}
      <Dialog open={showDrawDialog} onOpenChange={setShowDrawDialog}>
        <DialogContent className="max-w-xs">
          <DialogHeader>
            <DialogTitle>Sortear Times</DialogTitle>
            <DialogDescription>Escolha o modo de sorteio ({arrivedPlayers.length} jogadores)</DialogDescription>
          </DialogHeader>
          <div className="space-y-2 pt-1">
            <button onClick={() => executeDraw("random")} className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-primary/10 hover:bg-primary/20 transition-colors text-left">
              <span className="text-xl">🎲</span>
              <span className="font-bold text-card-foreground">Aleatório</span>
            </button>
            <button onClick={() => executeDraw("position")} className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-secondary hover:bg-secondary/80 transition-colors text-left">
              <span className="text-xl">📋</span>
              <span className="font-bold text-card-foreground">Por Posição</span>
            </button>
            <button onClick={() => executeDraw("rating")} className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-accent/20 hover:bg-accent/30 transition-colors text-left">
              <span className="text-xl">⭐</span>
              <span className="font-bold text-card-foreground">Por Nível Técnico</span>
            </button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Clear Confirm */}
      <AlertDialog open={showClearConfirm} onOpenChange={setShowClearConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Limpar Lista</AlertDialogTitle>
            <AlertDialogDescription>Tem certeza que deseja remover todos os jogadores da lista?</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmClear}>Confirmar</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Player Action Menu */}
      <Dialog open={!!selectedPlayer && !showRemoveConfirm} onOpenChange={(open) => { if (!open) setSelectedPlayer(null); }}>
        <DialogContent className="max-w-xs">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {selectedPlayerData?.position === "Goleiro" && <span>🧤</span>}
              {selectedPlayerData?.name}
            </DialogTitle>
            <DialogDescription>{selectedPlayer?.team === "home" ? "Time A" : "Time B"}</DialogDescription>
          </DialogHeader>
          <div className="space-y-2 pt-1">
            <button onClick={handleGoal} className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-primary/10 hover:bg-primary/20 transition-colors text-left">
              <span className="text-xl">⚽</span><span className="font-bold text-card-foreground">Gol</span>
            </button>
            <button onClick={handleOwnGoal} className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-secondary hover:bg-secondary/80 transition-colors text-left">
              <span className="text-xl">🔄</span><span className="font-bold text-card-foreground">Gol Contra</span>
            </button>
            <button onClick={handleRemove} className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-destructive/10 hover:bg-destructive/20 transition-colors text-left">
              <span className="text-xl">❌</span><span className="font-bold text-card-foreground">Remover</span>
            </button>
            <button onClick={handleQuit} className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-destructive/10 hover:bg-destructive/20 transition-colors text-left">
              <span className="text-xl">🚪</span><span className="font-bold text-card-foreground">Desistir</span>
            </button>
            <button onClick={() => setSelectedPlayer(null)} className="w-full text-center py-2 text-muted-foreground text-sm">Cancelar</button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Remove Confirmation */}
      <AlertDialog open={showRemoveConfirm} onOpenChange={setShowRemoveConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remover Jogador</AlertDialogTitle>
            <AlertDialogDescription>Tem certeza que deseja remover {selectedPlayerData?.name}?</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setShowRemoveConfirm(false)}>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmRemove}>Confirmar</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default MatchPage;
