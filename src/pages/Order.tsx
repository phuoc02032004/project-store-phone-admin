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
import { getOrders, addOrder, updateOrder, deleteOrder } from "@/api/order";
import OrderForm from "@/components/order/OrderForm";

const Order: React.FC = () => {
    const [orders, setOrders] = useState<OrderType[]>([]);
    const [selectedOrder, setSelectedOrder] = useState<OrderType | null>(null);
    const [isFormDialogOpen, setIsFormDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

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

    const handleAddOrder = () => {
        setSelectedOrder(null);
        setIsFormDialogOpen(true);
    };

    const handleEditOrder = (order: OrderType) => {
        setSelectedOrder(order);
        setIsFormDialogOpen(true);
    };

    const handleDeleteOrder = (order: OrderType) => {
        setSelectedOrder(order);
        setIsDeleteDialogOpen(true);
    };

    const handleSaveOrder = async (orderData: OrderType) => {
        try {
            if (selectedOrder) {
                await updateOrder(selectedOrder._id, orderData);
            } else {
                await addOrder(orderData);
            }
            fetchOrders();
            setIsFormDialogOpen(false);
        } catch (error) {
            console.error("Error saving order:", error);
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

            <Button onClick={handleAddOrder} className="mb-4">
                Add New Order
            </Button>

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
                            <TableCell>${order.totalAmount.toFixed(2)}</TableCell>
                            <TableCell>{order.orderStatus}</TableCell>
                            <TableCell>
                                <Button variant="outline" size="sm" onClick={() => handleEditOrder(order)}>
                                    Edit
                                </Button>
                                <Button variant="destructive" size="sm" className="ml-2" onClick={() => handleDeleteOrder(order)}>
                                    Delete
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            {/* Order Form Dialog (Add/Edit) */}
            <Dialog open={isFormDialogOpen} onOpenChange={setIsFormDialogOpen}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>{selectedOrder ? "Edit Order" : "Add New Order"}</DialogTitle>
                        <DialogDescription>
                            {selectedOrder ? "Make changes to the order details here." : "Fill in the details for the new order."}
                        </DialogDescription>
                    </DialogHeader>
                    <OrderForm
                        initialData={selectedOrder}
                        onSubmit={handleSaveOrder}
                        onCancel={() => setIsFormDialogOpen(false)}
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