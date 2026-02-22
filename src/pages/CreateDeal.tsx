import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Shield, ArrowLeft, ArrowRight, Copy, CheckCircle, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const CreateDealPage = () => {
  const navigate = useNavigate();
  const { user, subscription } = useAuth();
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [copied, setCopied] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [dealToken, setDealToken] = useState("");

  const [form, setForm] = useState({
    clientName: "",
    clientEmail: "",
    clientPhone: "",
    title: "",
    serviceDescription: "",
    amount: "",
    currency: "XOF",
    deliveryDeadline: "",
    validationDeadline: "72",
    customConditions: "",
    agreeTerms: false,
    agreeEscrow: false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const commissionRate = subscription?.commission_rate ?? 15;
  const dealLink = dealToken ? `${window.location.origin}/deals/${dealToken}` : "";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSubmitting(true);

    const { data, error } = await supabase
      .from("deals")
      .insert({
        provider_id: user.id,
        client_name: form.clientName,
        client_email: form.clientEmail || null,
        client_phone: form.clientPhone || null,
        title: form.title || form.serviceDescription.slice(0, 80),
        description: form.serviceDescription,
        amount: parseFloat(form.amount),
        currency: form.currency,
        delivery_deadline: form.deliveryDeadline ? new Date(form.deliveryDeadline).toISOString() : null,
        validation_deadline: form.deliveryDeadline && form.validationDeadline
          ? new Date(new Date(form.deliveryDeadline).getTime() + parseInt(form.validationDeadline) * 3600000).toISOString()
          : null,
        custom_conditions: form.customConditions || null,
        status: "pending_payment",
      })
      .select("secure_token")
      .single();

    setSubmitting(false);

    if (error || !data) {
      toast.error("Erreur lors de la création du lien: " + (error?.message || "Erreur inconnue"));
      return;
    }

    setDealToken(data.secure_token);
    setSubmitted(true);
    toast.success("Lien créé avec succès !");
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(dealLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <div className="max-w-lg w-full text-center">
          <div className="w-20 h-20 rounded-full gradient-emerald flex items-center justify-center mx-auto mb-6 shadow-glow-emerald animate-pulse-slow">
            <CheckCircle className="w-10 h-10 text-primary-foreground" />
          </div>
          <h1 className="text-3xl font-bold text-navy-900 mb-3">Lien créé avec succès !</h1>
          <p className="text-muted-foreground mb-8">
            Envoyez ce lien sécurisé à votre client pour qu'il effectue le paiement en escrow.
          </p>

          {/* Deal link */}
          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5 mb-6">
            <p className="text-emerald-800 text-xs font-semibold mb-2 uppercase tracking-wide">Lien sécurisé</p>
            <div className="flex items-center gap-2 bg-white rounded-xl border border-emerald-200 p-3">
              <code className="text-emerald-700 text-sm flex-1 text-left truncate">{dealLink}</code>
              <button
                onClick={handleCopy}
                className="flex-shrink-0 p-1.5 rounded-lg hover:bg-emerald-50 text-emerald-600"
              >
                {copied ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Button onClick={() => navigate("/dashboard")} variant="outline" className="flex-1 rounded-xl">
              Retour au dashboard
            </Button>
            <Button
              onClick={() => navigate(`/deals/${dealToken}`)}
              className="flex-1 gradient-emerald text-primary-foreground border-0 rounded-xl shadow-glow-emerald hover:opacity-90"
            >
              Voir le lien
            </Button>
          </div>

          <p className="text-muted-foreground text-xs mt-6">
            Référence: <strong className="font-mono text-navy-700">{dealToken.slice(0, 12).toUpperCase()}</strong>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-secondary">
      {/* Header */}
      <div className="bg-background border-b border-border sticky top-0 z-10">
        <div className="container mx-auto px-6 py-4 flex items-center gap-4">
          <Link to="/dashboard" className="p-2 rounded-xl hover:bg-muted">
            <ArrowLeft className="w-5 h-5 text-navy-700" />
          </Link>
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg gradient-emerald flex items-center justify-center">
              <Shield className="w-3.5 h-3.5 text-primary-foreground" />
            </div>
            <span className="font-bold text-navy-900">Créer un lien</span>
          </div>

          {/* Step indicator */}
          <div className="ml-auto flex items-center gap-2">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center gap-2">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                  step >= s ? "gradient-emerald text-primary-foreground" : "bg-muted text-muted-foreground"
                }`}>{s}</div>
                {s < 3 && <div className={`w-8 h-0.5 rounded-full transition-all ${step > s ? "bg-emerald-400" : "bg-border"}`} />}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-10 max-w-2xl">
        <form onSubmit={handleSubmit}>
          {/* STEP 1 - Client info */}
          {step === 1 && (
            <div className="animate-fade-up">
              <h2 className="text-2xl font-bold text-navy-900 mb-2">Informations du client</h2>
              <p className="text-muted-foreground mb-8">Le client recevra un lien sécurisé pour accéder à la transaction.</p>
              <div className="bg-card rounded-2xl border border-border p-6 space-y-5">
                <div>
                  <Label className="text-navy-700 font-medium mb-1.5 block">Titre du lien *</Label>
                  <Input name="title" value={form.title} onChange={handleChange} placeholder="Ex: Développement site e-commerce" className="h-11 rounded-xl" required />
                </div>
                <div>
                  <Label className="text-navy-700 font-medium mb-1.5 block">Nom complet du client *</Label>
                  <Input name="clientName" value={form.clientName} onChange={handleChange} placeholder="Ex: Kofi Mensah" className="h-11 rounded-xl" required />
                </div>
                <div>
                  <Label className="text-navy-700 font-medium mb-1.5 block">Email du client *</Label>
                  <Input name="clientEmail" value={form.clientEmail} onChange={handleChange} type="email" placeholder="client@exemple.com" className="h-11 rounded-xl" required />
                </div>
                <div>
                  <Label className="text-navy-700 font-medium mb-1.5 block">Téléphone (optionnel)</Label>
                  <Input name="clientPhone" value={form.clientPhone} onChange={handleChange} type="tel" placeholder="+225 00 00 00 00 00" className="h-11 rounded-xl" />
                </div>
              </div>
              <Button type="button" onClick={() => setStep(2)} className="w-full mt-6 h-12 gradient-emerald text-primary-foreground border-0 rounded-xl font-semibold shadow-glow-emerald hover:opacity-90" disabled={!form.clientName || !form.clientEmail || !form.title}>
                Étape suivante <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          )}

          {/* STEP 2 - Deal details */}
          {step === 2 && (
            <div className="animate-fade-up">
              <h2 className="text-2xl font-bold text-navy-900 mb-2">Détails de la mission</h2>
              <p className="text-muted-foreground mb-8">Décrivez précisément ce qui est attendu pour ce deal.</p>
              <div className="bg-card rounded-2xl border border-border p-6 space-y-5">
                <div>
                  <Label className="text-navy-700 font-medium mb-1.5 block">Description du service *</Label>
                  <Textarea name="serviceDescription" value={form.serviceDescription} onChange={handleChange} placeholder="Décrivez précisément la mission, les livrables attendus et les critères de validation..." className="rounded-xl min-h-[120px] resize-none" required />
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div className="col-span-2">
                    <Label className="text-navy-700 font-medium mb-1.5 block">Montant total *</Label>
                    <Input name="amount" value={form.amount} onChange={handleChange} type="number" min="1" placeholder="500 000" className="h-11 rounded-xl" required />
                  </div>
                  <div>
                    <Label className="text-navy-700 font-medium mb-1.5 block">Devise</Label>
                    <select name="currency" value={form.currency} onChange={handleChange} className="h-11 w-full rounded-xl border border-input bg-background px-3 text-sm">
                      <option>XOF</option>
                      <option>EUR</option>
                      <option>USD</option>
                      <option>MAD</option>
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label className="text-navy-700 font-medium mb-1.5 block">Date de livraison *</Label>
                    <Input name="deliveryDeadline" value={form.deliveryDeadline} onChange={handleChange} type="date" className="h-11 rounded-xl" required min={new Date().toISOString().split("T")[0]} />
                  </div>
                  <div>
                    <Label className="text-navy-700 font-medium mb-1.5 block">Délai validation (h)</Label>
                    <Input name="validationDeadline" value={form.validationDeadline} onChange={handleChange} type="number" placeholder="72" className="h-11 rounded-xl" />
                  </div>
                </div>
                <div>
                  <Label className="text-navy-700 font-medium mb-1.5 block">Conditions personnalisées</Label>
                  <Textarea name="customConditions" value={form.customConditions} onChange={handleChange} placeholder="Conditions spécifiques, jalons, modalités de révision..." className="rounded-xl min-h-[80px] resize-none" />
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <Button type="button" onClick={() => setStep(1)} variant="outline" className="flex-1 h-12 rounded-xl">
                  <ArrowLeft className="w-4 h-4 mr-2" /> Retour
                </Button>
                <Button type="button" onClick={() => setStep(3)} className="flex-1 h-12 gradient-emerald text-primary-foreground border-0 rounded-xl font-semibold shadow-glow-emerald hover:opacity-90" disabled={!form.serviceDescription || !form.amount || !form.deliveryDeadline}>
                  Confirmer <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>
          )}

          {/* STEP 3 - Review & confirm */}
          {step === 3 && (
            <div className="animate-fade-up">
              <h2 className="text-2xl font-bold text-navy-900 mb-2">Récapitulatif & Confirmation</h2>
              <p className="text-muted-foreground mb-8">Vérifiez les informations avant de créer le lien.</p>

              <div className="bg-card rounded-2xl border border-border p-6 space-y-4 mb-5">
                <div className="flex justify-between py-2 border-b border-border">
                  <span className="text-muted-foreground text-sm">Titre</span>
                  <span className="font-semibold text-navy-900 text-sm">{form.title}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-border">
                  <span className="text-muted-foreground text-sm">Client</span>
                  <span className="font-semibold text-navy-900 text-sm">{form.clientName}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-border">
                  <span className="text-muted-foreground text-sm">Email</span>
                  <span className="font-medium text-navy-900 text-sm">{form.clientEmail}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-border">
                  <span className="text-muted-foreground text-sm">Montant</span>
                  <span className="font-bold text-navy-900">{parseInt(form.amount || "0").toLocaleString()} {form.currency}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-border">
                  <span className="text-muted-foreground text-sm">Livraison avant</span>
                  <span className="font-medium text-navy-900 text-sm">{new Date(form.deliveryDeadline).toLocaleDateString("fr-FR")}</span>
                </div>
                <div className="py-2">
                  <span className="text-muted-foreground text-sm block mb-2">Description</span>
                  <p className="text-navy-800 text-sm leading-relaxed">{form.serviceDescription}</p>
                </div>
              </div>

              {/* Commission info */}
              <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-xl p-4 mb-5">
                <Info className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                <p className="text-amber-800 text-sm">
                  Commission FidexaPay: <strong>{commissionRate}%</strong> soit{" "}
                  <strong>{Math.round(parseInt(form.amount || "0") * commissionRate / 100).toLocaleString()} {form.currency}</strong>{" "}
                  déduit lors de la libération des fonds.
                </p>
              </div>

              {/* Checkboxes */}
              <div className="space-y-3 mb-6">
                <div className="flex items-start gap-3">
                  <Checkbox id="terms" checked={form.agreeTerms} onCheckedChange={(v) => setForm(f => ({ ...f, agreeTerms: !!v }))} className="mt-0.5" />
                  <Label htmlFor="terms" className="text-sm text-navy-700 font-normal cursor-pointer">
                    J'accepte les <Link to="/" className="text-emerald-600 underline">conditions d'utilisation</Link> de FidexaPay
                  </Label>
                </div>
                <div className="flex items-start gap-3">
                  <Checkbox id="escrow" checked={form.agreeEscrow} onCheckedChange={(v) => setForm(f => ({ ...f, agreeEscrow: !!v }))} className="mt-0.5" />
                  <Label htmlFor="escrow" className="text-sm text-navy-700 font-normal cursor-pointer">
                    Je comprends et accepte les <Link to="/" className="text-emerald-600 underline">règles d'escrow</Link>
                  </Label>
                </div>
              </div>

              <div className="flex gap-3">
                <Button type="button" onClick={() => setStep(2)} variant="outline" className="flex-1 h-12 rounded-xl">
                  <ArrowLeft className="w-4 h-4 mr-2" /> Modifier
                </Button>
                <Button
                  type="submit"
                  className="flex-1 h-12 gradient-emerald text-primary-foreground border-0 rounded-xl font-bold shadow-glow-emerald hover:opacity-90"
                  disabled={!form.agreeTerms || !form.agreeEscrow || submitting}
                >
                  {submitting ? "Création en cours..." : "Créer le lien"}
                </Button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default CreateDealPage;
