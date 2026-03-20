interface HistoryDotsProps {
  results: ("win" | "loss" | "draw")[];
}

const HistoryDots = ({ results }: HistoryDotsProps) => {
  const last5 = results.slice(-5);
  
  return (
    <div className="flex gap-1 justify-center">
      {last5.map((r, i) => (
        <span
          key={i}
          className={`w-2.5 h-2.5 rounded-full ${
            r === "win" ? "bg-green-500" : r === "loss" ? "bg-destructive" : "bg-muted-foreground/40"
          }`}
        />
      ))}
      {last5.length === 0 && <span className="text-[10px] text-muted-foreground">—</span>}
    </div>
  );
};

export default HistoryDots;
