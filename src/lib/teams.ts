export interface BrazilianTeam {
  name: string;
  abbr: string;
  color: string;
  textColor: string;
  serie: "A" | "B";
  logo: string;
}

export const BRAZILIAN_TEAMS: BrazilianTeam[] = [
  // Série A
  { name: "Flamengo", abbr: "FLA", color: "#C62828", textColor: "#fff", serie: "A", logo: "https://r2.thesportsdb.com/images/media/team/badge/syptwx1473538074.png" },
  { name: "Fluminense", abbr: "FLU", color: "#880E4F", textColor: "#fff", serie: "A", logo: "https://r2.thesportsdb.com/images/media/team/badge/stvvwp1473538082.png" },
  { name: "Vasco", abbr: "VAS", color: "#212121", textColor: "#fff", serie: "A", logo: "https://r2.thesportsdb.com/images/media/team/badge/ynqlxo1630521109.png" },
  { name: "Botafogo", abbr: "BOT", color: "#1B1B1B", textColor: "#fff", serie: "A", logo: "https://r2.thesportsdb.com/images/media/team/badge/bs5mbw1733004596.png" },
  { name: "Palmeiras", abbr: "PAL", color: "#1B5E20", textColor: "#fff", serie: "A", logo: "https://r2.thesportsdb.com/images/media/team/badge/vsqwqp1473538105.png" },
  { name: "Corinthians", abbr: "COR", color: "#000000", textColor: "#fff", serie: "A", logo: "https://r2.thesportsdb.com/images/media/team/badge/vvuvps1473538042.png" },
  { name: "Santos", abbr: "SAN", color: "#222", textColor: "#fff", serie: "A", logo: "https://r2.thesportsdb.com/images/media/team/badge/j8xk9g1679447486.png" },
  { name: "São Paulo", abbr: "SPF", color: "#B71C1C", textColor: "#fff", serie: "A", logo: "https://r2.thesportsdb.com/images/media/team/badge/sxpupx1473538135.png" },
  { name: "Grêmio", abbr: "GRE", color: "#0D47A1", textColor: "#fff", serie: "A", logo: "https://r2.thesportsdb.com/images/media/team/badge/uvpwyt1473538089.png" },
  { name: "Internacional", abbr: "INT", color: "#D32F2F", textColor: "#fff", serie: "A", logo: "https://r2.thesportsdb.com/images/media/team/badge/yprvxx1473538097.png" },
  { name: "Cruzeiro", abbr: "CRU", color: "#1565C0", textColor: "#fff", serie: "A", logo: "https://r2.thesportsdb.com/images/media/team/badge/upsvvu1473538059.png" },
  { name: "Atlético-MG", abbr: "CAM", color: "#212121", textColor: "#fff", serie: "A", logo: "https://r2.thesportsdb.com/images/media/team/badge/x5lixs1743742872.png" },
  { name: "Bahia", abbr: "BAH", color: "#1565C0", textColor: "#fff", serie: "A", logo: "https://r2.thesportsdb.com/images/media/team/badge/xuvtsv1473539308.png" },
  { name: "Sport", abbr: "SPO", color: "#C62828", textColor: "#fff", serie: "A", logo: "https://r2.thesportsdb.com/images/media/team/badge/tyrbls1545421563.png" },
  { name: "Fortaleza", abbr: "FOR", color: "#1565C0", textColor: "#fff", serie: "A", logo: "https://r2.thesportsdb.com/images/media/team/badge/tosmdr1532853458.png" },
  { name: "Ceará", abbr: "CEA", color: "#1B1B1B", textColor: "#fff", serie: "A", logo: "https://r2.thesportsdb.com/images/media/team/badge/rxxvyp1464886685.png" },
  { name: "Atlético-GO", abbr: "ACG", color: "#B71C1C", textColor: "#fff", serie: "A", logo: "https://r2.thesportsdb.com/images/media/team/badge/l7382k1766505911.png" },
  { name: "Goiás", abbr: "GOI", color: "#2E7D32", textColor: "#fff", serie: "A", logo: "https://r2.thesportsdb.com/images/media/team/badge/qhfhdp1635869930.png" },
  // Série B
  { name: "Coritiba", abbr: "CFC", color: "#1B5E20", textColor: "#fff", serie: "B", logo: "https://r2.thesportsdb.com/images/media/team/badge/ywwsyu1473538050.png" },
  { name: "Botafogo-SP", abbr: "BSP", color: "#C62828", textColor: "#fff", serie: "B", logo: "https://r2.thesportsdb.com/images/media/team/badge/kg3xsd1701366652.png" },
  { name: "Brusque", abbr: "BRU", color: "#FDD835", textColor: "#333", serie: "B", logo: "https://r2.thesportsdb.com/images/media/team/badge/o7p43b1766507803.png" },
  { name: "Chapecoense", abbr: "CHA", color: "#2E7D32", textColor: "#fff", serie: "B", logo: "https://r2.thesportsdb.com/images/media/team/badge/wy0e1i1765900601.png" },
  { name: "CSA", abbr: "CSA", color: "#1565C0", textColor: "#fff", serie: "B", logo: "https://r2.thesportsdb.com/images/media/team/badge/ekzl671560365911.png" },
  { name: "CRB", abbr: "CRB", color: "#C62828", textColor: "#fff", serie: "B", logo: "https://r2.thesportsdb.com/images/media/team/badge/vpypuq1472069179.png" },
  { name: "Avaí", abbr: "AVA", color: "#1565C0", textColor: "#fff", serie: "B", logo: "https://r2.thesportsdb.com/images/media/team/badge/bblkat1766506007.png" },
  { name: "Confiança", abbr: "CON", color: "#1565C0", textColor: "#fff", serie: "B", logo: "https://r2.thesportsdb.com/images/media/team/badge/v9y3ye1579337829.png" },
  { name: "Londrina", abbr: "LON", color: "#1565C0", textColor: "#fff", serie: "B", logo: "https://r2.thesportsdb.com/images/media/team/badge/xp2z9j1740846583.png" },
  { name: "Operário", abbr: "OPE", color: "#1B1B1B", textColor: "#fff", serie: "B", logo: "https://r2.thesportsdb.com/images/media/team/badge/fhrc6i1560791704.png" },
  { name: "Ponte Preta", abbr: "PON", color: "#1B1B1B", textColor: "#fff", serie: "B", logo: "https://r2.thesportsdb.com/images/media/team/badge/wbss4d1644929547.png" },
  { name: "Náutico", abbr: "NAU", color: "#C62828", textColor: "#fff", serie: "B", logo: "https://r2.thesportsdb.com/images/media/team/badge/wywuwv1464886832.png" },
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
