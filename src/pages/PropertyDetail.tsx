import { useParams, Link } from "react-router-dom";
import { ArrowLeft, MapPin, BedDouble, Bath, Maximize, Check, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Layout from "@/components/Layout";
import { useProperty } from "@/hooks/useProperties";
import { useLanguage } from "@/contexts/LanguageContext";

const PropertyDetail = () => {
  const { id } = useParams();
  const { data: property, isLoading } = useProperty(id || "");
  const { lang, t } = useLanguage();

  if (isLoading) {
    return (
      <Layout>
        <div className="section-padding flex justify-center items-center min-h-[50vh]">
          <Loader2 className="animate-spin text-accent" size={32} />
        </div>
      </Layout>
    );
  }

  if (!property) {
    return (
      <Layout>
        <div className="section-padding text-center">
          <h1 className="font-display text-2xl font-bold text-foreground">{t("detail.notFound")}</h1>
          <Link to="/properties" className="text-accent mt-4 inline-block hover:underline">
            ← {t("detail.back")}
          </Link>
        </div>
      </Layout>
    );
  }

  const title = lang === "mn" && property.title_mn ? property.title_mn : property.title;
  const description = lang === "mn" && property.description_mn ? property.description_mn : property.description;

  return (
    <Layout>
      <section className="section-padding">
        <div className="container-wide">
          <Link to="/properties" className="inline-flex items-center gap-1 text-muted-foreground hover:text-accent text-sm mb-6">
            <ArrowLeft size={16} /> {t("detail.back")}
          </Link>

          <div className="rounded-lg overflow-hidden mb-8">
            <img
              src={property.image}
              alt={title}
              width={800}
              height={600}
              className="w-full h-[300px] sm:h-[450px] lg:h-[500px] object-cover"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            <div className="lg:col-span-2">
              <span className="text-xs font-semibold text-accent uppercase tracking-wider">{property.type}</span>
              <h1 className="font-display text-3xl sm:text-4xl font-bold text-foreground mt-1">{title}</h1>
              <div className="flex items-center gap-1 text-muted-foreground mt-2">
                <MapPin size={16} /> {property.location}
              </div>

              <div className="flex items-center gap-6 mt-6 py-4 border-y border-border text-muted-foreground">
                <span className="flex items-center gap-2"><BedDouble size={18} /> {property.bedrooms} {t("detail.beds")}</span>
                <span className="flex items-center gap-2"><Bath size={18} /> {property.bathrooms} {t("detail.baths")}</span>
                <span className="flex items-center gap-2"><Maximize size={18} /> {property.area} sqft</span>
              </div>

              <div className="mt-8">
                <h2 className="font-display text-xl font-semibold text-foreground mb-3">{t("detail.description")}</h2>
                <p className="text-muted-foreground leading-relaxed">{description}</p>
              </div>

              <div className="mt-8">
                <h2 className="font-display text-xl font-semibold text-foreground mb-3">{t("detail.features")}</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {property.features.map((f) => (
                    <div key={f} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Check size={16} className="text-accent" /> {f}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <div className="bg-card border border-border rounded-lg p-6 sticky top-24">
                <p className="text-accent font-bold text-3xl">${property.price.toLocaleString()}</p>
                <p className="text-muted-foreground text-sm mt-1">{t("detail.askingPrice")}</p>
                <Link to="/contact" className="block mt-6">
                  <Button className="w-full bg-accent text-accent-foreground hover:bg-accent/90" size="lg">
                    {t("detail.contact")}
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default PropertyDetail;
