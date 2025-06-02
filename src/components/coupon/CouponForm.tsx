import React, { useEffect } from "react";
import { useForm, type Resolver } from "react-hook-form";
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
import { Checkbox } from "@/components/ui/checkbox";
import type { Coupon } from "@/types/Coupon";

interface CouponFormProps {
    initialData?: Coupon | null;
    onSubmit: (data: Coupon) => void;
    onCancel: () => void;
}

const couponTypes = [
    "PERCENTAGE_DISCOUNT",
    "FIXED_AMOUNT_DISCOUNT",
    "FREE_SHIPPING",
    "BUY_X_GET_Y",
    "PRODUCT_GIFT",
] as const;

const formSchema = z.object({
    name: z.string().min(1, { message: "Coupon name is required." }),
    code: z.string().min(1, { message: "Coupon code is required." }),
    description: z.string().optional(),
    type: z.enum(couponTypes, { message: "Coupon type is required." }),
    value: z.number().min(0, { message: "Value must be a positive number." }),
    startDate: z.string().min(1, { message: "Start date is required." }), // Using string for date for now
    endDate: z.string().min(1, { message: "End date is required." }), // Using string for date for now
    isActive: z.boolean().default(true),
    usageLimit: z.number().nullable().optional(),
    usageLimitPerUser: z.number().min(0).default(1),
    minOrderValue: z.number().min(0).default(0),
    maxDiscountValue: z.number().nullable().optional(),
    applicableProducts: z.array(z.string()).optional(),
    applicableCategories: z.array(z.string()).optional(),
    excludedProducts: z.array(z.string()).optional(),
    buyQuantity: z.number().min(0).default(0),
    getQuantity: z.number().min(0).default(0),
    giftProductId: z.array(z.string()).optional(),
});

type FormValues = z.infer<typeof formSchema>;

const CouponForm: React.FC<CouponFormProps> = ({ initialData, onSubmit, onCancel }) => {
    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema) as Resolver<FormValues>,
        mode: 'onSubmit',
        defaultValues: initialData ? {
            ...initialData,
            startDate: initialData.startDate instanceof Date ? initialData.startDate.toISOString().split('T')[0] : initialData.startDate,
            endDate: initialData.endDate instanceof Date ? initialData.endDate.toISOString().split('T')[0] : initialData.endDate,
        } : {
            name: "",
            code: "",
            description: "",
            type: "PERCENTAGE_DISCOUNT",
            value: 0,
            startDate: new Date().toISOString().split('T')[0],
            endDate: new Date().toISOString().split('T')[0],
            isActive: true,
            usageLimit: null,
            usageLimitPerUser: 1,
            minOrderValue: 0,
            maxDiscountValue: null,
            applicableProducts: [],
            applicableCategories: [],
            excludedProducts: [],
            buyQuantity: 0,
            getQuantity: 0,
            giftProductId: [],
        },
    });

    useEffect(() => {
        if (initialData) {
            form.reset({
                ...initialData,
                startDate: initialData.startDate instanceof Date ? initialData.startDate.toISOString().split('T')[0] : initialData.startDate,
                endDate: initialData.endDate instanceof Date ? initialData.endDate.toISOString().split('T')[0] : initialData.endDate,
            });
        }
    }, [initialData, form]);

    const handleSubmit = (data: FormValues) => {
        onSubmit(data as Coupon);
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Coupon Name</FormLabel>
                            <FormControl>
                                <Input placeholder="Enter coupon name" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="code"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Coupon Code</FormLabel>
                            <FormControl>
                                <Input placeholder="Enter coupon code" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Description (Optional)</FormLabel>
                            <FormControl>
                                <Input placeholder="Enter description" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Coupon Type</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select coupon type" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    <SelectItem value="PERCENTAGE_DISCOUNT">Percentage Discount</SelectItem>
                                    <SelectItem value="FIXED_AMOUNT_DISCOUNT">Fixed Amount Discount</SelectItem>
                                    <SelectItem value="FREE_SHIPPING">Free Shipping</SelectItem>
                                    <SelectItem value="BUY_X_GET_Y">Buy X Get Y</SelectItem>
                                    <SelectItem value="PRODUCT_GIFT">Product Gift</SelectItem>
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="value"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Value</FormLabel>
                            <FormControl>
                                <Input type="number" placeholder="Enter value" {...field} onChange={e => field.onChange(parseFloat(e.target.value))} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="startDate"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Start Date</FormLabel>
                            <FormControl>
                                <Input type="date" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="endDate"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>End Date</FormLabel>
                            <FormControl>
                                <Input type="date" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="isActive"
                    render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow">
                            <FormControl>
                                <Checkbox
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                                <FormLabel>
                                    Is Active
                                </FormLabel>
                            </div>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="usageLimit"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Usage Limit (Optional)</FormLabel>
                            <FormControl>
                                <Input 
                                    type="number" 
                                    placeholder="Enter usage limit" 
                                    {...field} 
                                    value={field.value ?? ''} 
                                    onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : null)} 
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="usageLimitPerUser"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Usage Limit Per User</FormLabel>
                            <FormControl>
                                <Input type="number" placeholder="Enter usage limit per user" {...field} onChange={e => field.onChange(parseInt(e.target.value))} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="minOrderValue"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Minimum Order Value</FormLabel>
                            <FormControl>
                                <Input type="number" placeholder="Enter minimum order value" {...field} onChange={e => field.onChange(parseFloat(e.target.value))} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="maxDiscountValue"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Maximum Discount Value (Optional)</FormLabel>
                            <FormControl>
                                <Input 
                                    type="number" 
                                    placeholder="Enter maximum discount value" 
                                    {...field} 
                                    value={field.value ?? ''} 
                                    onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : null)} 
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                {/* Applicable Products, Categories, Excluded Products, Buy/Get Quantity, Gift Product ID can be added with multi-select or array inputs */}
                <div className="flex justify-end space-x-2">
                    <Button type="button" variant="outline" onClick={onCancel}>
                        Cancel
                    </Button>
                    <Button type="submit">
                        {initialData ? "Save Changes" : "Add Coupon"}
                    </Button>
                </div>
            </form>
        </Form>
    );
};

export default CouponForm;