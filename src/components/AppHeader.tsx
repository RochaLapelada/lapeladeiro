import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface AppHeaderProps {
  title: string;
  showBack?: boolean;
  rightAction?: React.ReactNode;
}

const AppHeader = ({ title, showBack = false, rightAction }: AppHeaderProps) => {
  const navigate = useNavigate();

  return (
    <header className="header-gradient px-4 py-4 flex items-center gap-3 sticky top-0 z-50 shadow-md">
      {showBack && (
        <button onClick={() => navigate(-1)} className="text-primary-foreground">
          <ArrowLeft size={24} />
        </button>
      )}
      <h1 className="text-xl font-bold text-primary-foreground flex-1">{title}</h1>
      {rightAction}
    </header>
  );
};

export default AppHeader;
