import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const navLinks = [
  { to: "/", label: "Home" },
  { to: "/properties", label: "Properties" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-card/90 backdrop-blur-md border-b border-border">
      <div className="container-wide flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
        <Link to="/" className="font-display text-xl font-bold tracking-tight text-foreground">
          Jargal <span className="text-accent">Properties</span>
        </Link>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`text-sm font-medium transition-colors hover:text-accent ${
                location.pathname === link.to ? "text-accent" : "text-muted-foreground"
              }`}
            >
              {link.label}
            </Link>
          ))}
          <Link to="/admin">
            <Button size="sm" className="bg-accent text-accent-foreground hover:bg-accent/90">
              Admin
            </Button>
          </Link>
        </div>

        {/* Mobile toggle */}
        <button className="md:hidden text-foreground" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden bg-card border-b border-border">
          <div className="px-4 py-4 space-y-3">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setIsOpen(false)}
                className={`block text-sm font-medium py-2 transition-colors hover:text-accent ${
                  location.pathname === link.to ? "text-accent" : "text-muted-foreground"
                }`}
              >
                {link.label}
              </Link>
            ))}
            <Link to="/admin" onClick={() => setIsOpen(false)}>
              <Button size="sm" className="w-full bg-accent text-accent-foreground hover:bg-accent/90">
                Admin
              </Button>
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
