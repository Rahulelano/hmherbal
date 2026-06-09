import { createFileRoute, Link, Outlet, useNavigate, useRouterState } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { apiLogin } from "@/lib/api";
import { toast } from "sonner";
import {
  LayoutDashboard,
  ShoppingBag,
  FolderTree,
  Sliders,
  LogOut,
  Globe,
  Lock,
  User,
  Menu,
  X
} from "lucide-react";

import { createContext, useContext } from "react";

const AdminAuthContext = createContext<string>("");

export const useAdminToken = () => useContext(AdminAuthContext);

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [{ title: "Admin Portal | H.M Herbal World" }],
  }),
  component: AdminLayout,
});

function AdminLayout() {
  const navigate = useNavigate();
  const routerState = useRouterState();
  const [token, setToken] = useState<string | null>(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const savedToken = localStorage.getItem("adminToken");
    if (savedToken) {
      setToken(savedToken);
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginLoading(true);
    try {
      const data = await apiLogin(username, password);
      localStorage.setItem("adminToken", data.token);
      localStorage.setItem("adminUsername", data.username);
      setToken(data.token);
      toast.success("Successfully logged into admin dashboard");
    } catch (error: any) {
      toast.error(error.message || "Invalid credentials");
    } finally {
      setLoginLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminUsername");
    setToken(null);
    toast.success("Logged out successfully");
    navigate({ to: "/" });
  };

  // If not authenticated, render Login Page
  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-hero px-6 py-12">
        <div className="w-full max-w-md bg-card border border-border rounded-3xl p-8 shadow-card glass relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-leaf" />
          
          <div className="text-center mb-8">
            <div className="h-14 w-14 rounded-full bg-primary-soft mx-auto flex items-center justify-center mb-4">
              <Lock className="h-6 w-6 text-primary" />
            </div>
            <h1 className="font-display text-3xl text-foreground">Admin Portal</h1>
            <p className="text-sm text-muted-foreground mt-2">Enter credentials to manage H.M Herbal World.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">Username</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  required
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full h-11 pl-11 pr-4 rounded-full bg-muted text-sm outline-none focus:ring-2 focus:ring-primary/30"
                  placeholder="admin"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  required
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full h-11 pl-11 pr-4 rounded-full bg-muted text-sm outline-none focus:ring-2 focus:ring-primary/30"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              disabled={loginLoading}
              type="submit"
              className="w-full h-12 mt-2 rounded-full bg-primary text-primary-foreground font-medium shadow-glow hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center"
            >
              {loginLoading ? "Verifying..." : "Access Dashboard"}
            </button>
          </form>

          <Link to="/" className="block text-center text-xs text-muted-foreground mt-6 hover:text-primary transition-colors">
            ← Return to Store
          </Link>
        </div>
      </div>
    );
  }

  // Sidebar navigation links
  const navLinks = [
    { to: "/admin", label: "Dashboard", Icon: LayoutDashboard, exact: true },
    { to: "/admin/products", label: "Products", Icon: ShoppingBag },
    { to: "/admin/categories", label: "Categories", Icon: FolderTree },
    { to: "/admin/slider", label: "Hero Slider", Icon: Sliders },
  ];

  const currentPath = routerState.location.pathname;

  return (
    <div className="min-h-screen bg-muted/40 flex flex-col md:flex-row">
      {/* Mobile Top Navbar */}
      <div className="md:hidden bg-card border-b border-border px-6 py-4 flex items-center justify-between sticky top-0 z-30">
        <Link to="/admin" className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-white font-bold text-sm">H</div>
          <span className="font-display text-lg text-primary">Admin Panel</span>
        </Link>
        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-1 rounded-lg hover:bg-muted transition-colors">
          {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Sidebar Navigation */}
      <aside className={`w-full md:w-64 bg-card border-r border-border flex flex-col z-20 transition-all duration-300 md:translate-x-0 ${mobileMenuOpen ? "fixed inset-y-0 left-0" : "hidden md:flex"}`}>
        <div className="p-6 border-b border-border hidden md:flex items-center gap-3">
          <div className="h-9 w-9 rounded-full bg-gradient-leaf flex items-center justify-center text-primary-foreground font-display text-base">H</div>
          <div>
            <div className="font-display font-bold text-primary">H.M Herbal</div>
            <div className="text-[10px] text-muted-foreground uppercase tracking-widest">Admin Control</div>
          </div>
        </div>

        {/* Links list */}
        <nav className="flex-1 p-4 space-y-1.5 mt-4">
          {navLinks.map((link) => {
            const isActive = link.exact 
              ? currentPath === link.to 
              : currentPath.startsWith(link.to) && link.to !== "/admin";
            
            return (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-full text-sm font-medium transition-all ${
                  isActive
                    ? "bg-primary text-primary-foreground shadow-glow"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                <link.Icon className="h-4 w-4" />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Footer controls */}
        <div className="p-4 border-t border-border space-y-1">
          <Link
            to="/"
            className="flex items-center gap-3 px-4 py-3 rounded-full text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-all"
          >
            <Globe className="h-4 w-4" />
            <span>Visit Storefront</span>
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-full text-sm text-destructive hover:bg-destructive/10 transition-all text-left"
          >
            <LogOut className="h-4 w-4" />
            <span>Logout Sessions</span>
          </button>
        </div>
      </aside>

      {/* Main panel workspace */}
      <main className="flex-1 p-6 md:p-8 overflow-x-hidden">
        {/* Render child routes with auth context */}
        <AdminAuthContext.Provider value={token || ""}>
          <Outlet />
        </AdminAuthContext.Provider>
      </main>
    </div>
  );
}
