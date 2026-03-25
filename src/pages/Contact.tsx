import { useState } from "react";
import { Phone, Mail, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import Layout from "@/components/Layout";
import { useToast } from "@/hooks/use-toast";

const Contact = () => {
  const { toast } = useToast();
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      toast({ title: "Please fill in all fields", variant: "destructive" });
      return;
    }
    toast({ title: "Message sent!", description: "We'll get back to you shortly." });
    setForm({ name: "", email: "", message: "" });
  };

  return (
    <Layout>
      <section className="section-padding">
        <div className="container-wide">
          <div className="text-center mb-12">
            <p className="text-accent font-semibold text-sm uppercase tracking-wider">Get In Touch</p>
            <h1 className="font-display text-4xl font-bold text-foreground mt-2">Contact Us</h1>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-5xl mx-auto">
            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="text-sm font-medium text-foreground mb-1 block">Name</label>
                <Input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Your name"
                  maxLength={100}
                />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-1 block">Email</label>
                <Input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="you@example.com"
                  maxLength={255}
                />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-1 block">Message</label>
                <Textarea
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  placeholder="How can we help you?"
                  rows={5}
                  maxLength={1000}
                />
              </div>
              <Button type="submit" className="w-full bg-accent text-accent-foreground hover:bg-accent/90" size="lg">
                Send Message
              </Button>
            </form>

            {/* Info + Map */}
            <div className="space-y-8">
              <div className="space-y-4">
                {[
                  { icon: Phone, label: "Phone", value: "+1 (555) 123-4567" },
                  { icon: Mail, label: "Email", value: "info@jargalproperties.com" },
                  { icon: MapPin, label: "Address", value: "123 Real Estate Ave, Suite 100" },
                ].map(({ icon: Icon, label, value }) => (
                  <div key={label} className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center shrink-0">
                      <Icon size={18} className="text-accent" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">{label}</p>
                      <p className="text-muted-foreground text-sm">{value}</p>
                    </div>
                  </div>
                ))}
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
