import { useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import {
  Shield, CheckCircle, Clock, AlertTriangle, TrendingUp,
  ArrowRight, Upload, MessageSquare, Lock, Eye
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

type DealStatus = "pending" | "secured" | "progress" | "delivered" | "awaiting_validation" | "completed" | "dispute";

const DEAL_MOCK = {
  id: "FX-2024-003",
  service: "Consulting stratégie digitale — 3 mois",
  description: "Mission de conseil en stratégie digitale incluant : audit complet de la présence en ligne, recommandations SEO/SEM, plan de contenu sur 3 mois, formation équipe marketing (2 sessions de 3h), rapport mensuel de performance.",
  amount: 750000,
  currency: "XOF",
  provider: "Jean Dupont",
  providerEmail: "jean.dupont@exemple.com",
  client: "Pierre Lefebvre",
  clientEmail: "pierre@startupxyz.com",
  status: "secured" as DealStatus,
  deliveryDeadline: "20 janvier 2025",
  validationDeadline: "23 janvier 2025",
  createdAt: "10 décembre 2024",
  conditions: "Les livrables seront soumis au format PDF et Google Slides. Le client dispose de 72h pour valider ou émettre des réserves motivées.",
};

const TIMELINE = [
  { status: "Créé", date: "10 déc. 2024", done: true, icon: CheckCircle },
  { status: "Fonds sécurisés", date: "12 déc. 2024", done: true, icon: Lock },
  { status: "En cours", date: "13 déc. 2024", done: true, icon: TrendingUp },
  { status: "Livré", date: "—", done: false, icon: CheckCircle },
  { status: "Validé & Libéré", date: "—", done: false, icon: Shield },
];

const ClientDealPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [accepted, setAccepted] = useState(false);
  const [disputeMode, setDisputeMode] = useState(false);
  const [disputeMsg, setDisputeMsg] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const deal = DEAL_MOCK;

  const handleAccept = () => setAccepted(true);
  const handleDispute = () => setDisputeMode(true);
  const handleDisputeSubmit = () => {
    if (disputeMsg.trim()) setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <div className="max-w-md text-center">
          <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="w-8 h-8 text-red-500" />
          </div>
          <h2 className="text-2xl font-bold text-navy-900 mb-2">Litige ouvert</h2>
          <p className="text-muted-foreground mb-6">L'équipe FidexaPay a été notifiée et reviendra vers vous sous 24h.</p>
          <Button onClick={() => setSubmitted(false)} variant="outline" className="rounded-xl">Retour au deal</Button>
        </div>
      </div>
    );
  }

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
              <p className="text-muted-foreground text-xs font-mono mb-1">#{deal.id}</p>
              <h1 className="text-2xl font-bold text-navy-900 mb-2">{deal.service}</h1>
              <p className="text-muted-foreground text-sm">
                Proposé par <strong className="text-navy-800">{deal.provider}</strong>
              </p>
            </div>
            <div className="text-right flex-shrink-0">
              <p className="text-3xl font-bold text-navy-900">{deal.amount.toLocaleString()}</p>
              <p className="text-muted-foreground font-medium">{deal.currency}</p>
              <span className="inline-flex items-center gap-1.5 mt-2 status-secured text-xs font-medium px-3 py-1.5 rounded-full">
                <Lock className="w-3 h-3" /> Fonds sécurisés
              </span>
            </div>
          </div>

          <div className="border-t border-border pt-5">
            <h3 className="font-semibold text-navy-900 mb-2 text-sm">Description de la mission</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">{deal.description}</p>
          </div>

          {deal.conditions && (
            <div className="mt-4 bg-muted rounded-xl p-4">
              <p className="text-xs font-semibold text-navy-700 mb-1">Conditions spécifiques</p>
              <p className="text-muted-foreground text-sm">{deal.conditions}</p>
            </div>
          )}

          {/* Info grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-5 pt-5 border-t border-border">
            <div>
              <p className="text-xs text-muted-foreground mb-1">Date de livraison</p>
              <p className="font-semibold text-navy-900 text-sm">{deal.deliveryDeadline}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">Délai validation</p>
              <p className="font-semibold text-navy-900 text-sm">{deal.validationDeadline}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">Créé le</p>
              <p className="font-semibold text-navy-900 text-sm">{deal.createdAt}</p>
            </div>
          </div>
        </div>

        {/* Timeline */}
        <div className="bg-card rounded-2xl border border-border p-6 mb-6 shadow-sm">
          <h2 className="font-bold text-navy-900 mb-5">Suivi du deal</h2>
          <div className="space-y-0">
            {TIMELINE.map((step, i) => (
              <div key={step.status} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${step.done ? "gradient-emerald shadow-glow-emerald" : "bg-muted border-2 border-border"}`}>
                    <step.icon className={`w-4 h-4 ${step.done ? "text-primary-foreground" : "text-muted-foreground"}`} />
                  </div>
                  {i < TIMELINE.length - 1 && <div className={`w-0.5 h-8 my-1 ${step.done ? "bg-emerald-400" : "bg-border"}`} />}
                </div>
                <div className="pb-6 pt-1">
                  <p className={`font-medium text-sm ${step.done ? "text-navy-900" : "text-muted-foreground"}`}>{step.status}</p>
                  <p className="text-xs text-muted-foreground">{step.date}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        {!accepted && !disputeMode && (
          <div className="bg-card rounded-2xl border border-border p-6 shadow-sm">
            <h2 className="font-bold text-navy-900 mb-2">Actions disponibles</h2>
            <p className="text-muted-foreground text-sm mb-5">
              Le prestataire a livré la mission. Vérifiez les livrables et prenez une décision.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button className="flex-1 h-11 gradient-emerald text-primary-foreground border-0 rounded-xl font-semibold shadow-glow-emerald hover:opacity-90" onClick={handleAccept}>
                <CheckCircle className="w-4 h-4 mr-2" />
                Valider la livraison
              </Button>
              <Button variant="outline" className="flex-1 h-11 rounded-xl border-red-200 text-red-600 hover:bg-red-50" onClick={handleDispute}>
                <AlertTriangle className="w-4 h-4 mr-2" />
                Ouvrir un litige
              </Button>
            </div>
          </div>
        )}

        {accepted && (
          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 text-center">
            <CheckCircle className="w-10 h-10 text-emerald-500 mx-auto mb-3" />
            <h3 className="font-bold text-emerald-800 text-lg mb-1">Livraison validée !</h3>
            <p className="text-emerald-700 text-sm">Les fonds seront libérés au prestataire dans les prochaines heures. Merci pour votre confiance.</p>
          </div>
        )}

        {disputeMode && (
          <div className="bg-card rounded-2xl border border-red-200 p-6 shadow-sm">
            <h2 className="font-bold text-navy-900 mb-2">
              <AlertTriangle className="w-5 h-5 text-red-500 inline mr-2" />
              Ouvrir un litige
            </h2>
            <p className="text-muted-foreground text-sm mb-4">Expliquez précisément le problème rencontré. L'équipe FidexaPay interviendra dans les 24h.</p>
            <Textarea
              value={disputeMsg}
              onChange={(e) => setDisputeMsg(e.target.value)}
              placeholder="Décrivez votre problème en détail : ce qui n'a pas été livré, les écarts avec le contrat initial..."
              className="rounded-xl min-h-[120px] resize-none mb-4"
            />
            <div className="border border-dashed border-border rounded-xl p-4 text-center cursor-pointer hover:bg-muted transition-colors mb-4">
              <Upload className="w-5 h-5 text-muted-foreground mx-auto mb-1" />
              <p className="text-sm text-muted-foreground">Joindre des preuves (captures, fichiers...)</p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" className="flex-1 rounded-xl" onClick={() => setDisputeMode(false)}>Annuler</Button>
              <Button className="flex-1 bg-red-500 hover:bg-red-600 text-primary-foreground border-0 rounded-xl" onClick={handleDisputeSubmit} disabled={!disputeMsg.trim()}>
                Soumettre le litige
              </Button>
            </div>
          </div>
        )}

        {/* Security note */}
        <div className="mt-6 flex items-center justify-center gap-2 text-muted-foreground text-xs">
          <Shield className="w-3.5 h-3.5 text-emerald-500" />
          <span>Deal sécurisé par FidexaPay — Les fonds sont bloqués jusqu'à votre validation</span>
        </div>
      </div>
    </div>
  );
};

export default ClientDealPage;
