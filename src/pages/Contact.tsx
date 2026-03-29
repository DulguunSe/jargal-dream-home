import { useState } from "react";
import { Phone, Mail, MapPin, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import Layout from "@/components/Layout";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";

const Contact = () => {
  const { toast } = useToast();
  const { t } = useLanguage();
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      toast({ title: t("contact.fillAll"), variant: "destructive" });
      return;
    }
    setSending(true);
    const { error } = await supabase.from("contact_messages").insert({
      name: form.name.trim(),
      email: form.email.trim(),
      message: form.message.trim(),
    });
    setSending(false);
    if (error) {
      toast({ title: "Error sending message", description: error.message, variant: "destructive" });
      return;
    }
    setSubmitted(true);
    toast({ title: t("contact.success"), description: t("contact.successDesc") });
    setForm({ name: "", email: "", message: "" });
  };

  return (
    <Layout>
      <section className="section-padding">
        <div className="container-wide">
          <div className="text-center mb-12">
            <p className="text-accent font-semibold text-sm uppercase tracking-wider">{t("contact.label")}</p>
            <h1 className="font-display text-4xl font-bold text-foreground mt-2">{t("contact.title")}</h1>
            <p className="text-muted-foreground mt-3 max-w-lg mx-auto">{t("contact.purpose")}</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-5xl mx-auto">
            {submitted ? (
              <div className="flex flex-col items-center justify-center text-center py-12">
                <CheckCircle size={48} className="text-accent mb-4" />
                <h2 className="font-display text-2xl font-bold text-foreground">{t("contact.success")}</h2>
                <p className="text-muted-foreground mt-2">{t("contact.successDesc")}</p>
                <Button className="mt-6 bg-accent text-accent-foreground hover:bg-accent/90" onClick={() => setSubmitted(false)}>
                  {t("contact.send")}
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="text-sm font-medium text-foreground mb-1 block">{t("contact.name")}</label>
                  <Input
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder={t("contact.namePlaceholder")}
                    maxLength={100}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-1 block">{t("contact.email")}</label>
                  <Input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="you@example.com"
                    maxLength={255}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-1 block">{t("contact.message")}</label>
                  <Textarea
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    placeholder={t("contact.messagePlaceholder")}
                    rows={5}
                    maxLength={1000}
                  />
                </div>
                <Button type="submit" className="w-full bg-accent text-accent-foreground hover:bg-accent/90" size="lg" disabled={sending}>
                  {t("contact.send")}
                </Button>
              </form>
            )}

            {/* Info + Map */}
            <div className="space-y-8">
              <div className="space-y-4">
                <a href="mailto:admin@jargalproperties.com" className="flex items-start gap-3 group">
                  <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center shrink-0 group-hover:bg-accent/20 transition-colors">
                    <Mail size={18} className="text-accent" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">{t("contact.email")}</p>
                    <p className="text-muted-foreground text-sm group-hover:text-accent transition-colors">admin@jargalproperties.com</p>
                  </div>
                </a>
                <a href="https://wa.me/15551234567" target="_blank" rel="noopener noreferrer" className="flex items-start gap-3 group">
                  <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center shrink-0 group-hover:bg-accent/20 transition-colors">
                    <Phone size={18} className="text-accent" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">WhatsApp</p>
                    <p className="text-muted-foreground text-sm group-hover:text-accent transition-colors">+1 (555) 123-4567</p>
                  </div>
                </a>
                <button onClick={() => document.querySelector('form')?.scrollIntoView({ behavior: 'smooth' })} className="flex items-start gap-3 group text-left w-full">
                  <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center shrink-0 group-hover:bg-accent/20 transition-colors">
                    <MapPin size={18} className="text-accent" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">{t("contact.sendMessage")}</p>
                    <p className="text-muted-foreground text-sm group-hover:text-accent transition-colors">{t("contact.scrollToForm")}</p>
                  </div>
                </button>
              </div>

              <div className="rounded-lg overflow-hidden border border-border h-64">
                <iframe
                  title="Location Map"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3153.835434509374!2d-122.4194154!3d37.7749295!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x80858064f0f1c1a1%3A0x7a81b3c5b3e5a06!2sSan+Francisco%2C+CA!5e0!3m2!1sen!2sus!4v1"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Contact;
