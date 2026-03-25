import { Link } from "react-router-dom";
import { Phone, Mail, MapPin } from "lucide-react";

const Footer = () => (
  <footer className="bg-primary text-primary-foreground">
    <div className="container-wide section-padding">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
        <div>
          <h3 className="font-display text-xl font-bold mb-4">
            Jargal <span className="text-accent">Properties</span>
          </h3>
          <p className="text-primary-foreground/70 text-sm leading-relaxed">
            Your trusted partner in finding the perfect property. We bring expertise, integrity, and personalized service to every transaction.
          </p>
        </div>
        <div>
          <h4 className="font-display text-lg font-semibold mb-4">Quick Links</h4>
          <div className="space-y-2">
            {[
              { to: "/", label: "Home" },
              { to: "/properties", label: "Properties" },
              { to: "/about", label: "About Us" },
              { to: "/contact", label: "Contact" },
            ].map((link) => (
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
          <h4 className="font-display text-lg font-semibold mb-4">Contact Info</h4>
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
        © {new Date().getFullYear()} Jargal Properties. All rights reserved.
      </div>
    </div>
  </footer>
);

export default Footer;
