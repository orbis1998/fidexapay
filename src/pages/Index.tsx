import { Link } from "react-router-dom";
import {
  Shield, Lock, ArrowRight, CheckCircle, Play,
  Zap, Globe, Users, Briefcase, Home, Truck, Star,
  TrendingUp, Eye, Clock, Award
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import heroBg from "@/assets/hero-bg.jpg";
import securityIllustration from "@/assets/security-illustration.jpg";

// ── Step card ──────────────────────────────────────────────
const Step = ({
  number, icon: Icon, title, description, isLast
}: {
  number: number; icon: any; title: string; description: string; isLast?: boolean;
}) => (
  <div className="flex flex-col items-center text-center relative">
    <div className="relative mb-6">
      <div className="w-16 h-16 rounded-2xl gradient-hero flex items-center justify-center shadow-lg border border-navy-600/30">
        <Icon className="w-7 h-7 text-emerald-400" />
      </div>
      <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full gradient-emerald flex items-center justify-center text-xs font-bold text-white">
        {number}
      </div>
    </div>
    {!isLast && (
      <div className="hidden md:block absolute top-8 left-[calc(50%+40px)] right-[calc(-50%+40px)] h-px bg-gradient-to-r from-emerald-500/40 to-emerald-500/10" />
    )}
    <h3 className="font-bold text-navy-800 mb-2 text-lg">{title}</h3>
    <p className="text-muted-foreground text-sm leading-relaxed max-w-[180px]">{description}</p>
  </div>
);

// ── Use case card ──────────────────────────────────────────
const UseCase = ({ icon: Icon, title, description }: { icon: any; title: string; description: string }) => (
  <div className="glass-card-dark rounded-2xl p-6 card-hover group">
    <div className="w-12 h-12 rounded-xl bg-emerald-500/15 flex items-center justify-center mb-4 group-hover:bg-emerald-500/25 transition-colors">
      <Icon className="w-6 h-6 text-emerald-400" />
    </div>
    <h3 className="font-bold text-white mb-2">{title}</h3>
    <p className="text-navy-300 text-sm leading-relaxed">{description}</p>
  </div>
);

// ── Stat card ──────────────────────────────────────────────
const StatCard = ({ value, label }: { value: string; label: string }) => (
  <div className="text-center">
    <div className="text-3xl md:text-4xl font-bold text-gradient-emerald mb-1">{value}</div>
    <div className="text-navy-300 text-sm">{label}</div>
  </div>
);

// ── Trust feature ──────────────────────────────────────────
const TrustFeature = ({ icon: Icon, title, description }: { icon: any; title: string; description: string }) => (
  <div className="flex gap-4">
    <div className="flex-shrink-0 w-10 h-10 rounded-xl gradient-emerald flex items-center justify-center">
      <Icon className="w-5 h-5 text-white" />
    </div>
    <div>
      <h4 className="font-semibold text-navy-800 mb-1">{title}</h4>
      <p className="text-muted-foreground text-sm leading-relaxed">{description}</p>
    </div>
  </div>
);

// ════════════════════════════════════════════════════════════
const HomePage = () => {
  return (
    <div className="min-h-screen overflow-x-hidden">
      <Navbar />

      {/* ── HERO ─────────────────────────────────────────── */}
      <section className="relative min-h-screen flex items-center gradient-hero overflow-hidden">
        {/* Background image overlay */}
        <div
          className="absolute inset-0 opacity-20"
          style={{ backgroundImage: `url(${heroBg})`, backgroundSize: "cover", backgroundPosition: "center" }}
        />

        {/* Glow orbs */}
        <div className="absolute top-1/4 -left-32 w-96 h-96 rounded-full bg-emerald-500/15 blur-3xl animate-orb" />
        <div className="absolute bottom-1/4 -right-32 w-80 h-80 rounded-full bg-blue-500/10 blur-3xl animate-orb" style={{ animationDelay: "3s" }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 w-64 h-64 rounded-full bg-gold-500/8 blur-3xl animate-orb" style={{ animationDelay: "6s" }} />

        <div className="container mx-auto px-6 relative z-10 py-32">
          <div className="max-w-4xl mx-auto text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 glass-card rounded-full px-4 py-2 mb-8 animate-fade-in">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-emerald-300 text-xs font-medium tracking-wide">
                Accès beta limité — Rejoignez les premiers prestataires
              </span>
            </div>

            {/* Headline */}
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight animate-fade-up">
              Sécurisez chaque
              <br />
              <span className="text-gradient-emerald">collaboration</span> avec
              <br />
              confiance
            </h1>

            <p className="text-lg md:text-xl text-navy-200 mb-10 max-w-2xl mx-auto leading-relaxed animate-fade-up" style={{ animationDelay: "0.1s" }}>
              FidexaPay bloque les fonds du client jusqu'à la validation de la livraison. Ni escroquerie, ni impayé — juste des échanges sereins.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-up" style={{ animationDelay: "0.2s" }}>
              <Link to="/auth?tab=register">
                <Button size="lg" className="gradient-emerald text-white border-0 shadow-glow-emerald hover:opacity-90 text-base px-8 py-6 rounded-xl font-semibold group">
                  Sécuriser un deal
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link to="/auth?tab=register">
                <Button size="lg" variant="outline" className="border-white/20 text-white hover:bg-white/10 text-base px-8 py-6 rounded-xl font-semibold bg-transparent">
                  Devenir prestataire
                </Button>
              </Link>
            </div>

            {/* Trust badges */}
            <div className="flex flex-wrap items-center justify-center gap-6 mt-12 animate-fade-in" style={{ animationDelay: "0.4s" }}>
              {[
                { icon: Lock, label: "Fonds 100% sécurisés" },
                { icon: Shield, label: "Protection garantie" },
                { icon: CheckCircle, label: "Sans compte requis" },
              ].map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-center gap-2">
                  <Icon className="w-4 h-4 text-emerald-400" />
                  <span className="text-navy-300 text-sm font-medium">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 40C240 80 480 0 720 40C960 80 1200 0 1440 40V80H0V40Z" fill="hsl(0 0% 99%)" />
          </svg>
        </div>
      </section>

      {/* ── STATS BAR ────────────────────────────────────── */}
      <section className="py-12 bg-background border-y border-border">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <StatCard value="500+" label="Prestataires actifs" />
            <StatCard value="12M XOF" label="Fonds sécurisés" />
            <StatCard value="98%" label="Taux de satisfaction" />
            <StatCard value="< 24h" label="Temps de résolution" />
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ──────────────────────────────────── */}
      <section id="how-it-works" className="py-24 gradient-section">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <span className="inline-block text-emerald-600 text-sm font-semibold tracking-widest uppercase mb-3">
              Processus simple
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-navy-900 mb-4">
              Comment ça marche ?
            </h2>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">
              En 4 étapes, sécurisez vos transactions professionnelles de A à Z.
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8 md:gap-4 relative">
            <Step number={1} icon={Briefcase} title="Créer le deal" description="Le prestataire crée un contrat digital avec tous les détails de la mission." />
            <Step number={2} icon={Lock} title="Le client paie" description="Le client reçoit un lien sécurisé et effectue le paiement en escrow." />
            <Step number={3} icon={CheckCircle} title="Mission réalisée" description="Le prestataire livre la mission dans les délais convenus." />
            <Step number={4} icon={Zap} title="Fonds libérés" description="Après validation, les fonds sont automatiquement virés au prestataire." isLast />
          </div>

          {/* Demo CTA */}
          <div className="mt-16 text-center">
            <div className="inline-flex flex-col sm:flex-row items-center gap-4 glass-card-dark rounded-2xl p-6">
              <div className="w-14 h-14 rounded-full gradient-emerald flex items-center justify-center shadow-glow-emerald animate-pulse-slow">
                <Play className="w-6 h-6 text-white ml-0.5" />
              </div>
              <div className="text-left">
                <p className="text-white font-semibold">Voir la démo en vidéo</p>
                <p className="text-navy-300 text-sm">Découvrez FidexaPay en 2 minutes</p>
              </div>
              <Button variant="outline" className="border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10 ml-auto">
                Regarder
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* ── USE CASES ──────────────────────────────────────── */}
      <section id="use-cases" className="py-24 gradient-hero relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: `url(${heroBg})`, backgroundSize: "cover" }} />
        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center mb-16">
            <span className="inline-block text-emerald-400 text-sm font-semibold tracking-widest uppercase mb-3">
              Versatilité
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Qui peut utiliser FidexaPay ?
            </h2>
            <p className="text-navy-200 text-lg max-w-xl mx-auto">
              Une solution adaptée à tous les professionnels qui veulent travailler en confiance.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <UseCase icon={Users} title="Freelances & Indépendants" description="Sécurisez vos projets digitaux, graphiques, rédactionnels sans risque d'impayé." />
            <UseCase icon={Briefcase} title="Agences & Studios" description="Gérez plusieurs clients en parallèle avec des contrats clairs et des paiements garantis." />
            <UseCase icon={Home} title="Artisans & BTP" description="Projets de construction, rénovation — recevez vos acomptes en toute sécurité." />
            <UseCase icon={Globe} title="Diaspora & International" description="Envoyez de l'argent pour des services en Afrique sans risque de fraude ou d'escroquerie." />
            <UseCase icon={Truck} title="Commerce & Livraison" description="Transactions commerciales sécurisées pour acheteurs et vendeurs à distance." />
            <UseCase icon={Star} title="Consultants & Experts" description="Honoraires protégés pour vos missions de conseil, formation ou audit." />
          </div>
        </div>
      </section>

      {/* ── SECURITY ───────────────────────────────────────── */}
      <section id="security" className="py-24 bg-background">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <span className="inline-block text-emerald-600 text-sm font-semibold tracking-widest uppercase mb-3">
                Confiance & Sécurité
              </span>
              <h2 className="text-4xl md:text-5xl font-bold text-navy-900 mb-6">
                Votre argent est{" "}
                <span className="text-gradient-emerald">en sécurité</span>
              </h2>
              <p className="text-muted-foreground text-lg mb-10 leading-relaxed">
                FidexaPay utilise une infrastructure de sécurité bancaire pour protéger chaque transaction. Vos fonds ne sont jamais en risque.
              </p>
              <div className="space-y-6">
                <TrustFeature icon={Lock} title="Fonds bloqués en escrow" description="Les paiements sont sécurisés dans un compte séquestre jusqu'à validation de la livraison." />
                <TrustFeature icon={Eye} title="Traçabilité complète" description="Chaque étape du deal est documentée et accessible aux deux parties en temps réel." />
                <TrustFeature icon={Clock} title="Protection contre les litiges" description="Système de résolution intégré avec arbitrage FidexaPay en cas de désaccord." />
                <TrustFeature icon={Award} title="Conforme aux standards" description="Infrastructure conforme aux réglementations financières africaines et internationales." />
              </div>
            </div>
            <div className="relative">
              <div className="absolute inset-0 gradient-emerald opacity-10 rounded-3xl blur-3xl" />
              <img
                src={securityIllustration}
                alt="Sécurité FidexaPay"
                className="relative rounded-3xl shadow-2xl w-full animate-float"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── BETA SECTION ──────────────────────────────────── */}
      <section className="py-24 gradient-hero relative overflow-hidden">
        <div className="absolute inset-0 opacity-15" style={{ backgroundImage: `url(${heroBg})`, backgroundSize: "cover" }} />
        <div className="container mx-auto px-6 relative z-10 text-center">
          <div className="max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 glass-card rounded-full px-4 py-2 mb-8">
              <TrendingUp className="w-4 h-4 text-gold-400" />
              <span className="text-gold-300 text-xs font-medium">Accès Beta Limité</span>
            </div>
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Rejoignez les pionniers
              <br />
              <span className="text-gradient-gold">de l'escrow africain</span>
            </h2>
            <p className="text-navy-200 text-xl mb-10 leading-relaxed">
              Les 100 premiers prestataires bénéficient d'un accès prioritaire, de commissions réduites et d'un accompagnement personnalisé.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/auth?tab=register">
                <Button size="lg" className="gradient-gold text-navy-900 border-0 shadow-glow-gold hover:opacity-90 text-base px-10 py-6 rounded-xl font-bold">
                  Demander l'accès beta
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
            <p className="text-navy-400 text-sm mt-6">
              Plus que <strong className="text-gold-400">47 places</strong> disponibles sur 100
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default HomePage;
