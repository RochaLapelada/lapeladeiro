import { useState, useEffect, useRef } from "react";
import { Play, Pause, Square, Plus } from "lucide-react";
import AppHeader from "@/components/AppHeader";
import { getPlayers } from "@/lib/data";
import { Player, MatchEvent } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const MatchPage = () => {
  const [seconds, setSeconds] = useState(0);
  const [running, setRunning] = useState(false);
  const [homeScore, setHomeScore] = useState(0);
  const [awayScore, setAwayScore] = useState(0);
  const [events, setEvents] = useState<MatchEvent[]>([]);
  const [showEventDialog, setShowEventDialog] = useState(false);
  const [eventType, setEventType] = useState<"goal" | "yellow_card" | "red_card">("goal");
  const [eventTeam, setEventTeam] = useState<"home" | "away">("home");
  const [selectedPlayer, setSelectedPlayer] = useState("");
  const intervalRef = useRef<number | null>(null);
  const players = getPlayers();

  useEffect(() => {
    if (running) {
      intervalRef.current = window.setInterval(() => {
        setSeconds((s) => s + 1);
      }, 1000);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [running]);

  const formatTime = (s: number) => {
    const min = Math.floor(s / 60).toString().padStart(2, "0");
    const sec = (s % 60).toString().padStart(2, "0");
    return `${min}:${sec}`;
  };

  const handleAddEvent = () => {
    if (!selectedPlayer) return;
    const event: MatchEvent = {
      id: Date.now().toString(),
      type: eventType,
      playerId: selectedPlayer,
      team: eventTeam,
      minute: Math.floor(seconds / 60),
    };
    setEvents([...events, event]);
    if (eventType === "goal") {
      if (eventTeam === "home") setHomeScore((s) => s + 1);
      else setAwayScore((s) => s + 1);
    }
    setShowEventDialog(false);
    setSelectedPlayer("");
  };

  const getPlayerName = (id: string) => players.find((p) => p.id === id)?.name || "?";

  const reset = () => {
    setRunning(false);
    setSeconds(0);
    setHomeScore(0);
    setAwayScore(0);
    setEvents([]);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col max-w-lg mx-auto">
      <AppHeader title="Partida" showBack />

      {/* Scoreboard */}
      <div className="bg-card border-b border-border p-6">
        <div className="flex items-center justify-center gap-6">
          <div className="text-center">
            <div className="w-16 h-20 bg-destructive/80 rounded-md mx-auto mb-2 flex items-center justify-center">
              <span className="text-primary-foreground text-xs font-bold">TIME A</span>
            </div>
            <p className="text-sm font-bold text-card-foreground">Time A</p>
          </div>
          <div className="text-center">
            <div className="text-5xl font-black text-card-foreground tracking-wider">
              {homeScore} ⚽ {awayScore}
            </div>
            <div className="text-2xl font-mono font-bold text-primary mt-2 animate-pulse-soft">
              {formatTime(seconds)}
            </div>
          </div>
          <div className="text-center">
            <div className="w-16 h-20 bg-primary/80 rounded-md mx-auto mb-2 flex items-center justify-center">
              <span className="text-primary-foreground text-xs font-bold">TIME B</span>
            </div>
            <p className="text-sm font-bold text-card-foreground">Time B</p>
          </div>
        </div>

        {/* Controls */}
        <div className="flex justify-center gap-3 mt-5">
          <Button
            onClick={() => setRunning(!running)}
            variant={running ? "secondary" : "default"}
            size="lg"
            className="gap-2"
          >
            {running ? <Pause size={18} /> : <Play size={18} />}
            {running ? "Pausar" : "Iniciar"}
          </Button>
          <Button onClick={reset} variant="destructive" size="lg" className="gap-2">
            <Square size={18} />
            Resetar
          </Button>
        </div>
      </div>

      {/* Event buttons */}
      <div className="flex gap-2 p-4">
        {(["goal", "yellow_card", "red_card"] as const).map((type) => (
          <Button
            key={type}
            variant="outline"
            className="flex-1 gap-1"
            onClick={() => {
              setEventType(type);
              setShowEventDialog(true);
            }}
          >
            {type === "goal" && "⚽ Gol"}
            {type === "yellow_card" && "🟨 Amarelo"}
            {type === "red_card" && "🟥 Vermelho"}
          </Button>
        ))}
      </div>

      {/* Events log */}
      <div className="flex-1 px-4 pb-4 space-y-2">
        <h3 className="font-bold text-card-foreground">Eventos</h3>
        {events.length === 0 && (
          <p className="text-muted-foreground text-sm">Nenhum evento registrado.</p>
        )}
        {events.map((e) => (
          <div key={e.id} className="bg-card rounded-md p-3 border border-border flex items-center gap-2 text-sm">
            <span className="font-mono text-muted-foreground">{e.minute}'</span>
            <span>
              {e.type === "goal" && "⚽"}
              {e.type === "yellow_card" && "🟨"}
              {e.type === "red_card" && "🟥"}
            </span>
            <span className="font-semibold text-card-foreground">{getPlayerName(e.playerId)}</span>
            <span className="text-muted-foreground ml-auto">
              {e.team === "home" ? "Time A" : "Time B"}
            </span>
          </div>
        ))}
      </div>

      <Dialog open={showEventDialog} onOpenChange={setShowEventDialog}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>
              {eventType === "goal" && "Registrar Gol"}
              {eventType === "yellow_card" && "Cartão Amarelo"}
              {eventType === "red_card" && "Cartão Vermelho"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            <Select value={eventTeam} onValueChange={(v) => setEventTeam(v as "home" | "away")}>
              <SelectTrigger>
                <SelectValue placeholder="Time" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="home">Time A</SelectItem>
                <SelectItem value="away">Time B</SelectItem>
              </SelectContent>
            </Select>
            <Select value={selectedPlayer} onValueChange={setSelectedPlayer}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o jogador" />
              </SelectTrigger>
              <SelectContent>
                {players.map((p) => (
                  <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button onClick={handleAddEvent} className="w-full">Confirmar</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MatchPage;
