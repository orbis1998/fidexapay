import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Shield, LayoutDashboard, FileText, CreditCard, Bell,
  Settings, LogOut, Plus, TrendingUp, DollarSign,
  Clock, CheckCircle, AlertTriangle, Eye, ChevronRight,
  User, Menu, LinkIcon
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

// ── Types ────────────────────────────────────────────────────
type DealStatus = "pending_payment" | "funds_secured" | "in_progress" | "delivered" | "awaiting_validation" | "completed" | "dispute";

interface Deal {
  id: string;
  client_name: string;
  title: string;
  amount: number;
  currency: string;
  status: DealStatus;
  delivery_deadline: string | null;
  created_at: string;
  secure_token: string;
}

// ── Status config ─────────────────────────────────────────────
const STATUS_CONFIG: Record<DealStatus, { label: string; className: string; icon: React.ElementType }> = {
  pending_payment: { label: "Paiement en attente", className: "status-pending", icon: Clock },
  funds_secured: { label: "Fonds sécurisés", className: "status-secured", icon: Shield },
  in_progress: { label: "En cours", className: "status-progress", icon: TrendingUp },
  delivered: { label: "Livré", className: "status-delivered", icon: CheckCircle },
  awaiting_validation: { label: "En validation", className: "status-delivered", icon: Clock },
  completed: { label: "Terminé", className: "status-completed", icon: CheckCircle },
  dispute: { label: "Litige", className: "status-dispute", icon: AlertTriangle },
};

