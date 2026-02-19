import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Shield, LayoutDashboard, FileText, CreditCard, Bell,
  Settings, LogOut, Plus, TrendingUp, DollarSign,
  Clock, CheckCircle, AlertTriangle, Eye, ChevronRight,
  User, Menu, X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

// ── Types ────────────────────────────────────────────────────
type DealStatus = "pending" | "secured" | "progress" | "delivered" | "completed" | "dispute";

interface Deal {
  id: string;
  client: string;
  service: string;
  amount: number;
  currency: string;
  status: DealStatus;
  deadline: string;
  createdAt: string;
}

// ── Mock data ─────────────────────────────────────────────────
const MOCK_DEALS: Deal[] = [
  { id: "FX-2024-001", client: "Kofi Mensah", service: "Développement site e-commerce", amount: 450000, currency: "XOF", status: "completed", deadline: "2024-12-15", createdAt: "2024-11-20" },
  { id: "FX-2024-002", client: "Aminata Diallo", service: "Identité visuelle complète", amount: 280000, currency: "XOF", status: "progress", deadline: "2025-01-10", createdAt: "2024-12-01" },
  { id: "FX-2024-003", client: "Pierre Lefebvre", service: "Consulting stratégie digitale", amount: 750000, currency: "XOF", status: "secured", deadline: "2025-01-20", createdAt: "2024-12-10" },
  { id: "FX-2024-004", client: "Fatou Ndiaye", service: "Campagne réseaux sociaux", amount: 180000, currency: "XOF", status: "delivered", deadline: "2024-12-28", createdAt: "2024-11-30" },
  { id: "FX-2024-005", client: "David Chen", service: "Application mobile MVP", amount: 1200000, currency: "XOF", status: "dispute", deadline: "2025-01-05", createdAt: "2024-11-15" },
  { id: "FX-2024-006", client: "Marie Traoré", service: "Formation équipe marketing", amount: 320000, currency: "XOF", status: "pending", deadline: "2025-02-01", createdAt: "2024-12-18" },
];

// ── Status config ─────────────────────────────────────────────
const STATUS_CONFIG: Record<DealStatus, { label: string; className: string; icon: any }> = {
  pending: { label: "Paiement en attente", className: "status-pending", icon: Clock },
  secured: { label: "Fonds sécurisés", className: "status-secured", icon: Shield },
  progress: { label: "En cours", className: "status-progress", icon: TrendingUp },
  delivered: { label: "Livré", className: "status-delivered", icon: CheckCircle },
  completed: { label: "Terminé", className: "status-completed", icon: CheckCircle },
  dispute: { label: "Litige", className: "status-dispute", icon: AlertTriangle },
};

