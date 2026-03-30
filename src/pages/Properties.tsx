import { useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import Layout from "@/components/Layout";
import PropertyCard from "@/components/PropertyCard";
import { useProperties } from "@/hooks/useProperties";
import { useLanguage } from "@/contexts/LanguageContext";
import { Loader2 } from "lucide-react";

const PROPERTY_STATUSES = ["all", "available", "sold", "rented"] as const;

const Properties = () => {
  const [searchParams] = useSearchParams();
  const [country, setCountry] = useState(searchParams.get("country") || "");
  const [type, setType] = useState(searchParams.get("type") || "");
  const [status, setStatus] = useState(searchParams.get("status") || "");
  const { data: properties = [], isLoading } = useProperties();
  const { t } = useLanguage();

  const countries = useMemo(() => [...new Set(properties.map((p) => (p as any).country).filter(Boolean))], [properties]);

  const filtered = useMemo(() => {
    return properties.filter((p) => {
      if (country && (p as any).country !== country) return false;
      if (type && p.type !== type) return false;
      if (status && status !== "all" && p.status !== status) return false;
      return true;
    });
  }, [properties, country, type, status]);

  const selectClass = "rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground";

  return (
    <Layout>
      <section className="section-padding">
        <div className="container-wide">
          <div className="mb-10">
            <p className="text-accent font-semibold text-sm uppercase tracking-wider">{t("properties.browse")}</p>
            <h1 className="font-display text-3xl sm:text-4xl font-bold text-foreground mt-1">{t("properties.title")}</h1>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 mb-8 p-4 bg-secondary rounded-lg">
            <select value={country} onChange={(e) => setCountry(e.target.value)} className={selectClass + " flex-1"}>
              <option value="">{t("filter.allCountries")}</option>
              {countries.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
            <select value={type} onChange={(e) => setType(e.target.value)} className={selectClass + " flex-1"}>
              <option value="">{t("hero.allTypes")}</option>
              {[...new Set(properties.map((p) => p.type))].map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
            <select value={status} onChange={(e) => setStatus(e.target.value)} className={selectClass + " flex-1"}>
              <option value="">{t("filter.allStatuses")}</option>
              {PROPERTY_STATUSES.filter(s => s !== "all").map((s) => (
                <option key={s} value={s} className="capitalize">{t(`admin.status.${s}`)}</option>
              ))}
            </select>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-16"><Loader2 className="animate-spin text-accent" size={32} /></div>
          ) : filtered.length === 0 ? (
            <p className="text-center text-muted-foreground py-16">{t("properties.noMatch")}</p>
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