// ── Sidebar Nav Item ──────────────────────────────────────────
const NavItem = ({ icon: Icon, label, active, onClick }: { icon: React.ElementType; label: string; active?: boolean; onClick?: () => void }) => (
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
  label: string; value: string; change: string; icon: React.ElementType; color: string;
}) => (
  <div className="bg-card rounded-2xl p-4 sm:p-6 border border-border shadow-sm card-hover">
    <div className="flex items-start justify-between mb-3 sm:mb-4">
      <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center ${color}`}>
        <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
      </div>
      <span className="text-[10px] sm:text-xs text-emerald-600 font-semibold bg-emerald-50 px-2 py-0.5 sm:py-1 rounded-full">{change}</span>
    </div>
    <p className="text-xl sm:text-2xl font-bold text-navy-900 mb-0.5">{value}</p>
    <p className="text-xs sm:text-sm text-muted-foreground">{label}</p>
  </div>
);

// ════════════════════════════════════════════════════════════
const ProviderDashboard = () => {
  const { user, profile, subscription, signOut } = useAuth();
  const [activeSection, setActiveSection] = useState("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [deals, setDeals] = useState<Deal[]>([]);
  const [loadingDeals, setLoadingDeals] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) return;
    const fetchDeals = async () => {
      setLoadingDeals(true);
      const { data, error } = await supabase
        .from("deals")
        .select("id, client_name, title, amount, currency, status, delivery_deadline, created_at, secure_token")
        .eq("provider_id", user.id)
        .order("created_at", { ascending: false });

      if (error) {
        toast.error("Erreur lors du chargement des liens.");
      } else {
        setDeals((data || []) as Deal[]);
      }
      setLoadingDeals(false);
    };
    fetchDeals();
  }, [user]);

  const filteredDeals = filterStatus === "all"
    ? deals
    : deals.filter((d) => d.status === filterStatus);

  const totalRevenue = deals.filter(d => d.status === "completed").reduce((s, d) => s + d.amount, 0);
  const securedAmount = deals.filter(d => d.status === "funds_secured").reduce((s, d) => s + d.amount, 0);
  const activeDealsCount = deals.filter(d => !["completed", "dispute"].includes(d.status)).length;

  const fmtAmount = (n: number) => n >= 1000 ? `${(n / 1000).toFixed(0)}k XOF` : `${n} XOF`;

  const planLabel: Record<string, string> = {
    basic: "Basic", essentiel: "Essentiel", standard: "Standard", premium: "Premium"
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

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
        <NavItem icon={FileText} label="Mes liens" active={activeSection === "deals"} onClick={() => { setActiveSection("deals"); setSidebarOpen(false); }} />
        <NavItem icon={LinkIcon} label="Créer un lien" active={activeSection === "new-deal"} onClick={() => { navigate("/deals/new"); setSidebarOpen(false); }} />
        <NavItem icon={CreditCard} label="Abonnement" active={activeSection === "subscription"} onClick={() => { setActiveSection("subscription"); setSidebarOpen(false); }} />
        <NavItem icon={Bell} label="Notifications" active={activeSection === "notifications"} onClick={() => { setActiveSection("notifications"); setSidebarOpen(false); }} />
        <NavItem icon={Settings} label="Paramètres" active={activeSection === "settings"} onClick={() => { setActiveSection("settings"); setSidebarOpen(false); }} />
      </nav>

      <div className="px-2 pt-4 border-t border-sidebar-border">
        <div className="flex items-center gap-3 px-4 py-3 mb-2">
          <div className="w-8 h-8 rounded-full gradient-emerald flex items-center justify-center">
            {profile?.avatar_url
              ? <img src={profile.avatar_url} className="w-full h-full rounded-full object-cover" alt="avatar" />
              : <User className="w-4 h-4 text-primary-foreground" />
            }
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-primary-foreground text-sm font-medium truncate">{profile?.full_name || user?.email}</p>
            <p className="text-navy-400 text-xs truncate">Plan {planLabel[subscription?.plan || "basic"]}</p>
          </div>
        </div>
        <NavItem icon={LogOut} label="Déconnexion" onClick={handleSignOut} />
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
        <div className="sticky top-0 z-10 bg-background border-b border-border px-4 sm:px-6 py-3 sm:py-4 flex items-center gap-3 sm:gap-4">
          <button className="lg:hidden p-2 rounded-xl hover:bg-muted" onClick={() => setSidebarOpen(true)}>
            <Menu className="w-5 h-5 text-navy-700" />
          </button>
          <h1 className="text-lg sm:text-xl font-bold text-navy-900 truncate">
            {activeSection === "overview" && "Vue d'ensemble"}
            {activeSection === "deals" && "Mes liens"}
            {activeSection === "subscription" && "Abonnement"}
            {activeSection === "notifications" && "Notifications"}
            {activeSection === "settings" && "Paramètres"}
          </h1>
          <div className="ml-auto flex items-center gap-2 sm:gap-3">
            <button className="relative p-2 rounded-xl hover:bg-muted">
              <Bell className="w-5 h-5 text-navy-700" />
            </button>
            <Link to="/deals/new">
              <Button className="gradient-emerald text-primary-foreground border-0 rounded-xl text-xs sm:text-sm font-semibold shadow-glow-emerald hover:opacity-90 px-3 sm:px-4">
                <Plus className="w-4 h-4 mr-1" />
                <span className="hidden sm:inline">Créer un lien</span>
                <span className="sm:hidden">Lien</span>
              </Button>
            </Link>
          </div>
        </div>

        <div className="p-4 sm:p-6">
          {/* OVERVIEW */}
          {activeSection === "overview" && (
            <div className="space-y-4 sm:space-y-6">
              <div className="grid grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4">
                <MetricCard label="Chiffre d'affaires" value={fmtAmount(totalRevenue)} change="Terminés" icon={DollarSign} color="bg-emerald-100 text-emerald-700" />
                <MetricCard label="Liens actifs" value={String(activeDealsCount)} change="En cours" icon={FileText} color="bg-blue-100 text-blue-700" />
                <MetricCard label="Fonds en escrow" value={fmtAmount(securedAmount)} change="Sécurisés" icon={Shield} color="bg-amber-100 text-amber-700" />
                <MetricCard label="Total liens" value={String(deals.length)} change="Tous statuts" icon={TrendingUp} color="bg-purple-100 text-purple-700" />
              </div>

              {/* Plan banner */}
              <div className="glass-card-dark rounded-2xl p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
                <div className="flex-1 w-full">
                  <p className="text-primary-foreground font-semibold mb-1 text-sm sm:text-base">
                    Plan {planLabel[subscription?.plan || "basic"]} — {subscription?.commission_rate ?? 15}% de commission
                  </p>
                  <p className="text-navy-300 text-xs sm:text-sm">
                    {activeDealsCount}/{subscription?.max_active_deals ?? 3} liens actifs utilisés
                  </p>
                  <div className="mt-3 bg-navy-700 rounded-full h-2">
                    <div
                      className="gradient-emerald h-2 rounded-full transition-all"
                      style={{ width: `${Math.min(100, (activeDealsCount / (subscription?.max_active_deals ?? 3)) * 100)}%` }}
                    />
                  </div>
                </div>
                <Button variant="outline" className="border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10 text-xs sm:text-sm w-full sm:w-auto" onClick={() => setActiveSection("subscription")}>
                  Upgrader <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </div>

              {/* Recent links */}
              <div>
                <div className="flex items-center justify-between mb-3 sm:mb-4">
                  <h2 className="text-base sm:text-lg font-bold text-navy-900">Liens récents</h2>
                  <button className="text-emerald-600 text-xs sm:text-sm font-medium hover:text-emerald-700" onClick={() => setActiveSection("deals")}>
                    Voir tous
                  </button>
                </div>
                {loadingDeals ? (
                  <div className="space-y-3">
                    {[1,2,3].map(i => <div key={i} className="h-16 bg-muted rounded-xl animate-pulse" />)}
                  </div>
                ) : deals.length === 0 ? (
                  <div className="bg-card rounded-2xl border border-border p-8 sm:p-12 text-center">
                    <LinkIcon className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
                    <p className="font-semibold text-navy-900 mb-1">Aucun lien pour l'instant</p>
                    <p className="text-muted-foreground text-sm mb-4">Créez votre premier lien sécurisé.</p>
                    <Link to="/deals/new">
                      <Button className="gradient-emerald text-primary-foreground border-0 rounded-xl shadow-glow-emerald hover:opacity-90">
                        <Plus className="w-4 h-4 mr-2" /> Créer un lien
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-2 sm:space-y-3">
                    {deals.slice(0, 4).map((deal) => {
                      const s = STATUS_CONFIG[deal.status];
                      const Icon = s.icon;
                      return (
                        <div
                          key={deal.id}
                          className="bg-card rounded-xl border border-border p-3 sm:p-4 flex items-center gap-3 sm:gap-4 hover:shadow-md transition-shadow cursor-pointer"
                          onClick={() => navigate(`/deals/${deal.secure_token}`)}
                        >
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-navy-900 text-sm truncate">{deal.client_name}</p>
                            <p className="text-muted-foreground text-xs truncate">{deal.title}</p>
                          </div>
                          <div className="text-right flex-shrink-0">
                            <p className="font-bold text-navy-900 text-xs sm:text-sm">{deal.amount.toLocaleString()} {deal.currency}</p>
                            <p className="text-muted-foreground text-[10px] sm:text-xs hidden sm:block">{deal.delivery_deadline ? new Date(deal.delivery_deadline).toLocaleDateString("fr-FR") : "—"}</p>
                          </div>
                          <span className={`flex-shrink-0 flex items-center gap-1 text-[10px] sm:text-xs font-medium px-2 sm:px-3 py-1 sm:py-1.5 rounded-full ${s.className}`}>
                            <Icon className="w-3 h-3" />
                            <span className="hidden sm:inline">{s.label}</span>
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* DEALS LIST */}
          {activeSection === "deals" && (
            <div className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {[
                  ["all", "Tous"],
                  ["pending_payment", "En attente"],
                  ["funds_secured", "Sécurisés"],
                  ["in_progress", "En cours"],
                  ["completed", "Terminés"],
                  ["dispute", "Litiges"],
                ].map(([val, label]) => (
                  <button
                    key={val}
                    onClick={() => setFilterStatus(val)}
                    className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-medium transition-all border ${
                      filterStatus === val
                        ? "gradient-emerald text-primary-foreground border-transparent shadow-glow-emerald"
                        : "bg-card text-navy-700 border-border hover:border-emerald-300"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>

              {loadingDeals ? (
                <div className="space-y-3">
                  {[1,2,3,4].map(i => <div key={i} className="h-14 bg-muted rounded-xl animate-pulse" />)}
                </div>
              ) : filteredDeals.length === 0 ? (
                <div className="bg-card rounded-2xl border border-border p-8 sm:p-12 text-center">
                  <p className="text-muted-foreground">Aucun lien dans cette catégorie.</p>
                </div>
              ) : (
                <>
                  {/* Mobile card list */}
                  <div className="space-y-2 md:hidden">
                    {filteredDeals.map((deal) => {
                      const s = STATUS_CONFIG[deal.status];
                      const Icon = s.icon;
                      return (
                        <div
                          key={deal.id}
                          className="bg-card rounded-xl border border-border p-3 flex items-center gap-3 hover:shadow-md transition-shadow cursor-pointer active:bg-muted/50"
                          onClick={() => navigate(`/deals/${deal.secure_token}`)}
                        >
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-navy-900 text-sm truncate">{deal.client_name}</p>
                            <p className="text-muted-foreground text-xs truncate">{deal.title}</p>
                          </div>
                          <div className="text-right flex-shrink-0">
                            <p className="font-bold text-navy-900 text-xs">{deal.amount.toLocaleString()} {deal.currency}</p>
                          </div>
                          <span className={`flex-shrink-0 flex items-center gap-1 text-[10px] font-medium px-2 py-1 rounded-full ${s.className}`}>
                            <Icon className="w-3 h-3" />
                          </span>
                        </div>
                      );
                    })}
                  </div>

                  {/* Desktop table */}
                  <div className="bg-card rounded-2xl border border-border overflow-hidden hidden md:block">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-border bg-muted/50">
                            <th className="text-left p-4 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Client</th>
                            <th className="text-left p-4 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Service</th>
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
                              <tr
                                key={deal.id}
                                className="hover:bg-muted/30 transition-colors cursor-pointer"
                                onClick={() => navigate(`/deals/${deal.secure_token}`)}
                              >
                                <td className="p-4 font-medium text-navy-900 text-sm">{deal.client_name}</td>
                                <td className="p-4 text-muted-foreground text-sm max-w-[200px] truncate">{deal.title}</td>
                                <td className="p-4 font-bold text-navy-900 text-sm whitespace-nowrap">{deal.amount.toLocaleString()} {deal.currency}</td>
                                <td className="p-4">
                                  <span className={`flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full w-fit ${s.className}`}>
                                    <Icon className="w-3 h-3" />
                                    {s.label}
                                  </span>
                                </td>
                                <td className="p-4 text-muted-foreground text-sm hidden lg:table-cell">
                                  {deal.delivery_deadline ? new Date(deal.delivery_deadline).toLocaleDateString("fr-FR") : "—"}
                                </td>
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
                </>
              )}
            </div>
          )}

          {/* SUBSCRIPTION */}
          {activeSection === "subscription" && (
            <div className="max-w-4xl">
              <p className="text-muted-foreground mb-6 sm:mb-8 text-sm sm:text-base">Choisissez le plan adapté à votre activité.</p>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                {[
                  { key: "basic", name: "Basic", price: "Gratuit", commission: "15%", deals: "3 liens", features: ["Lien sécurisé", "Support email"] },
                  { key: "essentiel", name: "Essentiel", price: "9 900 XOF/mois", commission: "9%", deals: "10 liens", features: ["Tout Basic", "Notifications SMS", "Tableau de bord"], popular: false },
                  { key: "standard", name: "Standard", price: "19 900 XOF/mois", commission: "6%", deals: "25 liens", features: ["Tout Essentiel", "API Access", "Support prioritaire"], popular: true },
                  { key: "premium", name: "Premium", price: "27 900 XOF/mois", commission: "5%", deals: "Illimité", features: ["Tout Standard", "Manager dédié", "SLA garanti"] },
                ].map((plan) => {
                  const isCurrent = subscription?.plan === plan.key;
                  return (
                    <div key={plan.name} className={`rounded-2xl border p-4 sm:p-6 relative ${plan.popular ? "border-emerald-400 bg-emerald-50" : "border-border bg-card"} ${isCurrent ? "ring-2 ring-emerald-400 ring-offset-2" : ""}`}>
                      {plan.popular && <span className="absolute -top-3 left-1/2 -translate-x-1/2 gradient-emerald text-primary-foreground text-[10px] sm:text-xs font-bold px-2 sm:px-3 py-0.5 sm:py-1 rounded-full whitespace-nowrap">Populaire</span>}
                      {isCurrent && <span className="absolute -top-3 right-2 sm:right-4 bg-navy-900 text-primary-foreground text-[10px] sm:text-xs font-bold px-2 sm:px-3 py-0.5 sm:py-1 rounded-full">Actuel</span>}
                      <h3 className="font-bold text-navy-900 text-sm sm:text-lg mb-0.5 sm:mb-1">{plan.name}</h3>
                      <p className="text-lg sm:text-2xl font-bold text-navy-900 mb-0.5 sm:mb-1">{plan.price}</p>
                      <div className="text-emerald-600 font-semibold text-xs sm:text-sm mb-0.5 sm:mb-1">{plan.commission} commission</div>
                      <div className="text-muted-foreground text-xs sm:text-sm mb-3 sm:mb-4">{plan.deals} actifs</div>
                      <ul className="space-y-1.5 sm:space-y-2 mb-4 sm:mb-6">
                        {plan.features.map(f => (
                          <li key={f} className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-navy-700">
                            <CheckCircle className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-emerald-500 flex-shrink-0" />
                            <span className="truncate">{f}</span>
                          </li>
                        ))}
                      </ul>
                      <Button
                        className={`w-full rounded-xl text-xs sm:text-sm ${isCurrent ? "bg-muted text-muted-foreground" : "gradient-emerald text-primary-foreground border-0 hover:opacity-90"}`}
                        disabled={isCurrent}
                      >
                        {isCurrent ? "Actuel" : "Choisir"}
                      </Button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* OTHER SECTIONS */}
          {(activeSection === "notifications" || activeSection === "settings") && (
            <div className="bg-card rounded-2xl border border-border p-8 sm:p-12 text-center">
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl gradient-hero flex items-center justify-center mx-auto mb-4">
                {activeSection === "notifications" ? <Bell className="w-7 h-7 sm:w-8 sm:h-8 text-emerald-400" /> : <Settings className="w-7 h-7 sm:w-8 sm:h-8 text-emerald-400" />}
              </div>
              <h3 className="font-bold text-navy-900 text-lg sm:text-xl mb-2">
                {activeSection === "notifications" ? "Notifications" : "Paramètres"}
              </h3>
              <p className="text-muted-foreground text-sm">Bientôt disponible.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default ProviderDashboard;
