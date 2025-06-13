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
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,    
} from "@/components/ui/dialog";
import type { Notify as NotifyType } from "@/types/Notify";
import { getNotifications, addNotification, updateNotification, deleteNotification } from "@/api/notify";
import NotificationForm from "@/components/notification/NotificationForm";

const Notifications: React.FC = () => {
    const [notifications, setNotifications] = useState<NotifyType[]>([]);
    const [selectedNotification, setSelectedNotification] = useState<NotifyType | null>(null);
    const [isFormDialogOpen, setIsFormDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);

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
            setSelectedNotification(null); 
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
                setSelectedNotification(null); 
            } catch (error) {
                console.error("Error deleting notification:", error);
            }
        }
    };

    const totalPages = Math.ceil(notifications.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentNotifications = notifications.slice(startIndex, endIndex);

    const pageRange = 2;

    const renderPaginationItems = () => {
        const items = [];
        const startPage = Math.max(1, currentPage - pageRange);
        const endPage = Math.min(totalPages, currentPage + pageRange);

        if (startPage > 1) {
            items.push(
                <PaginationItem key={1}>
                    <PaginationLink
                        href="#"
                        onClick={(e) => {
                            e.preventDefault();
                            setCurrentPage(1);
                        }}
                        className="!text-white"
                    >
                        1
                    </PaginationLink>
                </PaginationItem>
            );
            if (startPage > 2) {
                items.push(
                    <PaginationEllipsis key="ellipsis-start" className="!text-white" />
                );
            }
        }

        for (let page = startPage; page <= endPage; page++) {
            items.push(
                <PaginationItem key={page}>
                    <PaginationLink
                        href="#"
                        isActive={page === currentPage}
                        onClick={(e) => {
                            e.preventDefault();
                            setCurrentPage(page);
                        }}
                        className={`!text-white ${
                            page === currentPage
                                ? "bg-gradient-to-tr from-[rgba(255,255,255,0.1)] to-[rgba(255,255,255,0)] backdrop-blur-[10px] rounded-[20px] border border-[rgba(255,255,255,0.18)] shadow-[0_8px_32px_0_rgba(0,0,0,0.37)]"
                                : ""
                        }`}
                    >
                        {page}
                    </PaginationLink>
                </PaginationItem>
            );
        }

        if (endPage < totalPages) {
            if (endPage < totalPages - 1) {
                items.push(
                    <PaginationEllipsis key="ellipsis-end" className="!text-white" />
                );
            }
            items.push(
                <PaginationItem key={totalPages}>
                    <PaginationLink
                        href="#"
                        onClick={(e) => {
                            e.preventDefault();
                            setCurrentPage(totalPages);
                        }}
                        className="!text-white"
                    >
                        {totalPages}
                    </PaginationLink>
                </PaginationItem>
            );
        }

        return items;
    };


    return (
        <div className="p-4">
            <h1 className="text-2xl text-center font-bold text-white mb-4 p-2 bg-white/20 rounded-lg
            bg-gradient-to-tr from-[rgba(255,255,255,0.1)] to-[rgba(255,255,255,0)]
            backdrop-blur-[10px]
            border border-[rgba(255,255,255,0.18)]
            shadow-[0_8px_32px_0_rgba(0,0,0,0.37)]">Notification Management</h1>

            <Button onClick={handleAddNotification} className="mb-4 bg-[linear-gradient(to_right,#264D59,#041B2D)] text-white">
                Add New Notification
            </Button>

            <Table className="bg-white p-10 backdrop-blur-3xl shadow-2xl rounded-lg">
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
                    {currentNotifications.length > 0 ? (
                        currentNotifications.map((notification) => (
                            <TableRow key={notification._id}>
                                <TableCell>{notification.title}</TableCell>
                                <TableCell>{notification.body}</TableCell>
                                <TableCell>{notification.recipient || "All"}</TableCell>
                                <TableCell>{notification.read ? "Yes" : "No"}</TableCell>
                                <TableCell>
                                    <Button variant="outline" className="text-white bg-[linear-gradient(to_right,#264D59,#041B2D)] !border-0 mr-2" size="sm" onClick={() => handleEditNotification(notification)}>
                                        Edit
                                    </Button>
                                    <Button variant="destructive" size="sm" className="bg-[linear-gradient(to_right,#041B2D,#264D59)] !border-0" onClick={() => handleDeleteNotification(notification)}>
                                        Delete
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={5} className="text-center">No notifications found.</TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>

            {totalPages > 1 && (
                <Pagination className="mt-4 bg-transparent">
                    <PaginationContent
                        className="p-2 rounded-2xl
                            bg-gradient-to-tr from-[rgba(255,255,255,0.1)] to-[rgba(255,255,255,0)]
                            backdrop-blur-[10px]
                            border border-[rgba(255,255,255,0.18)]
                            shadow-[0_8px_32px_0_rgba(0,0,0,0.37)]
                            "
                    >
                        <PaginationItem>
                            <PaginationPrevious
                                href="#"
                                onClick={(e) => {
                                    e.preventDefault();
                                    setCurrentPage((prev) => Math.max(1, prev - 1));
                                }}
                                className="!text-white"
                            />
                        </PaginationItem>
                        {renderPaginationItems()}
                        <PaginationItem>
                            <PaginationNext
                                href="#"
                                onClick={(e) => {
                                    e.preventDefault();
                                    setCurrentPage((prev) => Math.min(totalPages, prev + 1));
                                }}
                                className="!text-white"
                            />
                        </PaginationItem>
                    </PaginationContent>
                </Pagination>
            )}


            <Dialog open={isFormDialogOpen} onOpenChange={setIsFormDialogOpen}>
                <DialogContent className="[&>button]:text-white [&>button]:bg-[linear-gradient(to_right,#264D59,#041B2D)] [&>button]:!border-0">
                    <DialogHeader>
                        <DialogTitle>{selectedNotification ? "Edit Notification" : "Add New Notification"}</DialogTitle>
                        <DialogDescription>
                            {selectedNotification ? "Make changes to the notification details here." : "Fill in the details for the new notification."}
                        </DialogDescription>
                    </DialogHeader>
                    <NotificationForm
                        initialData={selectedNotification}
                        onSubmit={handleSaveNotification}
                        onCancel={() => {
                            setIsFormDialogOpen(false);
                            setSelectedNotification(null);
                        }}
                    />
                </DialogContent>
            </Dialog>

            <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <DialogContent className="[&>button]:text-white [&>button]:bg-[linear-gradient(to_right,#264D59,#041B2D)] [&>button]:!border-0">
                    <DialogHeader>
                        <DialogTitle>Are you absolutely sure?</DialogTitle>
                        <DialogDescription>
                            This action cannot be undone. This will permanently delete the notification.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => {
                            setIsDeleteDialogOpen(false);
                            setSelectedNotification(null); 
                        }}>
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