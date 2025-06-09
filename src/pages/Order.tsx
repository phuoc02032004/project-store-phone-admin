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
} from "@/components/ui/dialog";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import type { Order as OrderType } from "@/types/Order";
import { getOrders, updateOrderStatus, deleteOrder } from "@/api/order";
import OrderForm from "@/components/order/OrderForm";
import { toast } from "sonner"

const Order: React.FC = () => {
    const [orders, setOrders] = useState<OrderType[]>([]);
    const [selectedOrder, setSelectedOrder] = useState<OrderType | null>(null);
    const [isFormDialogOpen, setIsFormDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [isViewMode, setIsViewMode] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);
    
    

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const data = await getOrders();
            setOrders(data.slice().reverse());
        } catch (error) {
            console.error("Error fetching orders:", error);
        }
    };

    const handleViewDetails = (order: OrderType) => {
        setSelectedOrder(order);
        setIsViewMode(true); 
        setIsFormDialogOpen(true);
        toast.success("Order details loaded successfully!");
    };

    const handleDeleteOrder = (order: OrderType) => {
        setSelectedOrder(order);
        setIsDeleteDialogOpen(true);
        toast.error("Are you sure you want to delete this order?");
    };

    const handleUpdateOrderStatus = async (id: string, status: string, payment: string) => {
        try {
            await updateOrderStatus(id, status, payment);
            console.log(id, status, payment);
            fetchOrders(); 
            setIsFormDialogOpen(false); 
            toast.success("Order status updated successfully!");
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
                toast.success("Order deleted successfully!");
            } catch (error) {
                console.error("Error deleting order:", error);
            }
        }
    };

    const totalPages = Math.ceil(orders.length / itemsPerPage);
        const pageRange = 2; 
    
        const renderPaginationItems = () => {
            const items = [];
            const startPage = Math.max(1, currentPage - pageRange);
            const endPage = Math.min(totalPages, currentPage + pageRange);
    
            if (startPage > 1) {
                items.push(
                    <PaginationItem key={1}>
                        <PaginationLink href="#" onClick={() => setCurrentPage(1)} className="text-black">1</PaginationLink>
                    </PaginationItem>
                );
                if (startPage > 2) {
                    items.push(<PaginationEllipsis key="ellipsis-start" className="text-black" />);
                }
            }
    
            for (let page = startPage; page <= endPage; page++) {
                items.push(
                    <PaginationItem key={page}>
                        <PaginationLink href="#" isActive={page === currentPage} onClick={() => setCurrentPage(page)} className="text-black">
                            {page}
                        </PaginationLink>
                    </PaginationItem>
                );
            }
    
            if (endPage < totalPages) {
                if (endPage < totalPages - 1) {
                    items.push(<PaginationEllipsis key="ellipsis-end" className="text-black" />);
                }
                items.push(
                    <PaginationItem key={totalPages}>
                        <PaginationLink href="#" onClick={() => setCurrentPage(totalPages)} className="text-black">{totalPages}</PaginationLink>
                    </PaginationItem>
                );
            }
    
            return items;
        };

    return (
        <div className="p-4">
            <div className="text-xl sm:text-2xl text-center font-bold text-white mb-4 p-2 bg-white/20 backdrop-blur-3xl shadow-2xl rounded-lg">Order Management</div>

            <div className="overflow-x-auto sm:w-full w-[350px] rounded-lg shadow-2xl max-w-full mx-auto">
                <Table className="bg-white p-10 backdrop-blur-3xl shadow-2xl rounded-lg">
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
                        {orders.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map((order) => (
                            <TableRow key={order._id}>
                                <TableCell>{order._id}</TableCell>
                                <TableCell>{order.user ? (order.user as any).email || (order.user as any)._id : "N/A"}</TableCell>
                                <TableCell>{order.totalAmount.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</TableCell>
                                <TableCell>{order.orderStatus}</TableCell>
                                <TableCell>
                                    <Button variant="outline" className="!bg-[linear-gradient(to_right,#264D59,#041B2D)] !border-0 text-white" size="sm" onClick={() => handleViewDetails(order)}>
                                        View Details
                                    </Button>
                                    <Button variant="destructive" size="sm" className="ml-2 bg-[linear-gradient(to_right,#041B2D,#264D59)] !border-0 text-white" onClick={() => handleDeleteOrder(order)}>
                                        Delete
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            <Pagination className="mt-4  bg-transparent">
                            <PaginationContent>
                                <PaginationItem>
                                    <PaginationPrevious href="#" onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))} className="" />
                                </PaginationItem>
                                {renderPaginationItems()}
                                <PaginationItem>
                                    <PaginationNext href="#" onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))} />
                                </PaginationItem>
                            </PaginationContent>
                        </Pagination>
                        
            <Dialog open={isFormDialogOpen} onOpenChange={setIsFormDialogOpen}>
                <DialogContent className="[&>button]:text-white [&>button]:bg-[linear-gradient(to_right,#264D59,#041B2D)] [&>button]:!border-0">
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

            <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <DialogContent className="[&>button]:text-white [&>button]:bg-[linear-gradient(to_right,#264D59,#041B2D)] [&>button]:!border-0">
                    <DialogHeader>
                        <DialogTitle>Are you absolutely sure?</DialogTitle>
                        <DialogDescription>
                            This action cannot be undone. This will permanently delete the order.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" className="text-white" onClick={() => setIsDeleteDialogOpen(false)}>
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