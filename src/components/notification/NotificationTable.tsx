import React from "react";
import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";
import { useNotifications } from "@/context/NotificationContext";
import type { Notify } from "@/types/Notify";
import { Button } from "@/components/ui/button";

const NotificationTable: React.FC = () => {
  const { notifications, markNotificationAsRead, markAllNotificationsAsRead } = useNotifications();

  const [activeTab, setActiveTab] = React.useState<"all" | "unread">("all");

  const filteredNotifications =
    activeTab === "all" ? notifications : notifications.filter((n) => !n.read);

  return (
    <div className="w-full max-w-md mx-auto bg-card text-card-foreground shadow-lg rounded-lg overflow-hidden">
      <div className="text-3xl font-bold text-left pl-4 pt-3">Notifications</div>
      <div className="p-4 border-b border-border flex items-center justify-between">
        <div className="flex space-x-2">
          <Button
            variant={activeTab === "all" ? "default" : "ghost"}
            onClick={() => setActiveTab("all")}
            className="rounded-full px-4 py-2 text-sm text-white"
          >
            All
          </Button>
          <Button
            variant={activeTab === "unread" ? "default" : "ghost"}
            onClick={() => setActiveTab("unread")}
            className="rounded-full px-4 py-2 text-sm text-white"
          >
            Unread
          </Button>
          <Button
            variant="outline"
            onClick={markAllNotificationsAsRead}
            className="rounded-full px-4 py-2 text-sm text-white bg-white shadow-xl hover:text-white hover:bg-black hover:border-black transition-colors duration-500 font-semibold"
          >
            Mark All as Read
          </Button>
        </div>
      </div>

      <div className="max-h-[500px] overflow-y-auto custom-scrollbar">
        {filteredNotifications.length === 0 ? (
          <div className="flex items-center justify-center h-40">
            <p className="text-center text-muted-foreground py-4">
              You're all caught up! No new notifications.
            </p>
          </div>
        ) : (
          <div>
            {filteredNotifications.map((notification: Notify) => (
              <div
                key={notification._id}
                className={`
                  flex items-start p-3 cursor-pointer
                  transition-colors duration-200
                  ${
                    !notification.read
                      ? "bg-blue-50 dark:bg-blue-900/20"
                      : "hover:bg-muted/50"
                  }
                `}
                onClick={() => notification._id && markNotificationAsRead(notification._id.toString())}
              >
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gray-300 dark:bg-gray-700 mr-3 flex items-center justify-center text-gray-600 dark:text-gray-400 text-sm">
                  <img
                    src={notification.imageUrl || 'https://static.vecteezy.com/system/resources/previews/000/450/352/original/notification-vector-icon.jpg'}
                    alt="User Avatar"
                    className="w-full h-full rounded-full object-cover"
                  />
                </div>

                <div className="flex flex-col text-left">
                  <p
                    className={`text-sm ${
                      !notification.read
                        ? "font-semibold text-foreground"
                        : "text-muted-foreground"
                    }`} 
                  >
                    {notification.title}: 
                    <span className="font-normal"> {notification.body}</span>
                  </p>
                  <p
                    className={`text-xs mt-1 ${
                      !notification.read
                        ? "text-blue-600 dark:text-blue-400"
                        : "text-muted-foreground"
                    }`}
                  >
                    {notification.createdAt
                      ? formatDistanceToNow(new Date(notification.createdAt), {
                          addSuffix: true,
                          locale: vi,
                        })
                      : "N/A"}
                  </p>
                </div>

                {!notification.read && (
                  <div className="flex-shrink-0 w-2 h-2 bg-blue-500 rounded-full ml-3 mt-1"></div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationTable;
