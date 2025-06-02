import React, { useEffect, useState } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import type { Notify as NotifyType } from "@/types/Notify";
import { getNotifications, addNotification, updateNotification, deleteNotification } from "@/api/notify";
import NotificationForm from "@/components/notification/NotificationForm";

const Notifications: React.FC = () => {
    const [notifications, setNotifications] = useState<NotifyType[]>([]);
    const [selectedNotification, setSelectedNotification] = useState<NotifyType | null>(null);
    const [isFormDialogOpen, setIsFormDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

    useEffect(() => {
        fetchNotifications();
    }, []);

    const fetchNotifications = async () => {
        try {
            const data = await getNotifications();
            setNotifications(data);
        } catch (error) {
            console.error("Error fetching notifications:", error);
        }
    };

    const handleAddNotification = () => {
        setSelectedNotification(null);
        setIsFormDialogOpen(true);
    };

    const handleEditNotification = (notification: NotifyType) => {
        setSelectedNotification(notification);
        setIsFormDialogOpen(true);
    };

    const handleDeleteNotification = (notification: NotifyType) => {
        setSelectedNotification(notification);
        setIsDeleteDialogOpen(true);
    };

    const handleSaveNotification = async (notificationData: NotifyType) => {
        try {
            if (selectedNotification && selectedNotification._id) {
                await updateNotification(selectedNotification._id, notificationData);
            } else {
                await addNotification(notificationData);
            }
            fetchNotifications();
            setIsFormDialogOpen(false);
        } catch (error) {
            console.error("Error saving notification:", error);
        }
    };

    const handleConfirmDelete = async () => {
        if (selectedNotification && selectedNotification._id) {
            try {
                await deleteNotification(selectedNotification._id);
                fetchNotifications();
                setIsDeleteDialogOpen(false);
            } catch (error) {
                console.error("Error deleting notification:", error);
            }
        }
    };

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Notification Management</h1>

            <Button onClick={handleAddNotification} className="mb-4">
                Add New Notification
            </Button>

            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Title</TableHead>
                        <TableHead>Body</TableHead>
                        <TableHead>Recipient</TableHead>
                        <TableHead>Read</TableHead>
                        <TableHead>Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {notifications.map((notification) => (
                        <TableRow key={notification._id}>
                            <TableCell>{notification.title}</TableCell>
                            <TableCell>{notification.body}</TableCell>
                            <TableCell>{notification.recipient || "All"}</TableCell>
                            <TableCell>{notification.read ? "Yes" : "No"}</TableCell>
                            <TableCell>
                                <Button variant="outline" size="sm" onClick={() => handleEditNotification(notification)}>
                                    Edit
                                </Button>
                                <Button variant="destructive" size="sm" className="ml-2" onClick={() => handleDeleteNotification(notification)}>
                                    Delete
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            {/* Notification Form Dialog (Add/Edit) */}
            <Dialog open={isFormDialogOpen} onOpenChange={setIsFormDialogOpen}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>{selectedNotification ? "Edit Notification" : "Add New Notification"}</DialogTitle>
                        <DialogDescription>
                            {selectedNotification ? "Make changes to the notification details here." : "Fill in the details for the new notification."}
                        </DialogDescription>
                    </DialogHeader>
                    <NotificationForm
                        initialData={selectedNotification}
                        onSubmit={handleSaveNotification}
                        onCancel={() => setIsFormDialogOpen(false)}
                    />
                </DialogContent>
            </Dialog>

            {/* Delete Notification Dialog */}
            <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Are you absolutely sure?</DialogTitle>
                        <DialogDescription>
                            This action cannot be undone. This will permanently delete the notification.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                            Cancel
                        </Button>
                        <Button variant="destructive" onClick={handleConfirmDelete}>
                            Delete
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default Notifications;