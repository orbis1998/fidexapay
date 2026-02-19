import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Shield, Users, FileText, AlertTriangle, TrendingUp,
  DollarSign, ChevronRight, Eye, CheckCircle, Clock,
  XCircle, BarChart3, Settings, LogOut, Menu
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const PROVIDERS = [
  { id: 1, name: "Jean Dupont", email: "jean@exemple.com", plan: "Essentiel", deals: 7, revenue: "1,630,000 XOF", status: "active" },
  { id: 2, name: "Fatima Koné", email: "fatima@creative.ci", plan: "Standard", deals: 18, revenue: "4,200,000 XOF", status: "active" },
  { id: 3, name: "Marc Nguema", email: "marc@devstudio.cm", plan: "Basic", deals: 2, revenue: "380,000 XOF", status: "active" },
  { id: 4, name: "Amina Diallo", email: "amina@consulting.sn", plan: "Premium", deals: 32, revenue: "9,700,000 XOF", status: "suspended" },
  { id: 5, name: "Kwame Asante", email: "kwame@webgh.com", plan: "Essentiel", deals: 5, revenue: "870,000 XOF", status: "active" },
];

const ALL_DEALS = [
  { id: "FX-001", provider: "Jean Dupont", client: "Kofi Mensah", amount: "450,000 XOF", status: "completed", date: "15 déc. 2024" },
  { id: "FX-002", provider: "Fatima Koné", client: "StartupCI", amount: "1,200,000 XOF", status: "progress", date: "18 déc. 2024" },
  { id: "FX-003", provider: "Marc Nguema", client: "EcoleXYZ", amount: "280,000 XOF", status: "dispute", date: "20 déc. 2024" },
  { id: "FX-004", provider: "Kwame Asante", client: "DiasporaFund", amount: "650,000 XOF", status: "secured", date: "22 déc. 2024" },
  { id: "FX-005", provider: "Jean Dupont", client: "Marie Traoré", amount: "320,000 XOF", status: "pending", date: "24 déc. 2024" },
];

const DISPUTES = [
  { id: "DIS-001", deal: "FX-003", provider: "Marc Nguema", client: "EcoleXYZ", reason: "Livrables non conformes au cahier des charges", status: "open", opened: "21 déc. 2024" },
  { id: "DIS-002", deal: "FX-2024-005", provider: "Jean Dupont", client: "David Chen", reason: "Délai de livraison non respecté de 12 jours", status: "investigating", opened: "18 déc. 2024" },
];

type AdminSection = "overview" | "providers" | "deals" | "disputes" | "analytics";

