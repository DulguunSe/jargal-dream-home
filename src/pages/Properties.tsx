import { useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import Layout from "@/components/Layout";
import PropertyCard from "@/components/PropertyCard";
import { useProperties } from "@/hooks/useProperties";
import { useLanguage } from "@/contexts/LanguageContext";
import { Loader2, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const LOCATION_OPTIONS = [
  { value: "", labelKey: "filter.everyLocation" },
  { value: "Mongolia", labelKey: "" },
  { value: "UAE", labelKey: "" },
  { value: "Thailand", labelKey: "" },
];

const SALE_TYPE_OPTIONS = [
  { value: "", labelKey: "filter.allSaleTypes" },
  { value: "For Sale", labelKey: "filter.forSale" },
  { value: "For Rent", labelKey: "filter.forRent" },
];

const Properties = () => {
  const [searchParams] = useSearchParams();
  const [country, setCountry] = useState(searchParams.get("country") || "");
  const [type, setType] = useState(searchParams.get("type") || "");
  const [location, setLocation] = useState(searchParams.get("location") || "");
  const [saleType, setSaleType] = useState("");
  const { data: properties = [], isLoading, isError } = useProperties();
  const { t } = useLanguage();

  const locations = useMemo(() => {
    const filtered = country ? properties.filter((p) => p.country === country) : properties;
    return [...new Set(filtered.map((p) => p.location).filter(Boolean))];
  }, [properties, country]);

  const filtered = useMemo(() => {
    return properties.filter((p) => {
      if (country && p.country !== country) return false;
      if (type && p.type !== type) return false;
      if (location && p.location !== location) return false;
      if (saleType) {
        if (saleType === "For Sale" && p.status === "rented") return false;
        if (saleType === "For Rent" && p.status !== "rented" && p.status !== "available") return false;
        // "For Rent" shows rented + available-for-rent; "For Sale" shows available + sold
      }
      return true;
    });
  }, [properties, country, type, location, saleType]);

  const hasActiveFilters = country || type || location || saleType;

  const clearFilters = () => {
    setCountry("");
    setType("");
    setLocation("");
    setSaleType("");
  };

  const selectClass = "rounded-md border border-input bg-background px-4 py-2.5 text-sm text-foreground appearance-none cursor-pointer";

  return (
    <Layout>
      <section className="section-padding">
        <div className="container-wide">
          <div className="mb-10">
            <p className="text-accent font-semibold text-sm uppercase tracking-wider">{t("properties.browse")}</p>
            <h1 className="font-display text-3xl sm:text-4xl font-bold text-foreground mt-1">{t("properties.title")}</h1>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 mb-8 p-4 bg-secondary rounded-lg items-end">
            <div className="flex-1 w-full">
              <select value={country} onChange={(e) => { setCountry(e.target.value); setLocation(""); }} className={selectClass + " w-full"}>
                <option value="">{t("filter.everyLocation")}</option>
                {LOCATION_OPTIONS.filter(o => o.value).map((o) => (
                  <option key={o.value} value={o.value}>{o.value === "UAE" ? "Dubai" : o.value === "Thailand" ? "Phuket" : o.value}</option>
                ))}
              </select>
            </div>
            <div className="flex-1 w-full">
              <select value={location} onChange={(e) => setLocation(e.target.value)} className={selectClass + " w-full"}>
                <option value="">{t("hero.allLocations")}</option>
                {locations.map((loc) => (
                  <option key={loc} value={loc}>{loc}</option>
                ))}
              </select>
            </div>
            <div className="flex-1 w-full">
              <select value={type} onChange={(e) => setType(e.target.value)} className={selectClass + " w-full"}>
                <option value="">{t("hero.allTypes")}</option>
                {[...new Set(properties.map((p) => p.type))].map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
            <div className="flex-1 w-full">
              <select value={saleType} onChange={(e) => setSaleType(e.target.value)} className={selectClass + " w-full"}>
                <option value="">{t("filter.allSaleTypes")}</option>
                {SALE_TYPE_OPTIONS.filter(o => o.value).map((o) => (
                  <option key={o.value} value={o.value}>{t(o.labelKey)}</option>
                ))}
              </select>
            </div>
            {hasActiveFilters && (
              <Button variant="ghost" size="sm" onClick={clearFilters} className="shrink-0 text-muted-foreground hover:text-foreground">
                <X size={14} className="mr-1" /> {t("filter.clear")}
              </Button>
            )}
          </div>

          {isLoading ? (
            <div className="flex justify-center py-16"><Loader2 className="animate-spin text-accent" size={32} /></div>
          ) : isError ? (
            <p className="text-center text-muted-foreground py-16">Failed to load properties. Please refresh the page.</p>
          ) : filtered.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-muted-foreground">{t("properties.noMatch")}</p>
              {hasActiveFilters && (
                <Button variant="outline" className="mt-4" onClick={clearFilters}>
                  {t("filter.clear")}
                </Button>
              )}
            </div>
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
