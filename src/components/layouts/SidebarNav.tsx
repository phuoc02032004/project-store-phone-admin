import React from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { HomeIcon, SettingsIcon, UsersIcon, PackageIcon, ShoppingCartIcon, TagIcon, BellIcon, GiftIcon, DoorClosed  } from "lucide-react";
import { Separator } from "@/components/ui/separator";

const SidebarNav: React.FC = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
    window.location.reload();
  };

  return (
    <Sidebar className=" text-white min-h-screen backdrop-blur-3xl shadow-2xl">
      <SidebarHeader className="p-4">
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
            <UsersIcon className="mr-2 size-4" />
            Users
          </Button>
          <Button
            variant="ghost"
            className="justify-start text-white hover:bg-white/10"
            onClick={() => navigate("/product")}
          >
            <PackageIcon className="mr-2 size-4" />
            Products
          </Button>
          <Button
            variant="ghost"
            className="justify-start text-white hover:bg-white/10"
            onClick={() => navigate("/order")}
          >
            <ShoppingCartIcon className="mr-2 size-4" />
            Orders
          </Button>
          <Button
            variant="ghost"
            className="justify-start text-white hover:bg-white/10"
            onClick={() => navigate("/category")}
          >
            <TagIcon className="mr-2 size-4" />
            Categories
          </Button>
          <Button
            variant="ghost"
            className="justify-start text-white hover:bg-white/10"
            onClick={() => navigate("/notification")}
          >
            <BellIcon className="mr-2 size-4" />
            Notifications
          </Button>
          <Button
            variant="ghost"
            className="justify-start text-white hover:bg-white/10"
            onClick={() => navigate("/coupon")}
          >
            <GiftIcon className="mr-2 size-4" />
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
          <DoorClosed className="mr-2 size-4" />
          Logout
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
};

export default SidebarNav;
