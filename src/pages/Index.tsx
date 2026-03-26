import { Link } from "react-router-dom";
import { Search, ArrowRight, Shield, Users, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import Layout from "@/components/Layout";
import PropertyCard from "@/components/PropertyCard";
import { useFeaturedProperties, useProperties } from "@/hooks/useProperties";
import heroImage from "@/assets/hero-property.jpg";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const { data: featured = [] } = useFeaturedProperties();
  const { data: allProperties = [] } = useProperties();
  const navigate = useNavigate();
  const [search, setSearch] = useState({ location: "", type: "", maxPrice: "" });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (search.location) params.set("location", search.location);
    if (search.type) params.set("type", search.type);
    if (search.maxPrice) params.set("maxPrice", search.maxPrice);
    navigate(`/properties?${params.toString()}`);
  };

  return (
    <Layout>
      {/* Hero */}
      <section className="relative h-[85vh] min-h-[600px] flex items-center justify-center">
        <img
          src={heroImage}
          alt="Luxury property"
          width={1920}
          height={1080}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-primary/60" />
        <div className="relative z-10 text-center px-4 max-w-3xl">
          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-primary-foreground leading-tight">
            Find Your Dream Property
          </h1>
          <p className="mt-4 text-primary-foreground/80 text-lg max-w-xl mx-auto">
            Discover exceptional homes and investment opportunities with Jargal Properties.
          </p>

          <form onSubmit={handleSearch} className="mt-8 bg-card/95 backdrop-blur rounded-lg p-4 flex flex-col sm:flex-row gap-3">
            <select
              value={search.location}
              onChange={(e) => setSearch({ ...search, location: e.target.value })}
              className="flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground"
            >
              <option value="">All Locations</option>
              {[...new Set(allProperties.map((p) => p.location))].map((loc) => (
                <option key={loc} value={loc}>{loc}</option>
              ))}
            </select>
            <select
              value={search.type}
              onChange={(e) => setSearch({ ...search, type: e.target.value })}
              className="flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground"
            >
              <option value="">All Types</option>
              {[...new Set(allProperties.map((p) => p.type))].map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
            <select
              value={search.maxPrice}
              onChange={(e) => setSearch({ ...search, maxPrice: e.target.value })}
              className="flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground"
            >
              <option value="">Any Price</option>
              <option value="500000">Under $500K</option>
              <option value="750000">Under $750K</option>
              <option value="1000000">Under $1M</option>
              <option value="2000000">Under $2M</option>
            </select>
            <Button type="submit" className="bg-accent text-accent-foreground hover:bg-accent/90">
              <Search size={16} className="mr-2" /> Search
            </Button>
          </form>
        </div>
      </section>

      {/* Featured */}
      <section className="section-padding">
        <div className="container-wide">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="text-accent font-semibold text-sm uppercase tracking-wider">Featured</p>
              <h2 className="font-display text-3xl font-bold text-foreground mt-1">Top Properties</h2>
            </div>
            <Link to="/properties" className="hidden sm:flex items-center gap-1 text-accent font-medium text-sm hover:underline">
              View All <ArrowRight size={16} />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featured.map((p) => (
              <PropertyCard key={p.id} property={p} />
            ))}
          </div>
          <div className="mt-8 text-center sm:hidden">
            <Link to="/properties">
              <Button className="bg-accent text-accent-foreground hover:bg-accent/90">View All Properties</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* About snippet */}
      <section className="section-padding bg-secondary">
        <div className="container-wide text-center max-w-2xl mx-auto">
          <p className="text-accent font-semibold text-sm uppercase tracking-wider">About Us</p>
          <h2 className="font-display text-3xl font-bold text-foreground mt-1">Why Jargal Properties?</h2>
          <p className="mt-4 text-muted-foreground leading-relaxed">
            With years of expertise in the real estate market, we provide personalized service to help you find the perfect property that matches your lifestyle and investment goals.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mt-12">
            {[
              { icon: Shield, title: "Trusted", desc: "Transparent dealings with every client" },
              { icon: Users, title: "Personalized", desc: "Tailored service for your unique needs" },
              { icon: Award, title: "Expert", desc: "Deep market knowledge and insights" },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="flex flex-col items-center">
                <div className="w-14 h-14 rounded-full bg-accent/10 flex items-center justify-center mb-3">
                  <Icon size={24} className="text-accent" />
                </div>
                <h3 className="font-display font-semibold text-foreground">{title}</h3>
                <p className="text-muted-foreground text-sm mt-1">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding bg-accent">
        <div className="container-wide text-center">
          <h2 className="font-display text-3xl font-bold text-accent-foreground">Ready to Find Your Home?</h2>
          <p className="mt-3 text-accent-foreground/80 max-w-md mx-auto">
            Browse our full collection of properties or get in touch with our team today.
          </p>
          <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/properties">
              <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
                View Properties
              </Button>
            </Link>
            <Link to="/contact">
              <Button size="lg" variant="outline" className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground/10">
                Contact Us
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
