import React, { useEffect } from "react";
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
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { Order } from "@/types/Order";

interface OrderFormProps {
    initialData?: Order | null;
    onSubmit: (data: Order) => void;
    onCancel: () => void;
}

const formSchema = z.object({
    user: z.string().optional(), // Assuming user ID is a string, optional for now
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

const OrderForm: React.FC<OrderFormProps> = ({ initialData, onSubmit, onCancel }) => {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: initialData || {
            user: "",
            paymentMethod: "",
            orderStatus: "Pending",
            totalAmount: 0,
            notes: "",
            shippingAddress: [{ street: "", city: "", state: "", phone: "" }],
            items: [{ product: "", quantity: 1, price: 0 }],
        },
    });

    useEffect(() => {
        if (initialData) {
            form.reset(initialData);
        }
    }, [initialData, form]);

    const handleSubmit = (values: z.infer<typeof formSchema>) => {
        onSubmit(values as Order);
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                <FormField
                    control={form.control}
                    name="user"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>User ID (Optional)</FormLabel>
                            <FormControl>
                                <Input placeholder="Enter user ID" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="paymentMethod"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Payment Method</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a payment method" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    <SelectItem value="Credit Card">Credit Card</SelectItem>
                                    <SelectItem value="PayPal">PayPal</SelectItem>
                                    <SelectItem value="Cash on Delivery">Cash on Delivery</SelectItem>
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
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select order status" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    <SelectItem value="Pending">Pending</SelectItem>
                                    <SelectItem value="Processing">Processing</SelectItem>
                                    <SelectItem value="Shipped">Shipped</SelectItem>
                                    <SelectItem value="Delivered">Delivered</SelectItem>
                                    <SelectItem value="Cancelled">Cancelled</SelectItem>
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="totalAmount"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Total Amount</FormLabel>
                            <FormControl>
                                <Input type="number" placeholder="Enter total amount" {...field} onChange={e => field.onChange(parseFloat(e.target.value))} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="notes"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Notes (Optional)</FormLabel>
                            <FormControl>
                                <Input placeholder="Add notes" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Shipping Address Fields (simplified for now, can be expanded) */}
                <h3 className="text-lg font-semibold mt-4">Shipping Address</h3>
                {form.watch("shippingAddress").map((address, index) => (
                    <div key={index} className="grid grid-cols-2 gap-4 border p-4 rounded-md">
                        <FormField
                            control={form.control}
                            name={`shippingAddress.${index}.street`}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Street</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Street" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name={`shippingAddress.${index}.city`}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>City</FormLabel>
                                    <FormControl>
                                        <Input placeholder="City" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name={`shippingAddress.${index}.state`}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>State</FormLabel>
                                    <FormControl>
                                        <Input placeholder="State" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name={`shippingAddress.${index}.phone`}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Phone</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Phone" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                ))}

                {/* Items Fields (simplified for now, can be expanded) */}
                <h3 className="text-lg font-semibold mt-4">Order Items</h3>
                {form.watch("items").map((item, index) => (
                    <div key={index} className="grid grid-cols-3 gap-4 border p-4 rounded-md">
                        <FormField
                            control={form.control}
                            name={`items.${index}.product`}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Product ID</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Product ID" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name={`items.${index}.quantity`}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Quantity</FormLabel>
                                    <FormControl>
                                        <Input type="number" placeholder="Quantity" {...field} onChange={e => field.onChange(parseInt(e.target.value))} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name={`items.${index}.price`}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Price</FormLabel>
                                    <FormControl>
                                        <Input type="number" placeholder="Price" {...field} onChange={e => field.onChange(parseFloat(e.target.value))} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                ))}

                <div className="flex justify-end space-x-2">
                    <Button type="button" variant="outline" onClick={onCancel}>
                        Cancel
                    </Button>
                    <Button type="submit">
                        {initialData ? "Save Changes" : "Add Order"}
                    </Button>
                </div>
            </form>
        </Form>
    );
};

export default OrderForm;