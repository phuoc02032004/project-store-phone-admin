import React, { useEffect } from "react";
import { getOrderById } from "@/api/order";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { Order } from "@/types/Order";

interface OrderFormProps {
    orderId?: string | null; 
    onSubmit: (data: Order) => void; 
    onCancel: () => void;
    isViewMode?: boolean; 
    onUpdateStatus?: (id: string, status: string, payment: string) => void; 
}

const formSchema = z.object({
    user: z.string().optional(), 
    paymentMethod: z.string().min(1, { message: "Payment method is required." }),
    orderStatus: z.string().min(1, { message: "Order status is required." }),
    totalAmount: z.number().min(0, { message: "Total amount must be a positive number." }),
    notes: z.string().optional(),
    shippingAddress: z.array(z.object({
        street: z.string().min(1, { message: "Street is required." }),
        city: z.string().min(1, { message: "City is required." }),
        state: z.string().min(1, { message: "State is required." }),
        phone: z.string().min(1, { message: "Phone is required." }),
    })).min(1, { message: "Shipping address is required." }),
    items: z.array(z.object({
        product: z.string().min(1, { message: "Product ID is required." }),
        quantity: z.number().min(1, { message: "Quantity must be at least 1." }),
        price: z.number().min(0, { message: "Price must be a positive number." }),
    })).min(1, { message: "At least one item is required." }),
});

const OrderForm: React.FC<OrderFormProps> = ({ orderId, onSubmit, onCancel, isViewMode, onUpdateStatus }) => {
    const [orderData, setOrderData] = React.useState<Order | null>(null);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState<string | null>(null);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: orderData || { 
            user: "",
            paymentMethod: "",
            orderStatus: "Pending",
            totalAmount: 0,
            notes: "",
            shippingAddress: [{ street: "", city: "", state: "", phone: "" }],
            items: [{ product: "", quantity: 1, price: 0 }],
        },
    });

    const handleStatusUpdate = async () => {
        if (orderData && onUpdateStatus) { 
            const currentStatus = form.getValues("orderStatus");
            await onUpdateStatus(orderData._id, currentStatus, orderData.paymentMethod);
        }
    };

    useEffect(() => {
        const fetchOrder = async () => {
            if (!orderId) {
                setLoading(false);
                return;
            }
            setLoading(true);
            setError(null);
            try {
                const data = await getOrderById(orderId); 
                setOrderData(data);
                form.reset(data);
            } catch (err: any) {
                setError(err.message || "Failed to fetch order");
            } finally {
                setLoading(false);
            }
        };

        fetchOrder();
    }, [orderId, form]);

    const handleSubmit = (values: z.infer<typeof formSchema>) => {
        onSubmit(values as Order);
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    if (!orderData && orderId) {
        return <div>Order not found.</div>;
    }


    return (
        <Form {...form}>
            <form onSubmit={isViewMode ? undefined : form.handleSubmit(handleSubmit)} className="space-y-4">
                <div>
                    <h4 className="font-semibold">Order ID:</h4>
                    <p>{orderData?._id || "N/A"}</p>
                </div>
                <div>
                   <h4 className="font-semibold">User:</h4>
                   <p>
                     {orderData?.user
                       ? typeof orderData.user === 'object'
                         ? (orderData.user as any).name || (orderData.user as any).email || (orderData.user as any)._id || "N/A"
                         : orderData.user
                       : "N/A"}
                   </p>
                </div>

               <FormField
                   control={form.control}
                   name="paymentMethod"
                   render={({ field }) => (
                       <FormItem>
                           <FormLabel>Payment Method</FormLabel>
                           <Select onValueChange={field.onChange} value={field.value} disabled={!isViewMode}>
                               <FormControl>
                                   <SelectTrigger className="text-white">
                                       <SelectValue placeholder="Select a payment method"/>
                                   </SelectTrigger>
                               </FormControl>
                               <SelectContent>
                                   <SelectItem value="Credit Card">Credit Card</SelectItem>
                                   <SelectItem value="ZaloPay">ZaloPay</SelectItem>
                                   <SelectItem value="COD">Cash on Delivery</SelectItem>
                               </SelectContent>
                           </Select>
                           <FormMessage />
                       </FormItem>
                   )}
               />

               <FormField
                   control={form.control}
                   name="orderStatus"
                   render={({ field }) => (
                       <FormItem>
                           <FormLabel>Order Status</FormLabel>
                           <Select onValueChange={field.onChange} value={field.value} disabled={!isViewMode}>
                               <FormControl>
                                   <SelectTrigger className="text-white">
                                       <SelectValue placeholder="Select order status" />
                                   </SelectTrigger>
                               </FormControl>
                               <SelectContent>
                                   <SelectItem value="PENDING">Pending</SelectItem>
                                   <SelectItem value="PROCESSING">Processing</SelectItem>
                                   <SelectItem value="SHIPPED">Shipped</SelectItem>
                                   <SelectItem value="DELIVERED">Delivered</SelectItem>
                                   <SelectItem value="CANCELLED">Cancelled</SelectItem>
                               </SelectContent>
                           </Select>
                           <FormMessage />
                       </FormItem>
                   )}
               />

               <div>
                   <h4 className="font-semibold">Total Amount:</h4>
                   <p>{orderData?.totalAmount?.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' }) || "0 ₫"}</p>
               </div>
                <div>
                   <h4 className="font-semibold">Notes:</h4>
                   <p>{orderData?.notes || "N/A"}</p>
               </div>


               <h3 className="text-lg font-semibold mt-4">Shipping Address</h3>
               {(Array.isArray(orderData?.shippingAddress) ? orderData.shippingAddress : []).map((address, index) => (
                   <div key={index} className="grid grid-cols-2 gap-4 border p-4 rounded-md">
                       <div>
                           <h4 className="font-semibold">Street:</h4>
                           <p>{address.street || "N/A"}</p>
                       </div>
                       <div>
                           <h4 className="font-semibold">City:</h4>
                           <p>{address.city || "N/A"}</p>
                       </div>
                       <div>
                           <h4 className="font-semibold">State:</h4>
                           <p>{address.state || "N/A"}</p>
                       </div>
                       <div>
                           <h4 className="font-semibold">Phone:</h4>
                           <p>{address.phone || "N/A"}</p>
                       </div>
                   </div>
               ))}

               <h3 className="text-lg font-semibold mt-4">Order Items</h3>
               {(Array.isArray(orderData?.items) ? orderData.items : []).map((item, index) => (
                    <div key={index} className="grid grid-cols-3 gap-4 border p-4 rounded-md">
                       <div>
                           <h4 className="font-semibold">Product:</h4>
                           <p>{typeof item.product === 'object' 
                               ? (item.product as any).name || 'N/A'
                               : item.product || 'N/A'}
                           </p>
                       </div>
                       <div>
                           <h4 className="font-semibold">Quantity:</h4>
                           <p>{item.quantity || 0}</p>
                       </div>
                       <div>
                           <h4 className="font-semibold">Price:</h4>
                           <p>{(item.price || 0).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</p>
                       </div>
                   </div>
               ))}


               <div className="flex justify-end space-x-2">
                   <Button type="button" className="text-white" variant="outline" onClick={onCancel}>
                       Close
                   </Button>
                   {isViewMode && orderData && (
                        <Button type="button" onClick={handleStatusUpdate}>
                           Update Status
                       </Button>
                   )}
               </div>
           </form>
        </Form>
    );
};

export default OrderForm;