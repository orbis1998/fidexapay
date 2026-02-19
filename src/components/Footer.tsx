import { Link } from "react-router-dom";
import { Shield, Mail, Phone, MapPin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-navy-900 border-t border-navy-700">
      <div className="container mx-auto px-6 py-16">
        <div className="grid md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 rounded-lg gradient-emerald flex items-center justify-center">
                <Shield className="w-4 h-4 text-primary-foreground" />
              </div>
              <span className="text-lg font-bold text-primary-foreground tracking-tight">
                Fidexa<span className="text-gradient-emerald">Pay</span>
              </span>
            </div>
            <p className="text-navy-300 text-sm leading-relaxed mb-4">
              L'infrastructure d'escrow digital qui protège chaque transaction en Afrique et dans la diaspora.
            </p>
            <p className="text-navy-400 text-xs">
              Un produit développé par{" "}
              <span className="text-gold-400 font-semibold">Orbis Creativa Agency</span>
            </p>
          </div>

          {/* Platform */}
          <div>
            <h4 className="text-primary-foreground font-semibold mb-4 text-sm">Plateforme</h4>
            <ul className="space-y-3">
              {["Comment ça marche", "Cas d'usage", "Tarifs", "Sécurité"].map((item) => (
                <li key={item}>
                  <Link to="/" className="text-navy-300 hover:text-primary-foreground text-sm transition-colors">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-primary-foreground font-semibold mb-4 text-sm">Légal</h4>
            <ul className="space-y-3">
              {["Conditions d'utilisation", "Politique de confidentialité", "Règles d'escrow", "Mentions légales"].map((item) => (
                <li key={item}>
                  <Link to="/" className="text-navy-300 hover:text-primary-foreground text-sm transition-colors">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-primary-foreground font-semibold mb-4 text-sm">Contact</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-navy-300 text-sm">
                <Mail className="w-4 h-4 text-emerald-400" />
                contact@fidexapay.com
              </li>
              <li className="flex items-center gap-2 text-navy-300 text-sm">
                <Phone className="w-4 h-4 text-emerald-400" />
                +1 (555) 000-0000
              </li>
              <li className="flex items-center gap-2 text-navy-300 text-sm">
                <MapPin className="w-4 h-4 text-emerald-400" />
                Afrique & Diaspora
              </li>
            </ul>
          </div>
        </div>

        <div className="section-divider my-10" />

        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-navy-400 text-sm">
            © 2025 FidexaPay. Tous droits réservés.
          </p>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse-slow" />
            <span className="text-navy-400 text-xs">Système opérationnel</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
