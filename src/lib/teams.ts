export interface BrazilianTeam {
  name: string;
  abbr: string;
  color: string;       // primary color (HSL-friendly hex for badge)
  textColor: string;    // text on badge
  serie: "A" | "B";
}

export const BRAZILIAN_TEAMS: BrazilianTeam[] = [
  // Série A
  { name: "Flamengo", abbr: "FLA", color: "#C62828", textColor: "#fff", serie: "A" },
  { name: "Fluminense", abbr: "FLU", color: "#880E4F", textColor: "#fff", serie: "A" },
  { name: "Vasco", abbr: "VAS", color: "#212121", textColor: "#fff", serie: "A" },
  { name: "Botafogo", abbr: "BOT", color: "#1B1B1B", textColor: "#fff", serie: "A" },
  { name: "Palmeiras", abbr: "PAL", color: "#1B5E20", textColor: "#fff", serie: "A" },
  { name: "Corinthians", abbr: "COR", color: "#000000", textColor: "#fff", serie: "A" },
  { name: "Santos", abbr: "SAN", color: "#222", textColor: "#fff", serie: "A" },
  { name: "São Paulo", abbr: "SPF", color: "#B71C1C", textColor: "#fff", serie: "A" },
  { name: "Grêmio", abbr: "GRE", color: "#0D47A1", textColor: "#fff", serie: "A" },
  { name: "Internacional", abbr: "INT", color: "#D32F2F", textColor: "#fff", serie: "A" },
  { name: "Cruzeiro", abbr: "CRU", color: "#1565C0", textColor: "#fff", serie: "A" },
  { name: "Atlético-MG", abbr: "CAM", color: "#212121", textColor: "#fff", serie: "A" },
  { name: "Bahia", abbr: "BAH", color: "#1565C0", textColor: "#fff", serie: "A" },
  { name: "Sport", abbr: "SPO", color: "#C62828", textColor: "#fff", serie: "A" },
  { name: "Fortaleza", abbr: "FOR", color: "#1565C0", textColor: "#fff", serie: "A" },
  { name: "Ceará", abbr: "CEA", color: "#1B1B1B", textColor: "#fff", serie: "A" },
  { name: "Atlético-GO", abbr: "ACG", color: "#B71C1C", textColor: "#fff", serie: "A" },
  { name: "Goiás", abbr: "GOI", color: "#2E7D32", textColor: "#fff", serie: "A" },
  // Série B
  { name: "Coritiba", abbr: "CFC", color: "#1B5E20", textColor: "#fff", serie: "B" },
  { name: "Botafogo-SP", abbr: "BSP", color: "#C62828", textColor: "#fff", serie: "B" },
  { name: "Brusque", abbr: "BRU", color: "#FDD835", textColor: "#333", serie: "B" },
  { name: "Chapecoense", abbr: "CHA", color: "#2E7D32", textColor: "#fff", serie: "B" },
  { name: "CSA", abbr: "CSA", color: "#1565C0", textColor: "#fff", serie: "B" },
  { name: "CRB", abbr: "CRB", color: "#C62828", textColor: "#fff", serie: "B" },
  { name: "Avaí", abbr: "AVA", color: "#1565C0", textColor: "#fff", serie: "B" },
  { name: "Confiança", abbr: "CON", color: "#1565C0", textColor: "#fff", serie: "B" },
  { name: "Londrina", abbr: "LON", color: "#1565C0", textColor: "#fff", serie: "B" },
  { name: "Operário", abbr: "OPE", color: "#1B1B1B", textColor: "#fff", serie: "B" },
  { name: "Ponte Preta", abbr: "PON", color: "#1B1B1B", textColor: "#fff", serie: "B" },
  { name: "Náutico", abbr: "NAU", color: "#C62828", textColor: "#fff", serie: "B" },
];

export function findTeam(name: string): BrazilianTeam | undefined {
  return BRAZILIAN_TEAMS.find(t => t.name.toLowerCase() === name.toLowerCase());
}

export function searchTeams(query: string): BrazilianTeam[] {
  if (!query.trim()) return BRAZILIAN_TEAMS;
  const q = query.toLowerCase();
  return BRAZILIAN_TEAMS.filter(t =>
    t.name.toLowerCase().includes(q) || t.abbr.toLowerCase().includes(q)
  );
}
