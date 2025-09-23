// src/components/admin/AdminSidebar.tsx
import { Link, useLocation } from "react-router-dom";
import { Users, Package, ShoppingCart, LayoutDashboard } from "lucide-react";
import { ReactElement } from "react";

interface NavLink {
  to: string;
  label: string;
  icon: ReactElement;
}

const AdminSidebar = () => {
  const { pathname } = useLocation();

  const links: NavLink[] = [
    { to: "/admin", label: "Dashboard", icon: <LayoutDashboard size={20} /> },
    { to: "/admin/users", label: "Users", icon: <Users size={20} /> },
    { to: "/admin/products", label: "Products", icon: <Package size={20} /> },
    { to: "/admin/orders", label: "Orders", icon: <ShoppingCart size={20} /> },
    
  ];

  return (
    <aside className="w-64 bg-gray-900 text-white min-h-screen p-4">
      <h2 className="text-2xl font-bold mb-6">Admin Panel</h2>
      <nav className="space-y-2">
        {links.map((link) => (
          <Link
            key={link.to}
            to={link.to}
            className={`flex items-center gap-3 p-2 rounded-md hover:bg-gray-700 transition ${
              pathname === link.to ? "bg-gray-700" : ""
            }`}
          >
            {link.icon}
            <span>{link.label}</span>
          </Link>
        ))}
      </nav>
    </aside>
  );
};

export default AdminSidebar;