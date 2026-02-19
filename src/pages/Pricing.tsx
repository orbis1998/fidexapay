import { Link } from "react-router-dom";
import { Shield, CheckCircle, ArrowRight, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const plans = [
  {
    name: "Basic",
    tagline: "Pour démarrer",
    price: "Gratuit",
    period: "",
    commission: "15%",
    deals: "3 deals actifs",
    color: "border-border",
    headerBg: "bg-navy-50",
    features: [
      "Lien deal sécurisé unique",
      "Page client sans compte",
      "Suivi du statut en temps réel",
      "Support par email",
    ],
    cta: "Commencer gratuitement",
    popular: false,
    gradient: false,
  },
  {
    name: "Essentiel",
    tagline: "Le plus populaire",
    price: "9 900",
    period: "XOF/mois",
    commission: "9%",
    deals: "10 deals actifs",
    color: "border-emerald-300",
    headerBg: "gradient-emerald",
    features: [
      "Tout ce qui est inclus dans Basic",
      "Notifications SMS client",
      "Tableau de bord complet",
      "Historique des transactions",
      "Support prioritaire",
    ],
    cta: "Choisir Essentiel",
    popular: true,
    gradient: true,
  },
  {
    name: "Standard",
    tagline: "Pour les pros",
    price: "19 900",
    period: "XOF/mois",
    commission: "6%",
    deals: "25 deals actifs",
    color: "border-border",
    headerBg: "bg-navy-100",
    features: [
      "Tout ce qui est inclus dans Essentiel",
      "API Access & webhooks",
      "Branding personnalisé sur le lien",
      "Rapports exportables PDF",
      "Support dédié par chat",
    ],
    cta: "Choisir Standard",
    popular: false,
    gradient: false,
  },
  {
    name: "Premium",
    tagline: "Illimité & prioritaire",
    price: "27 900",
    period: "XOF/mois",
    commission: "5%",
    deals: "Deals illimités",
    color: "border-gold-400",
    headerBg: "gradient-gold",
    features: [
      "Tout ce qui est inclus dans Standard",
      "Manager de compte dédié",
      "SLA garanti 99.9%",
      "Intégrations sur mesure",
      "Formation équipe incluse",
    ],
    cta: "Choisir Premium",
    popular: false,
    gradient: false,
  },
];

const PricingPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="gradient-hero pt-32 pb-20 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-emerald-500/10 blur-3xl" />
        <div className="container mx-auto px-6 text-center relative z-10">
          <span className="inline-block text-emerald-400 text-sm font-semibold tracking-widest uppercase mb-4">Tarification</span>
          <h1 className="text-4xl md:text-6xl font-bold text-primary-foreground mb-4">
            Des plans adaptés à{" "}
            <span className="text-gradient-emerald">chaque activité</span>
          </h1>
          <p className="text-navy-200 text-xl max-w-xl mx-auto">
            Commencez gratuitement et évoluez selon vos besoins. Aucune carte de crédit requise.
          </p>
        </div>
      </section>

      {/* Plans */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-6">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto -mt-10">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`bg-card rounded-2xl border-2 ${plan.color} overflow-hidden shadow-sm card-hover relative ${plan.popular ? "ring-2 ring-emerald-400 ring-offset-4" : ""}`}
              >
                {plan.popular && (
                  <div className="absolute top-4 right-4">
                    <span className="gradient-emerald text-primary-foreground text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                      <Star className="w-3 h-3" /> Populaire
                    </span>
                  </div>
                )}

                {/* Header */}
                <div className={`p-6 pb-4 ${plan.gradient ? "gradient-emerald" : plan.name === "Premium" ? "gradient-gold" : "bg-navy-50"}`}>
                  <h2 className={`text-xl font-bold mb-0.5 ${plan.gradient || plan.name === "Premium" ? "text-primary-foreground" : "text-navy-900"}`}>
                    {plan.name}
                  </h2>
                  <p className={`text-sm ${plan.gradient || plan.name === "Premium" ? "text-primary-foreground/80" : "text-muted-foreground"}`}>
                    {plan.tagline}
                  </p>
                </div>

                {/* Pricing */}
                <div className="px-6 py-5 border-b border-border">
                  <div className="flex items-baseline gap-1 mb-1">
                    {plan.price === "Gratuit" ? (
                      <span className="text-3xl font-bold text-navy-900">Gratuit</span>
                    ) : (
                      <>
                        <span className="text-3xl font-bold text-navy-900">{plan.price}</span>
                        <span className="text-muted-foreground text-sm">{plan.period}</span>
                      </>
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-emerald-600 font-bold text-sm">{plan.commission} commission</span>
                    <span className="text-muted-foreground text-sm">·</span>
                    <span className="text-muted-foreground text-sm">{plan.deals}</span>
                  </div>
                </div>

                {/* Features */}
                <div className="px-6 py-5 flex-1">
                  <ul className="space-y-3">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-start gap-2.5">
                        <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-navy-700">{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* CTA */}
                <div className="px-6 pb-6">
                  <Link to="/auth?tab=register">
                    <Button
                      className={`w-full rounded-xl font-semibold text-sm ${
                        plan.popular
                          ? "gradient-emerald text-primary-foreground border-0 shadow-glow-emerald hover:opacity-90"
                          : plan.name === "Premium"
                          ? "gradient-gold text-navy-900 border-0 hover:opacity-90"
                          : "border-border text-navy-700 bg-card hover:bg-muted"
                      }`}
                      variant={plan.popular || plan.name === "Premium" ? "default" : "outline"}
                    >
                      {plan.cta}
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ / Note */}
      <section className="py-16 bg-secondary">
        <div className="container mx-auto px-6 max-w-3xl text-center">
          <h2 className="text-3xl font-bold text-navy-900 mb-4">Toutes les questions fréquentes</h2>
          <p className="text-muted-foreground mb-8">
            Les commissions sont prélevées uniquement lors de la libération des fonds. Pas de deal libéré = pas de commission.
          </p>
          <div className="grid sm:grid-cols-2 gap-4 text-left">
            {[
              { q: "Quand la commission est-elle prélevée ?", a: "Uniquement lors de la libération des fonds, après validation du client." },
              { q: "Puis-je changer de plan ?", a: "Oui, vous pouvez upgrader ou downgrader à tout moment sans pénalité." },
              { q: "Comment fonctionne l'escrow ?", a: "Les fonds du client sont bloqués dans un compte séquestre jusqu'à validation de la livraison." },
              { q: "Y a-t-il un engagement ?", a: "Non, les plans mensuels sont sans engagement. Le plan Basic est gratuit à vie." },
            ].map(({ q, a }) => (
              <div key={q} className="bg-card rounded-xl border border-border p-5">
                <p className="font-semibold text-navy-900 mb-2 text-sm">{q}</p>
                <p className="text-muted-foreground text-sm leading-relaxed">{a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default PricingPage;
