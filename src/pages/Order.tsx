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
import type { Order as OrderType } from "@/types/Order";
import { getOrders, updateOrderStatus, deleteOrder } from "@/api/order";
import OrderForm from "@/components/order/OrderForm";

const Order: React.FC = () => {
    const [orders, setOrders] = useState<OrderType[]>([]);
    const [selectedOrder, setSelectedOrder] = useState<OrderType | null>(null);
    const [isFormDialogOpen, setIsFormDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [isViewMode, setIsViewMode] = useState(false); // New state for view mode

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const data = await getOrders();
            setOrders(data);
        } catch (error) {
            console.error("Error fetching orders:", error);
        }
    };

    const handleViewDetails = (order: OrderType) => {
        setSelectedOrder(order);
        setIsViewMode(true); 
        setIsFormDialogOpen(true);
    };

    const handleDeleteOrder = (order: OrderType) => {
        setSelectedOrder(order);
        setIsDeleteDialogOpen(true);
    };

    const handleUpdateOrderStatus = async (id: string, status: string, payment: string) => {
        try {
            await updateOrderStatus(id, status, payment);
            console.log(id, status, payment);
            fetchOrders(); 
            setIsFormDialogOpen(false); 
        } catch (error) {
            console.error("Error updating order status:", error);
        }
    };

    const handleConfirmDelete = async () => {
        if (selectedOrder) {
            try {
                await deleteOrder(selectedOrder._id);
                fetchOrders();
                setIsDeleteDialogOpen(false);
            } catch (error) {
                console.error("Error deleting order:", error);
            }
        }
    };

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Order Management</h1>


            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Order ID</TableHead>
                        <TableHead>User</TableHead>
                        <TableHead>Total Amount</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {orders.map((order) => (
                        <TableRow key={order._id}>
                            <TableCell>{order._id}</TableCell>
                            <TableCell>{order.user ? (order.user as any).email || (order.user as any)._id : "N/A"}</TableCell>
                            <TableCell>{order.totalAmount.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</TableCell>
                            <TableCell>{order.orderStatus}</TableCell>
                            <TableCell>
                                <Button variant="outline" className="text-white" size="sm" onClick={() => handleViewDetails(order)}>
                                    View Details
                                </Button>
                                <Button variant="destructive" size="sm" className="ml-2" onClick={() => handleDeleteOrder(order)}>
                                    Delete
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            <Dialog open={isFormDialogOpen} onOpenChange={setIsFormDialogOpen}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Order Details</DialogTitle>
                        <DialogDescription>
                            View the details of the selected order.
                        </DialogDescription>
                    </DialogHeader>
                    <OrderForm
                        orderId={selectedOrder?._id || null}
                        onSubmit={() => {}} 
                        onCancel={() => {
                            setIsFormDialogOpen(false);
                            setIsViewMode(false); 
                        }}
                        isViewMode={isViewMode} 
                        onUpdateStatus={handleUpdateOrderStatus} 
                    />
                </DialogContent>
            </Dialog>

            {/* Delete Order Dialog */}
            <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Are you absolutely sure?</DialogTitle>
                        <DialogDescription>
                            This action cannot be undone. This will permanently delete the order.
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

export default Order;