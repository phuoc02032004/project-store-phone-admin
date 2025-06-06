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

    const handlePageChange = (page: number) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    const renderPaginationItems = () => {
        const pageItems: (number | 'ellipsis')[] = [];
        const maxPageLinks = 5; 
        const pageWindow = 2; 

        if (totalPages === 0) {
            return [];
        }

        if (totalPages <= maxPageLinks) {
            for (let i = 1; i <= totalPages; i++) {
                pageItems.push(i);
            }
        } else {
            pageItems.push(1);

            let rangeStart = Math.max(2, currentPage - pageWindow);
            let rangeEnd = Math.min(totalPages - 1, currentPage + pageWindow);

            if (currentPage - 1 <= pageWindow) { 
                rangeEnd = Math.min(totalPages - 1, maxPageLinks -1 ); 
            } else if (totalPages - currentPage <= pageWindow) {
                rangeStart = Math.max(2, totalPages - (maxPageLinks -1));
            }

            if (rangeStart > 2) {
                pageItems.push('ellipsis');
            }

            for (let i = rangeStart; i <= rangeEnd; i++) {
                pageItems.push(i);
            }

            if (rangeEnd < totalPages - 1) {
                pageItems.push('ellipsis');
            }

            if (totalPages > 1) { 
                 pageItems.push(totalPages);
            }
        }

        const finalItems: (number | 'ellipsis')[] = [];
        if (pageItems.length > 0) {
            finalItems.push(pageItems[0]);
            for (let i = 1; i < pageItems.length; i++) {
                if (!(pageItems[i] === 'ellipsis' && pageItems[i-1] === 'ellipsis') && pageItems[i] !== pageItems[i-1]) {
                    finalItems.push(pageItems[i]);
                }
            }
        }

        return finalItems;
    };


    return (
        <div className="p-4">
            <h1 className="text-2xl text-center font-bold text-white mb-4 p-2 bg-white/20 backdrop-blur-3xl shadow-2xl rounded-lg">Notification Management</h1>

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
                <Pagination className="mt-4">
                    <PaginationContent>
                        <PaginationItem>
                            <PaginationPrevious 
                                onClick={() => handlePageChange(currentPage - 1)} 
                                disabled={currentPage === 1} 
                                style={{ cursor: currentPage === 1 ? 'not-allowed' : 'pointer' }}
                            />
                        </PaginationItem>
                        {renderPaginationItems().map((item, index) => (
                            <PaginationItem key={index}>
                                {item === 'ellipsis' ? (
                                    <PaginationEllipsis />
                                ) : (
                                    <PaginationLink
                                        isActive={currentPage === item}
                                        onClick={() => handlePageChange(item as number)}
                                    >
                                        {item}
                                    </PaginationLink>
                                )}
                            </PaginationItem>
                        ))}
                        <PaginationItem>
                            <PaginationNext 
                                onClick={() => handlePageChange(currentPage + 1)} 
                                disabled={currentPage === totalPages} 
                                style={{ cursor: currentPage === totalPages ? 'not-allowed' : 'pointer' }}
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