// ── Sidebar Nav Item ──────────────────────────────────────────
const NavItem = ({ icon: Icon, label, active, onClick }: { icon: any; label: string; active?: boolean; onClick?: () => void }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
      active
        ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
        : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-primary-foreground"
    }`}
  >
    <Icon className="w-4 h-4" />
    {label}
  </button>
);

// ── Metric card ───────────────────────────────────────────────
const MetricCard = ({ label, value, change, icon: Icon, color }: {
  label: string; value: string; change: string; icon: any; color: string;
}) => (
  <div className="bg-card rounded-2xl p-6 border border-border shadow-sm card-hover">
    <div className="flex items-start justify-between mb-4">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}>
        <Icon className="w-5 h-5" />
      </div>
      <span className="text-xs text-emerald-600 font-semibold bg-emerald-50 px-2 py-1 rounded-full">{change}</span>
    </div>
    <p className="text-2xl font-bold text-navy-900 mb-1">{value}</p>
    <p className="text-sm text-muted-foreground">{label}</p>
  </div>
);

// ════════════════════════════════════════════════════════════
const ProviderDashboard = () => {
  const [activeSection, setActiveSection] = useState("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const navigate = useNavigate();

  const filteredDeals = filterStatus === "all"
    ? MOCK_DEALS
    : MOCK_DEALS.filter((d) => d.status === filterStatus);

  const totalRevenue = MOCK_DEALS.filter(d => d.status === "completed").reduce((s, d) => s + d.amount, 0);
  const secured = MOCK_DEALS.filter(d => d.status === "secured").reduce((s, d) => s + d.amount, 0);

  const fmtAmount = (n: number) => `${(n / 1000).toFixed(0)}k XOF`;

  const sidebarContent = (
    <div className="flex flex-col h-full">
      <Link to="/" className="flex items-center gap-2.5 px-4 mb-8">
        <div className="w-8 h-8 rounded-lg gradient-emerald flex items-center justify-center">
          <Shield className="w-4 h-4 text-primary-foreground" />
        </div>
        <span className="text-lg font-bold text-primary-foreground">FidexaPay</span>
      </Link>

      <nav className="flex-1 space-y-1 px-2">
        <NavItem icon={LayoutDashboard} label="Vue d'ensemble" active={activeSection === "overview"} onClick={() => { setActiveSection("overview"); setSidebarOpen(false); }} />
        <NavItem icon={FileText} label="Mes deals" active={activeSection === "deals"} onClick={() => { setActiveSection("deals"); setSidebarOpen(false); }} />
        <NavItem icon={Plus} label="Nouveau deal" active={activeSection === "new-deal"} onClick={() => { navigate("/deals/new"); setSidebarOpen(false); }} />
        <NavItem icon={CreditCard} label="Abonnement" active={activeSection === "subscription"} onClick={() => { setActiveSection("subscription"); setSidebarOpen(false); }} />
        <NavItem icon={Bell} label="Notifications" active={activeSection === "notifications"} onClick={() => { setActiveSection("notifications"); setSidebarOpen(false); }} />
        <NavItem icon={Settings} label="Paramètres" active={activeSection === "settings"} onClick={() => { setActiveSection("settings"); setSidebarOpen(false); }} />
      </nav>

      <div className="px-2 pt-4 border-t border-sidebar-border">
        <div className="flex items-center gap-3 px-4 py-3 mb-2">
          <div className="w-8 h-8 rounded-full gradient-emerald flex items-center justify-center">
            <User className="w-4 h-4 text-primary-foreground" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-primary-foreground text-sm font-medium truncate">Jean Dupont</p>
            <p className="text-navy-400 text-xs truncate">Plan Essentiel</p>
          </div>
        </div>
        <NavItem icon={LogOut} label="Déconnexion" onClick={() => navigate("/")} />
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-secondary overflow-hidden">
      {/* Sidebar - desktop */}
      <aside className="hidden lg:flex w-64 bg-sidebar flex-col py-6 flex-shrink-0">
        {sidebarContent}
      </aside>

      {/* Sidebar - mobile overlay */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="w-64 bg-sidebar py-6 flex-col flex">
            {sidebarContent}
          </div>
          <div className="flex-1 bg-navy-900/60 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
        </div>
      )}

      {/* Main content */}
      <main className="flex-1 overflow-y-auto">
        {/* Top bar */}
        <div className="sticky top-0 z-10 bg-background border-b border-border px-6 py-4 flex items-center gap-4">
          <button className="lg:hidden p-2 rounded-xl hover:bg-muted" onClick={() => setSidebarOpen(true)}>
            <Menu className="w-5 h-5 text-navy-700" />
          </button>
          <h1 className="text-xl font-bold text-navy-900">
            {activeSection === "overview" && "Vue d'ensemble"}
            {activeSection === "deals" && "Mes deals"}
            {activeSection === "subscription" && "Abonnement"}
            {activeSection === "notifications" && "Notifications"}
            {activeSection === "settings" && "Paramètres"}
          </h1>
          <div className="ml-auto flex items-center gap-3">
            <button className="relative p-2 rounded-xl hover:bg-muted">
              <Bell className="w-5 h-5 text-navy-700" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
            </button>
            <Link to="/deals/new">
              <Button className="gradient-emerald text-primary-foreground border-0 rounded-xl text-sm font-semibold shadow-glow-emerald hover:opacity-90">
                <Plus className="w-4 h-4 mr-1.5" />
                Nouveau deal
              </Button>
            </Link>
          </div>
        </div>

        <div className="p-6">
          {/* OVERVIEW */}
          {activeSection === "overview" && (
            <div className="space-y-6">
              {/* Metrics */}
              <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4">
                <MetricCard label="Chiffre d'affaires total" value={fmtAmount(totalRevenue)} change="+18%" icon={DollarSign} color="bg-emerald-100 text-emerald-700" />
                <MetricCard label="Deals actifs" value="3" change="+2 ce mois" icon={FileText} color="bg-blue-100 text-blue-700" />
                <MetricCard label="Fonds en escrow" value={fmtAmount(secured)} change="En cours" icon={Shield} color="bg-amber-100 text-amber-700" />
                <MetricCard label="Taux de completion" value="92%" change="+5%" icon={TrendingUp} color="bg-purple-100 text-purple-700" />
              </div>

              {/* Plan banner */}
              <div className="glass-card-dark rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <div className="flex-1">
                  <p className="text-primary-foreground font-semibold mb-1">Plan Essentiel — 9% de commission</p>
                  <p className="text-navy-300 text-sm">7/10 deals actifs utilisés ce mois</p>
                  <div className="mt-3 bg-navy-700 rounded-full h-2">
                    <div className="gradient-emerald h-2 rounded-full" style={{ width: "70%" }} />
                  </div>
                </div>
                <Button variant="outline" className="border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10 text-sm" onClick={() => setActiveSection("subscription")}>
                  Upgrader <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </div>

              {/* Recent deals */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-bold text-navy-900">Deals récents</h2>
                  <button className="text-emerald-600 text-sm font-medium hover:text-emerald-700" onClick={() => setActiveSection("deals")}>
                    Voir tous
                  </button>
                </div>
                <div className="space-y-3">
                  {MOCK_DEALS.slice(0, 4).map((deal) => {
                    const s = STATUS_CONFIG[deal.status];
                    const Icon = s.icon;
                    return (
                      <div key={deal.id} className="bg-card rounded-xl border border-border p-4 flex items-center gap-4 hover:shadow-md transition-shadow cursor-pointer" onClick={() => navigate(`/deals/${deal.id}`)}>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <p className="font-semibold text-navy-900 text-sm truncate">{deal.client}</p>
                            <span className="text-navy-400 text-xs font-mono">#{deal.id}</span>
                          </div>
                          <p className="text-muted-foreground text-xs truncate">{deal.service}</p>
                        </div>
                        <div className="hidden sm:block text-right flex-shrink-0">
                          <p className="font-bold text-navy-900 text-sm">{deal.amount.toLocaleString()} XOF</p>
                          <p className="text-muted-foreground text-xs">{deal.deadline}</p>
                        </div>
                        <span className={`flex-shrink-0 flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full ${s.className}`}>
                          <Icon className="w-3 h-3" />
                          {s.label}
                        </span>
                        <Eye className="w-4 h-4 text-navy-400 flex-shrink-0 hidden sm:block" />
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* DEALS LIST */}
          {activeSection === "deals" && (
            <div className="space-y-4">
              {/* Filter tabs */}
              <div className="flex flex-wrap gap-2">
                {[["all", "Tous"], ["pending", "En attente"], ["secured", "Sécurisés"], ["progress", "En cours"], ["completed", "Terminés"], ["dispute", "Litiges"]].map(([val, label]) => (
                  <button
                    key={val}
                    onClick={() => setFilterStatus(val)}
                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-all border ${
                      filterStatus === val
                        ? "gradient-emerald text-primary-foreground border-transparent shadow-glow-emerald"
                        : "bg-card text-navy-700 border-border hover:border-emerald-300"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>

              {/* Deals table */}
              <div className="bg-card rounded-2xl border border-border overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border bg-muted/50">
                        <th className="text-left p-4 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Référence</th>
                        <th className="text-left p-4 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Client</th>
                        <th className="text-left p-4 text-xs font-semibold text-muted-foreground uppercase tracking-wide hidden md:table-cell">Service</th>
                        <th className="text-left p-4 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Montant</th>
                        <th className="text-left p-4 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Statut</th>
                        <th className="text-left p-4 text-xs font-semibold text-muted-foreground uppercase tracking-wide hidden lg:table-cell">Échéance</th>
                        <th className="p-4" />
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {filteredDeals.map((deal) => {
                        const s = STATUS_CONFIG[deal.status];
                        const Icon = s.icon;
                        return (
                          <tr key={deal.id} className="hover:bg-muted/30 transition-colors cursor-pointer" onClick={() => navigate(`/deals/${deal.id}`)}>
                            <td className="p-4 text-xs font-mono text-navy-500">{deal.id}</td>
                            <td className="p-4 font-medium text-navy-900 text-sm">{deal.client}</td>
                            <td className="p-4 text-muted-foreground text-sm hidden md:table-cell max-w-[200px] truncate">{deal.service}</td>
                            <td className="p-4 font-bold text-navy-900 text-sm whitespace-nowrap">{deal.amount.toLocaleString()} XOF</td>
                            <td className="p-4">
                              <span className={`flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full w-fit ${s.className}`}>
                                <Icon className="w-3 h-3" />
                                {s.label}
                              </span>
                            </td>
                            <td className="p-4 text-muted-foreground text-sm hidden lg:table-cell">{deal.deadline}</td>
                            <td className="p-4">
                              <button className="p-1.5 rounded-lg hover:bg-muted">
                                <Eye className="w-4 h-4 text-navy-400" />
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* SUBSCRIPTION */}
          {activeSection === "subscription" && (
            <div className="max-w-4xl">
              <p className="text-muted-foreground mb-8">Choisissez le plan adapté à votre activité.</p>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { name: "Basic", price: "Gratuit", commission: "15%", deals: "3 deals", features: ["Lien deal sécurisé", "Support email"], current: false, popular: false },
                  { name: "Essentiel", price: "9 900 XOF/mois", commission: "9%", deals: "10 deals", features: ["Tout Basic", "Notifications SMS", "Tableau de bord"], current: true, popular: false },
                  { name: "Standard", price: "19 900 XOF/mois", commission: "6%", deals: "25 deals", features: ["Tout Essentiel", "API Access", "Support prioritaire"], current: false, popular: true },
                  { name: "Premium", price: "27 900 XOF/mois", commission: "5%", deals: "Illimité", features: ["Tout Standard", "Manager dédié", "SLA garanti"], current: false, popular: false },
                ].map((plan) => (
                  <div key={plan.name} className={`rounded-2xl border p-6 relative ${plan.popular ? "border-emerald-400 bg-emerald-50" : "border-border bg-card"} ${plan.current ? "ring-2 ring-emerald-400 ring-offset-2" : ""}`}>
                    {plan.popular && <span className="absolute -top-3 left-1/2 -translate-x-1/2 gradient-emerald text-primary-foreground text-xs font-bold px-3 py-1 rounded-full">Populaire</span>}
                    {plan.current && <span className="absolute -top-3 right-4 bg-navy-900 text-primary-foreground text-xs font-bold px-3 py-1 rounded-full">Actuel</span>}
                    <h3 className="font-bold text-navy-900 text-lg mb-1">{plan.name}</h3>
                    <p className="text-2xl font-bold text-navy-900 mb-1">{plan.price}</p>
                    <div className="text-emerald-600 font-semibold text-sm mb-1">{plan.commission} commission</div>
                    <div className="text-muted-foreground text-sm mb-4">{plan.deals} actifs</div>
                    <ul className="space-y-2 mb-6">
                      {plan.features.map(f => (
                        <li key={f} className="flex items-center gap-2 text-sm text-navy-700">
                          <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
                          {f}
                        </li>
                      ))}
                    </ul>
                    <Button className={`w-full rounded-xl text-sm ${plan.current ? "bg-muted text-muted-foreground" : "gradient-emerald text-primary-foreground border-0 hover:opacity-90"}`} disabled={plan.current}>
                      {plan.current ? "Plan actuel" : "Choisir"}
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* OTHER SECTIONS */}
          {(activeSection === "notifications" || activeSection === "settings") && (
            <div className="bg-card rounded-2xl border border-border p-12 text-center">
              <div className="w-16 h-16 rounded-2xl gradient-hero flex items-center justify-center mx-auto mb-4">
                {activeSection === "notifications" ? <Bell className="w-8 h-8 text-emerald-400" /> : <Settings className="w-8 h-8 text-emerald-400" />}
              </div>
              <h3 className="font-bold text-navy-900 text-xl mb-2">
                {activeSection === "notifications" ? "Notifications" : "Paramètres"}
              </h3>
              <p className="text-muted-foreground">Cette section sera disponible après la connexion Lovable Cloud.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default ProviderDashboard;
