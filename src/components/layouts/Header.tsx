import React from "react";
import { Link } from "react-router-dom";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { BellIcon, HomeIcon } from "lucide-react";

const Header: React.FC = () => {
  return (
    <header className="sticky top-0 z-30 p-3 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6 shadow-sm">
      <SidebarTrigger className="text-white" />
      <h1 className="text-2xl font-bold mr-auto">Admin Panel</h1>
      <Button variant="ghost" size="icon" className="ml-auto">
        <BellIcon className="size-5 text-white" />
        <span className="sr-only text-white">Notifications</span>
      </Button>
    </header>
  );
};

export default Header;