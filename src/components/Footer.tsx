import { Link } from "react-router-dom";
import { Phone, Mail, MapPin, Instagram, Facebook } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const WhatsAppIcon = ({ size = 16, className = "" }: { size?: number; className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M3 21l1.65-3.8a9 9 0 1 1 3.4 2.9L3 21" />
    <path d="M9 10a.5.5 0 0 0 1 0V9a.5.5 0 0 0-1 0v1a5 5 0 0 0 5 5h1a.5.5 0 0 0 0-1h-1a.5.5 0 0 0 0 1" />
  </svg>
);

const Footer = () => {
  const { t } = useLanguage();

  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container-wide section-padding">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div>
            <h3 className="font-display text-xl font-bold mb-4">
              Jargal <span className="text-accent">Properties</span>
            </h3>
            <p className="text-primary-foreground/70 text-sm leading-relaxed">
              {t("footer.desc")}
            </p>
          </div>
          <div>
            <h4 className="font-display text-lg font-semibold mb-4">{t("footer.followUs")}</h4>
            <div className="flex items-center gap-4">
              <a href="https://instagram.com/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-primary-foreground/10 flex items-center justify-center hover:bg-accent transition-colors">
                <Instagram size={18} />
              </a>
              <a href="https://facebook.com/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-primary-foreground/10 flex items-center justify-center hover:bg-accent transition-colors">
                <Facebook size={18} />
              </a>
              <a href="https://wa.me/15551234567" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-primary-foreground/10 flex items-center justify-center hover:bg-accent transition-colors">
                <WhatsAppIcon size={18} />
              </a>
            </div>
          </div>
          <div>
            <h4 className="font-display text-lg font-semibold mb-4">{t("footer.contactInfo")}</h4>
            <div className="space-y-3 text-sm text-primary-foreground/70">
              <div className="flex items-center gap-2">
                <Phone size={16} className="text-accent" />
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail size={16} className="text-accent" />
                <span>info@jargalproperties.com</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin size={16} className="text-accent" />
                <span>123 Real Estate Ave, Suite 100</span>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-primary-foreground/10 text-center text-sm text-primary-foreground/50">
          © {new Date().getFullYear()} Jargal Properties. {t("footer.rights")}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
