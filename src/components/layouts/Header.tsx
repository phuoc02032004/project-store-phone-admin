import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { BellIcon, HomeIcon } from "lucide-react";
import { useNotifications } from "@/context/NotificationContext";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import NotificationTable from "@/components/notification/NotificationTable";

const Header: React.FC = () => {
  const { unreadCount, fetchNotifications, markAllNotificationsAsRead } = useNotifications();
  const [isDesktopNotificationOpen, setIsDesktopNotificationOpen] = useState(false);
  
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
    <header className="sticky top-0 z-30 p-3 flex h-14 items-center gap-4 border-b px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6 shadow-2xl backdrop:backdrop-blur-3xl">
      <SidebarTrigger className="text-white bg-[linear-gradient(to_right,#43978D,#264D59)]" />
      <h1 className="text-2xl text-white font-bold mr-auto">Admin Panel</h1>
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
    </header>
  );
};

export default Header;