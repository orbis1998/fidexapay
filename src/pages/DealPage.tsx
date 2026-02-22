import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  Shield, CheckCircle, Clock, AlertTriangle, TrendingUp,
  Upload, Lock, Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

type Deal = Tables<"deals">;

const STATUS_STEPS = [
  { key: "pending_payment", label: "En attente de paiement", icon: Clock },
  { key: "funds_secured", label: "Fonds sécurisés", icon: Lock },
  { key: "in_progress", label: "En cours", icon: TrendingUp },
  { key: "delivered", label: "Livré", icon: CheckCircle },
  { key: "completed", label: "Validé & Libéré", icon: Shield },
];

const STATUS_ORDER = STATUS_STEPS.map((s) => s.key);

const ClientDealPage = () => {
  const { id: token } = useParams();
  const [deal, setDeal] = useState<Deal | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [accepted, setAccepted] = useState(false);
  const [disputeMode, setDisputeMode] = useState(false);
  const [disputeMsg, setDisputeMsg] = useState("");
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const fetchDeal = async () => {
      if (!token) { setError("Lien invalide."); setLoading(false); return; }
      const { data, error: err } = await supabase
        .from("deals")
        .select("*")
        .eq("secure_token", token)
        .maybeSingle();
      if (err) { setError("Erreur lors du chargement."); }
      else if (!data) { setError("Deal introuvable ou lien expiré."); }
      else { setDeal(data); }
      setLoading(false);
    };
    fetchDeal();
  }, [token]);

  const currentStepIndex = deal ? STATUS_ORDER.indexOf(deal.status) : -1;

  const handleAccept = async () => {
    if (!deal) return;
    // In a real app this would update the deal status via an edge function
    setAccepted(true);
  };

  const handleDisputeSubmit = async () => {
    if (!disputeMsg.trim() || !deal) return;
    // Placeholder — would create a dispute record via edge function
    setSubmitted(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !deal) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <div className="max-w-md text-center">
          <Shield className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-xl font-bold text-foreground mb-2">Lien invalide</h2>
          <p className="text-muted-foreground">{error ?? "Ce deal n'existe pas."}</p>
        </div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <div className="max-w-md text-center">
          <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="w-8 h-8 text-red-500" />
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-2">Litige ouvert</h2>
          <p className="text-muted-foreground mb-6">L'équipe FidexaPay a été notifiée et reviendra vers vous sous 24h.</p>
          <Button onClick={() => setSubmitted(false)} variant="outline" className="rounded-xl">Retour au deal</Button>
        </div>
      </div>
    );
  }

  const showActions = !accepted && !disputeMode && ["delivered", "awaiting_validation"].includes(deal.status);

  return (
    <div className="min-h-screen bg-secondary">
      {/* Header */}
      <div className="gradient-hero border-b border-navy-700">
        <div className="container mx-auto px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg gradient-emerald flex items-center justify-center shadow-glow-emerald">
              <Shield className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="text-lg font-bold text-primary-foreground">FidexaPay</span>
          </div>
          <div className="flex items-center gap-2 glass-card rounded-full px-3 py-1.5">
            <Lock className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-emerald-300 text-xs font-medium">Deal sécurisé</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-10 max-w-3xl">
        {/* Deal header card */}
        <div className="bg-card rounded-2xl border border-border p-8 mb-6 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
            <div>
              <p className="text-muted-foreground text-xs font-mono mb-1">#{deal.id.slice(0, 8).toUpperCase()}</p>
              <h1 className="text-2xl font-bold text-foreground mb-2">{deal.title}</h1>
              <p className="text-muted-foreground text-sm">
                Client : <strong className="text-foreground">{deal.client_name}</strong>
              </p>
            </div>
            <div className="text-right flex-shrink-0">
              <p className="text-3xl font-bold text-foreground">{Number(deal.amount).toLocaleString()}</p>
              <p className="text-muted-foreground font-medium">{deal.currency}</p>
              {currentStepIndex >= 1 && (
                <span className="inline-flex items-center gap-1.5 mt-2 status-secured text-xs font-medium px-3 py-1.5 rounded-full">
                  <Lock className="w-3 h-3" /> Fonds sécurisés
                </span>
              )}
            </div>
          </div>

          <div className="border-t border-border pt-5">
            <h3 className="font-semibold text-foreground mb-2 text-sm">Description de la mission</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">{deal.description}</p>
          </div>

          {deal.custom_conditions && (
            <div className="mt-4 bg-muted rounded-xl p-4">
              <p className="text-xs font-semibold text-foreground mb-1">Conditions spécifiques</p>
              <p className="text-muted-foreground text-sm">{deal.custom_conditions}</p>
            </div>
          )}

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-5 pt-5 border-t border-border">
            {deal.delivery_deadline && (
              <div>
                <p className="text-xs text-muted-foreground mb-1">Date de livraison</p>
                <p className="font-semibold text-foreground text-sm">{new Date(deal.delivery_deadline).toLocaleDateString("fr-FR")}</p>
              </div>
            )}
            {deal.validation_deadline && (
              <div>
                <p className="text-xs text-muted-foreground mb-1">Délai validation</p>
                <p className="font-semibold text-foreground text-sm">{new Date(deal.validation_deadline).toLocaleDateString("fr-FR")}</p>
              </div>
            )}
            <div>
              <p className="text-xs text-muted-foreground mb-1">Créé le</p>
              <p className="font-semibold text-foreground text-sm">{new Date(deal.created_at).toLocaleDateString("fr-FR")}</p>
            </div>
          </div>
        </div>

        {/* Timeline */}
        <div className="bg-card rounded-2xl border border-border p-6 mb-6 shadow-sm">
          <h2 className="font-bold text-foreground mb-5">Suivi du deal</h2>
          <div className="space-y-0">
            {STATUS_STEPS.map((step, i) => {
              const done = i <= currentStepIndex;
              return (
                <div key={step.key} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${done ? "gradient-emerald shadow-glow-emerald" : "bg-muted border-2 border-border"}`}>
                      <step.icon className={`w-4 h-4 ${done ? "text-primary-foreground" : "text-muted-foreground"}`} />
                    </div>
                    {i < STATUS_STEPS.length - 1 && <div className={`w-0.5 h-8 my-1 ${done ? "bg-emerald-400" : "bg-border"}`} />}
                  </div>
                  <div className="pb-6 pt-1">
                    <p className={`font-medium text-sm ${done ? "text-foreground" : "text-muted-foreground"}`}>{step.label}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Actions */}
        {showActions && (
          <div className="bg-card rounded-2xl border border-border p-6 shadow-sm">
            <h2 className="font-bold text-foreground mb-2">Actions disponibles</h2>
            <p className="text-muted-foreground text-sm mb-5">
              Le prestataire a livré la mission. Vérifiez les livrables et prenez une décision.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button className="flex-1 h-11 gradient-emerald text-primary-foreground border-0 rounded-xl font-semibold shadow-glow-emerald hover:opacity-90" onClick={handleAccept}>
                <CheckCircle className="w-4 h-4 mr-2" /> Valider la livraison
              </Button>
              <Button variant="outline" className="flex-1 h-11 rounded-xl border-red-200 text-red-600 hover:bg-red-50" onClick={() => setDisputeMode(true)}>
                <AlertTriangle className="w-4 h-4 mr-2" /> Ouvrir un litige
              </Button>
            </div>
          </div>
        )}

        {accepted && (
          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 text-center">
            <CheckCircle className="w-10 h-10 text-emerald-500 mx-auto mb-3" />
            <h3 className="font-bold text-emerald-800 text-lg mb-1">Livraison validée !</h3>
            <p className="text-emerald-700 text-sm">Les fonds seront libérés au prestataire dans les prochaines heures.</p>
          </div>
        )}

        {disputeMode && (
          <div className="bg-card rounded-2xl border border-red-200 p-6 shadow-sm">
            <h2 className="font-bold text-foreground mb-2">
              <AlertTriangle className="w-5 h-5 text-red-500 inline mr-2" /> Ouvrir un litige
            </h2>
            <p className="text-muted-foreground text-sm mb-4">Expliquez précisément le problème rencontré.</p>
            <Textarea value={disputeMsg} onChange={(e) => setDisputeMsg(e.target.value)} placeholder="Décrivez votre problème en détail..." className="rounded-xl min-h-[120px] resize-none mb-4" />
            <div className="border border-dashed border-border rounded-xl p-4 text-center cursor-pointer hover:bg-muted transition-colors mb-4">
              <Upload className="w-5 h-5 text-muted-foreground mx-auto mb-1" />
              <p className="text-sm text-muted-foreground">Joindre des preuves</p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" className="flex-1 rounded-xl" onClick={() => setDisputeMode(false)}>Annuler</Button>
              <Button className="flex-1 bg-red-500 hover:bg-red-600 text-primary-foreground border-0 rounded-xl" onClick={handleDisputeSubmit} disabled={!disputeMsg.trim()}>Soumettre le litige</Button>
            </div>
          </div>
        )}

        <div className="mt-6 flex items-center justify-center gap-2 text-muted-foreground text-xs">
          <Shield className="w-3.5 h-3.5 text-emerald-500" />
          <span>Deal sécurisé par FidexaPay — Les fonds sont bloqués jusqu'à votre validation</span>
        </div>
      </div>
    </div>
  );
};

export default ClientDealPage;