const AdminPanel = () => {
  const [section, setSection] = useState<AdminSection>("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const navItems: { id: AdminSection; label: string; icon: any }[] = [
    { id: "overview", label: "Vue d'ensemble", icon: BarChart3 },
    { id: "providers", label: "Prestataires", icon: Users },
    { id: "deals", label: "Tous les deals", icon: FileText },
    { id: "disputes", label: "Litiges", icon: AlertTriangle },
    { id: "analytics", label: "Analytiques", icon: TrendingUp },
  ];

  const statusBadge = (s: string) => {
    const map: Record<string, string> = {
      completed: "status-completed", progress: "status-progress",
      dispute: "status-dispute", secured: "status-secured",
      pending: "status-pending", open: "status-dispute",
      investigating: "status-pending", active: "status-completed", suspended: "status-dispute",
    };
    const labels: Record<string, string> = {
      completed: "Terminé", progress: "En cours", dispute: "Litige",
      secured: "Sécurisé", pending: "En attente", open: "Ouvert",
      investigating: "Investigation", active: "Actif", suspended: "Suspendu",
    };
    return <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${map[s] ?? "bg-muted"}`}>{labels[s] ?? s}</span>;
  };

  const sidebarContent = (
    <div className="flex flex-col h-full">
      <div className="px-4 mb-8">
        <div className="flex items-center gap-2.5 mb-1">
          <div className="w-8 h-8 rounded-lg gradient-emerald flex items-center justify-center">
            <Shield className="w-4 h-4 text-primary-foreground" />
          </div>
          <span className="font-bold text-primary-foreground">FidexaPay</span>
        </div>
        <span className="text-xs text-gold-400 font-semibold uppercase tracking-wider">Admin Panel</span>
      </div>

      <nav className="flex-1 px-2 space-y-1">
        {navItems.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => { setSection(id); setSidebarOpen(false); }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
              section === id
                ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                : "text-sidebar-foreground hover:bg-sidebar-accent"
            }`}
          >
            <Icon className="w-4 h-4" />
            {label}
            {id === "disputes" && <span className="ml-auto bg-red-500 text-primary-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center">2</span>}
          </button>
        ))}
      </nav>

      <div className="px-2 pt-4 border-t border-sidebar-border space-y-1">
        <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-sidebar-foreground hover:bg-sidebar-accent">
          <Settings className="w-4 h-4" />
          Paramètres
        </button>
        <button onClick={() => navigate("/")} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-sidebar-foreground hover:bg-sidebar-accent">
          <LogOut className="w-4 h-4" />
          Déconnexion
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-secondary overflow-hidden">
      {/* Sidebar desktop */}
      <aside className="hidden lg:flex w-64 bg-sidebar flex-col py-6 flex-shrink-0">
        {sidebarContent}
      </aside>

      {/* Sidebar mobile */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="w-64 bg-sidebar py-6 flex flex-col">{sidebarContent}</div>
          <div className="flex-1 bg-navy-900/60 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
        </div>
      )}

      {/* Main */}
      <main className="flex-1 overflow-y-auto">
        {/* Top bar */}
        <div className="sticky top-0 z-10 bg-background border-b border-border px-6 py-4 flex items-center gap-4">
          <button className="lg:hidden p-2 rounded-xl hover:bg-muted" onClick={() => setSidebarOpen(true)}>
            <Menu className="w-5 h-5 text-navy-700" />
          </button>
          <h1 className="text-xl font-bold text-navy-900">{navItems.find(n => n.id === section)?.label}</h1>
          <div className="ml-auto">
            <span className="text-xs bg-gold-400/20 text-gold-500 font-semibold px-3 py-1.5 rounded-full border border-gold-400/30">
              ⚙️ Super Admin
            </span>
          </div>
        </div>

        <div className="p-6">
          {/* OVERVIEW */}
          {section === "overview" && (
            <div className="space-y-6">
              <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4">
                {[
                  { label: "Prestataires actifs", value: "47", icon: Users, color: "bg-blue-100 text-blue-700", change: "+8 ce mois" },
                  { label: "Deals en cours", value: "128", icon: FileText, color: "bg-emerald-100 text-emerald-700", change: "+23%" },
                  { label: "Volume total escrow", value: "42.3M XOF", icon: DollarSign, color: "bg-amber-100 text-amber-700", change: "+31%" },
                  { label: "Litiges ouverts", value: "2", icon: AlertTriangle, color: "bg-red-100 text-red-700", change: "–1 résolu" },
                ].map(({ label, value, icon: Icon, color, change }) => (
                  <div key={label} className="bg-card rounded-2xl p-6 border border-border card-hover">
                    <div className="flex items-start justify-between mb-4">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}><Icon className="w-5 h-5" /></div>
                      <span className="text-xs text-emerald-600 font-semibold bg-emerald-50 px-2 py-1 rounded-full">{change}</span>
                    </div>
                    <p className="text-2xl font-bold text-navy-900 mb-1">{value}</p>
                    <p className="text-sm text-muted-foreground">{label}</p>
                  </div>
                ))}
              </div>

              {/* Recent disputes */}
              <div className="bg-card rounded-2xl border border-red-200/60 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-bold text-navy-900 flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-red-500" />
                    Litiges à traiter
                  </h2>
                  <button className="text-emerald-600 text-sm font-medium" onClick={() => setSection("disputes")}>Voir tous</button>
                </div>
                <div className="space-y-3">
                  {DISPUTES.map(d => (
                    <div key={d.id} className="flex items-center gap-4 p-4 bg-red-50 rounded-xl border border-red-100">
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-navy-900 text-sm">{d.deal} — {d.reason.slice(0, 50)}...</p>
                        <p className="text-muted-foreground text-xs">{d.provider} vs {d.client} · {d.opened}</p>
                      </div>
                      {statusBadge(d.status)}
                      <Button size="sm" className="gradient-emerald text-primary-foreground border-0 text-xs rounded-lg hover:opacity-90">Résoudre</Button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Subscription overview */}
              <div className="bg-card rounded-2xl border border-border p-6">
                <h2 className="font-bold text-navy-900 mb-4">Répartition des abonnements</h2>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {[
                    { plan: "Basic", count: 12, color: "bg-muted" },
                    { plan: "Essentiel", count: 21, color: "bg-blue-100 text-blue-800" },
                    { plan: "Standard", count: 10, color: "bg-emerald-100 text-emerald-800" },
                    { plan: "Premium", count: 4, color: "bg-gold-400/20 text-gold-500" },
                  ].map(({ plan, count, color }) => (
                    <div key={plan} className={`rounded-xl p-4 text-center ${color}`}>
                      <p className="text-2xl font-bold mb-1">{count}</p>
                      <p className="text-sm font-medium">{plan}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* PROVIDERS */}
          {section === "providers" && (
            <div className="bg-card rounded-2xl border border-border overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border bg-muted/50">
                      {["Prestataire", "Plan", "Deals", "CA Total", "Statut", "Actions"].map(h => (
                        <th key={h} className="text-left p-4 text-xs font-semibold text-muted-foreground uppercase tracking-wide">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {PROVIDERS.map(p => (
                      <tr key={p.id} className="hover:bg-muted/30 transition-colors">
                        <td className="p-4">
                          <p className="font-medium text-navy-900 text-sm">{p.name}</p>
                          <p className="text-muted-foreground text-xs">{p.email}</p>
                        </td>
                        <td className="p-4"><span className="text-sm font-medium text-navy-700">{p.plan}</span></td>
                        <td className="p-4 text-sm font-semibold text-navy-900">{p.deals}</td>
                        <td className="p-4 text-sm font-medium text-navy-900">{p.revenue}</td>
                        <td className="p-4">{statusBadge(p.status)}</td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <button className="p-1.5 rounded-lg hover:bg-muted"><Eye className="w-4 h-4 text-navy-400" /></button>
                            {p.status === "active"
                              ? <button className="p-1.5 rounded-lg hover:bg-red-50 text-red-500"><XCircle className="w-4 h-4" /></button>
                              : <button className="p-1.5 rounded-lg hover:bg-emerald-50 text-emerald-600"><CheckCircle className="w-4 h-4" /></button>
                            }
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* DEALS */}
          {section === "deals" && (
            <div className="bg-card rounded-2xl border border-border overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border bg-muted/50">
                      {["Référence", "Prestataire", "Client", "Montant", "Statut", "Date", "Action"].map(h => (
                        <th key={h} className="text-left p-4 text-xs font-semibold text-muted-foreground uppercase tracking-wide">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {ALL_DEALS.map(d => (
                      <tr key={d.id} className="hover:bg-muted/30 transition-colors">
                        <td className="p-4 font-mono text-xs text-navy-500">{d.id}</td>
                        <td className="p-4 text-sm font-medium text-navy-900">{d.provider}</td>
                        <td className="p-4 text-sm text-muted-foreground">{d.client}</td>
                        <td className="p-4 text-sm font-bold text-navy-900">{d.amount}</td>
                        <td className="p-4">{statusBadge(d.status)}</td>
                        <td className="p-4 text-sm text-muted-foreground">{d.date}</td>
                        <td className="p-4">
                          <Button size="sm" variant="outline" className="text-xs rounded-lg border-emerald-300 text-emerald-700 hover:bg-emerald-50">
                            Modifier statut
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* DISPUTES */}
          {section === "disputes" && (
            <div className="space-y-4">
              {DISPUTES.map(d => (
                <div key={d.id} className="bg-card rounded-2xl border border-border p-6">
                  <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-mono text-xs text-navy-500">{d.id}</span>
                        <span className="text-navy-500 text-xs">·</span>
                        <span className="font-mono text-xs text-navy-500">Deal {d.deal}</span>
                        {statusBadge(d.status)}
                      </div>
                      <h3 className="font-bold text-navy-900 mb-1">{d.reason}</h3>
                      <p className="text-muted-foreground text-sm">
                        <strong>{d.provider}</strong> vs <strong>{d.client}</strong> · Ouvert le {d.opened}
                      </p>
                    </div>
                    <div className="flex gap-2 flex-shrink-0">
                      <Button variant="outline" size="sm" className="rounded-xl border-red-200 text-red-600 hover:bg-red-50 text-xs">
                        Rembourser client
                      </Button>
                      <Button size="sm" className="gradient-emerald text-primary-foreground border-0 rounded-xl text-xs hover:opacity-90">
                        Libérer fonds
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ANALYTICS */}
          {section === "analytics" && (
            <div className="bg-card rounded-2xl border border-border p-12 text-center">
              <div className="w-16 h-16 rounded-2xl gradient-hero flex items-center justify-center mx-auto mb-4">
                <BarChart3 className="w-8 h-8 text-emerald-400" />
              </div>
              <h3 className="font-bold text-navy-900 text-xl mb-2">Analytiques avancées</h3>
              <p className="text-muted-foreground">Les graphiques et rapports détaillés seront disponibles après connexion Lovable Cloud.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminPanel;
