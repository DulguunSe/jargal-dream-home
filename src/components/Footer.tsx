import { Link } from "react-router-dom";
import { Phone, Mail, MapPin } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const Footer = () => {
  const { t } = useLanguage();

  const links = [
    { to: "/", label: t("nav.home") },
    { to: "/properties", label: t("nav.properties") },
    { to: "/dubai", label: t("nav.dubai") },
    { to: "/about", label: t("footer.aboutUs") },
    { to: "/contact", label: t("nav.contact") },
  ];

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
            <h4 className="font-display text-lg font-semibold mb-4">{t("footer.quickLinks")}</h4>
            <div className="space-y-2">
              {links.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="block text-sm text-primary-foreground/70 hover:text-accent transition-colors"
                >
                  {link.label}
                </Link>
              ))}
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
