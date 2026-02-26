import { Users, Swords, BarChart3, Trophy, Settings, Timer } from "lucide-react";
import { useNavigate } from "react-router-dom";
import AppHeader from "@/components/AppHeader";

const menuItems = [
  {
    title: "Peladeiros",
    description: "Cadastro e manutenção dos peladeiros",
    icon: Users,
    path: "/players",
  },
  {
    title: "Partidas",
    description: "Executar e gerenciar partidas",
    icon: Timer,
    path: "/match",
  },
  {
    title: "Sorteio de Times",
    description: "Divida os jogadores de forma equilibrada",
    icon: Swords,
    path: "/draw",
  },
  {
    title: "Estatísticas",
    description: "Artilharia, cartões, total de jogos e etc...",
    icon: BarChart3,
    path: "/stats",
  },
  {
    title: "Ranking",
    description: "Pontuação dos times e peladeiros",
    icon: Trophy,
    path: "/ranking",
  },
];

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex flex-col max-w-lg mx-auto">
      <AppHeader title="⚽ Minha Pelada" />
      <main className="flex-1 p-4 space-y-3">
        {menuItems.map((item) => (
          <button
            key={item.path}
            onClick={() => navigate(item.path)}
            className="w-full bg-card rounded-lg p-5 flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow border border-border text-left group"
          >
            <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors">
              <item.icon className="text-primary" size={28} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-card-foreground">{item.title}</h2>
              <p className="text-sm text-muted-foreground">{item.description}</p>
            </div>
          </button>
        ))}
      </main>
    </div>
  );
};

export default Index;
