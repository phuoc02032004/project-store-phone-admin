import React from "react";
import { Outlet } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import Header from "@/components/layouts/Header";
import SidebarNav from "@/components/layouts/SidebarNav";

const MainLayout: React.FC = () => {
  return (
    <SidebarProvider defaultOpen={true} >
      <SidebarNav />
      <div className="flex flex-1 flex-col ">
        <Header />
        <main className="md:p-5 lg:p-6 shadow-xl backdrop:backdrop-blur-3xl">
          <Outlet />
        </main>
      </div>
    </SidebarProvider>
  );
};

export default MainLayout;