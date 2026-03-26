import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import Layout from "@/components/Layout";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { useProperties } from "@/hooks/useProperties";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { LogOut, Trash2, Loader2 } from "lucide-react";

const Admin = () => {
  const { user, isAdmin, loading: authLoading, signIn, signOut } = useAuth();
  const { data: properties = [], isLoading: propsLoading } = useProperties();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginLoading(true);
    const { error } = await signIn(email, password);
    setLoginLoading(false);
    if (error) {
      toast({ title: "Invalid credentials", description: error.message, variant: "destructive" });
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
              <h1 className="font-display text-3xl font-bold text-foreground">Admin Login</h1>
              <p className="text-muted-foreground mt-2">Sign in to manage properties</p>
            </div>
            {user && !isAdmin && (
              <div className="mb-4 p-3 bg-destructive/10 text-destructive rounded-lg text-sm text-center">
                You don't have admin access. Please sign in with an admin account.
                <Button variant="link" className="text-destructive underline ml-1" onClick={handleLogout}>Sign out</Button>
              </div>
            )}
            <form onSubmit={handleLogin} className="space-y-4 bg-card border border-border rounded-lg p-6">
              <div>
                <label className="text-sm font-medium text-foreground mb-1 block">Email</label>
                <Input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="admin@example.com" type="email" />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-1 block">Password</label>
                <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
              </div>
              <Button type="submit" className="w-full bg-accent text-accent-foreground hover:bg-accent/90" disabled={loginLoading}>
                {loginLoading ? <Loader2 className="animate-spin mr-2" size={16} /> : null}
                Sign In
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
              <h1 className="font-display text-3xl font-bold text-foreground">Admin Dashboard</h1>
              <p className="text-muted-foreground mt-1">Manage your property listings</p>
            </div>
            <Button variant="outline" onClick={handleLogout}>
              <LogOut size={16} className="mr-2" /> Logout
            </Button>
          </div>

          {propsLoading ? (
            <div className="flex justify-center py-16"><Loader2 className="animate-spin text-accent" size={32} /></div>
          ) : (
            <div className="bg-card border border-border rounded-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border bg-secondary">
                      <th className="text-left p-4 font-semibold text-foreground">Property</th>
                      <th className="text-left p-4 font-semibold text-foreground hidden sm:table-cell">Location</th>
                      <th className="text-left p-4 font-semibold text-foreground hidden md:table-cell">Type</th>
                      <th className="text-left p-4 font-semibold text-foreground">Price</th>
                      <th className="text-right p-4 font-semibold text-foreground">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {properties.map((p) => (
                      <tr key={p.id} className="border-b border-border last:border-0">
                        <td className="p-4 text-foreground font-medium">{p.title}</td>
                        <td className="p-4 text-muted-foreground hidden sm:table-cell">{p.location}</td>
                        <td className="p-4 text-muted-foreground hidden md:table-cell">{p.type}</td>
                        <td className="p-4 text-accent font-semibold">${p.price.toLocaleString()}</td>
                        <td className="p-4 text-right">
                          <Button variant="ghost" size="sm" onClick={() => handleDelete(p.id)} className="text-destructive hover:text-destructive">
                            <Trash2 size={16} />
                          </Button>
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
