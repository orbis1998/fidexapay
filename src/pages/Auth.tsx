import { useState } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { Shield, Eye, EyeOff, ArrowLeft, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import heroBg from "@/assets/hero-bg.jpg";

const AuthPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { signIn, signUp, user } = useAuth();
  const defaultTab = searchParams.get("tab") === "register" ? "register" : "login";
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // Already logged in? Redirect via effect-like early render
  if (user) {
    navigate("/dashboard", { replace: true });
    return null;
  }

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const fd = new FormData(e.currentTarget);
    const { error } = await signIn(fd.get("email") as string, fd.get("password") as string);
    setLoading(false);
    if (error) {
      toast.error("Identifiants incorrects. Vérifiez votre email et mot de passe.");
    } else {
      toast.success("Connexion réussie !");
      navigate("/dashboard");
    }
  };

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const fd = new FormData(e.currentTarget);
    const fullName = `${fd.get("firstName")} ${fd.get("lastName")}`.trim();
    const email = fd.get("email") as string;
    const password = fd.get("password") as string;

    if (password.length < 8) {
      toast.error("Le mot de passe doit contenir au moins 8 caractères.");
      setLoading(false);
      return;
    }

    const { error } = await signUp(email, password, fullName);
    setLoading(false);
    if (error) {
      toast.error(error.message || "Erreur lors de la création du compte.");
    } else {
      toast.success("Compte créé ! Vérifiez votre email pour confirmer votre inscription.", { duration: 6000 });
      navigate("/dashboard");
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left panel - decorative */}
      <div className="hidden lg:flex lg:w-1/2 gradient-hero relative overflow-hidden flex-col justify-between p-12">
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: `url(${heroBg})`, backgroundSize: "cover" }} />
        <div className="absolute top-1/3 -left-20 w-80 h-80 rounded-full bg-emerald-500/15 blur-3xl animate-orb" />
        <div className="absolute bottom-1/4 right-0 w-64 h-64 rounded-full bg-blue-500/10 blur-3xl animate-orb" style={{ animationDelay: "4s" }} />

        {/* Logo */}
        <div className="relative z-10 flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl gradient-emerald flex items-center justify-center shadow-glow-emerald">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold text-white tracking-tight">
            Fidexa<span className="text-gradient-emerald">Pay</span>
          </span>
        </div>

        {/* Tagline */}
        <div className="relative z-10">
          <h1 className="text-4xl font-bold text-white mb-4 leading-tight">
            Payer et livrer<br />
            <span className="text-gradient-emerald">en toute sérénité.</span>
          </h1>
          <p className="text-navy-200 text-lg leading-relaxed mb-8">
            L'infrastructure d'escrow digital qui protège vos transactions en Afrique et dans la diaspora.
          </p>
          <div className="space-y-3">
            {[
              "Fonds sécurisés jusqu'à la livraison",
              "Résolution de litiges intégrée",
              "Tableau de bord complet",
            ].map((item) => (
              <div key={item} className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                <span className="text-navy-200 text-sm">{item}</span>
              </div>
            ))}
          </div>
        </div>

        <p className="relative z-10 text-navy-400 text-xs">
          Un produit par <span className="text-gold-400 font-semibold">Orbis Creativa Agency</span>
        </p>
      </div>

      {/* Right panel - form */}
      <div className="flex-1 flex flex-col justify-center px-6 py-12 bg-background">
        <div className="max-w-md w-full mx-auto">
          {/* Back link */}
          <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground text-sm mb-8 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Retour à l'accueil
          </Link>

          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-2.5 mb-8">
            <div className="w-8 h-8 rounded-lg gradient-emerald flex items-center justify-center">
              <Shield className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-bold text-navy-900">FidexaPay</span>
          </div>

          <Tabs defaultValue={defaultTab}>
            <TabsList className="grid grid-cols-2 mb-8 bg-muted rounded-xl p-1">
              <TabsTrigger value="login" className="rounded-lg font-medium">Connexion</TabsTrigger>
              <TabsTrigger value="register" className="rounded-lg font-medium">Inscription</TabsTrigger>
            </TabsList>

            {/* LOGIN */}
            <TabsContent value="login">
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-navy-900 mb-1">Bon retour 👋</h2>
                <p className="text-muted-foreground text-sm">Connectez-vous à votre espace prestataire</p>
              </div>
              <form onSubmit={handleLogin} className="space-y-5">
                <div>
                  <Label htmlFor="email" className="text-navy-700 font-medium mb-1.5 block">Email</Label>
                  <Input id="email" name="email" type="email" placeholder="vous@exemple.com" className="h-11 rounded-xl border-border" required />
                </div>
                <div>
                  <Label htmlFor="password" className="text-navy-700 font-medium mb-1.5 block">Mot de passe</Label>
                  <div className="relative">
                    <Input id="password" name="password" type={showPassword ? "text" : "password"} placeholder="••••••••" className="h-11 rounded-xl border-border pr-11" required />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                <div className="flex justify-end">
                  <Link to="/forgot-password" className="text-sm text-emerald-600 hover:text-emerald-700 font-medium">
                    Mot de passe oublié ?
                  </Link>
                </div>
                <Button type="submit" className="w-full h-11 gradient-emerald text-white border-0 rounded-xl font-semibold shadow-glow-emerald hover:opacity-90" disabled={loading}>
                  {loading ? "Connexion..." : "Se connecter"}
                </Button>
              </form>
            </TabsContent>

            {/* REGISTER */}
            <TabsContent value="register">
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-navy-900 mb-1">Créer un compte</h2>
                <p className="text-muted-foreground text-sm">Rejoignez les prestataires qui travaillent en confiance</p>
              </div>
              <form onSubmit={handleRegister} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label className="text-navy-700 font-medium mb-1.5 block text-sm">Prénom</Label>
                    <Input name="firstName" type="text" placeholder="Jean" className="h-11 rounded-xl border-border" required />
                  </div>
                  <div>
                    <Label className="text-navy-700 font-medium mb-1.5 block text-sm">Nom</Label>
                    <Input name="lastName" type="text" placeholder="Dupont" className="h-11 rounded-xl border-border" required />
                  </div>
                </div>
                <div>
                  <Label className="text-navy-700 font-medium mb-1.5 block text-sm">Email professionnel</Label>
                  <Input name="email" type="email" placeholder="vous@exemple.com" className="h-11 rounded-xl border-border" required />
                </div>
                <div>
                  <Label className="text-navy-700 font-medium mb-1.5 block text-sm">Téléphone</Label>
                  <Input name="phone" type="tel" placeholder="+225 00 00 00 00 00" className="h-11 rounded-xl border-border" />
                </div>
                <div>
                  <Label className="text-navy-700 font-medium mb-1.5 block text-sm">Mot de passe</Label>
                  <div className="relative">
                    <Input name="password" type={showPassword ? "text" : "password"} placeholder="Min. 8 caractères" className="h-11 rounded-xl border-border pr-11" required minLength={8} />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">
                  En créant un compte, vous acceptez les{" "}
                  <Link to="/" className="text-emerald-600 hover:underline">conditions d'utilisation</Link>{" "}
                  et les{" "}
                  <Link to="/" className="text-emerald-600 hover:underline">règles d'escrow</Link>.
                </p>
                <Button type="submit" className="w-full h-11 gradient-emerald text-white border-0 rounded-xl font-semibold shadow-glow-emerald hover:opacity-90" disabled={loading}>
                  {loading ? "Création..." : "Créer mon compte"}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
