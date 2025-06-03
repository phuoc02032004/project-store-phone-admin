import React from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { HomeIcon, SettingsIcon } from "lucide-react";
import { Separator } from "@/components/ui/separator";

const SidebarNav: React.FC = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
    window.location.reload();
  };

  return (
    <Sidebar className="bg-black text-white min-h-screen">
      <SidebarHeader className="p-4 border-b border-white/10">
        <Link to="/" className="flex items-center gap-2">
          <HomeIcon className="size-5 text-white" />
          <span className="text-lg font-semibold">Admin Dashboard</span>
        </Link>
      </SidebarHeader>

      <SidebarContent className="p-4">
        <div className="flex flex-col gap-2">
          <Button
            variant="ghost"
            className="justify-start text-white hover:bg-white/10"
            onClick={() => navigate("/user")}
          >
            Users
          </Button>
          <Button
            variant="ghost"
            className="justify-start text-white hover:bg-white/10"
            onClick={() => navigate("/product")}
          >
            Products
          </Button>
          <Button
            variant="ghost"
            className="justify-start text-white hover:bg-white/10"
            onClick={() => navigate("/order")}
          >
            Orders
          </Button>
          <Button
            variant="ghost"
            className="justify-start text-white hover:bg-white/10"
            onClick={() => navigate("/category")}
          >
            Categories
          </Button>
          <Button
            variant="ghost"
            className="justify-start text-white hover:bg-white/10"
            onClick={() => navigate("/notification")}
          >
            Notifications
          </Button>
          <Button
            variant="ghost"
            className="justify-start text-white hover:bg-white/10"
            onClick={() => navigate("/coupon")}
          >
            Coupons
          </Button>
        </div>

        <Separator className="my-4 bg-white/20" />

        <div className="flex flex-col gap-2">
          <Button
            variant="ghost"
            className="justify-start text-white hover:bg-white/10"
            onClick={() => navigate("/settings")}
          >
            <SettingsIcon className="mr-2 size-4" />
            Settings
          </Button>
        </div>
      </SidebarContent>

      <SidebarFooter className="p-4 border-t border-white/10">
        <Button
          variant="ghost"
          className="w-full justify-start text-white hover:bg-white/10"
          onClick={handleLogout}
        >
          Logout
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
};

export default SidebarNav;
