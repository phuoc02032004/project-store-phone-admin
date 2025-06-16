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
import OrderFilter from "@/components/order/OrderFilter";
import { toast } from "sonner"

const Order: React.FC = () => {
    const [orders, setOrders] = useState<OrderType[]>([]);
    const [filteredOrders, setFilteredOrders] = useState<OrderType[]>([]);
    const [selectedOrder, setSelectedOrder] = useState<OrderType | null>(null);
    const [isFormDialogOpen, setIsFormDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [isViewMode, setIsViewMode] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);
    const [filters, setFilters] = useState<{
        search: string;
        status: string;
        startDate: Date | undefined;
        endDate: Date | undefined;
    }>({
        search: "",
        status: "all",
        startDate: undefined,
        endDate: undefined,
    });

    useEffect(() => {
        fetchOrders();
    }, []); 

    useEffect(() => {
        applyFilters();
    }, [orders, filters]); 

    const fetchOrders = async () => {
        try {
            const data = await getOrders();
            setOrders(data.slice().reverse());
        } catch (error) {
            console.error("Error fetching orders:", error);
        }
    };

    const applyFilters = () => {
        let tempOrders = [...orders];

        if (filters.search) {
            tempOrders = tempOrders.filter(
                (order) =>
                    order._id.toLowerCase().includes(filters.search.toLowerCase()) ||
                    (order.user && (order.user as any).email && (order.user as any).email.toLowerCase().includes(filters.search.toLowerCase()))
            );
        }

        if (filters.status && filters.status !== "all") {
            tempOrders = tempOrders.filter(
                (order) => order.orderStatus && order.orderStatus.toLowerCase() === filters.status.toLowerCase()
            );
        }

        if (filters.startDate) {
            tempOrders = tempOrders.filter(
                (order) => new Date(order.createdAt) >= filters.startDate!
            );
        }

        if (filters.endDate) {
            tempOrders = tempOrders.filter(
                (order) => new Date(order.createdAt) <= filters.endDate!
            );
        }

        setFilteredOrders(tempOrders);
        setCurrentPage(1); 
    };

    const handleFilterChange = (newFilters: {
        search?: string;
        status?: string;
        startDate?: Date | undefined;
        endDate?: Date | undefined;
    }) => {
        setFilters((prevFilters) => ({ ...prevFilters, ...newFilters }));
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
                    items.push(<PaginationEllipsis key="ellipsis-start" className="!text-white" />);
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
                    items.push(<PaginationEllipsis key="ellipsis-end" className="!text-white" />);
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
            <div className="text-xl sm:text-2xl text-center font-bold text-white mb-4 p-2 bg-white/20  rounded-lg
            bg-gradient-to-tr from-[rgba(255,255,255,0.1)] to-[rgba(255,255,255,0)]
            backdrop-blur-[10px]
            border border-[rgba(255,255,255,0.18)]
            shadow-[0_8px_32px_0_rgba(0,0,0,0.37)]">Order Management</div>

            <OrderFilter onFilter={handleFilterChange} />

            <div className="overflow-x-auto sm:w-full w-[350px] rounded-lg shadow-2xl max-w-full mx-auto">
                <Table className="bg-white p-10 backdrop-blur-3xl shadow-2xl rounded-lg">
                    <TableHeader>
                        <TableRow>
                            <TableHead>Order ID</TableHead>
                            <TableHead>User</TableHead>
                            <TableHead>Total Amount</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Created At</TableHead>
                            <TableHead>Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredOrders.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map((order) => {
                            console.log("Order createdAt:", order.createdAt);
                            return (
                                <TableRow key={order._id}>
                                    <TableCell>{order._id}</TableCell>
                                    <TableCell>{order.user ? (order.user as any).email || (order.user as any)._id : "N/A"}</TableCell>
                                    <TableCell>{order.totalAmount.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</TableCell>
                                    <TableCell>{order.orderStatus}</TableCell>
                                    <TableCell>{new Date(order.createdAt).toLocaleString()}</TableCell>
                                    <TableCell>
                                        <Button variant="outline" className="!bg-[linear-gradient(to_right,#264D59,#041B2D)] !border-0 text-white" size="sm" onClick={() => handleViewDetails(order)}>
                                            View Details
                                        </Button>
                                        <Button variant="destructive" size="sm" className="ml-2 bg-[linear-gradient(to_right,#041B2D,#264D59)] !border-0 text-white" onClick={() => handleDeleteOrder(order)}>
                                            Delete
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </div>

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