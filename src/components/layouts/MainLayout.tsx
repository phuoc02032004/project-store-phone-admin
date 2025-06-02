import React from "react";
import { Outlet } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import Header from "@/components/layouts/Header";
import SidebarNav from "@/components/layouts/SidebarNav";

const MainLayout: React.FC = () => {
  return (
    <SidebarProvider defaultOpen={true}>
      <SidebarNav />
      <div className="flex flex-1 flex-col">
        <Header />
        <main className="flex-1 p-4 lg:p-6 bg-gray-50 rounded-lg shadow-inner border border-gray-200">
          <Outlet />
        </main>
      </div>
    </SidebarProvider>
  );
};

export default MainLayout;