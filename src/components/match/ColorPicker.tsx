import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const JERSEY_COLORS = [
  { name: "Vermelho", value: "#dc2626" },
  { name: "Amarelo", value: "#eab308" },
  { name: "Azul", value: "#2563eb" },
  { name: "Verde", value: "#16a34a" },
  { name: "Branco", value: "#f5f5f5" },
  { name: "Preto", value: "#1a1a1a" },
  { name: "Laranja", value: "#ea580c" },
  { name: "Roxo", value: "#7c3aed" },
];

interface ColorPickerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (color: string) => void;
  title: string;
}

const ColorPicker = ({ open, onOpenChange, onSelect, title }: ColorPickerProps) => (
  <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent className="max-w-xs">
      <DialogHeader>
        <DialogTitle>{title}</DialogTitle>
      </DialogHeader>
      <div className="grid grid-cols-4 gap-3 pt-2">
        {JERSEY_COLORS.map(c => (
          <button
            key={c.value}
            onClick={() => { onSelect(c.value); onOpenChange(false); }}
            className="flex flex-col items-center gap-1"
          >
            <div
              className="w-12 h-12 rounded-full border-2 border-border hover:scale-110 transition-transform"
              style={{ backgroundColor: c.value }}
            />
            <span className="text-[10px] text-muted-foreground font-semibold">{c.name}</span>
          </button>
        ))}
      </div>
    </DialogContent>
  </Dialog>
);

export default ColorPicker;
