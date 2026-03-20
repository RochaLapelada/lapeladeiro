import { useState } from "react";
import { Plus, UserPlus, Shuffle, Trash2, X } from "lucide-react";

interface FloatingActionButtonProps {
  onAddPlayer: () => void;
  onDrawTeams: () => void;
  onClearList: () => void;
}

const FloatingActionButton = ({ onAddPlayer, onDrawTeams, onClearList }: FloatingActionButtonProps) => {
  const [open, setOpen] = useState(false);

  const actions = [
    { icon: UserPlus, label: "Adicionar Jogador", onClick: onAddPlayer, color: "bg-primary" },
    { icon: Shuffle, label: "Sortear Times", onClick: onDrawTeams, color: "bg-accent" },
    { icon: Trash2, label: "Limpar Lista", onClick: onClearList, color: "bg-destructive" },
  ];

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col-reverse items-end gap-3">
      <button
        onClick={() => setOpen(!open)}
        className="w-14 h-14 rounded-full bg-primary text-primary-foreground shadow-lg flex items-center justify-center hover:bg-primary/90 transition-all"
      >
        {open ? <X size={24} /> : <Plus size={24} />}
      </button>

      {open && actions.map((action, i) => (
        <div key={i} className="flex items-center gap-2 animate-in slide-in-from-bottom-2 fade-in" style={{ animationDelay: `${i * 50}ms` }}>
          <span className="bg-card text-card-foreground text-xs font-semibold px-3 py-1.5 rounded-full shadow border border-border">
            {action.label}
          </span>
          <button
            onClick={() => { action.onClick(); setOpen(false); }}
            className={`w-11 h-11 rounded-full ${action.color} text-white shadow-md flex items-center justify-center hover:scale-105 transition-transform`}
          >
            <action.icon size={20} />
          </button>
        </div>
      ))}
    </div>
  );
};

export default FloatingActionButton;
