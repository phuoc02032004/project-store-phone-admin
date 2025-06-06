import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import type { LucideIcon } from "lucide-react";
import {
  HomeIcon,
  SettingsIcon,
  UsersIcon,
  PackageIcon,
  ShoppingCartIcon,
  TagIcon,
  BellIcon,
  GiftIcon,
  DoorClosed,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

interface NavItem {
  path: string;
  label: string;
  icon: LucideIcon;
}

const mainNavItems: NavItem[] = [
  { path: "/user", label: "Users", icon: UsersIcon },
  { path: "/product", label: "Products", icon: PackageIcon },
  { path: "/order", label: "Orders", icon: ShoppingCartIcon },
  { path: "/category", label: "Categories", icon: TagIcon },
  { path: "/notification", label: "Notifications", icon: BellIcon },
  { path: "/coupon", label: "Coupons", icon: GiftIcon },
];

const settingsNavItem: NavItem = {
  path: "/settings",
  label: "Settings",
  icon: SettingsIcon,
};

const getNavLinkClass = (path: string, currentPathname: string): string => {
  const isActive = (path === "/" && currentPathname === "/") ||
                   (path !== "/" && currentPathname.startsWith(path));

  return cn(
    "w-full justify-start rounded-md px-3 py-2.5 text-sm font-medium transition-all duration-200 ease-in-out group",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 !text-white",
    isActive
      ? "bg-[linear-gradient(to_right,#43978D,#264D59)] text-white shadow-md hover:bg-sky-600/90"
      : "text-slate-300 hover:bg-slate-700/60 hover:text-white",
  );
};


const SidebarNav: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPathname = location.pathname;

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
    window.location.reload();
  };

  const NavLinkItem: React.FC<{ item: NavItem }> = ({ item }) => (
    <Button
      variant="ghost"
      className={getNavLinkClass(item.path, currentPathname)}
      onClick={() => navigate(item.path)}
      asChild
    >
      <Link to={item.path}>
        <item.icon className={cn("mr-3 size-5")} />
        {item.label}
      </Link>
    </Button>
  );

  return (
    <Sidebar className="flex flex-col bg-transparent text-white min-h-screen shadow-2xl border-r border-slate-700/50 ">
      <SidebarHeader className="p-4 border-b border-slate-700/50">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="p-2 bg-[linear-gradient(to_right,#43978D,#264D59)] rounded-lg group-hover:bg-sky-500 transition-colors !border-none">
            <HomeIcon className="size-6 text-white" />
          </div>
          <span className="text-2xl font-bold tracking-tight text-[#43978D]">Admin Panel</span>
        </Link>
      </SidebarHeader>

      <SidebarContent className="flex-grow p-4 space-y-1">
        {mainNavItems.map((item) => (
          <NavLinkItem key={item.path} item={item} />
        ))}

        <Separator className="my-5 bg-slate-700/50" />

        <NavLinkItem item={settingsNavItem} />
      </SidebarContent>

      <SidebarFooter className="p-4  mt-auto">
        <Button
          variant="ghost"
          className="w-full justify-start rounded-md px-3 py-2.5 text-sm font-medium hover:text-slate-300 hover:bg-red-600/80 text-white transition-colors duration-200 ease-in-out group bg-[linear-gradient(to_right,#43978D,#264D59)] !border-0"
          onClick={handleLogout}
        >
          <DoorClosed className="mr-3 size- group-hover:text-white " />
          Logout
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
};

export default SidebarNav;