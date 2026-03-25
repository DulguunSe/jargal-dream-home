import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import Layout from "@/components/Layout";
import { useToast } from "@/hooks/use-toast";
import { properties, Property } from "@/data/properties";
import { LogOut, Plus, Trash2, Edit } from "lucide-react";

const ADMIN_USER = "admin";
const ADMIN_PASS = "jargal2024";

const Admin = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [localProperties, setLocalProperties] = useState<Property[]>([...properties]);
  const [editing, setEditing] = useState<Property | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === ADMIN_USER && password === ADMIN_PASS) {
      setIsLoggedIn(true);
      toast({ title: "Welcome back, Admin!" });
    } else {
      toast({ title: "Invalid credentials", variant: "destructive" });
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUsername("");
    setPassword("");
    navigate("/");
  };

  const handleDelete = (id: string) => {
    setLocalProperties((prev) => prev.filter((p) => p.id !== id));
    toast({ title: "Property removed" });
  };

  if (!isLoggedIn) {
    return (
      <Layout>
        <section className="section-padding">
          <div className="max-w-md mx-auto">
            <div className="text-center mb-8">
              <h1 className="font-display text-3xl font-bold text-foreground">Admin Login</h1>
              <p className="text-muted-foreground mt-2">Sign in to manage properties</p>
            </div>
            <form onSubmit={handleLogin} className="space-y-4 bg-card border border-border rounded-lg p-6">
              <div>
                <label className="text-sm font-medium text-foreground mb-1 block">Username</label>
                <Input value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username" />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-1 block">Password</label>
                <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
              </div>
              <Button type="submit" className="w-full bg-accent text-accent-foreground hover:bg-accent/90">
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
                  {localProperties.map((p) => (
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

          <p className="text-muted-foreground text-xs mt-4">
            Note: Changes are stored in memory only. For persistent data management, connect a backend database.
          </p>
        </div>
      </section>
    </Layout>
  );
};

export default Admin;
