import React from "react";
import { Link } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { HomeIcon, SettingsIcon } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useNavigate } from "react-router-dom";

const SidebarNav: React.FC = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
    window.location.reload();
  }
  return (
    <Sidebar>
      <SidebarHeader>
        <Link to="/" className="flex items-center gap-2">
          <HomeIcon className="size-5" />
          <span className="text-lg font-semibold">Admin Dashboard</span>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <div className="flex flex-col gap-1 p-2">
                    <Button
            variant="outline"
            className="justify-start text-white"
            onClick={() => navigate("/user")}
          >
            Users
          </Button>
          <Button
            variant="outline"
            className="justify-start text-white"
            onClick={() => navigate("/product")}
          >
            Products
          </Button>
          <Button
            variant="outline"
            className="justify-start text-white"
            onClick={() => navigate("/order")}
          >
            Orders
          </Button>
          <Button
            variant="outline"
            className="justify-start text-white"
            onClick={() => navigate("/category")}
          >
            Categories
          </Button>
          
          <Button
            variant="outline"
            className="justify-start text-white"
            onClick={() => navigate("/notification")}
          >
            Notifications
          </Button>
          <Button
            variant="outline"
            className="justify-start text-white"
            onClick={() => navigate("/coupon")}
          >
            Coupons
          </Button>
          <Button
            variant="outline"
            className="justify-start text-white"
            onClick={() => navigate("/settings")}
          >
            Reviews
          </Button>
        </div>
        <Separator className="my-2" />
        <div className="flex flex-col gap-1 p-2">
          <Button
            variant="outline"
            className="justify-start text-white"
            onClick={() => navigate("/settings")}
          >
            <SettingsIcon className="mr-2 size-4" />
            Settings
          </Button>
        </div>
      </SidebarContent>
      <SidebarFooter className="p-2">
        <Button variant="outline" className="w-full justify-start text-white" onClick={handleLogout}>
          Logout
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
};

export default SidebarNav;
