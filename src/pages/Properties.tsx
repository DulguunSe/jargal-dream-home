import { useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import Layout from "@/components/Layout";
import PropertyCard from "@/components/PropertyCard";
import { useProperties } from "@/hooks/useProperties";
import { Loader2 } from "lucide-react";

const Properties = () => {
  const [searchParams] = useSearchParams();
  const [location, setLocation] = useState(searchParams.get("location") || "");
  const [type, setType] = useState(searchParams.get("type") || "");
  const [maxPrice, setMaxPrice] = useState(searchParams.get("maxPrice") || "");
  const { data: properties = [], isLoading } = useProperties();

  const filtered = useMemo(() => {
    return properties.filter((p) => {
      if (location && p.location !== location) return false;
      if (type && p.type !== type) return false;
      if (maxPrice && p.price > Number(maxPrice)) return false;
      return true;
    });
  }, [properties, location, type, maxPrice]);

  const selectClass = "rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground";

  return (
    <Layout>
      <section className="section-padding">
        <div className="container-wide">
          <div className="mb-10">
            <p className="text-accent font-semibold text-sm uppercase tracking-wider">Browse</p>
            <h1 className="font-display text-3xl sm:text-4xl font-bold text-foreground mt-1">Our Properties</h1>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 mb-8 p-4 bg-secondary rounded-lg">
            <select value={location} onChange={(e) => setLocation(e.target.value)} className={selectClass + " flex-1"}>
              <option value="">All Locations</option>
              {[...new Set(properties.map((p) => p.location))].map((loc) => (
                <option key={loc} value={loc}>{loc}</option>
              ))}
            </select>
            <select value={type} onChange={(e) => setType(e.target.value)} className={selectClass + " flex-1"}>
              <option value="">All Types</option>
              {[...new Set(properties.map((p) => p.type))].map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
            <select value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} className={selectClass + " flex-1"}>
              <option value="">Any Price</option>
              <option value="500000">Under $500K</option>
              <option value="750000">Under $750K</option>
              <option value="1000000">Under $1M</option>
              <option value="2000000">Under $2M</option>
            </select>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-16"><Loader2 className="animate-spin text-accent" size={32} /></div>
          ) : filtered.length === 0 ? (
            <p className="text-center text-muted-foreground py-16">No properties match your filters.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((p) => (
                <PropertyCard key={p.id} property={p} />
              ))}
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default Properties;
