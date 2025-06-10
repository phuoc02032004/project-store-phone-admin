import React, { useState, useEffect } from "react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Menu, X, BellIcon  } from "lucide-react";
import { useNotifications } from "@/context/NotificationContext";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import NotificationTable from "@/components/notification/NotificationTable";

const Header: React.FC = () => {
  const { unreadCount, fetchNotifications } = useNotifications();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [, setIsDesktopNotificationOpen] = useState(false);
  
  const handleOpenNotification = () => {
    fetchNotifications();
  };

    useEffect(() => {
  }, [unreadCount]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      fetchNotifications();
    }, 20000); 

    return () => clearInterval(intervalId);
  }, [fetchNotifications]);

  return (
    <header className="sticky top-0 z-30 py-3 px-4 flex h-14 items-center gap-4 border-b sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:py-4 sm:px-6 shadow-2xl backdrop:backdrop-blur-3xl">
      <SidebarTrigger className="text-white bg-[linear-gradient(to_right,#43978D,#264D59)] !border-0" />
      <div className="text-2xl sm:text-2xl text-white font-bold mr-auto">Admin Panel</div>
      <div className="hidden md:block">
              <Popover onOpenChange={(open) => { setIsDesktopNotificationOpen(open); handleOpenNotification(); }}>
                <PopoverTrigger asChild>
                  <div className="relative inline-block cursor-pointer">
                    <BellIcon size={24}
                      className="w-5 h-5 text-white sm:w-6 sm:h-6 hover:text-gray-300 transition-all hover:scale-110"
                    />
                    {unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1.5
                           bg-red-500 text-white
                           text-xs font-semibold
                           w-4 h-4 rounded-full
                           flex items-center justify-center
                           pointer-events-none">
                        {unreadCount}
                      </span>
                    )}
                  </div>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0">
                  <NotificationTable />
                </PopoverContent>
              </Popover>
              </div>

        <div className="md:hidden flex items-center gap-2">
          <Sheet onOpenChange={(open) => { setIsMobileMenuOpen(open); handleOpenNotification(); }}>
            <SheetTrigger asChild>
              <button className="relative text-white focus:outline-none hover:text-gray-300 transition-colors">
                <BellIcon size={24} />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </button>
            </SheetTrigger>
            <SheetContent className="w-full sm:max-w-md">
              <SheetHeader>
                <SheetTitle>Notifications</SheetTitle>
                <SheetDescription>
                  Your latest notifications.
                </SheetDescription>
              </SheetHeader>
              <NotificationTable />
            </SheetContent>
          </Sheet>
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="text-white focus:outline-none hover:text-gray-300 transition-colors"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
    </header>
  );
};

export default Header;