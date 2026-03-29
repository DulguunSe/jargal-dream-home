import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Layout from "@/components/Layout";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { useProperties, type Property } from "@/hooks/useProperties";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { LogOut, Trash2, Loader2, Plus, Pencil, MessageSquare } from "lucide-react";
import PropertyForm from "@/components/PropertyForm";
import { useLanguage } from "@/contexts/LanguageContext";

const Admin = () => {
  const { user, isAdmin, loading: authLoading, signIn, signOut } = useAuth();
  const { data: properties = [], isLoading: propsLoading } = useProperties();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingProperty, setEditingProperty] = useState<Property | null>(null);
  const [showMessages, setShowMessages] = useState(false);
  const [messages, setMessages] = useState<any[]>([]);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { t } = useLanguage();

  useEffect(() => {
    if (user && isAdmin && showMessages) {
      setMessagesLoading(true);
      supabase.from("contact_messages").select("*").order("created_at", { ascending: false })
        .then(({ data }) => { setMessages(data || []); setMessagesLoading(false); });
    }
  }, [user, isAdmin, showMessages]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginLoading(true);
    const { error } = await signIn(email, password);
    setLoginLoading(false);
    if (error) {
      toast({ title: "Invalid credentials", variant: "destructive" });
      navigate("/");
    } else {
      toast({ title: "Welcome back, Admin!" });
    }
  };

  const handleLogout = async () => {
    await signOut();
    navigate("/");
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("properties").delete().eq("id", id);
    if (error) {
      toast({ title: "Error deleting property", description: error.message, variant: "destructive" });
    } else {
      queryClient.invalidateQueries({ queryKey: ["properties"] });
      toast({ title: "Property removed" });
    }
  };

  const handleEdit = (property: Property) => {
    setEditingProperty(property);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingProperty(null);
  };

  if (authLoading) {
    return (
      <Layout>
        <div className="section-padding flex justify-center items-center min-h-[50vh]">
          <Loader2 className="animate-spin text-accent" size={32} />
        </div>
      </Layout>
    );
  }

  if (!user || !isAdmin) {
    return (
      <Layout>
        <section className="section-padding">
          <div className="max-w-md mx-auto">
            <div className="text-center mb-8">
              <h1 className="font-display text-3xl font-bold text-foreground">{t("admin.login")}</h1>
              <p className="text-muted-foreground mt-2">{t("admin.signInDesc")}</p>
            </div>
            {user && !isAdmin && (
              <div className="mb-4 p-3 bg-destructive/10 text-destructive rounded-lg text-sm text-center">
                {t("admin.noAccess")}
                <Button variant="link" className="text-destructive underline ml-1" onClick={handleLogout}>{t("admin.signOut")}</Button>
              </div>
            )}
            <form onSubmit={handleLogin} className="space-y-4 bg-card border border-border rounded-lg p-6">
              <div>
                <label className="text-sm font-medium text-foreground mb-1 block">{t("admin.email")}</label>
                <Input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="admin@example.com" type="email" />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-1 block">{t("admin.password")}</label>
                <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
              </div>
              <Button type="submit" className="w-full bg-accent text-accent-foreground hover:bg-accent/90" disabled={loginLoading}>
                {loginLoading ? <Loader2 className="animate-spin mr-2" size={16} /> : null}
                {t("admin.signIn")}
              </Button>
            </form>
          </div>
        </section>
      </Layout>
    );
  }

  return (
    <Layout>
      <section className="section-padding">
        <div className="container-wide">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="font-display text-3xl font-bold text-foreground">{t("admin.dashboard")}</h1>
              <p className="text-muted-foreground mt-1">{t("admin.manageListings")}</p>
            </div>
            <div className="flex gap-3">
              {!showForm && (
                <Button className="bg-accent text-accent-foreground hover:bg-accent/90" onClick={() => { setEditingProperty(null); setShowForm(true); setShowMessages(false); }}>
                  <Plus size={16} className="mr-2" /> {t("admin.addProperty")}
                </Button>
              )}
              <Button variant={showMessages ? "default" : "outline"} onClick={() => { setShowMessages(!showMessages); setShowForm(false); }}>
                <MessageSquare size={16} className="mr-2" /> {t("admin.messages")}
              </Button>
              <Button variant="outline" onClick={handleLogout}>
                <LogOut size={16} className="mr-2" /> {t("admin.logout")}
              </Button>
            </div>
          </div>

          {showForm && (
            <div className="mb-8">
              <PropertyForm property={editingProperty} onClose={handleCloseForm} />
            </div>
          )}

          {showMessages ? (
            messagesLoading ? (
              <div className="flex justify-center py-16"><Loader2 className="animate-spin text-accent" size={32} /></div>
            ) : messages.length === 0 ? (
              <p className="text-center text-muted-foreground py-16">{t("admin.noMessages")}</p>
            ) : (
              <div className="bg-card border border-border rounded-lg divide-y divide-border">
                {messages.map((m) => (
                  <div key={m.id} className="p-4">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium text-foreground">{m.name}</span>
                      <span className="text-xs text-muted-foreground">{new Date(m.created_at).toLocaleDateString()}</span>
                    </div>
                    <p className="text-sm text-accent">{m.email}</p>
                    <p className="text-sm text-muted-foreground mt-2">{m.message}</p>
                  </div>
                ))}
              </div>
            )
          ) : propsLoading ? (
            <div className="flex justify-center py-16"><Loader2 className="animate-spin text-accent" size={32} /></div>
          ) : (
            <div className="bg-card border border-border rounded-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border bg-secondary">
                      <th className="text-left p-4 font-semibold text-foreground">{t("admin.property")}</th>
                      <th className="text-left p-4 font-semibold text-foreground hidden sm:table-cell">{t("admin.location")}</th>
                      <th className="text-left p-4 font-semibold text-foreground hidden md:table-cell">{t("admin.type")}</th>
                      <th className="text-left p-4 font-semibold text-foreground">{t("admin.price")}</th>
                      <th className="text-right p-4 font-semibold text-foreground">{t("admin.actions")}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {properties.map((p) => (
                      <tr key={p.id} className="border-b border-border last:border-0">
                        <td className="p-4 text-foreground font-medium">
                          <div className="flex items-center gap-3">
                            <img src={p.image} alt={p.title} className="w-10 h-10 rounded object-cover hidden sm:block" />
                            <div>
                              <span>{p.title}</span>
                              {p.is_dubai && <span className="ml-2 text-xs bg-accent/10 text-accent px-2 py-0.5 rounded">Dubai</span>}
                            </div>
                          </div>
                        </td>
                        <td className="p-4 text-muted-foreground hidden sm:table-cell">{p.location}</td>
                        <td className="p-4 text-muted-foreground hidden md:table-cell">{p.type}</td>
                        <td className="p-4 text-accent font-semibold">${p.price.toLocaleString()}</td>
                        <td className="p-4 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <Button variant="ghost" size="sm" onClick={() => handleEdit(p)} className="text-foreground hover:text-accent">
                              <Pencil size={16} />
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => handleDelete(p.id)} className="text-destructive hover:text-destructive">
                              <Trash2 size={16} />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default Admin;
